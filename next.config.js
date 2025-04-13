/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports
  output: 'standalone',
  
  // Configure headers for dynamic routes
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // Configure experimental features
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig 