"use client"; 

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { generatePodcastScript } from '@/convex/googleGenerativeAI';

const GeneratePodcastScript = ({ setGeneratedScript }: { setGeneratedScript: (script: string) => void }) => {
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState('');

  const handleGenerateScript = async () => {
    try {
      const generatedScript = await generatePodcastScript(prompt);
      setScript(generatedScript);
      setGeneratedScript(generatedScript);
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedScript = e.target.value;
    setScript(updatedScript);
    setGeneratedScript(updatedScript);
    };

  return (
    <div>
      <div className="flex flex-col gap-4 mt-6">
        <Input
          className="input-class focus-visible:ring-red-1"
          placeholder="Enter prompt for podcast script"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className='flex justify-center'>
          <Button 
            className="text-16 w-auto bg-red-1 py-4 font-bold text-black-1 
            transition-all duration-500 hover:bg-red-600"
            onClick={handleGenerateScript}>
             Generate Podcast Script
          </Button>
        </div>
        {script && (
          <Textarea
            className="input-class mt-5 font-light focus-visible:ring-red-1"
            rows={10}
            value={script}
            onChange={handleScriptChange}
          />
        )}
      </div>
    </div>
  );
};

export default GeneratePodcastScript;