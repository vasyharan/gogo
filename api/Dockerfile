FROM rustlang/rust:nightly-slim AS builder
WORKDIR /build

COPY Cargo.toml Cargo.lock ./
RUN --mount=type=cache,target=/build/target/release \
    set -eu \
    && mkdir src \
    && echo "fn main() {println!(\"build failure!\")}" > src/main.rs \
    && cargo build --release \
    && rm target/release/deps/gogo* \
    && rm src/main.rs

RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && \
    apt-get install -y libpq-dev --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY src ./src/
RUN --mount=type=cache,target=/build/target/release \
    set -eu \
    && cargo build --release \
    && cp /build/target/release/gogo /build/gogo

FROM debian:buster-slim
WORKDIR /app

RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && \
    apt-get install -y libpq-dev --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /build/gogo /app/gogo
COPY Rocket.toml /app/
CMD ["/app/gogo"]