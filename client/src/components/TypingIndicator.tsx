import React from "react";
import { Sparkles } from "lucide-react";

/**
 * Animated typing indicator to show when the AI is generating a response
 */
export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex animate-in fade-in-50 duration-300">
      <div className="flex-shrink-0 mr-2">
        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_10px_rgba(137,73,223,0.5)]">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>
      <div className="message-bubble-ai rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[85%]">
        <div className="typing-indicator flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full"></span>
          <span className="w-2 h-2 rounded-full"></span>
          <span className="w-2 h-2 rounded-full"></span>
        </div>
      </div>
    </div>
  );
};
