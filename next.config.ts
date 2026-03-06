import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://be.putratek.my.id/api/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
