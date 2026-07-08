import { AppShell } from "../../components/layout/app-shell";

const sections = ["Ride requests", "Scheduled rides", "Passengers", "Riders", "Motorcycles", "Applications", "Approvals", "Waivers", "Incident reports", "Reports", "Map view"];

export default function AdminPage() {
  return (
    <AppShell title="RR Admin" eyebrow="Approval operations">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section} className="rr-card rounded-2xl p-5">
            <div className="text-sm uppercase tracking-[0.24em] text-rr-purple">Admin</div>
            <h2 className="mt-2 text-xl font-semibold text-white">{section}</h2>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
