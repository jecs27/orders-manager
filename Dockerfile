FROM node:18-alpine

# Add necessary build dependencies
RUN apk add --no-cache python3 make g++

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./
COPY .env ./

# Install dependencies using pnpm
RUN pnpm install

COPY . .

# Build the application
RUN pnpm run build

# Expose ports for the application and debugging
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["pnpm", "run", "start:dev"]
