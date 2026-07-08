"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PrototypeNav } from "../../components/prototype-nav";
import { motorcycleInventory, type RiderApplication } from "../../lib/prototype-data";

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-rr-purple";
const labelClass = "text-sm font-medium text-rr-silver";

function getUploadedFileName(form: FormData, fieldName: string) {
  const file = form.get(fieldName);
  if (file instanceof File && file.name) return file.name;
  return "";
}

function getUploadedFileNames(form: FormData, fieldName: string) {
  return form
    .getAll(fieldName)
    .filter((file): file is File => file instanceof File && Boolean(file.name))
    .map((file) => file.name);
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
      yearsRiding: String(form.get("yearsRiding") || ""),
      endorsement: String(form.get("endorsement") || ""),
      insurance: String(form.get("insurance") || ""),
      selectedInventoryBikeId,
      selectedInventoryBikeName: `${selectedInventoryBike.year} ${selectedInventoryBike.make} ${selectedInventoryBike.model}`,
      motorcycle: String(form.get("motorcycle") || ""),
      availability: String(form.get("availability") || ""),
      motorcyclePhotoNames: getUploadedFileNames(form, "motorcyclePhotos"),
      idDocumentName: getUploadedFileName(form, "idDocument"),
      idExpirationDate: String(form.get("idExpirationDate") || ""),
      insuranceDocumentName: getUploadedFileName(form, "insuranceDocument"),
      insuranceExpirationDate: String(form.get("insuranceExpirationDate") || ""),
      documentExtractionMode: "Prototype: date entered manually. Production: OCR/document extraction reads expiration date from uploaded image.",
      accessStatus: "Pending document review",
      status: "Pending admin approval",
      createdAt: new Date().toISOString()
    } as RiderApplication & { selectedInventoryBikeId: string; selectedInventoryBikeName: string };
    const existing = JSON.parse(localStorage.getItem("rr_rider_applications") || "[]");
    localStorage.setItem("rr_rider_applications", JSON.stringify([application, ...existing]));
    router.push("/confirmation");
  }

  return (
    <main className="min-h-screen bg-rr-radial text-white">
      <PrototypeNav />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">Rider flow</div>
        <h1 className="rr-metal-text mt-3 text-5xl font-black">Apply to ride with Ride Relax</h1>
        <p className="mt-4 max-w-3xl text-rr-chrome">This prototype captures motorcycle photos, document uploads, expiration dates, and the inventory model Admin will approve you for.</p>
        <form onSubmit={submitApplication} className="rr-card mt-8 grid gap-6 rounded-[2rem] p-8">
          <div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>Rider name<input name="riderName" required className={inputClass} /></label><label className={labelClass}>Email<input type="email" name="email" required className={inputClass} /></label></div>
          <div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>Phone<input name="phone" required className={inputClass} /></label><label className={labelClass}>Years riding<input name="yearsRiding" required className={inputClass} placeholder="8 years" /></label></div>
          <div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>Motorcycle endorsement<select name="endorsement" required className={inputClass}><option>Current motorcycle endorsement</option><option>Permit only</option><option>Needs review</option></select></label><label className={labelClass}>Insurance<select name="insurance" required className={inputClass}><option>Current insurance</option><option>Will upload proof</option><option>Needs review</option></select></label></div>

          <div className="rounded-[1.5rem] border border-rr-purple/30 bg-rr-purple/5 p-5">
            <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Admin bike approval</div>
            <h2 className="mt-2 text-2xl font-black">Match your bike to the marketplace inventory</h2>
            <p className="mt-2 text-sm leading-6 text-rr-chrome">This is the bike category/model passengers will choose from. Admin approval publishes you to this selected bike in the request flow.</p>
            <label className={`${labelClass} mt-5 block`}>Closest inventory model<select name="selectedInventoryBikeId" required className={inputClass}>{motorcycleInventory.map((bike) => <option key={bike.id} value={bike.id}>{bike.year} {bike.make} {bike.model}</option>)}</select></label>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Motorcycle photos</div>
            <h2 className="mt-2 text-2xl font-black">Upload bike images</h2>
            <p className="mt-2 text-sm leading-6 text-rr-chrome">Add photos for the passenger-facing motorcycle profile. Recommended: front, side, passenger seat/backrest, luggage/storage, and any special features. The prototype stores file names only.</p>
            <label className={`${labelClass} mt-5 block`}>Motorcycle photo gallery<input type="file" name="motorcyclePhotos" accept="image/*" multiple className={inputClass} /></label>
          </div>

          <div className="rounded-[1.5rem] border border-rr-purple/30 bg-rr-purple/5 p-5">
            <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">Compliance documents</div>
            <h2 className="mt-2 text-2xl font-black">ID and insurance verification</h2>
            <p className="mt-2 text-sm leading-6 text-rr-chrome">Upload image files here. The prototype stores the file names and entered expiration dates locally. The future app should read expiration dates from the images, notify admin and rider 30 days before expiration, and revoke access if current documents are not on file.</p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className={labelClass}>Upload rider ID image<input type="file" name="idDocument" accept="image/*,.pdf" required className={inputClass} /></label>
              <label className={labelClass}>ID expiration date<input type="date" name="idExpirationDate" required className={inputClass} /></label>
              <label className={labelClass}>Upload insurance image<input type="file" name="insuranceDocument" accept="image/*,.pdf" required className={inputClass} /></label>
              <label className={labelClass}>Insurance expiration date<input type="date" name="insuranceExpirationDate" required className={inputClass} /></label>
            </div>
          </div>

          <label className={labelClass}>Exact motorcycle details<textarea name="motorcycle" required className={inputClass} rows={4} placeholder="Example: 2015 Indian Scout, passenger pillion, backrest, saddlebags, stereo system..." /></label>
          <label className={labelClass}>Availability<textarea name="availability" required className={inputClass} rows={4} placeholder="Weekends, evenings, seasonal availability, preferred ride types..." /></label>
          <button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Submit rider application</button>
        </form>
      </section>
    </main>
  );
}
