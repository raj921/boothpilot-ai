import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    sessionId: `live_${Date.now()}`,
    status: "ready",
    note: "Browser recording is captured client-side, then sent through /api/transcribe for Speechmatics processing."
  });
}
