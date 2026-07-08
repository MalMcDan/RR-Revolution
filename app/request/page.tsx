"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PrototypeNav } from "../../components/prototype-nav";
import { MockRouteMap } from "../../components/mock-route-map";
import { estimateRoute, experiences, motorcycles, type PassengerRelease, type RideRequest } from "../../lib/prototype-data";

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-rr-purple";
const labelClass = "text-sm font-medium text-rr-silver";
const checkboxLabelClass = "flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-rr-silver";

export default function RequestPage() {
  const [error, setError] = useState("");
  const [pickupPreview, setPickupPreview] = useState("Downtown Norfolk, VA");
  const [dropoffPreview, setDropoffPreview] = useState("Virginia Beach Oceanfront");
  const router = useRouter();

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
    const routeEstimate = estimateRoute(pickupLocation, dropoffLocation, duration);

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
      experience: String(form.get("experience") || ""),
      motorcycle: String(form.get("motorcycle") || ""),
      date: String(form.get("date") || ""),
      time: String(form.get("time") || ""),
      duration,
      safetyAccepted,
      passengerRelease,
      status: "Submitted for rider review",
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
        <p className="mt-4 max-w-3xl text-rr-chrome">Choose pickup and drop-off points, preview the route layer, sign the passenger release, and submit the request for rider review.</p>

        {error ? <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-100">{error}</div> : null}

        <form onSubmit={submitRequest} className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rr-card grid gap-6 rounded-[2rem] p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelClass}>Passenger legal name<input name="passengerName" required className={inputClass} placeholder="Full legal name" /></label>
              <label className={labelClass}>Date of birth<input type="date" name="dateOfBirth" required className={inputClass} /></label>
              <label className={labelClass}>Phone<input name="phone" required className={inputClass} placeholder="Phone number" /></label>
              <label className={labelClass}>Emergency contact<input name="emergencyContact" required className={inputClass} placeholder="Name and phone" /></label>
            </div>

            <section className="rounded-[1.5rem] border border-rr-purple/30 bg-rr-purple/5 p-5">
              <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Route request</div>
              <h2 className="mt-2 text-2xl font-black">Pickup and drop-off</h2>
              <p className="mt-2 text-sm leading-6 text-rr-chrome">Production will use Mapbox/Google Maps autocomplete and routing. This prototype saves typed locations and shows a mock route layer.</p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className={labelClass}>Pickup location<input name="pickupLocation" required className={inputClass} placeholder="Address, landmark, or area" defaultValue={pickupPreview} onChange={(event) => setPickupPreview(event.currentTarget.value)} /></label>
                <label className={labelClass}>Drop-off location<input name="dropoffLocation" required className={inputClass} placeholder="Address, landmark, or area" defaultValue={dropoffPreview} onChange={(event) => setDropoffPreview(event.currentTarget.value)} /></label>
              </div>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className={labelClass}>Route preference<select name="routePreference" required className={inputClass}><option>Scenic / relaxed route</option><option>Fastest safe route</option><option>Avoid highways</option><option>Coastal / water views if possible</option><option>Rider recommendation</option></select></label>
                <label className={labelClass}>Rider notes<input name="riderNotes" className={inputClass} placeholder="Gate code, parking, passenger comfort needs..." /></label>
              </div>
            </section>

            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelClass}>Experience<select name="experience" required className={inputClass}>{experiences.map((item) => <option key={item.id}>{item.title}</option>)}</select></label>
              <label className={labelClass}>Motorcycle<select name="motorcycle" required className={inputClass}>{motorcycles.map((bike) => <option key={bike.id}>{bike.name}</option>)}</select></label>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <label className={labelClass}>Date<input type="date" name="date" required className={inputClass} /></label>
              <label className={labelClass}>Time<input type="time" name="time" required className={inputClass} /></label>
              <label className={labelClass}>Duration<select name="duration" required className={inputClass}><option>90 minutes</option><option>2 hours</option><option>3 hours</option></select></label>
            </div>

            <section className="rounded-[1.5rem] border border-rr-purple/30 bg-rr-purple/5 p-6">
              <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Legal release template</div>
              <h2 className="mt-2 text-2xl font-black">Passenger release, waiver, and safety agreement</h2>
              <p className="mt-3 text-sm leading-6 text-rr-chrome">Prototype legal language: I understand that riding as a passenger on a motorcycle involves inherent risks, including serious injury, death, property damage, weather exposure, road hazards, actions of other drivers, mechanical issues, and other known or unknown risks. I voluntarily choose to participate in the requested motorcycle experience.</p>
              <p className="mt-3 text-sm leading-6 text-rr-chrome">I agree to follow all rider and Ride Relax safety instructions. I understand that a helmet is required, closed-toe shoes are required, long pants are strongly recommended, and the rider or administrator may cancel or refuse the ride for safety concerns. I agree not to participate while impaired by alcohol, drugs, medication, exhaustion, or any condition that would make riding unsafe.</p>
              <div className="mt-5 grid gap-3">
                <label className={checkboxLabelClass}><input type="checkbox" name="emergencyContactConfirmed" className="mt-1" />I confirm my emergency contact information is accurate.</label>
                <label className={checkboxLabelClass}><input type="checkbox" name="helmetAcknowledged" className="mt-1" />I understand a helmet is required and the rider may refuse the ride if I do not meet safety requirements.</label>
                <label className={checkboxLabelClass}><input type="checkbox" name="soberAcknowledged" className="mt-1" />I agree not to ride while impaired by alcohol, drugs, medication, or any unsafe condition.</label>
                <label className={checkboxLabelClass}><input type="checkbox" name="riskAcknowledged" className="mt-1" />I understand motorcycle riding has inherent risk, including serious injury or death, and I voluntarily request this experience.</label>
                <label className={checkboxLabelClass}><input type="checkbox" name="medicalAcknowledged" className="mt-1" />I confirm I am physically able to participate and will disclose any relevant medical or mobility concerns.</label>
                <label className={checkboxLabelClass}><input type="checkbox" name="conductAcknowledged" className="mt-1" />I agree to follow rider instructions and understand unsafe conduct may end the ride without approval to continue.</label>
              </div>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className={labelClass}>Photo/video consent<select name="mediaConsent" required className={inputClass}><option>No, do not use my image for marketing</option><option>Yes, Ride Relax may use ride photos/video for marketing</option></select></label>
                <label className={labelClass}>Initials<input name="initials" required maxLength={5} className={inputClass} placeholder="RM" /></label>
              </div>
              <label className={`${labelClass} mt-5 block`}>Electronic signature — type passenger legal name exactly<input name="electronicSignature" required className={inputClass} placeholder="Full legal name" /></label>
            </section>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="font-semibold text-white">Final safety acknowledgment</div>
              <p className="mt-2 text-sm leading-6 text-rr-chrome">Motorcycles involve inherent risk. Helmet required. Closed-toe shoes required. Long pants strongly recommended. No intoxication. Rider may refuse ride for safety.</p>
              <label className="mt-4 flex gap-3 text-sm text-rr-silver"><input type="checkbox" name="safetyAccepted" className="mt-1" />I understand and accept these requirements.</label>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Submit ride request and signed release</button>
              <Link href="/admin" className="rounded-full border border-white/10 px-6 py-3 text-rr-silver">Open admin</Link>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <MockRouteMap pickup={pickupPreview} dropoff={dropoffPreview} />
            <div className="rr-card rounded-[2rem] p-6">
              <div className="text-xs uppercase tracking-[0.28em] text-rr-purple">Wire-in later</div>
              <h3 className="mt-2 text-2xl font-black">Mapbox-ready route layer</h3>
              <p className="mt-3 text-sm leading-6 text-rr-chrome">Later this becomes live address autocomplete, geocoding, route distance, ride duration, map pins, rider navigation, and safety geofence checks.</p>
            </div>
          </aside>
        </form>
      </section>
    </main>
  );
}
