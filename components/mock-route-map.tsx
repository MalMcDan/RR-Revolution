export function MockRouteMap({ pickup, dropoff, compact = false }: { pickup?: string; dropoff?: string; compact?: boolean }) {
  const start = pickup || "Pickup location";
  const end = dropoff || "Drop-off location";

  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 ${compact ? "p-4" : "p-6"}`}>
      <div className="absolute inset-0 opacity-40">
        <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:34px_34px]" />
      </div>
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-rr-purple">
          <span>Route preview</span>
          <span>Mock map</span>
        </div>
        <div className={`relative ${compact ? "h-44" : "h-72"}`}>
          <svg viewBox="0 0 800 360" className="h-full w-full rounded-3xl border border-white/10 bg-rr-black/70">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path d="M70 285 C 170 225, 165 120, 280 145 S 430 270, 525 175 S 640 65, 735 95" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="18" strokeLinecap="round" />
            <path d="M70 285 C 170 225, 165 120, 280 145 S 430 270, 525 175 S 640 65, 735 95" fill="none" stroke="#9D00FF" strokeWidth="8" strokeLinecap="round" filter="url(#glow)" />
            <circle cx="70" cy="285" r="18" fill="#7CFF3A" />
            <circle cx="735" cy="95" r="18" fill="#FF6A33" />
            <text x="96" y="291" fill="white" fontSize="24" fontWeight="700">Pickup</text>
            <text x="560" y="101" fill="white" fontSize="24" fontWeight="700">Drop-off</text>
          </svg>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-rr-purple">Pickup</div>
            <div className="mt-2 text-sm text-rr-silver">{start}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-rr-purple">Drop-off</div>
            <div className="mt-2 text-sm text-rr-silver">{end}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
