'use client'

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodcastCard from '@/components/PodcastCard'
import PodcastDetailPlayer from '@/components/PodcastDetailPlayer'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { downloadPodcast } from '@/convex/downloadPodcast'
import { generatePodcastSummary } from '@/convex/googleGenerativeAI'
import { toast } from '@/hooks/use-toast'

import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import Image from 'next/image'
import React, { useState } from 'react'

const PodcastDetails = ({ params: { podcastId } }: { 
  params: { podcastId: Id<'podcasts'> } }) => {
  const { user } = useUser();

  const updateDownloadedAudioUrl = useMutation(api.mutations.updateDownloadedAudioUrl);
  const updatePodcastViews = useMutation(api.podcasts.updatePodcastViews);

  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId });
  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceTypes, { podcastId });

  const isOwner = user?.id === podcast?.authorId;
  const [summary, setSummary] = useState<string | null>(null);

  if (!similarPodcasts || !podcast) return <LoaderSpinner />

  const handleSummarize = async () => {
    if (podcast?.finalText) {
      const generatedSummary = await generatePodcastSummary(podcast.finalText);
      setSummary(generatedSummary);
    }
  };
  
  const handleCloseSummary = () => {
    setSummary(null);
  };

  const handleDownload = async () => {
    try {
      await downloadPodcast(podcast.audioUrl!, podcast._id, podcast.podcastTitle, podcast.imageUrl!, podcast.audioDuration);
      await updateDownloadedAudioUrl({ podcastId: podcast._id, downloadedAudioUrl: podcast.audioUrl! });
      toast({
        title: 'Podcast downloaded successfully',
      });
      console.log(`Podcast with ID ${podcast._id} downloaded successfully`);
    } catch (error) {
      toast({
        title: 'Download Error',
        description: 'Failed to download the podcast',
        variant: 'destructive'
      });
      console.error(`Error downloading podcast with ID ${podcast._id}:`, error);
    }
  }

  const handlePlay = () => {
    updatePodcastViews({ podcastId: podcast._id });
  }

  return (
    <section className='flex w-full flex-col'>
      <header className='mt-9 flex items-center justify-between mb-2'>
        <h1 className='text-20 font-bold text-white-1'>Currently Playing</h1>
        <figure className='flex gap-3'>
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="Headphone"
          />
          <h2 className='text-16 font-bold text-white-1'>
            {podcast?.views}
          </h2>
          <Button onClick={handleDownload}>
            <Image
              src='/icons/download.svg'
              width={24}
              height={24}
              alt='Download'
            />
          </Button>
        </figure>
      </header>

      <PodcastDetailPlayer
        isOwner={isOwner}
        podcastId={podcast._id}
        audioUrl={podcast.audioUrl || ""}
        podcastTitle={podcast.podcastTitle}
        author={podcast.author}
        imageUrl={podcast.imageUrl || ""}
        imageStorageId={podcast.imageStorageId!}
        audioStorageId={podcast.audioStorageId!}
        authorImageUrl={podcast.authorImageUrl}
        authorId={podcast.authorId}
        genre={podcast.genre}
        views={podcast.views}
        onPlay={handlePlay} 
      />

      <p className='text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center'>
        {podcast?.podcastDescription}
      </p>

      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Transcription</h1>
          <p className='text-16 font-medium text-white-2'>{podcast?.finalText}</p>
          <Button onClick={handleSummarize} className='mt-4 p-2 bg-red-1 text-black-1 text-16 font-bold rounded'>Summarize</Button>
          {summary && (
            <div className='relative mt-4 p-4 bg-black-5 text-white-1 rounded'>
              <Button onClick={handleCloseSummary} className='absolute top-2 right-2'>
                <Image src='/icons/rightarrow.svg' width={20} height={20} alt='Close' />
              </Button>
              <p className='text-16 font-medium'>{summary}</p>
            </div>
          )}
        </div>
      </div>

      <section className='mt-8 flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Similar Podcasts</h1>
        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className='podcast_grid'>
            {similarPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl, genre }) => (
              <PodcastCard
                key={_id}
                imgUrl={imageUrl || ""}
                title={podcastTitle}
                description={podcastDescription}
                genre={genre}
                podcastId={_id}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            title='No similar podcast found'
            buttonLink='/discover'
            buttonText='Discover more podcasts'
          />
        )}
      </section>
    </section>
  )
}

export default PodcastDetails;