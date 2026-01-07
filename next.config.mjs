/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
      {
        hostname: "cultura.uol.com.br",
        protocol: "https",
      },
    ],
  },
}

export default nextConfig
