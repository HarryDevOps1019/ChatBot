import React from "react";
import { ExampleCard } from "@/components/ExampleCard";

interface WelcomeScreenProps {
  onExampleClick: (text: string) => void;
}

const examples = [
  {
    icon: "fas fa-lightbulb",
    title: "Explain quantum computing",
    description: "Get a simple explanation of complex topics",
  },
  {
    icon: "fas fa-code",
    title: "Write a Python function",
    description: "Get code examples and explanations",
  },
  {
    icon: "fas fa-list-check",
    title: "Create a weekly meal plan",
    description: "Get personalized suggestions and ideas",
  },
];

/**
 * Welcome screen component with examples
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8">
      <div className="w-full max-w-3xl text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to TapTalk</h2>
        <p className="text-gray-600 mb-6">
          Powered by Google's Gemini AI, I can answer questions, help with tasks, and have natural conversations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {examples.map((example, index) => (
            <ExampleCard
              key={index}
              icon={example.icon}
              title={example.title}
              description={example.description}
              onClick={() => onExampleClick(example.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
