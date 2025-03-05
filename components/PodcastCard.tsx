import React from 'react'
import Image from "next/image";
import { PodcastCardProps } from '@/types';
import { useRouter } from 'next/navigation';

const PodcastCard = ({
    imgUrl, title, description, genre, podcastId
} : PodcastCardProps) => {

  const router = useRouter()

  const handleViews = () => {
    //increase views 
    router.push(`/podcasts/${podcastId}`, {
      scroll: true
    })
  }

  return (
    <div
    className='cursor-pointer transform scale-76'
    onClick={ handleViews }>
        <figure className='flex flex-col gap-2 '>
          <Image
          src={imgUrl}
          width={150}
          height={150}
          alt={title}
          className='aspect-square h-fit w-full
          rounded-xl 2xl:size-[150px]' />
          <div className='flex flex-col'>
            <h1 className='text-16 truncate
            font-bold text-white-1'>{title}</h1>
            <h2 className='text-12 truncate
            font-normal capitalize text-white-1'>{description}</h2>
            <h5 className='text-12 truncate font-semibold capitalize text-black-2
             bg-red-1 px-2 py-0.5 mt-1 rounded-full inline-block max-w-max max-h-max'>{genre}</h5>
          </div>
        </figure>
    </div>
  )
}

export default PodcastCard