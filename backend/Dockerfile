FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm audit --omit=dev --audit-level=high

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]