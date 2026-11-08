
import Image from 'next/image';
import Link from 'next/link';

import { topCategories, categoryUrl } from '@/lib/data';
import SearchForm from './SearchForm';
import CartLink from './CartLink';
import { contact } from '@/lib/site';

const chevron = (
  <svg
    className="pm-chevron"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const catIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 4h16v16H4zM4 12h16M12 4v16"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export default function Header() {
  const cats = topCategories();

  return (
    <>
      <a className="pm-skip-link" href="#primary">
        Skip to content
      </a>

      <div className="pm-announcement">
        <div className="pm-container">
          <p>Free delivery in Dubai on orders above AED 500</p>
        </div>
      </div>

      <header className="pm-header">
        <div className="pm-container pm-header-inner">

          {/* BRAND LOGO */}
          <div className="pm-header-logo">
            <Link
              className="pm-site-logo"
              href="/"
              rel="home"
              aria-label="Print Macaw home"
            >
              <Image
                src="/images/printmacaw-logo.png"
                alt="Macaw Advertising - Designing, Printing, Branding"
                width={300}
                height={116}
                priority
                className="pm-header-logo-image"
              />
            </Link>
          </div>

          {/* NAVIGATION */}
          <div className="pm-header-nav-wrap">
            <nav
              className="pm-primary-navigation"
              aria-label="Primary navigation"
            >
              <div className="pm-drawer-overlay" />

              <button
                className="pm-menu-toggle"
                type="button"
                aria-expanded="false"
                aria-controls="pm-primary-menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="screen-reader-text">Menu</span>
              </button>

              {/* MOBILE DRAWER */}
              <div className="pm-drawer">
                <div className="pm-drawer-scrollable">

                  <div className="pm-drawer-head">
                    <SearchForm />

                    <button
                      className="pm-drawer-close"
                      type="button"
                      aria-label="Close menu"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 6l12 12M18 6L6 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="pm-drawer-promos">
                    <Link
                      href="/shop?orderby=popularity"
                      className="pm-promo-btn pm-promo-btn--dark"
                    >
                      Best Sellers
                    </Link>

                    <Link
                      href="/shop?orderby=date"
                      className="pm-promo-btn pm-promo-btn--green"
                    >
                      New Arrivals
                    </Link>
                  </div>

                  <div className="pm-mobile-cats">
                    {cats.map((c) => (
                      <Link
                        key={c.id}
                        href={categoryUrl(c)}
                        className="pm-mobile-cat-item"
                      >
                        <span className="pm-mobile-cat-icon">
                          {catIcon}
                        </span>

                        <span className="pm-mobile-cat-name">
                          {c.name}
                        </span>

                        {chevron}
                      </Link>
                    ))}
                  </div>

                  <div className="pm-drawer-company">
                    <div className="pm-company-row">
                      <div>
                        <strong>Office:</strong>
                        Print Macaw LLC, Dubai, UAE
                      </div>
                    </div>

                    {contact.email && (
                      <div className="pm-company-row">
                        <div>
                          <strong>Email:</strong>
                          {contact.email}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pm-drawer-actions">
                  <Link
                    href="/contact"
                    className="pm-action-btn pm-action-btn--outline"
                  >
                    Contact Us
                  </Link>

                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                      className="pm-action-btn pm-action-btn--dark"
                    >
                      Call Us
                    </a>
                  )}
                </div>
              </div>

              {/* DESKTOP MENU */}
              <ul id="pm-primary-menu" className="pm-menu">

                <li className="pm-menu-item--mega pm-menu-item--toggleable">
                  <Link href="/shop">
                    <span className="pm-menu-label">Shop</span>
                  </Link>

                  <div
                    className="pm-mega"
                    role="region"
                    aria-label="Product categories"
                  >
                    <div className="pm-mega-inner">
                      <div className="pm-mega-grid">
                        {cats.map((c) => (
                          <Link
                            key={c.id}
                            className="pm-mega-cat-item"
                            href={categoryUrl(c)}
                          >
                            <span className="pm-mega-cat-icon">
                              {catIcon}
                            </span>

                            <span className="pm-mega-cat-name">
                              {c.name}
                            </span>

                            {chevron}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <Link href="/business-card-printing-dubai">
                    <span className="pm-menu-label">Services</span>
                  </Link>
                </li>

                <li>
                  <Link href="/about">
                    <span className="pm-menu-label">About</span>
                  </Link>
                </li>

                <li>
                  <Link href="/contact">
                    <span className="pm-menu-label">Contact</span>
                  </Link>
                </li>

              </ul>
            </nav>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="pm-header-search">
            <SearchForm />
          </div>

          {/* ACCOUNT AND CART */}
          <div className="pm-header-actions">

            <Link
              className="pm-header-account"
              href="/account"
              aria-label="My account"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M4 21c0-4 4-6 8-6s8 2 8 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Link>

            <CartLink />

          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="pm-mobile-search-row">
          <div className="pm-container">
            <SearchForm />
          </div>
        </div>
      </header>
    </>
  );
}
