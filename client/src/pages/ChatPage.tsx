import React from "react";
import { Header } from "@/components/Header";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";

/**
 * Main chat page component
 */
export const ChatPage: React.FC = () => {
  const { messages, isLoading, sendMessage, clearChat } = useChat();

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  const handleExampleClick = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header onClearChat={clearChat} />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onExampleClick={handleExampleClick}
        />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};
