import { PrototypeNav } from "../../components/prototype-nav";
import { ClerkAccess } from "../../components/clerk-access";

export default function UserLoginPage() {
  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <ClerkAccess roleLabel="Passenger" dashboardPath="/user-dashboard" title="Passenger account" description="Create or log into a passenger account to request rides and see your ride history." />
    </main>
  );
}
