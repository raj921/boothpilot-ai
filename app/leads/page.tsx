import Link from "next/link";
import { Panel, Shell, StatusPill, TopNav } from "@/components/ui";
import { getLeads } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function LeadsPage() {
  const leads = await getLeads();
  const columns = ["Hot", "Warm", "Cold", "Follow-Up Ready", "Meeting Booked"];

  return (
    <Shell>
      <TopNav />
      <Panel title="Internal CRM Board" eyebrow="No external CRM required">
        <div className="grid gap-4 lg:grid-cols-5">
          {columns.map((column) => {
            const columnLeads = leads.filter((lead: any) => {
              if (column === "Follow-Up Ready") return lead.status === "follow_up_ready";
              if (column === "Meeting Booked") return lead.status === "meeting_booked";
              return lead.priority === column;
            });

            return (
              <div key={column} className="min-h-[420px] border border-line bg-ink/45 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-fog">{column}</h2>
                  <span className="font-mono text-xs text-fog/45">{columnLeads.length}</span>
                </div>
                <div className="space-y-3">
                  {columnLeads.map((lead: any) => (
                    <Link
                      key={lead.id}
                      href={`/leads/${lead.id}`}
                      className="block border border-line bg-field p-4 transition hover:border-signal/60"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-fog">{lead.name}</p>
                        <StatusPill tone={lead.priority === "Hot" ? "signal" : lead.priority === "Warm" ? "copper" : "ice"}>
                          {lead.leadScore}
                        </StatusPill>
                      </div>
                      <p className="mt-1 text-sm text-fog/60">{lead.prospectCompany}</p>
                      <p className="mt-3 text-sm leading-5 text-fog/50">{lead.summary ?? lead.crmNote}</p>
                      <p className="mt-3 font-mono text-xs text-signal">{formatCurrency(lead.estimatedValue ?? 0)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </Shell>
  );
}
