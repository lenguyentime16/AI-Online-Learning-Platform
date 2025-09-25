import { GoogleGenAI } from '@google/genai';

// Centralized Gemini client for server-side usage across route handlers
export const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export default ai;
