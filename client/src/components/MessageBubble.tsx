import React from "react";
import { MessageBubbleProps } from "@/types";
import { formatMessage } from "@/lib/utils";

/**
 * Component to display a chat message bubble
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  if (message.isUser) {
    return (
      <div className="flex justify-end animate-in fade-in slide-in-from-right-2 duration-300">
        <div className="message-bubble-user text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%]">
          <div className="message-content">
            {message.content}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex animate-in fade-in slide-in-from-left-2 duration-300">
        <div className="flex-shrink-0 mr-2">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_10px_rgba(137,73,223,0.5)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 14.5v-2.5a2 2 0 0 0-2-2h-1.17" />
              <path d="M16.5 19a2.5 2.5 0 0 0 2.5-2.5v-1.5a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v1.5a2.5 2.5 0 0 0 2.5 2.5h2z" />
              <path d="M6.5 9.5 3 11V3" />
            </svg>
          </div>
        </div>
        <div className="message-bubble-ai rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
          <div 
            className="message-content prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          />
        </div>
      </div>
    );
  }
};
