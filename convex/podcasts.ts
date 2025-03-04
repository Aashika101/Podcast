import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    genre: v.string(),
    voiceTypes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("User identity:", identity);

    if (!identity) {
      console.log("Error: User is not logged in.");
      throw new ConvexError("Please log in to create a podcast.");
    }

    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))
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

export const getAllPodcast = query({
  handler: async (ctx) => {
    return await ctx.db.query('podcasts').order('desc').collect();
  }
})

export const getPodcastById = query({
  args: { podcastId: v.id('podcasts')},
  handler: async (ctx, args) => {
    return await ctx.db.get(args.podcastId);
  }
});

export const getTrendingPodcasts = query({
  handler: async (ctx) => {
    const podcasts = await ctx.db.query('podcasts').collect();

    return podcasts.sort((a, b) => b.views - a.views).slice(0, 8);
  }
});

export const getPodcastByVoiceTypes = query({
  args: {
    podcastId: v.id('podcasts'),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    return await ctx.db
      .query('podcasts')
      .filter((q) =>
        q.and(
          q.eq(q.field('voiceTypes'), podcast?.voiceTypes),
          q.neq(q.field('_id'), args.podcastId)
        )
      )
      .collect();
  },
});

export const getPodcastByGenre = query({
  args: {
    podcastId: v.id('podcasts'),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    return await ctx.db
      .query('podcasts')
      .filter((q) =>
        q.and(
          q.eq(q.field('genre'), podcast?.genre),
          q.neq(q.field('_id'), args.podcastId)
        )
      )
      .collect();
  },
});

export const getPodcastByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const podcasts = await ctx.db
    .query('podcasts')
    .filter((q) => q.eq(q.field('authorId'), args.authorId))
    .collect();

    const totalListeners = podcasts.reduce(
      (sum, podcast) => sum + podcast.views,
      0
    )
  }
});

export const getPodcastBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === '') {
      return await ctx.db.query('podcasts').order('desc').collect();
    }

    const authSearch = await ctx.db
    .query('podcasts')
    .withSearchIndex('search_author', (q) => q.search('author',args.search))
    .take(10);

    if (authSearch.length > 0) {
      return authSearch;
    }  

    const genreSearch = await ctx.db
    .query('podcasts')
    .withSearchIndex('search_genre', (q) => q.search('genre',args.search))
    .take(10);

    if (genreSearch.length > 0) {
      return genreSearch;
    }

    const titleSearch = await ctx.db
    .query('podcasts')
    .withSearchIndex('search_title', (q) => q.search('podcastTitle', args.search))
    .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
    .query('podcasts')
    .withSearchIndex('search_body', (q) =>
      q.search('podcastDescription' ,args.search)
    )
    .take(10);
  }
});

export const updatePodcastViews = mutation({
  args: {
    podcastId: v.id('podcasts'),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if(!podcast) {
      throw new ConvexError('Podcast not found');
    }

    return await ctx.db.patch(args.podcastId, {
      views: podcast.views + 1,
    });
  }
});

export const deletePodcast = mutation({
  args: {
    podcastId: v.id('podcasts'),
    imageStorageId: v.id('_storage'),
    audioStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError('Podcast not found');
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.podcastId);
  }
});


