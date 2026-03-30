import type { MetadataRoute } from 'next';
import { getAllCamps } from '@/lib/camps';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return [];
  }

  const staticRoutes = ['', '/camps', '/faq', '/contact', '/impressum', '/datenschutz'];
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
  }));

  for (const camp of getAllCamps()) {
    entries.push({
      url: `${siteUrl}/camps/${camp.slug}`,
    });
    entries.push({
      url: `${siteUrl}/book/${camp.slug}`,
    });
  }

  return entries;
}
