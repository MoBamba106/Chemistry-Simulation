#!/usr/bin/env bash
# Bundle scripts/smoke.ts with esbuild (tsconfig paths honored) and run under Node.
set -e
cd "$(dirname "$0")/.."
npx esbuild scripts/smoke.ts --bundle --platform=node --format=esm --jsx=automatic \
  --packages=external --tsconfig=tsconfig.json --outfile=node_modules/.cache/smoke.mjs --log-level=warning
node node_modules/.cache/smoke.mjs
