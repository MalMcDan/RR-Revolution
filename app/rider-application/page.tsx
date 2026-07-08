"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PrototypeNav } from "../../components/prototype-nav";
import type { RiderApplication } from "../../lib/prototype-data";

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-rr-purple";
const labelClass = "text-sm font-medium text-rr-silver";

export default function RiderApplicationPage() {
  const router = useRouter();

  function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const application: RiderApplication = {
      riderName: String(form.get("riderName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      yearsRiding: String(form.get("yearsRiding") || ""),
      endorsement: String(form.get("endorsement") || ""),
      insurance: String(form.get("insurance") || ""),
      motorcycle: String(form.get("motorcycle") || ""),
      availability: String(form.get("availability") || ""),
      status: "Pending admin approval",
      createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem("rr_rider_applications") || "[]");
    localStorage.setItem("rr_rider_applications", JSON.stringify([application, ...existing]));
    router.push("/confirmation");
  }

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Rider flow</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Apply to ride with Ride Relax</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">This saves a prototype application locally for admin review. Later this becomes Clerk auth, document upload, and approval workflow.</p>
        <form onSubmit={submitApplication} className="rr-card mt-8 grid gap-5 rounded-[2rem] p-8">
          <div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>Rider name<input name="riderName" required className={inputClass} /></label><label className={labelClass}>Email<input type="email" name="email" required className={inputClass} /></label></div>
          <div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>Phone<input name="phone" required className={inputClass} /></label><label className={labelClass}>Years riding<input name="yearsRiding" required className={inputClass} placeholder="8 years" /></label></div>
          <div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>Motorcycle endorsement<select name="endorsement" required className={inputClass}><option>Current motorcycle endorsement</option><option>Permit only</option><option>Needs review</option></select></label><label className={labelClass}>Insurance<select name="insurance" required className={inputClass}><option>Current insurance</option><option>Will upload proof</option><option>Needs review</option></select></label></div>
          <label className={labelClass}>Motorcycle details<textarea name="motorcycle" required className={inputClass} rows={4} placeholder="Year, make, model, passenger comfort, backrest, pegs, luggage, Bluetooth..." /></label>
          <label className={labelClass}>Availability<textarea name="availability" required className={inputClass} rows={4} placeholder="Weekends, evenings, seasonal availability, preferred ride types..." /></label>
          <button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Submit rider application</button>
        </form>
      </section>
    </main>
  );
}
