"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function RepoGrid() {
  const { user } = useUser();
  const reposWithPulls = useQuery(
    api.github.query.getReposWithPullsForUser,
    user?.id ? { clerkId: user.id } : "skip",
  );

  if (!user) {
    return null;
  }

  if (reposWithPulls === undefined) {
    return (
      <div className="text-sm text-neutral-500">
        Loading your repositories and pull requests...
      </div>
    );
  }

  if (!reposWithPulls || reposWithPulls.length === 0) {
    return (
      <div className="text-sm text-neutral-500">
        No linked repositories yet. Use the form above to add one.
      </div>
    );
  }

  const allPulls = reposWithPulls.flatMap(({ repo, pulls }) =>
    pulls.map((pr: any) => ({ pr, repo })),
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left: repositories */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Repositories
        </h3>
        {reposWithPulls.map(({ repo, pulls }) => (
          <div
            key={repo._id}
            className="rounded-xl border bg-white/60 p-4 text-sm shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <a
                href={repo.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="truncate font-medium hover:underline"
              >
                {repo.repoOwner}/{repo.repoName}
              </a>
              <span className="shrink-0 text-xs text-neutral-500">
                {pulls.length} PR{pulls.length === 1 ? "" : "s"}
              </span>
            </div>

            <p className="mb-3 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
              {repo.repoDescription || "No description provided."}
            </p>
          </div>
        ))}
      </div>

      {/* Right: pull requests */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Pull requests
        </h3>
        {allPulls.length === 0 ? (
          <div className="rounded-xl border bg-white/60 p-4 text-xs text-neutral-500 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60">
            No pull requests yet.
          </div>
        ) : (
          allPulls.slice(0, 12).map(({ pr, repo }: any) => (
            <div
              key={pr._id}
              className="rounded-xl border bg-white/60 p-3 text-xs shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <a
                  href={pr.pullRequestUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate font-medium hover:underline"
                >
                  #{pr.pullRequestNumber} {pr.pullRequestTitle}
                </a>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {pr.pullRequestState}
                </span>
              </div>
              <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                In {repo.repoOwner}/{repo.repoName}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


