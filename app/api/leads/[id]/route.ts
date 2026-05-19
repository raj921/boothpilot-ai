import { NextResponse } from "next/server";
import { getLead } from "@/lib/store";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);
  return NextResponse.json(lead);
}
