import React from "react";
import { Key, RotateCcw, Rocket } from "lucide-react";

interface HeaderProps {
  onClearChat: () => void;
  onChangeApiKey?: () => void;
}

/**
 * Header component with TapTalk space theme branding and controls
 */
export const Header: React.FC<HeaderProps> = ({ onClearChat, onChangeApiKey }) => {
  return (
    <header className="header py-3 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(137,73,223,0.5)]">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">TapTalk</h1>
        </div>
        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium border border-primary/20">
          Powered by Gemini AI
        </span>
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
