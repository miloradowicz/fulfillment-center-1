# syntax=docker.io/docker/dockerfile:1.7-labs

FROM node:22.15.0 AS builder
ARG API_HOST=localhost
WORKDIR /app
COPY --exclude=nginx . .
RUN echo VITE_API_HOST=${API_HOST} > .env.production
RUN npm i
RUN npm run build

FROM nginx:latest
COPY --from=builder /app/dist/. /usr/share/nginx/html/
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
