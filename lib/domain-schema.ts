export type UserRole = "passenger" | "rider" | "admin";

export type RideStatus =
  | "draft"
  | "submitted"
  | "admin_review"
  | "sent_to_rider"
  | "accepted_by_rider"
  | "scheduled"
  | "en_route_to_pickup"
  | "passenger_onboard"
  | "completed"
  | "cancelled"
  | "declined"
  | "needs_follow_up";

export type RiderApprovalStatus =
  | "draft"
  | "submitted"
  | "document_review"
  | "bike_review"
  | "approved"
  | "restricted"
  | "revoked"
  | "declined";

export type DocumentType = "driver_license" | "motorcycle_endorsement" | "insurance" | "waiver" | "incident_file";

export type VerificationStatus = "pending" | "valid" | "expiring_soon" | "expired" | "rejected" | "missing";

export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type UserAccount = BaseEntity & {
  role: UserRole;
  clerkUserId?: string;
  displayName: string;
  email: string;
  phone?: string;
  status: "active" | "restricted" | "disabled";
};

export type PassengerProfile = BaseEntity & {
  userId: string;
  legalName: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  comfortNotes?: string;
};

export type RiderProfile = BaseEntity & {
  userId: string;
  legalName: string;
  displayName: string;
  yearsRiding?: number;
  homeArea?: string;
  bio?: string;
  profilePhotoUrl?: string;
  approvalStatus: RiderApprovalStatus;
  accessStatus: "active" | "restricted" | "revoked";
};

export type Motorcycle = BaseEntity & {
  ownerRiderId?: string;
  sourceInventoryId?: string;
  year: string;
  make: string;
  model: string;
  category: string;
  color?: string;
  engineSize?: string;
  description?: string;
  passengerComfortRating?: 1 | 2 | 3 | 4 | 5;
  hasPassengerSeat: boolean;
  hasPassengerFootPegs: boolean;
  hasPassengerBackrest: boolean;
  hasLuggage: boolean;
  hasBluetooth: boolean;
  hasHeatedSeat: boolean;
  hasPassengerIntercom: boolean;
  approvalStatus: "pending" | "approved" | "rejected" | "restricted";
};

export type MotorcyclePhoto = BaseEntity & {
  motorcycleId: string;
  storagePath: string;
  publicUrl?: string;
  caption?: string;
  sortOrder: number;
  approvedForMarketplace: boolean;
};

export type RideExperience = BaseEntity & {
  title: string;
  area: string;
  durationMinutesMin: number;
  durationMinutesMax: number;
  mileageCap?: number;
  basePriceCents: number;
  priceMode: "time_package" | "custom_quote";
  description: string;
  destination?: string;
  isActive: boolean;
};

export type RideRequest = BaseEntity & {
  passengerId: string;
  riderId?: string;
  motorcycleId?: string;
  experienceId: string;
  status: RideStatus;
  requestedDate: string;
  requestedTime: string;
  durationMinutes: number;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  routePreference?: string;
  passengerNotes?: string;
  estimatedDistanceMiles?: number;
  estimatedDurationMinutes?: number;
  legalReleaseId?: string;
};

export type PassengerRelease = BaseEntity & {
  passengerId: string;
  rideRequestId: string;
  releaseVersion: string;
  dateOfBirth: string;
  emergencyContactConfirmed: boolean;
  helmetAcknowledged: boolean;
  soberAcknowledged: boolean;
  riskAcknowledged: boolean;
  medicalAcknowledged: boolean;
  conductAcknowledged: boolean;
  mediaConsent: boolean;
  initials: string;
  electronicSignature: string;
  signedAt: string;
  ipAddress?: string;
  userAgent?: string;
};

export type RiderDocument = BaseEntity & {
  riderId: string;
  documentType: DocumentType;
  storagePath: string;
  originalFileName: string;
  extractedExpirationDate?: string;
  manuallyEnteredExpirationDate?: string;
  verificationStatus: VerificationStatus;
  reviewedByAdminId?: string;
  reviewedAt?: string;
};

export type RideStatusEvent = BaseEntity & {
  rideRequestId: string;
  fromStatus?: RideStatus;
  toStatus: RideStatus;
  actorUserId?: string;
  note?: string;
};

export type RiderLocationPing = BaseEntity & {
  riderId: string;
  rideRequestId?: string;
  lat: number;
  lng: number;
  heading?: number;
  speedMph?: number;
  accuracyMeters?: number;
};

export type Notification = BaseEntity & {
  userId: string;
  type: "ride_update" | "document_expiring" | "document_expired" | "admin_review" | "payment";
  title: string;
  message: string;
  readAt?: string;
  relatedRideRequestId?: string;
  relatedDocumentId?: string;
};
