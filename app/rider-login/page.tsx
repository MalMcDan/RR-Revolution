import { PrototypeNav } from "../../components/prototype-nav";
import { ClerkAccess } from "../../components/clerk-access";

export default function RiderLoginPage() {
  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <ClerkAccess roleLabel="Rider" dashboardPath="/rider-dashboard" title="Rider account" description="Create or log into a rider account to manage your profile, motorcycle garage, and passenger ride requests." />
    </main>
  );
}
