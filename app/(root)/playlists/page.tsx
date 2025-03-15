'use client'

import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { deletePodcastFromPlaylist } from '@/convex/playlists';


type Podcast = {
  _id: string;
  podcastTitle: string;
  imageUrl: string,
  audioUrl: string, 
  audioDuration: number;
};

type Playlist = {
  _id: string;
  playlistName: string;
  podcasts: string[];
};

const PlaylistsPage = () => {
  const playlists = useQuery(api.playlists.getPlaylists) as Playlist[] | undefined;
  const podcasts = useQuery(api.podcasts.getAllPodcast) as Podcast[] | undefined;
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const deletePodcastFromPlaylist= useMutation(api.playlists.deletePodcastFromPlaylist);
  

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleDeletePodcast = async (podcastId: string, playlistId: string) => {
    await deletePodcastFromPlaylist({ podcastId, playlistId });
  };

  return (
    <section className='flex flex-col gap-5 mt-8'>
      <h1 className='text-20 font-bold text-white-1'>Playlists</h1>
      {playlists && playlists.length > 0 ? (
        playlists.map((playlist) => (
          <div key={playlist._id}>
            <h2 className='text-16 font-bold text-white-1 cursor-pointer' onClick={() => handlePlaylistClick(playlist)}>
              {playlist.playlistName}
            </h2>
            {selectedPlaylist && selectedPlaylist._id === playlist._id && (
              <div className='flex flex-col gap-3'>
                {playlist.podcasts.map((podcastId) => {
                  const podcast = podcasts?.find(p => p._id === podcastId);
                  return podcast ? (
                    <div key={podcast._id} className='flex items-center gap-3'>
                      <img src={podcast.imageUrl} width={50} height={50} alt={podcast.podcastTitle} className='rounded-lg' />
                      <div className='flex flex-col'>
                        <h2 className='text-16 font-bold text-white-1'>{podcast.podcastTitle}</h2>
                        <span className='text-14 text-white-2'>{podcast.audioDuration} mins</span>
                        <audio controls>
                          <source src={podcast.audioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                      <Button onClick={() => handleDeletePodcast(podcast._id, playlist._id)}>
                        <img src='/icons/delete.svg'
                         alt='delete' 
                         height={20} 
                         width={20} />
                      </Button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No playlists found.</p>
      )}
    </section>
  );
};

export default PlaylistsPage;