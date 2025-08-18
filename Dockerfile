FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Copy docker env file to .env if no .env exists
RUN cp -n .env.docker .env 2>/dev/null || true

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
