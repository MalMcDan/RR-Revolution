"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { PrototypeNav } from "../../components/prototype-nav";
import { MockRouteMap } from "../../components/mock-route-map";
import { motorcycleInventory, type RideRequest } from "../../lib/prototype-data";

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-rr-purple";
const labelClass = "text-sm font-medium text-rr-silver";

type RiderSession = {
  riderName: string;
  email: string;
  phone: string;
  ridingStyle: string;
  motorcycle: string;
  availability: string;
  loginAt: string;
};

type RiderGarage = {
  profilePhotoName: string;
  selectedInventoryBikeId: string;
  bikeNickname: string;
  year: string;
  make: string;
  model: string;
  passengerSetup: string;
  comfortNotes: string;
  bikePhotoNames: string[];
  updatedAt: string;
};

function getRequests() {
  if (typeof window === "undefined") return [] as RideRequest[];
  return JSON.parse(localStorage.getItem("rr_ride_requests") || "[]") as RideRequest[];
}

function saveRequests(requests: RideRequest[]) {
  localStorage.setItem("rr_ride_requests", JSON.stringify(requests));
}

function getFileName(form: FormData, fieldName: string) {
  const file = form.get(fieldName);
  return file instanceof File && file.name ? file.name : "";
}

function getFileNames(form: FormData, fieldName: string) {
  return form.getAll(fieldName).filter((file): file is File => file instanceof File && Boolean(file.name)).map((file) => file.name);
}

