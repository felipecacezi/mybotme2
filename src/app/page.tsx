import React from 'react';
import Header from '@/components/landing-page/Header';
import HeroSection from '@/components/landing-page/HeroSection';
import FeaturesSection from '@/components/landing-page/FeaturesSection';
import TestimonialsSection from '@/components/landing-page/TestimonialsSection';
import FaqSection from '@/components/landing-page/FaqSection';
import Footer from '@/components/landing-page/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
