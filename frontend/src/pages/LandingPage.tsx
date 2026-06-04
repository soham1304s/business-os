import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { TrustMarquee } from '../components/TrustMarquee';
import { Features } from '../components/Features';
import { ProductShowcase } from '../components/ProductShowcase';
import { Analytics } from '../components/Analytics';
import { AiAutomation } from '../components/AiAutomation';
import { Testimonials } from '../components/Testimonials';
import { Pricing } from '../components/Pricing';
import { Faq } from '../components/Faq';
import { Contact } from '../components/Contact';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/20 relative">
      <Navbar />
      <main>
        <Hero />
        <TrustMarquee />
        <Features />
        <ProductShowcase />
        <Analytics />
        <AiAutomation />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
      </main>
    </div>
  );
}
