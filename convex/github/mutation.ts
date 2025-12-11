import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const addGithubRepo = mutation({
    args: {
        clerkId: v.string(),
        repoName: v.string(),
        repoOwner: v.string(),
        repoUrl: v.string(),
        repoDescription: v.string(),
    repoPullRequests: v.string(),
    },
    handler: async (ctx, args) => {
    const {
      clerkId,
      repoName,
      repoOwner,
      repoUrl,
      repoDescription,
      repoPullRequests,
    } = args;
        const existingRepo = await ctx.db
          .query("githubRepos")
          .filter(q => q.eq(q.field("clerkId"), clerkId))
          .first();
        if (existingRepo) {
            await ctx.db.patch(existingRepo._id, {
                repoName,
                repoOwner,
                repoUrl,
                repoDescription,
                repoPullRequests,
                lastUpdatedAt: Date.now(),
            });
            return existingRepo._id;
        }

        const newRepoId = await ctx.db.insert("githubRepos", {
          clerkId,
          repoName,
          repoOwner,
          repoUrl,
          repoDescription,
          repoPullRequests,
          createdAt: Date.now(),
          lastUpdatedAt: Date.now(),
        });

        return newRepoId;
    },
});

export const upsertGithubPullRequests = mutation({
  args: {
    repoId: v.id("githubRepos"),
    pulls: v.array(
      v.object({
        pullRequestNumber: v.number(),
        pullRequestTitle: v.string(),
        pullRequestUrl: v.string(),
        pullRequestState: v.string(),
        pullRequestCreatedAt: v.number(),
        pullRequestUpdatedAt: v.number(),
        pullRequestTotalAdditions: v.number(),
        pullRequestTotalDeletions: v.number(),
        pullRequestTotalChanges: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { repoId, pulls } = args;

    // Clear existing PRs for this repo so we can re-sync the current set.
    const existing = await ctx.db
      .query("githubPullRequests")
      .withIndex("by_repoId", (q) => q.eq("repoId", repoId))
      .collect();

    for (const pr of existing) {
      await ctx.db.delete(pr._id);
    }

    for (const pr of pulls) {
      await ctx.db.insert("githubPullRequests", {
        repoId,
        ...pr,
      });
    }

    return pulls.length;
  },
});
