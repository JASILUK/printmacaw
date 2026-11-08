'use client';
import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { waUrl } from '@/lib/site';

const slugify = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-');
const money = (n: number) =>
  'AED ' + n.toLocaleString('en-AE', { maximumFractionDigits: 2 });

export default function ProductBuy({
  p,
  image,
  varImages,
  onImage,
}: {
  p: Pick<
    Product,
    'id' | 'name' | 'slug' | 'type' | 'price' | 'regular' | 'sale' | 'stock' | 'attributes' | 'variations'
  >;
  image: string | null;
  varImages: Record<number, string | null>;
  onImage?: (src: string | null) => void;
}) {
  const { add } = useCart();

  const attrs = useMemo(
    () => p.attributes.filter((a) => p.variations.some((v) => a.slug in v.attributes)),
    [p]
  );

  const [sel, setSel] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');
  const [isBuying, setIsBuying] = useState(false);

  const variable = p.type === 'variable' && p.variations.length > 0;

  const match = variable
    ? p.variations.find((v) =>
        attrs.every(
          (a) =>
            sel[a.slug] &&
            (v.attributes[a.slug] === '' ||
              v.attributes[a.slug] === undefined ||
              v.attributes[a.slug] === sel[a.slug])
        )
      )
    : undefined;

  const price = variable ? (match ? Number(match.price) : null) : Number(p.price);
  const regular = match ? Number(match.regular) : Number(p.regular);
  const inStock = variable
    ? match
      ? match.stock === 'instock'
      : true
    : p.stock === 'instock';
  const all = variable ? p.variations.map((v) => Number(v.price)).filter(Boolean) : [];
  const complete = !variable || (!!match && attrs.every((a) => sel[a.slug]));

  const discountPct =
    price && regular && regular > price
      ? Math.round(((regular - price) / regular) * 100)
      : 0;

  const pick = (slug: string, val: string) => {
    const next = { ...sel, [slug]: val };
    setSel(next);
    const m = p.variations.find((v) =>
      attrs.every(
        (a) => next[a.slug] && (v.attributes[a.slug] === '' || v.attributes[a.slug] === next[a.slug])
      )
    );
    if (m && varImages[m.id]) onImage?.(varImages[m.id]);
  };

  const buildCartLine = () => {
    const variantLabel = variable
      ? attrs
          .map((a) => {
            const opt = sel[a.slug];
            return opt && a.options.find((o) => slugify(o) === opt);
          })
          .filter(Boolean)
          .join(' / ')
      : undefined;
    return {
      productId: p.id,
      variationId: match?.id,
      name: p.name,
      variant: variantLabel,
      price: price ?? 0,
      image: match ? varImages[match.id] || image : image,
      slug: p.slug,
      attributes: variable
        ? Object.fromEntries(
            Object.entries(sel).map(([k, v]) => ['attribute_' + k, v])
          )
        : undefined,
    };
  };

  const submit = () => {
    if (!complete || !inStock || price == null) {
      setMsg('Please choose product options before adding to cart.');
      return;
    }
    add(buildCartLine(), qty);
    setMsg(`“${p.name}” has been added to your cart.`);
  };

  const buyNow = () => {
    if (!complete || !inStock || price == null) {
      setMsg('Please choose product options before continuing.');
      return;
    }
    setIsBuying(true);
    add(buildCartLine(), qty);
    // In production: trigger Apple Pay / Stripe / Checkout redirect here
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 300);
  };

  const wa = waUrl(`Hi Print Macaw! I'm interested in "${p.name}". Could you share more details?`);

  const displayPrice = () => {
    if (price != null) {
      return regular > price ? (
        <>
          <span className="pm-buy__price-current">{money(price)}</span>
          <span className="pm-buy__price-old">{money(regular)}</span>
        </>
      ) : (
        <span className="pm-buy__price-current">{money(price)}</span>
      );
    }
    if (all.length) {
      const mn = Math.min(...all);
      const mx = Math.max(...all);
      return (
        <span className="pm-buy__price-current">
          {mn === mx ? money(mn) : `${money(mn)} – ${money(mx)}`}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="pm-buy">
      {/* Price row */}
      <div className="pm-buy__price-row">
        <p className="pm-buy__price">{displayPrice()}</p>
        {discountPct > 0 && (
          <span className="pm-buy__discount">Save {discountPct}%</span>
        )}
      </div>

      {/* Stock status */}
      <div className={`pm-buy__stock${inStock ? ' is-in' : ' is-out'}`}>
        <span className="pm-buy__stock-dot" aria-hidden="true" />
        {inStock ? 'In stock — ready to ship' : 'Out of stock'}
      </div>

      {/* Variants */}
      {variable && (
        <div className="pm-buy__variants">
          {attrs.map((a) => {
            const isColor = a.slug.includes('color');
            const currentLabel = sel[a.slug]
              ? a.options.find((o) => slugify(o) === sel[a.slug])
              : null;
            return (
              <div key={a.slug} className="pm-buy__variant">
                <div className="pm-buy__variant-head">
                  <span className="pm-buy__variant-label">{a.name}</span>
                  {currentLabel && (
                    <span className="pm-buy__variant-current">{currentLabel}</span>
                  )}
                </div>
                <div
                  className={`pm-buy__pills${isColor ? ' pm-buy__pills--color' : ''}`}
                  role="radiogroup"
                  aria-label={a.name}
                >
                  {a.options.map((o) => {
                    const s = slugify(o);
                    const on = sel[a.slug] === s;
                    const avail = p.variations.some(
                      (v) =>
                        (v.attributes[a.slug] === s || v.attributes[a.slug] === '') &&
                        v.stock === 'instock'
                    );
                    return (
                      <button
                        key={o}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        aria-label={o}
                        disabled={!avail}
                        className={`pm-buy__pill${isColor ? ' pm-buy__pill--color' : ''}${on ? ' is-active' : ''}${!avail ? ' is-disabled' : ''}`}
                        onClick={() => pick(a.slug, s)}
                        title={o}
                      >
                        {isColor ? (
                          <span
                            className="pm-buy__pill-dot"
                            style={{ background: s.replace(/-/g, '') }}
                          />
                        ) : (
                          <span>{o}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quantity + actions */}
      <div className="pm-buy__actions">
        <div className="pm-buy__qty">
          <button
            type="button"
            className="pm-buy__qty-btn"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            className="pm-buy__qty-input"
            type="number"
            min={1}
            max={999}
            value={qty}
            aria-label="Quantity"
            onChange={(e) =>
              setQty(Math.max(1, Math.min(999, parseInt(e.target.value || '1', 10) || 1)))
            }
          />
          <button
            type="button"
            className="pm-buy__qty-btn"
            onClick={() => setQty((q) => Math.min(999, q + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="pm-buy__add"
          disabled={!inStock || (variable && !complete)}
          onClick={submit}
        >
          {variable && !complete ? 'Choose options' : 'Add to cart'}
        </button>
      </div>

      {/* Buy Now (Apple Pay style) */}
      {inStock && (
        <button
          type="button"
          className="pm-buy__buy-now"
          onClick={buyNow}
          disabled={isBuying}
          aria-label="Buy it now with Apple Pay"
        >
          {isBuying ? (
            'Redirecting…'
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor" className="pm-buy__apple" aria-hidden="true">
                <path d="M17.05 12.536c-.026-2.61 2.13-3.862 2.228-3.925-1.214-1.777-3.104-2.02-3.777-2.048-1.611-.163-3.144.948-3.961.948-.816 0-2.075-.924-3.41-.899-1.753.026-3.37 1.02-4.272 2.593-1.822 3.16-.466 7.836 1.307 10.398.867 1.256 1.9 2.666 3.256 2.615 1.306-.052 1.799-.845 3.378-.845 1.578 0 2.021.845 3.403.819 1.407-.026 2.3-1.279 3.16-2.54 1.001-1.458 1.412-2.872 1.435-2.946-.031-.014-2.752-1.056-2.78-4.17zm-2.613-7.85c.72-.874 1.205-2.086 1.072-3.297-1.037.042-2.293.691-3.038 1.564-.667.771-1.25 2.004-1.093 3.186 1.157.09 2.34-.588 3.059-1.453z" />
              </svg>
              <span>Buy it now</span>
            </>
          )}
        </button>
      )}

      {/* WhatsApp inline link */}
      {wa && (
        <a
          className="pm-buy__wa"
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/theme/icons/whatsapp.svg" alt="" width={20} height={20} />
          <span>Need help? Chat on WhatsApp</span>
        </a>
      )}

      {/* Feedback message */}
      {msg && (
        <div
          role="status"
          className={`pm-buy__msg${msg.startsWith('Please') ? ' is-error' : ' is-success'}`}
        >
          {msg}{' '}
          {!msg.startsWith('Please') && (
            <a href="/cart">View cart →</a>
          )}
        </div>
      )}
    </div>
  );
}