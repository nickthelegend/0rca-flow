/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/deploy',
        destination: 'https://deploy.0rca.live/deploy',
      },
      {
        source: '/api/status/:path*',
        destination: 'https://deploy.0rca.live/status/:path*',
      },
    ]
  },
}

export default nextConfig
