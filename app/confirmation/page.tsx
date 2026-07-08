import Link from "next/link";
import { PrototypeNav } from "../../components/prototype-nav";

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rr-card rounded-[2rem] p-8">
          <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Submitted</div>
          <h1 className="rr-metal-text mt-3 text-5xl font-black">Request saved for review</h1>
          <p className="mt-5 text-rr-chrome">Your prototype submission was saved to this browser. Open the admin dashboard to see it in the review queue.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/admin" className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Open admin dashboard</Link>
            <Link href="/prototype" className="rounded-full border border-white/10 px-6 py-3 text-rr-silver">Back to demo hub</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
