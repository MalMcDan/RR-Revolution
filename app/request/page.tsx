"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PrototypeNav } from "../../components/prototype-nav";
import { experiences, motorcycles, type RideRequest } from "../../lib/prototype-data";

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-rr-purple";
const labelClass = "text-sm font-medium text-rr-silver";

export default function RequestPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const safetyAccepted = form.get("safetyAccepted") === "on";
    if (!safetyAccepted) {
      setError("Safety acknowledgment is required before submitting a ride request.");
      return;
    }
    const request: RideRequest = {
      passengerName: String(form.get("passengerName") || ""),
      phone: String(form.get("phone") || ""),
      emergencyContact: String(form.get("emergencyContact") || ""),
      experience: String(form.get("experience") || ""),
      motorcycle: String(form.get("motorcycle") || ""),
      date: String(form.get("date") || ""),
      time: String(form.get("time") || ""),
      duration: String(form.get("duration") || ""),
      safetyAccepted,
      status: "Submitted for rider review",
      createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem("rr_ride_requests") || "[]");
    localStorage.setItem("rr_ride_requests", JSON.stringify([request, ...existing]));
    router.push("/confirmation");
  }

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Passenger flow</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Request a scheduled ride</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">This saves a prototype request locally, then routes you to a confirmation page. The admin dashboard can review it immediately.</p>

        {error ? <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-100">{error}</div> : null}

        <form onSubmit={submitRequest} className="rr-card mt-8 grid gap-5 rounded-[2rem] p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className={labelClass}>Passenger name<input name="passengerName" required className={inputClass} placeholder="Passenger name" /></label>
            <label className={labelClass}>Phone<input name="phone" required className={inputClass} placeholder="Phone number" /></label>
          </div>
          <label className={labelClass}>Emergency contact<input name="emergencyContact" required className={inputClass} placeholder="Name and phone" /></label>
          <div className="grid gap-5 md:grid-cols-2">
            <label className={labelClass}>Experience<select name="experience" required className={inputClass}>{experiences.map((item) => <option key={item.id}>{item.title}</option>)}</select></label>
            <label className={labelClass}>Motorcycle<select name="motorcycle" required className={inputClass}>{motorcycles.map((bike) => <option key={bike.id}>{bike.name}</option>)}</select></label>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <label className={labelClass}>Date<input type="date" name="date" required className={inputClass} /></label>
            <label className={labelClass}>Time<input type="time" name="time" required className={inputClass} /></label>
            <label className={labelClass}>Duration<select name="duration" required className={inputClass}><option>90 minutes</option><option>2 hours</option><option>3 hours</option></select></label>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="font-semibold text-white">Safety acknowledgment</div>
            <p className="mt-2 text-sm leading-6 text-rr-chrome">Motorcycles involve inherent risk. Helmet required. Closed-toe shoes required. Long pants strongly recommended. No intoxication. Rider may refuse ride for safety.</p>
            <label className="mt-4 flex gap-3 text-sm text-rr-silver"><input type="checkbox" name="safetyAccepted" className="mt-1" />I understand and accept these requirements.</label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Submit ride request</button>
            <Link href="/admin" className="rounded-full border border-white/10 px-6 py-3 text-rr-silver">Open admin</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
