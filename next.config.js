/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // Unsplash images will use unoptimized prop in PlaceholderImage component
  },
  transpilePackages: ['.prisma', '@prisma/client'],
  webpack: (config, { isServer }) => {
    // No custom alias needed - using default Prisma output location
    return config;
  },
};

module.exports = nextConfig;

