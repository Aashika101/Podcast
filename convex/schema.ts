import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    podcasts: defineTable({
        user: v.id('users'),
        podcastTitle: v.string(),
        podcastDescription: v.string(),
        genre: v.string(),
        audioUrl: v.optional(v.string()),
        audioStorageId: v.optional(v.id('_storage')),
        imageUrl: v.optional(v.string()),
        imageStorageId: v.optional(v.id('_storage')),
        author: v.string(),
        authorId: v.string(),
        authorImageUrl: v.string(),
        voicePrompt: v.string(),
        imagePrompt: v.string(),
        finalText: v.string(), 
        voiceTypes: v.optional(v.array(v.string())), 
        audioDuration: v.number(),
        views: v.number(),
        downloadedAudioUrl: v.optional(v.string()) 
    })
    .searchIndex('search_author', { searchField: 'author' })
    .searchIndex('search_title', { searchField: 'podcastTitle' })
    .searchIndex('search_body', { searchField: 'podcastDescription'})
    .searchIndex('search_genre', { searchField: 'genre' }),
    
    users: defineTable({
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        name: v.string(),
    }),

    tasks: defineTable({
        text: v.string(),
        isCompleted: v.boolean(),
    }),

    playlists: defineTable({
        user: v.id('users'),
        playlistName: v.string(),
        podcasts: v.array(v.id('podcasts')),
    }),
    
});
