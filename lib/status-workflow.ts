import type { RideStatus, VerificationStatus } from "./domain-schema";

export const rideStatusLabels: Record<RideStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  admin_review: "Admin review",
  sent_to_rider: "Sent to rider",
  accepted_by_rider: "Accepted by rider",
  scheduled: "Scheduled",
  en_route_to_pickup: "En route to pickup",
  passenger_onboard: "Passenger onboard",
  completed: "Completed",
  cancelled: "Cancelled",
  declined: "Declined",
  needs_follow_up: "Needs follow-up"
};

export const rideStatusFlow: RideStatus[] = [
  "submitted",
  "admin_review",
  "sent_to_rider",
  "accepted_by_rider",
  "scheduled",
  "en_route_to_pickup",
  "passenger_onboard",
  "completed"
];

const allowedTransitions: Record<RideStatus, RideStatus[]> = {
  draft: ["submitted", "cancelled"],
  submitted: ["admin_review", "sent_to_rider", "needs_follow_up", "declined", "cancelled"],
  admin_review: ["sent_to_rider", "needs_follow_up", "declined", "cancelled"],
  sent_to_rider: ["accepted_by_rider", "needs_follow_up", "declined", "cancelled"],
  accepted_by_rider: ["scheduled", "en_route_to_pickup", "cancelled"],
  scheduled: ["en_route_to_pickup", "cancelled"],
  en_route_to_pickup: ["passenger_onboard", "needs_follow_up", "cancelled"],
  passenger_onboard: ["completed", "needs_follow_up", "cancelled"],
  completed: [],
  cancelled: [],
  declined: [],
  needs_follow_up: ["admin_review", "sent_to_rider", "declined", "cancelled"]
};

export function canTransitionRide(fromStatus: RideStatus, toStatus: RideStatus) {
  return allowedTransitions[fromStatus]?.includes(toStatus) ?? false;
}

export function getNextRideStatuses(currentStatus: RideStatus) {
  return allowedTransitions[currentStatus] || [];
}

export function mapPrototypeStatusToWorkflowStatus(status: string): RideStatus {
  const normalized = status.toLowerCase();
  if (normalized.includes("passenger onboard")) return "passenger_onboard";
  if (normalized.includes("en route")) return "en_route_to_pickup";
  if (normalized.includes("accepted")) return "accepted_by_rider";
  if (normalized.includes("declined")) return "declined";
  if (normalized.includes("follow")) return "needs_follow_up";
  if (normalized.includes("submitted to")) return "sent_to_rider";
  if (normalized.includes("review")) return "admin_review";
  return "submitted";
}

export function daysUntilExpiration(dateValue?: string) {
  if (!dateValue) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expirationDate = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(expirationDate.getTime())) return null;
  return Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getVerificationStatus(expirationDate?: string): VerificationStatus {
  const days = daysUntilExpiration(expirationDate);
  if (days === null) return "missing";
  if (days < 0) return "expired";
  if (days <= 30) return "expiring_soon";
  return "valid";
}

export function shouldRevokeRiderAccess(documentStatuses: VerificationStatus[]) {
  return documentStatuses.some((status) => status === "missing" || status === "expired" || status === "rejected");
}
