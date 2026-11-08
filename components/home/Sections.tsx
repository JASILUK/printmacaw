import Link from 'next/link';
import { categories, categoryUrl, categoryCount, uploadUrl, products, testimonials } from '@/lib/data';
import { waUrl } from '@/lib/site';
import ProductCard from '../ProductCard';
import { contact } from '@/lib/site';

const U = (f: string) => `/uploads/2026/11/${f}`;
const Heading = ({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) => (
  <div className="pm-section-heading"><h2 id={id}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
);

const slides = [
  ['Branding & Creative Solutions', 'Make Your Brand Impossible to Ignore.', 'Creative branding and professional printing solutions that help your business stand out.', 'Macaw-Advertising-Branding-Showcase.webp', 'Professional advertising and branding showcase'],
  ['Retail Signage & Store Branding', 'Turn Your Store Into an Experience.', 'Premium retail signage and storefront branding designed to make a lasting impression.', 'Atelier-Noir-Luxury-Perfume-Storefront.webp', 'Luxury perfume retail storefront branding'],
  ['Retail Kiosks & Displays', 'Bring Your Brand Into the Spotlight.', 'Custom-branded kiosks and retail displays that bring your products closer to customers.', 'Aurelle-Skincare-Kiosk-in-the-Mall.webp', 'Branded skincare retail kiosk'],
  ['Exhibition & Event Branding', 'Make Every Event Count.', 'Stand out at exhibitions and events with professionally designed booths and branded displays.', 'Nexora-Business-Expo-Booth-Showcase.webp', 'Business exhibition booth branding'],
  ['Corporate & Promotional Gifts', 'Put Your Brand in Their Hands.', 'Thoughtful corporate gifts and promotional products customised with your brand identity.', 'Northline-Corporate-Gift-Collection.webp', 'Custom corporate gifts and promotional products'],
  ['Custom Apparel & Merchandise', 'Wear Your Brand With Pride.', 'Custom apparel and branded merchandise for businesses, teams and special occasions.', 'NOVA-Studio-Apparel-Showcase.webp', 'Custom branded apparel collection'],
  ['Commercial Printing', 'Print Quality That Speaks for Your Business.', 'Professional printing and branding solutions, made to communicate your business identity.', 'Form-Field-Branding-Showcase.webp', 'Commercial printing and branding showcase'],
];

export function Hero() {
  return (
    <section className="pm-hero" aria-roledescription="carousel" aria-label="Featured services">
      <div className="pm-hero__slider" data-pm-slider data-pm-interval="6000">
        <div className="pm-hero__slides" data-pm-slides aria-live="off">
          {slides.map((s, i) => {
            const T = (i === 0 ? 'h1' : 'h2') as 'h1' | 'h2';
            return (
              <article key={i} className={`pm-hero__slide${i === 0 ? ' is-active' : ''}`} data-pm-slide role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`} aria-hidden={i === 0 ? 'false' : 'true'} {...(i === 0 ? {} : { inert: true })}>
                <div className="pm-container pm-hero__inner">
                  <div className="pm-hero__content">
                    <span className="pm-hero__label">{s[0]}</span>
                    <T className="pm-hero__title">{s[1]}</T>
                    <p className="pm-hero__description">{s[2]}</p>
                    <div className="pm-hero__actions">
                      <Link className="pm-btn pm-btn--primary" href="/shop">Explore Our Products</Link>
                      <Link className="pm-btn pm-btn--outline" href="/contact">Get a Quote</Link>
                    </div>
                  </div>
                  <div className="pm-hero__media">
                    <img src={U(s[3])} alt={s[4]} {...(i === 0 ? { fetchPriority: 'high' as const, loading: 'eager' as const } : { loading: 'lazy' as const })} decoding="async" width={1200} height={900} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="pm-container pm-hero__controls">
          <div className="pm-hero__pagination" role="group" aria-label="Choose a slide">
            {slides.map((_, i) => (
              <button key={i} className={`pm-hero__dot${i === 0 ? ' is-active' : ''}`} type="button" data-pm-dot={i} aria-label={`Go to slide ${i + 1}`} aria-current={i === 0 ? 'true' : 'false'}><span className="pm-hero__dot-fill" aria-hidden="true" /></button>
            ))}
          </div>
          <div className="pm-hero__arrows">
            <span className="pm-hero__counter" aria-hidden="true"><b data-pm-current>01</b> / {String(slides.length).padStart(2, '0')}</span>
            <button type="button" className="pm-hero__arrow" data-pm-prev aria-label="Previous slide"><span aria-hidden="true">←</span></button>
            <button type="button" className="pm-hero__arrow" data-pm-next aria-label="Next slide"><span aria-hidden="true">→</span></button>
          </div>
        </div>
      </div>
    </section>
  );
}

const trust = [
  ['google', 'google.svg', 'Google Reviews', 'Reviews', 'See what customers say about us.'],
  ['benefit', 'delivery.svg', 'Reliable Delivery', 'Fast Delivery', 'Dependable delivery for your orders.'],
  ['benefit', 'pricing.svg', 'Bulk Order Pricing', 'Bulk Pricing', 'Competitive options for larger orders.'],
  ['benefit', 'products.svg', 'Custom Print Solutions', 'Custom Print', 'Products tailored to your brand.'],
  ['benefit', 'support.svg', 'Customer Support', 'Support', 'Help with your printing requirements.'],
];
export function Trust() {
  return (
    <section className="pm-section pm-section--tight pm-trust" aria-label="Why choose Print Macaw">
      <div className="pm-container"><ul className="pm-trust__list" role="list">
        {trust.map((t) => (
          <li key={t[2]} className={`pm-trust__item ${t[0] === 'google' ? 'pm-trust__item--google' : 'pm-trust__item--benefit'}`}>
            {t[0] === 'google' ? (
              <div className="pm-trust__google-visual">
                <div className="pm-trust__icon-wrap" aria-hidden="true"><img className="pm-trust__icon" src={`/theme/icons/${t[1]}`} alt="" width={40} height={40} loading="lazy" /></div>
                <span className="pm-trust__happy-stars" aria-hidden="true">★★★★★</span>
              </div>
            ) : (
              <div className="pm-trust__icon-wrap" aria-hidden="true"><img className="pm-trust__icon" src={`/theme/icons/${t[1]}`} alt="" width={40} height={40} loading="lazy" /></div>
            )}
            <div className="pm-trust__content">
              <h3 className="pm-trust__title"><span className="pm-trust__title-full">{t[2]}</span><span className="pm-trust__title-short" aria-hidden="true">{t[3]}</span></h3>
              {t[0] === 'google' ? <p className="pm-trust__happy-text">30,000+ Happy Customers</p> : <p className="pm-trust__description">{t[4]}</p>}
            </div>
          </li>
        ))}
      </ul></div>
    </section>
  );
}

export function Categories() {
  const list = categories.filter((c) => categoryCount(c) > 0).sort((a, b) => a.name.localeCompare(b.name));
  const byId = new Map(categories.map((c) => [c.id, c]));
  return (
    <section className="pm-section pm-categories" aria-labelledby="pm-categories-title">
      <div className="pm-container">
        <Heading id="pm-categories-title" title="Explore Our Printing & Branding Solutions" subtitle="Discover professional printing, signage and branding solutions for your business." />
        <ul className="pm-grid pm-grid--categories">
          {list.map((c) => {
            const img = uploadUrl(c.image); const parent = c.parent ? byId.get(c.parent) : null; const n = categoryCount(c);
            return (
              <li key={c.id} className="pm-category-card" data-category-depth={parent ? 1 : 0}>
                <Link className="pm-category-card__link" href={categoryUrl(c)} aria-label={`Explore ${c.name} products`}>
                  <div className="pm-category-card__media">
                    {img ? <img className="pm-category-card__image" src={img} alt="" loading="lazy" decoding="async" />
                      : <div className="pm-category-card__image pm-category-card__image--fallback" aria-hidden="true"><span>{c.name}</span></div>}
                  </div>
                  <div className="pm-category-card__body">
                    <div className="pm-category-card__info">
                      {parent && <span className="pm-category-card__eyebrow">{parent.name}</span>}
                      <h3 className="pm-category-card__title">{c.name}</h3>
                      <p className="pm-category-card__count">{n} {n === 1 ? 'product' : 'products'}</p>
                    </div>
                    <span className="pm-category-card__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Featured() {
  const feat = products.filter((p) => p.featured);
  const rows: typeof feat[] = [[], []];
  feat.forEach((p, i) => rows[i % 2].push(p));

  return (
    <section className="pm-section pm-section--alt pm-featured" aria-labelledby="pm-featured-title">
      <div className="pm-featured__bg" aria-hidden="true" />
      <div className="pm-container">
        <div className="pm-featured__header">
          <div className="pm-featured__heading">
            <p className="pm-featured__eyebrow">Handpicked for You</p>
            <h2 id="pm-featured-title" className="pm-featured__title">Featured Products</h2>
            <p className="pm-featured__subtitle">
              Explore our most-loved printing and branding products, ready to customise for your business.
            </p>
          </div>
          <div className="pm-featured__controls">
            <button type="button" className="pm-featured__control" data-pm-prev aria-label="Previous products">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" className="pm-featured__control" data-pm-next aria-label="Next products">
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="pm-featured__rows">
          {rows.filter((r) => r.length).map((r, ri) => (
            <div key={ri} className="pm-featured__row">
              <ul
                className="pm-featured__track"
                data-pm-row
                data-pm-direction="1"
                data-pm-delay={ri === 0 ? 0 : 600}
                tabIndex={0}
                role="group"
                aria-roledescription="carousel"
                aria-label={`Featured products, row ${ri + 1}`}
              >
                {r.map((p) => <ProductCard key={p.id} p={p} />)}
              </ul>
            </div>
          ))}
        </div>

        <div className="pm-featured__footer">
          <p className="pm-featured__hint">Swipe, drag or use the arrows to explore more products.</p>
          <Link href="/shop" className="pm-featured__view-all">
            View All Products <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PromoBulk() {
  const wa = waUrl("Hi Print Macaw! I'm interested in your bulk printing services. I'd like to know about your pricing, available products and bulk discounts. Could you please assist me?");
  const benefits = [['Printing Made for Your Brand', 'Custom sizes, materials and premium finishes.'], ['Solutions for Every Business', 'From individual projects to large-volume orders.'], ['Quality You Can See', 'Carefully produced prints with professional finishing.']];
  return (
    <section className="pm-section pm-bulk-promo" aria-labelledby="pm-bulk-promo-title">
      <div className="pm-container"><div className="pm-promo">
        <div className="pm-promo__atmosphere" aria-hidden="true">
          <span className="pm-promo__glow pm-promo__glow--one" /><span className="pm-promo__glow pm-promo__glow--two" />
          <svg className="pm-promo__waves" viewBox="0 0 1440 700" preserveAspectRatio="none"><path d="M-100 180 C180 40 340 330 650 190 S1120 40 1540 220" /><path d="M-100 235 C180 95 340 385 650 245 S1120 95 1540 275" /><path d="M-100 290 C180 150 340 440 650 300 S1120 150 1540 330" /><path d="M-100 510 C200 380 420 620 740 480 S1180 370 1540 530" /></svg>
          <span className="pm-promo__orb pm-promo__orb--one" /><span className="pm-promo__orb pm-promo__orb--two" />
        </div>
        <div className="pm-promo__content">
          <span className="pm-promo__eyebrow" data-promo-reveal>BULK PRINTING & CUSTOM SOLUTIONS</span>
          <h2 id="pm-bulk-promo-title" className="pm-promo__title" data-promo-letter-reveal>More Printing.<br />Better Quality.<br />Bigger Possibilities.</h2>
          <p className="pm-promo__description" data-promo-reveal>Bring your brand to life with professionally crafted printing solutions. From business cards and brochures to packaging and corporate merchandise, we make every detail count.</p>
          <ul className="pm-promo__benefits">
            {benefits.map((b) => <li key={b[0]} data-promo-reveal><span className="pm-promo__check" aria-hidden="true">✓</span><span><strong>{b[0]}</strong> {b[1]}</span></li>)}
          </ul>
          <div className="pm-promo__actions" data-promo-reveal>
            <a className="pm-button pm-button--primary pm-promo__quote-btn" href="#quote">Get a Custom Quote <span aria-hidden="true">→</span></a>
            {wa && <a className="pm-promo__whatsapp-btn" href={wa} target="_blank" rel="noopener noreferrer" aria-label="Contact Print Macaw on WhatsApp"><img className="pm-promo__whatsapp-icon" src="/theme/icons/whatsapp.svg" alt="" width={22} height={22} /> Chat on WhatsApp</a>}
          </div>
          <span className="pm-promo__footnote" data-promo-reveal>Professional printing solutions for businesses of every size.</span>
        </div>
        <div className="pm-promo__visual" data-promo-image-reveal>
          <div className="pm-promo__image-frame">
            <img src={U('Modern-Purple-Branding-Mockup-Display.webp')} alt="Premium custom printing and branded promotional products by Print Macaw" className="pm-promo__image" loading="lazy" decoding="async" width={1200} height={900} />
            <span className="pm-promo__image-overlay" aria-hidden="true" />
          </div>
          <div className="pm-promo__image-caption"><span className="pm-promo__caption-mark" aria-hidden="true">✦</span><span>Made for businesses. Printed with precision.</span></div>
        </div>
      </div></div>
    </section>
  );
}

const why = [
  ['01', 'Professional Print Quality', 'Make a lasting impression with sharp details, vibrant colours and quality materials that bring your brand to life.', 'Architectural-Print-Quality-Inspection.webp'],
  ['02', 'Customisation That Fits', 'Choose from a range of formats, materials and finishing options to create printed products that suit your needs.', 'Premium-Brand-Identity-Flat-Lay.webp'],
  ['03', 'Quality-Focused Production', 'Every project receives careful attention throughout production, helping deliver a polished and consistent result.', 'Modern-Printing-Press-in-Action.webp'],
  ['04', 'Printing for Every Business', 'From everyday business essentials to packaging and customised apparel, find printing solutions for your brand.', 'Modern-Branding-Studio-Showcase.webp'],
];
export function WhyChoose() {
  return (
    <section className="pm-section pm-section--alt pm-why" aria-labelledby="pm-why-title">
      <div className="pm-container">
        <header className="pm-why__header">
          <p className="pm-why__eyebrow" data-why-reveal>WHY PRINT MACAW</p>
          <h2 className="pm-why__title" id="pm-why-title" data-why-title><span className="pm-why__title-line" data-why-line>Printing Excellence.</span> <span className="pm-why__title-line" data-why-line>Built Around Your Business.</span></h2>
          <p className="pm-why__intro" data-why-reveal>We bring together professional printing expertise, quality materials and thoughtful production to help businesses present their brands with confidence. From everyday essentials to customised print projects, we focus on getting the details right.</p>
        </header>
        <div className="pm-why__track" data-why-track><div className="pm-why__sticky"><div className="pm-why__layout">
          <div className="pm-why__content" aria-live="polite">
            <div className="pm-why__features">
              {why.map((f, i) => (
                <article key={f[0]} className={`pm-why__feature${i === 0 ? ' is-active' : ''}`} data-why-feature data-why-index={i} hidden={i !== 0}>
                  <span className="pm-why__number">{f[0]} <span aria-hidden="true">/ {String(why.length).padStart(2, '0')}</span></span>
                  <h3 className="pm-why__feature-title">{f[1]}</h3>
                  <p className="pm-why__description">{f[2]}</p>
                </article>
              ))}
            </div>
            <nav className="pm-why__navigation" aria-label="Why choose Print Macaw features">
              <div className="pm-why__progress" aria-hidden="true">{why.map((_, i) => <span key={i} className={`pm-why__progress-item${i === 0 ? ' is-active' : ''}`} data-why-progress={i} />)}</div>
              <div className="pm-why__controls">
                <button className="pm-why__control" type="button" data-why-prev aria-label="Previous feature" disabled><span aria-hidden="true">←</span></button>
                <button className="pm-why__control" type="button" data-why-next aria-label="Next feature"><span aria-hidden="true">→</span></button>
              </div>
            </nav>
          </div>
          <div className="pm-why__visual" aria-hidden="true">
            {why.map((f, i) => <div key={f[0]} className={`pm-why__image${i === 0 ? ' is-active' : ''}`} data-why-image={i} hidden={i !== 0}><img src={U(f[3])} alt="" loading={i === 0 ? 'eager' : 'lazy'} decoding="async" /></div>)}
            <span className="pm-why__image-caption">PRINTED WITH PURPOSE</span>
          </div>
        </div></div></div>
      </div>
    </section>
  );
}

const logos = [['Dima Laundry', 'dima-laundry'], ['ESL', 'esl'], ['Green Hands', 'green-hands'], ['KEO', 'keo'], ['Ligne St Barth', 'ligne-st-barth'], ['Meydan', 'meydan'], ['Perfetto', 'perfetto'], ['Picasso Artists', 'picasso-artists'], ['Project Chaiwala', 'project-chaiwala'], ['Royal Star Yachts', 'royal-star-yachts'], ['Sobha', 'sobha'], ['Sri Krishna Bhavan', 'sri-krishna-bhavan'], ['Starbucks', 'starbucks'], ['Toshiba', 'toshiba'], ['Valtrans', 'valtrans'], ['Wellx', 'wellx'], ['Wonderdays', 'wonderdays']];
export function Logos() {
  return (
    <section className="pm-section pm-clients" aria-labelledby="pm-clients-title">
      <div className="pm-container"><div className="pm-clients__head">
        <p className="pm-clients__eyebrow" data-pm-reveal>OUR CLIENTS</p>
        <h2 id="pm-clients-title" className="pm-clients__title" data-pm-reveal data-pm-reveal-delay="0.25">Trusted by Businesses</h2>
        <p className="pm-clients__description" data-pm-reveal data-pm-reveal-delay="0.9">Proud to support brands and businesses with their printing and branding needs.</p>
      </div></div>
      <div className="pm-marquee" data-pm-marquee role="region" aria-label="Client logos"><div className="pm-marquee__track">
        {[0, 1].map((g) => (
          <div key={g} className="pm-marquee__group" {...(g ? { 'aria-hidden': true } : {})}>
            {logos.map((l) => <div key={l[1]} className="pm-marquee__item"><img src={`/theme/client-logos/${l[1]}.svg`} alt={g ? '' : l[0]} width={180} height={90} loading="eager" decoding="async" /></div>)}
          </div>
        ))}
      </div></div>
    </section>
  );
}

export function Testimonials() {
  const items = testimonials.map((t) => ({ name: t.meta._pm_customer_name, company: t.meta._pm_customer_company, rating: Number(t.meta._pm_review_rating), source: (t.meta._pm_review_source || '').toLowerCase(), text: t.content.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '').trim() })).filter((t) => t.name && t.text);
  const card = (t: (typeof items)[number], k: string) => {
    const full = Math.floor(t.rating), half = t.rating - full >= 0.5, empty = 5 - full - (half ? 1 : 0);
    return (
      <article key={k} className="pm-testimonial-card">
        <div className="pm-testimonial-card__top">
          {t.rating >= 1 && <div className="pm-testimonial-card__rating" role="img" aria-label={`${t.rating.toFixed(1)} out of 5 stars`}>
            {Array.from({ length: full }).map((_, i) => <span key={i} aria-hidden="true">★</span>)}
            {half && <span className="pm-testimonial-card__half-star" aria-hidden="true">★</span>}
            {Array.from({ length: empty }).map((_, i) => <span key={'e' + i} className="pm-testimonial-card__empty-star" aria-hidden="true">★</span>)}
            <span className="pm-testimonial-card__rating-value" aria-hidden="true">{t.rating.toFixed(1)}</span>
          </div>}
        </div>
        <div className="pm-testimonial-card__body"><p className="pm-testimonial-card__review">{t.text}</p></div>
        <div className="pm-testimonial-card__footer">
          <div className="pm-testimonial-card__identity">
            <div className="pm-testimonial-card__avatar" aria-hidden="true">{t.name.charAt(0).toUpperCase()}</div>
            <div className="pm-testimonial-card__customer"><strong>{t.name}</strong>{t.company && <span>{t.company}</span>}</div>
          </div>
          {t.source && <span className="pm-testimonial-card__source">{t.source}</span>}
        </div>
      </article>
    );
  };
  return (
    <section className="pm-section pm-testimonials" aria-labelledby="pm-testimonials-title">
      <div className="pm-container"><header className="pm-testimonials__heading is-visible" data-pm-testimonial-heading>
        <p className="pm-testimonials__eyebrow">CUSTOMER STORIES</p>
        <h2 id="pm-testimonials-title" className="pm-testimonials__title" data-pm-letter-reveal>What Our Customers Say</h2>
        <p className="pm-testimonials__intro">Real experiences from customers who trust Macaw Advertising for their printing, branding and business needs.</p>
      </header></div>
      <div className="pm-testimonials__viewport" data-pm-testimonials role="region" aria-label="Customer testimonials"><div className="pm-testimonials__track">
        <div className="pm-testimonials__group" data-pm-group>{items.map((t, i) => card(t, 'a' + i))}</div>
        <div className="pm-testimonials__group" data-pm-group-clone aria-hidden="true">{items.map((t, i) => card(t, 'b' + i))}</div>
      </div></div>
    </section>
  );
}

export function Quote() {
  const wa = waUrl('Hello Print Macaw, I would like to request a printing quote.');
  return (
    <section className="pm-section pm-quote" id="quote" aria-labelledby="pm-quote-title">
      <div className="pm-container"><div className="pm-quote__layout">
        <div className="pm-quote__content">
          <p className="pm-quote__eyebrow">LET&apos;S CREATE SOMETHING GREAT</p>
          <h2 id="pm-quote-title" className="pm-quote__title">Have a Project in Mind? <span>Let&apos;s Make It Happen.</span></h2>
          <p className="pm-quote__description">From business cards and brochures to signage, custom apparel and promotional products, tell us what you need. Our team will help you find the right printing solution.</p>
          <div className="pm-quote__actions">
            <Link className="pm-button pm-quote__primary" href="/contact">Request a Quote <span aria-hidden="true">→</span></Link>
            {wa && <a className="pm-quote__whatsapp" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp Our Team</a>}
          </div>
          <div className="pm-quote__benefits"><span>Custom requirements</span><span>Bulk orders</span><span>Business printing</span></div>
        </div>
        <div className="pm-quote__form-panel"><div className="pm-quote__form-placeholder">
          <span className="pm-quote__form-icon" aria-hidden="true">✦</span>
          <h3>Tell Us About Your Project</h3>
          <p>Share your printing requirements with our team. We&apos;ll help you work out the right solution.</p>
          <Link href="/contact">Start Your Enquiry →</Link>
        </div></div>
      </div></div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="pm-section pm-final-cta" aria-labelledby="pm-final-cta-title">
      <div className="pm-container"><div className="pm-final-cta__inner">
        <div className="pm-final-cta__content">
          <p className="pm-final-cta__eyebrow">PRINT. CREATE. MAKE AN IMPRESSION.</p>
          <h2 id="pm-final-cta-title" className="pm-final-cta__title">Everything Your Brand Needs to Stand Out.</h2>
          <p className="pm-final-cta__description">Discover quality printing, customised products and creative branding solutions. Let&apos;s bring your next idea to life with Print Macaw.</p>
          <div className="pm-final-cta__buttons">
            <Link className="pm-final-cta__shop" href="/shop">Shop Now <span aria-hidden="true">→</span></Link>
            <Link className="pm-final-cta__book" href="/contact">Book an Appointment</Link>
          </div>
          <div className="pm-final-cta__contact">
            {contact.whatsapp && <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
            {contact.phone && <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}>Call Us</a>}
            {contact.email && <a href={`mailto:${contact.email}`}>Email Us</a>}
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>
        <div className="pm-final-cta__visual"><img className="pm-final-cta__product-image" src={U('Luxury-Purple-and-Gold-Print-Collection.webp')} alt="Luxury purple and gold collection of professionally printed and customised products by Print Macaw" loading="lazy" decoding="async" /></div>
      </div></div>
    </section>
  );
}
