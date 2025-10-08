# Multi-stage build for React Vite application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Copy production environment
COPY env.production .env.production

# Set production environment
ENV NODE_ENV=production
ENV VITE_API_URL=https://rmsadminbackend.llp.trizenventures.com/api/v1
ENV VITE_APP_NAME="Riders Moto Shop Admin"
ENV VITE_APP_VERSION=1.0.0
ENV VITE_ENVIRONMENT=production

# Build the application for production
RUN npm run build

# Verify build output
RUN ls -la dist/
RUN echo "Build contents:" && find dist/ -type f -exec ls -la {} \;

# Production stage with Nginx
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default nginx page
RUN rm -f /usr/share/nginx/html/index.html.bak /usr/share/nginx/html/50x.html

# Verify files are copied correctly
RUN ls -la /usr/share/nginx/html/
RUN echo "Checking for index.html:" && ls -la /usr/share/nginx/html/index.html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
