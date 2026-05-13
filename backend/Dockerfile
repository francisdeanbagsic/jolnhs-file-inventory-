# Backend Docker image for Node.js app
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose application port
EXPOSE 5000

# Default environment variables
ENV PORT=5000

# Start the server
CMD ["node", "server.js"]
