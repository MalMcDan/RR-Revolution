import Link from "next/link";
import { PrototypeNav } from "../../components/prototype-nav";

const actions = [
  {
    href: "/experiences",
    title: "Browse the marketplace",
    copy: "See sample experiences, motorcycles, and rider profiles."
  },
  {
    href: "/request",
    title: "Submit a passenger ride request",
    copy: "Walk through date, time, bike, experience, emergency contact, and safety acknowledgment."
  },
  {
    href: "/rider-application",
    title: "Submit a rider application",
    copy: "Capture rider details, endorsement status, insurance status, motorcycle details, and availability."
  },
  {
    href: "/admin",
    title: "Review in admin dashboard",
    copy: "See locally submitted passenger requests and rider applications."
  }
];

export default function PrototypePage() {
  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Client demo hub</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black md:text-7xl">Click through the Ride Relax MVP</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-rr-chrome">This prototype is intentionally simple and clickable. It uses browser storage so your client can test the flow without accounts, payments, maps, or a database yet.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {actions.map((action, index) => (
            <Link key={action.href} href={action.href} className="rr-card group rounded-[2rem] p-7 transition hover:-translate-y-1 hover:border-rr-purple/60">
              <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Step {index + 1}</div>
              <h2 className="mt-4 text-2xl font-black text-white">{action.title}</h2>
              <p className="mt-3 text-sm leading-6 text-rr-chrome">{action.copy}</p>
              <div className="mt-6 text-sm font-semibold text-rr-violet group-hover:text-white">Open →</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
