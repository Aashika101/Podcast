import { action } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    try {
      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice as SpeechCreateParams['voice'],
        input,
      });

      const buffer = await response.arrayBuffer();
      return buffer;
    } catch (error) {
      console.error("Error generating audio:", error);
      throw new Error("Failed to generate audio");
    }
  },
});


export const improveContentQuality = action({
  args: { input: v.string() },
  handler: async (_, { input }) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that not only corrects spelling and grammar mistakes but also improves sentence structure and content clarity to enhance the overall quality."
          },
          {
            role: "user",
            content: `Please enhance the following content by correcting spelling and grammar mistakes, improving sentence structure, and providing suggestions for better clarity and readability:\n\n${input}`
          }
        ],
        max_tokens: 500,
      });

      if (response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content) {
        const improvedText = response.choices[0].message.content.trim() || input;
        return improvedText;
      } else {
        throw new Error("No valid choices returned in the response");
      }
    } catch (error) {
      console.error("Error improving content quality:", error);
      throw new Error("Failed to improve content quality");
    }
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async(_, { prompt }) => {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    })

    const url = response.data[0].url;

    if(!url) {
      throw new Error("Failed to generate thumbnail");
    }

    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  }
})

