import React from "react";
import { MessageBubbleProps } from "@/types";
import { formatMessage } from "@/lib/utils";

/**
 * Component to display a chat message bubble
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  if (message.isUser) {
    return (
      <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="message-bubble bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 shadow-sm max-w-[85%]">
          <div className="message-content">
            {message.content}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex-shrink-0 mr-2">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white">
            <i className="fas fa-robot"></i>
          </div>
        </div>
        <div className="message-bubble bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[85%]">
          <div 
            className="message-content prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          />
        </div>
      </div>
    );
  }
};