export default function RiderDashboardPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [session, setSession] = useState<RiderSession | null>(null);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [saved, setSaved] = useState(false);
  const [garageSaved, setGarageSaved] = useState(false);
  const [garage, setGarage] = useState<RiderGarage | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    const storedSession = localStorage.getItem("rr_rider_session");
    if (!isSignedIn && !storedSession) {
      router.push("/rider-login");
      return;
    }

    if (storedSession) {
      setSession(JSON.parse(storedSession));
    } else if (user) {
      setSession({
        riderName: user.fullName || user.primaryEmailAddress?.emailAddress || "Rider",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.primaryPhoneNumber?.phoneNumber || "",
        ridingStyle: "Add your riding style",
        motorcycle: "Add your motorcycle",
        availability: "Add your availability",
        loginAt: new Date().toISOString()
      });
    }

    setRequests(getRequests());
    setGarage(JSON.parse(localStorage.getItem("rr_rider_garage") || "null"));
  }, [isLoaded, isSignedIn, router, user]);

  const openRequests = useMemo(() => requests.filter((request) => !request.status.toLowerCase().includes("accepted") && !request.status.toLowerCase().includes("declined")), [requests]);
  const acceptedRequests = useMemo(() => requests.filter((request) => request.status.toLowerCase().includes("accepted")), [requests]);

  function updateRideStatus(index: number, status: string) {
    const next = requests.map((request, requestIndex) => requestIndex === index ? { ...request, status } : request);
    setRequests(next);
    saveRequests(next);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: RiderSession = {
      riderName: String(form.get("riderName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      ridingStyle: String(form.get("ridingStyle") || ""),
      motorcycle: String(form.get("motorcycle") || ""),
      availability: String(form.get("availability") || ""),
      loginAt: session?.loginAt || new Date().toISOString()
    };
    localStorage.setItem("rr_rider_session", JSON.stringify(next));
    setSession(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function saveGarage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selectedInventoryBikeId = String(form.get("selectedInventoryBikeId") || motorcycleInventory[0].id);
    const selectedBike = motorcycleInventory.find((bike) => bike.id === selectedInventoryBikeId) || motorcycleInventory[0];
    const profilePhotoName = getFileName(form, "profilePhoto") || garage?.profilePhotoName || "";
    const uploadedBikePhotoNames = getFileNames(form, "bikePhotos");
    const bikePhotoNames = uploadedBikePhotoNames.length > 0 ? uploadedBikePhotoNames : garage?.bikePhotoNames || [];
    const next: RiderGarage = {
      profilePhotoName,
      selectedInventoryBikeId,
      bikeNickname: String(form.get("bikeNickname") || ""),
      year: String(form.get("year") || selectedBike.year),
      make: String(form.get("make") || selectedBike.make),
      model: String(form.get("model") || selectedBike.model),
      passengerSetup: String(form.get("passengerSetup") || ""),
      comfortNotes: String(form.get("comfortNotes") || ""),
      bikePhotoNames,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem("rr_rider_garage", JSON.stringify(next));
    setGarage(next);
    setGarageSaved(true);
    window.setTimeout(() => setGarageSaved(false), 2500);
  }

  if (!session) {
    return <main className="min-h-screen bg-rr-radial p-10 text-white">Loading rider portal...</main>;
  }

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Rider dashboard</div>
            <h1 className="rr-metal-text mt-3 text-5xl font-black">Welcome, {session.riderName}</h1>
            <p className="mt-4 max-w-3xl text-rr-chrome">Review ride requests, manage your rider profile, and keep your motorcycle garage ready for passenger bookings.</p>
          </div>
          <SignOutButton redirectUrl="/rider-login">
            <button className="rounded-full border border-white/10 px-5 py-3 text-sm text-rr-silver hover:border-rr-purple/60">Log out</button>
          </SignOutButton>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Open ride requests</div><div className="mt-2 text-4xl font-black">{openRequests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Accepted rides</div><div className="mt-2 text-4xl font-black">{acceptedRequests.length}</div></div>
          <div className="rr-card rounded-3xl p-6"><div className="text-sm text-rr-chrome">Garage photos</div><div className="mt-2 text-4xl font-black">{garage?.bikePhotoNames?.length || 0}</div></div>
          <Link href="/request" className="rr-card rounded-3xl p-6 text-rr-silver hover:border-rr-purple/60">Create test passenger request</Link>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-8">
            <form onSubmit={saveProfile} className="rr-card rounded-[2rem] p-7">
              <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Rider profile</div>
              <h2 className="mt-2 text-2xl font-black">Profile details</h2>
              {saved ? <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">Profile saved.</div> : null}
              <div className="mt-5 grid gap-4">
                <label className={labelClass}>Rider name<input name="riderName" defaultValue={session.riderName} className={inputClass} required /></label>
                <label className={labelClass}>Email<input type="email" name="email" defaultValue={session.email} className={inputClass} required /></label>
                <label className={labelClass}>Phone<input name="phone" defaultValue={session.phone} className={inputClass} /></label>
                <label className={labelClass}>Riding style<input name="ridingStyle" defaultValue={session.ridingStyle} className={inputClass} /></label>
                <label className={labelClass}>Primary motorcycle<input name="motorcycle" defaultValue={session.motorcycle} className={inputClass} /></label>
                <label className={labelClass}>Availability<textarea name="availability" defaultValue={session.availability} rows={4} className={inputClass} /></label>
                <button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Save profile</button>
              </div>
            </form>

            <form onSubmit={saveGarage} className="rr-card rounded-[2rem] p-7">
              <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Rider garage</div>
              <h2 className="mt-2 text-2xl font-black">Bike inventory and photos</h2>
              <p className="mt-2 text-sm leading-6 text-rr-chrome">Select the closest inventory model, add your exact bike details, upload your profile picture, and upload photos of your own motorcycle. Prototype stores filenames only.</p>
              {garageSaved ? <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">Garage saved.</div> : null}
              <div className="mt-5 grid gap-4">
                <label className={labelClass}>Profile picture<input type="file" name="profilePhoto" accept="image/*" className={inputClass} /></label>
                <label className={labelClass}>Inventory model<select name="selectedInventoryBikeId" defaultValue={garage?.selectedInventoryBikeId || motorcycleInventory[0].id} className={inputClass}>{motorcycleInventory.map((bike) => <option key={bike.id} value={bike.id}>{bike.make} {bike.model}</option>)}</select></label>
                <label className={labelClass}>Bike nickname<input name="bikeNickname" defaultValue={garage?.bikeNickname || ""} className={inputClass} placeholder="The couch rocket, Big Red, etc." /></label>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className={labelClass}>Year<input name="year" defaultValue={garage?.year || ""} className={inputClass} /></label>
                  <label className={labelClass}>Make<input name="make" defaultValue={garage?.make || ""} className={inputClass} /></label>
                  <label className={labelClass}>Model<input name="model" defaultValue={garage?.model || ""} className={inputClass} /></label>
                </div>
                <label className={labelClass}>Passenger setup<textarea name="passengerSetup" defaultValue={garage?.passengerSetup || ""} rows={3} className={inputClass} placeholder="Passenger seat, pegs, backrest, floorboards, trunk, comms, luggage..." /></label>
                <label className={labelClass}>Passenger comfort notes<textarea name="comfortNotes" defaultValue={garage?.comfortNotes || ""} rows={3} className={inputClass} placeholder="Best for short rides, long rides, nervous first-time passengers, taller passengers..." /></label>
                <label className={labelClass}>Upload bike photos<input type="file" name="bikePhotos" accept="image/*" multiple className={inputClass} /></label>
                <button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Save garage</button>
              </div>
            </form>

            <div className="rr-card rounded-[2rem] p-7">
              <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Public preview</div>
              <h2 className="mt-2 text-2xl font-black">How the rider/bike profile appears</h2>
              <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-rr-purple/40 bg-rr-purple/10 text-lg font-black">{garage?.profilePhotoName ? "IMG" : session.riderName.slice(0, 2).toUpperCase()}</div>
                  <div><div className="text-xl font-black">{session.riderName}</div><div className="text-sm text-rr-chrome">{session.ridingStyle}</div></div>
                </div>
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-rr-silver">
                  <strong className="text-white">Bike:</strong> {garage?.year || "Year"} {garage?.make || "Make"} {garage?.model || "Model"}<br />
                  <strong className="text-white">Nickname:</strong> {garage?.bikeNickname || "Not set"}<br />
                  <strong className="text-white">Passenger setup:</strong> {garage?.passengerSetup || "Not set"}<br />
                  <strong className="text-white">Bike photos:</strong> {garage?.bikePhotoNames?.length ? garage.bikePhotoNames.join(", ") : "No bike photos uploaded yet"}<br />
                  <strong className="text-white">Profile image:</strong> {garage?.profilePhotoName || "No profile picture uploaded yet"}
                </div>
              </div>
            </div>
          </div>

          <section>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.34em] text-rr-purple">Ride request inbox</div>
                <h2 className="mt-2 text-2xl font-black">Passenger requests</h2>
              </div>
              <Link href="/admin" className="text-sm text-rr-purple">Admin view →</Link>
            </div>
            <div className="mt-5 grid gap-4">
              {requests.length === 0 ? <div className="rr-card rounded-3xl p-6 text-rr-chrome">No passenger requests yet. Create one from the Request Ride page.</div> : null}
              {requests.map((request, index) => (
                <article key={`${request.createdAt}-${index}`} className="rr-card rounded-3xl p-6">
                  <div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{request.status}</div>
                  <h3 className="mt-3 text-2xl font-black">{request.passengerName}</h3>
                  <p className="mt-2 text-rr-chrome">{request.experience} · {request.selectedBikeName || request.motorcycle}</p>
                  <p className="mt-2 text-sm text-rr-silver">Requested rider: {request.selectedRiderName || "Any approved rider"}</p>
                  <p className="mt-2 text-sm text-rr-silver">{request.date} at {request.time} · {request.duration}</p>
                  <p className="mt-2 text-sm text-rr-silver">Phone: {request.phone} · Emergency contact: {request.emergencyContact}</p>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver">
                      <strong className="text-white">Route:</strong><br />
                      Pickup: {request.pickupLocation || "Not captured"}<br />
                      Drop-off: {request.dropoffLocation || "Not captured"}<br />
                      Preference: {request.routePreference || "Not captured"}<br />
                      Estimate: {request.estimatedDistance || "Pending"} · {request.estimatedRideTime || "Pending"}<br />
                      Notes: {request.riderNotes || "None"}
                    </div>
                    <MockRouteMap pickup={request.pickupLocation} dropoff={request.dropoffLocation} compact />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button onClick={() => updateRideStatus(index, `Accepted by ${session.riderName}`)} className="rounded-full bg-rr-purple px-4 py-2 text-sm">Accept ride</button>
                    <button onClick={() => updateRideStatus(index, `Needs follow-up from ${session.riderName}`)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Ask follow-up</button>
                    <button onClick={() => updateRideStatus(index, `Declined by ${session.riderName}`)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-rr-silver">Decline</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
