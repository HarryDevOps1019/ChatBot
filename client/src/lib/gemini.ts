import { apiRequest } from "./queryClient";
import { ChatApiResponse, ChatHistoryResponse } from "@/types";

/**
 * Client-side library for interacting with the Gemini API through our server
 */
export const geminiClient = {
  /**
   * Sends a message to the Gemini AI through the server API
   * @param message The user's message
   * @param sessionId Optional session ID for continuing a conversation
   * @returns Promise with the API response
   */
  async sendMessage(message: string, sessionId?: string): Promise<ChatApiResponse> {
    const response = await apiRequest("POST", "/api/chat", {
      message,
      sessionId,
    });
    return response.json();
  },

  /**
   * Retrieves chat history for a session
   * @param sessionId The session ID
   * @returns Promise with the chat history
   */
  async getHistory(sessionId: string): Promise<ChatHistoryResponse> {
    const response = await apiRequest("GET", `/api/chat/${sessionId}`);
    return response.json();
  },

  /**
   * Clears chat history for a session
   * @param sessionId The session ID
   * @returns Promise indicating success
   */
  async clearChat(sessionId: string): Promise<{ success: boolean }> {
    const response = await apiRequest("DELETE", `/api/chat/${sessionId}`);
    return response.json();
  },
};
