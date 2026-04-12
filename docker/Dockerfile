# ---------- BUILD STAGE ----------
FROM ubuntu:22.04 AS builder

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && corepack enable

WORKDIR /app

# Copy everything (including submodule)
COPY src/ ./src/
COPY CMakeLists.txt .
COPY resources/ ./resources/
COPY externals/ ./externals/
COPY package.json .
copy pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY rollup.config.js .


# Build
RUN cmake -B build -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTS=OFF \
 && cmake --build build -j$(nproc)

RUN pnpm install --frozen-lockfile
RUN pnpm run build

# ---------- RUNTIME STAGE ----------
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only the binary (adjust name!)
COPY --from=builder /app/build/Mapdiver-exe .

# Copy frontend static files
COPY --from=builder /app/resources ./resources

EXPOSE 8000

CMD ["./Mapdiver-exe"]