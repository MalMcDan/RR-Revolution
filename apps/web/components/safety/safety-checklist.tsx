const requirements = [
  "Motorcycles involve inherent risk",
  "Ride at your own risk",
  "Helmet required",
  "Closed-toe shoes required",
  "Long pants strongly recommended",
  "No intoxication",
  "Driver may refuse ride",
  "Emergency contact required",
  "Waiver required"
];

export function SafetyChecklist() {
  return (
    <div className="rr-card rounded-3xl p-8">
      <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Safety first</div>
      <h2 className="mt-3 text-3xl font-black text-white">Passenger acknowledgment foundation</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {requirements.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm text-rr-silver">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
