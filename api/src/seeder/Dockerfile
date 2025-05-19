# syntax=docker.io/docker/dockerfile:1.7-labs

FROM node:22.15.0 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i
ARG KEEP_CACHE=1
COPY --exclude=src --exclude=nest-cli.json --exclude=package.json --exclude=package-lock.json . .
COPY src/config.ts src/enums.ts src/types.d.ts src/
COPY src/seeder src/seeder/
COPY src/schemas src/schemas/
COPY src/modules/db.module.ts src/modules/
RUN npm run build --config src/seeder/nest-cli.json

FROM node:22.15.0
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/dist .
COPY package.json package-lock.json ./
RUN npm i
ENTRYPOINT ["node", "seeder/seed.js"]
