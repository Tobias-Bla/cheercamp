import type { MetadataRoute } from 'next';
import { getAllCamps, isPublicCamp } from '@/lib/camps';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return [];
  }

  const staticRoutes = ['', '/camps', '/ueber-uns', '/impressionen', '/faq', '/contact', '/impressum', '/datenschutz'];
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
  }));

  for (const camp of (await getAllCamps()).filter(isPublicCamp)) {
    entries.push({
      url: `${siteUrl}/camps/${camp.slug}`,
    });
    if (camp.bookingOpen) {
      entries.push({
        url: `${siteUrl}/book/${camp.slug}`,
      });
    }
  }

  return entries;
}
