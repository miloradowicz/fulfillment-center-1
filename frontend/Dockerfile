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
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
ARG DOMAIN=localhost
RUN mkdir -p /data/www/${DOMAIN}/html
COPY --from=builder /app/dist /data/www/${DOMAIN}/html/
RUN chmod -R 755 /data/www/${DOMAIN}
COPY nginx/conf /etc/nginx/conf.d/${DOMAIN}.conf
RUN sed -ie "s@domain@${DOMAIN}@g" /etc/nginx/conf.d/${DOMAIN}.conf
