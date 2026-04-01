# ---------- BUILD STAGE ----------
FROM ubuntu:22.04 AS builder

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy everything (including submodule)
COPY . .

# Build
RUN cmake -B build -DCMAKE_BUILD_TYPE=Release \
 && cmake --build build -j$(nproc)

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