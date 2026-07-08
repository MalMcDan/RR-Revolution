-- Ride Relax Supabase storage bucket draft
-- Run after creating the Supabase project.
-- IMPORTANT: Documents bucket should remain private.

insert into storage.buckets (id, name, public)
values
  ('rr-rider-photos', 'rr-rider-photos', true),
  ('rr-motorcycle-photos', 'rr-motorcycle-photos', true),
  ('rr-private-documents', 'rr-private-documents', false)
on conflict (id) do nothing;

-- Production policies should be tightened with auth.uid(), role checks, and service-role uploads.
-- Keep private documents private: licenses, insurance, waivers, incident files.
