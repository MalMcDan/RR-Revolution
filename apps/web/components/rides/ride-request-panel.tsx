const choices = ["Date", "Time", "Duration", "Ride type", "Motorcycle", "Preferred rider"];

export function RideRequestPanel() {
  return (
    <div className="rr-card rounded-3xl p-8">
      <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Scheduled rides only</div>
      <h2 className="mt-3 text-3xl font-black text-white">Request flow preview</h2>
      <p className="mt-4 max-w-3xl text-rr-chrome">Passengers submit a scheduled ride request. RR does not instantly dispatch, surge price, or automatically match riders in the MVP.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {choices.map((choice) => (
          <div key={choice} className="rounded-2xl border border-rr-purple/20 bg-black/25 p-4 text-rr-silver">
            {choice}
          </div>
        ))}
      </div>
    </div>
  );
}
