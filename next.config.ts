import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {},
  experimental: {
    nodeMiddleware: true,
  },
};

export default nextConfig;
