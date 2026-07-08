export const rideExperiences = [
  {
    id: "vb-oceanfront-strip-cruise",
    title: "VB Oceanfront Strip Cruise",
    area: "Virginia Beach Oceanfront",
    duration: "60-90 minutes",
    mileageCap: "Up to 25 miles",
    price: "$85 base",
    priceMode: "Time package with mileage cap",
    vibe: "Show-and-cruise energy",
    destination: "Atlantic Ave / Oceanfront strip",
    description: "A low-speed cruise experience inspired by the Oceanfront strip culture: see-and-be-seen, lights, music, beach energy, and photo-friendly stops."
  },
  {
    id: "vb-sunset-boardwalk-photo-run",
    title: "Sunset Boardwalk Photo Run",
    area: "Virginia Beach",
    duration: "90 minutes",
    mileageCap: "Up to 30 miles",
    price: "$105 base",
    priceMode: "Time package with photo stop",
    vibe: "Sunset photos + beach air",
    destination: "Oceanfront / Rudee Inlet area",
    description: "A relaxed sunset ride with planned stops for photos, helmet-off moments, and a passenger-friendly pace near the Oceanfront."
  },
  {
    id: "chesapeake-backroads-reset",
    title: "Chesapeake Backroads Reset",
    area: "Chesapeake / Deep Creek",
    duration: "2 hours",
    mileageCap: "Up to 55 miles",
    price: "$135 base",
    priceMode: "Time package with route guardrail",
    vibe: "Quiet roads and decompression",
    destination: "Deep Creek / rural Chesapeake edges",
    description: "A calm backroads loop for passengers who want fresh air, open road, and less city traffic. Kickstands Up-style reset ride."
  },
  {
    id: "great-dismal-edge-loop",
    title: "Great Dismal Edge Loop",
    area: "Chesapeake / Suffolk edge",
    duration: "2.5 hours",
    mileageCap: "Up to 70 miles",
    price: "$165 base",
    priceMode: "Longer time package",
    vibe: "Woodsy, quiet, reflective",
    destination: "Great Dismal Swamp edge roads",
    description: "A scenic nature-edge ride focused on quiet roads, shade, and calmer passenger pacing."
  },
  {
    id: "norfolk-waterfront-loop",
    title: "Norfolk Waterfront Loop",
    area: "Norfolk",
    duration: "90 minutes",
    mileageCap: "Up to 35 miles",
    price: "$105 base",
    priceMode: "Time package",
    vibe: "Urban waterfront cruise",
    destination: "Downtown Norfolk / waterfront views",
    description: "A city-waterfront ride with bridges, skyline views, and an easy route for passengers who want something social but not intense."
  },
  {
    id: "coffee-and-chrome-run",
    title: "Coffee & Chrome Run",
    area: "Hampton Roads",
    duration: "2 hours",
    mileageCap: "Up to 45 miles",
    price: "$125 base",
    priceMode: "Time package with planned stop",
    vibe: "Casual social ride",
    destination: "Coffee stop chosen by rider/passenger",
    description: "A short ride with a planned coffee stop, conversation break, and low-pressure passenger experience."
  },
  {
    id: "first-time-passenger-intro",
    title: "First-Time Passenger Intro",
    area: "Flexible local route",
    duration: "60 minutes",
    mileageCap: "Up to 15 miles",
    price: "$75 base",
    priceMode: "Intro package",
    vibe: "Gentle and confidence-building",
    destination: "Low-speed local roads",
    description: "A beginner-friendly experience with extra safety briefing, mounting/dismounting guidance, communication checks, and a short low-stress route."
  },
  {
    id: "bridge-lights-night-ride",
    title: "Bridge Lights Night Ride",
    area: "Norfolk / Portsmouth / Chesapeake",
    duration: "90 minutes",
    mileageCap: "Up to 35 miles",
    price: "$115 base",
    priceMode: "Night ride package",
    vibe: "Moody lights and city glow",
    destination: "Bridge and city light views",
    description: "A nighttime cruise built around lights, bridges, reflections, and a smooth route. Requires rider/admin night-ride approval."
  },
  {
    id: "date-night-scenic-cruise",
    title: "Date Night Scenic Cruise",
    area: "Hampton Roads",
    duration: "2 hours",
    mileageCap: "Up to 45 miles",
    price: "$150 base",
    priceMode: "Premium experience package",
    vibe: "Romantic, calm, memorable",
    destination: "Scenic stop selected before ride",
    description: "A premium two-up experience with a scenic stop, photos if approved, and a slower passenger-comfort-focused route."
  },
  {
    id: "colonial-yorktown-day-ride",
    title: "Colonial / Yorktown Day Ride",
    area: "Peninsula / Yorktown",
    duration: "3-4 hours",
    mileageCap: "Up to 100 miles",
    price: "$225 base",
    priceMode: "Extended route package",
    vibe: "Historic destination ride",
    destination: "Yorktown / Colonial-style scenic roads",
    description: "A longer destination ride for touring bikes and experienced passengers, with planned breaks and admin-reviewed route timing."
  },
  {
    id: "ksu-curvy-roads-sampler",
    title: "Kickstands Up Curvy Roads Sampler",
    area: "Hampton Roads outskirts",
    duration: "2-3 hours",
    mileageCap: "Up to 80 miles",
    price: "$175 base",
    priceMode: "Curated route package",
    vibe: "Curves, flow, and open-road energy",
    destination: "Rider-selected loop route",
    description: "Inspired by the Kickstands Up route concept: a curated loop that favors flow, scenic roads, and fewer boring straight-line segments."
  },
  {
    id: "custom-destination-request",
    title: "Custom Destination Request",
    area: "Admin-reviewed",
    duration: "Custom",
    mileageCap: "Quote required",
    price: "Custom quote",
    priceMode: "Admin review required",
    vibe: "Built around passenger request",
    destination: "Passenger-selected destination",
    description: "For longer trips, special events, proposals, birthdays, photo shoots, or destination rides that need rider/admin route review before approval."
  }
];

export function getExperienceById(experienceId: string) {
  return rideExperiences.find((experience) => experience.id === experienceId) || rideExperiences[0];
}
