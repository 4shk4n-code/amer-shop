import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amertrading.shop';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sale`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/refurbished`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = [];
  if (prisma) {
    try {
      const categories = await prisma.category.findMany({
        select: { slug: true, updatedAt: true },
      });
      
      categoryPages = categories.map((category: { slug: string; updatedAt: Date }) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    } catch (error) {
      console.error('Error fetching categories for sitemap:', error);
    }
  }

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  if (prisma) {
    try {
      const products = await prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      });
      
      productPages = products.map((product: { slug: string; updatedAt: Date }) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    } catch (error) {
      console.error('Error fetching products for sitemap:', error);
    }
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
