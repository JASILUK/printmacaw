import Link from 'next/link';
import type { Product } from '@/lib/types';
import { getCategory, productImage, formatPrice, priceRange, onSale, uploadUrl } from '@/lib/data';
import { waUrl } from '@/lib/site';
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
  
  const wa = waUrl(`Hi Print Macaw! I'm interested in "${p.name}". Could you share more details?`);

  return (
    <li className="pm-product-card">
      <div className="pm-product-card__media">
        {sold ? (
          <span className="pm-product-card__badge pm-product-card__badge--muted">SOLD OUT</span>
        ) : pct > 0 ? (
          <span className="pm-product-card__badge">{pct}% OFF</span>
        ) : onSale(p) ? (
          <span className="pm-product-card__badge">SALE</span>
        ) : null}

        <Link className="pm-product-card__image-link" href={`/product/${p.slug}`} aria-label={p.name}>
          {img ? (
            <img className="pm-product-card__image" src={img} alt={p.name} loading="lazy" decoding="async" width={450} height={450} />
          ) : (
            <span className="pm-product-card__image-placeholder">{p.name}</span>
          )}
          {hover && <img className="pm-product-card__image pm-product-card__image--hover" src={hover} alt="" loading="lazy" />}
        </Link>
      </div>

      <div className="pm-product-card__body">
        <span className="pm-product-card__category">{cat ? cat.name : '\u00A0'}</span>
        
        <h2 className="pm-product-card__title">
          <Link href={`/product/${p.slug}`}>{p.name}</Link>
        </h2>

        <div className="pm-product-card__price">
          <span>{min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`}</span>
        </div>

        <div className="pm-product-card__swatches">
          {color && (
            <div className="pm-product-card__colors">
              {color.options.slice(0, 4).map((o) => (
                <span key={o} className="pm-product-card__dot" title={o} style={{ ['--pm-dot' as string]: o.toLowerCase().replace(/\s+/g, '') }} />
              ))}
              {color.options.length > 4 && <span className="pm-product-card__more">+{color.options.length - 4}</span>}
            </div>
          )}
          {size && (
            <div className="pm-product-card__sizes">
              {size.options.slice(0, 3).map((o) => <span key={o} className="pm-product-card__size">{o}</span>)}
              {size.options.length > 3 && <span className="pm-product-card__more">+{size.options.length - 3}</span>}
            </div>
          )}
        </div>

        <div className="pm-product-card__actions">
          <div className="pm-product-card__action-main">
            {p.type === 'simple' && !sold ? (
              <AddToCartButton product={{ productId: p.id, name: p.name, price: Number(p.price), image: img || '', slug: p.slug }} />
            ) : (
              <Link className="pm-product-card__view-btn" href={`/product/${p.slug}`}>
                {sold ? 'Read More' : 'View Product'}
              </Link>
            )}
          </div>
          {wa && (
            <a 
              className="pm-product-card__wa" 
              href={wa} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`Chat about ${p.name} on WhatsApp`}
            >
              <img src="/theme/icons/whatsapp.svg" alt="WhatsApp" width={18} height={18} />
            </a>
          )}
        </div>
      </div>
    </li>
  );
}