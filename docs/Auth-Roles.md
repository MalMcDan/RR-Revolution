# Ride Relax Auth and Role Authorization

Ride Relax has three separate portal roles:

- `passenger`
- `rider`
- `admin`

The application expects Clerk user public metadata to include:

```json
{
  "rrRole": "passenger"
}
```

Valid values are:

```txt
passenger
rider
admin
```

## Prototype behavior

During prototype testing, the app also uses local browser portal intent so the same test account can move between flows without requiring a full Clerk admin console setup.

The prototype keys are:

```txt
rr_portal_role
rr_last_auth_role
rr_admin_unlocked
```

This is not production security. It exists only so the prototype can be demonstrated before Clerk metadata and Supabase row-level security are fully wired.

## Production behavior target

Production should enforce roles in three layers:

1. Clerk public metadata for UI routing.
2. Server-side route guards for private pages and API routes.
3. Supabase row-level security for database and storage access.

## Admin security

Admin must never rely only on client-side UI hiding. Admin should require:

- Clerk authenticated session
- `rrRole: "admin"`
- server-side authorization on admin APIs
- Supabase policies that restrict admin tables and storage paths

## Rider/passenger dual-use accounts

A real person may be both a passenger and a rider. The app should avoid portal conflict by treating role access as explicit portal context:

- `/user-login` starts passenger context.
- `/rider-login` starts rider context.
- `/admin-login` starts admin context.

A production account can support multiple roles later by changing `rrRole` to `rrRoles`:

```json
{
  "rrRoles": ["passenger", "rider"]
}
```

For the MVP, use one active role per Clerk account unless and until multi-role account switching is intentionally designed.

## How to set a user role in Clerk

1. Open Clerk Dashboard.
2. Open Users.
3. Select the user.
4. Find Metadata.
5. Add public metadata:

```json
{
  "rrRole": "admin"
}
```

6. Save.
7. Have the user sign out and back in.

## Recommended MVP role rules

Passenger:
- Can access passenger dashboard.
- Can create ride requests.
- Can view own ride history.

Rider:
- Can access rider dashboard.
- Can manage rider profile and garage.
- Can view ride requests assigned to that rider.
- Can accept, follow up, start, and complete assigned rides.

Admin:
- Can access admin dashboard.
- Can approve/revoke riders.
- Can view all ride data, transaction data, documents, incidents, waivers, reports, and operational activity.
