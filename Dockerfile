# Multi-stage build for client + server
# 1) Build stage: install dependencies and build client and server bundle
FROM node:20-alpine AS build

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* pnpm-lock.yaml* bun.lockb* yarn.lock* ./
RUN npm ci || npm install

# Copy source
COPY . .

# Build client and server
RUN npm run build

# 2) Runtime stage: minimal image to run the server
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy only needed runtime artifacts
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Expose the server port (server always listens on 5000)
EXPOSE 5000

# Start the server (exec form is preferred)
CMD ["node", "dist/index.js"]
