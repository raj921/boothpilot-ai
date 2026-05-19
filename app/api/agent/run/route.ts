import { NextResponse } from "next/server";
import { extractBadgeIdentity, runLeadAgents } from "@/lib/ai";
import { transcribeWithSpeechmatics } from "@/lib/speechmatics";
import { getCompany, createPipelineLead } from "@/lib/store";

export async function POST(request: Request) {
  const form = await request.formData();
  const consent = form.get("consent") === "true";

  if (!consent) {
    return NextResponse.json({ error: "Visitor consent is required before processing." }, { status: 400 });
  }

  const audio = form.get("audio");
  const badge = form.get("badge");
  const audioFile = audio instanceof File ? audio : undefined;
  const company = await getCompany();

  const transcription = await transcribeWithSpeechmatics(audioFile);

  let identity;
  if (badge instanceof File) {
    const buffer = Buffer.from(await badge.arrayBuffer());
    identity = await extractBadgeIdentity(buffer.toString("base64"), badge.type || "image/png");
  } else {
    identity = await extractBadgeIdentity();
  }

  const agents = await runLeadAgents({
    company,
    identity,
    transcript: transcription.transcript,
    baseDealSize: company.baseDealSize
  });

  const lead: any = await createPipelineLead({
    companyId: company.id,
    identity,
    transcript: transcription.transcript,
    transcriptJson: transcription.transcriptJson,
    agents,
    baseDealSize: company.baseDealSize
  });

  const strategy = lead.strategyJson ?? lead.strategy ?? agents.strategy;

  return NextResponse.json({
    leadId: lead.id,
    status: "completed",
    leadScore: lead.leadScore,
    priority: lead.priority,
    recommendedAction: strategy?.recommended_action ?? "Book discovery call within 24 hours"
  });
}
