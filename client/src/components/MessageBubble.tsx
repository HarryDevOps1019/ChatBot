import React from "react";
import { MessageBubbleProps } from "@/types";
import { formatMessage } from "@/lib/utils";
import { GraduationCap, User } from "lucide-react";

/**
 * Component to display a chat message bubble
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  if (message.isUser) {
    return (
      <div className="flex justify-end animate-in fade-in slide-in-from-right-2 duration-300">
        <div className="bg-primary/10 text-gray-800 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%] border border-primary/20">
          <div className="message-content">
            {message.content}
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex animate-in fade-in slide-in-from-left-2 duration-300">
        <div className="flex-shrink-0 mr-2">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white shadow-md">
            <GraduationCap className="h-4 w-4" />
          </div>
        </div>
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] border border-gray-200 shadow-sm">
          <div 
            className="message-content prose prose-blue prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          />
        </div>
      </div>
    );
  }
};
