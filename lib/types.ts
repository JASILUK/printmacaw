export type Category = { id: number; slug: string; name: string; parent: number; description: string; image: string | null; order: number };
export type Variation = { id: number; attributes: Record<string, string>; price: string | null; regular: string | null; sale: string | null; image: string | null; stock: string };
export type Attribute = { name: string; slug: string; options: string[] };
export type Product = {
  id: number; slug: string; name: string; description: string; short: string;
  price: string | null; regular: string | null; sale: string | null; sku: string | null; stock: string;
  image: string | null; gallery: string[]; cats: number[]; featured: boolean; order: number;
  type: string; attributes: Attribute[]; variations: Variation[]; date: string;
};
export type PageItem = { slug: string; title: string; content: string; id: number };
export type Testimonial = { name: string; content: string; meta: Record<string, string> };
