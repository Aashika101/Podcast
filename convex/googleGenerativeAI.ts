import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY || "mock-api-key";

if (!apiKey) {
  throw new Error("API key is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generatePodcastScript = async (prompt: string): Promise<string> => {
  try {
    const result = await model.generateContent(prompt);
    const generatedScript = await result.response.text();
    return generatedScript;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate podcast script");
  }
};


export const generatePodcastSummary = async (prompt: string): Promise<string> => {
  try{
   const result = await model.generateContent(`Summarize the followiung podcast content in 200 words without 
    including the strengths, weaknesses, or suggestions: ${prompt}`);
   const generatedSummary = await result.response.text();
   return generatedSummary;
  }catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate podcast summary");
  }
}