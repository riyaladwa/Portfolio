'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Monitor scroll for cinematic transformations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacityPills = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Limit range to +/- 15px for subtle motion
      const x = (e.clientX - window.innerWidth / 2) / 40;
      const y = (e.clientY - window.innerHeight / 2) / 40;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const pills = [
    { text: 'CSE STUDENT', xOffset: -220, yOffset: -80, multiplier: 0.8 },
    { text: 'JAVA + DSA', xOffset: 250, yOffset: -120, multiplier: 1.2 },
    { text: 'AI PROJECTS', xOffset: -200, yOffset: 160, multiplier: 1.0 },
    { text: 'FULL-STACK DEVELOPMENT', xOffset: 220, yOffset: 140, multiplier: 0.7 },
    { text: '8.8 CGPA', xOffset: 0, yOffset: -240, multiplier: 1.5 },
  ];

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-background py-32 px-6"
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,242,235,0.6)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating Pills */}
      <motion.div style={{ opacity: opacityPills }} className="absolute inset-0 pointer-events-none hidden md:block">
        {pills.map((pill, idx) => (
          <motion.div
            key={idx}
            animate={{
              x: mousePos.x * pill.multiplier,
              y: mousePos.y * pill.multiplier,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            style={{
              left: `calc(50% + ${pill.xOffset}px)`,
              top: `calc(50% + ${pill.yOffset}px)`,
            }}
            className="absolute px-4 py-2 bg-white border border-border shadow-sm rounded-full text-[10px] font-display font-black tracking-widest text-secondary select-none"
          >
            {pill.text}
          </motion.div>
        ))}
      </motion.div>

      {/* Main Composition */}
      <div className="relative w-full max-w-5xl flex flex-col items-center justify-center z-10">
        
        {/* Editorial Text + Image Stack */}
        <motion.div
          style={{ scale: textScale, y: textY }}
          className="relative w-full flex flex-col items-center justify-center"
        >
          {/* Back Name Layer */}
          <h1 className="text-[14vw] md:text-[10vw] font-display font-black leading-[0.8] tracking-tighter text-primary select-none z-10">
            RIYA
          </h1>

          {/* Overlapping Hero Image */}
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="relative w-48 h-64 md:w-60 md:h-80 my-4 md:-my-8 border-[6px] border-white shadow-xl overflow-hidden rounded-[2rem] z-20 cursor-none"
            data-cursor="explore"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/riya.jpeg"
              alt="Riya Ladwa Profile Portrait"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Front Name Layer */}
          <h1 className="text-[14vw] md:text-[10vw] font-display font-black leading-[0.8] tracking-tighter text-primary select-none z-30">
            LADWA
          </h1>
        </motion.div>

        {/* Small Intro Paragraph (Editorial Sub-label) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 text-center max-w-lg px-4"
        >
          <span className="text-[10px] tracking-widest font-display font-black text-secondary block mb-3">
            CSE STUDENT / DEVELOPER / BUILDER
          </span>
          <p className="text-secondary text-sm md:text-base leading-relaxed font-medium">
            Computer Science & Engineering student building intelligent, useful and visually polished digital experiences.
          </p>
        </motion.div>

        {/* Bottom indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-[-60px] flex flex-col items-center gap-2 text-[10px] tracking-widest font-bold opacity-40 select-none animate-bounce"
        >
          <span>SCROLL DOWN</span>
          <span className="w-px h-8 bg-primary" />
        </motion.div>

      </div>
    </section>
  );
}
