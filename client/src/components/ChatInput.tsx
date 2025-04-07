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
    <footer className="p-4 border-t border-primary/20">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={textareaRef}
            id="user-input"
            className="chat-input w-full rounded-lg pl-4 pr-14 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none text-foreground"
            placeholder="Ask about the cosmos..."
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
                ? "text-gray-500 cursor-not-allowed" 
                : "text-primary hover:text-primary-foreground hover:bg-primary shadow-[0_0_10px_rgba(137,73,223,0.5)]"
            }`}
            disabled={isLoading || !message.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 3 3 9-3 9 19-9Z" />
              <path d="M6 12h16" />
            </svg>
          </button>
        </form>
        <div className="text-xs text-gray-400 mt-2 text-center">
          TapTalk may display inaccurate info, including about people, so double-check its responses.
        </div>
      </div>
    </footer>
  );
};
