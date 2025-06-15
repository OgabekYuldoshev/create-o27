#!/bin/bash

echo " Cleaning..."
rm -rf dist

echo "⚙️ Building project..."
esbuild src/main.ts --bundle --platform=node --outfile=dist/index.js --tsconfig=./tsconfig.json --minify --tree-shaking=true


echo "✅ Build successfully!"