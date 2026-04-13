import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable server actions
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'localhost',
        'prompt-maker.vercel.app',
        'prompt-maker-project.vercel.app',
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

  // Security and performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
