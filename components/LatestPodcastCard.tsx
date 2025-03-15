"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import { formatTime } from '@/lib/formatTime';

type LatestPodcastCardProps = {
  _id: string;
  podcastTitle: string;
  imageUrl: string;
  audioDuration: number;
  onAddToPlaylist: (podcastId: string, playlistName: string) => void;
};

const LatestPodcastCard = ({ _id, podcastTitle, imageUrl, audioDuration, onAddToPlaylist }: LatestPodcastCardProps) => {
  const [showInput, setShowInput] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  const handleAddClick = () => {
    setShowInput(true);
  };

  const handleSaveClick = () => {
    onAddToPlaylist(_id, playlistName);
    setShowInput(false);
    setPlaylistName('');
  };

  return (
    <div key={_id} className='flex items-center gap-3'>
      <Image src={imageUrl} width={50} height={50} alt={podcastTitle} className='rounded-lg' />
      <div className='flex flex-col'>
        <h2 className='text-16 font-normal text-white-1'>{podcastTitle}</h2>
      </div>
      <div className='flex items-center gap-2 ml-auto'>
        <Image src="/icons/clock.svg" width={16} height={16} alt="Duration" />
        <span className='text-14 text-white-2'>{formatTime(audioDuration)}</span>
        {showInput ? (
          <>
            <input
              type="text"
              placeholder="Playlist Name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className='text-14 text-black-1 ml-2'
            />
            <button className='ml-2' onClick={handleSaveClick}>
              <Image src="/icons/add.svg" width={16} height={16} alt="Save" />
            </button>
          </>
        ) : (
          <button className='ml-2' onClick={handleAddClick}>
            <Image src="/icons/add.svg" width={16} height={16} alt="Add" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LatestPodcastCard;