import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const audio = form.get("audio");
  const file = audio instanceof File ? audio : null;

  return NextResponse.json({
    audioId: `audio_${Date.now()}`,
    name: file?.name ?? "demo-audio.wav",
    size: file?.size ?? 0,
    status: "uploaded"
  });
}
