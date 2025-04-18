'use client'; 

import EmptyState from '@/components/EmptyState';
import LoaderSpinner from '@/components/LoaderSpinner';
import PodcastCard from '@/components/PodcastCard';
import Searchbar from '@/components/Searchbar';
import { api } from '@/convex/_generated/api';

import { useQuery } from 'convex/react';
import React from 'react';

const Discover = ({ searchParams: { search } }: { searchParams : { search: string}}) => {
  const podcastData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' });

  return (
    <div className='mt-9 flex-col gap-9'>
      <Searchbar />
      <div className='flex flex-col gap-9'>
        <h1 className='text-20 font-bold text-white-1'>
          {!search ? 'Discover new Podcasts' : 
          'Search results for: '}
          {search && <span className='text-white-2'>{search}</span>}
        </h1>
        {podcastData ? (
          <>
            {podcastData.length > 0 ? (
              <div className='podcast_grid'>
                {podcastData?.map(({ _id, podcastTitle, podcastDescription, imageUrl, genre}) => (
                  <PodcastCard 
                  key={_id}
                  imgUrl={imageUrl!}
                  title={podcastTitle}
                  description={podcastDescription}
                  genre={genre}
                  podcastId={_id}/>
                ))}
              </div>
            ) : <EmptyState title='No results found. Try adjusting your search to find what you are looking for'/>}
          </>
        ) : <LoaderSpinner />}
      </div>
    </div>
  );
};

export default Discover;