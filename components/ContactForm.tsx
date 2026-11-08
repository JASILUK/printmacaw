'use client';
import { useState } from 'react';
export default function ContactForm() {
  const [done, setDone] = useState(false);
  if (done) return <div className="woocommerce-message" role="status">Thank you! (Demo: your message was not sent anywhere.)</div>;
  const f = { display: 'grid', gap: 6, marginBottom: 16 } as const;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} style={{ maxWidth: 560 }}>
      <div style={f}><label htmlFor="c-name">Name *</label><input id="c-name" name="name" required maxLength={120} autoComplete="name" /></div>
      <div style={f}><label htmlFor="c-email">Email *</label><input id="c-email" name="email" type="email" required maxLength={160} autoComplete="email" /></div>
      <div style={f}><label htmlFor="c-phone">Phone</label><input id="c-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" /></div>
      <div style={f}><label htmlFor="c-msg">How can we help? *</label><textarea id="c-msg" name="message" rows={5} required maxLength={4000} /></div>
      <button className="pm-btn pm-btn--primary" type="submit">Send message</button>
    </form>
  );
}
