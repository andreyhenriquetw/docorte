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

      {
        hostname: "xd90tgazad.ufs.sh",
        protocol: "https",
      },
    ],
  },
}

export default nextConfig
