"use client";

import { useEffect, useState } from "react";
import { PrototypeNav } from "../../components/prototype-nav";
import type { RideRequest, RiderApplication } from "../../lib/prototype-data";

export default function AdminPage() {
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [applications, setApplications] = useState<RiderApplication[]>([]);

  useEffect(() => {
    setRequests(JSON.parse(localStorage.getItem("rr_ride_requests") || "[]"));
    setApplications(JSON.parse(localStorage.getItem("rr_rider_applications") || "[]"));
  }, []);

  function clearPrototypeData() {
    localStorage.removeItem("rr_ride_requests");
    localStorage.removeItem("rr_rider_applications");
    setRequests([]);
    setApplications([]);
  }

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Admin prototype</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Approval dashboard</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">Prototype-only dashboard showing locally submitted ride requests and rider applications. This simulates the future admin approval queue before Clerk, Prisma, and Postgres are connected.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Ride requests</div><div className="mt-2 text-4xl font-black">{requests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Rider applications</div><div className="mt-2 text-4xl font-black">{applications.length}</div></div>
          <button onClick={clearPrototypeData} className="rr-card rounded-3xl p-6 text-left text-rr-silver hover:border-rr-purple/60">Clear prototype data</button>
        </div>

        <h2 className="mt-12 text-2xl font-bold">Ride request queue</h2>
        <div className="mt-4 grid gap-4">
          {requests.length === 0 ? <div className="rr-card rounded-3xl p-6 text-rr-chrome">No ride requests yet. Submit one from the Request Ride page.</div> : null}
          {requests.map((request, index) => (
            <article key={`${request.createdAt}-${index}`} className="rr-card rounded-3xl p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{request.status}</div>
              <h3 className="mt-3 text-2xl font-black">{request.passengerName}</h3>
              <p className="mt-2 text-rr-chrome">{request.experience} · {request.motorcycle}</p>
              <p className="mt-2 text-sm text-rr-silver">{request.date} at {request.time} · {request.duration}</p>
              <p className="mt-2 text-sm text-rr-silver">Emergency contact: {request.emergencyContact}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold">Rider application queue</h2>
        <div className="mt-4 grid gap-4">
          {applications.length === 0 ? <div className="rr-card rounded-3xl p-6 text-rr-chrome">No rider applications yet. Submit one from the Rider Apply page.</div> : null}
          {applications.map((application, index) => (
            <article key={`${application.createdAt}-${index}`} className="rr-card rounded-3xl p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{application.status}</div>
              <h3 className="mt-3 text-2xl font-black">{application.riderName}</h3>
              <p className="mt-2 text-rr-chrome">{application.yearsRiding} · {application.endorsement} · {application.insurance}</p>
              <p className="mt-2 text-sm text-rr-silver">{application.motorcycle}</p>
              <p className="mt-2 text-sm text-rr-silver">Availability: {application.availability}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
