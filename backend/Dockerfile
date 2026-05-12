# Backend Docker image for Node.js app
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files first (para mas mabilis ang build cache)
COPY package*.json ./

# Install dependencies (mas mabilis at stable)
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose application port
EXPOSE 5000

# Environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
