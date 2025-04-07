import React, { useRef, useEffect } from "react";
import { Message } from "@/types";
import { MessageBubble } from "@/components/MessageBubble";
import { TypingIndicator } from "@/components/TypingIndicator";
import { WelcomeScreen } from "@/components/WelcomeScreen";

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onExampleClick: (text: string) => void;
}

/**
 * Container for displaying chat messages
 */
export const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  isLoading, 
  onExampleClick 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);
  
  // Show welcome screen if no messages
  if (messages.length === 0) {
    return <WelcomeScreen onExampleClick={onExampleClick} />;
  }

  return (
    <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
      
      {isLoading && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </main>
  );
};
