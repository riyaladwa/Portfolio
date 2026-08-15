'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { id: 'about', label: 'ABOUT' },
  { id: 'stack', label: 'STACK' },
  { id: 'work', label: 'WORK' },
  { id: 'journey', label: 'JOURNEY' },
  { id: 'recognitions', label: 'RECOGNITIONS' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy to highlight active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -50% 0px',
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    NAV_LINKS.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    // Special check for hero section
    const heroEl = document.getElementById('hero');
    if (heroEl) observer.observe(heroEl);

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      const yOffset = -100;
      const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex justify-center p-6 pointer-events-none"
      >
        <div
          className={`flex items-center justify-between w-full max-w-5xl px-6 py-3 transition-all duration-500 pointer-events-auto rounded-full border border-border/80 ${
            scrolled
              ? 'bg-white/80 backdrop-blur-md shadow-sm scale-95'
              : 'bg-white/40 backdrop-blur-sm'
          }`}
        >
          {/* Logo / Initials */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-display font-bold text-base tracking-tighter"
          >
            RL
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 relative">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`relative text-xs tracking-widest font-display font-semibold transition-colors duration-300 py-1.5 px-3 rounded-full ${
                    isActive ? 'text-primary' : 'text-secondary hover:text-primary'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="active-indicator"
                      className="absolute inset-0 bg-primary/5 rounded-full -z-10 border border-primary/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Availability Capsule */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full text-[10px] text-green-700 tracking-wider font-semibold uppercase">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              AVAILABLE
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden flex-col justify-center items-center w-8 h-8 rounded-full border border-border bg-white hover:bg-background transition-colors duration-200"
              aria-label="Toggle navigation menu"
            >
              <span
                className={`w-4 h-0.5 bg-primary transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-[3px]' : '-translate-y-[2px]'
                }`}
              />
              <span
                className={`w-4 h-0.5 bg-primary transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-[1px]' : 'translate-y-[2px]'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-primary/20 backdrop-blur-md flex items-center justify-center p-6 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 border border-border shadow-2xl flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="font-display font-bold text-sm tracking-widest text-secondary">NAVIGATION</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold tracking-wider hover:underline"
                >
                  CLOSE
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={(e) => handleNavClick(e, link.id)}
                      className={`text-lg font-display font-bold tracking-widest py-2 border-b border-border/50 hover:pl-2 transition-all duration-300 ${
                        isActive ? 'text-primary' : 'text-secondary hover:text-primary'
                      }`}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-100 rounded-2xl text-[10px] text-green-700 font-bold uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                AVAILABLE FOR COLLABORATION
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
