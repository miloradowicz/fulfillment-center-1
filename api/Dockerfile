FROM node:22.15.0 AS builder
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM node:22.15.0
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/dist/. .
COPY package.json package-lock.json ./
RUN npm i
EXPOSE 8000
ENTRYPOINT ["node", "main.js"]
