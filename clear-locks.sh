#!/bin/bash
# Clear package-lock.json before deployment
# This script helps resolve cached dependencies issues in Netlify

echo "🧹 Clearing lock files for clean install..."

# Remove package-lock.json if it exists
if [ -f "package-lock.json" ]; then
  echo "Removing package-lock.json"
  rm package-lock.json
fi

# Remove yarn.lock if it exists
if [ -f "yarn.lock" ]; then
  echo "Removing yarn.lock"
  rm yarn.lock
fi

# Remove pnpm-lock.yaml if it exists
if [ -f "pnpm-lock.yaml" ]; then
  echo "Removing pnpm-lock.yaml"
  rm pnpm-lock.yaml
fi

# Ensure node_modules is gone
if [ -d "node_modules" ]; then
  echo "Removing node_modules directory"
  rm -rf node_modules
fi

echo "✅ Lock files cleared. Ready for fresh install."
