'use client';

import { useState, useEffect } from 'react';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import CustomCursor from '../components/CustomCursor';
import Hero from '../components/Hero';
import About from '../components/About';
import Marquee from '../components/Marquee';
import TechStack from '../components/TechStack';
import ProjectSection from '../components/ProjectSection';
import WhatIBring from '../components/WhatIBring';
import Journey from '../components/Journey';
import RecognitionDeck from '../components/RecognitionDeck';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let lenisInstance = null;
    let rafId = null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      import('lenis')
        .then(({ default: Lenis }) => {
          lenisInstance = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
          });

          function raf(time) {
            lenisInstance.raf(time);
            rafId = requestAnimationFrame(raf);
          }

          rafId = requestAnimationFrame(raf);
        })
        .catch((err) => {
          console.warn('[Scroll Engine] Lenis initialization skipped:', err.message);
        });
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  return (
    <>
      <CustomCursor />
      {mounted && <Preloader onComplete={() => setPreloaderDone(true)} />}
      
      <main 
        className={`min-h-screen bg-background text-primary transition-opacity duration-700 ${
          mounted && !preloaderDone ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'
        }`}
      >
        {preloaderDone && <Navbar />}
        <Hero />
        <About />
        <Marquee />
        <TechStack />
        <ProjectSection />
        <WhatIBring />
        <Journey />
        <RecognitionDeck />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
