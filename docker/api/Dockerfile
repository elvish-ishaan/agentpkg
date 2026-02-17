# Use the official Bun image as the base image
FROM oven/bun:latest

WORKDIR /app

COPY package*.json bun.lock turbo.json ./

COPY packages ./packages

COPY apps/api ./apps/api

RUN bun install

#change the workdir to /api then everything will run from that dir
WORKDIR /app/apps/api

RUN bunx --bun prisma generate --schema=./prisma/schema.prisma

# RUN bun run build --filter=api

EXPOSE 4000

CMD ["bun", "src/index.ts"]