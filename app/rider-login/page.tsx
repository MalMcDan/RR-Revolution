import { PrototypeNav } from "../../components/prototype-nav";
import { AccountAccess } from "../../components/account-access";

export default function RiderLoginPage() {
  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <AccountAccess role="rider" dashboardPath="/rider-dashboard" title="Rider account" description="Create or log into a rider account to manage your profile and respond to passenger ride requests." />
    </main>
  );
}
