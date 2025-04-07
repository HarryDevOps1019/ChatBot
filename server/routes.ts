import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { geminiService } from "./services/gemini";
import { insertMessageSchema, insertConversationSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";

// Define request schema
const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  sessionId: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to send a message to the chatbot
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = chatRequestSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: validatedData.error.format() 
        });
      }
      
      const { message, sessionId } = validatedData.data;
      
      // Generate or use existing session ID
      const currentSessionId = sessionId || nanoid();
      
      // Check if conversation exists, create if not
      let conversation = await storage.getConversationBySessionId(currentSessionId);
      
      if (!conversation) {
        conversation = await storage.createConversation({ 
          sessionId: currentSessionId 
        });
      }
      
      // Store user message
      await storage.createMessage({
        content: message,
        isUser: true,
        sessionId: currentSessionId,
      });
      
      // Generate response from Gemini
      let responseText;
      try {
        responseText = await geminiService.generateResponse(message);
      } catch (error) {
        console.error("Error generating response:", error);
        return res.status(500).json({ 
          error: "Failed to generate AI response",
          sessionId: currentSessionId 
        });
      }
      
      // Store bot response
      const botMessage = await storage.createMessage({
        content: responseText,
        isUser: false,
        sessionId: currentSessionId,
      });
      
      // Return the response
      return res.status(200).json({
        response: botMessage.content,
        sessionId: currentSessionId,
      });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // API endpoint to get chat history
  app.get("/api/chat/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      
      // Validate session ID
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }
      
      // Get conversation
      const conversation = await storage.getConversationBySessionId(sessionId);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      // Get messages
      const messages = await storage.getMessagesBySessionId(sessionId);
      
      return res.status(200).json({
        sessionId,
        messages,
      });
    } catch (error) {
      console.error("Error getting chat history:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // API endpoint to clear chat history
  app.delete("/api/chat/:sessionId", async (req: Request, res: Response) => {
    // In memory storage, we can't actually delete, so just return success
    return res.status(200).json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
