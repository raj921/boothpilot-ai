import { NextResponse } from "next/server";
import { transcribeWithSpeechmatics } from "@/lib/speechmatics";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => new FormData());
  const audio = form.get("audio");
  const file = audio instanceof File ? audio : undefined;
  const result = await transcribeWithSpeechmatics(file);
  return NextResponse.json(result);
}
