import { GeneratePodcastProps } from '@/types';
import React, { useState, useEffect } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader, MessageCircle, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { genres, getVoicesForGenre } from '@/constants';
import { fetchGenre } from '@/utils/genreUtils';
import GeneratePodcastScript from './GeneratePodcastScript';
import { cn } from '@/lib/utils';

const useGeneratePodcast = ({
  setAudio, setGeneratedGenre, voiceTypes, voicePrompt, setAudioStorageId, setImprovedText, genre, setGenre, setVoiceTypes, setGeneratedScript, 
}: GeneratePodcastProps & { setGeneratedScript: (script: string) => void, setGeneratedGenre?: (genre: string) => void }) => {
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

    if (!finalText) {
      toast({
        title: "Provide a script to generate a podcast",
      });
      return setIsGenerating(false);
    }

    try {
      // Determine genre if not selected
      if (!genre) {
        const determinedGenreIndex = await fetchGenre(finalText);
        if (determinedGenreIndex !== null) {
          const determinedGenre = genres[determinedGenreIndex];
          console.log('Predicted Genre Index:', determinedGenreIndex);
          console.log('Predicted Genre:', determinedGenre);
          setGenre(determinedGenre || genres[0]);
          genre = determinedGenre || genres[0]; // Ensure genre is set correctly
          setGeneratedGenre && setGeneratedGenre(genre);
        } else {
          console.error('Failed to determine genre');
          setGenre(genres[0]);
          genre = genres[0];
          setGeneratedGenre && setGeneratedGenre(genre);
          
        }
      }

      // Automatically select the voices based on the genre
      const selectedGenre = genre || genres[0]; 
      const selectedVoices = getVoicesForGenre(selectedGenre);

      if (setVoiceTypes) {
        setVoiceTypes(selectedVoices); // Set the voices
      }

      // Split the script into parts for each voice
      const scriptParts = finalText.split('\n').map((part, index) => ({
        text: part,
        voice: selectedVoices[index % selectedVoices.length]
      }));

      console.log('Script Parts:', scriptParts);

      const audioBlobs = await Promise.all(scriptParts.map(async (part) => {
        if (part.text.trim().length === 0) {
          return null;
        }
        console.log('Generating audio for part:', part);
        try {
          const response = await getPodcastAudio({
            voice: part.voice,
            input: part.text,
          });
          return new Blob([response], { type: 'audio/mpeg' });
        } catch (error) {
          console.error('Error generating audio for part:', part, error);
          return null;
        }
      }));

      const validAudioBlobs = audioBlobs.filter(blob => blob !== null);

      const combinedBlob = new Blob(validAudioBlobs, { type: 'audio/mpeg' });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([combinedBlob], fileName, { type: 'audio/mpeg' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setGeneratedScript(''); 
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
  const [generatedScript, setGeneratedScript] = useState('');
  const { isGenerating, generatePodcast, handleImproveContent } = useGeneratePodcast({ ...props, setGeneratedScript });
  const [useImprovedText, setUseImprovedText] = useState(false);
  const [showGenerateScript, setShowGenerateScript] = useState(false);

  const finalText = useImprovedText ? props.improvedText || '' : (props.voicePrompt || generatedScript);
  props.onFinalTextChange && props.onFinalTextChange(finalText);

  useEffect(() => {
    if (props.genre) {
      const selectedVoices = getVoicesForGenre(props.genre);
      console.log('Genre in useEffect:', props.genre);
      console.log('Selected Voices in useEffect:', selectedVoices);
      if (props.setVoiceTypes) {
        props.setVoiceTypes(selectedVoices); // Set the voices
      }
    }
  }, [props.genre]);

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
      <div className="generate_podcast inline-flex bg-black-1 p-2 rounded-md outline outline-black-6">
        <Button
          type="button"
          variant="plain"
          onClick={() => setShowGenerateScript(false)}
          className={cn('', {
            'bg-black-6': !showGenerateScript
          })}
        >
          Script to generate podcast
        </Button>

        <Button
          type="button"
          variant="plain"
          onClick={() => setShowGenerateScript(true)}
          className={cn('', {
            'bg-black-6': showGenerateScript
          })}
        >
          AI Prompt to generate Podcast script
        </Button>
      </div>

      {showGenerateScript ? (
        <div className="flex flex-col gap-2.5 mt-3">
          <GeneratePodcastScript setGeneratedScript={setGeneratedScript} />
          {generatedScript && (
            <div className="mt-4">
              <Label className="text-16 font-bold text-white-1">Generated Script</Label>
              <Textarea
                className="input-class mt-2 font-light focus-visible:ring-red-1"
                rows={10}
                value={generatedScript}
                onChange={(e) => setGeneratedScript(e.target.value)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 mt-4">
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
      )}

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