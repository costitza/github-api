"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type RepoInfo = {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
};

export default function RepoSearchCard() {
  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RepoInfo | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setData(null);

    const trimmedName = name.trim();
    const trimmedRepo = repo.trim();

    if (!trimmedName || !trimmedRepo) {
      setError("Please fill in both your name and repository.");
      return;
    }

    // If the user types "owner/repo" we trust that, otherwise we combine
    // their name as owner and the repo field as the repo name.
    const [owner, repoName] = trimmedRepo.includes("/")
      ? trimmedRepo.split("/")
      : [trimmedName, trimmedRepo];

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError("Repository not found. Check the owner and name.");
        } else {
          setError("Something went wrong while talking to GitHub.");
        }
        return;
      }

      const json = (await response.json()) as RepoInfo;
      setData(json);
    } catch {
      setError("Network error while talking to GitHub.");
    } finally {
      setLoading(false);
    }
  }

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
            <div className="mt-4 space-y-3 rounded-lg border bg-neutral-50 p-4 text-left dark:bg-neutral-900/60">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <a
                    href={data.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold hover:underline"
                  >
                    {data.full_name}
                  </a>
                  {data.description && (
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {data.description}
                    </p>
                  )}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 sm:text-right">
                  {data.language && <div>{data.language}</div>}
                  <div>
                    Updated:{" "}
                    {new Date(data.updated_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-neutral-600 dark:text-neutral-300">
                <span>⭐ {data.stargazers_count.toLocaleString()} stars</span>
                <span>🍴 {data.forks_count.toLocaleString()} forks</span>
                <span>
                  🐛 {data.open_issues_count.toLocaleString()} open issues
                </span>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}


