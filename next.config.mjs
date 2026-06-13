/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Crisp country flag images (free, no key required).
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
};

export default nextConfig;
