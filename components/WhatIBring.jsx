'use client';

import { motion } from 'framer-motion';
import { Cpu, Sparkles, Layers, BookOpen, ArrowRight } from 'lucide-react';

const CAPABILITIES = [
  {
    num: '01',
    title: 'PROBLEM SOLVING',
    desc: 'I enjoy breaking complex problems into smaller, practical and understandable solutions.',
    icon: Cpu,
  },
  {
    num: '02',
    title: 'BUILDING WITH AI',
    desc: 'I explore AI to create practical applications that solve real-world problems and improve digital experiences.',
    icon: Sparkles,
  },
  {
    num: '03',
    title: 'FULL-STACK THINKING',
    desc: 'I enjoy understanding both the user-facing experience and the systems that power it.',
    icon: Layers,
  },
  {
    num: '04',
    title: 'CONTINUOUS LEARNING',
    desc: 'Currently strengthening my foundations in Java, Data Structures & Algorithms and software development.',
    icon: BookOpen,
  },
];

export default function WhatIBring() {
  return (
    <section
      id="bring"
      className="relative py-24 px-6 bg-background border-b border-border/80"
    >
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Number & Big Title */}
        <div className="md:col-span-4 md:sticky md:top-28">
          <span className="font-display font-black text-2xl tracking-widest text-primary/10 block mb-2">
            04
          </span>
          <h2 className="font-display font-black text-xs tracking-[0.2em] text-secondary mb-4">
            WHAT I BRING
          </h2>
          <h3 className="font-display font-black text-4xl md:text-5xl tracking-tighter text-primary leading-tight">
            I DON&apos;T JUST BUILD.<br />
            I SOLVE.
          </h3>
        </div>

        {/* Right Column: Asymmetric Grid of Interactive Cards */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ 
                  delay: idx * 0.1, 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{ 
                  y: -6,
                  boxShadow: '0 10px 30px rgba(18,18,18,0.04)',
                }}
                className="group relative bg-white border border-border/80 p-8 rounded-[2rem] flex flex-col justify-between min-h-[260px] cursor-default select-none transition-all duration-300 hover:bg-backgroundAlt/10 hover:border-primary"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-2xl bg-backgroundAlt/30 border border-border/40 flex items-center justify-center text-secondary group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                    <Icon size={16} strokeWidth={2.2} />
                  </div>
                  <span className="text-xs font-display font-black text-primary/20">
                    {cap.num}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-8 flex-grow">
                  <h4 className="font-display font-black text-base tracking-wide text-primary transition-transform duration-300 group-hover:translate-x-1">
                    {cap.title}
                  </h4>
                  <p className="text-secondary text-xs mt-3 leading-relaxed transition-opacity duration-300 group-hover:text-primary">
                    {cap.desc}
                  </p>
                </div>

                {/* Footer Arrow Reveal */}
                <div className="mt-6 pt-4 border-t border-border/40 flex justify-end overflow-hidden h-6">
                  <motion.div
                    initial={{ x: -15, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-1.5 text-[10px] font-display font-black tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0"
                  >
                    STRENGTH
                    <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform duration-300" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
