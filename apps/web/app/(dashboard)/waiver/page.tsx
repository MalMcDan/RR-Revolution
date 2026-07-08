import { AppShell } from "../../../components/layout/app-shell";
import { SafetyChecklist } from "../../../components/safety/safety-checklist";

export default function WaiverPage() {
  return (
    <AppShell title="Safety waiver" eyebrow="Passenger requirements">
      <SafetyChecklist />
    </AppShell>
  );
}
