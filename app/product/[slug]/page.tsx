import '../../../styles/product.css';
import '../../../styles/shop.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { products, getProduct, getCategory, categoryPath, categoryUrl, productImage, uploadUrl, productsInCategory, priceRange } from '@/lib/data';
import { SITE_URL, waUrl } from '@/lib/site';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductBuy from '@/components/shop/ProductBuy';

export function generateStaticParams() { return products.map((p) => ({ slug: p.slug })); }
const strip = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug); if (!p) return {};
  const img = productImage(p.image);
  return { title: p.name, description: strip(p.short || p.description).slice(0, 160) || `Order ${p.name} from Print Macaw.`, alternates: { canonical: `/product/${p.slug}` }, openGraph: { title: p.name, images: img ? [img] : undefined } };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug); if (!p) notFound();
  const cats = p.cats.map(getCategory).filter(Boolean) as NonNullable<ReturnType<typeof getCategory>>[];
  const main = cats[0];
  const path = main ? categoryPath(main) : [];
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Shop', href: '/shop' }, ...path.map((c) => ({ name: c.name, href: categoryUrl(c) })), { name: p.name }];
  const images = [productImage(p.image), ...p.gallery.map(uploadUrl), ...p.variations.map((v) => uploadUrl(v.image))].filter(Boolean) as string[];
  const varImages = Object.fromEntries(p.variations.map((v) => [v.id, uploadUrl(v.image)]));
  const related = (main ? productsInCategory(main.id) : products).filter((x) => x.id !== p.id).slice(0, 4);
  const { min, max } = priceRange(p);
  const wa = waUrl(`Hi Print Macaw, I'm interested in "${p.name}". Could you help me?`);
  const ld = { '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: strip(p.short || p.description), image: images.map((i) => SITE_URL + i), sku: p.sku || undefined,
    offers: { '@type': 'AggregateOffer', priceCurrency: 'AED', lowPrice: min, highPrice: max, availability: p.stock === 'instock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${SITE_URL}/product/${p.slug}` } };
  const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.href ? SITE_URL + c.href : undefined })) };
  return (
    <div className="pm-product product">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([ld, bc]) }} />
      <div className="pm-product__container">
        <div style={{ padding: '16px 0' }}><Breadcrumbs items={crumbs} /></div>
        <div className="pm-product__layout">
          <ProductGallery images={images} name={p.name} product={p} varImages={varImages}
            before={<>
              <div className="pm-product__eyebrow">PRINT MACAW COLLECTION</div>
              {cats.length > 0 && <div className="pm-product__categories">{cats.map((c, i) => <span key={c.id}>{i > 0 && ', '}<Link href={categoryUrl(c)}>{c.name}</Link></span>)}</div>}
              <h1 className="product_title entry-title">{p.name}</h1>
              {p.short && <div className="woocommerce-product-details__short-description" dangerouslySetInnerHTML={{ __html: p.short }} />}
            </>}
            after={<>
              {wa && <a className="pm-product__whatsapp" href={wa} target="_blank" rel="noopener noreferrer"><img src="/theme/icons/whatsapp.svg" alt="" width={24} height={24} /><span>Enquire on WhatsApp</span></a>}
              <div className="pm-product__assurance">
                {['Professional print quality', 'Secure checkout', 'Dedicated customer support'].map((t) => <div key={t} className="pm-product__assurance-item"><span className="pm-product__assurance-icon" aria-hidden="true">✓</span><span>{t}</span></div>)}
              </div>
            </>}
          />
        </div>
        <div className="pm-product__details pm-shop pm-shop--embedded">
          {p.description.trim() && <div className="woocommerce-tabs"><h2>Description</h2><div dangerouslySetInnerHTML={{ __html: p.description }} /></div>}
          {related.length > 0 && <section className="related products"><h2>Related products</h2><ul className="products columns-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</ul></section>}
        </div>
      </div>
    </div>
  );
}
