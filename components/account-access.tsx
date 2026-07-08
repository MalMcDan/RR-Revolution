"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createAccount, loginAccount, setSession, type PrototypeRole } from "../lib/prototype-auth";

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-rr-purple";
const labelClass = "text-sm font-medium text-rr-silver";

export function AccountAccess({ role, dashboardPath, title, description }: { role: PrototypeRole; dashboardPath: string; title: string; description: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "create">("login");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    if (mode === "create") {
      const name = String(form.get("name") || "");
      const phone = String(form.get("phone") || "");
      const result = createAccount(role, name, email, phone, password);
      setSession(role, result.account);
      router.push(dashboardPath);
      return;
    }
    const account = loginAccount(role, email, password);
    if (!account) {
      setError("No matching prototype account found. Create an account first, or check the email/password.");
      return;
    }
    router.push(dashboardPath);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">{role} access</div>
      <h1 className="rr-metal-text mt-3 text-5xl font-black">{title}</h1>
      <p className="mt-4 text-rr-chrome">{description}</p>
      <div className="mt-8 flex gap-3">
        <button onClick={() => setMode("login")} className={`rounded-full px-5 py-3 text-sm ${mode === "login" ? "bg-rr-purple text-white shadow-glow" : "border border-white/10 text-rr-silver"}`}>Log in</button>
        <button onClick={() => setMode("create")} className={`rounded-full px-5 py-3 text-sm ${mode === "create" ? "bg-rr-purple text-white shadow-glow" : "border border-white/10 text-rr-silver"}`}>Create account</button>
      </div>
      {error ? <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-100">{error}</div> : null}
      <form onSubmit={submit} className="rr-card mt-8 grid gap-5 rounded-[2rem] p-8">
        {mode === "create" ? <div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>Name<input name="name" required className={inputClass} /></label><label className={labelClass}>Phone<input name="phone" className={inputClass} /></label></div> : null}
        <label className={labelClass}>Email<input type="email" name="email" required className={inputClass} /></label>
        <label className={labelClass}>Password<input type="password" name="password" required className={inputClass} /></label>
        <button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">{mode === "create" ? "Create account" : "Log in"}</button>
      </form>
      <p className="mt-4 text-xs text-rr-chrome">Prototype note: accounts are stored only in this browser. Production will use Clerk/auth, role permissions, and a real database.</p>
    </div>
  );
}
