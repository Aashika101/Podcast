'use client'

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import React from "react";

const ProfilePage = ({
    params, 
}: {
    params: {
        profileId: string;
    };
}) => {
    const { user: loggedInUser } = useUser();
    const user = useQuery(api.users.getUserById, {
        clerkId: params.profileId,
    });

    const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, {
        authorId: params.profileId,
    })

    if (!user || !podcastsData) return <LoaderSpinner />;

    const isOwnProfile = loggedInUser?.id === params.profileId;


    return (
        <section className='mt-9 flex flex-col'>
            <h1 className='text-20 font-bold text-white-1'
            >Podcaster Profile</h1>
            <div className='mt-6 flex flex-col gap-6 max-md:items-center md:flex-row'>
                <ProfileCard 
                  podcastData={podcastsData!}
                  imageUrl={user?.imageUrl!}
                  userFirstName={user?.name!}
                />
            </div>
            <section className='mt-9 flex flex-col gap-5'>
                <h1 className='text-20 font-bold text-white-1'>All Podcasts</h1>
                {podcastsData && podcastsData.podcasts.length > 0 ? (
                    <div className='podcast_grid'>
                        {podcastsData?.podcasts 
                        ?.slice(0, 4)
                        .map((podcast : any) => (
                            <PodcastCard 
                              key={podcast.id}
                              imgUrl={podcast.imageUrl!}
                              title={podcast.podcastTitle!}
                              description={podcast.podcastDescription!}
                              genre={podcast.genre}
                              podcastId={podcast._id}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState 
                      title='No podcasts created yet'
                      buttonLink={isOwnProfile ? "/create-podcast" : "/"}
                      buttonText={isOwnProfile ? "Create Podcast" : "Home"}
                    />
                )}
            </section>
        </section>
    )
}

export default ProfilePage;
