import { PullDiffSummary } from "./repoTypes";

type Props = {
  pullDiffs: PullDiffSummary[] | null;
};

export function PrDiffsCard({ pullDiffs }: Props) {
  if (!pullDiffs || pullDiffs.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-neutral-50 p-4 text-xs text-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-100">
      <p className="mb-2 text-xs font-semibold">
        Open PR diffs (first {pullDiffs.length}):
      </p>
      <div className="space-y-3">
        {pullDiffs.map((pr) => (
          <div
            key={pr.number}
            className="rounded-md border border-dashed border-neutral-200 p-3 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between gap-2">
              <a
                href={pr.url}
                target="_blank"
                rel="noreferrer"
                className="truncate text-xs font-semibold hover:underline"
              >
                #{pr.number} {pr.title}
              </a>
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {pr.state}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-4 text-[11px] text-neutral-600 dark:text-neutral-300">
              <span>
                +{pr.totalAdditions.toLocaleString()} / -
                {pr.totalDeletions.toLocaleString()}
              </span>
              <span>Δ {pr.totalChanges.toLocaleString()} changes</span>
            </div>
            {pr.topFiles.length > 0 && (
              <ul className="mt-2 space-y-1 text-[11px] text-neutral-600 dark:text-neutral-300">
                {pr.topFiles.map((file) => (
                  <li
                    key={file.filename}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="truncate max-w-[60%]">
                      {file.filename}
                    </span>
                    <span className="shrink-0 text-neutral-500 dark:text-neutral-400">
                      +{file.additions}/-{file.deletions} ({file.changes})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


