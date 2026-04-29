# GDGShopzy Server Dockerfile
# Multi-stage build for optimized production image

# Base stage - install dependencies
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
COPY apps/server/package.json ./apps/server/
COPY apps/server/prisma ./apps/server/prisma
RUN npm ci --workspace=apps/server

# Generate Prisma Client
WORKDIR /app/apps/server
RUN npx prisma generate

# Development stage
FROM base AS development
WORKDIR /app
COPY apps/server ./apps/server
EXPOSE 4001
CMD ["npm", "run", "dev", "--workspace=apps/server"]

# Builder stage - compile TypeScript
FROM base AS builder
WORKDIR /app
COPY apps/server ./apps/server
WORKDIR /app/apps/server
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl

# Copy package files and install production dependencies only
COPY package.json package-lock.json ./
COPY apps/server/package.json ./apps/server/
RUN npm ci --workspace=apps/server --omit=dev

# Copy Prisma schema and generate client
COPY apps/server/prisma ./apps/server/prisma
WORKDIR /app/apps/server
RUN npx prisma generate

# Copy built application
COPY --from=builder /app/apps/server/dist ./dist

# Create non-root user and logs directory with proper permissions
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 && \
    mkdir -p logs && \
    chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 4001
CMD ["node", "dist/server.js"]
