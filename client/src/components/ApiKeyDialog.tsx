import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

/**
 * Dialog component for entering the Gemini API key
 */
export const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API key required",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Test the API key with a simple request - using the v1beta endpoint
      const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      
      if (!testResponse.ok) {
        const errorData = await testResponse.json();
        throw new Error(
          errorData.error?.message || "Invalid API key. Please check and try again."
        );
      }
      
      // If validation passes, save the key
      onSave(apiKey);
      toast({
        title: "API key saved",
        description: "Your Gemini API key has been saved for this session",
      });
      onClose();
    } catch (error) {
      console.error("API key validation error:", error);
      toast({
        title: "Invalid API Key",
        description: error instanceof Error 
          ? error.message 
          : "Failed to validate API key. Please check your key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border border-primary/30 bg-[#1A1C2E]/95 backdrop-blur-xl shadow-[0_0_30px_rgba(137,73,223,0.2)]">
        <DialogHeader>
          <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-400">Enter Gemini API Key</DialogTitle>
          <DialogDescription className="text-gray-300">
            To explore the cosmos with TapTalk, you need your own Gemini API key.
            Your key is stored securely in your browser and only used to communicate with Gemini.
            We never store your API key on our servers.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-3">
            <Input
              id="apiKey"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-black/40 border-primary/30 focus:border-primary/60 focus:ring-primary/30 text-white"
              type="password"
              autoComplete="off"
            />
            <div className="text-xs space-y-2 text-gray-400 bg-primary/5 p-3 rounded-lg border border-primary/20">
              <p>
                Don't have an API key?{" "}
                <a
                  href="https://ai.google.dev/tutorials/setup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/90 hover:text-primary transition-colors"
                >
                  Get one from Google AI Studio
                </a>
              </p>
              <p className="font-medium text-primary/80">How to get your API key:</p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary/90 hover:text-primary transition-colors">Google AI Studio</a></li>
                <li>Sign in with your Google account</li>
                <li>Create an API key or use an existing one</li>
                <li>Copy and paste it here</li>
              </ol>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
            >
              {isLoading ? "Verifying Key..." : "Activate Key"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};