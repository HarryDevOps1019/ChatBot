// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  messages;
  conversations;
  userCurrentId;
  messageCurrentId;
  conversationCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.messages = /* @__PURE__ */ new Map();
    this.conversations = /* @__PURE__ */ new Map();
    this.userCurrentId = 1;
    this.messageCurrentId = 1;
    this.conversationCurrentId = 1;
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userCurrentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Message operations
  async createMessage(insertMessage) {
    const id = this.messageCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const message = {
      ...insertMessage,
      id,
      timestamp: now
    };
    this.messages.set(id, message);
    await this.updateConversationLastActive(insertMessage.sessionId);
    return message;
  }
  async getMessagesBySessionId(sessionId) {
    return Array.from(this.messages.values()).filter((message) => message.sessionId === sessionId).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  // Conversation operations
  async createConversation(insertConversation) {
    const id = this.conversationCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const conversation = {
      ...insertConversation,
      id,
      createdAt: now,
      lastActive: now
    };
    this.conversations.set(id, conversation);
    return conversation;
  }
  async getConversationBySessionId(sessionId) {
    return Array.from(this.conversations.values()).find(
      (conversation) => conversation.sessionId === sessionId
    );
  }
  async updateConversationLastActive(sessionId) {
    const conversation = await this.getConversationBySessionId(sessionId);
    if (conversation) {
      const updatedConversation = {
        ...conversation,
        lastActive: /* @__PURE__ */ new Date()
      };
      this.conversations.set(conversation.id, updatedConversation);
      return updatedConversation;
    }
    return void 0;
  }
};
var storage = new MemStorage();

// server/services/gemini.ts
import { z } from "zod";
var geminiResponseSchema = z.object({
  text: z.string()
});
var GeminiService = class {
  defaultApiKey;
  baseUrl;
  constructor() {
    this.defaultApiKey = process.env.GEMINI_API_KEY || "";
    if (!this.defaultApiKey) {
      console.warn("GEMINI_API_KEY not found in environment variables");
    }
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta";
  }
  /**
   * Generates a response from Gemini AI based on the user prompt
   * @param prompt User's message/prompt
   * @param apiKey Optional API key to use instead of the environment variable
   * @returns Generated response text
   */
  async generateResponse(prompt, apiKey) {
    const effectiveApiKey = apiKey || this.defaultApiKey;
    if (!effectiveApiKey) {
      throw new Error("Gemini API key not configured");
    }
    try {
      const url = `${this.baseUrl}/models/gemini-1.5-pro:generateContent?key=${effectiveApiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Gemini API error: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error && errorJson.error.message) {
            errorMessage += ` - ${errorJson.error.message}`;
          } else {
            errorMessage += ` - ${errorText}`;
          }
        } catch (e) {
          errorMessage += ` - ${errorText}`;
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      }
      throw new Error("Unexpected response format from Gemini API");
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error;
    }
  }
};
var geminiService = new GeminiService();

// server/routes.ts
import { z as z2 } from "zod";
import { nanoid } from "nanoid";
var chatRequestSchema = z2.object({
  message: z2.string().min(1, "Message cannot be empty"),
  sessionId: z2.string().optional(),
  apiKey: z2.string().optional()
});
async function registerRoutes(app2) {
  app2.post("/api/chat", async (req, res) => {
    try {
      const validatedData = chatRequestSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({
          error: "Invalid request",
          details: validatedData.error.format()
        });
      }
      const { message, sessionId, apiKey } = validatedData.data;
      const currentSessionId = sessionId || nanoid();
      let conversation = await storage.getConversationBySessionId(currentSessionId);
      if (!conversation) {
        conversation = await storage.createConversation({
          sessionId: currentSessionId
        });
      }
      await storage.createMessage({
        content: message,
        isUser: true,
        sessionId: currentSessionId
      });
      let responseText;
      try {
        responseText = await geminiService.generateResponse(message, apiKey);
      } catch (error) {
        console.error("Error generating response:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        if (errorMessage.includes("API key") || errorMessage.includes("key not valid")) {
          return res.status(401).json({
            error: "Invalid API key. Please check your Gemini API key and try again.",
            sessionId: currentSessionId
          });
        }
        return res.status(500).json({
          error: "Failed to generate AI response",
          details: errorMessage,
          sessionId: currentSessionId
        });
      }
      const botMessage = await storage.createMessage({
        content: responseText,
        isUser: false,
        sessionId: currentSessionId
      });
      return res.status(200).json({
        response: botMessage.content,
        sessionId: currentSessionId
      });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }
      const conversation = await storage.getConversationBySessionId(sessionId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await storage.getMessagesBySessionId(sessionId);
      return res.status(200).json({
        sessionId,
        messages
      });
    } catch (error) {
      console.error("Error getting chat history:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.delete("/api/chat/:sessionId", async (req, res) => {
    return res.status(200).json({ success: true });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve("client", "src"),
      "@shared": path.resolve("shared"),
      "@assets": path.resolve("attached_assets")
    }
  },
  root: path.resolve("client"),
  build: {
    outDir: path.resolve("dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid as nanoid2 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        process.cwd(),
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
