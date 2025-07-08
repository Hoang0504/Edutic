import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY, // Set key in .env file
  baseURL: "https://api.deepseek.com/v1/chat/completions", // DeepSeek API endpoint
});
