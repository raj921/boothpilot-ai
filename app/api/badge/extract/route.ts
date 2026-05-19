import { NextResponse } from "next/server";
import { extractBadgeIdentity } from "@/lib/ai";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => new FormData());
  const badge = form.get("badge");

  if (badge instanceof File) {
    const buffer = Buffer.from(await badge.arrayBuffer());
    const identity = await extractBadgeIdentity(buffer.toString("base64"), badge.type || "image/png");
    return NextResponse.json(identity);
  }

  const identity = await extractBadgeIdentity();
  return NextResponse.json(identity);
}
