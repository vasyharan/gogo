FROM node:lts-alpine AS builder
WORKDIR /build

RUN npm install --global pnpm \
    && pnpm config set store-dir /var/cache/pnpm-store

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/var/cache/pnpm-store \
    pnpm install

COPY . .
RUN --mount=type=cache,target=/var/cache/pnpm-store \
    pnpm run build

FROM nginx:stable-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/dist /usr/share/nginx/html