'use client';
import { useEffect } from 'react';
/** Loads the original theme's vanilla JS (sliders, reveal animations, drawer) after hydration. */
export default function ThemeScripts({ files }: { files: string[] }) {
  useEffect(() => {
    const tags = files.map((f) => {
      const s = document.createElement('script');
      s.src = f; s.async = false; document.body.appendChild(s); return s;
    });
    return () => tags.forEach((t) => t.remove());
  }, [files]);
  return null;
}
