import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: ReactNode }) {
  return <main className="relative mx-auto min-h-screen w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{children}</main>;
}

export function TopNav() {
  const links = [
    ["/setup", "Setup"],
    ["/capture", "Capture"],
    ["/command-center", "Agents"],
    ["/leads", "CRM"],
    ["/dashboard", "Revenue"]
  ];

  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-line/80 pb-4 md:flex-row md:items-center md:justify-between">
      <Link href="/" className="group inline-flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center border border-signal/30 bg-signal text-sm font-black text-ink shadow-glow">
          BP
        </span>
        <span>
          <span className="block text-lg font-semibold tracking-tight text-fog">BoothPilot AI</span>
          <span className="block font-mono text-xs uppercase tracking-[0.22em] text-fog/45">
            Vultr system of record
          </span>
        </span>
      </Link>
      <nav className="flex flex-wrap gap-2">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="focus-ring border border-line bg-field px-3 py-2 text-sm text-fog/75 transition hover:border-signal/60 hover:text-signal"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Panel({
  children,
  className,
  title,
  eyebrow
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  eyebrow?: string;
}) {
  return (
    <section className={cn("border border-line bg-panel/88 p-5 shadow-glow backdrop-blur", className)}>
      {(title || eyebrow) && (
        <div className="mb-4">
          {eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">{eyebrow}</p> : null}
          {title ? <h2 className="text-xl font-semibold text-fog">{title}</h2> : null}
        </div>
      )}
      {children}
    </section>
  );
}

export function ButtonLink({ href, children, intent = "primary" }: { href: string; children: ReactNode; intent?: "primary" | "ghost" }) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring inline-flex items-center justify-center px-4 py-3 text-sm font-semibold transition",
        intent === "primary"
          ? "bg-signal text-ink hover:bg-fog"
          : "border border-line bg-field text-fog hover:border-signal hover:text-signal"
      )}
    >
      {children}
    </Link>
  );
}

export function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border border-line bg-field/80 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog/45">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-fog">{value}</p>
      {note ? <p className="mt-1 text-sm text-fog/55">{note}</p> : null}
    </div>
  );
}

export function StatusPill({ children, tone = "signal" }: { children: ReactNode; tone?: "signal" | "copper" | "ice" }) {
  const tones = {
    signal: "border-signal/30 bg-signal/10 text-signal",
    copper: "border-copper/30 bg-copper/10 text-copper",
    ice: "border-ice/30 bg-ice/10 text-ice"
  };
  return <span className={cn("inline-flex border px-2 py-1 font-mono text-xs uppercase", tones[tone])}>{children}</span>;
}
