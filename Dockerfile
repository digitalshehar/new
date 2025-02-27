# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Set NODE_ENV during build
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install serve globally
RUN npm install -g serve@14.2.1

# Copy built assets
COPY --from=builder /app/dist ./dist

# Add a healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4321/ || exit 1

EXPOSE 4321

# Improved environment configuration
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Use serve to serve the static files
CMD ["serve", "-s", "dist", "-l", "4321"]
