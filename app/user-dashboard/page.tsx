"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { PrototypeNav } from "../../components/prototype-nav";
import { MockRouteMap } from "../../components/mock-route-map";
import { getSession, type PrototypeAccount } from "../../lib/prototype-auth";
import type { RideRequest } from "../../lib/prototype-data";

export default function UserDashboardPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [account, setAccount] = useState<PrototypeAccount | null>(null);
  const [requests, setRequests] = useState<RideRequest[]>([]);

  useEffect(() => {
    if (!isLoaded) return;
    const prototypeSession = getSession("user");
    if (!isSignedIn && !prototypeSession) {
      router.push("/user-login");
      return;
    }
    if (prototypeSession) {
      setAccount(prototypeSession);
    } else if (user) {
      setAccount({
        id: user.id,
        role: "user",
        name: user.fullName || user.primaryEmailAddress?.emailAddress || "Passenger",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.primaryPhoneNumber?.phoneNumber || "",
        password: "",
        createdAt: new Date().toISOString()
      });
    }
    setRequests(JSON.parse(localStorage.getItem("rr_ride_requests") || "[]"));
  }, [isLoaded, isSignedIn, router, user]);

  const myRequests = useMemo(() => {
    if (!account) return [];
    return requests.filter((request) => request.phone === account.phone || request.passengerName.toLowerCase() === account.name.toLowerCase());
  }, [requests, account]);

  if (!account) return <main className="min-h-screen bg-rr-radial p-10 text-white">Loading passenger account...</main>;

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Passenger dashboard</div>
            <h1 className="rr-metal-text mt-3 text-5xl font-black">Welcome, {account.name}</h1>
            <p className="mt-4 max-w-3xl text-rr-chrome">Request a ride, check ride status, view pickup/drop-off details, and keep track of your Ride Relax history.</p>
          </div>
          <SignOutButton redirectUrl="/user-login">
            <button className="rounded-full border border-white/10 px-5 py-3 text-sm text-rr-silver hover:border-rr-purple/60">Log out</button>
          </SignOutButton>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">My ride requests</div><div className="mt-2 text-4xl font-black">{myRequests.length}</div></div>
          <Link href="/request" className="rr-card rounded-3xl p-6 text-rr-silver hover:border-rr-purple/60">Request a new ride</Link>
          <Link href="/experiences" className="rr-card rounded-3xl p-6 text-rr-silver hover:border-rr-purple/60">Browse experiences</Link>
        </div>
        <h2 className="mt-12 text-2xl font-bold">My rides and requests</h2>
        <div className="mt-4 grid gap-4">
          {myRequests.length === 0 ? <div className="rr-card rounded-3xl p-6 text-rr-chrome">No matching ride requests yet. For this prototype, use the same name or phone number from your account when submitting a ride request. Supabase storage is the next wiring step.</div> : null}
          {myRequests.map((request, index) => (
            <article key={`${request.createdAt}-${index}`} className="rr-card rounded-3xl p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{request.status}</div>
              <h3 className="mt-3 text-2xl font-black">{request.experience}</h3>
              <p className="mt-2 text-rr-chrome">{request.motorcycle}</p>
              <p className="mt-2 text-sm text-rr-silver">{request.date} at {request.time} · {request.duration}</p>
              <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver">
                  <strong className="text-white">Route:</strong><br />
                  Pickup: {request.pickupLocation || "Not captured"}<br />
                  Drop-off: {request.dropoffLocation || "Not captured"}<br />
                  Preference: {request.routePreference || "Not captured"}<br />
                  Estimate: {request.estimatedDistance || "Pending"} · {request.estimatedRideTime || "Pending"}
                </div>
                <MockRouteMap pickup={request.pickupLocation} dropoff={request.dropoffLocation} compact />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
