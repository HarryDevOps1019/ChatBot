import { z } from "zod";

// Define response schema for type safety
const geminiResponseSchema = z.object({
  text: z.string(),
});

type GeminiResponse = z.infer<typeof geminiResponseSchema>;

/**
 * Service to interact with Google's Gemini AI API
 */
export class GeminiService {
  private defaultApiKey: string;
  private baseUrl: string;

  constructor() {
    // Get API key from environment variables
    this.defaultApiKey = process.env.GEMINI_API_KEY || '';
    if (!this.defaultApiKey) {
      console.warn("GEMINI_API_KEY not found in environment variables");
    }
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }
  
  /**
   * Generates a response from Gemini AI based on the user prompt
   * @param prompt User's message/prompt
   * @param apiKey Optional API key to use instead of the environment variable
   * @returns Generated response text
   */
  async generateResponse(prompt: string, apiKey?: string): Promise<string> {
    // Use provided API key or fall back to default
    const effectiveApiKey = apiKey || this.defaultApiKey;
    
    if (!effectiveApiKey) {
      throw new Error("Gemini API key not configured");
    }
    
    try {
      const url = `${this.baseUrl}/gemini-pro:generateContent?key=${effectiveApiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        }),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${error}`);
      }
      
      const data = await response.json();
      
      // Extract the response text from the Gemini API response
      if (data.candidates && 
          data.candidates[0] && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      }
      
      throw new Error("Unexpected response format from Gemini API");
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
