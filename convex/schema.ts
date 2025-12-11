import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  githubRepos: defineTable({
    clerkId: v.string(),
    repoName: v.string(),
    repoOwner: v.string(),
    repoUrl: v.string(),
    repoDescription: v.string(),
    repoPullRequests: v.array(v.object({
      pullRequestId: v.string(),
      pullRequestTitle: v.string(),
      pullRequestDescription: v.string(),
      pullRequestCreatedAt: v.string(),
    })),
    createdAt: v.number(),
    lastUpdatedAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),
});