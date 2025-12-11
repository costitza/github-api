"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

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

type DisplayRepo = {
  fullName: string;
  description: string | null;
  stargazers: number;
  forks: number;
  openIssues: number;
  language: string | null;
  htmlUrl: string;
  updatedAt: string;
  openPullRequests: number;
};

type PreparedForDb = {
  clerkId: string;
  repoName: string;
  repoOwner: string;
  repoUrl: string;
  repoDescription: string;
  repoPullRequests: string;
};

type GithubPull = {
  number: number;
  title: string;
  html_url: string;
  state: string;
};

type GithubRepo = {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
  name: string;
  owner: {
    login: string;
  };
};

export default function RepoSearchCard() {
  const { user } = useUser();

  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DisplayRepo | null>(null);
  const [preparedForDb, setPreparedForDb] = useState<PreparedForDb | null>(
    null,
  );

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
      const { Octokit } = await import("@octokit/core");
      const octokit = new Octokit();

      const [{ data: repoRaw }, { data: pulls }] = await Promise.all([
        octokit.request("GET /repos/{owner}/{repo}", {
          owner,
          repo: repoName,
        }),
        octokit.request("GET /repos/{owner}/{repo}/pulls", {
          owner,
          repo: repoName,
          state: "open",
          per_page: 20,
        }),
      ]);

      const repoData = repoRaw as GithubRepo;

      setData({
        fullName: repoData.full_name,
        description: repoData.description,
        stargazers: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        language: repoData.language,
        htmlUrl: repoData.html_url,
        updatedAt: repoData.updated_at,
        openPullRequests: Array.isArray(pulls) ? pulls.length : 0,
      });

      if (user?.id) {
        const pullList = (Array.isArray(pulls) ? pulls : []) as GithubPull[];
        const prSummary = {
          totalOpen: pullList.length,
          sample: pullList.slice(0, 5).map((pr) => ({
            number: pr.number,
            title: pr.title,
            url: pr.html_url,
            state: pr.state,
          })),
        };

        setPreparedForDb({
          clerkId: user.id,
          repoName: repoData.name,
          repoOwner: repoData.owner.login,
          repoUrl: repoData.html_url,
          repoDescription: repoData.description ?? "",
          repoPullRequests: JSON.stringify(prSummary),
        });
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err && "status" in err) {
        const anyErr = err as { status?: number };
        if (anyErr.status === 404) {
          setError("Repository not found. Check the owner and name.");
          return;
        }
      }

      setError("Something went wrong while talking to GitHub via Octokit.");
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
            <div className="mt-4 space-y-4 text-left">
              <div className="space-y-3 rounded-lg border bg-neutral-50 p-4 dark:bg-neutral-900/60">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <a
                      href={data.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold hover:underline"
                    >
                      {data.fullName}
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
                      {new Date(data.updatedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-neutral-600 dark:text-neutral-300">
                  <span>⭐ {data.stargazers.toLocaleString()} stars</span>
                  <span>🍴 {data.forks.toLocaleString()} forks</span>
                  <span>
                    🐛 {data.openIssues.toLocaleString()} open issues
                  </span>
                  <span>
                    🔀 {data.openPullRequests.toLocaleString()} open pull
                    requests
                  </span>
                </div>
              </div>

              {preparedForDb && (
                <div className="rounded-lg border bg-neutral-50 p-4 text-xs font-mono text-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-200">
                  <p className="mb-2 font-semibold">
                    Ready to save to Convex `githubRepos`:
                  </p>
                  <pre className="whitespace-pre-wrap wrap-break-word">
                    {JSON.stringify(preparedForDb, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}


