'use client';

export function MobileFilterToggle() {
  const toggle = () => {
    const sidebar = document.querySelector('.pm-shop-sidebar');
    const overlay = document.querySelector('.pm-filter-overlay');
    if (!sidebar || !overlay) return;
    
    const isOpen = sidebar.classList.toggle('is-open');
    overlay.classList.toggle('is-visible');
    
    // Lock body scroll so the page behind doesn't move
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };
  
  return (
    <div className="pm-shop-mobile-controls">
      <button className="pm-shop-mobile-controls__filter" onClick={toggle} aria-label="Open filters">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M7 12h10M10 18h4"/>
        </svg>
        Filters
      </button>
    </div>
  );
}

export function MobileFilterClose() {
  const close = () => {
    const sidebar = document.querySelector('.pm-shop-sidebar');
    const overlay = document.querySelector('.pm-filter-overlay');
    if (!sidebar || !overlay) return;
    
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  };
  
  return (
    <button className="pm-shop-sidebar__close" onClick={close} aria-label="Close filters">
      ✕
    </button>
  );
}

export function MobileFilterOverlay() {
  const close = () => {
    const sidebar = document.querySelector('.pm-shop-sidebar');
    const overlay = document.querySelector('.pm-filter-overlay');
    if (!sidebar || !overlay) return;
    
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  };
  
  return <div className="pm-filter-overlay" onClick={close} aria-hidden="true" />;
}