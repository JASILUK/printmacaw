import Link from 'next/link';
import type { Category, Product } from '@/lib/types';
import { topCategories, categoryUrl, uploadUrl } from '@/lib/data';
import ProductCard from '../ProductCard';
import Breadcrumbs from '../Breadcrumbs';
import SearchForm from '../SearchForm';
import { MobileFilterToggle, MobileFilterClose, MobileFilterOverlay } from './MobileFilterControls';

export const PER_PAGE = 12;

export function sortProducts(list: Product[], orderby: string) {
  const l = [...list];
  const price = (p: Product) => Number(p.price) || 0;
  if (orderby === 'price') l.sort((a, b) => price(a) - price(b));
  else if (orderby === 'price-desc') l.sort((a, b) => price(b) - price(a));
  else if (orderby === 'date') l.sort((a, b) => b.date.localeCompare(a.date));
  else if (orderby === 'title') l.sort((a, b) => a.name.localeCompare(b.name));
  return l;
}

export default function ShopArchive({ 
  title, description, category, crumbs, list, basePath, sp 
}: {
  title: string; 
  description?: string; 
  category?: Category; 
  crumbs: { name: string; href?: string }[];
  list: Product[]; 
  basePath: string; 
  sp: { s?: string; orderby?: string; page?: string };
}) {
  const orderby = sp.orderby || 'menu_order';
  const sorted = sortProducts(list, orderby);
  const pages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, parseInt(sp.page || '1', 10) || 1));
  const slice = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const bg = category ? uploadUrl(category.image) : null;

  const qs = (o: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    Object.entries({ s: sp.s, orderby: sp.orderby, ...o }).forEach(([k, v]) => { if (v) p.set(k, String(v)); });
    const q = p.toString(); 
    return q ? `${basePath}?${q}` : basePath;
  };

  return (
    <section className="pm-shop">
      <div className="pm-shop__container">
        
        {/* HERO SECTION */}
        <header className={`pm-shop-header${bg ? ' has-bg' : ''}`}>
          {bg && <div className="pm-shop-header__bg" aria-hidden="true"><img className="pm-shop-header__bg-image" src={bg} alt="" loading="eager" /></div>}
          <div className="pm-shop-header__crumbs"><Breadcrumbs items={crumbs} /></div>
          <div className="pm-shop-header__content">
            <span className="pm-shop-header__eyebrow">PRINT MACAW COLLECTION</span>
            <h1 className="pm-shop-header__title">{title}</h1>
            <div className="pm-shop-header__description" {...(description ? { dangerouslySetInnerHTML: { __html: description } } : {})}>
              {description ? undefined : <p>Explore professional printing, branding and custom merchandise for every business.</p>}
            </div>
            <div className="pm-shop-search"><SearchForm defaultValue={sp.s} /></div>
          </div>
        </header>

        {/* TOP CATEGORY PILLS */}
        <nav className="pm-shop-categories" aria-label="Product categories">
          <Link className={`pm-shop-categories__link ${!category ? 'is-active' : ''}`} href="/shop">All Products</Link>
          {topCategories().filter((c) => c.slug !== 'uncategorized').map((c) => (
            <Link key={c.id} className={`pm-shop-categories__link ${category?.id === c.id ? 'is-active' : ''}`} href={categoryUrl(c)}>{c.name}</Link>
          ))}
        </nav>

        {/* MAIN LAYOUT */}
        <div className="pm-shop-layout">
          
          <MobileFilterOverlay />

          {/* PREMIUM SIDEBAR FILTERS */}
          <aside className="pm-shop-sidebar">
            <div className="pm-shop-sidebar__header">
              <h2>Filters</h2>
              <MobileFilterClose />
            </div>

            <div className="pm-shop-filters">
              <div className="pm-shop-filters__groups">
                
                {/* Categories */}
                <details className="pm-filter-group" open>
                  <summary>Categories</summary>
                  <div className="pm-filter-group__body">
                    <div className="pm-filter-options">
                      {topCategories().slice(0, 6).map(c => (
                        <label key={c.id} className="pm-filter-option">
                          <input type="checkbox" />
                          <span>{c.name}</span>
                          <small>(12)</small>
                        </label>
                      ))}
                    </div>
                  </div>
                </details>

                {/* Colors */}
                <details className="pm-filter-group" open>
                  <summary>Color</summary>
                  <div className="pm-filter-group__body">
                    <div className="pm-swatches">
                      {['#000000', '#ffffff', '#ff0000', '#0000ff', '#008000', '#ffff00'].map(color => (
                        <label key={color} className="pm-swatch" title={color}>
                          <input type="checkbox" />
                          <span className="pm-swatch__dot" style={{ ['--pm-swatch' as string]: color }} />
                        </label>
                      ))}
                    </div>
                  </div>
                </details>

                {/* Sizes */}
                <details className="pm-filter-group" open>
                  <summary>Size</summary>
                  <div className="pm-filter-group__body">
                    <div className="pm-sizes-list">
                      {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                        <label key={size} className="pm-size-option">
                          <input type="checkbox" />
                          <span>{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </details>

                {/* Price Range */}
                <details className="pm-filter-group" open>
                  <summary>Price</summary>
                  <div className="pm-filter-group__body pm-price">
                    <div className="pm-price__values">
                      <div className="pm-price__chip">AED 0</div>
                      <span className="pm-price__dash">-</span>
                      <div className="pm-price__chip">AED 7,500</div>
                    </div>
                    <div className="pm-range">
                      <div className="pm-range__track" />
                      <div className="pm-range__fill" style={{ left: '0%', right: '20%' }} />
                      <input type="range" min="0" max="7500" defaultValue="0" className="pm-range__input" />
                      <input type="range" min="0" max="7500" defaultValue="6000" className="pm-range__input" />
                    </div>
                  </div>
                </details>

              </div>

              {/* Filter Actions */}
              <div className="pm-shop-filters__actions">
                <button className="pm-shop-filters__apply">Apply Filters</button>
                <button className="pm-shop-filters__reset">Reset All</button>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="pm-shop-main">
            
            <MobileFilterToggle />

            {/* Toolbar (Sorting & Count) */}
            <div className="pm-shop-toolbar">
              <p className="woocommerce-result-count">
                {sorted.length ? `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, sorted.length)} of ${sorted.length} products` : 'No products found'}
              </p>
              <form method="get" action={basePath} className="woocommerce-ordering">
                {sp.s && <input type="hidden" name="s" value={sp.s} />}
                <label className="screen-reader-text" htmlFor="orderby">Sort</label>
                <select id="orderby" name="orderby" defaultValue={orderby}>
                  <option value="menu_order">Default sorting</option>
                  <option value="date">Newest</option>
                  <option value="price">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="title">Name</option>
                </select>
                <noscript><button type="submit">Sort</button></noscript>
              </form>
            </div>

            {/* Products Grid */}
            {slice.length ? (
              <ul className="products">
                {slice.map((p) => <ProductCard key={p.id} p={p} />)}
              </ul>
            ) : (
              <p className="woocommerce-info">
                No products were found matching your selection. <Link href="/shop">View all products</Link>
              </p>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <nav className="woocommerce-pagination" aria-label="Pagination">
                <ul className="page-numbers">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <li key={n}>
                      {n === page ? (
                        <span className="page-numbers current" aria-current="page">{n}</span>
                      ) : (
                        <Link className="page-numbers" href={qs({ page: n > 1 ? n : undefined })}>{n}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            
          </main>
        </div>
      </div>
    </section>
  );
}