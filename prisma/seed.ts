import { Prisma, PrismaClient } from "@prisma/client";
import { demoCompany, demoLead } from "../lib/demo";

const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.upsert({
    where: { id: demoCompany.id },
    update: {},
    create: {
      id: demoCompany.id,
      name: demoCompany.name,
      productDescription: demoCompany.productDescription,
      icp: demoCompany.icp,
      pricing: demoCompany.pricing,
      caseStudy: demoCompany.caseStudy,
      calendarLink: demoCompany.calendarLink,
      baseDealSize: demoCompany.baseDealSize
    }
  });

  await prisma.lead.upsert({
    where: { id: demoLead.id },
    update: {},
    create: {
      id: demoLead.id,
      companyId: company.id,
      name: demoLead.name,
      prospectCompany: demoLead.prospectCompany,
      title: demoLead.title,
      email: demoLead.email,
      phone: demoLead.phone,
      website: demoLead.website,
      leadScore: demoLead.leadScore,
      priority: demoLead.priority,
      status: demoLead.status,
      estimatedValue: demoLead.estimatedValue,
      qualificationJson: demoLead.qualification as Prisma.InputJsonValue,
      strategyJson: demoLead.strategy as Prisma.InputJsonValue,
      followupEmail: demoLead.followup.emailBody,
      crmNote: demoLead.followup.crmNote,
      conversations: {
        create: {
          transcript: demoLead.transcript,
          transcriptJson: demoLead.transcriptJson as Prisma.InputJsonValue,
          summary: demoLead.summary
        }
      },
      followups: {
        create: {
          subject: demoLead.followup.subject,
          emailBody: demoLead.followup.emailBody,
          crmNote: demoLead.followup.crmNote,
          meetingAgenda: demoLead.followup.meetingAgenda as Prisma.InputJsonValue,
          slackAlert: demoLead.followup.slackAlert
        }
      },
      agentRuns: {
        create: demoLead.agentRuns.map((run) => ({
          agentName: run.agentName,
          inputJson: run.inputJson as Prisma.InputJsonValue,
          outputJson: run.outputJson as Prisma.InputJsonValue,
          status: run.status,
          latencyMs: run.latencyMs
        }))
      }
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
