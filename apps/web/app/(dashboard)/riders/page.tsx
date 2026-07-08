import { AppShell } from "../../../components/layout/app-shell";

const riderCriteria = ["Manual application review", "Motorcycle endorsement", "Insurance document", "License document", "Years riding", "Availability calendar"];

export default function RidersPage() {
  return (
    <AppShell title="Approved riders" eyebrow="Curated rider marketplace">
      <div className="rr-card rounded-3xl p-8">
        <p className="text-rr-chrome">RR riders are intentionally approved by an administrator before appearing in the marketplace.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {riderCriteria.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm text-rr-silver">{item}</div>)}
        </div>
      </div>
    </AppShell>
  );
}
