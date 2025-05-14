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
}

export default nextConfig
