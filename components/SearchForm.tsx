export default function SearchForm({ defaultValue = '' }: { defaultValue?: string }) {
  return (
    <form role="search" method="get" action="/shop" className="pm-product-search">
      <label className="screen-reader-text" htmlFor="pm-s">Search products</label>
      <input id="pm-s" className="pm-product-search__input" type="search" name="s" defaultValue={defaultValue} placeholder="Search products…" />
      <button className="pm-product-search__submit" type="submit" aria-label="Search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
    </form>
  );
}
