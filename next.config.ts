import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/music-learning-nextjs' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/music-learning-nextjs/' : '',
};

export default nextConfig;
