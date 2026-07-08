"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PrototypeNav } from "../../components/prototype-nav";

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-rr-purple";
const labelClass = "text-sm font-medium text-rr-silver";

type RiderSession = {
  riderName: string;
  email: string;
  phone: string;
  ridingStyle: string;
  motorcycle: string;
  availability: string;
  loginAt: string;
};

export default function RiderLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"quick" | "profile">("quick");

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const session: RiderSession = {
      riderName: String(form.get("riderName") || "Approved Rider Preview"),
      email: String(form.get("email") || "rider@example.com"),
      phone: String(form.get("phone") || ""),
      ridingStyle: String(form.get("ridingStyle") || "Calm scenic rides"),
      motorcycle: String(form.get("motorcycle") || "Kawasaki Vulcan S 650"),
      availability: String(form.get("availability") || "Weekends and evenings"),
      loginAt: new Date().toISOString()
    };
    localStorage.setItem("rr_rider_session", JSON.stringify(session));
    router.push("/rider-dashboard");
  }

  function quickLogin() {
    const session: RiderSession = {
      riderName: "Approved Rider Preview",
      email: "rider@example.com",
      phone: "",
      ridingStyle: "Calm scenic rides",
      motorcycle: "Kawasaki Vulcan S 650",
      availability: "Weekends and evenings",
      loginAt: new Date().toISOString()
    };
    localStorage.setItem("rr_rider_session", JSON.stringify(session));
    router.push("/rider-dashboard");
  }

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Rider portal</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Rider login prototype</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">This models the future Clerk rider login. For now, use quick login or enter a prototype profile to access ride requests and update rider details.</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={quickLogin} className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Quick login as demo rider</button>
          <button onClick={() => setMode(mode === "quick" ? "profile" : "quick")} className="rounded-full border border-white/10 px-6 py-3 text-rr-silver">{mode === "quick" ? "Enter custom profile" : "Hide custom profile"}</button>
        </div>

        {mode === "profile" ? (
          <form onSubmit={login} className="rr-card mt-8 grid gap-5 rounded-[2rem] p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelClass}>Rider name<input name="riderName" required className={inputClass} placeholder="Rider name" /></label>
              <label className={labelClass}>Email<input type="email" name="email" required className={inputClass} placeholder="rider@email.com" /></label>
            </div>
            <label className={labelClass}>Phone<input name="phone" className={inputClass} placeholder="Optional phone" /></label>
            <label className={labelClass}>Riding style<input name="ridingStyle" className={inputClass} placeholder="Scenic, touring, relaxed passenger rides..." /></label>
            <label className={labelClass}>Primary motorcycle<input name="motorcycle" className={inputClass} placeholder="Year, make, model" /></label>
            <label className={labelClass}>Availability<textarea name="availability" rows={3} className={inputClass} placeholder="Weekends, evenings, preferred areas..." /></label>
            <button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Log in to rider dashboard</button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
