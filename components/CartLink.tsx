'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
export default function CartLink() {
  const { count } = useCart();
  return (
    <Link className="pm-header-cart" href="/cart" aria-label={`Cart, ${count} items`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 20a1 1 0 100-2 1 1 0 000 2zM18 20a1 1 0 100-2 1 1 0 000 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span className="pm-cart-count">{count}</span>
    </Link>
  );
}
