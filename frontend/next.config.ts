import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Add alias for contracts directory in monorepo
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/contracts": path.resolve(__dirname, "../contracts"),
    };

    return config;
  },
};

export default nextConfig;
