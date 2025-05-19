# syntax=docker.io/docker/dockerfile:1.7-labs

FROM node:22.15.0 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i
ARG API_HOST=localhost
RUN echo VITE_API_HOST=${API_HOST} > .env.production
ARG KEEP_CACHE=1
COPY --exclude=nginx --exclude=package.json --exclude=package-lock.json . .
RUN npm run build

FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html/
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
