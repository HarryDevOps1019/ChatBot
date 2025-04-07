import React, { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

/**
 * Component for the chat input area
 */
export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={textareaRef}
            id="user-input"
            className="w-full border border-gray-300 rounded-lg pl-4 pr-14 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            placeholder="Ask anything..."
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`absolute right-3 bottom-2.5 p-1 rounded-full focus:outline-none transition-colors ${
              isLoading || !message.trim() 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-primary hover:text-primary-foreground hover:bg-primary"
            }`}
            disabled={isLoading || !message.trim()}
          >
            <i className="fas fa-paper-plane text-lg"></i>
          </button>
        </form>
        <div className="text-xs text-gray-500 mt-2 text-center">
          TapTalk may display inaccurate info, including about people, so double-check its responses.
        </div>
      </div>
    </footer>
  );
};
