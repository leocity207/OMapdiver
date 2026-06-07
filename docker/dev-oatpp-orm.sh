#!/usr/bin/env bash
set -euo pipefail

cd /app

# Configure once, then reuse the build dir
if [ ! -f build/CMakeCache.txt ]; then
  echo "Configuring CMake in Debug mode..."
  cmake -S . -B build \
    -DCMAKE_BUILD_TYPE=Debug \
    -DBUILD_TESTS=OFF
fi

watch_and_run() {
  while true; do
    echo "Building..."
    cmake --build build -j"$(nproc)"
    echo "Starting server..."
    ./build/Mapdiver-exe
    echo "Server exited, restarting in 1s..."
    sleep 1
  done
}

# Rebuild whenever source files change
{
  find src -type f 2>/dev/null || true
  find externals -type f 2>/dev/null || true
  find resources -type f 2>/dev/null || true
  echo CMakeLists.txt
} | entr -r sh -c '
  cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTS=OFF
  cmake --build build -j"$(nproc)"
  exec ./build/Mapdiver-exe
'