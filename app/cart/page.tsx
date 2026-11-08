'use client';
import Link from 'next/link';
import '../../styles/product.css';
import { useCart } from '@/lib/cart';
const money = (n: number) => 'AED ' + n.toLocaleString('en-AE', { maximumFractionDigits: 2 });
export default function CartPage() {
  const { lines, subtotal, setQty, remove, ready } = useCart();
  return (
    <div className="pm-container" style={{ padding: '48px 0 96px' }}>
      <h1>Cart</h1>
      {!ready ? <p>Loading your cart…</p> : lines.length === 0 ? (
        <div className="woocommerce-info"><p>Your cart is currently empty.</p><Link className="pm-btn pm-btn--primary" href="/shop">Return to shop</Link></div>
      ) : (
        <div style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', alignItems: 'start' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 16 }}>
            {lines.map((l) => (
              <li key={l.key} style={{ display: 'flex', gap: 16, border: '1px solid var(--pm-border)', borderRadius: 14, padding: 16, alignItems: 'center' }}>
                {l.image ? <img src={l.image} alt="" width={88} height={88} style={{ borderRadius: 10, objectFit: 'cover' }} /> : <div style={{ width: 88, height: 88, borderRadius: 10, background: 'var(--pm-bg-2)' }} />}
                <div style={{ flex: 1 }}>
                  <Link href={`/product/${l.slug}`}><strong>{l.name}</strong></Link>
                  {l.variant && <div style={{ color: 'var(--pm-text-2)', fontSize: 14 }}>{l.variant}</div>}
                  <div>{money(l.price)}</div>
                  <div className="pm-qty quantity" style={{ marginTop: 8 }}>
                    <button type="button" className="pm-qty__btn" aria-label="Decrease quantity" onClick={() => setQty(l.key, l.qty - 1)}>−</button>
                    <input className="qty" type="number" min={1} value={l.qty} aria-label={`Quantity for ${l.name}`} onChange={(e) => setQty(l.key, parseInt(e.target.value || '1', 10) || 1)} />
                    <button type="button" className="pm-qty__btn" aria-label="Increase quantity" onClick={() => setQty(l.key, l.qty + 1)}>+</button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}><strong>{money(l.price * l.qty)}</strong><br /><button type="button" onClick={() => remove(l.key)} style={{ background: 'none', border: 0, color: 'var(--pm-error)', cursor: 'pointer', padding: 0 }}>Remove</button></div>
              </li>
            ))}
          </ul>
          <aside style={{ border: '1px solid var(--pm-border)', borderRadius: 14, padding: 24 }}>
            <h2 style={{ fontSize: 20 }}>Cart totals</h2>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><strong>{money(subtotal)}</strong></p>
            <p style={{ color: 'var(--pm-text-2)', fontSize: 14 }}>Shipping and VAT are calculated at checkout.</p>
            <Link className="pm-btn pm-btn--primary" href="/checkout" style={{ display: 'block', textAlign: 'center' }}>Proceed to checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
