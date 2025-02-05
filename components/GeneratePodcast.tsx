import { GeneratePodcastProps } from '@/types'

import React, { useState } from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader, MessageCircle } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';

import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { get } from 'http'
import { useToast } from '@/hooks/use-toast'
import { Label } from './ui/label'


const useGeneratePodcast =({
  setAudio, voiceType, voicePrompt, setAudioStorageId, setCorrectedText
} : GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast()

  const generateUploadUrl =  useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const correctText = useAction(api.openai.correctText);

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const generatePodcast = async (finalText: string) => {
    setIsGenerating(true);
    setAudio('');

    if(!voicePrompt) {
      toast({
        title: "Select a voice type to generate a podcast",
      })
      return setIsGenerating(false);
    }

    try{
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt
      })

      const blob = new Blob([response], {type: 'audio/mpeg'});
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg'});

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated sucessfully",
      })
  
    }catch (error) {
      console.log('Error generating podcast', error);
      toast({
        title: "Error creating a podcast",
        variant: "destructive", 
      })
      setIsGenerating(false);
    }
  };

  const handleCorrectText = async () => {
    try {
      const correctedTextResponse = await correctText({
        input: voicePrompt,
      });
      setCorrectedText(correctedTextResponse);
    } catch (error) {
      toast({
        title: "Error correcting the script",
        variant: "destructive",
      });
    }
  }

  return { isGenerating, generatePodcast, handleCorrectText };
}

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast, handleCorrectText } = useGeneratePodcast(props);
  const [useCorrectedText, setUseCorrectedText] = useState(false);

  const finalText = useCorrectedText ? props.correctedText : props.voicePrompt;


  return (
    <div>
        <div className='flex flex-col gap2.5'>
            <Label className='text-16 font-bold text-white-1'>
              script to generate podcast
            </Label>
            <div className='relative'>
              <Textarea 
                className='input-class mt-5 font-light focus-visible:ring-red-1 pr-10'
                placeholder='Provide text to generate audio'
                rows={5} 
                value={props.voicePrompt}
                onChange={(e) => props.setVoicePrompt(e.target.value)}
              />
              <MessageCircle 
                size={25} 
                className='absolute bottom-3 right-3 text-gray-400 bg-red-1 p-1 rounded-full'
                onClick={handleCorrectText} 
              />
              </div>    
        </div>
        {props.correctedText && (
        <div className="mt-2">
          <Label className='text-16 font-bold text-white-1'>Corrected Text</Label>
          <Textarea
            className='input-class mt-2 font-light focus-visible:ring-red-1 pr-10'
            readOnly
            value={props.correctedText}
          />
          <Button onClick={() => setUseCorrectedText(!useCorrectedText)} className="mt-2">
            {useCorrectedText ? 'Use Original Text' : 'Use Corrected Text'}
          </Button>
        </div>
      )}
        <div className='mt-5 w-full max-w-[200px]'>
        <Button type="submit" 
            className="text-16 bg-red-1 py-4 font-bold text-black-1 " onClick={() => generatePodcast(finalText)}>
              {isGenerating ? (
                <>
                Generating
                <Loader size={20} className="animate-spin ml-2"/>
                </>
              ) : (
                'Generate'
              )}
            </Button>
        </div>
        {props.audio && (
          <audio
          controls
          src={props.audio}
          autoPlay
          className='mt-5'
          onLoadedMetadata={(e) => props.setAudioDuration(e.
            currentTarget.duration)} 
          />
        )}
    </div>
  )
}

export default GeneratePodcast;




