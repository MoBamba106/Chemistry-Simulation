#!/usr/bin/env bash
# Render every page under react-dom/server (no browser needed).
set -e
cd "$(dirname "$0")/.."
npx esbuild scripts/render-test.tsx --bundle --platform=node --format=esm --jsx=automatic \
  --packages=external --tsconfig=tsconfig.json --outfile=node_modules/.cache/render-test.mjs --log-level=warning
node node_modules/.cache/render-test.mjs
