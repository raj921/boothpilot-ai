import { DashboardChart } from "./dashboard-chart";
import { Panel, Shell, Stat, TopNav } from "@/components/ui";
import { computeMetrics, demoLeads } from "@/lib/demo";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const metrics = computeMetrics();

  return (
    <Shell>
      <TopNav />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Conversations" value={String(metrics.totalConversations)} />
        <Stat label="Estimated Pipeline" value={formatCurrency(metrics.estimatedPipeline)} />
        <Stat label="Follow-Ups Generated" value={String(metrics.followupsGenerated)} />
        <Stat label="Lost Revenue Prevented" value={formatCurrency(metrics.lostRevenuePrevented)} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Panel title="Lead Quality" eyebrow="Lost Revenue Detector">
          <DashboardChart
            data={[
              { name: "Hot", value: metrics.hot },
              { name: "Warm", value: metrics.warm },
              { name: "Cold", value: metrics.cold }
            ]}
          />
        </Panel>
        <Panel title="Formula Transparency" eyebrow="Judge-proof ROI">
          <div className="space-y-4 text-sm leading-6 text-fog/70">
            <p className="border border-line bg-field p-4 font-mono text-signal">
              estimated_value = base_deal_size * lead_score_multiplier
            </p>
            <p className="border border-line bg-field p-4 font-mono text-copper">
              lost_revenue_prevented = sum(hot_leads_without_manual_followup_value)
            </p>
            <p>
              The big numbers are calculated from stored lead scores and deal-size assumptions, not hardcoded pitch text.
            </p>
          </div>
        </Panel>
      </div>
      <Panel className="mt-6" title="Top Revenue Signals" eyebrow="From transcript">
        <div className="grid gap-3 md:grid-cols-3">
          {demoLeads.map((lead) => (
            <div key={lead.id} className="border border-line bg-field p-4">
              <p className="font-semibold text-fog">{lead.prospectCompany}</p>
              <p className="mt-2 text-sm leading-6 text-fog/60">{lead.summary}</p>
            </div>
          ))}
        </div>
      </Panel>
    </Shell>
  );
}
