/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/db", "@repo/dto", "@prisma/client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gpswnfxwtgpkqnhhqjdb.supabase.co",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
