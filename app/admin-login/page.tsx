import { PrototypeNav } from "../../components/prototype-nav";
import { AccountAccess } from "../../components/account-access";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <AccountAccess role="admin" dashboardPath="/admin" title="Admin employee account" description="Create or log into an employee admin account to review riders, documents, and ride requests." />
    </main>
  );
}
