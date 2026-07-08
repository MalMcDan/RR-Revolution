import Link from "next/link";
import { SiteNav } from "./site-nav";
import { SafetyChecklist } from "../safety/safety-checklist";

const pillars = [
  { title: "Scheduled, not dispatched", copy: "Passengers choose a date, time, duration, ride type, motorcycle, and preferred rider. No instant matching." },
  { title: "Curated riders", copy: "Every rider and motorcycle is reviewed before they can accept experiences." },
  { title: "Premium motorcycle culture", copy: "Dark, clean, metal-forward design with chrome, gunmetal, and purple glow." }
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-rr-radial">
      <SiteNav />
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-rr-purple/40 bg-rr-purple/10 px-4 py-2 text-sm text-rr-violet shadow-glow">Hampton Roads motorcycle experiences</div>
          <h1 className="rr-metal-text max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">Road Rider is scheduled motorcycle culture, not rideshare chaos.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-rr-chrome">Browse approved riders, choose the bike, pick the experience, acknowledge the safety requirements, and request a ride that gets accepted manually.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/rides" className="rounded-full bg-rr-purple px-6 py-3 text-center font-semibold text-white shadow-glow">Request a ride</Link>
            <Link href="/riders" className="rounded-full border border-rr-chrome/30 px-6 py-3 text-center font-semibold text-rr-silver">Become a rider</Link>
          </div>
        </div>
        <div className="rr-card relative overflow-hidden rounded-[2rem] p-8">
          <div className="absolute inset-x-12 top-0 h-px bg-chrome-line" />
          <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Primary logo direction</div>
          <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-8 text-center">
            <div className="rr-metal-text font-serif text-8xl font-black tracking-[-0.18em]">RR</div>
            <div className="mx-auto mt-4 h-2 w-28 rounded-full bg-rr-purple shadow-glow" />
            <p className="mt-6 text-sm leading-6 text-rr-chrome">Primary art brief: two Gothic capital R letters forming a custom chopper, chrome wheels, ape-hanger handlebars, metal wings, and purple lightning exhaust.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rr-card rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-white">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-6 text-rr-chrome">{pillar.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24"><SafetyChecklist /></section>
    </main>
  );
}
