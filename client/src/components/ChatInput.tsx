import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

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
    <footer className="p-4 border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={textareaRef}
            id="user-input"
            className="chat-input w-full rounded-lg pl-4 pr-14 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none text-gray-800"
            placeholder="Ask any academic question..."
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`absolute right-3 bottom-2.5 p-2 rounded-full focus:outline-none transition-all duration-300 ${
              isLoading || !message.trim() 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-primary hover:text-white hover:bg-primary"
            }`}
            disabled={isLoading || !message.trim()}
          >
            <Send size={16} />
          </button>
        </form>
        <div className="text-xs text-gray-500 mt-2 text-center">
          TapTalk is designed to help with educational questions. Always verify information for academic assignments.
        </div>
      </div>
    </footer>
  );
};
