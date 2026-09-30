import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";

/**
 * Called by a Sanity webhook on publish. Every fetch is tagged with its
 * document type, so a published edit shows on the next visit instead of
 * waiting out the hourly revalidation.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Revalidation not configured" }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "No document type" }, { status: 400 });
    }

    revalidateTag(body._type, "max");
    return NextResponse.json({ revalidated: body._type });
  } catch (error) {
    console.error("Revalidation failed:", error);
    return NextResponse.json({ message: "Revalidation failed" }, { status: 500 });
  }
}
