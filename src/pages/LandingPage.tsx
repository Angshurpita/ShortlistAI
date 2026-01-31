import { Navbar } from '@/sections/landing/Navbar';
import { Hero } from '@/sections/landing/Hero';
import { HowItWorks } from '@/sections/landing/HowItWorks';
import { Features } from '@/sections/landing/Features';
import { Pricing } from '@/sections/landing/Pricing';
import { CTA } from '@/sections/landing/CTA';
import { Footer } from '@/sections/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
