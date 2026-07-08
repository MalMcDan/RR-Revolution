import { getBikeById, motorcycleInventory, riderProfiles, type RiderApplication } from "./prototype-data";

export type ApprovedPrototypeRider = {
  id: string;
  name: string;
  years: string;
  style: string;
  status: string;
  accessStatus: string;
  homeArea: string;
  rating: string;
  completedRides: number;
  bikeIds: string[];
  bio: string;
  source: "seed" | "approved-application";
  applicationCreatedAt?: string;
  email?: string;
  phone?: string;
};

type RiderGarage = {
  selectedInventoryBikeId?: string;
  bikeNickname?: string;
  year?: string;
  make?: string;
  model?: string;
  passengerSetup?: string;
  comfortNotes?: string;
};

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function inferBikeId(application: RiderApplication, garage?: RiderGarage | null) {
  if (garage?.selectedInventoryBikeId) return garage.selectedInventoryBikeId;
  const searchText = `${application.motorcycle || ""} ${garage?.make || ""} ${garage?.model || ""}`.toLowerCase();
  const match = motorcycleInventory.find((bike) => {
    return searchText.includes(bike.make.toLowerCase().replace(" motorcycle", "")) && searchText.includes(bike.model.toLowerCase().split(" ")[0]);
  });
  return match?.id || motorcycleInventory[0].id;
}

export function getStoredApprovedRiders() {
  if (typeof window === "undefined") return [] as ApprovedPrototypeRider[];
  return safeParse<ApprovedPrototypeRider[]>(localStorage.getItem("rr_approved_riders"), []);
}

export function saveStoredApprovedRiders(riders: ApprovedPrototypeRider[]) {
  localStorage.setItem("rr_approved_riders", JSON.stringify(riders));
}

export function buildApprovedRiderFromApplication(application: RiderApplication, garage?: RiderGarage | null): ApprovedPrototypeRider {
  const bikeId = inferBikeId(application, garage);
  const bike = getBikeById(bikeId);
  const displayBike = garage?.year && garage?.make && garage?.model ? `${garage.year} ${garage.make} ${garage.model}` : `${bike.year} ${bike.make} ${bike.model}`;
  return {
    id: `approved-${slugify(application.email || application.riderName)}-${application.createdAt.replace(/[^0-9]/g, "")}`,
    name: application.riderName,
    years: application.yearsRiding || "Riding experience not listed",
    style: garage?.comfortNotes || application.availability || "Approved Ride Relax rider",
    status: "Approved",
    accessStatus: "Active",
    homeArea: "Hampton Roads",
    rating: "New",
    completedRides: 0,
    bikeIds: [bikeId],
    bio: `${application.riderName} is approved for ${displayBike}. Passenger setup: ${garage?.passengerSetup || "admin-approved two-up setup on file"}.`,
    source: "approved-application",
    applicationCreatedAt: application.createdAt,
    email: application.email,
    phone: application.phone
  };
}

export function approvePrototypeRider(application: RiderApplication) {
  const garage = safeParse<RiderGarage | null>(localStorage.getItem("rr_rider_garage"), null);
  const approvedRider = buildApprovedRiderFromApplication(application, garage);
  const existing = getStoredApprovedRiders();
  const next = [approvedRider, ...existing.filter((rider) => rider.applicationCreatedAt !== application.createdAt && rider.email !== application.email)];
  saveStoredApprovedRiders(next);
  return approvedRider;
}

export function revokePrototypeRider(application: RiderApplication) {
  const existing = getStoredApprovedRiders();
  const next = existing.map((rider) => {
    if (rider.applicationCreatedAt === application.createdAt || rider.email === application.email) {
      return { ...rider, status: "Revoked", accessStatus: "Revoked" };
    }
    return rider;
  });
  saveStoredApprovedRiders(next);
  return next;
}

export function getAllPrototypeRiders() {
  const stored = getStoredApprovedRiders().filter((rider) => rider.status === "Approved" && rider.accessStatus === "Active");
  return [...stored, ...riderProfiles.map((rider) => ({ ...rider, accessStatus: "Active", source: "seed" as const }))];
}

export function getApprovedPrototypeRidersForBike(bikeId: string) {
  return getAllPrototypeRiders().filter((rider) => rider.bikeIds.includes(bikeId));
}
