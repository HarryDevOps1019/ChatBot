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
      // Test the API key with a simple request
      const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
      
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Gemini API Key</DialogTitle>
          <DialogDescription>
            To use TapTalk, you need to provide your own Google Gemini API key.
            Your key is stored locally in your browser and only used to make requests to the Gemini API.
            We don't store your API key on our servers.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              id="apiKey"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
              type="password"
              autoComplete="off"
            />
            <div className="text-xs space-y-1 text-gray-500">
              <p>
                Don't have an API key?{" "}
                <a
                  href="https://ai.google.dev/tutorials/setup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  Get one from Google AI Studio
                </a>
              </p>
              <p>How to get your API key:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline text-primary">Google AI Studio</a></li>
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
              className="w-full sm:w-auto"
            >
              {isLoading ? "Saving..." : "Save API Key"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};