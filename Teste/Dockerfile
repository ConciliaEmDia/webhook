FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install || npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
