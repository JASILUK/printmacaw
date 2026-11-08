'use client';
import { useState, type ReactNode } from 'react';
import ProductBuy from './ProductBuy';
import type { Product } from '@/lib/types';
export default function ProductGallery({ images, name, product, varImages, before, after }: { images: string[]; name: string; product: Product; varImages: Record<number, string | null>; before: ReactNode; after: ReactNode }) {
  const [cur, setCur] = useState<string | null>(images[0] || null);
  const thumbs = Array.from(new Set(images));
  return (
    <>
      <section className="pm-product__gallery" aria-label="Product images">
        <div className="woocommerce-product-gallery">
          <div className="woocommerce-product-gallery__wrapper">
            <div className="woocommerce-product-gallery__image">
              {cur ? <img src={cur} alt={name} width={900} height={900} style={{ width: '100%', height: 'auto' }} fetchPriority="high" />
                : <div style={{ aspectRatio: '1/1', display: 'grid', placeItems: 'center', background: 'var(--pm-bg-2)', color: 'var(--pm-text-2)', fontWeight: 700, textAlign: 'center', padding: 24 }}>{name}</div>}
            </div>
            {thumbs.length > 1 && <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {thumbs.map((t) => <button key={t} type="button" aria-label="Show image" onClick={() => setCur(t)} style={{ width: 72, height: 72, padding: 0, border: t === cur ? '2px solid var(--pm-teal-500)' : '1px solid var(--pm-border)', borderRadius: 8, overflow: 'hidden', background: '#fff' }}><img src={t} alt="" width={72} height={72} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" /></button>)}
            </div>}
          </div>
        </div>
      </section>
      <section className="pm-product__summary">{before}<ProductBuy p={product} image={images[0] || null} varImages={varImages} onImage={setCur} />{after}</section>
    </>
  );
}
