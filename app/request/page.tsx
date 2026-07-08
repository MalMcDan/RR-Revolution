"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PrototypeNav } from "../../components/prototype-nav";
import { MockRouteMap } from "../../components/mock-route-map";
import { estimateRoute, experiences, getBikeById, motorcycleInventory, type PassengerRelease, type RideRequest } from "../../lib/prototype-data";
import { getApprovedPrototypeRidersForBike, type ApprovedPrototypeRider } from "../../lib/prototype-rider-marketplace";

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-rr-purple";
const labelClass = "text-sm font-medium text-rr-silver";
const checkboxLabelClass = "flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-rr-silver";

function RiderAvatar({ rider }: { rider: ApprovedPrototypeRider }) {
  const initials = rider.name.slice(0, 2).toUpperCase();
  return rider.profilePhotoUrl ? <img src={rider.profilePhotoUrl} alt={`${rider.name} profile`} className="h-16 w-16 rounded-full border border-rr-purple/40 object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-full border border-rr-purple/40 bg-rr-purple/10 text-lg font-black">{initials}</div>;
}

export default function RequestPage() {
  const [error, setError] = useState("");
  const [pickupPreview, setPickupPreview] = useState("Downtown Norfolk, VA");
  const [dropoffPreview, setDropoffPreview] = useState("Virginia Beach Oceanfront");
  const [selectedBikeId, setSelectedBikeId] = useState(motorcycleInventory[0].id);
  const [matchedRiders, setMatchedRiders] = useState<ApprovedPrototypeRider[]>([]);
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const riders = getApprovedPrototypeRidersForBike(selectedBikeId);
    setMatchedRiders(riders);
    setSelectedRiderId((current) => riders.some((rider) => rider.id === current) ? current : riders[0]?.id || "");
  }, [selectedBikeId]);

  function chooseBike(bikeId: string) {
    setSelectedBikeId(bikeId);
  }

  const selectedBike = useMemo(() => getBikeById(selectedBikeId), [selectedBikeId]);
  const selectedRider = useMemo(() => matchedRiders.find((rider) => rider.id === selectedRiderId), [matchedRiders, selectedRiderId]);

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const safetyAccepted = form.get("safetyAccepted") === "on";
    const requiredReleaseChecks = ["emergencyContactConfirmed", "helmetAcknowledged", "soberAcknowledged", "riskAcknowledged", "medicalAcknowledged", "conductAcknowledged"];
    const missingReleaseCheck = requiredReleaseChecks.some((field) => form.get(field) !== "on");
    const passengerName = String(form.get("passengerName") || "");
    const signature = String(form.get("electronicSignature") || "");
    const pickupLocation = String(form.get("pickupLocation") || "");
    const dropoffLocation = String(form.get("dropoffLocation") || "");
    const duration = String(form.get("duration") || "");
    const bikeId = String(form.get("selectedBikeId") || selectedBikeId);
    const riderId = String(form.get("selectedRiderId") || selectedRiderId);
    const selectedBike = getBikeById(bikeId);
    const selectedRider = matchedRiders.find((rider) => rider.id === riderId);
    const routeEstimate = estimateRoute(pickupLocation, dropoffLocation, duration);

    if (!selectedRider) {
      setError("Please choose an approved rider for the selected bike. If you just approved a rider in Admin, refresh this request page and select the rider's approved bike.");
      return;
    }

    if (!safetyAccepted || missingReleaseCheck) {
      setError("All required safety and legal release acknowledgments must be checked before submitting a ride request.");
      return;
    }

    if (signature.trim().toLowerCase() !== passengerName.trim().toLowerCase()) {
      setError("The electronic signature must match the passenger name exactly for this prototype release.");
      return;
    }

    const passengerRelease: PassengerRelease = {
      passengerFullName: passengerName,
      dateOfBirth: String(form.get("dateOfBirth") || ""),
      emergencyContactConfirmed: form.get("emergencyContactConfirmed") === "on",
      helmetAcknowledged: form.get("helmetAcknowledged") === "on",
      soberAcknowledged: form.get("soberAcknowledged") === "on",
      riskAcknowledged: form.get("riskAcknowledged") === "on",
      medicalAcknowledged: form.get("medicalAcknowledged") === "on",
      conductAcknowledged: form.get("conductAcknowledged") === "on",
      mediaConsent: String(form.get("mediaConsent") || "No"),
      electronicSignature: signature,
      initials: String(form.get("initials") || ""),
      signedAt: new Date().toISOString(),
      releaseVersion: "RR passenger release prototype v0.1 - attorney review required"
    };

    const selectedBikeName = `${selectedBike.year} ${selectedBike.make} ${selectedBike.model}`;
    const request: RideRequest = {
      passengerName,
      phone: String(form.get("phone") || ""),
      emergencyContact: String(form.get("emergencyContact") || ""),
      pickupLocation,
      dropoffLocation,
      routePreference: String(form.get("routePreference") || ""),
      riderNotes: String(form.get("riderNotes") || ""),
      estimatedDistance: routeEstimate.estimatedDistance,
      estimatedRideTime: routeEstimate.estimatedRideTime,
      selectedBikeId: selectedBike.id,
      selectedBikeName,
      selectedRiderId: selectedRider.id,
      selectedRiderName: selectedRider.name,
      experience: String(form.get("experience") || ""),
      motorcycle: selectedBikeName,
      date: String(form.get("date") || ""),
      time: String(form.get("time") || ""),
      duration,
      safetyAccepted,
      passengerRelease,
      status: `Submitted to ${selectedRider.name} for review`,
      createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem("rr_ride_requests") || "[]");
    localStorage.setItem("rr_ride_requests", JSON.stringify([request, ...existing]));
    router.push("/confirmation");
  }

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Passenger flow</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Request a scheduled ride</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">Choose pickup and drop-off points, choose a motorcycle model, select an approved rider matched to that bike, sign the release, and submit the request.</p>

        {error ? <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-100">{error}</div> : null}

        <form onSubmit={submitRequest} className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rr-card grid gap-6 rounded-[2rem] p-8">
            <div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>Passenger legal name<input name="passengerName" required className={inputClass} placeholder="Full legal name" /></label><label className={labelClass}>Date of birth<input type="date" name="dateOfBirth" required className={inputClass} /></label><label className={labelClass}>Phone<input name="phone" required className={inputClass} placeholder="Phone number" /></label><label className={labelClass}>Emergency contact<input name="emergencyContact" required className={inputClass} placeholder="Name and phone" /></label></div>

            <section className="rounded-[1.5rem] border border-rr-purple/30 bg-rr-purple/5 p-5"><div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Route request</div><h2 className="mt-2 text-2xl font-black">Pickup and drop-off</h2><p className="mt-2 text-sm leading-6 text-rr-chrome">Production will use Mapbox/Google Maps autocomplete and routing. This prototype saves typed locations and shows a mock route layer.</p><div className="mt-5 grid gap-5 md:grid-cols-2"><label className={labelClass}>Pickup location<input name="pickupLocation" required className={inputClass} defaultValue={pickupPreview} onChange={(event) => setPickupPreview(event.currentTarget.value)} /></label><label className={labelClass}>Drop-off location<input name="dropoffLocation" required className={inputClass} defaultValue={dropoffPreview} onChange={(event) => setDropoffPreview(event.currentTarget.value)} /></label></div><div className="mt-5 grid gap-5 md:grid-cols-2"><label className={labelClass}>Route preference<select name="routePreference" required className={inputClass}><option>Scenic / relaxed route</option><option>Fastest safe route</option><option>Avoid highways</option><option>Coastal / water views if possible</option><option>Rider recommendation</option></select></label><label className={labelClass}>Rider notes<input name="riderNotes" className={inputClass} placeholder="Gate code, parking, passenger comfort needs..." /></label></div></section>

            <section className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5"><div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Step 1</div><h2 className="mt-2 text-2xl font-black">Choose a motorcycle</h2><p className="mt-2 text-sm leading-6 text-rr-chrome">A rider only appears in the next step if Admin approved them for the bike model selected here.</p><input type="hidden" name="selectedBikeId" value={selectedBikeId} /><div className="mt-5 grid gap-4">{motorcycleInventory.map((bike) => { const checked = selectedBikeId === bike.id; return <button key={bike.id} type="button" onClick={() => chooseBike(bike.id)} className={`rounded-3xl border p-0 text-left transition ${checked ? "border-rr-purple bg-rr-purple/10 shadow-glow" : "border-white/10 bg-black/20 hover:border-rr-purple/50"}`}><div className={`h-28 rounded-t-3xl bg-gradient-to-br ${bike.visualTheme}`} /><div className="p-5"><div className="text-xs uppercase tracking-[0.28em] text-rr-purple">{bike.category}</div><h3 className="mt-2 text-xl font-black">{bike.year} {bike.make} {bike.model}</h3><p className="mt-2 text-sm text-rr-chrome">{bike.passengerFit}</p><div className="mt-3 flex flex-wrap gap-2 text-xs text-rr-silver">{bike.comfortTags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-3 py-1">{tag}</span>)}</div></div></button>; })}</div></section>

            <section className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Step 2</div>
              <h2 className="mt-2 text-2xl font-black">Choose an approved rider</h2>
              <p className="mt-2 text-sm leading-6 text-rr-chrome">Only active riders approved for the selected {selectedBike.make} {selectedBike.model} are shown.</p>
              <input type="hidden" name="selectedRiderId" value={selectedRiderId} />
              <div className="mt-5 grid gap-4">
                {matchedRiders.length === 0 ? <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-sm text-yellow-100">No approved active riders for this bike yet. Approve a rider from Admin, make sure their garage inventory model matches this bike, then refresh this page.</div> : null}
                {matchedRiders.map((rider) => {
                  const checked = selectedRiderId === rider.id;
                  const bikeImage = rider.bikePhotoUrls?.[0]?.url;
                  return <button key={rider.id} type="button" onClick={() => setSelectedRiderId(rider.id)} className={`overflow-hidden rounded-3xl border text-left transition ${checked ? "border-rr-purple bg-rr-purple/10 shadow-glow" : "border-white/10 bg-black/20 hover:border-rr-purple/50"}`}>{bikeImage ? <img src={bikeImage} alt={`${rider.name} bike`} className="h-44 w-full object-cover" /> : <div className="h-20 bg-gradient-to-br from-rr-purple/30 via-zinc-900 to-black" />}<div className="p-5"><div className="flex gap-4"><RiderAvatar rider={rider} /><div><div className="text-xs uppercase tracking-[0.25em] text-rr-purple">{rider.source === "approved-application" ? "New approved rider" : rider.status} · {rider.rating} stars · {rider.completedRides} rides</div><h3 className="mt-2 text-2xl font-black">{rider.name}</h3><p className="mt-1 text-sm text-rr-chrome">{rider.ownedBikeName || `${selectedBike.make} ${selectedBike.model}`}</p></div></div><p className="mt-4 text-sm text-rr-silver">{rider.bio}</p></div></button>;
                })}
              </div>
            </section>

            <div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>Experience<select name="experience" required className={inputClass}>{experiences.map((item) => <option key={item.id}>{item.title}</option>)}</select></label><div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-rr-silver"><strong className="text-white">Selected bike:</strong><br />{selectedBike.year} {selectedBike.make} {selectedBike.model}</div></div>
            <div className="grid gap-5 md:grid-cols-3"><label className={labelClass}>Date<input type="date" name="date" required className={inputClass} /></label><label className={labelClass}>Time<input type="time" name="time" required className={inputClass} /></label><label className={labelClass}>Duration<select name="duration" required className={inputClass}><option>90 minutes</option><option>2 hours</option><option>3 hours</option></select></label></div>

            <section className="rounded-[1.5rem] border border-rr-purple/30 bg-rr-purple/5 p-6"><div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Legal release template</div><h2 className="mt-2 text-2xl font-black">Passenger release, waiver, and safety agreement</h2><p className="mt-3 text-sm leading-6 text-rr-chrome">Prototype legal language: I understand that riding as a passenger on a motorcycle involves inherent risks, including serious injury, death, property damage, weather exposure, road hazards, actions of other drivers, mechanical issues, and other known or unknown risks. I voluntarily choose to participate in the requested motorcycle experience.</p><p className="mt-3 text-sm leading-6 text-rr-chrome">I agree to follow all rider and Ride Relax safety instructions. I understand that a helmet is required, closed-toe shoes are required, long pants are strongly recommended, and the rider or administrator may cancel or refuse the ride for safety concerns. I agree not to participate while impaired by alcohol, drugs, medication, exhaustion, or any condition that would make riding unsafe.</p><div className="mt-5 grid gap-3"><label className={checkboxLabelClass}><input type="checkbox" name="emergencyContactConfirmed" className="mt-1" />I confirm my emergency contact information is accurate.</label><label className={checkboxLabelClass}><input type="checkbox" name="helmetAcknowledged" className="mt-1" />I understand a helmet is required and the rider may refuse the ride if I do not meet safety requirements.</label><label className={checkboxLabelClass}><input type="checkbox" name="soberAcknowledged" className="mt-1" />I agree not to ride while impaired by alcohol, drugs, medication, or any unsafe condition.</label><label className={checkboxLabelClass}><input type="checkbox" name="riskAcknowledged" className="mt-1" />I understand motorcycle riding has inherent risk, including serious injury or death, and I voluntarily request this experience.</label><label className={checkboxLabelClass}><input type="checkbox" name="medicalAcknowledged" className="mt-1" />I confirm I am physically able to participate and will disclose any relevant medical or mobility concerns.</label><label className={checkboxLabelClass}><input type="checkbox" name="conductAcknowledged" className="mt-1" />I agree to follow rider instructions and understand unsafe conduct may end the ride without approval to continue.</label></div><div className="mt-5 grid gap-5 md:grid-cols-2"><label className={labelClass}>Photo/video consent<select name="mediaConsent" required className={inputClass}><option>No, do not use my image for marketing</option><option>Yes, Ride Relax may use ride photos/video for marketing</option></select></label><label className={labelClass}>Initials<input name="initials" required maxLength={5} className={inputClass} placeholder="RM" /></label></div><label className={`${labelClass} mt-5 block`}>Electronic signature — type passenger legal name exactly<input name="electronicSignature" required className={inputClass} placeholder="Full legal name" /></label></section>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5"><div className="font-semibold text-white">Final safety acknowledgment</div><p className="mt-2 text-sm leading-6 text-rr-chrome">Motorcycles involve inherent risk. Helmet required. Closed-toe shoes required. Long pants strongly recommended. No intoxication. Rider may refuse ride for safety.</p><label className="mt-4 flex gap-3 text-sm text-rr-silver"><input type="checkbox" name="safetyAccepted" className="mt-1" />I understand and accept these requirements.</label></div>
            <div className="flex flex-wrap gap-3"><button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Submit ride request to selected rider</button><Link href="/admin" className="rounded-full border border-white/10 px-6 py-3 text-rr-silver">Open admin</Link></div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <MockRouteMap pickup={pickupPreview} dropoff={dropoffPreview} />
            <div className="rr-card rounded-[2rem] p-6"><div className="text-xs uppercase tracking-[0.28em] text-rr-purple">Current selection</div><h3 className="mt-2 text-2xl font-black">{selectedBike.year} {selectedBike.make} {selectedBike.model}</h3><p className="mt-3 text-sm leading-6 text-rr-chrome">{selectedBike.passengerFit}</p><div className="mt-4 flex flex-wrap gap-2 text-xs text-rr-silver">{selectedBike.highlights.map((item) => <span key={item} className="rounded-full border border-white/10 px-3 py-1">{item}</span>)}</div><a href={selectedBike.vendorUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm text-rr-purple">View vendor source →</a></div>
            <div className="rr-card rounded-[2rem] p-6"><div className="text-xs uppercase tracking-[0.28em] text-rr-purple">Matched riders</div><p className="mt-2 text-sm leading-6 text-rr-chrome">{matchedRiders.length} approved active rider(s) can fulfill requests for this bike.</p>{matchedRiders.length > 0 ? <div className="mt-4 grid gap-2 text-sm text-rr-silver">{matchedRiders.map((rider) => <div key={rider.id} className="rounded-2xl border border-white/10 bg-black/30 p-3"><div className="flex items-center gap-3"><RiderAvatar rider={rider} /><div>{rider.name}<br /><span className="text-xs text-rr-chrome">{rider.ownedBikeName || "Approved motorcycle on file"}</span></div></div></div>)}</div> : null}</div>
            {selectedRider ? <div className="rr-card rounded-[2rem] p-6"><div className="text-xs uppercase tracking-[0.28em] text-rr-purple">Selected rider preview</div>{selectedRider.bikePhotoUrls?.[0]?.url ? <img src={selectedRider.bikePhotoUrls[0].url} alt={`${selectedRider.name} motorcycle`} className="mt-4 h-48 w-full rounded-2xl object-cover" /> : null}<div className="mt-4 flex items-center gap-3"><RiderAvatar rider={selectedRider} /><div><div className="font-black text-white">{selectedRider.name}</div><div className="text-sm text-rr-chrome">{selectedRider.ownedBikeName || "Approved rider"}</div></div></div></div> : null}
          </aside>
        </form>
      </section>
    </main>
  );
}
