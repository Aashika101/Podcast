"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getDownloadedPodcast, deletePodcast } from '@/convex/downloadPodcast';
import { Button } from './ui/button';

type DownloadedPodcastPlayerCardProps = {
  _id: string;
  podcastTitle: string;
  imageUrl: string;
  audioDuration: number;
  onDelete: (id: string) => void;
};

const DownloadedPodcastPlayerCard = ({ _id, podcastTitle, imageUrl, audioDuration, onDelete }: DownloadedPodcastPlayerCardProps) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      const podcastData = await getDownloadedPodcast(_id);
      if (podcastData) {
        const url = URL.createObjectURL(podcastData.blob);
        setAudioUrl(url);
      }
    };

    fetchPodcast();
  }, [_id]);

  const handleDelete = async () => {
    await deletePodcast(_id);
    onDelete(_id);
  };

return (
  <div key={_id} className='flex items-center justify-between gap-3'>
    <div className='flex items-center gap-3'>
      <Image src={imageUrl} width={50} height={50} alt={podcastTitle} className='rounded-lg' />
      <div className='flex flex-col'>
        <h2 className='text-16 font-normal text-white-1'>{podcastTitle}</h2>
        {audioUrl ? (
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p>Loading downloaded podcast...</p>
        )}
      </div>
    </div>
    <Button onClick={handleDelete} className='delete-icon'>
      <Image src='/icons/delete.svg'
        alt="Delete"
        width={24} 
        height={24} />
    </Button>
  </div>
);
};


export default DownloadedPodcastPlayerCard;