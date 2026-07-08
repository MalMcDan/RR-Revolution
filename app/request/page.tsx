"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { PrototypeNav } from "../../components/prototype-nav";
import { experiences, motorcycles, type RideRequest } from "../../lib/prototype-data";

const inputClass = "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-rr-purple";

export default function RequestPage() {
  const [saved, setSaved] = useState(false);

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const request: RideRequest = {
      passengerName: String(form.get("passengerName") || ""),
      phone: String(form.get("phone") || ""),
      emergencyContact: String(form.get("emergencyContact") || ""),
      experience: String(form.get("experience") || ""),
      motorcycle: String(form.get("motorcycle") || ""),
      date: String(form.get("date") || ""),
      time: String(form.get("time") || ""),
      duration: String(form.get("duration") || ""),
      safetyAccepted: form.get("safetyAccepted") === "on",
      status: "Submitted for rider review",
      createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem("rr_ride_requests") || "[]");
    localStorage.setItem("rr_ride_requests", JSON.stringify([request, ...existing]));
    event.currentTarget.reset();
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Passenger prototype</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Request a scheduled ride</h1>
        <p className="mt-4 text-rr-chrome">This MVP flow submits a scheduled ride request for manual rider/admin review. No instant dispatch, no auto matching, no surge pricing.</p>

        {saved ? <div className="mt-6 rounded-2xl border border-rr-purple/40 bg-rr-purple/10 p-4 text-rr-silver">Ride request saved locally. Open the admin dashboard to review it.</div> : null}

        <form onSubmit={submitRequest} className="rr-card mt-8 grid gap-5 rounded-[2rem] p-8">
          <label>Passenger name<input name="passengerName" required className={inputClass} /></label>
          <label>Phone<input name="phone" required className={inputClass} /></label>
          <label>Emergency contact<input name="emergencyContact" required className={inputClass} /></label>
          <label>Experience<select name="experience" required className={inputClass}>{experiences.map((item) => <option key={item.id}>{item.title}</option>)}</select></label>
          <label>Motorcycle<select name="motorcycle" required className={inputClass}>{motorcycles.map((bike) => <option key={bike.id}>{bike.name}</option>)}</select></label>
          <div className="grid gap-5 md:grid-cols-3">
            <label>Date<input type="date" name="date" required className={inputClass} /></label>
            <label>Time<input type="time" name="time" required className={inputClass} /></label>
            <label>Duration<select name="duration" required className={inputClass}><option>90 minutes</option><option>2 hours</option><option>3 hours</option></select></label>
          </div>
          <label className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-chrome"><input type="checkbox" name="safetyAccepted" required className="mr-3" />I acknowledge motorcycle riding involves inherent risk, helmet is required, closed-toe shoes are required, no intoxication is allowed, and the rider may refuse the ride for safety reasons.</label>
          <button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Submit ride request</button>
        </form>
        <Link href="/admin" className="mt-6 inline-flex text-sm text-rr-purple">Review in admin dashboard →</Link>
      </section>
    </main>
  );
}
