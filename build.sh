#!/bin/bash

# Deployment script for Next.js on Netlify

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

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
  
  echo "✅ Static files prepared for deployment"
fi

echo "🎉 Deployment preparation complete!" 