import type { Metadata, Viewport } from 'next';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '../styles/global.css';
import '../styles/header.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../styles/preloader.css';
import Preloader from '@/components/Preloader';
import ThemeScripts from '@/components/ThemeScripts';
import { CartProvider } from '@/lib/cart';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Macaw Advertising | Print Macaw – We print what you want!', template: '%s | Print Macaw' },
  description: 'Professional printing, branding, signage, custom apparel and corporate gifts in Dubai and the UAE.',
  openGraph: { siteName: 'Print Macaw', type: 'website', locale: 'en_AE' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // "pm-intro" holds the page back until the preloader hands over (see preloader.css).
    // suppressHydrationWarning: Preloader toggles classes on <html> at runtime.
    <html lang="en" className="pm-intro" suppressHydrationWarning>
      <body>
        <Preloader />
        <CartProvider>
          <div id="page" className="pm-site">
            <Header />
            <main id="primary">{children}</main>
            <Footer />
          </div>
        </CartProvider>
        <ThemeScripts files={['/theme/js/navigation.js']} />
      </body>
    </html>
  );
}