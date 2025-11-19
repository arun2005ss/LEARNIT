# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production && \
    cd client && npm ci --only=production

# Copy source code
COPY . .

# Build React app
RUN cd client && npm run build

# Create uploads directory
RUN mkdir -p server/uploads

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "server/index.production.js"]
