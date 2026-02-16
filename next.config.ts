import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable server actions
  experimental: {
    serverActions: {
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
    "@prisma/adapter-pg",
    "pg",
    "@auth/prisma-adapter"
  ],

  // Turbopack configuration (empty config enables Turbopack without custom settings)
  turbopack: {},
};

export default nextConfig;
