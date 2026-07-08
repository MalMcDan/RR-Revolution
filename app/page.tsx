import Link from "next/link";

const pillars = [
  "Scheduled rides only",
  "Manual rider approval",
  "Manual motorcycle approval",
  "Passenger waiver required",
  "Emergency contact required",
  "No instant dispatch"
];

const adminPreview = ["Ride requests", "Rider approvals", "Motorcycle inventory", "Waivers", "Incident reports", "Reviews"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <header className="border-b border-white/10 bg-rr-black/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rr-chrome/20 bg-black/60 p-1 shadow-glow">
              <img src="/brand/rr-monogram-visible.png" alt="Ride Relax RR monogram" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.32em] text-rr-silver">Ride Relax</div>
              <div className="text-xs text-rr-chrome/70">Curated motorcycle experiences</div>
            </div>
          </Link>
          <Link href="#preview" className="rounded-full border border-rr-purple/50 px-4 py-2 text-sm shadow-glow">Preview app</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit rounded-full border border-rr-purple/40 bg-rr-purple/10 px-4 py-2 text-sm text-rr-violet shadow-glow">Hampton Roads motorcycle experiences</div>
          <h1 className="rr-metal-text max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">Ride Relax: curated motorcycle experiences, built for trust.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-rr-chrome">RR stands for Ride Relax: a scheduled motorcycle experience marketplace where passengers browse approved riders, choose the bike, pick the experience, acknowledge safety requirements, and request a ride that gets accepted manually.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="#schedule" className="rounded-full bg-rr-purple px-6 py-3 text-center font-semibold shadow-glow">Request a ride</Link>
            <Link href="#rider" className="rounded-full border border-rr-chrome/30 px-6 py-3 text-center font-semibold text-rr-silver">Become a rider</Link>
          </div>
        </div>
        <div className="rr-card overflow-hidden rounded-[2rem] p-4">
          <img src="/brand/rr-primary-logo.svg" alt="Ride Relax motorcycle logo with chrome Gothic RR letters, wings, and purple lightning exhaust" className="w-full rounded-[1.5rem] object-cover shadow-chrome" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((item) => <div key={item} className="rr-card rounded-3xl p-6 text-rr-silver">{item}</div>)}
        </div>
      </section>

      <section id="preview" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rr-card rounded-[2rem] p-8">
          <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Next preview update</div>
          <h2 className="rr-metal-text mt-3 text-4xl font-black">Passenger, rider, and admin foundation</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-rr-chrome">This deploy keeps the visual build live while the MVP architecture grows behind it. The next functional layer is scheduled ride requests, rider applications, motorcycle inventory, safety waiver flow, and an admin approval queue.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {adminPreview.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm text-rr-silver">{item}</div>)}
          </div>
        </div>
      </section>
    </main>
  );
}
