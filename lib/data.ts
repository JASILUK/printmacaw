import fs from 'node:fs';
import path from 'node:path';
import categoriesJson from '@/data/categories.json';
import productsJson from '@/data/products.json';
import pagesJson from '@/data/pages.json';
import testimonialsJson from '@/data/testimonials.json';
import type { Category, Product, PageItem, Testimonial } from './types';

export const categories = categoriesJson as Category[];
export const products = (productsJson as Product[]).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
export const pages = pagesJson as unknown as PageItem[];
export const testimonials = testimonialsJson as Testimonial[];

const catById = new Map(categories.map((c) => [c.id, c]));
export const getCategory = (id: number) => catById.get(id);
export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
export const topCategories = () => categories.filter((c) => c.parent === 0).sort((a, b) => a.name.localeCompare(b.name));
export const childCategories = (id: number) => categories.filter((c) => c.parent === id);
export function categoryPath(c: Category): Category[] {
  const out: Category[] = [c];
  let cur = c;
  while (cur.parent && catById.get(cur.parent)) { cur = catById.get(cur.parent)!; out.unshift(cur); }
  return out;
}
export const categoryUrl = (c: Category) => '/product-category/' + categoryPath(c).map((x) => x.slug).join('/');
/** descendant ids including itself */
export function descendantIds(id: number): number[] {
  return [id, ...childCategories(id).flatMap((c) => descendantIds(c.id))];
}
export const productsInCategory = (id: number) => {
  const ids = new Set(descendantIds(id));
  return products.filter((p) => p.cats.some((c) => ids.has(c)));
};
export const categoryCount = (c: Category) => productsInCategory(c.id).length;
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getPage = (slug: string) => pages.find((p) => p.slug === slug);

/** Returns a public URL for a WP-relative upload path (e.g. 2026/11/x.webp) only if the file exists in /public/uploads. */
export function uploadUrl(rel: string | null | undefined): string | null {
  if (!rel) return null;
  const file = path.join(process.cwd(), 'public', 'uploads', rel);
  return fs.existsSync(file) ? '/uploads/' + rel : null;
}
/** Prefers the original, falls back to the "-scaled" counterpart WordPress generates for large images. */
export function productImage(rel: string | null | undefined): string | null {
  return uploadUrl(rel);
}
export function formatPrice(v: string | number | null | undefined) {
  if (v === null || v === undefined || v === '') return '';
  const n = Number(v);
  return 'AED ' + n.toLocaleString('en-AE', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}
export function priceRange(p: Product): { min: number; max: number } {
  const vals = (p.variations.length ? p.variations.map((v) => v.price) : [p.price]).map(Number).filter((n) => !isNaN(n) && n > 0);
  return { min: Math.min(...vals), max: Math.max(...vals) };
}
export const onSale = (p: Product) => !!p.sale && Number(p.sale) < Number(p.regular);
