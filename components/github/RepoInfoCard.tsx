import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DisplayRepo } from "./repoTypes";

type Props = {
  repo: DisplayRepo;
};

export function RepoInfoCard({ repo }: Props) {
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
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <a
                href={repo.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold hover:underline"
              >
                {repo.fullName}
              </a>
              {repo.description && (
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {repo.description}
                </p>
              )}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 sm:text-right">
              {repo.language && <div>{repo.language}</div>}
              <div>
                Created:{" "}
                {new Date(repo.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div>
                Last updated:{" "}
                {new Date(repo.updatedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-neutral-600 dark:text-neutral-300">
            <span>⭐ {repo.stargazers.toLocaleString()} stars</span>
            <span>🍴 {repo.forks.toLocaleString()} forks</span>
            <span>🐛 {repo.openIssues.toLocaleString()} open issues</span>
            <span>
              🔀 {repo.totalPullRequests.toLocaleString()} pull requests (
              {repo.openPullRequests.toLocaleString()} open)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


