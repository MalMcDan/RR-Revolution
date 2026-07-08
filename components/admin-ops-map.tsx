import type { RideRequest } from "../lib/prototype-data";

type OpsRider = {
  id: string;
  name: string;
  status: "available" | "en-route" | "with-passenger" | "offline";
  bike: string;
  lat: number;
  lng: number;
  activeRequest?: RideRequest;
};

const demoRiders: OpsRider[] = [
  { id: "ops-maya", name: "Maya Carter", status: "available", bike: "Honda Gold Wing Tour", lat: 38, lng: 62 },
  { id: "ops-dre", name: "Dre Wilson", status: "en-route", bike: "Harley-Davidson Road Glide", lat: 58, lng: 34 },
  { id: "ops-sam", name: "Sam Rivera", status: "with-passenger", bike: "BMW R 1300 RT", lat: 72, lng: 58 },
  { id: "ops-kenji", name: "Kenji Brooks", status: "available", bike: "Kawasaki Vulcan 900 Classic LT", lat: 28, lng: 44 }
];

function statusLabel(status: OpsRider["status"]) {
  if (status === "en-route") return "En route to pickup";
  if (status === "with-passenger") return "Passenger onboard";
  if (status === "offline") return "Offline";
  return "Available";
}

function pinClass(status: OpsRider["status"]) {
  if (status === "with-passenger") return "bg-rr-purple shadow-glow";
  if (status === "en-route") return "bg-yellow-400";
  if (status === "available") return "bg-emerald-400";
  return "bg-zinc-500";
}

export function AdminOpsMap({ requests }: { requests: RideRequest[] }) {
  const activeRequests = requests.filter((request) => {
    const status = request.status.toLowerCase();
    return status.includes("accepted") || status.includes("en route") || status.includes("passenger") || status.includes("submitted to");
  });

  const riders: OpsRider[] = demoRiders.map((rider, index) => ({
    ...rider,
    activeRequest: activeRequests[index]
  }));

  return (
    <section className="rr-card mt-10 overflow-hidden rounded-[2rem]">
      <div className="grid gap-0 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="relative min-h-[520px] border-b border-white/10 bg-black/50 xl:border-b-0 xl:border-r">
          <div className="absolute inset-0 opacity-40">
            <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:42px_42px]" />
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-60">
            <path d="M8 72 C24 64 28 40 44 48 S62 72 78 47 S86 20 96 28" fill="none" stroke="rgba(157,0,255,.75)" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M4 30 C22 30 28 18 42 24 S62 38 74 26 S88 14 98 18" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="1" strokeLinecap="round" />
            <path d="M12 88 C32 74 42 80 56 64 S80 48 96 64" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="1" strokeLinecap="round" />
          </svg>

          <div className="absolute left-6 top-6 z-10 rounded-2xl border border-white/10 bg-black/70 p-4 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Live ops map</div>
            <h2 className="mt-1 text-2xl font-black">Active rider routes</h2>
            <p className="mt-2 max-w-md text-xs leading-5 text-rr-chrome">Prototype map layer. Later this receives real rider GPS, ride state, route geometry, and request updates from a realtime channel.</p>
          </div>

          {riders.map((rider) => (
            <div key={rider.id} className="absolute z-20" style={{ left: `${rider.lat}%`, top: `${rider.lng}%` }}>
              <div className={`h-5 w-5 rounded-full border-2 border-white ${pinClass(rider.status)}`} />
              <div className="mt-2 min-w-44 rounded-2xl border border-white/10 bg-black/75 p-3 text-xs backdrop-blur">
                <div className="font-bold text-white">{rider.name}</div>
                <div className="mt-1 text-rr-chrome">{statusLabel(rider.status)}</div>
                <div className="mt-1 text-rr-silver">{rider.bike}</div>
                {rider.activeRequest ? <div className="mt-2 rounded-xl border border-rr-purple/30 bg-rr-purple/10 p-2 text-rr-silver">Request: {rider.activeRequest.passengerName}<br />{rider.activeRequest.pickupLocation || "Pickup pending"}</div> : null}
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-black/35 p-6">
          <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Dispatch layer</div>
          <h3 className="mt-2 text-2xl font-black">Realtime-ready data model</h3>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4"><strong className="text-white">Active riders:</strong> {riders.filter((rider) => rider.status !== "offline").length}</div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4"><strong className="text-white">En route:</strong> {riders.filter((rider) => rider.status === "en-route").length}</div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4"><strong className="text-white">Passenger onboard:</strong> {riders.filter((rider) => rider.status === "with-passenger").length}</div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4"><strong className="text-white">Open/active requests:</strong> {activeRequests.length}</div>
          </div>
          <div className="mt-6 rounded-2xl border border-rr-purple/30 bg-rr-purple/10 p-4 text-sm leading-6 text-rr-chrome">
            Wire-in later: replace this mock layer with Mapbox GL, rider location pings, ride status events, route polyline geometry, and an admin dispatch subscription.
          </div>
          <div className="mt-6 grid gap-3 text-xs text-rr-silver">
            <div><span className="mr-2 inline-block h-3 w-3 rounded-full bg-emerald-400" />Available</div>
            <div><span className="mr-2 inline-block h-3 w-3 rounded-full bg-yellow-400" />En route to pickup</div>
            <div><span className="mr-2 inline-block h-3 w-3 rounded-full bg-rr-purple" />Passenger onboard</div>
          </div>
        </aside>
      </div>
    </section>
  );
}
