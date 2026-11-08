import '../../styles/shop.css';
import ShopArchive from '@/components/shop/ShopArchive';
import { products } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shop', description: 'Browse business cards, flags, apparel, kiosks, flyers, bottles and more – professionally printed by Print Macaw.', alternates: { canonical: '/shop' } };
export default async function Shop({ searchParams }: { searchParams: Promise<{ s?: string; orderby?: string; page?: string }> }) {
  const sp = await searchParams;
  const q = (sp.s || '').trim().toLowerCase();
  const list = q ? products.filter((p) => (p.name + ' ' + p.short).toLowerCase().includes(q)) : products;
  return <ShopArchive title={q ? `Search results for “${sp.s}”` : 'Shop'} crumbs={[{ name: 'Home', href: '/' }, { name: 'Shop' }]} list={list} basePath="/shop" sp={sp} />;
}
