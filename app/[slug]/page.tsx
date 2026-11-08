import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pages, getPage } from '@/lib/data';

const reserved = new Set(['contact']);
export function generateStaticParams() { return pages.filter((p) => !reserved.has(p.slug)).map((p) => ({ slug: p.slug })); }
const strip = (h: string) => h.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const clean = (h: string) => h.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+="[^"]*"/gi, '');
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPage((await params).slug); if (!p) return {};
  return { title: p.title.replace(/\s*[–-]\s*PrintMacaw$/i, ''), description: strip(p.content).slice(0, 160), alternates: { canonical: `/${p.slug}` } };
}
export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPage((await params).slug);
  if (!p || reserved.has(p.slug)) notFound();
  return <div className="pm-page-content" dangerouslySetInnerHTML={{ __html: clean(p.content) }} />;
}
