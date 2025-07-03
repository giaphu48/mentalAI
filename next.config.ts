import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Cho phép tất cả đường dẫn từ Cloudinary
      },
    ],
  },
};

export default nextConfig;
