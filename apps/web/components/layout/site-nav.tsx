import Link from "next/link";
import { RRMonogram } from "../brand/rr-monogram";

const links = [
  { href: "/rides", label: "Ride" },
  { href: "/riders", label: "Riders" },
  { href: "/motorcycles", label: "Motorcycles" },
  { href: "/waiver", label: "Safety" },
  { href: "/admin", label: "Admin" }
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-rr-black/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <RRMonogram />
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-rr-silver">Road Rider</div>
            <div className="text-xs text-rr-chrome/70">Curated motorcycle experiences</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-rr-chrome md:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className="hover:text-white">{link.label}</Link>)}
        </nav>
        <Link href="/dashboard" className="rounded-full border border-rr-purple/50 px-4 py-2 text-sm text-white shadow-glow">Preview app</Link>
      </div>
    </header>
  );
}
