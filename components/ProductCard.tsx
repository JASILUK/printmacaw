import Link from 'next/link';
import type { Product } from '@/lib/types';
import { getCategory, productImage, formatPrice, priceRange, onSale } from '@/lib/data';
import { uploadUrl } from '@/lib/data';
import AddToCartButton from './AddToCartButton';

export default function ProductCard({ p }: { p: Product }) {
  const cat = getCategory(p.cats[0]);
  const img = productImage(p.image);
  const hover = uploadUrl(p.gallery[0]);
  const { min, max } = priceRange(p);
  const pct = p.type === 'simple' && onSale(p) ? Math.round(((Number(p.regular) - Number(p.sale)) / Number(p.regular)) * 100) : 0;
  const sold = p.stock !== 'instock';
  const color = p.attributes.find((a) => a.slug === 'pa_color');
  const size = p.attributes.find((a) => a.slug === 'pa_size' || a.slug === 'pa_sizes');
  return (
    <li className="pm-product-card product">
      <div className="pm-product-card__inner">
        <div className="pm-product-card__media">
          {sold ? <span className="pm-product-card__sale-badge pm-product-card__sale-badge--muted">SOLD OUT</span>
            : pct > 0 ? <span className="pm-product-card__sale-badge">{pct}% OFF</span>
            : onSale(p) ? <span className="pm-product-card__sale-badge">SALE</span> : null}
          <Link className="pm-product-card__image-link" href={`/product/${p.slug}`} aria-label={p.name}>
            {img ? <img className="pm-product-card__image" src={img} alt={p.name} loading="lazy" decoding="async" width={450} height={450} />
              : <span className="pm-product-card__image" style={{ display: 'grid', placeItems: 'center', background: 'var(--pm-bg-2)', color: 'var(--pm-text-2)', fontWeight: 700, textAlign: 'center', padding: 16 }}>{p.name}</span>}
            {hover && <img className="pm-product-card__image pm-product-card__image--hover" src={hover} alt="" loading="lazy" />}
          </Link>
        </div>
        <div className="pm-product-card__content">
          {cat && <span className="pm-product-card__category">{cat.name}</span>}
          <h2 className="pm-product-card__title"><Link href={`/product/${p.slug}`}>{p.name}</Link></h2>
          <div className="pm-product-card__price">
            <span className="price">{min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`}</span>
          </div>
          {color && <div className="pm-product-card__colors">{color.options.slice(0, 6).map((o) => <span key={o} className="pm-product-card__dot" title={o} style={{ ['--pm-dot' as string]: o.toLowerCase().replace(/\s+/g, '') }} />)}{color.options.length > 6 && <span className="pm-product-card__more">+{color.options.length - 6}</span>}</div>}
          {size && <div className="pm-product-card__sizes">{size.options.slice(0, 4).map((o) => <span key={o} className="pm-product-card__size">{o}</span>)}{size.options.length > 4 && <span className="pm-product-card__more">+{size.options.length - 4}</span>}</div>}
          <div className="pm-product-card__actions">
            <div className="pm-product-card__cart">
              {p.type === 'simple' && !sold
                ? <AddToCartButton product={{ productId: p.id, name: p.name, price: Number(p.price), image: img, slug: p.slug }} />
                : <Link className="button" href={`/product/${p.slug}`}>{sold ? 'Read more' : 'View Product'}</Link>}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
