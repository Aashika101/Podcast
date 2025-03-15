// "use client";

// import React, { useEffect, useState } from 'react';
// import DownloadedPodcastPlayerCard from '@/components/DownloadedPodcastPlayerCard';
// import { getAllDownloadedPodcasts } from '@/convex/downloadPodcast';

// type Podcast = {
//   _id: string;
//   podcastTitle: string;
//   imageUrl: string;
//   audioDuration: number;
// };

// const DownloadedPodcastsPage = () => {
//   const [downloadedPodcasts, setDownloadedPodcasts] = useState<Podcast[]>([]);

//   useEffect(() => {
//     const fetchDownloadedPodcasts = async () => {
//       const podcasts = await getAllDownloadedPodcasts();
//       setDownloadedPodcasts(podcasts);
//     };

//     fetchDownloadedPodcasts();
//   }, []);

//   const handleDelete = (id: string) => {
//     setDownloadedPodcasts((prevPodcasts) => prevPodcasts.filter((podcast) => podcast._id !== id));
//   };


//   return (
//     <section className='flex flex-col gap-5 mt-8'>
//       <h1 className='text-20 font-bold text-white-1'>Downloaded Podcasts</h1>
//       {downloadedPodcasts.length > 0 ? (
//         downloadedPodcasts.map(({ _id, podcastTitle, imageUrl, audioDuration }) => (
//           <DownloadedPodcastPlayerCard
//             key={_id}
//             _id={_id}
//             podcastTitle={podcastTitle}
//             imageUrl={imageUrl}
//             audioDuration={audioDuration}
//             onDelete={handleDelete}
//           />
//         ))
//       ) : (
//         <p>No downloaded podcasts found.</p>
//       )}
//     </section>
//   );
// };

// export default DownloadedPodcastsPage;


"use client";

import React, { useEffect, useState } from 'react';
import DownloadedPodcastPlayerCard from '@/components/DownloadedPodcastPlayerCard';
import { getAllDownloadedPodcasts } from '@/convex/downloadPodcast';

type Podcast = {
  _id: string;
  podcastTitle: string;
  imageUrl: string;
  audioDuration: number;
};

const DownloadedPodcastsPage = () => {
  const [downloadedPodcasts, setDownloadedPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    const fetchDownloadedPodcasts = async () => {
      const podcasts = await getAllDownloadedPodcasts();
      setDownloadedPodcasts(podcasts);
    };

    fetchDownloadedPodcasts();
  }, []);

  const handleDelete = (id: string) => {
    setDownloadedPodcasts((prevPodcasts) => prevPodcasts.filter((podcast) => podcast._id !== id));
  };

  return (
    <section className='flex flex-col gap-5 mt-8'>
      <h1 className='text-20 font-bold text-white-1'>Downloaded Podcasts</h1>
      {downloadedPodcasts.length > 0 ? (
        downloadedPodcasts.map(({ _id, podcastTitle, imageUrl, audioDuration }) => (
          <DownloadedPodcastPlayerCard
            key={_id}
            _id={_id}
            podcastTitle={podcastTitle}
            imageUrl={imageUrl}
            audioDuration={audioDuration}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>No downloaded podcasts found.</p>
      )}

    </section>
  );
};

export default DownloadedPodcastsPage;



