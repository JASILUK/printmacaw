export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const SITE_NAME = 'Macaw Advertising';
export const contact = {
  email: process.env.NEXT_PUBLIC_PUBLIC_EMAIL || '',
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '',
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D+/g, ''),
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
};
export const waUrl = (msg: string) => (contact.whatsapp ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(msg)}` : '');
