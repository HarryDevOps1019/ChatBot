import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { geminiClient } from "@/lib/gemini";
import { ChatState, Message, ChatHistoryResponse } from "@/types";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook to manage chat state and interactions
 */
export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    sessionId: null,
  });
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem("gemini_api_key")
  );
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Load chat history if sessionId exists
  const { data: chatHistory } = useQuery<ChatHistoryResponse>({
    queryKey: ['/api/chat', state.sessionId],
    enabled: !!state.sessionId,
  });
  
  // Update messages when chat history is loaded
  useEffect(() => {
    if (chatHistory?.messages) {
      setState(prev => ({
        ...prev,
        messages: chatHistory.messages,
      }));
    }
  }, [chatHistory]);
  
  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return geminiClient.sendMessage(message, state.sessionId || undefined, apiKey || undefined);
    },
    onMutate: (message) => {
      // Optimistically add user message to state
      const userMessage: Message = {
        content: message,
        isUser: true,
        timestamp: new Date(),
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));
    },
    onSuccess: (data) => {
      // Add bot response and update sessionId
      const botMessage: Message = {
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isLoading: false,
        sessionId: data.sessionId,
      }));
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/chat', data.sessionId] });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      
      let errorMessage = "Failed to get a response. Please try again.";
      
      // Check if it's an API key error
      if (error instanceof Error && error.message.includes("API key")) {
        errorMessage = "Invalid API key. Please check your Gemini API key and try again.";
        // Clear stored API key if it's invalid
        localStorage.removeItem("gemini_api_key");
        setApiKey(null);
        // Show the dialog again
        setTimeout(() => {
          const event = new CustomEvent("open-api-key-dialog");
          window.dispatchEvent(event);
        }, 500);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to send message",
      }));
    },
  });
  
  // Mutation for clearing chat
  const clearChatMutation = useMutation({
    mutationFn: async () => {
      if (state.sessionId) {
        return geminiClient.clearChat(state.sessionId);
      }
      return { success: true };
    },
    onSuccess: () => {
      setState({
        messages: [],
        isLoading: false,
        error: null,
        sessionId: null,
      });
      
      toast({
        title: "Chat cleared",
        description: "Your conversation has been reset.",
      });
    },
    onError: (error) => {
      console.error("Error clearing chat:", error);
      
      toast({
        title: "Error",
        description: "Failed to clear the chat. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Send a message
  const sendMessage = useCallback((message: string) => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  }, [sendMessageMutation]);
  
  // Clear the chat
  const clearChat = useCallback(() => {
    clearChatMutation.mutate();
  }, [clearChatMutation]);
  
  // Save the API key
  const saveApiKey = useCallback((key: string) => {
    localStorage.setItem("gemini_api_key", key);
    setApiKey(key);
  }, []);
  
  // Check if API key exists
  const hasApiKey = !!apiKey;
  
  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sessionId: state.sessionId,
    hasApiKey,
    sendMessage,
    clearChat,
    saveApiKey,
  };
}
