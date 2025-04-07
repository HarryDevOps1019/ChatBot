import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";
import { useChat } from "@/hooks/useChat";

/**
 * Main chat page component
 */
export const ChatPage: React.FC = () => {
  const { messages, isLoading, sendMessage, clearChat, hasApiKey, saveApiKey } = useChat();
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);

  // Check if API key is configured on component mount
  useEffect(() => {
    if (!hasApiKey) {
      setIsApiKeyDialogOpen(true);
    }
  }, [hasApiKey]);

  const handleSendMessage = (message: string) => {
    // If no API key, show dialog
    if (!hasApiKey) {
      setIsApiKeyDialogOpen(true);
      return;
    }
    sendMessage(message);
  };

  const handleExampleClick = (text: string) => {
    // If no API key, show dialog
    if (!hasApiKey) {
      setIsApiKeyDialogOpen(true);
      return;
    }
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
      
      {/* API Key Dialog */}
      <ApiKeyDialog
        isOpen={isApiKeyDialogOpen}
        onClose={() => setIsApiKeyDialogOpen(false)}
        onSave={(key) => {
          saveApiKey(key);
          setIsApiKeyDialogOpen(false);
        }}
      />
    </div>
  );
};
