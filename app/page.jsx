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
