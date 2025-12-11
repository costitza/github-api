"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRepoSearch } from "@/components/github/useRepoSearch";
import { RepoInfoCard } from "@/components/github/RepoInfoCard";
import { PrDiffsCard } from "@/components/github/PrDiffsCard";
import { PreparedPayloadCard } from "@/components/github/PreparedPayloadCard";
import { SavedRepoCard } from "@/components/github/SavedRepoCard";

export default function RepoSearchCard() {
  const {
    name,
    setName,
    repo,
    setRepo,
    loading,
    error,
    data,
    pullDiffs,
    preparedForDb,
    savedRepo,
    onSubmit,
  } = useRepoSearch();

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub PR search setup</CardTitle>
        <CardDescription>
          Describe yourself and the repository you want to explore. If the repo
          exists, we&apos;ll pull some quick details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 text-left">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                placeholder="How should we call you in summaries?"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="repo">GitHub repository</Label>
              <Input
                id="repo"
                placeholder="owner/repo or just repo name"
                value={repo}
                onChange={(event) => setRepo(event.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Checking repository..." : "Check repository info"}
          </Button>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          {data && (
            <div className="mt-4 space-y-4 text-left">
              <RepoInfoCard repo={data} />
              <PrDiffsCard pullDiffs={pullDiffs} />
              <PreparedPayloadCard payload={preparedForDb} />
              <SavedRepoCard savedRepo={savedRepo ?? null} />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

