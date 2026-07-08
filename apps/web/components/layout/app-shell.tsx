import { SiteNav } from "./site-nav";

export function AppShell({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-rr-radial">
      <SiteNav />
      <section className="mx-auto max-w-7xl px-6 py-12">
        {eyebrow ? <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">{eyebrow}</div> : null}
        <h1 className="rr-metal-text mt-3 text-4xl font-black tracking-tight md:text-6xl">{title}</h1>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
