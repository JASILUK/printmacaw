'use client';
import { useEffect, useState, type ReactNode } from 'react';
import ProductBuy from './ProductBuy';
import type { Product } from '@/lib/types';

export default function ProductGallery({
  images,
  name,
  product,
  varImages,
  before,
  after,
}: {
  images: string[];
  name: string;
  product: Product;
  varImages: Record<number, string | null>;
  before: ReactNode;
  after: ReactNode;
}) {
  const thumbs = Array.from(new Set(images.filter(Boolean)));
  const [cur, setCur] = useState<string | null>(thumbs[0] || null);
  const [zoomed, setZoomed] = useState(false);
  const idx = cur ? thumbs.indexOf(cur) : 0;

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = zoomed ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [zoomed]);

  // Close lightbox with Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoomed(false); };
    if (zoomed) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomed]);

  const prev = () => {
    const i = Math.max(0, idx - 1);
    setCur(thumbs[i]);
  };
  const next = () => {
    const i = Math.min(thumbs.length - 1, idx + 1);
    setCur(thumbs[i]);
  };

  return (
    <>
      <section className="pm-product__gallery" aria-label="Product images">
        <div className="pm-gallery">
          {/* Left column: vertical thumbnails on desktop */}
          {thumbs.length > 1 && (
            <div className="pm-gallery__thumbs" role="group" aria-label="Product images">
              {thumbs.map((t, i) => (
                <button
                  key={t}
                  type="button"
                  className={`pm-gallery__thumb${t === cur ? ' is-active' : ''}`}
                  onClick={() => setCur(t)}
                  aria-label={`Show image ${i + 1} of ${thumbs.length}`}
                  aria-current={t === cur ? 'true' : 'false'}
                >
                  <img src={t} alt="" width={96} height={96} loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="pm-gallery__main">
            {cur ? (
              <button
                type="button"
                className="pm-gallery__zoom"
                onClick={() => setZoomed(true)}
                aria-label="View larger image"
              >
                <img
                  src={cur}
                  alt={name}
                  width={900}
                  height={900}
                  fetchPriority="high"
                  className="pm-gallery__img"
                />
                <span className="pm-gallery__zoom-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                  </svg>
                </span>
              </button>
            ) : (
              <div className="pm-gallery__placeholder">{name}</div>
            )}

            {thumbs.length > 1 && (
              <>
                <span className="pm-gallery__counter" aria-hidden="true">
                  {String(idx + 1).padStart(2, '0')} / {String(thumbs.length).padStart(2, '0')}
                </span>
                <div className="pm-gallery__nav">
                  <button
                    type="button"
                    className="pm-gallery__nav-btn"
                    onClick={prev}
                    disabled={idx === 0}
                    aria-label="Previous image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="pm-gallery__nav-btn"
                    onClick={next}
                    disabled={idx === thumbs.length - 1}
                    aria-label="Next image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {zoomed && cur && (
        <div
          className="pm-lightbox"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            className="pm-lightbox__close"
            onClick={() => setZoomed(false)}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <img
            src={cur}
            alt={name}
            className="pm-lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <section className="pm-product__summary">
        {before}
        <ProductBuy
          p={product}
          image={thumbs[0] || null}
          varImages={varImages}
          onImage={setCur}
        />
        {after}
      </section>
    </>
  );
}