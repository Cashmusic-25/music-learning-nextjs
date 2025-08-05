import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel에서는 static export가 필요하지 않음
  // output: 'export',
  // trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Vercel에서는 basePath와 assetPrefix가 필요하지 않음
  // basePath: process.env.NODE_ENV === 'production' ? '/music-learning-nextjs' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/music-learning-nextjs/' : '',
};

export default nextConfig;
