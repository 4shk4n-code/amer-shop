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
  },
        webpack: (config, { isServer }) => {
          if (isServer) {
            config.resolve.alias = {
              ...config.resolve.alias,
              '@prisma/client': require('path').resolve(process.cwd(), '.prisma/client'),
            };
          }
          return config;
        },
};

module.exports = nextConfig;

