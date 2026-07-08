import { AppShell } from "../../../components/layout/app-shell";
import { RideRequestPanel } from "../../../components/rides/ride-request-panel";

export default function RidesPage() {
  return (
    <AppShell title="Schedule a ride" eyebrow="Passenger flow foundation">
      <RideRequestPanel />
    </AppShell>
  );
}
