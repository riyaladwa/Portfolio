'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// Mock Visual Component for Guardian AI
function GuardianVisual() {
  return (
    <div className="relative w-full h-full bg-[#1e1e24] p-4 flex flex-col justify-between overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.1)_0%,transparent_60%)] pointer-events-none" />
      
      {/* UI Shell Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="text-[9px] text-white/40 tracking-widest font-display uppercase font-bold">
          SECURE_SCAN_API
        </span>
      </div>

      {/* Main UI body */}
      <div className="flex-grow flex items-center justify-between mt-4">
        {/* Gauge */}
        <div className="relative w-20 h-20 flex flex-col items-center justify-center border border-white/10 rounded-full bg-[#121212]">
          <div className="absolute inset-2 border-2 border-dashed border-[#d4af37]/40 rounded-full animate-spin [animation-duration:15s]" />
          <span className="text-xs font-display font-bold text-[#d4af37]">88%</span>
          <span className="text-[7px] text-white/50 tracking-wider font-semibold mt-1">RISK INDEX</span>
        </div>

        {/* Logs console */}
        <div className="flex flex-col gap-2 flex-grow pl-4 text-[8px] font-mono leading-none">
          <div className="flex items-center gap-1.5 text-red-400 bg-red-950/20 px-2 py-1 rounded border border-red-950/40">
            <span className="w-1 h-1 bg-red-400 rounded-full animate-ping" />
            <span>[CRITICAL] Scam Detected in SMS payload</span>
          </div>
          <div className="flex items-center gap-1.5 text-yellow-400 bg-yellow-950/20 px-2 py-1 rounded border border-yellow-950/40">
            <span>[WARN]</span>
            <span>URL safety request throttled</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/50 bg-white/5 px-2 py-1 rounded">
            <span>[INFO]</span>
            <span>Multimodal analysis ready</span>
          </div>
        </div>
      </div>
      
      {/* Decorative scanning line */}
      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent top-0 group-hover:top-full transition-all duration-[3s] ease-linear pointer-events-none" />
    </div>
  );
}

