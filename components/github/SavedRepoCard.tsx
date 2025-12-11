type Props = {
  savedRepo: {
    repoOwner: string;
    repoName: string;
    repoUrl: string;
    createdAt: number;
    lastUpdatedAt: number;
    repoPullRequests: string;
  } | null;
};

export function SavedRepoCard({ savedRepo }: Props) {
  if (!savedRepo) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-emerald-50 p-4 text-xs text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100">
      <p className="mb-2 font-semibold">Stored in Convex `githubRepos`:</p>
      <div className="space-y-1">
        <p>
          <span className="font-semibold">Repo:</span>{" "}
          {savedRepo.repoOwner}/{savedRepo.repoName}
        </p>
        <p className="truncate">
          <span className="font-semibold">URL:</span>{" "}
          <a
            href={savedRepo.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {savedRepo.repoUrl}
          </a>
        </p>
        <p className="text-[11px] text-emerald-800/80 dark:text-emerald-200/80">
          <span className="font-semibold">Created at:</span>{" "}
          {new Date(savedRepo.createdAt).toLocaleString()}
        </p>
        <p className="text-[11px] text-emerald-800/80 dark:text-emerald-200/80">
          <span className="font-semibold">Last updated:</span>{" "}
          {new Date(savedRepo.lastUpdatedAt).toLocaleString()}
        </p>
      </div>
      <details className="mt-2">
        <summary className="cursor-pointer text-[11px] underline">
          View raw `repoPullRequests` JSON
        </summary>
        <pre className="mt-1 max-h-60 overflow-auto whitespace-pre-wrap wrap-break-word rounded bg-emerald-100/60 p-2 text-[11px] dark:bg-emerald-900/50">
          {savedRepo.repoPullRequests}
        </pre>
      </details>
    </div>
  );
}


