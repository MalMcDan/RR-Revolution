export function getIntegrationStatus() {
  return {
    clerkConfigured: Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY),
    supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseAdminConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    storageBucketsConfigured: Boolean(
      process.env.NEXT_PUBLIC_RIDER_PHOTOS_BUCKET &&
      process.env.NEXT_PUBLIC_MOTORCYCLE_PHOTOS_BUCKET &&
      process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET
    )
  };
}
