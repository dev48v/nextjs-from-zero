// STEP 1 (config): Next.js configuration
// WHY: images.remotePatterns whitelists the DEV.to CDN domains so next/image
//      can optimise cover images without throwing "hostname not configured" errors.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        // WHY: DEV.to serves cover images from this CDN
        protocol: "https",
        hostname: "dev-to-uploads.s3.amazonaws.com",
      },
      {
        // WHY: Some older articles use the practicaldev S3 bucket
        protocol: "https",
        hostname: "practicaldev-herokuapp-com.freetls.fastly.net",
      },
      {
        // WHY: Media attachments may come from res.cloudinary.com
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // WHY: Some cover images are hosted directly on dev.to
        protocol: "https",
        hostname: "dev.to",
      },
    ],
  },
};

export default nextConfig;
