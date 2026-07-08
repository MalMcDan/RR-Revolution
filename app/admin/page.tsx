"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PrototypeNav } from "../../components/prototype-nav";
import type { RideRequest, RiderApplication } from "../../lib/prototype-data";

function updateStoredList<T>(key: string, list: T[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

export default function AdminPage() {
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [applications, setApplications] = useState<RiderApplication[]>([]);

  useEffect(() => {
    setRequests(JSON.parse(localStorage.getItem("rr_ride_requests") || "[]"));
    setApplications(JSON.parse(localStorage.getItem("rr_rider_applications") || "[]"));
  }, []);

  function setRequestStatus(index: number, status: string) {
    const next = requests.map((item, itemIndex) => itemIndex === index ? { ...item, status } : item);
    setRequests(next);
    updateStoredList("rr_ride_requests", next);
  }

  function setApplicationStatus(index: number, status: string) {
    const next = applications.map((item, itemIndex) => itemIndex === index ? { ...item, status } : item);
    setApplications(next);
    updateStoredList("rr_rider_applications", next);
  }

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
        <p className="mt-4 max-w-3xl text-rr-chrome">Review locally submitted ride requests and rider applications. Use the buttons to simulate accept/decline status changes.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Ride requests</div><div className="mt-2 text-4xl font-black">{requests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Rider applications</div><div className="mt-2 text-4xl font-black">{applications.length}</div></div>
          <Link href="/request" className="rr-card rounded-3xl p-6 text-rr-silver hover:border-rr-purple/60">Add ride request</Link>
          <button onClick={clearPrototypeData} className="rr-card rounded-3xl p-6 text-left text-rr-silver hover:border-rr-purple/60">Clear prototype data</button>
        </div>

        <h2 className="mt-12 text-2xl font-bold">Ride request queue</h2>
        <div className="mt-4 grid gap-4">
          {requests.length === 0 ? <div className="rr-card rounded-3xl p-6 text-rr-chrome">No ride requests yet. <Link className="text-rr-purple" href="/request">Submit one here.</Link></div> : null}
          {requests.map((request, index) => (
            <article key={`${request.createdAt}-${index}`} className="rr-card rounded-3xl p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{request.status}</div>
              <h3 className="mt-3 text-2xl font-black">{request.passengerName}</h3>
              <p className="mt-2 text-rr-chrome">{request.experience} · {request.motorcycle}</p>
              <p className="mt-2 text-sm text-rr-silver">{request.date} at {request.time} · {request.duration}</p>
              <p className="mt-2 text-sm text-rr-silver">Phone: {request.phone} · Emergency contact: {request.emergencyContact}</p>
              <div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setRequestStatus(index, "Accepted by rider")} className="rounded-full bg-rr-purple px-4 py-2 text-sm">Accept</button><button onClick={() => setRequestStatus(index, "Needs passenger follow-up")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Follow up</button><button onClick={() => setRequestStatus(index, "Declined for safety/review")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Decline</button></div>
            </article>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold">Rider application queue</h2>
        <div className="mt-4 grid gap-4">
          {applications.length === 0 ? <div className="rr-card rounded-3xl p-6 text-rr-chrome">No rider applications yet. <Link className="text-rr-purple" href="/rider-application">Submit one here.</Link></div> : null}
          {applications.map((application, index) => (
            <article key={`${application.createdAt}-${index}`} className="rr-card rounded-3xl p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{application.status}</div>
              <h3 className="mt-3 text-2xl font-black">{application.riderName}</h3>
              <p className="mt-2 text-rr-chrome">{application.yearsRiding} · {application.endorsement} · {application.insurance}</p>
              <p className="mt-2 text-sm text-rr-silver">{application.motorcycle}</p>
              <p className="mt-2 text-sm text-rr-silver">Availability: {application.availability}</p>
              <div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setApplicationStatus(index, "Approved rider")} className="rounded-full bg-rr-purple px-4 py-2 text-sm">Approve</button><button onClick={() => setApplicationStatus(index, "Needs document review")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Needs docs</button><button onClick={() => setApplicationStatus(index, "Declined by admin")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Decline</button></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
