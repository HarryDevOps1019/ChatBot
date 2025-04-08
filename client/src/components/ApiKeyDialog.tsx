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
import { Key, GraduationCap } from "lucide-react";

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
      <DialogContent className="sm:max-w-md border border-gray-200 bg-white shadow-lg">
        <DialogHeader className="pb-2">
          <div className="mx-auto bg-blue-100 p-2 rounded-full mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl text-center">Enter Gemini API Key</DialogTitle>
          <DialogDescription className="text-gray-600 text-center">
            To use TapTalk's educational assistant, you need a Gemini API key.
            Your key stays in your browser and is only used to access the AI.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-3">
            <Input
              id="apiKey"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full border-gray-300 focus:border-primary focus:ring-primary/30"
              type="password"
              autoComplete="off"
            />
            <div className="text-sm space-y-2 text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p>
                Don't have an API key?{" "}
                <a
                  href="https://ai.google.dev/tutorials/setup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  Get one for free from Google AI Studio
                </a>
              </p>
              <p className="font-medium text-gray-800 mt-2">How to get your API key:</p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">Google AI Studio</a></li>
                <li>Sign in with your Google account</li>
                <li>Create an API key or use an existing one</li>
                <li>Copy and paste it here</li>
              </ol>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
            >
              {isLoading ? "Verifying Key..." : "Connect to TapTalk"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};