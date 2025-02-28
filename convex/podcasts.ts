import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const getUrl = mutation({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) =>{
        return await ctx.storage.getUrl(args.storageId)
    }
})


export const createPodcast = mutation({
  args: {
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    imagePrompt: v.optional(v.string()),
    audioDuration: v.number(),
    finalText: v.string(),
    voicePrompt: v.string(),
    views: v.optional(v.number()),
    audioStorageId: v.id("_storage"),
    imageStorageId: v.id("_storage"),
    podcastGenre: v.string(),
    voiceTypes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    console.log("createPodcast called with args:", args);
    console.log("context :", await ctx.auth.getUserIdentity());
    const identity = await ctx.auth.getUserIdentity();
    console.log("User identity:", identity);

    if (!identity) {
      console.log("Error: User is not logged in.");
      throw new ConvexError("Please log in to create a podcast.");
    }

    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))//identity.email))
      .collect();
    console.log("User data:", user);

    if (user.length === 0) {
      console.log("Error: User not found.");
      throw new ConvexError("User not found.");
    }

    console.log("Creating podcast with args:", args);

    const podcast = await ctx.db.insert('podcasts', {
      ...args,
      user: user[0]._id,
      author: user[0].name,
      authorId: user[0].clerkId,
      authorImageUrl: user[0].imageUrl,
      views: args.views ?? 0,
      imagePrompt: args.imagePrompt ?? "",
    });

    console.log("Podcast inserted into database:", podcast);

    return podcast;
  }
});
