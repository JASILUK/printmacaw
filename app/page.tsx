import '../styles/homepage.css';
import ThemeScripts from '@/components/ThemeScripts';
import { Hero, Trust, Categories, Featured, PromoBulk, WhyChoose, Logos, Testimonials, Quote, FinalCta } from '@/components/home/Sections';

export const metadata = { alternates: { canonical: '/' } };
export default function Home() {
  return (
    <>
      <Hero /><Trust /><Categories /><Featured /><PromoBulk /><WhyChoose /><Logos /><Testimonials /><Quote /><FinalCta />
      <ThemeScripts files={['/theme/js/global.js', '/theme/js/hero-slider.js', '/theme/js/homepage.js']} />
    </>
  );
}
