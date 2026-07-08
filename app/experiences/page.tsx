import Link from "next/link";
import { PrototypeNav } from "../../components/prototype-nav";
import { experiences, motorcycles, riders } from "../../lib/prototype-data";

export default function ExperiencesPage() {
  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Browse prototype</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Experiences, bikes, and riders</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">This page shows the client-facing marketplace shape before payments, maps, or live scheduling are wired in.</p>

        <h2 className="mt-12 text-2xl font-bold">Ride experiences</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {experiences.map((item) => (
            <article key={item.id} className="rr-card rounded-3xl p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{item.area}</div>
              <h3 className="mt-3 text-2xl font-black">{item.title}</h3>
              <p className="mt-2 text-sm text-rr-chrome">{item.description}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-rr-silver">
                <span className="rounded-full border border-white/10 px-3 py-1">{item.duration}</span>
                <span className="rounded-full border border-white/10 px-3 py-1">{item.price}</span>
                <span className="rounded-full border border-white/10 px-3 py-1">{item.vibe}</span>
              </div>
            </article>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold">Motorcycle inventory</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {motorcycles.map((bike) => (
            <article key={bike.id} className="rr-card rounded-3xl p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{bike.category}</div>
              <h3 className="mt-3 text-2xl font-black">{bike.name}</h3>
              <p className="mt-2 text-sm text-rr-chrome">{bike.comfort}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-rr-silver">
                {bike.features.map((feature) => <span key={feature} className="rounded-full border border-white/10 px-3 py-1">{feature}</span>)}
              </div>
            </article>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold">Rider previews</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {riders.map((rider) => (
            <article key={rider.id} className="rr-card rounded-3xl p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{rider.status}</div>
              <h3 className="mt-3 text-2xl font-black">{rider.name}</h3>
              <p className="mt-2 text-sm text-rr-chrome">{rider.years} · {rider.style}</p>
            </article>
          ))}
        </div>

        <Link href="/request" className="mt-10 inline-flex rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Start a ride request</Link>
      </section>
    </main>
  );
}
