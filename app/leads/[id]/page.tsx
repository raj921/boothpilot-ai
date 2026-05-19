import { Mail, NotebookText, Phone, UserRound } from "lucide-react";
import { Panel, Shell, Stat, StatusPill, TopNav } from "@/components/ui";
import { getLead } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead: any = await getLead(id);
  const transcript = lead.transcript ?? lead.conversations?.[0]?.transcript ?? "";
  const followup = lead.followup ?? lead.followups?.[0] ?? {
    subject: lead.followupEmail ? "Generated follow-up" : "",
    emailBody: lead.followupEmail,
    crmNote: lead.crmNote,
    meetingAgenda: [],
    slackAlert: ""
  };
  const runs = lead.agentRuns ?? [];

  return (
    <Shell>
      <TopNav />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Panel title={lead.name} eyebrow={lead.priority}>
            <div className="space-y-3 text-sm text-fog/70">
              <p className="flex items-center gap-2"><UserRound className="h-4 w-4 text-signal" /> {lead.title} at {lead.prospectCompany}</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-signal" /> {lead.email}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-signal" /> {lead.phone}</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Stat label="Lead Score" value={`${lead.leadScore}/100`} />
              <Stat label="Estimated Value" value={formatCurrency(lead.estimatedValue ?? 0)} />
            </div>
          </Panel>
          <Panel title="Generated Follow-Up" eyebrow="Approval ready">
            <p className="font-semibold text-fog">{followup.subject}</p>
            <pre className="mt-4 whitespace-pre-wrap border border-line bg-ink/70 p-4 text-sm leading-6 text-fog/70">
              {followup.emailBody}
            </pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="bg-signal px-4 py-3 text-sm font-semibold text-ink">Approve Follow-Up</button>
              <button className="border border-line bg-field px-4 py-3 text-sm font-semibold text-fog">Copy Email</button>
              <button className="border border-line bg-field px-4 py-3 text-sm font-semibold text-fog">Simulate CRM Send</button>
            </div>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Conversation Summary" eyebrow="Speechmatics transcript">
            <p className="mb-4 text-sm leading-6 text-fog/65">{lead.summary ?? lead.conversations?.[0]?.summary}</p>
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap border border-line bg-ink/70 p-4 font-mono text-xs leading-6 text-fog/65">
              {transcript}
            </pre>
          </Panel>
          <Panel title="Agent Trace" eyebrow="Gemini workflow">
            <div className="space-y-3">
              {runs.map((run: any) => (
                <div key={run.id ?? run.agentName} className="flex items-center justify-between gap-3 border border-line bg-field/70 p-3">
                  <span className="text-sm text-fog/75">{run.agentName}</span>
                  <StatusPill>{run.status}</StatusPill>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="CRM Note" eyebrow="Sales handoff">
            <p className="flex gap-3 text-sm leading-6 text-fog/70">
              <NotebookText className="h-5 w-5 shrink-0 text-signal" />
              {followup.crmNote ?? lead.crmNote}
            </p>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}
