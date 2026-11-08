import type { MetadataRoute } from 'next';
import { products, categories, pages, categoryUrl } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now }, { url: `${SITE_URL}/shop`, lastModified: now }, { url: `${SITE_URL}/contact`, lastModified: now },
    ...categories.map((c) => ({ url: SITE_URL + categoryUrl(c), lastModified: now })),
    ...products.map((p) => ({ url: `${SITE_URL}/product/${p.slug}`, lastModified: new Date(p.date) })),
    ...pages.filter((p) => p.slug !== 'contact').map((p) => ({ url: `${SITE_URL}/${p.slug}`, lastModified: now })),
  ];
}
