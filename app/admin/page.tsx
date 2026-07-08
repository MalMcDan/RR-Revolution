"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PrototypeNav } from "../../components/prototype-nav";
import { MockRouteMap } from "../../components/mock-route-map";
import { AdminOpsMap } from "../../components/admin-ops-map";
import { getBikeById, getDocumentStatus, type RideRequest, type RiderApplication } from "../../lib/prototype-data";
import { approvePrototypeRider, getStoredApprovedRiders, restorePrototypeRider, revokePrototypeRider, revokePrototypeRiderById, type ApprovedPrototypeRider } from "../../lib/prototype-rider-marketplace";

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
  return status.includes("accepted") || status.includes("en route") || status.includes("passenger") || status.includes("submitted to") || status.includes("admin approved");
}

function isPendingRequest(request: RideRequest) {
  const status = request.status.toLowerCase();
  return status.includes("submitted") || status.includes("follow-up") || status.includes("review") || status.includes("admin approved");
}

export default function AdminPage() {
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [applications, setApplications] = useState<RiderApplication[]>([]);
  const [approvedRiders, setApprovedRiders] = useState<ApprovedPrototypeRider[]>([]);

  useEffect(() => {
    setRequests(JSON.parse(localStorage.getItem("rr_ride_requests") || "[]"));
    setApplications(JSON.parse(localStorage.getItem("rr_rider_applications") || "[]"));
    setApprovedRiders(getStoredApprovedRiders());
  }, []);

  const complianceAlerts = useMemo(() => applications.filter((application) => getDocumentStatus(application).tone !== "ok"), [applications]);
  const activeRoutes = useMemo(() => requests.filter(isActiveRide), [requests]);
  const pendingRequests = useMemo(() => requests.filter(isPendingRequest), [requests]);
  const acceptedRequests = useMemo(() => requests.filter((request) => request.status.toLowerCase().includes("accepted")), [requests]);
  const activeApprovedRiders = useMemo(() => approvedRiders.filter((rider) => rider.status === "Approved" && rider.accessStatus === "Active"), [approvedRiders]);
  const revokedRiders = useMemo(() => approvedRiders.filter((rider) => rider.status === "Revoked" || rider.accessStatus === "Revoked"), [approvedRiders]);

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

  function approveApplication(index: number) {
    const application = applications[index];
    const approved = approvePrototypeRider(application);
    setApplicationStatus(index, "Approved rider", "Active");
    setApprovedRiders(getStoredApprovedRiders());
    alert(`${approved.name} is now active and will appear in the passenger request flow for ${approved.ownedBikeName || approved.bikeIds.map((bikeId) => getBikeById(bikeId).model).join(", ")}.`);
  }

  function revokeApplication(index: number) {
    const application = applications[index];
    revokePrototypeRider(application);
    setApplicationStatus(index, "Revoked by admin", "Access revoked");
    const nextApproved = getStoredApprovedRiders();
    setApprovedRiders(nextApproved);
    const nextRequests = requests.map((request) => request.selectedRiderName === application.riderName ? { ...request, status: "Rider access revoked - admin reassignment needed" } : request);
    setRequests(nextRequests);
    updateStoredList("rr_ride_requests", nextRequests);
  }

  function revokeApprovedRider(riderId: string, riderName: string) {
    const nextApproved = revokePrototypeRiderById(riderId);
    setApprovedRiders(nextApproved);
    const nextRequests = requests.map((request) => request.selectedRiderName === riderName ? { ...request, status: "Rider access revoked - admin reassignment needed" } : request);
    setRequests(nextRequests);
    updateStoredList("rr_ride_requests", nextRequests);
  }

  function restoreApprovedRider(riderId: string) {
    setApprovedRiders(restorePrototypeRider(riderId));
  }

  function clearPrototypeData() {
    localStorage.removeItem("rr_ride_requests");
    localStorage.removeItem("rr_rider_applications");
    localStorage.removeItem("rr_approved_riders");
    setRequests([]);
    setApplications([]);
    setApprovedRiders([]);
  }

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Admin live operations</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Dispatch and approval dashboard</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">Monitor active riders, active routes, pending ride requests, passenger releases, rider applications, and compliance alerts. Approved riders feed the passenger request flow by selected bike.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-4 xl:grid-cols-6">
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">All ride requests</div><div className="mt-2 text-4xl font-black">{requests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Pending requests</div><div className="mt-2 text-4xl font-black">{pendingRequests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Accepted rides</div><div className="mt-2 text-4xl font-black">{acceptedRequests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Active routes</div><div className="mt-2 text-4xl font-black">{activeRoutes.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Active riders</div><div className="mt-2 text-4xl font-black">{activeApprovedRiders.length}</div></div>
          <button onClick={clearPrototypeData} className="rr-card rounded-3xl p-6 text-left text-rr-silver hover:border-rr-purple/60">Clear prototype data</button>
        </div>

        <section className="mt-10 rounded-[2rem] border border-rr-purple/30 bg-rr-purple/5 p-6">
          <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Admin process flow</div>
          <h2 className="mt-2 text-2xl font-black">Approval → marketplace → request → dispatch</h2>
          <div className="mt-4 grid gap-3 text-sm text-rr-silver md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><strong className="text-white">1. Review rider</strong><br />Check application, documents, and selected marketplace bike.</div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><strong className="text-white">2. Approve + publish</strong><br />Rider becomes active for that selected bike.</div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><strong className="text-white">3. Passenger books</strong><br />Passenger picks that bike and sees the active rider.</div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><strong className="text-white">4. Revoke/restore</strong><br />Revoked riders disappear from future requests and active requests need reassignment.</div>
          </div>
        </section>

        <AdminOpsMap requests={requests} />

        <section className="mt-10 rounded-[2rem] border border-rr-purple/30 bg-rr-purple/5 p-6">
          <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Approved rider marketplace</div>
          <h2 className="mt-2 text-2xl font-black">Riders visible to passengers</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {approvedRiders.length === 0 ? <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-chrome">No newly approved prototype riders yet. Approve a rider application below to publish them into the request flow.</div> : null}
            {approvedRiders.map((rider) => {
              const isActive = rider.status === "Approved" && rider.accessStatus === "Active";
              return (
                <div key={rider.id} className={`rounded-2xl border p-4 text-sm ${isActive ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-red-500/30 bg-red-500/10 text-red-100"}`}>
                  <strong className="text-white">{rider.name}</strong><br />
                  Status: {rider.status} · Access: {rider.accessStatus}<br />
                  Marketplace bike: {rider.ownedBikeName || rider.bikeIds.map((bikeId) => `${getBikeById(bikeId).make} ${getBikeById(bikeId).model}`).join(", ")}<br />
                  Passenger setup: {rider.passengerSetup || "Not captured"}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {isActive ? <button onClick={() => revokeApprovedRider(rider.id, rider.name)} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white">Revoke marketplace access</button> : <button onClick={() => restoreApprovedRider(rider.id)} className="rounded-full bg-rr-purple px-4 py-2 text-sm text-white">Restore access</button>}
                  </div>
                </div>
              );
            })}
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
              <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]"><div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver"><strong className="text-white">Route details:</strong><br />Pickup: {request.pickupLocation || "Not captured"}<br />Drop-off: {request.dropoffLocation || "Not captured"}<br />Preference: {request.routePreference || "Not captured"}<br />Estimate: {request.estimatedDistance || "Pending"} · {request.estimatedRideTime || "Pending"}<br />Rider notes: {request.riderNotes || "None"}</div><MockRouteMap pickup={request.pickupLocation} dropoff={request.dropoffLocation} compact /></div>
              <div className="mt-4 rounded-2xl border border-rr-purple/30 bg-rr-purple/5 p-4 text-sm text-rr-silver"><strong className="text-white">Passenger release:</strong><br />{request.passengerRelease ? <>Signed by {request.passengerRelease.electronicSignature} · Initials {request.passengerRelease.initials}<br />DOB: {request.passengerRelease.dateOfBirth} · Signed: {new Date(request.passengerRelease.signedAt).toLocaleString()}<br />Media consent: {request.passengerRelease.mediaConsent}<br />Version: {request.passengerRelease.releaseVersion}</> : "No passenger release found for this request."}</div>
              <div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setRequestStatus(index, "Admin approved - sent to rider")} className="rounded-full bg-rr-purple px-4 py-2 text-sm">Admin approve</button><button onClick={() => setRequestStatus(index, "Accepted by rider")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Rider accepted</button><button onClick={() => setRequestStatus(index, "En route to pickup")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">En route</button><button onClick={() => setRequestStatus(index, "Passenger onboard")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Onboard</button><button onClick={() => setRequestStatus(index, "Completed")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Complete</button><button onClick={() => setRequestStatus(index, "Declined for safety/review")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Decline</button></div>
            </article>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold">Rider application queue</h2>
        <div className="mt-4 grid gap-4">
          {applications.length === 0 ? <div className="rr-card rounded-3xl p-6 text-rr-chrome">No rider applications yet. <Link className="text-rr-purple" href="/rider-application">Submit one here.</Link></div> : null}
          {applications.map((application, index) => {
            const documentStatus = getDocumentStatus(application);
            const appWithBike = application as RiderApplication & { selectedInventoryBikeName?: string };
            const effectiveAccess = documentStatus.tone === "danger" ? "Access revoked" : application.accessStatus;
            const motorcyclePhotoNames = application.motorcyclePhotoNames || [];
            return (
              <article key={`${application.createdAt}-${index}`} className="rr-card rounded-3xl p-6">
                <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{application.status}</div>
                <h3 className="mt-3 text-2xl font-black">{application.riderName}</h3>
                <p className="mt-2 text-rr-chrome">{application.yearsRiding} · {application.endorsement} · {application.insurance}</p>
                <p className="mt-2 text-sm text-rr-silver">Selected marketplace bike: {appWithBike.selectedInventoryBikeName || "Inferred from garage/details on approval"}</p>
                <p className="mt-2 text-sm text-rr-silver">Exact bike: {application.motorcycle}</p>
                <p className="mt-2 text-sm text-rr-silver">Availability: {application.availability}</p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver"><strong className="text-white">Motorcycle photos:</strong><br />{motorcyclePhotoNames.length > 0 ? motorcyclePhotoNames.join(", ") : "No bike photos uploaded"}</div>
                <div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver">ID file: {application.idDocumentName || "Missing"}<br />ID expires: {application.idExpirationDate || "Missing"}</div><div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver">Insurance file: {application.insuranceDocumentName || "Missing"}<br />Insurance expires: {application.insuranceExpirationDate || "Missing"}</div></div>
                <div className={`mt-4 rounded-2xl border p-4 text-sm ${statusClass(documentStatus.tone)}`}><strong>{documentStatus.label}</strong><br />{documentStatus.adminNotice}<br />Effective access: {effectiveAccess}</div>
                <div className="mt-5 flex flex-wrap gap-2"><button onClick={() => approveApplication(index)} className="rounded-full bg-rr-purple px-4 py-2 text-sm">Approve + publish</button><button onClick={() => setApplicationStatus(index, "Needs document review", "Restricted pending documents")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Needs docs</button><button onClick={() => revokeApplication(index)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Revoke access</button></div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
