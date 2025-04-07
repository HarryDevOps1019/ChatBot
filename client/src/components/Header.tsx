import React from "react";
import { Key } from "lucide-react";

interface HeaderProps {
  onClearChat: () => void;
  onChangeApiKey?: () => void;
}

/**
 * Header component with TapTalk branding and controls
 */
export const Header: React.FC<HeaderProps> = ({ onClearChat, onChangeApiKey }) => {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-comments text-white text-lg"></i>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">TapTalk</h1>
        </div>
        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
          Powered by Gemini AI
        </span>
      </div>
      
      <div className="flex gap-2">
        {onChangeApiKey && (
          <button 
            onClick={onChangeApiKey}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Change API Key"
          >
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API Key</span>
          </button>
        )}
        <button 
          onClick={onClearChat}
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 p-2 rounded-md hover:bg-gray-100 transition-colors"
          title="Clear Chat"
        >
          <i className="fas fa-broom"></i>
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>
    </header>
  );
};
