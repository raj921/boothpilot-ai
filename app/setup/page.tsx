import { Building2, Calendar, Target } from "lucide-react";
import { Panel, Shell, TopNav } from "@/components/ui";
import { demoCompany } from "@/lib/demo";

export default function SetupPage() {
  return (
    <Shell>
      <TopNav />
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Panel title="Exhibitor Profile" eyebrow="Company context">
          <p className="mb-5 text-sm leading-6 text-fog/65">
            This profile becomes the shared context for the Listener, Qualification, Strategy, and Follow-Up agents.
          </p>
          <form className="space-y-4">
            {[
              ["Company name", demoCompany.name],
              ["Product description", demoCompany.productDescription],
              ["Target customer profile", demoCompany.icp],
              ["Pricing range", demoCompany.pricing],
              ["Best case study", demoCompany.caseStudy],
              ["Calendar link", demoCompany.calendarLink]
            ].map(([label, value]) => (
              <label key={label} className="block">
                <span className="mb-2 block font-mono text-xs uppercase tracking-[0.18em] text-fog/45">{label}</span>
                <textarea
                  defaultValue={value}
                  rows={label === "Product description" || label === "Target customer profile" ? 3 : 1}
                  className="focus-ring w-full resize-none border border-line bg-field px-3 py-3 text-sm text-fog"
                />
              </label>
            ))}
            <button className="focus-ring w-full bg-signal px-4 py-3 text-sm font-semibold text-ink" type="button">
              Save Demo Profile
            </button>
          </form>
        </Panel>
        <div className="grid gap-4">
          {[
            [Building2, "Company Memory", "The app keeps one demo workspace so judges can see the product without signup friction."],
            [Target, "Qualification Method", "BANT is used for the MVP because it is easy to explain in a three-minute video."],
            [Calendar, "Next Action", "Calendar, Slack, email, and CRM sends are simulated as visible workflow events."]
          ].map(([Icon, title, text]) => (
            <Panel key={title as string}>
              <div className="flex gap-4">
                <Icon className="h-6 w-6 text-signal" />
                <div>
                  <h2 className="text-lg font-semibold text-fog">{title as string}</h2>
                  <p className="mt-2 text-sm leading-6 text-fog/65">{text as string}</p>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </Shell>
  );
}
