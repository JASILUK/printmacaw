'use client';
import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';

const slugify = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-');
const money = (n: number) => 'AED ' + n.toLocaleString('en-AE', { maximumFractionDigits: 2 });
export type Imgs = { main: string | null; variations: Record<number, string | null> };

export default function ProductBuy({ p, image, varImages, onImage }: { p: Pick<Product, 'id' | 'name' | 'slug' | 'type' | 'price' | 'regular' | 'sale' | 'stock' | 'attributes' | 'variations'>; image: string | null; varImages: Record<number, string | null>; onImage?: (src: string | null) => void }) {
  const { add } = useCart();
  const attrs = useMemo(() => p.attributes.filter((a) => p.variations.some((v) => a.slug in v.attributes)), [p]);
  const [sel, setSel] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');
  const variable = p.type === 'variable' && p.variations.length > 0;
  const match = variable ? p.variations.find((v) => attrs.every((a) => sel[a.slug] && (v.attributes[a.slug] === '' || v.attributes[a.slug] === undefined || v.attributes[a.slug] === sel[a.slug]))) : undefined;
  const price = variable ? (match ? Number(match.price) : null) : Number(p.price);
  const regular = match ? Number(match.regular) : Number(p.regular);
  const inStock = variable ? (match ? match.stock === 'instock' : true) : p.stock === 'instock';
  const all = variable ? p.variations.map((v) => Number(v.price)).filter(Boolean) : [];
  const complete = !variable || (!!match && attrs.every((a) => sel[a.slug]));

  const pick = (slug: string, val: string) => {
    const next = { ...sel, [slug]: val }; setSel(next);
    const m = p.variations.find((v) => attrs.every((a) => next[a.slug] && (v.attributes[a.slug] === '' || v.attributes[a.slug] === next[a.slug])));
    if (m && varImages[m.id]) onImage?.(varImages[m.id]);
  };
  const submit = () => {
    if (!complete || !inStock || price == null) { setMsg('Please choose product options before adding to cart.'); return; }
    add({ productId: p.id, variationId: match?.id, name: p.name, variant: variable ? attrs.map((a) => sel[a.slug] && a.options.find((o) => slugify(o) === sel[a.slug])).filter(Boolean).join(' / ') : undefined, price, image: match ? varImages[match.id] || image : image, slug: p.slug, attributes: variable ? Object.fromEntries(Object.entries(sel).map(([k, v]) => ['attribute_' + k, v])) : undefined }, qty);
    setMsg(`“${p.name}” has been added to your cart.`);
  };
  return (
    <div>
      <p className="price">
        {price != null ? (regular > price ? <><del>{money(regular)}</del> <ins>{money(price)}</ins></> : money(price)) : all.length ? (Math.min(...all) === Math.max(...all) ? money(all[0]) : `${money(Math.min(...all))} – ${money(Math.max(...all))}`) : ''}
      </p>
      {variable && <table className="variations"><tbody>{attrs.map((a) => (
        <tr key={a.slug}><th className="label"><label>{a.name}</label></th><td className="value">
          <div className="pm-pills" role="radiogroup" aria-label={a.name}>
            {a.options.map((o) => {
              const s = slugify(o), on = sel[a.slug] === s;
              const avail = p.variations.some((v) => (v.attributes[a.slug] === s || v.attributes[a.slug] === '') && v.stock === 'instock');
              return <button key={o} type="button" role="radio" aria-checked={on} disabled={!avail} className={`pm-pill${a.slug.includes('color') ? ' pm-pill--color' : ''}${on ? ' pm-pill-current is-selected' : ''}`} onClick={() => pick(a.slug, s)}>
                {a.slug.includes('color') && <span className="pm-pill__dot" style={{ background: s.replace(/-/g, '').replace('royalblue', 'royalblue') }} />}<span className="pm-pill__label">{o}</span></button>;
            })}
          </div></td></tr>))}</tbody></table>}
      <p className={`stock ${inStock ? 'in-stock' : 'out-of-stock'}`}>{inStock ? 'In stock' : 'Out of stock'}</p>
      <div className="woocommerce-variation-add-to-cart" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="pm-qty quantity">
          <button type="button" className="pm-qty__btn" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <input className="qty" type="number" min={1} max={999} value={qty} aria-label="Quantity" onChange={(e) => setQty(Math.max(1, Math.min(999, parseInt(e.target.value || '1', 10) || 1)))} />
          <button type="button" className="pm-qty__btn" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(999, q + 1))}>+</button>
        </div>
        <button type="button" className="single_add_to_cart_button button alt" disabled={!inStock} onClick={submit}>{variable && !complete ? 'Choose options' : 'Add to cart'}</button>
      </div>
      {msg && <div role="status" className={msg.startsWith('Please') ? 'woocommerce-error' : 'woocommerce-message'} style={{ marginTop: 16 }}>{msg} {!msg.startsWith('Please') && <a href="/cart">View cart</a>}</div>}
    </div>
  );
}
