-- Ride Relax Supabase schema draft
-- Safe starting point for MVP v1: scheduled/manual ride requests.
-- Run in Supabase SQL Editor after creating a new project.

create extension if not exists "pgcrypto";

create type user_role as enum ('passenger', 'rider', 'admin');
create type account_status as enum ('active', 'restricted', 'disabled');
create type rider_approval_status as enum ('draft', 'submitted', 'document_review', 'bike_review', 'approved', 'restricted', 'revoked', 'declined');
create type rider_access_status as enum ('active', 'restricted', 'revoked');
create type motorcycle_approval_status as enum ('pending', 'approved', 'rejected', 'restricted');
create type ride_status as enum ('draft', 'submitted', 'admin_review', 'sent_to_rider', 'accepted_by_rider', 'scheduled', 'en_route_to_pickup', 'passenger_onboard', 'completed', 'cancelled', 'declined', 'needs_follow_up');
create type document_type as enum ('driver_license', 'motorcycle_endorsement', 'insurance', 'waiver', 'incident_file');
create type verification_status as enum ('pending', 'valid', 'expiring_soon', 'expired', 'rejected', 'missing');

create table user_accounts (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique,
  role user_role not null,
  display_name text not null,
  email text not null,
  phone text,
  status account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table passenger_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_accounts(id) on delete cascade,
  legal_name text not null,
  date_of_birth date,
  emergency_contact_name text,
  emergency_contact_phone text,
  comfort_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table rider_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_accounts(id) on delete cascade,
  legal_name text not null,
  display_name text not null,
  years_riding integer,
  home_area text,
  bio text,
  profile_photo_url text,
  approval_status rider_approval_status not null default 'draft',
  access_status rider_access_status not null default 'restricted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table motorcycles (
  id uuid primary key default gen_random_uuid(),
  owner_rider_id uuid references rider_profiles(id) on delete set null,
  source_inventory_id text,
  year text not null,
  make text not null,
  model text not null,
  category text not null,
  color text,
  engine_size text,
  description text,
  passenger_comfort_rating integer check (passenger_comfort_rating between 1 and 5),
  has_passenger_seat boolean not null default false,
  has_passenger_foot_pegs boolean not null default false,
  has_passenger_backrest boolean not null default false,
  has_luggage boolean not null default false,
  has_bluetooth boolean not null default false,
  has_heated_seat boolean not null default false,
  has_passenger_intercom boolean not null default false,
  approval_status motorcycle_approval_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table motorcycle_photos (
  id uuid primary key default gen_random_uuid(),
  motorcycle_id uuid not null references motorcycles(id) on delete cascade,
  storage_path text not null,
  public_url text,
  caption text,
  sort_order integer not null default 0,
  approved_for_marketplace boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ride_experiences (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  area text not null,
  duration_minutes_min integer not null,
  duration_minutes_max integer not null,
  mileage_cap integer,
  base_price_cents integer not null default 0,
  price_mode text not null default 'time_package',
  description text not null,
  destination text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ride_requests (
  id uuid primary key default gen_random_uuid(),
  passenger_id uuid references passenger_profiles(id) on delete set null,
  rider_id uuid references rider_profiles(id) on delete set null,
  motorcycle_id uuid references motorcycles(id) on delete set null,
  experience_id uuid references ride_experiences(id) on delete set null,
  status ride_status not null default 'submitted',
  requested_date date not null,
  requested_time time not null,
  duration_minutes integer not null,
  pickup_address text not null,
  pickup_lat numeric,
  pickup_lng numeric,
  dropoff_address text not null,
  dropoff_lat numeric,
  dropoff_lng numeric,
  route_preference text,
  passenger_notes text,
  estimated_distance_miles numeric,
  estimated_duration_minutes integer,
  legal_release_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table passenger_releases (
  id uuid primary key default gen_random_uuid(),
  passenger_id uuid references passenger_profiles(id) on delete set null,
  ride_request_id uuid references ride_requests(id) on delete cascade,
  release_version text not null,
  date_of_birth date not null,
  emergency_contact_confirmed boolean not null default false,
  helmet_acknowledged boolean not null default false,
  sober_acknowledged boolean not null default false,
  risk_acknowledged boolean not null default false,
  medical_acknowledged boolean not null default false,
  conduct_acknowledged boolean not null default false,
  media_consent boolean not null default false,
  initials text not null,
  electronic_signature text not null,
  signed_at timestamptz not null default now(),
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table ride_requests add constraint ride_requests_legal_release_fk foreign key (legal_release_id) references passenger_releases(id) on delete set null;

create table rider_documents (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid not null references rider_profiles(id) on delete cascade,
  document_type document_type not null,
  storage_path text not null,
  original_file_name text not null,
  extracted_expiration_date date,
  manually_entered_expiration_date date,
  verification_status verification_status not null default 'pending',
  reviewed_by_admin_id uuid references user_accounts(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ride_status_events (
  id uuid primary key default gen_random_uuid(),
  ride_request_id uuid not null references ride_requests(id) on delete cascade,
  from_status ride_status,
  to_status ride_status not null,
  actor_user_id uuid references user_accounts(id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table rider_location_pings (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid not null references rider_profiles(id) on delete cascade,
  ride_request_id uuid references ride_requests(id) on delete set null,
  lat numeric not null,
  lng numeric not null,
  heading numeric,
  speed_mph numeric,
  accuracy_meters numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_accounts(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  read_at timestamptz,
  related_ride_request_id uuid references ride_requests(id) on delete set null,
  related_document_id uuid references rider_documents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_user_accounts_clerk_user_id on user_accounts(clerk_user_id);
create index idx_user_accounts_role on user_accounts(role);
create index idx_ride_requests_status on ride_requests(status);
create index idx_ride_requests_rider_id on ride_requests(rider_id);
create index idx_ride_requests_passenger_id on ride_requests(passenger_id);
create index idx_rider_documents_rider_id on rider_documents(rider_id);
create index idx_rider_documents_verification_status on rider_documents(verification_status);
create index idx_rider_location_pings_rider_id_created_at on rider_location_pings(rider_id, created_at desc);

-- Basic updated_at trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_user_accounts_updated_at before update on user_accounts for each row execute function set_updated_at();
create trigger set_passenger_profiles_updated_at before update on passenger_profiles for each row execute function set_updated_at();
create trigger set_rider_profiles_updated_at before update on rider_profiles for each row execute function set_updated_at();
create trigger set_motorcycles_updated_at before update on motorcycles for each row execute function set_updated_at();
create trigger set_motorcycle_photos_updated_at before update on motorcycle_photos for each row execute function set_updated_at();
create trigger set_ride_experiences_updated_at before update on ride_experiences for each row execute function set_updated_at();
create trigger set_ride_requests_updated_at before update on ride_requests for each row execute function set_updated_at();
create trigger set_passenger_releases_updated_at before update on passenger_releases for each row execute function set_updated_at();
create trigger set_rider_documents_updated_at before update on rider_documents for each row execute function set_updated_at();
create trigger set_notifications_updated_at before update on notifications for each row execute function set_updated_at();
