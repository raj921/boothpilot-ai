import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: { status: "follow_up_sent" }
    });
    await prisma.followup.updateMany({
      where: { leadId: id },
      data: { approved: true }
    });
    return NextResponse.json({ status: "approved", lead });
  } catch {
    return NextResponse.json({ status: "approved", leadId: id, simulated: true });
  }
}
