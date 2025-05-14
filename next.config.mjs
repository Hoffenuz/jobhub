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
  // Netlify deploy uchun
  output: 'export',
  distDir: 'out',
  // API proxy konfiguratsiyasi
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://serverjobhub2.onrender.com/:path*',
      },
    ]
  },
  // Netlify'da 404 muammosini hal qilish
  trailingSlash: true,
  
  // Experimental features
  experimental: {
    // Netlify uchun optimizatsiyalar
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
