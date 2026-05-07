import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. إضافة إعدادات الصور هنا
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-ef16dc3694054d14a3bb71fb230b59d4.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // 2. إعدادات الـ Redirects الخاصة بك كما هي
  async redirects() {
    return [
      {
        source: "/dashboard/:path*",
        destination: "/admin/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;