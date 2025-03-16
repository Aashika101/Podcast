"use client";

import PodcastCard from '@/components/PodcastCard';
import LatestPodcastCard from '@/components/LatestPodcastCard';
import React from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from '@/convex/_generated/api';
import Link from 'next/link';

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  const latestPodcasts = useQuery(api.podcasts.getLatestPodcasts);
  const createPlaylist = useMutation(api.playlists.createPlaylist);

  // Sort and slice to get the three most recent podcasts
  const recentPodcasts = trendingPodcasts
    ?.sort((a, b) => b._creationTime - a._creationTime)
    .slice(0, 3);

  // Slice to get a maximum of 4 latest podcasts
  const latestPodcastsToShow = latestPodcasts?.slice(0, 4);

  const handleAddToPlaylist = (podcastId, playlistName: string) => {
    createPlaylist({ podcastId, playlistName });
  };

  return (

      <div className='mt-9 flex-col gap-9'>
        <section className='flex flex-col gap-5'>
          <h1 className='text-20 font-bold text-white-1'>Trending Podcasts</h1>
          <div className='podcast_grid'>
            {recentPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl, genre }) => (
              <PodcastCard
                key={_id}
                imgUrl={imageUrl!}
                title={podcastTitle}
                description={podcastDescription}
                genre={genre}
                podcastId={_id}
              />
            ))}
          </div>
        </section>

        <section className='flex flex-col gap-5 mt-12'>
          <div className='flex justify-between items-center'>
            <h1 className='text-20 font-bold text-white-1'>Latest Podcasts</h1>
            <Link href="/discover">
              <h5 className='text-16 font-bold text-red-1'>See all</h5>
            </Link>
          </div>
          <div className='flex flex-col gap-3'>
            {latestPodcastsToShow?.map(({ _id, podcastTitle, imageUrl, audioDuration }) => (
              <React.Fragment key={_id}>
                <LatestPodcastCard
                  _id={_id}
                  podcastTitle={podcastTitle}
                  imageUrl={imageUrl!}
                  audioDuration={audioDuration}
                  onAddToPlaylist={handleAddToPlaylist}
                />
                <hr className='border-t border-black-5' />
              </React.Fragment>
            ))}
          </div>
        </section>
      </div>

  );
};

export default Home;