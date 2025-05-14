#!/bin/bash

# Deployment script for Next.js on Netlify

echo "🚀 Starting deployment process..."

# Print Node.js version
echo "📋 Using Node.js version:"
node -v

# Print npm version
echo "📋 Using npm version:"
npm -v

# Ensure pnpm is not used
echo "⚠️ Ensuring pnpm is not used for this build..."
export NETLIFY_USE_PNPM=false
export USE_PNPM=false
export USE_NPM=true

# Clear any existing lock files
echo "🧹 Clearing lock files for clean install..."
rm -f package-lock.json yarn.lock pnpm-lock.yaml
rm -rf node_modules .pnpm-store

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --force

# Build the Next.js app
echo "🏗️ Building Next.js app..."
npm run build

# If using output: 'export', need to make sure everything is in the publish directory
if [ -d "out" ]; then
  echo "📂 Setting up static export..."
  
  # Copy redirects file
  cp public/_redirects out/
  
  # Make sure index.html exists
  if [ ! -f "out/index.html" ]; then
    echo "⚠️ index.html not found in output directory, copying from public..."
    cp public/index.html out/
  fi
  
  # Copy 404 page
  cp public/404.html out/
  
  # Copy netilfy.js script
  if [ -f "public/netlify.js" ]; then
    echo "Copying netlify.js to output directory"
    cp public/netlify.js out/
  fi
  
  echo "✅ Static files prepared for deployment"
fi

echo "🎉 Deployment preparation complete!" 