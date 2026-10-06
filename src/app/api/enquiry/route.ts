import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface EnquiryPayload {
  name: string;
  company: string;
  email: string;
  when?: string;
  message?: string;
  /** Honeypot — always empty for a real person. */
  website?: string;
}

const REQUIRED: (keyof EnquiryPayload)[] = ["name", "company", "email"];
const MAX_LENGTH = 5000;

function isValidPayload(body: unknown): body is EnquiryPayload {
  if (typeof body !== "object" || body === null) return false;
  const record = body as Record<string, unknown>;
  const allStrings = Object.values(record).every(
    (v) => typeof v === "string" && v.length <= MAX_LENGTH,
  );
  return (
    allStrings &&
    REQUIRED.every((f) => typeof record[f] === "string" && (record[f] as string).trim() !== "") &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email as string)
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // Honeypot: report success so bots don't learn to retry, but write nothing.
  const website = (body as Record<string, unknown> | null)?.website;
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
  }

  const data = {
    name: body.name.trim(),
    company: body.company.trim(),
    email: body.email.trim(),
    when: body.when?.trim() ?? "",
    message: body.message?.trim() ?? "",
  };

  const [airtable, notification] = await Promise.all([
    writeToAirtable(data),
    sendNotificationEmail(data),
  ]);
  await sendConfirmationEmail(data);

  // Either copy reaching Cam is enough; only fail when both did.
  if (!airtable.ok && !notification.ok) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

type Enquiry = Required<Omit<EnquiryPayload, "website">>;

/**
 * Writes to the same Enquiries table as the family site, tagged by Source.
 *
 * Airtable rejects the whole record if one field name is unknown, or if a
 * select value isn't an existing option and the token can't create it
 * ("Corporate event" / "Corporate website" aren't options until the first
 * successful typecast adds them). Rather than lose the enquiry, drop whichever
 * field it names and try again; if it still fails, fall back to the core
 * fields with everything folded into Message.
 */
async function writeToAirtable(data: Enquiry): Promise<{ ok: boolean }> {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;
  if (!token || !baseId || !tableId) {
    console.warn("Airtable env vars not configured — skipping Airtable write");
    return { ok: false };
  }

  const [firstName, ...rest] = data.name.split(/\s+/);
  const details = data.message || "(no details given)";

  const core: Record<string, string> = {
    "First Name": firstName,
    "Last Name": rest.join(" "),
    Email: data.email,
    Message: [
      `Company: ${data.company}`,
      `Date & location: ${data.when || "—"}`,
      "",
      details,
    ].join("\n"),
    "Date received": new Date().toISOString(),
  };
  let fields: Record<string, string> = {
    ...core,
    Message: details,
    Company: data.company,
    Location: data.when,
    "Session Type": "Corporate event",
    Source: "Corporate website",
  };

  const post = (f: Record<string, string>) =>
    fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ typecast: true, fields: f }),
    });

  try {
    for (let attempt = 0; attempt < 6; attempt++) {
      const res = await post(fields);
      if (res.ok) return { ok: true };

      const error = JSON.stringify(await res.json());
      const unknown = error.match(/Unknown field name: \\?"([^"\\]+)\\?"/)?.[1];
      if (unknown && unknown in fields && !(unknown in core)) {
        console.warn(`Airtable has no "${unknown}" field — retrying without it`);
        fields = { ...fields };
        delete fields[unknown];
        continue;
      }

      const badOption = error.includes("INVALID_MULTIPLE_CHOICE_OPTIONS")
        ? Object.keys(fields).find((k) => !(k in core) && error.includes(fields[k]))
        : undefined;
      if (badOption) {
        console.warn(`Airtable rejected "${fields[badOption]}" for ${badOption} — retrying without it`);
        fields = { ...fields };
        delete fields[badOption];
        continue;
      }

      console.error("Airtable error:", error);
      if (fields === core) return { ok: false };
      fields = core;
    }
    return { ok: false };
  } catch (err) {
    console.error("Airtable request failed:", err);
    return { ok: false };
  }
}

async function sendNotificationEmail(data: Enquiry): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured — skipping email notification");
    return { ok: false };
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: "Cam Velucci Photography <enquiries@camvelucci.com>",
      to: process.env.ENQUIRY_NOTIFY_EMAIL || "hello@camvelucci.com",
      replyTo: data.email,
      subject: `New corporate enquiry — ${data.name}, ${data.company}`,
      text: [
        `Name: ${data.name}`,
        `Company: ${data.company}`,
        `Email: ${data.email}`,
        `Date & location: ${data.when || "—"}`,
        "",
        "About the event:",
        data.message || "—",
      ].join("\n"),
    });
    if (error) {
      console.error("Resend error:", JSON.stringify(error));
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("Resend request failed:", err);
    return { ok: false };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const CONFIRMATION_LINES = [
  "Thanks for getting in touch about your event. Your enquiry has reached me.",
  "I'll come back with availability and a quote. If anything's changed in the meantime, just reply to this email.",
];

function confirmationHtml(firstName: string): string {
  const p = (text: string) =>
    `<p style="margin:0 0 20px; font-family:Georgia,'Times New Roman',serif; font-size:16px; line-height:1.7; color:#45423d;">${text}</p>`;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Thanks for your enquiry</title></head>
<body style="margin:0; padding:0; background-color:#f5f1ea;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f1ea;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#ffffff; border:1px solid #d9d3c8;">
        <tr><td style="background-color:#111111; padding:32px 36px;">
          <img src="https://corporate.camvelucci.com/email-logo.png" alt="Cam Velucci Photography" width="200" style="display:block; width:200px; height:auto;">
        </td></tr>
        <tr><td style="padding:40px 36px 20px;">
          ${p(`Hi ${escapeHtml(firstName)},`)}
          ${CONFIRMATION_LINES.map(p).join("\n          ")}
          ${p("Cam")}
        </td></tr>
        <tr><td style="padding:20px 36px; border-top:1px solid #d9d3c8;">
          <div style="font-family:Helvetica,Arial,sans-serif; font-size:10px; letter-spacing:0.24em; text-transform:uppercase; color:#6a6660;">London &middot; Hertfordshire &nbsp;&middot;&nbsp; <a href="mailto:hello@camvelucci.com" style="color:#b8401d; text-decoration:none;">hello@camvelucci.com</a></div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendConfirmationEmail(data: Enquiry): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false };

  const firstName = data.name.split(/\s+/)[0];
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: "Cam Velucci Photography <hello@camvelucci.com>",
      to: data.email,
      replyTo: "hello@camvelucci.com",
      subject: "Thanks for your enquiry",
      html: confirmationHtml(firstName),
      text: [`Hi ${firstName},`, "", ...CONFIRMATION_LINES.flatMap((l) => [l, ""]), "Cam"].join("\n"),
    });
    if (error) {
      console.error("Resend confirmation error:", JSON.stringify(error));
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("Resend confirmation request failed:", err);
    return { ok: false };
  }
}
