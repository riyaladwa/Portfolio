'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if user has already loaded this session
    if (typeof window !== 'undefined') {
      const hasPreloaded = sessionStorage.getItem('portfolio-preloaded');
      if (hasPreloaded) {
        setShouldRender(false);
        onComplete();
        return;
      }
    }

    const timer = setInterval(() => {
      setCount((prev) => {
        const increment = Math.floor(Math.random() * 8) + 4; // increment between 4 and 11
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setIsDone(true);
          setTimeout(() => {
            sessionStorage.setItem('portfolio-preloaded', 'true');
            onComplete();
          }, 600);
          return 100;
        }
        return next;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-50 flex flex-col justify-between p-8 bg-[#F4F2EB] text-[#121212] select-none"
        >
          <div className="flex justify-between items-start font-display text-sm tracking-widest opacity-60">
            <span>RIYA LADWA</span>
            <span>PORTFOLIO REBUILD</span>
          </div>

          <div className="flex flex-col items-start justify-center flex-grow">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-display font-bold tracking-tight opacity-40 mb-2"
            >
              LOADING EXPERIENCE
            </motion.h1>
            <div className="overflow-hidden h-[12vw] flex items-center">
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="text-[12vw] font-display font-black leading-none"
              >
                {count.toString().padStart(2, '0')}%
              </motion.div>
            </div>
          </div>

          <div className="flex justify-between items-end font-display text-xs tracking-wider opacity-60">
            <span>CREATIVE DEVELOPMENT & AI</span>
            <span>©2026</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
