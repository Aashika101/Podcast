import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPlaylist = mutation({
    args: {
      podcastId: v.id('podcasts'),
      playlistName: v.string(),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      console.log("User identity:", identity);
  
      if (!identity) {
        console.log("Error: User is not logged in.");
        throw new ConvexError("Please log in to create a playlist.");
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
  
      console.log("Creating playlist with args:", args);
  
      const playlist = await ctx.db.query('playlists')
        .filter((q) => q.eq(q.field('playlistName'), args.playlistName))
        .filter((q) => q.eq(q.field('user'), user[0]._id))
        .collect();
  
      if (playlist.length === 0) {
        // Create a new playlist if it doesn't exist
        const newPlaylist = await ctx.db.insert('playlists', {
          user: user[0]._id,
          playlistName: args.playlistName,
          podcasts: [args.podcastId],
        });
        console.log("New playlist created:", newPlaylist);
        return newPlaylist;
      } else {
        // Add the podcast to the existing playlist
        const updatedPlaylist = await ctx.db.patch(playlist[0]._id, {
          podcasts: [...playlist[0].podcasts, args.podcastId],
        });
        console.log("Podcast added to existing playlist:", updatedPlaylist);
        return updatedPlaylist;
      }
    }
  });

export const getPlaylists = query(async ({ db }) => {
    const playlists = await db.query('playlists').collect();
    return playlists;
  });

export const deletePodcastFromPlaylist = mutation({
    args: {
      podcastId: v.id('podcasts'),
      playlistId: v.id('playlists'),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      console.log("User identity:", identity);
  
      if (!identity) {
        console.log("Error: User is not logged in.");
        throw new ConvexError("Please log in to delete a podcast.");
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
  
      const playlist = await ctx.db.get(args.playlistId);
      if (!playlist) {
        console.log("Error: Playlist not found.");
        throw new ConvexError("Playlist not found.");
      }
  
      const updatedPodcasts = playlist.podcasts.filter(podcast => podcast !== args.podcastId);
      await ctx.db.patch(args.playlistId, { podcasts: updatedPodcasts });
  
      console.log("Podcast removed from playlist:", args.podcastId);
  
      return { success: true };
    }
  });


