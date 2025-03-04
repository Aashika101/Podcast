'use client'

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useDebounce } from '@/lib/useDebounce'

const Searchbar = () => {
    const [search, setSearch] = useState('');
    const [listening, setListening] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const debouncedValue = useDebounce(search, 500);

    useEffect(() => {
        if(debouncedValue) {
            router.push(`/discover?search=${debouncedValue}`)
        } else if (!debouncedValue && pathname === '/discover') {
            router.push('/discover')
        }
    }, [router, debouncedValue, pathname])

    const handleVoiceSearch = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.onstart = () => setListening(true);
        recognition.onresult = (event:any) => {
            const voiceSearch = event.results[0][0].transcript;
            setSearch(voiceSearch);
            setListening(false);
        };
        recognition.onspeechend = () => setListening(false);
        recognition.onerror = () => setListening(false);
        recognition.start();
    }

    return (
        <div className='relative mb-8 block'>
            <Input 
                className='input-class py-6 pl-12 focus-visible:ring-red-1'
                placeholder='search podcasts'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onLoad={() => setSearch('')}
            />
            <Image
                src='/icons/search.svg' 
                width={20}
                height={20}
                alt='search'
                className='absolute left-4 top-3.5'
            />
            <button
                onClick={handleVoiceSearch}
                className='absolute right-4 top-3.5'
                aria-label='Start voice search'
            >
                <Image
                    src='/icons/microphone.svg'
                    width={20}
                    height={20}
                    alt='voice search'
                />
            </button>
            {listening && <p className='absolute right-4 top-12 text-red-1'>Listening...</p>}
        </div>
    )
}

export default Searchbar;
