import React from "react";
import { ExampleCard } from "@/components/ExampleCard";
import { BookOpen, GraduationCap, Brain, Calculator, History, Globe, Lightbulb, AtomIcon, BookText } from "lucide-react";

interface WelcomeScreenProps {
  onExampleClick: (text: string) => void;
}

const examples = [
  {
    icon: "science",
    title: "Explain photosynthesis",
    description: "Learn about how plants convert sunlight into energy",
  },
  {
    icon: "math",
    title: "Solve quadratic equations",
    description: "Understand the methods for solving quadratic formulas",
  },
  {
    icon: "history",
    title: "Summarize World War II",
    description: "Get a comprehensive overview of this historical event",
  },
  {
    icon: "geography",
    title: "Describe plate tectonics",
    description: "Understand how the Earth's crust moves and changes",
  },
  {
    icon: "literature",
    title: "Analyze Shakespeare's themes",
    description: "Explore common themes in Shakespeare's works",
  },
  {
    icon: "idea",
    title: "How does a computer work?",
    description: "Get a beginner-friendly explanation of computing",
  },
];

/**
 * Welcome screen component with examples
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'science':
        return <AtomIcon className="h-5 w-5" />;
      case 'math':
        return <Calculator className="h-5 w-5" />;
      case 'history':
        return <History className="h-5 w-5" />;
      case 'geography':
        return <Globe className="h-5 w-5" />;
      case 'literature':
        return <BookText className="h-5 w-5" />;
      case 'idea':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12">
      <div className="w-full max-w-4xl text-center mb-8">
        <div className="inline-block p-2 bg-blue-100 rounded-full mb-4">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Welcome to TapTalk Learning Assistant
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Your AI-powered educational companion. Ask questions about any subject to enhance your learning journey and deepen your understanding.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
