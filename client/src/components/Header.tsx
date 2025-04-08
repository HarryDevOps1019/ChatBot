import React from "react";
import { Key, RotateCcw, BookOpen, GraduationCap } from "lucide-react";

interface HeaderProps {
  onClearChat: () => void;
  onChangeApiKey?: () => void;
}

/**
 * Header component with TapTalk education theme branding and controls
 */
export const Header: React.FC<HeaderProps> = ({ onClearChat, onChangeApiKey }) => {
  return (
    <header className="header py-3 px-4 sm:px-6 flex items-center justify-between border-b">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">TapTalk</h1>
        </div>
      </div>
      
      <div className="flex gap-2">
        {onChangeApiKey && (
          <button 
            onClick={onChangeApiKey}
            className="text-gray-400 hover:text-primary text-sm flex items-center gap-1 p-2 rounded-md hover:bg-primary/10 transition-all duration-300"
            title="Change API Key"
          >
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API Key</span>
          </button>
        )}
        <button 
          onClick={onClearChat}
          className="text-gray-400 hover:text-primary text-sm flex items-center gap-1 p-2 rounded-md hover:bg-primary/10 transition-all duration-300"
          title="Clear Chat"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>
    </header>
  );
};
