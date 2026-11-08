'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
const money = (n: number) => 'AED ' + n.toLocaleString('en-AE', { maximumFractionDigits: 2 });
export default function Checkout() {
  const { lines, subtotal, ready, clear } = useCart();
  const [done, setDone] = useState<string | null>(null);
  const f = { display: 'grid', gap: 6, marginBottom: 14 } as const;
  if (done) return (
    <div className="pm-container" style={{ padding: '64px 0 96px', maxWidth: 640 }}>
      <h1>Thank you!</h1>
      <div className="woocommerce-message" role="status">Demo order <strong>#{done}</strong> received. No payment was taken and no real order was created.</div>
      <p><Link className="pm-btn pm-btn--primary" href="/shop">Continue shopping</Link></p>
    </div>
  );
  return (
    <div className="pm-container" style={{ padding: '48px 0 96px', maxWidth: 820 }}>
      <h1>Checkout</h1>
      <div className="woocommerce-info">Demo store: no payment is taken and no order is created.</div>
      {!ready ? <p>Loading…</p> : lines.length === 0 ? <div className="woocommerce-info"><p>Your cart is empty.</p><Link className="pm-btn pm-btn--primary" href="/shop">Return to shop</Link></div> : (
        <form onSubmit={(e) => { e.preventDefault(); setDone(String(Math.floor(10000 + Math.random() * 90000))); clear(); }} style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: 20 }}>Delivery details</h2>
            <div style={f}><label htmlFor="k-name">Full name *</label><input id="k-name" required autoComplete="name" /></div>
            <div style={f}><label htmlFor="k-email">Email *</label><input id="k-email" type="email" required autoComplete="email" /></div>
            <div style={f}><label htmlFor="k-phone">Phone *</label><input id="k-phone" type="tel" required autoComplete="tel" /></div>
            <div style={f}><label htmlFor="k-addr">Address *</label><textarea id="k-addr" rows={3} required /></div>
          </div>
          <aside style={{ border: '1px solid var(--pm-border)', borderRadius: 14, padding: 24 }}>
            <h2 style={{ fontSize: 20 }}>Your order</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>{lines.map((l) => <li key={l.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--pm-border)' }}><span>{l.name}{l.variant ? ` (${l.variant})` : ''} × {l.qty}</span><strong>{money(l.price * l.qty)}</strong></li>)}</ul>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total</span><strong>{money(subtotal)}</strong></p>
            <button type="submit" className="pm-btn pm-btn--primary" style={{ width: '100%' }}>Place demo order</button>
          </aside>
        </form>
      )}
    </div>
  );
}
