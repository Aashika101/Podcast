import { GeneratePodcastProps } from '@/types';
import React, { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader, MessageCircle, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { genres } from '@/constants';
import { fetchGenre } from '@/utils/genreUtils';

const useGeneratePodcast = ({
  setAudio, voiceType, voicePrompt, setAudioStorageId, setImprovedText, genre, setGenre
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const improveContentQuality = useAction(api.openai.improveContentQuality);

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const generatePodcast = async (finalText: string) => {
    setIsGenerating(true);
    setAudio('');

    if (!voicePrompt) {
      toast({
        title: "Select a voice type to generate a podcast",
      });
      return setIsGenerating(false);
    }

    try {
      // Determine genre if not selected
      if (!genre) {
        const determinedGenre = await fetchGenre(finalText);
        console.log('Predicted Genre:', determinedGenre);
        setGenre(determinedGenre || genres[0]); 
      };

      const response = await getPodcastAudio({
        voice: voiceType,
        input: finalText,
      });

      const blob = new Blob([response], { type: 'audio/mpeg' });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      console.log('Error generating podcast', error);
      toast({
        title: "Error creating a podcast",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handleImproveContent = async (content: string) => {
    try {
      const improvedTextResponse = await improveContentQuality({
        input: content,
      });
      if (setImprovedText) {
        setImprovedText(improvedTextResponse || '');
      }
    } catch (error) {
      toast({
        title: "Error improving content",
        variant: "destructive",
      });
    }
  };

  return { isGenerating, generatePodcast, handleImproveContent };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast, handleImproveContent } = useGeneratePodcast(props);
  const [useImprovedText, setUseImprovedText] = useState(false);

  const finalText = useImprovedText ? props.improvedText || '' : props.voicePrompt;

  const applyImprovedText = () => {
    props.setVoicePrompt(props.improvedText || '');
    setUseImprovedText(false);
    if (props.setImprovedText) {
      props.setImprovedText('');
    }
  };

  const discardImprovedText = () => {
    setUseImprovedText(false);
    if (props.setImprovedText) {
      props.setImprovedText('');
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2.5 ">
        <Label className="text-16 font-bold text-white-1">Script to generate podcast</Label>
        <div className="relative">
          <Textarea
            className="input-class mt-5 font-light focus-visible:ring-red-1 pr-10"
            placeholder="Provide text to generate audio"
            rows={5}
            value={props.voicePrompt}
            onChange={(e) => props.setVoicePrompt(e.target.value)}
          />
          <MessageCircle
            size={25}
            className="absolute bottom-3 right-3 text-gray-400 bg-red-1 p-1 rounded-full transition-all duration-500 hover:bg-red-600"
            onClick={() => handleImproveContent(props.voicePrompt)}
          />
        </div>
      </div>
      {props.improvedText && (
        <div className="mt-2 relative">
          <Label className="text-16 font-bold text-white-1">Improved Content</Label>
          <Textarea
            className="input-class mt-2 font-light focus-visible:ring-red-1 pr-10 "
            readOnly
            value={props.improvedText}
            rows={10}  
          />
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <CheckCircle
              size={25}
              className="text-green-600 bg-white transition-all duration-500 hover:bg-green-50 p-1 rounded-full cursor-pointer"
              onClick={applyImprovedText}
            />
            <XCircle
              size={25}
              className="text-red-600 bg-white transition-all duration-500 hover:bg-red-50 p-1 rounded-full cursor-pointer"
              onClick={discardImprovedText}
            />
            <RefreshCcw
              size={25}
              className="text-blue-600 bg-white transition-all duration-500 hover:bg-blue-50 p-1 rounded-full cursor-pointer"
              onClick={() => handleImproveContent(props.improvedText || '')}
            />
          </div>
        </div>
      )}
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          className="text-16 bg-red-1 py-4 font-bold text-black-1 
          transition-all duration-500 hover:bg-red-600"
          onClick={() => generatePodcast(finalText)}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
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
          className="mt-5 "
          onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
      <div className='mt-5 border-b border-black-5'/>
    </div>
  );
};

export default GeneratePodcast;




