'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type CartLine = { key: string; productId: number; variationId?: number; name: string; variant?: string; price: number; image: string | null; slug: string; qty: number; attributes?: Record<string, string> };
type Ctx = { lines: CartLine[]; count: number; subtotal: number; add: (l: Omit<CartLine, 'key' | 'qty'>, qty?: number) => void; setQty: (key: string, qty: number) => void; remove: (key: string) => void; clear: () => void; ready: boolean };
const CartCtx = createContext<Ctx | null>(null);
const KEY = 'pm_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setLines(JSON.parse(raw)); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {} } }, [lines, ready]);
  const add = useCallback<Ctx['add']>((l, qty = 1) => {
    const key = `${l.productId}:${l.variationId ?? 0}`;
    setLines((cur) => {
      const f = cur.find((x) => x.key === key);
      return f ? cur.map((x) => (x.key === key ? { ...x, qty: x.qty + qty } : x)) : [...cur, { ...l, key, qty }];
    });
  }, []);
  const setQty = useCallback((key: string, qty: number) => setLines((c) => c.map((x) => (x.key === key ? { ...x, qty: Math.max(1, Math.min(999, qty)) } : x))), []);
  const remove = useCallback((key: string) => setLines((c) => c.filter((x) => x.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);
  const value = useMemo(() => ({ lines, count: lines.reduce((a, l) => a + l.qty, 0), subtotal: lines.reduce((a, l) => a + l.qty * l.price, 0), add, setQty, remove, clear, ready }), [lines, add, setQty, remove, clear, ready]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error('useCart outside CartProvider');
  return c;
}
