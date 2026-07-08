import { AppShell } from "../../../components/layout/app-shell";

const inventoryFields = ["Year", "Make", "Model", "Engine size", "Passenger comfort", "Category", "Color", "Backrest", "Foot pegs", "Luggage", "Bluetooth", "Heated seat", "Passenger intercom", "Special features"];

export default function MotorcyclesPage() {
  return (
    <AppShell title="Motorcycle inventory" eyebrow="Manual motorcycle approval">
      <div className="rr-card rounded-3xl p-8">
        <p className="text-rr-chrome">Each motorcycle has its own passenger-facing profile so riders can choose the bike experience they actually want.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {inventoryFields.map((field) => <span key={field} className="rounded-full border border-rr-purple/30 px-3 py-1 text-sm text-rr-silver">{field}</span>)}
        </div>
      </div>
    </AppShell>
  );
}
