"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { ReactNode } from "react";
import { getRoleDashboard, readClerkAppRole, roleMatches, setPortalIntent, type PortalRole } from "../lib/prototype-portal";

type ProtectedPortalProps = {
  requiredRole: PortalRole;
  children: ReactNode;
  title?: string;
  description?: string;
  allowPrototypeFallback?: boolean;
};

export function ProtectedPortal({
  requiredRole,
  children,
  title = "Portal access restricted",
  description = "This account is not currently authorized for this Ride Relax portal.",
  allowPrototypeFallback = true
}: ProtectedPortalProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const clerkRole = readClerkAppRole(user?.publicMetadata as Record<string, unknown> | undefined);
  const allowed = isLoaded && isSignedIn && roleMatches(requiredRole, clerkRole, allowPrototypeFallback);

  if (!isLoaded) {
    return <main className="min-h-screen bg-rr-radial p-10 text-white">Checking portal access...</main>;
  }

  if (!isSignedIn) {
    const loginPath = requiredRole === "passenger" ? "/user-login" : requiredRole === "rider" ? "/rider-login" : "/admin-login";
    return (
      <main className="min-h-screen bg-rr-radial text-white">
        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Sign in required</div>
          <h1 className="rr-metal-text mt-3 text-5xl font-black">{title}</h1>
          <p className="mt-4 text-rr-chrome">Please sign in through the correct Ride Relax portal before continuing.</p>
          <Link href={loginPath} onClick={() => setPortalIntent(requiredRole)} className="mt-8 inline-flex rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Go to {requiredRole} login</Link>
        </section>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-rr-radial text-white">
        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="text-xs uppercase tracking-[0.42em] text-red-300">Access denied</div>
          <h1 className="rr-metal-text mt-3 text-5xl font-black">{title}</h1>
          <p className="mt-4 text-rr-chrome">{description}</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-rr-silver">
            Required role: <strong className="text-white">{requiredRole}</strong><br />
            Clerk role: <strong className="text-white">{clerkRole || "not set"}</strong><br />
            Prototype fallback: <strong className="text-white">{allowPrototypeFallback ? "enabled" : "disabled"}</strong>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/user-login" onClick={() => setPortalIntent("passenger")} className="rounded-full border border-white/10 px-6 py-3 text-rr-silver">Passenger login</Link>
            <Link href="/rider-login" onClick={() => setPortalIntent("rider")} className="rounded-full border border-white/10 px-6 py-3 text-rr-silver">Rider login</Link>
            <Link href="/admin-login" onClick={() => setPortalIntent("admin")} className="rounded-full border border-white/10 px-6 py-3 text-rr-silver">Admin login</Link>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}

export function RoleDebugCard() {
  const { user } = useUser();
  const clerkRole = readClerkAppRole(user?.publicMetadata as Record<string, unknown> | undefined);
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-rr-chrome">
      Clerk role metadata: <strong className="text-white">{clerkRole || "not set"}</strong><br />
      Expected metadata key: <strong className="text-white">rrRole</strong> with value passenger, rider, or admin.
    </div>
  );
}
