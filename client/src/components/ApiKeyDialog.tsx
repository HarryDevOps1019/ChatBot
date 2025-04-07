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
      onSave(apiKey);
      toast({
        title: "API key saved",
        description: "Your Gemini API key has been saved for this session",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
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
            Your key is stored locally and only used to make requests to the Gemini API.
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
            <p className="text-xs text-gray-500">
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