'use client';

export function MobileFilterToggle() {
  const toggle = () => {
    document.querySelector('.pm-shop-sidebar')?.classList.toggle('is-open');
    document.querySelector('.pm-filter-overlay')?.classList.toggle('is-visible');
  };
  
  return (
    <div className="pm-shop-mobile-controls">
      <button className="pm-shop-mobile-controls__filter" onClick={toggle}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
        Filters
      </button>
    </div>
  );
}

export function MobileFilterClose() {
  const close = () => {
    document.querySelector('.pm-shop-sidebar')?.classList.remove('is-open');
    document.querySelector('.pm-filter-overlay')?.classList.remove('is-visible');
  };
  
  return (
    <button className="pm-shop-sidebar__close" onClick={close} aria-label="Close filters">
      ✕
    </button>
  );
}

export function MobileFilterOverlay() {
  const close = () => {
    document.querySelector('.pm-shop-sidebar')?.classList.remove('is-open');
    document.querySelector('.pm-filter-overlay')?.classList.remove('is-visible');
  };
  
  return <div className="pm-filter-overlay" onClick={close} aria-hidden="true" />;
}