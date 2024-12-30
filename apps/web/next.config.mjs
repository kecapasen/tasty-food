/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@repo/db", "@repo/dto", "@prisma/client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xrozxwafxcplyassnzlt.supabase.co",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
