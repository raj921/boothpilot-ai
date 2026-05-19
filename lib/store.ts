import { prisma } from "@/lib/prisma";
import { demoCompany, demoLead, demoLeads } from "@/lib/demo";
import { leadScoreMultiplier } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export async function getCompany() {
  if (!process.env.DATABASE_URL) return demoCompany;
  try {
    return (await prisma.company.findFirst()) ?? demoCompany;
  } catch {
    return demoCompany;
  }
}

export async function upsertCompany(data: typeof demoCompany) {
  if (!process.env.DATABASE_URL) return { ...demoCompany, ...data };
  try {
    return await prisma.company.upsert({
      where: { id: data.id ?? "demo_company" },
      update: data,
      create: data
    });
  } catch {
    return { ...demoCompany, ...data };
  }
}

export async function getLeads() {
  if (!process.env.DATABASE_URL) return demoLeads;
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { conversations: true, followups: true, agentRuns: true }
    });
    return leads.length ? leads : demoLeads;
  } catch {
    return demoLeads;
  }
}

export async function getLead(id: string) {
  if (!process.env.DATABASE_URL) return demoLeads.find((item) => item.id === id) ?? demoLead;
  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { conversations: true, followups: true, agentRuns: true }
    });
    return lead ?? demoLeads.find((item) => item.id === id) ?? demoLead;
  } catch {
    return demoLeads.find((item) => item.id === id) ?? demoLead;
  }
}

export async function createPipelineLead(input: {
  companyId: string;
  identity: Record<string, any>;
  transcript: string;
  transcriptJson: Record<string, any>;
  agents: Record<string, any>;
  baseDealSize: number;
}) {
  const leadScore = Number(input.agents.qualification?.lead_score ?? 91);
  const estimatedValue = Math.round(input.baseDealSize * leadScoreMultiplier(leadScore));
  const priority = input.agents.qualification?.priority ?? (leadScore >= 85 ? "Hot" : leadScore >= 65 ? "Warm" : "Cold");
  const strategy = { ...input.agents.strategy, estimated_deal_value: estimatedValue };
  const followup = input.agents.followup ?? demoLead.followup;

  if (!process.env.DATABASE_URL) {
    return {
      ...demoLead,
      id: `lead_${Date.now()}`,
      name: input.identity.name ?? demoLead.name,
      prospectCompany: input.identity.company ?? demoLead.prospectCompany,
      title: input.identity.title ?? demoLead.title,
      leadScore,
      priority,
      estimatedValue,
      transcript: input.transcript,
      transcriptJson: input.transcriptJson as any
    };
  }

  try {
    return await prisma.lead.create({
      data: {
        companyId: input.companyId,
        name: input.identity.name ?? demoLead.name,
        prospectCompany: input.identity.company ?? demoLead.prospectCompany,
        title: input.identity.title ?? demoLead.title,
        email: input.identity.email ?? demoLead.email,
        phone: input.identity.phone ?? demoLead.phone,
        website: input.identity.website ?? demoLead.website,
        leadScore,
        priority,
        status: "follow_up_ready",
        estimatedValue,
        qualificationJson: input.agents.qualification as Prisma.InputJsonValue,
        strategyJson: strategy as Prisma.InputJsonValue,
        followupEmail: followup.email_body ?? followup.emailBody ?? demoLead.followup.emailBody,
        crmNote: followup.crm_note ?? followup.crmNote ?? demoLead.followup.crmNote,
        conversations: {
          create: {
            transcript: input.transcript,
            transcriptJson: input.transcriptJson as Prisma.InputJsonValue,
            summary: input.agents.listener?.summary ?? demoLead.summary
          }
        },
        followups: {
          create: {
            subject: followup.subject ?? demoLead.followup.subject,
            emailBody: followup.email_body ?? followup.emailBody ?? demoLead.followup.emailBody,
            crmNote: followup.crm_note ?? followup.crmNote ?? demoLead.followup.crmNote,
            meetingAgenda: (followup.meeting_agenda ?? followup.meetingAgenda ?? demoLead.followup.meetingAgenda) as Prisma.InputJsonValue,
            slackAlert: followup.slack_alert ?? followup.slackAlert ?? demoLead.followup.slackAlert
          }
        },
        agentRuns: {
          create: [
            {
              agentName: "Speechmatics Transcription",
              inputJson: { source: "audio" },
              outputJson: input.transcriptJson as Prisma.InputJsonValue,
              latencyMs: 1200
            },
            {
              agentName: "Gemini Identity Agent",
              inputJson: { source: "badge" },
              outputJson: input.identity as Prisma.InputJsonValue,
              latencyMs: 980
            },
            {
              agentName: "Gemini Listener Agent",
              inputJson: { transcript: "Speechmatics transcript" },
              outputJson: input.agents.listener as Prisma.InputJsonValue,
              latencyMs: 1240
            },
            {
              agentName: "Gemini Qualification Agent",
              inputJson: { framework: "BANT" },
              outputJson: input.agents.qualification as Prisma.InputJsonValue,
              latencyMs: 1520
            },
            {
              agentName: "Gemini Strategy Agent",
              inputJson: { score: leadScore },
              outputJson: strategy as Prisma.InputJsonValue,
              latencyMs: 1080
            },
            {
              agentName: "Gemini Follow-Up Agent",
              inputJson: { action: strategy.recommended_action },
              outputJson: followup as Prisma.InputJsonValue,
              latencyMs: 1320
            }
          ]
        }
      },
      include: { conversations: true, followups: true, agentRuns: true }
    });
  } catch {
    return {
      ...demoLead,
      id: `lead_${Date.now()}`,
      name: input.identity.name ?? demoLead.name,
      prospectCompany: input.identity.company ?? demoLead.prospectCompany,
      title: input.identity.title ?? demoLead.title,
      leadScore,
      priority,
      estimatedValue,
      transcript: input.transcript,
      transcriptJson: input.transcriptJson as any
    };
  }
}
