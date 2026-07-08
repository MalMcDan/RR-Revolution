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

export const motorcycles = [
  {
    id: "vulcan-650",
    name: "Kawasaki Vulcan S 650",
    category: "Cruiser",
    comfort: "Good passenger comfort",
    features: ["Passenger pegs", "Low seat height", "Smooth cruiser ride"]
  },
  {
    id: "indian-scout",
    name: "Indian Scout",
    category: "Cruiser",
    comfort: "Classic cruiser feel",
    features: ["Iconic profile", "Strong engine", "Premium ride feel"]
  },
  {
    id: "touring-demo",
    name: "Touring Cruiser Demo",
    category: "Touring",
    comfort: "Best passenger comfort",
    features: ["Backrest", "Luggage", "Bluetooth", "Passenger intercom ready"]
  }
];

export const riders = [
  {
    id: "rider-001",
    name: "Approved Rider Preview",
    years: "8 years riding",
    style: "Calm scenic rides",
    status: "Approved"
  },
  {
    id: "rider-002",
    name: "Tour Guide Preview",
    years: "12 years riding",
    style: "Guided experience rides",
    status: "Pending admin review"
  }
];

export type RideRequest = {
  passengerName: string;
  phone: string;
  emergencyContact: string;
  experience: string;
  motorcycle: string;
  date: string;
  time: string;
  duration: string;
  safetyAccepted: boolean;
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
  status: string;
  createdAt: string;
};
