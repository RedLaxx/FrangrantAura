/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Product and brand imagery is served from /public, so the default
    // loader is enough. Keeping the config explicit makes it easy to swap
    // in a remote image host (Cloudinary, Sanity, S3) later.
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
};

export default nextConfig;
