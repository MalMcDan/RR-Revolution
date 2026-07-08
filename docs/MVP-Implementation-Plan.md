# Ride Relax MVP Implementation Plan

This document captures the next technical step after the clickable prototype.

## Current state

The app currently has a browser-local prototype for:

- Passenger/user account screens
- Rider account screens
- Admin account screens
- Ride request flow
- Passenger release/sign-off
- Motorcycle inventory
- Bike-to-rider matching
- Rider garage/profile
- Ride experiences and pricing packages
- Admin live-ops map prototype
- Compliance/document expiration prototype

Prototype data currently lives in browser `localStorage` and static TypeScript arrays.

## Next engineering milestone

**MVP v1: Scheduled Ride Request System**

The next phase should wire the existing flows into real infrastructure while keeping the product scope scheduled/manual.

### Recommended stack

- Next.js app router
- Clerk for authentication and role metadata
- Supabase Postgres for app data
- Supabase Storage or Cloudflare R2 for uploaded files
- Mapbox for route preview and future live map layers
- Stripe Checkout later, after scheduling workflow is stable

## Domain model

The backend-ready TypeScript domain model lives in:

```txt
/lib/domain-schema.ts
```

It includes:

- users
- passenger profiles
- rider profiles
- motorcycles
- motorcycle photos
- ride experiences
- ride requests
- passenger releases
- rider documents
- ride status events
- rider location pings
- notifications

## Workflow helpers

Status and compliance helpers live in:

```txt
/lib/status-workflow.ts
```

These helpers define:

- ride status labels
- allowed ride status transitions
- prototype status mapping
- document expiration checks
- rider access revocation rule

## Demo seed structure

The future database seed shape lives in:

```txt
/lib/demo-seed-data.ts
```

This pulls from the current prototype inventory and ride experiences so the demo data can be migrated into Supabase/Postgres later.

## MVP database tables

Recommended first Supabase tables:

```txt
user_accounts
passenger_profiles
rider_profiles
motorcycles
motorcycle_photos
ride_experiences
ride_requests
passenger_releases
rider_documents
ride_status_events
notifications
```

Live map tables can come after the scheduled ride MVP:

```txt
rider_location_pings
ride_route_snapshots
incident_reports
```

## Suggested build order

1. Add Clerk auth and role guards.
2. Create Supabase schema from `/lib/domain-schema.ts`.
3. Move ride experiences and motorcycle inventory into database seed data.
4. Replace user/rider/admin localStorage accounts with Clerk sessions.
5. Replace ride request localStorage with Supabase `ride_requests`.
6. Replace passenger release localStorage with `passenger_releases`.
7. Replace document/photo filename-only prototype with real storage uploads.
8. Replace mock map route preview with Mapbox address search and route preview.
9. Add Stripe Checkout for accepted/scheduled rides.
10. Add realtime rider GPS only after scheduled/manual flow is stable.

## Product guardrail

Ride Relax is not an Uber clone. Keep the MVP focused on:

- scheduled rides
- manual rider approval
- manual motorcycle approval
- manual/admin oversight
- passenger waiver
- emergency contact
- bike/rider matching
- route/package experiences

Avoid instant dispatch, surge pricing, and automatic matching until the core trust/safety workflow is stable.
