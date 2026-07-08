"use client";

import { FormEvent, useState } from "react";
import { PrototypeNav } from "../../components/prototype-nav";
import type { RiderApplication } from "../../lib/prototype-data";

const inputClass = "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-rr-purple";

export default function RiderApplicationPage() {
  const [saved, setSaved] = useState(false);

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
    event.currentTarget.reset();
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Rider prototype</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Apply to ride with Ride Relax</h1>
        <p className="mt-4 text-rr-chrome">Riders are manually approved before they can appear in the marketplace or accept scheduled ride requests.</p>
        {saved ? <div className="mt-6 rounded-2xl border border-rr-purple/40 bg-rr-purple/10 p-4 text-rr-silver">Rider application saved locally. Open admin to review it.</div> : null}
        <form onSubmit={submitApplication} className="rr-card mt-8 grid gap-5 rounded-[2rem] p-8">
          <label>Rider name<input name="riderName" required className={inputClass} /></label>
          <div className="grid gap-5 md:grid-cols-2"><label>Email<input type="email" name="email" required className={inputClass} /></label><label>Phone<input name="phone" required className={inputClass} /></label></div>
          <label>Years riding<input name="yearsRiding" required className={inputClass} /></label>
          <label>Motorcycle endorsement status<select name="endorsement" required className={inputClass}><option>Current motorcycle endorsement</option><option>Permit only</option><option>Needs review</option></select></label>
          <label>Insurance status<select name="insurance" required className={inputClass}><option>Current insurance</option><option>Will upload proof</option><option>Needs review</option></select></label>
          <label>Motorcycle details<textarea name="motorcycle" required className={inputClass} rows={3} placeholder="Year, make, model, passenger comfort, backrest, pegs, luggage, Bluetooth..." /></label>
          <label>Availability<textarea name="availability" required className={inputClass} rows={3} placeholder="Weekends, evenings, seasonal availability, preferred ride types..." /></label>
          <button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Submit rider application</button>
        </form>
      </section>
    </main>
  );
}
