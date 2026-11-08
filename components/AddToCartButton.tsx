'use client';
import { useState } from 'react';
import { useCart, type CartLine } from '@/lib/cart';
export default function AddToCartButton({ product }: { product: Omit<CartLine, 'key' | 'qty'> }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="button add_to_cart_button" onClick={() => { add(product, 1); setDone(true); setTimeout(() => setDone(false), 1500); }}>
      {done ? 'Added ✓' : 'Add to cart'}
    </button>
  );
}
