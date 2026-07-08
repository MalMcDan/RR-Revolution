export const experiences = [
  {
    id: "sunset-bridge-loop",
    title: "Sunset Bridge Loop",
    area: "Norfolk / Chesapeake",
    duration: "90 minutes",
    price: "$95 estimated",
    vibe: "Relaxed scenic cruise",
    description: "A calm evening ride over water views, city edges, and easy scenic roads. Built for passengers who want the motorcycle experience without chaos."
  },
  {
    id: "coastal-coffee-run",
    title: "Coastal Coffee Run",
    area: "Virginia Beach",
    duration: "2 hours",
    price: "$125 estimated",
    vibe: "Casual social ride",
    description: "A planned ride with a stop for coffee, photos, and a low-pressure introduction to riding as a passenger."
  },
  {
    id: "backroads-reset",
    title: "Backroads Reset",
    area: "Deep Creek / Suffolk edge",
    duration: "3 hours",
    price: "$175 estimated",
    vibe: "Open road reset",
    description: "A longer curated backroads ride focused on flow, fresh air, and a guided route away from heavy traffic."
  }
];

export const motorcycleInventory = [
  {
    id: "honda-gold-wing-tour",
    make: "Honda",
    model: "Gold Wing Tour",
    year: "2026",
    category: "Luxury touring",
    passengerFit: "Best for premium two-up comfort",
    vendorUrl: "https://powersports.honda.com/motorcycle/touring/gold-wing-tour",
    imageLabel: "Official Honda gallery available",
    sourceNote: "Honda lists the Gold Wing Tour as a luxury touring motorcycle with a 1833cc six-cylinder engine, full-coverage bodywork, 61-liter trunk, Apple CarPlay and Android Auto compatibility, and touring comfort for a passenger.",
    highlights: ["1833cc six-cylinder", "61-liter trunk", "Full-coverage bodywork", "Wireless Apple CarPlay / Android Auto", "Touring comfort"],
    comfortTags: ["Top passenger comfort", "Long ride friendly", "Luggage", "Wind protection"],
    visualTheme: "from-red-500/30 via-zinc-900 to-black"
  },
  {
    id: "harley-road-glide",
    make: "Harley-Davidson",
    model: "Road Glide",
    year: "2026",
    category: "Grand American touring",
    passengerFit: "Best for iconic touring/bagger experience",
    vendorUrl: "https://www.harley-davidson.com/us/en/motorcycles/road-glide.html",
    imageLabel: "Official Harley-Davidson gallery available",
    sourceNote: "Harley-Davidson lists the Road Glide with a Milwaukee-Eight 117 motor, redesigned Sharknose fairing, ride-tuned suspension, Skyline OS 12.3-inch display, available Apple CarPlay, and long-haul touring comfort.",
    highlights: ["Milwaukee-Eight 117", "Sharknose fairing", "105 HP", "130 ft-lbs torque", "Skyline OS display"],
    comfortTags: ["Classic bagger", "Wind management", "Touring seat", "Passenger intercom capable"],
    visualTheme: "from-orange-500/30 via-zinc-900 to-black"
  },
  {
    id: "bmw-r1300rt",
    make: "BMW Motorrad",
    model: "R 1300 RT",
    year: "2026",
    category: "Sport touring",
    passengerFit: "Best for tech-forward touring comfort",
    vendorUrl: "https://www.bmwmotorcycles.com/en/models/tour/r1300rt.html",
    imageLabel: "Official BMW Motorrad gallery available",
    sourceNote: "BMW lists the R 1300 RT as a touring motorcycle with comfort and technology equipment, a 1,300cc boxer engine, 145 hp, 110 lb-ft torque, luggage options, and comfort passenger equipment with heated seats/grips/backrest options.",
    highlights: ["1,300cc boxer", "145 hp", "110 lb-ft torque", "Comfort passenger package", "Advanced rider assistance"],
    comfortTags: ["Sport touring", "Tech features", "Passenger comfort package", "Luggage"],
    visualTheme: "from-blue-500/30 via-zinc-900 to-black"
  }
];

export const riderProfiles = [
  {
    id: "rider-maya-honda",
    name: "Maya Carter",
    years: "10 years riding",
    style: "Luxury touring and calm scenic rides",
    status: "Approved",
    homeArea: "Chesapeake / Norfolk",
    rating: "4.9",
    completedRides: 128,
    bikeIds: ["honda-gold-wing-tour"],
    bio: "Patient rider focused on relaxed passenger comfort, smooth route planning, and scenic rides."
  },
  {
    id: "rider-dre-harley",
    name: "Dre Wilson",
    years: "12 years riding",
    style: "Classic cruiser and bagger experiences",
    status: "Approved",
    homeArea: "Virginia Beach",
    rating: "4.8",
    completedRides: 96,
    bikeIds: ["harley-road-glide"],
    bio: "Touring rider with a focus on iconic Harley experiences, coastal rides, and photo stops."
  },
  {
    id: "rider-sam-bmw",
    name: "Sam Rivera",
    years: "9 years riding",
    style: "Sport touring and longer road trips",
    status: "Approved",
    homeArea: "Norfolk / Hampton Roads",
    rating: "5.0",
    completedRides: 74,
    bikeIds: ["bmw-r1300rt"],
    bio: "Tech-forward touring rider comfortable with longer routes, passenger comfort checks, and navigation-heavy rides."
  },
  {
    id: "rider-jules-flex",
    name: "Jules Bennett",
    years: "15 years riding",
    style: "Flexible touring coverage",
    status: "Approved",
    homeArea: "Hampton Roads",
    rating: "4.9",
    completedRides: 211,
    bikeIds: ["honda-gold-wing-tour", "harley-road-glide", "bmw-r1300rt"],
    bio: "Senior approved rider available for overflow rides and premium scheduled experiences."
  }
];

