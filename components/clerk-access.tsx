"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export function ClerkAccess({
  roleLabel,
  dashboardPath,
  title,
  description
}: {
  roleLabel: string;
  dashboardPath: string;
  title: string;
  description: string;
}) {
  const { user } = useUser();

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="text-xs uppercase tracking-[0.42em] text-rr-purple">{roleLabel} access</div>
      <h1 className="rr-metal-text mt-3 text-5xl font-black">{title}</h1>
      <p className="mt-4 max-w-3xl text-rr-chrome">{description}</p>

      <SignedOut>
        <div className="rr-card mt-8 rounded-[2rem] p-8">
          <h2 className="text-2xl font-black">Sign in or create an account</h2>
          <p className="mt-3 text-sm leading-6 text-rr-chrome">
            This now uses Clerk authentication. Your account is real and will persist outside this browser.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <SignInButton mode="modal" forceRedirectUrl={dashboardPath}>
              <button className="rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">Log in</button>
            </SignInButton>
            <SignUpButton mode="modal" forceRedirectUrl={dashboardPath}>
              <button className="rounded-full border border-white/10 px-6 py-3 text-rr-silver hover:border-rr-purple/60">Create account</button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="rr-card mt-8 rounded-[2rem] p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black">You are signed in</h2>
              <p className="mt-2 text-sm text-rr-chrome">
                {user?.primaryEmailAddress?.emailAddress || "Your Clerk account is active."}
              </p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
          <Link href={dashboardPath} className="mt-6 inline-flex rounded-full bg-rr-purple px-6 py-3 font-semibold shadow-glow">
            Continue to dashboard
          </Link>
        </div>
      </SignedIn>
    </section>
  );
}
