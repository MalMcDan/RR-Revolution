import { motorcycleInventory, riderProfiles } from "./prototype-data";
import { rideExperiences } from "./ride-experiences";

export const demoSeedData = {
  users: [
    {
      id: "demo-passenger-1",
      role: "passenger",
      displayName: "Demo Passenger",
      email: "passenger@riderelax.demo",
      phone: "555-0101",
      status: "active"
    },
    {
      id: "demo-admin-1",
      role: "admin",
      displayName: "Demo Admin",
      email: "admin@riderelax.demo",
      phone: "555-0102",
      status: "active"
    }
  ],
  riders: riderProfiles.map((rider) => ({
    id: rider.id,
    displayName: rider.name,
    yearsRiding: rider.years,
    homeArea: rider.homeArea,
    bio: rider.bio,
    approvalStatus: "approved",
    accessStatus: "active",
    approvedBikeIds: rider.bikeIds
  })),
  motorcycles: motorcycleInventory.map((bike) => ({
    id: bike.id,
    year: bike.year,
    make: bike.make,
    model: bike.model,
    category: bike.category,
    passengerFit: bike.passengerFit,
    approvalStatus: "approved",
    vendorUrl: bike.vendorUrl
  })),
  rideExperiences: rideExperiences.map((experience) => ({
    id: experience.id,
    title: experience.title,
    area: experience.area,
    duration: experience.duration,
    mileageCap: experience.mileageCap,
    price: experience.price,
    priceMode: experience.priceMode,
    destination: experience.destination,
    isActive: true
  }))
};

export function getSeedSummary() {
  return {
    users: demoSeedData.users.length,
    riders: demoSeedData.riders.length,
    motorcycles: demoSeedData.motorcycles.length,
    rideExperiences: demoSeedData.rideExperiences.length
  };
}
