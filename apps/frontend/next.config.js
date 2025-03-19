const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // Add image domains configuration
  images: {
    domains: [
      'i.scdn.co',     // Spotify album art
      'platform-lookaside.fbsbx.com',
      'mosaic.scdn.co',
      'image-cdn-fa.spotifycdn.com',
      'image-cdn-ak.spotifycdn.com'
    ],
  },
  // Optionally, add any other Next.js config below
};

module.exports = withMDX(nextConfig);
