import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amertrading.shop';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/cart/', '/signin/', '/signup/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
