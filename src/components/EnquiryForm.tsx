"use client";

import Link from "next/link";
import { useState } from "react";

const label = "text-[10px] tracking-[0.24em] text-ink uppercase";
const field =
  "appearance-none rounded-none border-0 border-b border-ink bg-transparent py-2.5 font-serif text-lg font-light text-ink outline-none transition-colors focus:border-vermilion";

export function EnquiryForm({
  email,
  successHeading,
  successBody,
}: {
  email: string;
  successHeading: string;
  successBody: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="flex flex-col gap-5 border-t border-ink pt-8" role="status">
        <h3 className="text-[clamp(26px,2.6vw,34px)] leading-[1.15] text-ink">{successHeading}</h3>
        <p className="max-w-[48ch] font-serif text-lg leading-[1.7] font-light text-body">
          {successBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[30px]">
      <div className="flex flex-wrap gap-[30px]">
        <label className="flex flex-[1_1_220px] flex-col gap-2.5">
          <span className={label}>Name</span>
          <input name="name" required autoComplete="name" placeholder="Alex Smith" className={field} />
        </label>
        <label className="flex flex-[1_1_220px] flex-col gap-2.5">
          <span className={label}>Company</span>
          <input
            name="company"
            required
            autoComplete="organization"
            placeholder="Acme Ltd"
            className={field}
          />
        </label>
      </div>
      <label className="flex flex-col gap-2.5">
        <span className={label}>Email address</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="alex@acme.com"
          className={field}
        />
      </label>
      <label className="flex flex-col gap-2.5">
        <span className={label}>Date &amp; location</span>
        <input name="when" placeholder="12 November, Shoreditch" className={field} />
      </label>
      <label className="flex flex-col gap-2.5">
        <span className={label}>About the event</span>
        <textarea
          name="message"
          rows={3}
          placeholder="What's happening, roughly how many people, and the hours you need covered"
          className={`${field} resize-y leading-normal`}
        />
      </label>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state === "error" && (
        <p className="font-serif text-base font-light text-vermilion" role="alert">
          Something went wrong sending that. Please try again, or email me at{" "}
          <a href={`mailto:${email}`} className="underline underline-offset-3">
            {email}
          </a>
          .
        </p>
      )}

      <div className="flex flex-wrap items-center gap-5 pt-1.5">
        <button
          type="submit"
          disabled={state === "sending"}
          className="cursor-pointer rounded-none border-0 bg-ink px-[34px] py-[19px] font-sans text-[11px] tracking-[0.28em] text-paper uppercase transition-colors duration-[240ms] hover:bg-vermilion disabled:cursor-wait disabled:opacity-70"
        >
          {state === "sending" ? "Sending" : "Send enquiry"}
        </button>
        <p className="flex-[1_1_240px] font-serif text-sm leading-[1.6] font-light text-muted">
          Your details are only used to reply to your enquiry. See the{" "}
          <Link
            href="/privacy"
            className="text-ink underline underline-offset-3 transition-colors hover:text-vermilion"
          >
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
