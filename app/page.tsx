import Link from "next/link";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Minimal GitHub helper
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Explore pull requests with a calm, focused dashboard.
          </h1>
          <p className="text-sm sm:text-base text-neutral-500">
            Sign in with Clerk, see your profile, and prepare a repository for
            PR insights. The logic comes later — this is just the canvas.
          </p>
        </div>

        <div className="space-y-3">
          <SignedOut>
            <SignInButton
              mode="modal"
              fallbackRedirectUrl="/dashboard"
              signUpFallbackRedirectUrl="/dashboard"
            >
              <Button className="w-full">Sign in or sign up with Clerk</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard" className="block">
              <Button className="w-full">Go to your dashboard</Button>
            </Link>
          </SignedIn>

          <p className="text-xs text-neutral-400">
            No GitHub access yet — we&apos;ll only add that once the UI feels
            right.
          </p>
        </div>
      </div>
    </main>
  );
}

