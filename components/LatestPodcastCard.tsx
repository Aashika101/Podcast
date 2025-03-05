"use client";

import Image from 'next/image';
import React from 'react';
import { formatTime } from '@/lib/formatTime';

type LatestPodcastCardProps = {
  _id: string;
  podcastTitle: string;
  imageUrl: string;
  audioDuration: number;
};

const LatestPodcastCard = ({ _id, podcastTitle, imageUrl, audioDuration }: LatestPodcastCardProps) => {
  return (
    <div key={_id} className='flex items-center gap-3'>
      <Image src={imageUrl} width={50} height={50} alt={podcastTitle} className='rounded-lg' />
      <div className='flex flex-col'>
        <h2 className='text-16 font-normal text-white-1'>{podcastTitle}</h2>
      </div>
      <div className='flex items-center gap-2 ml-auto'>
        <Image src="/icons/clock.svg" width={16} height={16} alt="Duration" />
        <span className='text-14 text-white-2'>{formatTime(audioDuration)}</span>
      </div>
    </div>
  );
};

export default LatestPodcastCard;