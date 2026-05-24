/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          // During Docker Compose, 'infrapm-backend' resolves to the internal backend container IP.
          // In local dev without Docker, we fallback to localhost.
          destination: process.env.BACKEND_INTERNAL_URL
            ? `${process.env.BACKEND_INTERNAL_URL}/api/:path*`
            : 'http://localhost:5228/api/:path*'
        }
      ]
    }
};

export default nextConfig;
