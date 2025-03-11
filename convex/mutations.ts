import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const updateDownloadedAudioUrl = mutation({
    args: {
        podcastId: v.id('podcasts'),
        downloadedAudioUrl: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.podcastId, {
            downloadedAudioUrl: args.downloadedAudioUrl,
        });
    }
});