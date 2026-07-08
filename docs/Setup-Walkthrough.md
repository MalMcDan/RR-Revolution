# Ride Relax Setup Walkthrough

This walkthrough is for moving the prototype toward a real working MVP.

The current deployed app will keep working while you do these steps. Do not put real customer/rider data in the prototype yet.

---

## Step 1: Create a Supabase project

1. Go to Supabase.
2. Click **New Project**.
3. Choose your organization.
4. Project name: `ride-relax` or `rr-revolution`.
5. Create a database password and save it somewhere safe.
6. Choose the closest region.
7. Click **Create new project**.

After the project is ready:

1. Go to **Project Settings**.
2. Go to **API**.
3. Copy:
   - Project URL
   - anon/public key
   - service role key
4. Go to **Project Settings > Database**.
5. Copy the connection string for `DATABASE_URL`.

Do not share the service role key publicly.

---

## Step 2: Run the database schema

In Supabase:

1. Open **SQL Editor**.
2. Click **New query**.
3. Copy everything from:

```txt
/supabase/schema.sql
```

4. Paste it into Supabase SQL Editor.
5. Click **Run**.

This creates the MVP tables for:

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

---

## Step 3: Create storage buckets

In Supabase SQL Editor:

1. Open a new query.
2. Copy everything from:

```txt
/supabase/storage-buckets.sql
```

3. Paste and run it.

This creates:

```txt
rr-rider-photos          public
rr-motorcycle-photos     public
rr-private-documents     private
```

Private documents are for licenses, insurance, waivers, and incident files.

---

## Step 4: Create Clerk application

1. Go to Clerk.
2. Create a new application.
3. Name it `Ride Relax`.
4. Enable email/password login for now.
5. Copy:
   - publishable key
   - secret key

Later, roles should be stored in Clerk public/private metadata:

```txt
role: passenger | rider | admin
```

---

## Step 5: Add environment variables in Vercel

In Vercel:

1. Open your `RR-Revolution` project.
2. Go to **Settings**.
3. Go to **Environment Variables**.
4. Add the values from `.env.example`.

Minimum values for the next wiring step:

```txt
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
```

Mapbox can wait until the map wiring step:

```txt
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
```

Stripe can wait until payments:

```txt
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

After adding variables, click **Redeploy** in Vercel.

---

## Step 6: What to send back to ChatGPT

After you create Supabase and Clerk, tell ChatGPT:

```txt
Supabase project is created.
Clerk app is created.
Environment variables are added to Vercel.
```

Do not paste secret keys into chat.

Then the next coding step is:

```txt
Wire Clerk auth into user/rider/admin role sessions.
Wire Supabase reads/writes for ride requests.
Replace localStorage accounts with real user records.
```

---

## Safety note

Before real launch, the legal release and safety language must be reviewed by an attorney and insurance professional. The prototype language is only a working placeholder.
