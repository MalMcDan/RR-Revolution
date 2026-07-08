import Link from "next/link";

const pillars = [
  "Scheduled rides only",
  "Manual rider approval",
  "Manual motorcycle approval",
  "Passenger waiver required",
  "Emergency contact required",
  "No instant dispatch"
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <header className="border-b border-white/10 bg-rr-black/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-rr-chrome/20 bg-rr-gunmetal shadow-glow">
              <span className="rr-metal-text font-serif text-2xl font-black tracking-[-0.12em]">RR</span>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.32em] text-rr-silver">Road Rider</div>
              <div className="text-xs text-rr-chrome/70">Curated motorcycle experiences</div>
            </div>
          </Link>
          <Link href="/dashboard" className="rounded-full border border-rr-purple/50 px-4 py-2 text-sm shadow-glow">Preview app</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-rr-purple/40 bg-rr-purple/10 px-4 py-2 text-sm text-rr-violet shadow-glow">Hampton Roads motorcycle experiences</div>
          <h1 className="rr-metal-text max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">Road Rider is scheduled motorcycle culture, not rideshare chaos.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-rr-chrome">Browse approved riders, choose the bike, pick the experience, acknowledge the safety requirements, and request a ride that gets accepted manually.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/rides" className="rounded-full bg-rr-purple px-6 py-3 text-center font-semibold shadow-glow">Request a ride</Link>
            <Link href="/riders" className="rounded-full border border-rr-chrome/30 px-6 py-3 text-center font-semibold text-rr-silver">Become a rider</Link>
          </div>
        </div>
        <div className="rr-card rounded-[2rem] p-8">
          <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Logo direction</div>
          <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-8 text-center">
            <div className="rr-metal-text font-serif text-8xl font-black tracking-[-0.18em]">RR</div>
            <div className="mx-auto mt-4 h-2 w-28 rounded-full bg-rr-purple shadow-glow" />
            <p className="mt-6 text-sm leading-6 text-rr-chrome">Two Gothic capital R letters forming a custom chopper, chrome wheels, ape-hanger handlebars, metal wings, and purple lightning exhaust.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((item) => <div key={item} className="rr-card rounded-3xl p-6 text-rr-silver">{item}</div>)}
        </div>
      </section>
    </main>
  );
}
