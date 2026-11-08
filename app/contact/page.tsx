import ContactForm from '@/components/ContactForm';
import { contact } from '@/lib/site';
export const metadata = { title: 'Contact', description: 'Got an idea or custom order? Contact Print Macaw for printing, branding and merchandise quotes.', alternates: { canonical: '/contact' } };
export default function Contact() {
  return (
    <div className="pm-container" style={{ padding: '64px 0 96px' }}>
      <h1>Say Hello.</h1>
      <p style={{ maxWidth: 640 }}>Got an idea or custom order? PrintMacaw turns your vision into reality. Tell us what you need and our team will get back to you.</p>
      <ContactForm />
      {(contact.email || contact.phone) && <p style={{ marginTop: 32 }}>{contact.email && <>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a><br /></>}{contact.phone && <>Phone: <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}>{contact.phone}</a></>}</p>}
    </div>
  );
}
