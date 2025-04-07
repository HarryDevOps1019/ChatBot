import React from "react";
import { ExampleCard } from "@/components/ExampleCard";
import { Rocket, Globe, Zap, Stars } from "lucide-react";

interface WelcomeScreenProps {
  onExampleClick: (text: string) => void;
}

const examples = [
  {
    icon: "planet",
    title: "Tell me about exoplanets",
    description: "Discover fascinating worlds beyond our solar system",
  },
  {
    icon: "rocket",
    title: "Explain black holes",
    description: "Understand the mysteries of these cosmic phenomena",
  },
  {
    icon: "stars",
    title: "Describe the Milky Way",
    description: "Learn about our home galaxy's structure and features",
  },
];

/**
 * Welcome screen component with examples
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'planet':
        return <Globe className="h-5 w-5" />;
      case 'rocket':
        return <Rocket className="h-5 w-5" />;
      case 'stars':
        return <Stars className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8">
      <div className="w-full max-w-3xl text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-400">
          Welcome to the Cosmos
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Explore the universe with TapTalk, powered by Google's Gemini AI. Ask questions about space, stars, planets, and beyond.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {examples.map((example, index) => (
            <ExampleCard
              key={index}
              icon={example.icon}
              title={example.title}
              description={example.description}
              onClick={() => onExampleClick(example.title)}
              iconComponent={renderIcon(example.icon)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
