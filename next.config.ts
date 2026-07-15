import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'covers.openlibrary.org' },
      { protocol: 'https', hostname: process.env.BLOB_HOSTNAME ?? '' },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  }
};

export default nextConfig;
