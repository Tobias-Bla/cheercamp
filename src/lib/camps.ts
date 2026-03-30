import { camps, type Camp } from '@/data/camps';

export function getAllCamps(): Camp[] {
  return camps;
}

export function getFeaturedCamps(): Camp[] {
  return camps.filter((camp) => camp.featured);
}

export function getCampBySlug(slug: string): Camp | undefined {
  return camps.find((camp) => camp.slug === slug);
}
