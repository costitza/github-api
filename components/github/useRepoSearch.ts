"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DisplayRepo,
  GithubPull,
  GithubPullFile,
  GithubRepo,
  PreparedForDb,
  PullDiffSummary,
} from "./repoTypes";

export function useRepoSearch() {
  const { user } = useUser();
  const addGithubRepo = useMutation(api.github.index.addGithubRepo);
  const upsertGithubPullRequests = useMutation(
    api.github.mutation.upsertGithubPullRequests,
  );
  const savedRepo = useQuery(
    api.github.query.getGithubRepoForUser,
    user?.id ? { clerkId: user.id } : "skip",
  );

  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DisplayRepo | null>(null);
  const [preparedForDb, setPreparedForDb] = useState<PreparedForDb | null>(
    null,
  );
  const [pullDiffs, setPullDiffs] = useState<PullDiffSummary[] | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setData(null);
    setPullDiffs(null);

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
          state: "all",
          per_page: 50,
        }),
      ]);

      const repoData = repoRaw as GithubRepo;
      const pullList = (Array.isArray(pulls) ? pulls : []) as GithubPull[];
      const totalPullRequests = pullList.length;
      const openPullRequests = pullList.filter(
        (pr) => pr.state === "open",
      ).length;

      setData({
        fullName: repoData.full_name,
        description: repoData.description,
        stargazers: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        language: repoData.language,
        htmlUrl: repoData.html_url,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        totalPullRequests,
        openPullRequests,
      });

      // Fetch basic diff stats for the first few PRs.
      const samplePulls = pullList.slice(0, 5);
      if (samplePulls.length > 0) {
        const filesPerPull = await Promise.all(
          samplePulls.map(async (pr) => {
            const { data: files } = await octokit.request(
              "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
              {
                owner,
                repo: repoName,
                pull_number: pr.number,
                per_page: 100,
              },
            );

            return {
              pr,
              files: (Array.isArray(files) ? files : []) as GithubPullFile[],
            };
          }),
        );

        const perPull = filesPerPull.map(({ pr, files }) => {
          const totals = files.reduce(
            (acc, file) => ({
              additions: acc.additions + file.additions,
              deletions: acc.deletions + file.deletions,
              changes: acc.changes + file.changes,
            }),
            { additions: 0, deletions: 0, changes: 0 },
          );

          const topFiles = files
            .slice()
            .sort((a, b) => b.changes - a.changes)
            .slice(0, 3)
            .map((file) => ({
              filename: file.filename,
              additions: file.additions,
              deletions: file.deletions,
              changes: file.changes,
            }));

          return { pr, totals, topFiles };
        });

        const summaries: PullDiffSummary[] = perPull.map(
          ({ pr, totals, topFiles }) => ({
            number: pr.number,
            title: pr.title,
            url: pr.html_url,
            state: pr.state,
            totalAdditions: totals.additions,
            totalDeletions: totals.deletions,
            totalChanges: totals.changes,
            topFiles,
          }),
        );

        const pullsForDb = perPull.map(({ pr, totals }) => ({
          pullRequestNumber: pr.number,
          pullRequestTitle: pr.title,
          pullRequestUrl: pr.html_url,
          pullRequestState: pr.state,
          pullRequestCreatedAt: Date.parse(pr.created_at),
          pullRequestUpdatedAt: Date.parse(pr.updated_at),
          pullRequestTotalAdditions: totals.additions,
          pullRequestTotalDeletions: totals.deletions,
          pullRequestTotalChanges: totals.changes,
        }));

        setPullDiffs(summaries);

        if (user?.id) {
          const prSummary = {
            total: totalPullRequests,
            open: openPullRequests,
            sample: summaries,
          };

          const payload: PreparedForDb = {
            clerkId: user.id,
            repoName: repoData.name,
            repoOwner: repoData.owner.login,
            repoUrl: repoData.html_url,
            repoDescription: repoData.description ?? "",
            repoPullRequests: JSON.stringify(prSummary),
          };

          setPreparedForDb(payload);

          const repoId = await addGithubRepo(payload);

          if (repoId) {
            await upsertGithubPullRequests({
              repoId,
              pulls: pullsForDb,
            });
          }
        }
      } else if (user?.id) {
        // No PRs – still persist baseline repo info with empty PR summary.
        const prSummary = {
          total: 0,
          open: 0,
          sample: [] as PullDiffSummary[],
        };

        const payload: PreparedForDb = {
          clerkId: user.id,
          repoName: repoData.name,
          repoOwner: repoData.owner.login,
          repoUrl: repoData.html_url,
          repoDescription: repoData.description ?? "",
          repoPullRequests: JSON.stringify(prSummary),
        };

        setPreparedForDb(payload);

        const repoId = await addGithubRepo(payload);

        if (repoId) {
          await upsertGithubPullRequests({
            repoId,
            pulls: [],
          });
        }
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

  return {
    // state
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
    // actions
    onSubmit,
  };
}


