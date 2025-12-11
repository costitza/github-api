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
        const existingRepo = await ctx.db.query("githubRepos").filter(q => q.eq(q.field("clerkId"), clerkId)).first();
        if (existingRepo) {
            await ctx.db.patch(existingRepo._id, {
                repoName,
                repoOwner,
                repoUrl,
                repoDescription,
        repoPullRequests,
                lastUpdatedAt: Date.now(),
            });
        } else {
            await ctx.db.insert("githubRepos", {
                clerkId,
                repoName,
                repoOwner,
                repoUrl,
                repoDescription,
        repoPullRequests,
                createdAt: Date.now(),
                lastUpdatedAt: Date.now(),
            });
        }
        return existingRepo?._id;
    },
});
