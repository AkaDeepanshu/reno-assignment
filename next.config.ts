import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/schoolImages/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001', 
        pathname: '/schoolImages/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3002',
        pathname: '/schoolImages/**',
      }
    ],
  },
};

export default nextConfig;
