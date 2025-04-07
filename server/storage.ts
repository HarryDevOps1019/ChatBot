import { 
  messages, 
  conversations, 
  users, 
  type User, 
  type InsertUser, 
  type Message, 
  type InsertMessage,
  type Conversation,
  type InsertConversation 
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBySessionId(sessionId: string): Promise<Message[]>;
  
  // Conversation operations
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversationBySessionId(sessionId: string): Promise<Conversation | undefined>;
  updateConversationLastActive(sessionId: string): Promise<Conversation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private conversations: Map<number, Conversation>;
  private userCurrentId: number;
  private messageCurrentId: number;
  private conversationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.conversations = new Map();
    this.userCurrentId = 1;
    this.messageCurrentId = 1;
    this.conversationCurrentId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Message operations
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id,
      timestamp: now 
    };
    this.messages.set(id, message);
    
    // Update conversation last active timestamp
    await this.updateConversationLastActive(insertMessage.sessionId);
    
    return message;
  }

  async getMessagesBySessionId(sessionId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Conversation operations
  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationCurrentId++;
    const now = new Date();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: now,
      lastActive: now
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversationBySessionId(sessionId: string): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(
      (conversation) => conversation.sessionId === sessionId
    );
  }

  async updateConversationLastActive(sessionId: string): Promise<Conversation | undefined> {
    const conversation = await this.getConversationBySessionId(sessionId);
    if (conversation) {
      const updatedConversation: Conversation = {
        ...conversation,
        lastActive: new Date()
      };
      this.conversations.set(conversation.id, updatedConversation);
      return updatedConversation;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
