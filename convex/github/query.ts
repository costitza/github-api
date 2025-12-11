import { query } from "../_generated/server";
import { v } from "convex/values";

export const getGithubRepoForUser = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("githubRepos")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const getReposWithPullsForUser = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const repos = await ctx.db
      .query("githubRepos")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .collect();

    const result = [];

    for (const repo of repos) {
      const pulls = await ctx.db
        .query("githubPullRequests")
        .withIndex("by_repoId", (q) => q.eq("repoId", repo._id))
        .collect();

      result.push({ repo, pulls });
    }

    return result;
  },
});