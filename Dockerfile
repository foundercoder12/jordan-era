FROM node:20-slim

# Create app directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*

# First copy only package files to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create data directory for persistence
RUN mkdir -p /app/data && chown -R node:node /app

# Switch to non-root user
USER node

# Expose the port
EXPOSE 3000

# Use dumb-init as entrypoint
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "src/bot.js"]
CMD ["npm", "start"]
CMD ["npm", "start"]
