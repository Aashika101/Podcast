"use client";

import PodcastCard from '@/components/PodcastCard'
import React from 'react'
import { Authenticated, useQuery } from "convex/react";
import { api } from '@/convex/_generated/api';


const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  return (
    <Authenticated>
      <div className='mt-9 flex-col gap-9'>
        <section className='flex flex-col gape-5'>
          <h1 className='text-20 font-bold text-white-1'>
            Trending Podcasts</h1>
            <div className='podcast_grid'>
              {trendingPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl, genre }) => (
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
      </div>
    </Authenticated>
  )
}

export default Home