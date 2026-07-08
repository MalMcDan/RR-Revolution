"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PrototypeNav } from "../../components/prototype-nav";
import { getDocumentStatus, type RideRequest, type RiderApplication } from "../../lib/prototype-data";

function updateStoredList<T>(key: string, list: T[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

function statusClass(tone: string) {
  if (tone === "danger") return "border-red-500/40 bg-red-500/10 text-red-100";
  if (tone === "warning") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-100";
  return "border-emerald-500/40 bg-emerald-500/10 text-emerald-100";
}

export default function AdminPage() {
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [applications, setApplications] = useState<RiderApplication[]>([]);

  useEffect(() => {
    setRequests(JSON.parse(localStorage.getItem("rr_ride_requests") || "[]"));
    setApplications(JSON.parse(localStorage.getItem("rr_rider_applications") || "[]"));
  }, []);

  const complianceAlerts = useMemo(() => applications.filter((application) => getDocumentStatus(application).tone !== "ok"), [applications]);

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
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Admin prototype</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Approval dashboard</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">Review locally submitted ride requests, passenger release records, rider applications, motorcycle photos, document expiration warnings, and access status.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Ride requests</div><div className="mt-2 text-4xl font-black">{requests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Rider applications</div><div className="mt-2 text-4xl font-black">{applications.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Compliance alerts</div><div className="mt-2 text-4xl font-black">{complianceAlerts.length}</div></div>
          <button onClick={clearPrototypeData} className="rr-card rounded-3xl p-6 text-left text-rr-silver hover:border-rr-purple/60">Clear prototype data</button>
        </div>

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
              <div className="mt-4 rounded-2xl border border-rr-purple/30 bg-rr-purple/5 p-4 text-sm text-rr-silver">
                <strong className="text-white">Passenger release:</strong><br />
                {request.passengerRelease ? <>Signed by {request.passengerRelease.electronicSignature} · Initials {request.passengerRelease.initials}<br />DOB: {request.passengerRelease.dateOfBirth} · Signed: {new Date(request.passengerRelease.signedAt).toLocaleString()}<br />Media consent: {request.passengerRelease.mediaConsent}<br />Version: {request.passengerRelease.releaseVersion}</> : "No passenger release found for this request."}
              </div>
              <div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setRequestStatus(index, "Accepted by rider")} className="rounded-full bg-rr-purple px-4 py-2 text-sm">Accept</button><button onClick={() => setRequestStatus(index, "Needs passenger follow-up")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Follow up</button><button onClick={() => setRequestStatus(index, "Declined for safety/review")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Decline</button></div>
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
