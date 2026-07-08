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
  ownedBikeName?: string;
  passengerSetup?: string;
  profilePhotoUrl?: string;
  bikePhotoUrls?: { name: string; url: string }[];
};

type RiderGarage = {
  selectedInventoryBikeId?: string;
  bikeNickname?: string;
  year?: string;
  make?: string;
  model?: string;
  passengerSetup?: string;
  comfortNotes?: string;
  profilePhotoUrl?: string;
  bikePhotoUrls?: { name: string; url: string }[];
};

type RiderApplicationWithBike = RiderApplication & {
  selectedInventoryBikeId?: string;
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

function normalize(value: string) {
  return value.toLowerCase().replace(/motorcycle|motorrad|b\.o\.s\.s\.|limited|classic|tour|lt/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function findBestInventoryMatch(searchText: string) {
  const normalizedSearch = normalize(searchText);
  if (!normalizedSearch) return null;

  const scored = motorcycleInventory.map((bike) => {
    const makeWords = normalize(bike.make).split(" ").filter(Boolean);
    const modelWords = normalize(bike.model).split(" ").filter(Boolean);
    let score = 0;

    for (const word of makeWords) if (normalizedSearch.includes(word)) score += 2;
    for (const word of modelWords) if (normalizedSearch.includes(word)) score += 4;
    if (normalizedSearch.includes(normalize(`${bike.make} ${bike.model}`))) score += 10;

    return { bike, score };
  }).sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0].bike : null;
}

function inferBikeId(application: RiderApplication, garage?: RiderGarage | null) {
  const app = application as RiderApplicationWithBike;
  if (app.selectedInventoryBikeId) return app.selectedInventoryBikeId;

  const garageText = `${garage?.year || ""} ${garage?.make || ""} ${garage?.model || ""}`;
  const garageMatch = findBestInventoryMatch(garageText);
  if (garageMatch) return garageMatch.id;
  if (garage?.selectedInventoryBikeId) return garage.selectedInventoryBikeId;

  const applicationMatch = findBestInventoryMatch(application.motorcycle || "");
  if (applicationMatch) return applicationMatch.id;

  return motorcycleInventory[0].id;
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
  const setup = garage?.passengerSetup || "admin-approved two-up setup on file";

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
    bio: `${application.riderName} is approved for ${displayBike}. Passenger setup: ${setup}.`,
    source: "approved-application",
    applicationCreatedAt: application.createdAt,
    email: application.email,
    phone: application.phone,
    ownedBikeName: displayBike,
    passengerSetup: setup,
    profilePhotoUrl: garage?.profilePhotoUrl || "",
    bikePhotoUrls: garage?.bikePhotoUrls || []
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

export function restorePrototypeRider(riderId: string) {
  const existing = getStoredApprovedRiders();
  const next = existing.map((rider) => rider.id === riderId ? { ...rider, status: "Approved", accessStatus: "Active" } : rider);
  saveStoredApprovedRiders(next);
  return next;
}

export function revokePrototypeRiderById(riderId: string) {
  const existing = getStoredApprovedRiders();
  const next = existing.map((rider) => rider.id === riderId ? { ...rider, status: "Revoked", accessStatus: "Revoked" } : rider);
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
