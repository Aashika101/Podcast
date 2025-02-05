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

// New action for correcting text
export const correctText = action({
  args: { input: v.string() },
  handler: async (_, { input }) => {
    try {
      const correctedTextResponse = await openai.completions.create({
        model: "text-davinci-003",
        prompt: `Correct any spelling or grammar mistakes in the following text:\n\n${input}`,
        max_tokens: 500,
      });

      const correctedText = correctedTextResponse.choices[0].text?.trim() || input;
      return correctedText;
    } catch (error) {
      console.error("Error correcting text:", error);
      throw new Error("Failed to correct text");
    }
  },
});
