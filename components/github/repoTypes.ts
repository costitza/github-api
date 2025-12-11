export type DisplayRepo = {
  fullName: string;
  description: string | null;
  stargazers: number;
  forks: number;
  openIssues: number;
  language: string | null;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  totalPullRequests: number;
  openPullRequests: number;
};

export type PreparedForDb = {
  clerkId: string;
  repoName: string;
  repoOwner: string;
  repoUrl: string;
  repoDescription: string;
  repoPullRequests: string;
};

export type GithubPull = {
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
};

export type GithubPullFile = {
  filename: string;
  additions: number;
  deletions: number;
  changes: number;
  status: string;
};

export type GithubRepo = {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  name: string;
  owner: {
    login: string;
  };
};

export type PullDiffSummary = {
  number: number;
  title: string;
  url: string;
  state: string;
  totalAdditions: number;
  totalDeletions: number;
  totalChanges: number;
  topFiles: {
    filename: string;
    additions: number;
    deletions: number;
    changes: number;
  }[];
};


