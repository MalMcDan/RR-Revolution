"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { PrototypeNav } from "../../components/prototype-nav";
import { MockRouteMap } from "../../components/mock-route-map";
import { AdminOpsMap } from "../../components/admin-ops-map";
import { getBikeById, getDocumentStatus, type RideRequest, type RiderApplication } from "../../lib/prototype-data";
import { approvePrototypeRider, getStoredApprovedRiders, restorePrototypeRider, revokePrototypeRider, revokePrototypeRiderById, type ApprovedPrototypeRider } from "../../lib/prototype-rider-marketplace";
import { getPortalIntent, lockAdminPrototype, readClerkAppRole, setPortalIntent } from "../../lib/prototype-portal";

type OnboardingApplication = RiderApplication & Record<string, unknown>;

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

function getText(application: OnboardingApplication, key: string, fallback = "Not captured") {
  const value = application[key];
  return typeof value === "string" && value ? value : fallback;
}

function getBoolean(application: OnboardingApplication, key: string) {
  return application[key] === true;
}

function DocumentReviewCard({ label, fileName, expires }: { label: string; fileName?: string; expires?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver">
      <div className="font-semibold text-white">{label}</div>
      <div className="mt-2">File: {fileName || "Missing"}</div>
      <div>Expires: {expires || "Missing"}</div>
      <div className="mt-4 rounded-xl border border-dashed border-white/15 bg-black/40 p-4 text-xs leading-5 text-rr-chrome">
        Prototype preview: {fileName ? "document file name captured" : "no document submitted"}. Production should store this in a private admin-only Supabase bucket with signed preview URLs.
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const clerkRole = readClerkAppRole(user?.publicMetadata as Record<string, unknown> | undefined);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [applications, setApplications] = useState<OnboardingApplication[]>([]);
  const [approvedRiders, setApprovedRiders] = useState<ApprovedPrototypeRider[]>([]);

  const adminAllowed = Boolean(isLoaded && isSignedIn && (clerkRole === "admin" || getPortalIntent() === "admin"));

  useEffect(() => {
    if (!isLoaded) return;
    if (!adminAllowed) return;
    setPortalIntent("admin");
    setRequests(JSON.parse(localStorage.getItem("rr_ride_requests") || "[]"));
    setApplications(JSON.parse(localStorage.getItem("rr_rider_applications") || "[]"));
    setApprovedRiders(getStoredApprovedRiders());
  }, [isLoaded, adminAllowed]);

  const complianceAlerts = useMemo(() => applications.filter((application) => getDocumentStatus(application).tone !== "ok"), [applications]);
  const activeRoutes = useMemo(() => requests.filter(isActiveRide), [requests]);
  const pendingRequests = useMemo(() => requests.filter(isPendingRequest), [requests]);
  const acceptedRequests = useMemo(() => requests.filter((request) => request.status.toLowerCase().includes("accepted")), [requests]);
  const activeApprovedRiders = useMemo(() => approvedRiders.filter((rider) => rider.status === "Approved" && rider.accessStatus === "Active"), [approvedRiders]);
  const pendingOnboarding = useMemo(() => applications.filter((application) => !String(application.status).toLowerCase().includes("approved")), [applications]);

  function setRequestStatus(index: number, status: string) {
    const next = requests.map((item, itemIndex) => itemIndex === index ? { ...item, status } : item);
    setRequests(next);
    updateStoredList("rr_ride_requests", next);
  }

  function patchApplication(index: number, patch: Record<string, unknown>) {
    const next = applications.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item);
    setApplications(next);
    updateStoredList("rr_rider_applications", next);
  }

  function approveApplication(index: number) {
    const application = applications[index];
    const approved = approvePrototypeRider(application);
    patchApplication(index, {
      status: "Approved rider",
      accessStatus: "Active",
      onboardingStep: "Approved and published",
      approvedAt: new Date().toISOString()
    });
    setApprovedRiders(getStoredApprovedRiders());
    alert(`${approved.name} is now active and will appear in the passenger request flow for ${approved.ownedBikeName || approved.bikeIds.map((bikeId) => getBikeById(bikeId).model).join(", ")}.`);
  }

  function revokeApplication(index: number) {
    const application = applications[index];
    revokePrototypeRider(application);
    patchApplication(index, {
      status: "Revoked by admin",
      accessStatus: "Access revoked",
      onboardingStep: "Revoked",
      revokedAt: new Date().toISOString()
    });
    setApprovedRiders(getStoredApprovedRiders());
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

  if (!isLoaded) {
    return <main className="min-h-screen bg-rr-radial p-10 text-white">Checking admin session...</main>;
  }

  if (!adminAllowed) {
    return (
      <main className="min-h-screen bg-rr-radial text-white">
        <PrototypeNav />
        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="text-xs uppercase tracking-[0.42em] text-red-300">Admin sign-in required</div>
          <h1 className="rr-metal-text mt-3 text-5xl font-black">Admin portal locked</h1>
          <p className="mt-4 text-rr-chrome">Admin no longer uses a visible pass phrase. Sign in through the Admin login. In production, this page must require Clerk metadata <strong className="text-white">rrRole: admin</strong> plus server-side API authorization.</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-rr-silver">
            Signed in: <strong className="text-white">{isSignedIn ? "yes" : "no"}</strong><br />
            Clerk role metadata: <strong className="text-white">{clerkRole || "not set"}</strong>
          </div>
          <Link href="/admin-login" onClick={() => setPortalIntent("admin")} className="mt-8 inline-flex rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Go to admin login</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Admin live operations</div>
            <h1 className="rr-metal-text mt-3 text-5xl font-black">Dispatch and compliance dashboard</h1>
            <p className="mt-4 max-w-3xl text-rr-chrome">Monitor ride requests, rider onboarding, contractor agreements, ID/insurance documents, background checks, license monitoring, and rider access.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => { lockAdminPrototype(); setPortalIntent("passenger"); }} className="rounded-full border border-white/10 px-5 py-3 text-sm text-rr-silver">Lock view</button>
            <SignOutButton redirectUrl="/admin-login">
              <button onClick={lockAdminPrototype} className="rounded-full border border-red-500/30 px-5 py-3 text-sm text-red-100">Log out admin</button>
            </SignOutButton>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4 xl:grid-cols-6">
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Ride requests</div><div className="mt-2 text-4xl font-black">{requests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Pending requests</div><div className="mt-2 text-4xl font-black">{pendingRequests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Accepted rides</div><div className="mt-2 text-4xl font-black">{acceptedRequests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Active routes</div><div className="mt-2 text-4xl font-black">{activeRoutes.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Active riders</div><div className="mt-2 text-4xl font-black">{activeApprovedRiders.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Onboarding queue</div><div className="mt-2 text-4xl font-black">{pendingOnboarding.length}</div></div>
        </div>

        <section className="mt-10 rounded-[2rem] border border-rr-purple/30 bg-rr-purple/5 p-6">
          <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Rider onboarding process</div>
          <h2 className="mt-2 text-2xl font-black">Apply → documents → contract → background → license → approval</h2>
          <div className="mt-4 grid gap-3 text-sm text-rr-silver md:grid-cols-3 xl:grid-cols-6">
            {[
              "Application submitted",
              "ID + insurance reviewed",
              "Contract accepted",
              "Background check ordered/cleared",
              "License monitored/active",
              "Admin approval publishes rider"
            ].map((step, index) => <div key={step} className="rounded-2xl border border-white/10 bg-black/30 p-4"><strong className="text-white">{index + 1}.</strong><br />{step}</div>)}
          </div>
        </section>

        <AdminOpsMap requests={requests} />

        <section className="mt-10 rounded-[2rem] border border-rr-purple/30 bg-rr-purple/5 p-6">
          <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Approved rider marketplace</div>
          <h2 className="mt-2 text-2xl font-black">Riders visible to passengers</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {approvedRiders.length === 0 ? <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-chrome">No approved prototype riders yet. Approve a rider application below to publish them into the request flow.</div> : null}
            {approvedRiders.map((rider) => {
              const isActive = rider.status === "Approved" && rider.accessStatus === "Active";
              return <div key={rider.id} className={`rounded-2xl border p-4 text-sm ${isActive ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-red-500/30 bg-red-500/10 text-red-100"}`}><strong className="text-white">{rider.name}</strong><br />Status: {rider.status} · Access: {rider.accessStatus}<br />Marketplace bike: {rider.ownedBikeName || rider.bikeIds.map((bikeId) => `${getBikeById(bikeId).make} ${getBikeById(bikeId).model}`).join(", ")}<br />Passenger setup: {rider.passengerSetup || "Not captured"}<div className="mt-4 flex flex-wrap gap-2">{isActive ? <button onClick={() => revokeApprovedRider(rider.id, rider.name)} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white">Revoke marketplace access</button> : <button onClick={() => restoreApprovedRider(rider.id)} className="rounded-full bg-rr-purple px-4 py-2 text-sm text-white">Restore access</button>}</div></div>;
            })}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-rr-purple/30 bg-rr-purple/5 p-6">
          <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Compliance listener</div>
          <h2 className="mt-2 text-2xl font-black">30-day document notifications and access rules</h2>
          <p className="mt-3 text-sm leading-6 text-rr-chrome">Production behavior: OCR reads expiration dates from uploaded ID and insurance images. A scheduled daily job checks dates. At 30 days before expiration, notify admin and rider. If renewal is not uploaded by expiration, automatically revoke rider access.</p>
          <div className="mt-4 grid gap-3">{complianceAlerts.length === 0 ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">No compliance alerts right now.</div> : null}{complianceAlerts.map((application, index) => { const documentStatus = getDocumentStatus(application); return <div key={`${application.createdAt}-alert-${index}`} className={`rounded-2xl border p-4 ${statusClass(documentStatus.tone)}`}><strong>{application.riderName}</strong>: {documentStatus.label}. {documentStatus.adminNotice}</div>; })}</div>
        </section>

        <h2 className="mt-12 text-2xl font-bold">Rider onboarding queue</h2>
        <div className="mt-4 grid gap-4">
          {applications.length === 0 ? <div className="rr-card rounded-3xl p-6 text-rr-chrome">No rider applications yet. <Link className="text-rr-purple" href="/rider-application">Submit one here.</Link></div> : null}
          {applications.map((application, index) => {
            const documentStatus = getDocumentStatus(application);
            const appWithBike = application as OnboardingApplication & { selectedInventoryBikeName?: string };
            const motorcyclePhotoNames = application.motorcyclePhotoNames || [];
            return (
              <article key={`${application.createdAt}-${index}`} className="rr-card rounded-3xl p-6">
                <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{String(application.onboardingStep || application.status)}</div>
                <h3 className="mt-3 text-2xl font-black">{application.riderName}</h3>
                <p className="mt-2 text-rr-chrome">{application.yearsRiding} · {application.endorsement} · {application.insurance}</p>
                <p className="mt-2 text-sm text-rr-silver">Email: {application.email} · Phone: {application.phone}</p>
                <p className="mt-2 text-sm text-rr-silver">License: {getText(application, "licenseState")} · Last 4: {getText(application, "licenseNumberLast4")} · Status: {getText(application, "licenseStatus")}</p>
                <p className="mt-2 text-sm text-rr-silver">Selected marketplace bike: {appWithBike.selectedInventoryBikeName || "Inferred from garage/details on approval"}</p>
                <p className="mt-2 text-sm text-rr-silver">Exact bike: {application.motorcycle}</p>
                <p className="mt-2 text-sm text-rr-silver">Availability: {application.availability}</p>

                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  <DocumentReviewCard label="Government ID" fileName={application.idDocumentName} expires={application.idExpirationDate} />
                  <DocumentReviewCard label="Insurance document" fileName={application.insuranceDocumentName} expires={application.insuranceExpirationDate} />
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver"><strong className="text-white">Motorcycle photos:</strong><br />{motorcyclePhotoNames.length > 0 ? motorcyclePhotoNames.join(", ") : "No bike photos uploaded"}</div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className={`rounded-2xl border p-4 text-sm ${getBoolean(application, "contractorAgreementAccepted") ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-yellow-500/30 bg-yellow-500/10 text-yellow-100"}`}><strong>Contract:</strong><br />{getBoolean(application, "contractorAgreementAccepted") ? `Signed by ${getText(application, "contractorAgreementSignature")}` : "Not signed"}</div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver"><strong className="text-white">Background check:</strong><br />Consent: {getBoolean(application, "backgroundCheckConsent") ? "Yes" : "No"}<br />Status: {getText(application, "backgroundCheckStatus")}</div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver"><strong className="text-white">License monitoring:</strong><br />Consent: {getBoolean(application, "licenseMonitoringConsent") ? "Yes" : "No"}<br />Status: {getText(application, "licenseMonitoringStatus")}</div>
                </div>

                <div className={`mt-4 rounded-2xl border p-4 text-sm ${statusClass(documentStatus.tone)}`}><strong>{documentStatus.label}</strong><br />{documentStatus.adminNotice}<br />Effective access: {application.accessStatus}</div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={() => patchApplication(index, { status: "Documents reviewed", onboardingStep: "Documents reviewed", accessStatus: "Locked pending background/license" })} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Mark docs reviewed</button>
                  <button onClick={() => patchApplication(index, { backgroundCheckStatus: "Ordered", onboardingStep: "Background check ordered" })} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Order background check</button>
                  <button onClick={() => patchApplication(index, { backgroundCheckStatus: "Clear", onboardingStep: "Background check clear" })} className="rounded-full border border-emerald-500/30 px-4 py-2 text-sm text-emerald-100">Background clear</button>
                  <button onClick={() => patchApplication(index, { backgroundCheckStatus: "Review failed", status: "Rejected - background check", accessStatus: "Access denied" })} className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-100">Background fail</button>
                  <button onClick={() => patchApplication(index, { licenseMonitoringStatus: "Active", licenseStatus: "Active motorcycle endorsement verified", onboardingStep: "License verified" })} className="rounded-full border border-emerald-500/30 px-4 py-2 text-sm text-emerald-100">License active</button>
                  <button onClick={() => patchApplication(index, { licenseMonitoringStatus: "Flagged", licenseStatus: "Suspended / admin review", status: "Suspended license review", accessStatus: "Access suspended" })} className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-100">License suspended</button>
                  <button onClick={() => approveApplication(index)} className="rounded-full bg-rr-purple px-4 py-2 text-sm">Approve + publish</button>
                  <button onClick={() => revokeApplication(index)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Revoke access</button>
                </div>
              </article>
            );
          })}
        </div>

        <h2 className="mt-12 text-2xl font-bold">All ride requests</h2>
        <div className="mt-4 grid gap-4">
          {requests.length === 0 ? <div className="rr-card rounded-3xl p-6 text-rr-chrome">No ride requests yet. <Link className="text-rr-purple" href="/request">Submit one here.</Link></div> : null}
          {requests.map((request, index) => <article key={`${request.createdAt}-${index}`} className="rr-card rounded-3xl p-6"><div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{request.status}</div><h3 className="mt-3 text-2xl font-black">{request.passengerName}</h3><p className="mt-2 text-rr-chrome">{request.experience} · {request.selectedBikeName || request.motorcycle}</p><p className="mt-2 text-sm text-rr-silver">Requested rider: {request.selectedRiderName || "Any approved rider"}</p><p className="mt-2 text-sm text-rr-silver">{request.date} at {request.time} · {request.duration}</p><div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]"><div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver"><strong className="text-white">Route details:</strong><br />Pickup: {request.pickupLocation || "Not captured"}<br />Drop-off: {request.dropoffLocation || "Not captured"}<br />Preference: {request.routePreference || "Not captured"}<br />Estimate: {request.estimatedDistance || "Pending"} · {request.estimatedRideTime || "Pending"}</div><MockRouteMap pickup={request.pickupLocation} dropoff={request.dropoffLocation} compact /></div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setRequestStatus(index, "Admin approved - sent to rider")} className="rounded-full bg-rr-purple px-4 py-2 text-sm">Admin approve</button><button onClick={() => setRequestStatus(index, "Declined for safety/review")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Decline</button></div></article>)}
        </div>

        <div className="mt-12 flex justify-end"><button onClick={clearPrototypeData} className="rounded-full border border-white/10 px-5 py-3 text-sm text-rr-silver">Clear prototype data</button></div>
      </section>
    </main>
  );
}
