/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // Disable image optimization for Unsplash - they're already optimized
    // We'll use unoptimized prop in PlaceholderImage component instead
  },
  transpilePackages: ['.prisma', '@prisma/client'],
  webpack: (config, { isServer }) => {
    // No custom alias needed - using default Prisma output location
    return config;
  },
};

module.exports = nextConfig;

