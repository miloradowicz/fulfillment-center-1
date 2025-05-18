# syntax=docker.io/docker/dockerfile:1.7-labs

FROM node:22.15.0 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i
ARG KEEP_CACHE=1
COPY --exclude=src/seeder --exclude=package.json --exclude=package-lock.json . .
RUN npm run build

FROM node:22.15.0
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/dist .
COPY package.json package-lock.json ./
RUN npm i
EXPOSE 8000
ENTRYPOINT ["node", "main.js"]
