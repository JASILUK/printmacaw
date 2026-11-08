import Link from 'next/link';
import { contact } from '@/lib/site';

export default function Footer() {
  const socials = [['Instagram', contact.instagram], ['Facebook', contact.facebook], ['LinkedIn', contact.linkedin]].filter(([, u]) => u);
  return (
    <footer className="pm-site-footer">
      <div className="pm-footer-main"><div className="pm-footer-container">
        <div className="pm-footer-brand">
          <Link className="pm-footer-logo" href="/" aria-label="Macaw Advertising"><span className="pm-footer-brand-name">PRINT MACAW</span></Link>
          <p className="pm-footer-description">Creative printing, branding and custom apparel solutions designed to help businesses stand out.</p>
          {socials.length > 0 && <div className="pm-footer-socials">{socials.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer" aria-label={n}>{n}</a>)}</div>}
        </div>
        <div className="pm-footer-column"><h3>Quick Links</h3><ul>
          <li><Link href="/">Home</Link></li><li><Link href="/about">About Us</Link></li><li><Link href="/shop">Shop</Link></li><li><Link href="/contact">Contact Us</Link></li>
        </ul></div>
        <div className="pm-footer-column"><h3>Our Services</h3><ul>
          <li><Link href="/business-card-printing-dubai">Business Card Printing</Link></li>
          <li><Link href="/tshirt-printing-dubai">T-Shirt Printing</Link></li>
          <li><Link href="/corporate-gifts-supplier-uae">Corporate Gifts</Link></li>
          <li><Link href="/signage-company-dubai">Signage</Link></li>
          <li><Link href="/vehicle-branding-dubai">Vehicle Branding</Link></li>
        </ul></div>
        <div className="pm-footer-column pm-footer-contact"><h3>Get in Touch</h3>
          {contact.email && <div className="pm-footer-contact-item"><span>Email</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div>}
          {contact.phone && <div className="pm-footer-contact-item"><span>Phone</span><a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}>{contact.phone}</a></div>}
          {contact.whatsapp && <div className="pm-footer-contact-item"><span>WhatsApp</span><a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">Chat with us</a></div>}
          <Link className="pm-footer-contact-button" href="/contact">Contact Our Team <span aria-hidden="true">→</span></Link>
        </div>
      </div></div>
      <div className="pm-footer-bottom"><div className="pm-footer-container pm-footer-bottom-inner">
        <p>© {new Date().getFullYear()} Macaw Advertising. All rights reserved.</p>
        <div className="pm-footer-legal"><Link href="/privacy-policy">Privacy Policy</Link><Link href="/shipping-policy">Shipping Policy</Link></div>
      </div></div>
    </footer>
  );
}
