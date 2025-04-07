import React from "react";
import { ExampleCardProps } from "@/types";

/**
 * Card component for showing example queries on the welcome screen
 */
export const ExampleCard: React.FC<ExampleCardProps> = ({ 
  icon, 
  title, 
  description,
  onClick
}) => {
  return (
    <div 
      className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="text-primary mb-2">
        <i className={icon}></i>
      </div>
      <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};
