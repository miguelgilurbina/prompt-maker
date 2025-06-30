import type { NextConfig } from "next";
import path from 'path';

// Check if we're using Turbopack
const isTurbopack = process.env.TURBOPACK === '1';

// Common configuration
const nextConfig: NextConfig = {
  // Enable server actions
  experimental: {
    serverActions: {
      // Configure allowed origins if needed
      allowedOrigins: [
        'localhost:3000',
        'localhost',
        'prompt-maker.vercel.app',
      ],
    },
  },
  
  // External packages for server components
  serverExternalPackages: [
    "@prisma/client",
    "@auth/prisma-adapter"
  ],
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add path aliases to webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared/src')
    };

    // This is a workaround for the "window is not defined" error
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }

    return config;
  },
};

// Log if Turbopack is enabled
if (isTurbopack) {
  console.warn('Turbopack is enabled. Some features may not work as expected with NextAuth.');
}

export default nextConfig;
