'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download, FileText } from 'lucide-react';

function Word({ word, index, total, scrollYProgress }) {
  const start = index / total;
  const end = (index + 1.5) / total;
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className="inline-block mr-[0.2em] select-none"
    >
      {word}
    </motion.span>
  );
}

export default function About() {
  const containerRef = useRef(null);

  // Monitor scroll progress of this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.4'],
  });

  const statement = 'A DEVELOPER WHO LIKES TO BUILD THINGS THAT MATTER.';
  const words = statement.split(' ');

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-center bg-backgroundAlt py-24 px-6 border-y border-border/80"
    >
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        
        {/* Left Column: Number & Title */}
        <div className="md:col-span-4 flex flex-col justify-between">
          <div>
            <span className="font-display font-black text-2xl tracking-widest text-primary/30 block mb-2">
              01
            </span>
            <h2 className="font-display font-black text-xs tracking-[0.2em] text-secondary">
              ABOUT
            </h2>
          </div>
          
          <div className="flex flex-col gap-4 mt-8 md:mt-0">
            <span className="text-[10px] tracking-widest font-bold text-secondary/60">
              RIYA LADWA — BIET
            </span>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Riya_Ladwa_Resume.pdf"
              className="inline-flex items-center gap-2 self-start px-4 py-2.5 bg-white border border-border/80 hover:border-primary text-primary rounded-xl text-xs font-display font-bold tracking-widest uppercase transition-all duration-300 shadow-sm hover:shadow"
              title="Download Riya Ladwa's Resume (PDF)"
            >
              <FileText size={14} />
              <span>DOWNLOAD RESUME</span>
              <Download size={12} className="opacity-60" />
            </a>
          </div>
        </div>

        {/* Right Column: Progressive Text Reveal & Info */}
        <div className="md:col-span-8 flex flex-col gap-12 justify-center">
          
          {/* Main Statement Word Reveal */}
          <div className="text-3xl md:text-5xl font-display font-black leading-tight tracking-tighter text-primary">
            {words.map((word, index) => (
              <Word
                key={index}
                word={word}
                index={index}
                total={words.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>

          {/* Real Personal Information / Detailed Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 text-secondary text-sm md:text-base leading-relaxed font-medium"
          >
            <p>
              I am a Computer Science & Engineering student at Bapuji Institute of Engineering and Technology, Davangere, affiliated with Visvesvaraya Technological University (VTU), maintaining a <strong className="text-primary font-bold">CGPA of 8.8</strong>.
            </p>
            <p>
              I enjoy translating logical principles and algorithm constructs into functional, highly-polished digital applications. My development work encompasses full-stack software applications, Gemini/OpenAI API integrations, databases, and secure web architectures. Through hackathons and continuous building, I focus on solving practical problems.
            </p>
            <p>
              Currently, I am deep-diving into <strong className="text-primary font-bold">Java & Data Structures and Algorithms (DSA)</strong> to strengthen my computer science fundamentals, prepare for technical assessments, and build applications that create value.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
