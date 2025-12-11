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