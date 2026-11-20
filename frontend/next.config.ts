import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    if (!process.env.API_URL) {
      return [];
    }

    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.API_URL.replace(/\/$/, "")}/uploads/:path*`,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "60mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
