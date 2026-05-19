import { NextResponse } from "next/server";
import { computeMetrics } from "@/lib/demo";
import { getLeads } from "@/lib/store";

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json(computeMetrics(leads as any));
}
