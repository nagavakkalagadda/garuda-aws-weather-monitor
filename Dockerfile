# ============================================================
# GARUDA // AWS INTELLIGENT WEATHER MONITOR (v2.0)
# Multi-Stage Production Dockerfile
# ============================================================

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install Backend Dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy Backend Source
COPY backend/ ./backend/

# Copy Compiled Frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose Port
EXPOSE 5000

# Start Unified Production Server
CMD ["node", "backend/src/server.js"]
