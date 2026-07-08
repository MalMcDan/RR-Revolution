"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PrototypeNav } from "../../components/prototype-nav";
import { MockRouteMap } from "../../components/mock-route-map";
import { AdminOpsMap } from "../../components/admin-ops-map";
import { getDocumentStatus, type RideRequest, type RiderApplication } from "../../lib/prototype-data";

function updateStoredList<T>(key: string, list: T[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

function statusClass(tone: string) {
  if (tone === "danger") return "border-red-500/40 bg-red-500/10 text-red-100";
  if (tone === "warning") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-100";
  return "border-emerald-500/40 bg-emerald-500/10 text-emerald-100";
}

function isActiveRide(request: RideRequest) {
  const status = request.status.toLowerCase();
  return status.includes("accepted") || status.includes("en route") || status.includes("passenger") || status.includes("submitted to");
}

function isPendingRequest(request: RideRequest) {
  const status = request.status.toLowerCase();
  return status.includes("submitted") || status.includes("follow-up") || status.includes("review");
}

export default function AdminPage() {
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [applications, setApplications] = useState<RiderApplication[]>([]);

  useEffect(() => {
    setRequests(JSON.parse(localStorage.getItem("rr_ride_requests") || "[]"));
    setApplications(JSON.parse(localStorage.getItem("rr_rider_applications") || "[]"));
  }, []);

  const complianceAlerts = useMemo(() => applications.filter((application) => getDocumentStatus(application).tone !== "ok"), [applications]);
  const activeRoutes = useMemo(() => requests.filter(isActiveRide), [requests]);
  const pendingRequests = useMemo(() => requests.filter(isPendingRequest), [requests]);
  const acceptedRequests = useMemo(() => requests.filter((request) => request.status.toLowerCase().includes("accepted")), [requests]);
  const uniqueAssignedRiders = useMemo(() => new Set(activeRoutes.map((request) => request.selectedRiderName || request.status).filter(Boolean)).size, [activeRoutes]);

  function setRequestStatus(index: number, status: string) {
    const next = requests.map((item, itemIndex) => itemIndex === index ? { ...item, status } : item);
    setRequests(next);
    updateStoredList("rr_ride_requests", next);
  }

  function setApplicationStatus(index: number, status: string, accessStatus?: string) {
    const next = applications.map((item, itemIndex) => itemIndex === index ? { ...item, status, accessStatus: accessStatus || item.accessStatus } : item);
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
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Admin live operations</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Dispatch and approval dashboard</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">Monitor active riders, active routes, pending ride requests, passenger releases, rider applications, and compliance alerts. The operations map is built as a realtime-ready layer that can be wired into live GPS later.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-4 xl:grid-cols-6">
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">All ride requests</div><div className="mt-2 text-4xl font-black">{requests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Pending requests</div><div className="mt-2 text-4xl font-black">{pendingRequests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Accepted rides</div><div className="mt-2 text-4xl font-black">{acceptedRequests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Active routes</div><div className="mt-2 text-4xl font-black">{activeRoutes.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Riders out</div><div className="mt-2 text-4xl font-black">{uniqueAssignedRiders}</div></div>
          <button onClick={clearPrototypeData} className="rr-card rounded-3xl p-6 text-left text-rr-silver hover:border-rr-purple/60">Clear prototype data</button>
        </div>

        <AdminOpsMap requests={requests} />

        <section className="mt-10 rounded-[2rem] border border-rr-purple/30 bg-rr-purple/5 p-6">
          <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Wire-in plan</div>
          <h2 className="mt-2 text-2xl font-black">How this becomes fully live later</h2>
          <div className="mt-4 grid gap-3 text-sm text-rr-silver md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><strong className="text-white">Rider location pings</strong><br />Mobile app sends rider latitude/longitude every few seconds while online or in an active ride.</div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><strong className="text-white">Realtime subscription</strong><br />Admin dashboard subscribes to ride status and rider location changes through Supabase realtime, WebSockets, or Firebase.</div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><strong className="text-white">Mapbox layer</strong><br />Replace the SVG mock map with Mapbox GL markers, route polylines, geofences, pickup/drop-off pins, and rider trail history.</div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><strong className="text-white">Dispatch controls</strong><br />Admin can reassign riders, pause a ride, contact rider/passenger, mark incidents, and force status changes when needed.</div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-rr-purple/30 bg-rr-purple/5 p-6">
          <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Compliance listener</div>
          <h2 className="mt-2 text-2xl font-black">30-day document notifications and access rules</h2>
          <p className="mt-3 text-sm leading-6 text-rr-chrome">Production behavior: OCR reads expiration dates from uploaded ID and insurance images. A scheduled daily job checks dates. At 30 days before expiration, notify admin and rider. If renewal is not uploaded by expiration, automatically revoke rider access.</p>
          <div className="mt-4 grid gap-3">
            {complianceAlerts.length === 0 ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">No compliance alerts right now.</div> : null}
            {complianceAlerts.map((application, index) => {
              const documentStatus = getDocumentStatus(application);
              return <div key={`${application.createdAt}-alert-${index}`} className={`rounded-2xl border p-4 ${statusClass(documentStatus.tone)}`}><strong>{application.riderName}</strong>: {documentStatus.label}. {documentStatus.adminNotice}</div>;
            })}
          </div>
        </section>

        <h2 className="mt-12 text-2xl font-bold">All ride requests</h2>
        <div className="mt-4 grid gap-4">
          {requests.length === 0 ? <div className="rr-card rounded-3xl p-6 text-rr-chrome">No ride requests yet. <Link className="text-rr-purple" href="/request">Submit one here.</Link></div> : null}
          {requests.map((request, index) => (
            <article key={`${request.createdAt}-${index}`} className="rr-card rounded-3xl p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{request.status}</div>
              <h3 className="mt-3 text-2xl font-black">{request.passengerName}</h3>
              <p className="mt-2 text-rr-chrome">{request.experience} · {request.selectedBikeName || request.motorcycle}</p>
              <p className="mt-2 text-sm text-rr-silver">Requested rider: {request.selectedRiderName || "Any approved rider"}</p>
              <p className="mt-2 text-sm text-rr-silver">{request.date} at {request.time} · {request.duration}</p>
              <p className="mt-2 text-sm text-rr-silver">Phone: {request.phone} · Emergency contact: {request.emergencyContact}</p>
              <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver">
                  <strong className="text-white">Route details:</strong><br />
                  Pickup: {request.pickupLocation || "Not captured"}<br />
                  Drop-off: {request.dropoffLocation || "Not captured"}<br />
                  Preference: {request.routePreference || "Not captured"}<br />
                  Estimate: {request.estimatedDistance || "Pending"} · {request.estimatedRideTime || "Pending"}<br />
                  Rider notes: {request.riderNotes || "None"}
                </div>
                <MockRouteMap pickup={request.pickupLocation} dropoff={request.dropoffLocation} compact />
              </div>
              <div className="mt-4 rounded-2xl border border-rr-purple/30 bg-rr-purple/5 p-4 text-sm text-rr-silver">
                <strong className="text-white">Passenger release:</strong><br />
                {request.passengerRelease ? <>Signed by {request.passengerRelease.electronicSignature} · Initials {request.passengerRelease.initials}<br />DOB: {request.passengerRelease.dateOfBirth} · Signed: {new Date(request.passengerRelease.signedAt).toLocaleString()}<br />Media consent: {request.passengerRelease.mediaConsent}<br />Version: {request.passengerRelease.releaseVersion}</> : "No passenger release found for this request."}
              </div>
              <div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setRequestStatus(index, "Accepted by rider")} className="rounded-full bg-rr-purple px-4 py-2 text-sm">Accept</button><button onClick={() => setRequestStatus(index, "En route to pickup")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">En route</button><button onClick={() => setRequestStatus(index, "Passenger onboard")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Onboard</button><button onClick={() => setRequestStatus(index, "Needs passenger follow-up")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Follow up</button><button onClick={() => setRequestStatus(index, "Declined for safety/review")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Decline</button></div>
            </article>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold">Rider application queue</h2>
        <div className="mt-4 grid gap-4">
          {applications.length === 0 ? <div className="rr-card rounded-3xl p-6 text-rr-chrome">No rider applications yet. <Link className="text-rr-purple" href="/rider-application">Submit one here.</Link></div> : null}
          {applications.map((application, index) => {
            const documentStatus = getDocumentStatus(application);
            const effectiveAccess = documentStatus.tone === "danger" ? "Access revoked" : application.accessStatus;
            const motorcyclePhotoNames = application.motorcyclePhotoNames || [];
            return (
              <article key={`${application.createdAt}-${index}`} className="rr-card rounded-3xl p-6">
                <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{application.status}</div>
                <h3 className="mt-3 text-2xl font-black">{application.riderName}</h3>
                <p className="mt-2 text-rr-chrome">{application.yearsRiding} · {application.endorsement} · {application.insurance}</p>
                <p className="mt-2 text-sm text-rr-silver">{application.motorcycle}</p>
                <p className="mt-2 text-sm text-rr-silver">Availability: {application.availability}</p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver"><strong className="text-white">Motorcycle photos:</strong><br />{motorcyclePhotoNames.length > 0 ? motorcyclePhotoNames.join(", ") : "No bike photos uploaded"}</div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver">ID file: {application.idDocumentName || "Missing"}<br />ID expires: {application.idExpirationDate || "Missing"}</div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver">Insurance file: {application.insuranceDocumentName || "Missing"}<br />Insurance expires: {application.insuranceExpirationDate || "Missing"}</div>
                </div>
                <div className={`mt-4 rounded-2xl border p-4 text-sm ${statusClass(documentStatus.tone)}`}><strong>{documentStatus.label}</strong><br />{documentStatus.adminNotice}<br />Effective access: {effectiveAccess}</div>
                <div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setApplicationStatus(index, "Approved rider", "Active")} className="rounded-full bg-rr-purple px-4 py-2 text-sm">Approve</button><button onClick={() => setApplicationStatus(index, "Needs document review", "Restricted pending documents")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Needs docs</button><button onClick={() => setApplicationStatus(index, "Declined by admin", "Access revoked")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Revoke</button></div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
