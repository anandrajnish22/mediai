FROM node:18-alpine

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY . .

# Expose port and start
EXPOSE 5000
CMD ["node", "server.js"]
