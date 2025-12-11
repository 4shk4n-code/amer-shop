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
    // Suppress deprecation warnings from dependencies in production
    if (process.env.NODE_ENV === 'production') {
      config.ignoreWarnings = [
        { module: /node_modules/ },
        { message: /DEPRECATED/ },
      ];
    }
    // No custom alias needed - using default Prisma output location
    return config;
  },
  // Suppress console warnings in production builds
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;