export const motorcycles = motorcycleInventory.map((bike) => ({
  id: bike.id,
  name: `${bike.year} ${bike.make} ${bike.model}`,
  category: bike.category,
  comfort: bike.passengerFit,
  features: bike.highlights
}));

export const riders = riderProfiles.map((rider) => ({
  id: rider.id,
  name: rider.name,
  years: rider.years,
  style: rider.style,
  status: rider.status
}));

export type PassengerRelease = {
  passengerFullName: string;
  dateOfBirth: string;
  emergencyContactConfirmed: boolean;
  helmetAcknowledged: boolean;
  soberAcknowledged: boolean;
  riskAcknowledged: boolean;
  medicalAcknowledged: boolean;
  conductAcknowledged: boolean;
  mediaConsent: string;
  electronicSignature: string;
  initials: string;
  signedAt: string;
  releaseVersion: string;
};

export type RideRequest = {
  passengerName: string;
  phone: string;
  emergencyContact: string;
  pickupLocation: string;
  dropoffLocation: string;
  routePreference: string;
  riderNotes: string;
  estimatedDistance: string;
  estimatedRideTime: string;
  selectedBikeId: string;
  selectedBikeName: string;
  selectedRiderId: string;
  selectedRiderName: string;
  experience: string;
  motorcycle: string;
  date: string;
  time: string;
  duration: string;
  safetyAccepted: boolean;
  passengerRelease: PassengerRelease;
  status: string;
  createdAt: string;
};

export type RiderApplication = {
  riderName: string;
  email: string;
  phone: string;
  yearsRiding: string;
  endorsement: string;
  insurance: string;
  motorcycle: string;
  availability: string;
  motorcyclePhotoNames: string[];
  idDocumentName: string;
  idExpirationDate: string;
  insuranceDocumentName: string;
  insuranceExpirationDate: string;
  documentExtractionMode: string;
  accessStatus: string;
  status: string;
  createdAt: string;
};

export function estimateRoute(pickupLocation: string, dropoffLocation: string, duration: string) {
  const base = pickupLocation.length + dropoffLocation.length + duration.length;
  const miles = Math.max(6, Math.min(85, Math.round(base * 1.7)));
  const minutes = duration.includes("3") ? 180 : duration.includes("2") ? 120 : 90;
  return {
    estimatedDistance: `${miles} mi estimated`,
    estimatedRideTime: `${minutes} min planned`
  };
}

export function getBikeById(bikeId: string) {
  return motorcycleInventory.find((bike) => bike.id === bikeId) || motorcycleInventory[0];
}

export function getRidersForBike(bikeId: string) {
  return riderProfiles.filter((rider) => rider.bikeIds.includes(bikeId));
}

export function daysUntil(dateValue: string) {
  if (!dateValue) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expires = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(expires.getTime())) return null;
  const difference = expires.getTime() - today.getTime();
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

export function getDocumentStatus(application: RiderApplication) {
  const idDays = daysUntil(application.idExpirationDate);
  const insuranceDays = daysUntil(application.insuranceExpirationDate);
  const missingDocuments = !application.idDocumentName || !application.insuranceDocumentName || !application.idExpirationDate || !application.insuranceExpirationDate;
  const expired = idDays !== null && idDays < 0 || insuranceDays !== null && insuranceDays < 0;
  const expiringSoon = idDays !== null && idDays <= 30 && idDays >= 0 || insuranceDays !== null && insuranceDays <= 30 && insuranceDays >= 0;

  if (missingDocuments) {
    return {
      label: "Access revoked - missing document data",
      tone: "danger",
      adminNotice: "Rider access should stay revoked until ID and insurance images plus expiration dates are on file."
    };
  }

  if (expired) {
    return {
      label: "Access revoked - document expired",
      tone: "danger",
      adminNotice: "One or more compliance documents are expired. Rider access is revoked until renewed documents are uploaded."
    };
  }

  if (expiringSoon) {
    return {
      label: "30-day renewal warning",
      tone: "warning",
      adminNotice: "Notify admin and rider now. Renewed ID or insurance needs to be uploaded before expiration."
    };
  }

  return {
    label: "Documents current",
    tone: "ok",
    adminNotice: "ID and insurance are current."
  };
}
