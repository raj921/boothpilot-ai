import { CheckCircle2, Clock3, Database, RadioTower } from "lucide-react";
import { Panel, Shell, StatusPill, TopNav } from "@/components/ui";
import { demoLead } from "@/lib/demo";

export default function CommandCenterPage() {
  return (
    <Shell>
      <TopNav />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Agent Command Center" eyebrow="Autonomous workflow">
          <div className="space-y-3">
            {demoLead.agentRuns.map((run, index) => (
              <div key={run.agentName} className="grid gap-4 border border-line bg-field/70 p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                <div className="grid h-10 w-10 place-items-center border border-signal/30 bg-signal/10 font-mono text-sm text-signal">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-fog">{run.agentName}</p>
                  <p className="mt-1 text-sm text-fog/55">{JSON.stringify(run.outputJson)}</p>
                </div>
                <StatusPill>{run.status}</StatusPill>
              </div>
            ))}
          </div>
        </Panel>
        <div className="grid gap-4">
          <Panel>
            <div className="flex gap-4">
              <RadioTower className="h-6 w-6 text-signal" />
              <div>
                <h2 className="font-semibold text-fog">Speechmatics is load-bearing</h2>
                <p className="mt-2 text-sm leading-6 text-fog/65">
                  Transcript text and speaker labels are the first input to every downstream Gemini agent.
                </p>
              </div>
            </div>
          </Panel>
          <Panel>
            <div className="flex gap-4">
              <Database className="h-6 w-6 text-copper" />
              <div>
                <h2 className="font-semibold text-fog">Vultr system of record</h2>
                <p className="mt-2 text-sm leading-6 text-fog/65">
                  Agent runs, transcripts, lead scores, and CRM workflow state persist in PostgreSQL on Vultr.
                </p>
              </div>
            </div>
          </Panel>
          <Panel>
            <div className="flex gap-4">
              <Clock3 className="h-6 w-6 text-ice" />
              <div>
                <h2 className="font-semibold text-fog">Demo fallback enabled</h2>
                <p className="mt-2 text-sm leading-6 text-fog/65">
                  If API keys are missing during recording, the demo still runs with realistic sample transcript and badge JSON.
                </p>
              </div>
            </div>
          </Panel>
          <Panel>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-signal" />
              <div>
                <h2 className="font-semibold text-fog">Compliance gate</h2>
                <p className="mt-2 text-sm leading-6 text-fog/65">
                  Consent checkbox is required before running the pipeline. The final follow-up remains approval-based.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}
