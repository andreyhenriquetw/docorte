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
        hostname: "hotclube.s3.sa-east-1.amazonaws.com",
        protocol: "https",
      },
    ],
  },
}

export default nextConfig
