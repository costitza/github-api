import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-4 py-10 flex items-start justify-center">
      <SignedOut>
        <div className="w-full max-w-md text-center space-y-4 mt-24">
          <h1 className="text-2xl font-semibold tracking-tight">
            You&apos;re not signed in
          </h1>
          <p className="text-sm text-neutral-500">
            Sign in with Clerk to access your profile and GitHub PR workspace.
          </p>
          <SignInButton
            fallbackRedirectUrl="/dashboard"
            signUpFallbackRedirectUrl="/dashboard"
          >
            <Button className="w-full">Sign in or sign up</Button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="w-full max-w-5xl space-y-8">
          <header className="flex justify-end">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9",
                },
              }}
            />
          </header>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>GitHub PR search setup</CardTitle>
                <CardDescription>
                  Describe yourself and the repository you want to explore.
                  This is just UI — no API calls yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-5">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="name">Your name</Label>
                    <Input
                      id="name"
                      placeholder="How should we call you in summaries?"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <Label htmlFor="repo">GitHub repository</Label>
                    <Input
                      id="repo"
                      placeholder="e.g. vercel/next.js"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled
                  >
                    PR search coming soon
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </SignedIn>
    </main>
  );
}


