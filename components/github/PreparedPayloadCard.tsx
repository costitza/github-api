import { PreparedForDb } from "./repoTypes";

type Props = {
  payload: PreparedForDb | null;
};

export function PreparedPayloadCard({ payload }: Props) {
  if (!payload) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-neutral-50 p-4 text-xs font-mono text-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-200">
      <p className="mb-2 font-semibold">
        Ready to save to Convex `githubRepos`:
      </p>
      <pre className="whitespace-pre-wrap wrap-break-word">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}


