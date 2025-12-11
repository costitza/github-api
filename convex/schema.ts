import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  githubRepos: defineTable({
    clerkId: v.string(),
    repoName: v.string(),
    repoOwner: v.string(),
    repoUrl: v.string(),
    repoDescription: v.string(),
    repoPullRequests: v.string(),
    createdAt: v.number(),
    lastUpdatedAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  githubPullRequests: defineTable({
    repoId: v.id("githubRepos"),
    pullRequestNumber: v.number(),
    pullRequestTitle: v.string(),
    pullRequestUrl: v.string(),
    pullRequestState: v.string(),
    pullRequestCreatedAt: v.number(),
    pullRequestUpdatedAt: v.number(),
    pullRequestTotalAdditions: v.number(),
    pullRequestTotalDeletions: v.number(),
    pullRequestTotalChanges: v.number(),
  }).index("by_repoId", ["repoId"]),
});