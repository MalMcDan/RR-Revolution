import Link from "next/link";
import { PrototypeNav } from "../../components/prototype-nav";
import { experiences, motorcycleInventory, riderProfiles } from "../../lib/prototype-data";

export default function ExperiencesPage() {
  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Browse prototype</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Experiences, bikes, and riders</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">Customers can browse real motorcycle models, choose the bike experience they want, then select an approved rider matched to that bike.</p>

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
          {motorcycleInventory.map((bike) => (
            <article key={bike.id} className="rr-card overflow-hidden rounded-3xl">
              <div className={`h-44 bg-gradient-to-br ${bike.visualTheme} relative`}>
                <div className="absolute inset-x-6 bottom-6">
                  <div className="text-xs uppercase tracking-[0.28em] text-rr-violet">{bike.imageLabel}</div>
                  <div className="mt-2 text-3xl font-black">{bike.make}</div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{bike.category}</div>
                <h3 className="mt-3 text-2xl font-black">{bike.year} {bike.make} {bike.model}</h3>
                <p className="mt-2 text-sm text-rr-chrome">{bike.passengerFit}</p>
                <p className="mt-3 text-xs leading-5 text-rr-chrome">{bike.sourceNote}</p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs text-rr-silver">
                  {bike.highlights.map((feature) => <span key={feature} className="rounded-full border border-white/10 px-3 py-1">{feature}</span>)}
                </div>
                <a href={bike.vendorUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm text-rr-purple">Open vendor page →</a>
              </div>
            </article>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold">Approved rider pool</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {riderProfiles.map((rider) => (
            <article key={rider.id} className="rr-card rounded-3xl p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{rider.status} · {rider.rating} stars · {rider.completedRides} rides</div>
              <h3 className="mt-3 text-2xl font-black">{rider.name}</h3>
              <p className="mt-2 text-sm text-rr-chrome">{rider.years} · {rider.style}</p>
              <p className="mt-2 text-sm text-rr-silver">{rider.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-rr-silver">
                {rider.bikeIds.map((bikeId) => {
                  const bike = motorcycleInventory.find((item) => item.id === bikeId);
                  return <span key={bikeId} className="rounded-full border border-white/10 px-3 py-1">{bike?.make} {bike?.model}</span>;
                })}
              </div>
            </article>
          ))}
        </div>

        <Link href="/request" className="mt-10 inline-flex rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Start a ride request</Link>
      </section>
    </main>
  );
}
