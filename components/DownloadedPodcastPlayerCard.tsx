"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getDownloadedPodcast } from '@/convex/downloadPodcast';


type DownloadedPodcastPlayerCardProps = {
  _id: string;
  podcastTitle: string;
  imageUrl: string;
  audioDuration: number;
};

const DownloadedPodcastPlayerCard = ({ _id }: DownloadedPodcastPlayerCardProps) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [podcastTitle, setPodcastTitle] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [audioDuration, setAudioDuration] = useState<number>(0);

  useEffect(() => {
    const fetchPodcast = async () => {
      const podcastData = await getDownloadedPodcast(_id);
      if (podcastData) {
        const url = URL.createObjectURL(podcastData.blob);
        setAudioUrl(url);
        setPodcastTitle(podcastData.podcastTitle);
        setImageUrl(podcastData.imageUrl);
        setAudioDuration(podcastData.audioDuration);
      }
    };

    fetchPodcast();
  }, [_id]);

  return (
    <div key={_id} className='flex items-center gap-3'>
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
  );
};

export default DownloadedPodcastPlayerCard;