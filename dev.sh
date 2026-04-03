#!/usr/bin/env bash
# dev.sh — development build + watch script
# Watches source files, externals, and CMakeLists.txt for changes.
# On change: rebuilds the project and restarts the server.

set -e  # exit immediately if any command fails

# Enable recursive globbing (e.g., ** matches all subdirectories)
shopt -s globstar nullglob

# ----------------------------------------------------------------------
# 1. Check for required tools
# ----------------------------------------------------------------------
if ! command -v entr &> /dev/null; then
    echo "Error: 'entr' is not installed."
    echo "Install it with: sudo apt install entr   (Debian/Ubuntu)"
    echo "or: brew install entr                    (macOS)"
    exit 1
fi

# ----------------------------------------------------------------------
# 2. Initial CMake configuration (only if needed)
# ----------------------------------------------------------------------
if [ ! -f "build/CMakeCache.txt" ]; then
    echo "Configuring CMake (Debug mode, tests OFF)..."
    cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTS=OFF
else
    echo "CMake already configured. Skipping configuration step."
fi

# ----------------------------------------------------------------------
# 3. Initial build
# ----------------------------------------------------------------------
echo "Performing initial build..."
cmake --build build -j$(nproc)

# ----------------------------------------------------------------------
# 4. Watch for file changes and trigger rebuild + run
# ----------------------------------------------------------------------
echo "Starting file watcher..."
echo "Watching: src/**, externals/**, CMakeLists.txt"
echo "Press Ctrl+C to stop."

# Generate the list of files to watch:
# - All files inside src/ (recursive)
# - All files inside externals/ (recursive)
# - The top-level CMakeLists.txt
# entr -r will restart the given command whenever a file changes.
# The command: rebuild then run the server.
echo "Watching for changes..."
{
    find src/ -type f 2>/dev/null || true
    find externals/ -type f 2>/dev/null || true
    echo "CMakeLists.txt"
} | entr -r sh -c '
    echo "Change detected — rebuilding..."
    cmake --build build -j$(nproc)
    echo "Starting server (will auto‑restart on exit)..."
    while true; do
        ./build/Mapdiver-exe
        echo "Server stopped (exit code $?) — restarting in 1 second..."
        sleep 1
    done
'