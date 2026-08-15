'use client';

import { motion } from 'framer-motion';
import { 
  Coffee, 
  Terminal, 
  Code2, 
  Atom, 
  Braces, 
  Wind, 
  Database, 
  GitBranch, 
  Github, 
  Globe, 
  Cpu, 
  Boxes 
} from 'lucide-react';

const TECHS = [
  { name: 'Java', icon: Coffee, desc: 'Object-oriented language for robust systems', size: 'large', rotate: '-2deg' },
  { name: 'Python', icon: Terminal, desc: 'Scripting and AI integrations', size: 'medium', rotate: '1deg' },
  { name: 'JavaScript', icon: Code2, desc: 'Interactive web applications', size: 'large', rotate: '-1deg' },
  { name: 'React', icon: Atom, desc: 'Modern component-based user interfaces', size: 'large', rotate: '2deg' },
  { name: 'HTML', icon: Code2, desc: 'Semantic web structure', size: 'small', rotate: '-3deg' },
  { name: 'CSS', icon: Braces, desc: 'Responsive visual presentation', size: 'small', rotate: '3deg' },
  { name: 'Tailwind CSS', icon: Wind, desc: 'Utility-first rapid styling', size: 'medium', rotate: '-2deg' },
  { name: 'Supabase', icon: Database, desc: 'Realtime database and authentication services', size: 'medium', rotate: '2deg' },
  { name: 'Git', icon: GitBranch, desc: 'Distributed version control', size: 'small', rotate: '-1deg' },
  { name: 'GitHub', icon: Github, desc: 'Collaboration and project hosting', size: 'medium', rotate: '1deg' },
  { name: 'REST APIs', icon: Globe, desc: 'Stateless server communications', size: 'medium', rotate: '-3deg' },
  { name: 'DSA', icon: Cpu, desc: 'Data Structures & Algorithms problem-solving', size: 'large', rotate: '3deg' },
  { name: 'OOP', icon: Boxes, desc: 'Object-Oriented Programming principles', size: 'medium', rotate: '-2deg' },
];

export default function TechStack() {
  return (
    <section
      id="stack"
      className="relative min-h-screen w-full flex flex-col justify-center bg-background py-24 px-6"
    >
      <div className="max-w-5xl mx-auto w-full">
        
        {/* Title Block */}
        <div className="mb-16">
          <span className="font-display font-black text-2xl tracking-widest text-primary/10 block mb-2">
            02
          </span>
          <h2 className="font-display font-black text-xs tracking-[0.2em] text-secondary mb-4">
            STACK
          </h2>
          <h3 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-primary">
            TOOLS I BUILD WITH.
          </h3>
        </div>

        {/* Dynamic Organic Floating Cloud */}
        <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl mx-auto">
          {TECHS.map((tech, idx) => {
            const Icon = tech.icon;
            
            // Adjust card padding/dimensions based on size setting to create an organic flow
            let sizeClasses = 'px-5 py-3 text-xs';
            let iconSize = 16;
            
            if (tech.size === 'large') {
              sizeClasses = 'px-8 py-5 text-sm font-bold border-2';
              iconSize = 22;
            } else if (tech.size === 'medium') {
              sizeClasses = 'px-6 py-4 text-xs font-semibold border-[1.5px]';
              iconSize = 18;
            }

            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ 
                  delay: idx * 0.05, 
                  type: 'spring', 
                  stiffness: 100, 
                  damping: 15 
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.05, 
                  rotate: 0,
                  boxShadow: '0 10px 30px rgba(18,18,18,0.08)',
                  transition: { type: 'spring', stiffness: 300, damping: 15 }
                }}
                style={{ rotate: tech.rotate }}
                className={`group relative flex items-center gap-3 bg-white border border-border/80 rounded-2xl cursor-default select-none transition-all duration-300 hover:bg-backgroundAlt/30 hover:border-primary ${sizeClasses}`}
              >
                {/* Tech Icon */}
                <motion.div
                  className="text-secondary group-hover:text-primary transition-colors duration-300"
                  whileHover={{ scale: 1.2 }}
                >
                  <Icon size={iconSize} strokeWidth={2.2} />
                </motion.div>

                {/* Tech Name */}
                <span className="font-display text-primary tracking-wider uppercase">
                  {tech.name}
                </span>

                {/* Custom Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-primary text-white text-[10px] rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md z-30">
                  {tech.desc}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-primary" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
