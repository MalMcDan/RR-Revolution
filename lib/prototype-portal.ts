export type PortalRole = "passenger" | "rider" | "admin";

export function isPortalRole(value: unknown): value is PortalRole {
  return value === "passenger" || value === "rider" || value === "admin";
}

export function getRoleDashboard(role: PortalRole) {
  if (role === "passenger") return "/user-dashboard";
  if (role === "rider") return "/rider-dashboard";
  return "/admin";
}

export function readClerkAppRole(publicMetadata: Record<string, unknown> | null | undefined) {
  const role = publicMetadata?.rrRole || publicMetadata?.role || publicMetadata?.appRole;
  return isPortalRole(role) ? role : null;
}

export function roleMatches(requiredRole: PortalRole, actualRole: PortalRole | null, allowPrototypeFallback = true) {
  if (actualRole) return actualRole === requiredRole;
  if (!allowPrototypeFallback) return false;
  return canAccessPortal(requiredRole);
}

export function setPortalIntent(role: PortalRole) {
  if (typeof window === "undefined") return;
  localStorage.setItem("rr_last_auth_role", role);
  localStorage.setItem("rr_portal_role", role);
  localStorage.setItem("rr_last_dashboard_path", getRoleDashboard(role));
}

export function getPortalIntent() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("rr_portal_role") || localStorage.getItem("rr_last_auth_role") || "";
}

export function canAccessPortal(role: PortalRole) {
  if (typeof window === "undefined") return false;
  if (role === "admin") return localStorage.getItem("rr_admin_unlocked") === "true" && getPortalIntent() === "admin";
  return getPortalIntent() === role;
}

export function unlockAdminPrototype() {
  if (typeof window === "undefined") return;
  setPortalIntent("admin");
  localStorage.setItem("rr_admin_unlocked", "true");
}

export function lockAdminPrototype() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rr_admin_unlocked");
}

export const passengerReservationSteps = ["Passenger", "Route", "Bike", "Rider", "Schedule", "Waiver", "Submit"];
export const riderRequestSteps = ["Review request", "Safety check", "Accept or follow up", "En route", "Passenger onboard", "Complete"];
