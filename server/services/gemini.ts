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
    // Use the latest API version
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
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
      // The correct format for Gemini API URL
      const url = `${this.baseUrl}/models/gemini-1.5-pro:generateContent?key=${effectiveApiKey}`;
      
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
        const errorText = await response.text();
        let errorMessage = `Gemini API error: ${response.status}`;
        
        try {
          // Try to parse the error as JSON for more detailed information
          const errorJson = JSON.parse(errorText);
          if (errorJson.error && errorJson.error.message) {
            errorMessage += ` - ${errorJson.error.message}`;
          } else {
            errorMessage += ` - ${errorText}`;
          }
        } catch (e) {
          // If parsing fails, just use the raw error text
          errorMessage += ` - ${errorText}`;
        }
        
        throw new Error(errorMessage);
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
