FROM node:18-slim

RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 8080
USER nodejs
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
