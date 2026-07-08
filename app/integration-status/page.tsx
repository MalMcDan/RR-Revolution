import { PrototypeNav } from "../../components/prototype-nav";
import { getIntegrationStatus } from "../../lib/integration-status";

function StatusRow({ label, ok, note }: { label: string; ok: boolean; note: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-lg font-black text-white">{label}</div>
          <div className="mt-1 text-sm text-rr-chrome">{note}</div>
        </div>
        <div className={`rounded-full px-4 py-2 text-sm font-semibold ${ok ? "bg-emerald-500/15 text-emerald-100" : "bg-yellow-500/15 text-yellow-100"}`}>
          {ok ? "Detected" : "Missing"}
        </div>
      </div>
    </div>
  );
}

export default function IntegrationStatusPage() {
  const status = getIntegrationStatus();

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">System setup</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Integration status</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">
          This page checks whether Vercel can detect the required environment variables. It does not display secret values.
        </p>
        <div className="mt-8 grid gap-4">
          <StatusRow label="Clerk authentication" ok={status.clerkConfigured} note="Checks for Clerk publishable and server keys." />
          <StatusRow label="Supabase client" ok={status.supabaseConfigured} note="Checks for Supabase project URL and anon key." />
          <StatusRow label="Supabase admin access" ok={status.supabaseAdminConfigured} note="Checks for the private service role key on the server." />
          <StatusRow label="Database URL" ok={status.databaseConfigured} note="Checks for the direct Postgres connection string." />
          <StatusRow label="Storage bucket names" ok={status.storageBucketsConfigured} note="Checks for rider, motorcycle, and private document bucket names." />
        </div>
        <div className="mt-8 rounded-[2rem] border border-rr-purple/30 bg-rr-purple/10 p-6 text-sm leading-6 text-rr-chrome">
          If something says Missing, go back to Vercel Project Settings → Environments → Production → Environment Variables and confirm the key name is exact. Then redeploy without build cache.
        </div>
      </section>
    </main>
  );
}
