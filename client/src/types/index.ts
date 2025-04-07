// Define the message interface
export interface Message {
  id?: number;
  content: string;
  isUser: boolean;
  timestamp?: Date;
}

// Define the chat state interface
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
}

// Define example card props
export interface ExampleCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  iconComponent?: React.ReactNode;
}

// Define the message bubble props
export interface MessageBubbleProps {
  message: Message;
}

// Define the chat API response
export interface ChatApiResponse {
  response: string;
  sessionId: string;
}

// Define the chat history API response
export interface ChatHistoryResponse {
  sessionId: string;
  messages: Message[];
}
