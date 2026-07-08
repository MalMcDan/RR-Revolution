import { PrototypeNav } from "../../components/prototype-nav";
import { ClerkAccess } from "../../components/clerk-access";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <ClerkAccess roleLabel="Admin" dashboardPath="/admin" title="Admin employee account" description="Create or log into an employee admin account to review riders, documents, ride requests, and live operations." />
    </main>
  );
}