// Mock Visual Component for Civic Twin AI (Special treatment)
function CivicTwinVisual() {
  return (
    <div className="relative w-full h-full bg-[#0d1b2a] p-4 flex flex-col justify-between overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,180,216,0.15)_0%,transparent_60%)] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2 z-10">
        <span className="text-[9px] text-[#00b4d8] tracking-widest font-display font-black uppercase">
          CITY_SIMULATION_ACTIVE
        </span>
        <div className="flex gap-2">
          <span className="w-2.5 h-1.5 bg-[#00b4d8] rounded-full animate-pulse" />
        </div>
      </div>

      {/* Geospatial Map Visual */}
      <div className="relative flex-grow flex items-center justify-center mt-3 z-10">
        {/* Pulsating Center Node */}
        <div className="relative w-3 h-3 bg-[#00b4d8] rounded-full">
          <div className="absolute inset-0 w-full h-full bg-[#00b4d8] rounded-full animate-ping opacity-60" />
          <div className="absolute inset-[-8px] border border-[#00b4d8]/30 rounded-full animate-ping opacity-40 [animation-duration:2.5s]" />
        </div>

        {/* Secondary Pulsating Node */}
        <div className="absolute top-4 right-8 w-2 h-2 bg-teal-400 rounded-full">
          <div className="absolute inset-0 w-full h-full bg-teal-400 rounded-full animate-ping opacity-50" />
        </div>

        {/* Third Node */}
        <div className="absolute bottom-4 left-10 w-2.5 h-2.5 bg-indigo-400 rounded-full">
          <div className="absolute inset-0 w-full h-full bg-indigo-400 rounded-full animate-ping opacity-50" />
        </div>

        {/* Connective SVG line illustration */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="30%" y1="70%" x2="50%" y2="50%" stroke="rgba(0, 180, 216, 0.2)" strokeWidth="1" strokeDasharray="3" />
          <line x1="75%" y1="30%" x2="50%" y2="50%" stroke="rgba(0, 180, 216, 0.2)" strokeWidth="1" />
        </svg>

        {/* Live HUD Dashboard panel overlay */}
        <div className="absolute bottom-2 right-2 bg-[#0b132b]/80 border border-white/10 px-2 py-1 rounded text-[8px] font-mono flex flex-col gap-0.5">
          <span className="text-[#00b4d8]">STATUS: OPTIMAL</span>
          <span className="text-white/40">SIM_TIME: 14:02:18</span>
        </div>
      </div>
    </div>
  );
}

// Mock Visual Component for TaskPro Manager
function TaskProVisual() {
  return (
    <div className="relative w-full h-full bg-[#f4f3f2] p-4 flex flex-col justify-between overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(18,18,18,0.02)_0%,transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/5 pb-2">
        <span className="text-[9px] text-primary/60 tracking-wider font-display font-semibold">
          WORKSPACE / MY BOARD
        </span>
        <span className="text-[8px] px-1.5 py-0.5 bg-primary/5 rounded border border-black/5 text-primary/70">
          Sync Active
        </span>
      </div>

      {/* Kanban Layout Columns */}
      <div className="flex-grow grid grid-cols-2 gap-3 mt-3">
        {/* Column 1 */}
        <div className="flex flex-col gap-2">
          <span className="text-[8px] font-display font-bold text-secondary tracking-widest uppercase">
            TO DO
          </span>
          <div className="p-2 bg-white rounded-lg border border-black/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col gap-1">
            <span className="text-[8px] font-bold text-primary">Vite Layout Setup</span>
            <span className="text-[6px] text-secondary/60">Refactor global styles</span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-black/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col gap-1">
            <span className="text-[8px] font-bold text-primary">Solve 10 DSA Problems</span>
            <span className="text-[6px] text-secondary/60">Linked List, Trees</span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-2">
          <span className="text-[8px] font-display font-bold text-secondary tracking-widest uppercase">
            IN PROGRESS
          </span>
          <div className="p-2 bg-white rounded-lg border border-primary/20 bg-primary/[0.01] shadow-[0_2px_4px_rgba(18,18,18,0.02)] flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
            <span className="text-[8px] font-bold text-primary">Refactor API Integration</span>
            <span className="text-[6px] text-secondary/60">Connect Express/MongoDB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectCard({ project, onClick }) {
  const getVisual = (title) => {
    switch (title.toLowerCase()) {
      case 'guardian ai':
        return <GuardianVisual />;
      case 'civic twin ai':
        return <CivicTwinVisual />;
      case 'taskpro manager':
        return <TaskProVisual />;
      default:
        return null;
    }
  };

  // Asymmetric styling based on project layout settings
  const isFeatured = project.featured;
  const isVertical = project.layoutType === 'vertical';

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ 
        y: -10, 
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      onClick={onClick}
      className={`group relative flex flex-col justify-between bg-white border border-border/80 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md cursor-none select-none transition-shadow duration-300 ${
        isFeatured
          ? 'col-span-1 md:col-span-12 lg:col-span-8 min-h-[380px] md:min-h-[420px]'
          : isVertical
          ? 'col-span-1 md:col-span-6 lg:col-span-4 min-h-[460px] md:min-h-[500px]'
          : 'col-span-1 md:col-span-6 lg:col-span-12 min-h-[380px] md:min-h-[400px]'
      }`}
      data-cursor="view"
    >
      {/* Mock Visual Wrapper */}
      <div className="relative w-full h-[55%] border-b border-border/60 overflow-hidden">
        <motion.div 
          className="w-full h-full"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.5 }}
        >
          {getVisual(project.title)}
        </motion.div>
      </div>

      {/* Project Content Description */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-[10px] tracking-widest font-display font-black text-secondary/60 uppercase">
              {project.category}
            </span>
            <span className="text-xs font-display font-black text-primary/20">
              {project.number}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-display font-black tracking-tighter text-primary group-hover:translate-x-2 transition-transform duration-300">
            {project.title}
          </h3>
          <p className="text-secondary text-xs md:text-sm mt-2 line-clamp-2">
            {project.subtitle}
          </p>
        </div>

        {/* Tech tags and action footer */}
        <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="text-[9px] font-display font-black tracking-wider text-secondary bg-background border border-border px-2 py-0.5 rounded-full uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="flex items-center gap-1 text-[10px] font-display font-black tracking-widest text-primary group-hover:underline">
            VIEW DETAILS
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
