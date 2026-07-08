import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/experiences", label: "Experiences" },
  { href: "/request", label: "Request Ride" },
  { href: "/rider-application", label: "Rider Apply" },
  { href: "/admin", label: "Admin" }
];

export function PrototypeNav() {
  return (
    <header className="border-b border-white/10 bg-rr-black/90 px-6 py-5 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rr-chrome/20 bg-black/60 shadow-glow">
            <span className="rr-metal-text font-serif text-xl font-black tracking-[-0.12em]">RR</span>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-rr-silver">Ride Relax</div>
            <div className="text-xs text-rr-chrome/70">Curated motorcycle experiences</div>
          </div>
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm text-rr-chrome">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-white/10 px-4 py-2 hover:border-rr-purple/60 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
