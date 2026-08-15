'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Marquee() {
  const [isHovered, setIsHovered] = useState(false);

  const text = 'DEVELOPER • BUILDER • AI • JAVA • DSA • CREATIVE TECHNOLOGY • ';
  // Repeat the text multiple times to fill the width
  const repeatedText = Array(8).fill(text).join('');

  return (
    <div 
      className="relative w-full overflow-hidden bg-background py-8 border-b border-border/80 flex items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          x: [0, '-25%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: isHovered ? 40 : 20, // Slow down when hovered
            ease: 'linear',
          },
        }}
        className="flex whitespace-nowrap text-3xl md:text-5xl font-display font-black tracking-widest text-primary/10"
      >
        <span>{repeatedText}</span>
      </motion.div>
    </div>
  );
}
