import '../../../styles/shop.css';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ShopArchive from '@/components/shop/ShopArchive';
import { categories, getCategoryBySlug, categoryPath, categoryUrl, productsInCategory } from '@/lib/data';

export function generateStaticParams() { return categories.map((c) => ({ slug: categoryPath(c).map((x) => x.slug) })); }
const resolve = (slug: string[]) => { const c = getCategoryBySlug(slug[slug.length - 1]); return c && categoryUrl(c) === '/product-category/' + slug.join('/') ? c : null; };
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const c = resolve((await params).slug); if (!c) return {};
  return { title: c.name, description: c.description.replace(/<[^>]+>/g, '').slice(0, 160) || `Shop ${c.name} at Print Macaw.`, alternates: { canonical: categoryUrl(c) } };
}
export default async function Cat({ params, searchParams }: { params: Promise<{ slug: string[] }>; searchParams: Promise<{ s?: string; orderby?: string; page?: string }> }) {
  const c = resolve((await params).slug); if (!c) notFound();
  const sp = await searchParams;
  const path = categoryPath(c);
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Shop', href: '/shop' }, ...path.map((x, i) => ({ name: x.name, href: i < path.length - 1 ? categoryUrl(x) : undefined }))];
  return <ShopArchive title={c.name} description={c.description} category={c} crumbs={crumbs} list={productsInCategory(c.id)} basePath={categoryUrl(c)} sp={sp} />;
}
