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
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    // External images will use unoptimized prop in PlaceholderImage component
  },
  transpilePackages: ['.prisma', '@prisma/client'],
  webpack: (config, { isServer }) => {
    // Exclude deploy-temp directory from compilation
    config.module.rules.forEach((rule) => {
      if (rule.test && rule.test.toString().includes('tsx|ts')) {
        if (!rule.exclude) {
          rule.exclude = [];
        }
        if (Array.isArray(rule.exclude)) {
          rule.exclude.push(/deploy-temp/);
        }
      }
    });
    
    // Suppress deprecation warnings from dependencies in production
    if (process.env.NODE_ENV === 'production') {
      config.ignoreWarnings = [
        { module: /node_modules/ },
        { message: /DEPRECATED/ },
        { module: /deploy-temp/ },
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
  async redirects() {
    return [
      {
        source: '/TELR_SETUP.md',
        destination: '/telr-setup',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

