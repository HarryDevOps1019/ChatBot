import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes conditionally
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a chat message with code blocks, lists, etc.
 * @param message The message to format
 * @returns Formatted HTML string
 */
export function formatMessage(message: string): string {
  // Handle code blocks (```code```)
  let formattedMsg = message.replace(
    /```([^`]+)```/g, 
    '<div class="bg-gray-900 text-gray-100 p-4 rounded-md my-2 font-mono text-sm overflow-x-auto">$1</div>'
  );
  
  // Handle inline code (`code`)
  formattedMsg = formattedMsg.replace(
    /`([^`]+)`/g, 
    '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono">$1</code>'
  );
  
  // Handle lists
  const listItems = formattedMsg.split('\n');
  let inList = false;
  let listType = '';
  let formattedContent = '';
  
  listItems.forEach(item => {
    // Bullet lists
    if (item.match(/^\s*[-*•]\s/)) {
      if (!inList || listType !== 'ul') {
        if (inList) formattedContent += `</${listType}>`;
        formattedContent += '<ul class="list-disc pl-5 space-y-1 my-2">';
        inList = true;
        listType = 'ul';
      }
      formattedContent += `<li>${item.replace(/^\s*[-*•]\s/, '')}</li>`;
    } 
    // Numbered lists
    else if (item.match(/^\s*\d+\.\s/)) {
      if (!inList || listType !== 'ol') {
        if (inList) formattedContent += `</${listType}>`;
        formattedContent += '<ol class="list-decimal pl-5 space-y-1 my-2">';
        inList = true;
        listType = 'ol';
      }
      formattedContent += `<li>${item.replace(/^\s*\d+\.\s/, '')}</li>`;
    }
    // End list if line is not a list item
    else {
      if (inList) {
        formattedContent += `</${listType}>`;
        inList = false;
        listType = '';
      }
      
      // Handle empty lines
      if (item === '') {
        formattedContent += '<br>';
      } else {
        formattedContent += item;
      }
      formattedContent += '\n';
    }
  });
  
  // Close any open list
  if (inList) {
    formattedContent += `</${listType}>`;
  }
  
  // Convert new lines to <br> for HTML rendering
  return formattedContent.replace(/\n/g, '<br>');
}
