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
      className="welcome-card p-5 rounded-lg transition-all cursor-pointer hover:shadow-md group"
      onClick={onClick}
    >
      <div className="text-primary mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 border border-blue-100 group-hover:bg-blue-100 transition-all mx-auto">
        {iconComponent || <i className={icon}></i>}
      </div>
      <h3 className="font-medium text-gray-800 mb-2 group-hover:text-primary transition-colors text-center">{title}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </div>
  );
};
