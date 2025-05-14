/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['serverjobhub2.onrender.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'serverjobhub2.onrender.com',
      },
    ],
  },
  // Netlify static export configuration
  output: 'export',
  distDir: 'out',
  
  // Fix 404 issues on Netlify
  trailingSlash: true,
  
  // Ensure all pages are generated as HTML files
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/login': { page: '/login' },
      '/register': { page: '/register' },
      '/404': { page: '/404' },
    }
  },
  
  // Experimental features
  experimental: {
    // Optimizations for Netlify
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // React/Next.js strict mode
  reactStrictMode: false,
  
  // For cached dependencies problem
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Enable the swcMinify
  swcMinify: true,
}

export default nextConfig
