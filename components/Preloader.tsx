'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const BRAND = 'PRINT MACAW';
const TAGLINE = 'We print what you want!';
const EXIT_MS = 900;

type Phase = 'loading' | 'ready' | 'leaving' | 'gone';

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('loading');

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minMs = reduce ? 300 : 2400; // minimum time so the animation always finishes
    const maxMs = 8000; // safety net: never block the site longer than this
    const root = document.documentElement;
    const timers: number[] = [];

    let cancelled = false;
    let finished = false;
    let minDone = false;
    let pageDone = false;

    root.style.overflow = 'hidden';

    const finish = () => {
      if (finished || cancelled) return;
      finished = true;
      setPhase('ready');
      timers.push(
        window.setTimeout(() => {
          setPhase('leaving');
          timers.push(
            window.setTimeout(() => {
              root.style.overflow = '';
              setPhase('gone');
            }, EXIT_MS)
          );
        }, reduce ? 0 : 350)
      );
    };

    const check = () => {
      if (minDone && pageDone) finish();
    };

    timers.push(window.setTimeout(() => { minDone = true; check(); }, minMs));
    timers.push(window.setTimeout(() => { minDone = true; pageDone = true; check(); }, maxMs));

    const onLoad = () => {
      const fonts = document.fonts?.ready ?? Promise.resolve();
      fonts.then(() => { pageDone = true; check(); });
    };

    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('load', onLoad);
      root.style.overflow = '';
    };
  }, []);

  if (phase === 'gone') return null;

  const cls = [
    'pm-preloader',
    phase !== 'loading' ? 'is-ready' : '',
    phase === 'leaving' ? 'is-leaving' : '',
  ].join(' ').trim();

  return (
    <div className={cls} role="status" aria-live="polite" aria-busy={phase !== 'leaving'}>
      <span className="screen-reader-text">Loading Print Macaw</span>
      <noscript>
        <style>{`.pm-preloader{display:none!important}`}</style>
      </noscript>

      <div className="pm-preloader__bg" aria-hidden="true" />

      <div className="pm-preloader__inner" aria-hidden="true">
        <div className="pm-preloader__logo">
          <Image
            src="/images/printmacaw-logo.png"
            alt=""
            width={320}
            height={110}
            priority
          />
        </div>

        <div className="pm-preloader__brand">
          {BRAND.split('').map((ch, i) => (
            <span
              key={i}
              className="pm-preloader__char"
              style={{ ['--i' as string]: i }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </div>

        <p className="pm-preloader__tagline">{TAGLINE}</p>

        <div className="pm-preloader__track">
          <span className="pm-preloader__bar" />
        </div>
      </div>
    </div>
  );
}