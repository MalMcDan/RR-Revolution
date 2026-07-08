import { AppShell } from "../../../components/layout/app-shell";
import { DashboardCards } from "../../../components/rides/dashboard-cards";

export default function DashboardPage() {
  return (
    <AppShell title="Road Rider Dashboard" eyebrow="Milestone 1 shell">
      <DashboardCards />
    </AppShell>
  );
}
