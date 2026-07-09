# Rider Onboarding and Compliance Workflow

Ride Relax riders should not receive operational rider access until Admin approval is complete.

## Intended production flow

1. Rider submits onboarding application.
2. Rider provides legal identity details.
3. Rider uploads ID and insurance documents.
4. Rider maps their motorcycle to a marketplace inventory model.
5. Rider consents to background check.
6. Rider consents to license / endorsement verification and monitoring where legally permitted.
7. Rider accepts independent contractor / marketplace participation agreement.
8. Admin reviews documents and contract.
9. Admin orders background check through a compliant vendor.
10. Admin verifies motorcycle endorsement and license status through an approved provider or manual process.
11. Admin approves rider.
12. Approved rider is published to the passenger marketplace for their approved motorcycle.
13. Rider dashboard access is unlocked.

## Access rules

### Passenger

Passengers can create their own accounts and reserve rides.

### Rider

Riders can sign in, but rider dashboard access must stay locked until the rider is approved and active.

Prototype behavior:

- Rider account can sign in.
- Rider dashboard checks whether the signed-in email/name matches an approved active rider in local prototype storage.
- If not approved, the rider sees the onboarding lock screen.

Production behavior:

- Clerk user should have `rrRole: "rider"` only after the rider is approved, or use `rrRole: "rider_pending"` until approval.
- Supabase rider profile should track `status`, `accessStatus`, `backgroundCheckStatus`, `licenseStatus`, and `documentsStatus`.
- Server-side route guards should block rider API access unless rider is approved and active.

### Admin

Admin must be restricted.

Prototype behavior:

- Admin login uses Clerk.
- Admin page no longer uses a visible pass phrase.
- Lock view clears local admin intent.
- Log out admin signs out through Clerk.

Production behavior:

- Admin must require Clerk metadata `rrRole: "admin"`.
- Admin API routes must verify Clerk session server-side.
- Admin tables and private storage paths must be protected with Supabase policies.

## Documents

ID and insurance should be stored in private Supabase Storage, not public buckets.

Recommended buckets:

```txt
rr-private-documents
rr-rider-photos
rr-motorcycle-photos
```

ID and insurance previews should use short-lived signed URLs visible only to Admin and authorized compliance services.

## Expiration monitoring

The app should monitor:

- ID expiration date
- insurance expiration date
- license / endorsement status
- background-check renewal if required

Rules:

- Notify rider and admin 30 days before expiration.
- Notify again at 14 days, 7 days, and 1 day.
- If expired and no renewal is approved, set `accessStatus = "Access suspended"`.
- Suspended riders should disappear from passenger booking results.
- Existing rides assigned to a suspended/revoked rider should be flagged for admin reassignment.

## Background checks

Background checks must be handled through a compliant vendor and legal workflow. The prototype only records consent and status.

Potential integration model:

```txt
backgroundCheckStatus:
  Not ordered
  Ordered
  Pending
  Clear
  Review required
  Failed
```

## License monitoring

License monitoring should be handled through an approved MVR / license verification provider or manual admin process.

Potential integration model:

```txt
licenseMonitoringStatus:
  Not started
  Ordered
  Active
  Flagged
  Suspended
  Expired
```

## Contractor agreement

The current app includes placeholder contractor language only. Before launch, a lawyer should review:

- independent contractor / marketplace participant status
- safety requirements
- insurance requirements
- payment terms
- cancellation/refusal terms
- platform removal / suspension terms
- liability and indemnification language
- dispute resolution
- local/state compliance requirements
