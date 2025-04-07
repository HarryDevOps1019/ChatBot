import React from "react";
import { ExampleCardProps } from "@/types";

/**
 * Card component for showing example queries on the welcome screen
 */
export const ExampleCard: React.FC<ExampleCardProps> = ({ 
  icon, 
  title, 
  description,
  onClick,
  iconComponent
}) => {
  return (
    <div 
      className="bg-[#1A1C2E] p-5 rounded-xl transition-all cursor-pointer border border-primary/20 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(137,73,223,0.3)] group"
      onClick={onClick}
    >
      <div className="text-primary mb-3 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all">
        {iconComponent || <i className={icon}></i>}
      </div>
      <h3 className="font-medium text-white mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};
