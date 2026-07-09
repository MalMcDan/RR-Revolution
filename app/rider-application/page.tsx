"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PrototypeNav } from "../../components/prototype-nav";
import { motorcycleInventory, type RiderApplication } from "../../lib/prototype-data";

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-rr-purple";
const labelClass = "text-sm font-medium text-rr-silver";
const checkboxClass = "flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-rr-silver";

function getUploadedFileName(form: FormData, fieldName: string) {
  const file = form.get(fieldName);
  if (file instanceof File && file.name) return file.name;
  return "";
}

function getUploadedFileNames(form: FormData, fieldName: string) {
  return form.getAll(fieldName).filter((file): file is File => file instanceof File && Boolean(file.name)).map((file) => file.name);
}

export default function RiderApplicationPage() {
  const router = useRouter();

  function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selectedInventoryBikeId = String(form.get("selectedInventoryBikeId") || motorcycleInventory[0].id);
    const selectedInventoryBike = motorcycleInventory.find((bike) => bike.id === selectedInventoryBikeId) || motorcycleInventory[0];
    const application = {
      riderName: String(form.get("riderName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      dateOfBirth: String(form.get("dateOfBirth") || ""),
      legalAddress: String(form.get("legalAddress") || ""),
      yearsRiding: String(form.get("yearsRiding") || ""),
      endorsement: String(form.get("endorsement") || ""),
      insurance: String(form.get("insurance") || ""),
      licenseNumberLast4: String(form.get("licenseNumberLast4") || ""),
      licenseState: String(form.get("licenseState") || ""),
      selectedInventoryBikeId,
      selectedInventoryBikeName: `${selectedInventoryBike.year} ${selectedInventoryBike.make} ${selectedInventoryBike.model}`,
      motorcycle: String(form.get("motorcycle") || ""),
      availability: String(form.get("availability") || ""),
      motorcyclePhotoNames: getUploadedFileNames(form, "motorcyclePhotos"),
      idDocumentName: getUploadedFileName(form, "idDocument"),
      idExpirationDate: String(form.get("idExpirationDate") || ""),
      insuranceDocumentName: getUploadedFileName(form, "insuranceDocument"),
      insuranceExpirationDate: String(form.get("insuranceExpirationDate") || ""),
      backgroundCheckConsent: form.get("backgroundCheckConsent") === "on",
      backgroundCheckStatus: "Not ordered",
      licenseMonitoringConsent: form.get("licenseMonitoringConsent") === "on",
      licenseMonitoringStatus: "Not started",
      licenseStatus: "Pending admin verification",
      contractorAgreementAccepted: form.get("contractorAgreementAccepted") === "on",
      contractorAgreementSignature: String(form.get("contractorAgreementSignature") || ""),
      contractorAgreementSignedAt: new Date().toISOString(),
      onboardingStep: "Submitted for admin review",
      documentExtractionMode: "Prototype: date entered manually. Production: OCR/document extraction reads expiration date from uploaded image.",
      accessStatus: "Locked pending admin approval",
      status: "Pending admin approval",
      createdAt: new Date().toISOString()
    } as RiderApplication & Record<string, unknown>;
    const existing = JSON.parse(localStorage.getItem("rr_rider_applications") || "[]");
    localStorage.setItem("rr_rider_applications", JSON.stringify([application, ...existing]));
    router.push("/confirmation");
  }

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Rider onboarding</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Apply to ride with Ride Relax</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">Riders apply first. Admin reviews identity, documents, insurance, background-check consent, contractor agreement, and motorcycle setup before the rider gets active access.</p>
        <form onSubmit={submitApplication} className="rr-card mt-8 grid gap-6 rounded-[2rem] p-8">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Step 1</div>
            <h2 className="mt-2 text-2xl font-black">Legal identity</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className={labelClass}>Legal name<input name="riderName" required className={inputClass} /></label>
              <label className={labelClass}>Email<input type="email" name="email" required className={inputClass} /></label>
              <label className={labelClass}>Phone<input name="phone" required className={inputClass} /></label>
              <label className={labelClass}>Date of birth<input type="date" name="dateOfBirth" required className={inputClass} /></label>
              <label className={`${labelClass} md:col-span-2`}>Legal address<input name="legalAddress" required className={inputClass} placeholder="Street, city, state, ZIP" /></label>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Step 2</div>
            <h2 className="mt-2 text-2xl font-black">Riding credentials</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className={labelClass}>Years riding<input name="yearsRiding" required className={inputClass} placeholder="8 years" /></label>
              <label className={labelClass}>License state<input name="licenseState" required className={inputClass} placeholder="VA" /></label>
              <label className={labelClass}>Driver license last 4<input name="licenseNumberLast4" required maxLength={4} className={inputClass} placeholder="1234" /></label>
              <label className={labelClass}>Motorcycle endorsement<select name="endorsement" required className={inputClass}><option>Current motorcycle endorsement</option><option>Permit only</option><option>Needs review</option></select></label>
              <label className={labelClass}>Insurance<select name="insurance" required className={inputClass}><option>Current insurance</option><option>Will upload proof</option><option>Needs review</option></select></label>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-rr-purple/30 bg-rr-purple/5 p-5">
            <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Step 3</div>
            <h2 className="mt-2 text-2xl font-black">Marketplace bike approval</h2>
            <p className="mt-2 text-sm leading-6 text-rr-chrome">This is the bike category/model passengers will choose from. Admin approval publishes you to this selected bike in the request flow.</p>
            <label className={`${labelClass} mt-5 block`}>Closest inventory model<select name="selectedInventoryBikeId" required className={inputClass}>{motorcycleInventory.map((bike) => <option key={bike.id} value={bike.id}>{bike.year} {bike.make} {bike.model}</option>)}</select></label>
            <label className={`${labelClass} mt-5 block`}>Exact motorcycle details<textarea name="motorcycle" required className={inputClass} rows={4} placeholder="Example: 2015 Indian Scout, passenger pillion, backrest, saddlebags, stereo system..." /></label>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Step 4</div>
            <h2 className="mt-2 text-2xl font-black">Photos and compliance documents</h2>
            <p className="mt-2 text-sm leading-6 text-rr-chrome">Prototype stores file names. Production should use private Supabase Storage for ID/insurance and restricted admin-only access.</p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className={labelClass}>Motorcycle photo gallery<input type="file" name="motorcyclePhotos" accept="image/*" multiple className={inputClass} /></label>
              <label className={labelClass}>Upload rider ID image/PDF<input type="file" name="idDocument" accept="image/*,.pdf" required className={inputClass} /></label>
              <label className={labelClass}>ID expiration date<input type="date" name="idExpirationDate" required className={inputClass} /></label>
              <label className={labelClass}>Upload insurance image/PDF<input type="file" name="insuranceDocument" accept="image/*,.pdf" required className={inputClass} /></label>
              <label className={labelClass}>Insurance expiration date<input type="date" name="insuranceExpirationDate" required className={inputClass} /></label>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-rr-purple/30 bg-rr-purple/5 p-5">
            <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Step 5</div>
            <h2 className="mt-2 text-2xl font-black">Background check and license monitoring</h2>
            <p className="mt-2 text-sm leading-6 text-rr-chrome">Production should connect this to a compliant background-check provider and motor vehicle record/license monitoring provider. This prototype records consent and admin status only.</p>
            <div className="mt-5 grid gap-3">
              <label className={checkboxClass}><input type="checkbox" name="backgroundCheckConsent" required className="mt-1" />I consent to a background check as part of Ride Relax rider onboarding.</label>
              <label className={checkboxClass}><input type="checkbox" name="licenseMonitoringConsent" required className="mt-1" />I consent to driver license / motorcycle endorsement verification and ongoing license-status monitoring where legally permitted.</label>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Step 6</div>
            <h2 className="mt-2 text-2xl font-black">Independent contractor agreement</h2>
            <p className="mt-2 text-sm leading-6 text-rr-chrome">Prototype agreement placeholder: Rider understands they are applying as an independent contractor / marketplace participant, not an employee. Final language must be drafted or reviewed by an attorney before launch.</p>
            <label className={`${checkboxClass} mt-5`}><input type="checkbox" name="contractorAgreementAccepted" required className="mt-1" />I acknowledge the contractor onboarding terms, safety expectations, document requirements, and admin approval process.</label>
            <label className={`${labelClass} mt-5 block`}>Electronic signature — type legal name<input name="contractorAgreementSignature" required className={inputClass} /></label>
          </div>

          <label className={labelClass}>Availability<textarea name="availability" required className={inputClass} rows={4} placeholder="Weekends, evenings, seasonal availability, preferred ride types..." /></label>
          <button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Submit rider onboarding application</button>
        </form>
      </section>
    </main>
  );
}
