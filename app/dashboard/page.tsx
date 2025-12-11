import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
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

export default async function DashboardPage() {
  const user = await currentUser();
  const displayName =
    user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress;

  return (
    <main className="min-h-screen px-4 py-10 flex items-center justify-center">
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
        <div className="w-full max-w-3xl space-y-6">
          <section>
            <Card className="flex flex-row items-center justify-center gap-3">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-12 w-12",
                    },
                  }}
                />
                {displayName && (
                  <CardTitle className="text-xl font-semibold">
                    {displayName}
                  </CardTitle>
                )}
            </Card>
          </section>

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
                  <div className="grid gap-5 md:grid-cols-2">
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


