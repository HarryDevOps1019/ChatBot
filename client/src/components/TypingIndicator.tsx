import React from "react";
import { BookOpen } from "lucide-react";

/**
 * Animated typing indicator to show when the AI is generating a response
 */
export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex animate-in fade-in-50 duration-300">
      <div className="flex-shrink-0 mr-2">
        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white shadow-md">
          <BookOpen className="h-4 w-4" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[85%]">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
        </div>
      </div>
    </div>
  );
};
