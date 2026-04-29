# GDGShopzy Client Dockerfile
# Multi-stage build for optimized production image

# Base stage - install workspace dependencies
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/client/package.json ./apps/client/
RUN npm ci --workspace=apps/client

# Development stage - runs Vite dev server
FROM base AS development
WORKDIR /app
COPY apps/client ./apps/client
EXPOSE 5173
CMD ["npm", "run", "dev", "--workspace=apps/client"]

# Builder stage - build static assets
FROM base AS builder
WORKDIR /app
COPY apps/client ./apps/client
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build --workspace=apps/client

# Production stage - serve with Nginx
FROM nginx:alpine AS production
COPY --from=builder /app/apps/client/dist /usr/share/nginx/html
COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
