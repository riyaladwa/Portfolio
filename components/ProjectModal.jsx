'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ArrowUpRight } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  // Lock scroll and listen to Esc key
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-primary/20 backdrop-blur-md flex items-center justify-end"
          onClick={onClose}
        >
          {/* Side Drawer Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.9 }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl h-full bg-white border-l border-border shadow-2xl overflow-y-auto flex flex-col p-6 md:p-12 relative cursor-default"
          >
            {/* Close Button floating top-right */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 rounded-full border border-border flex items-center justify-center bg-white hover:bg-background transition-colors duration-200 z-10"
              aria-label="Close project modal"
            >
              <X size={18} className="text-primary" />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col gap-8 mt-6">
              
              {/* Category & Title */}
              <div>
                <span className="text-[10px] tracking-widest font-display font-black text-secondary/60 uppercase block mb-1">
                  {project.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter text-primary">
                  {project.title}
                </h2>
                <p className="text-secondary text-sm md:text-base mt-2 font-medium">
                  {project.subtitle}
                </p>
              </div>

              {/* Technical Description Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-border/60">
                <div>
                  <h4 className="text-[10px] font-display font-black tracking-widest text-secondary/50 uppercase mb-2">
                    ROLE & FOCUS
                  </h4>
                  <p className="text-xs text-primary font-bold">
                    Sole Developer / UI & Logic Orchestration
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-display font-black tracking-widest text-secondary/50 uppercase mb-2">
                    PROJECT TYPE
                  </h4>
                  <p className="text-xs text-primary font-bold">
                    Hackathon Prototype / Core Project
                  </p>
                </div>
                {project.githubUrl && (
                  <div>
                    <h4 className="text-[10px] font-display font-black tracking-widest text-secondary/50 uppercase mb-2">
                      REPOSITORY
                    </h4>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                    >
                      <Github size={14} />
                      Open Codebase
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                )}
              </div>

              {/* Project Abstract Overview */}
              <div className="flex flex-col gap-4">
                <h3 className="font-display font-black text-xs tracking-widest text-secondary uppercase">
                  OVERVIEW
                </h3>
                <p className="text-secondary text-sm md:text-base leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Problem vs. Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-backgroundAlt/30 p-6 md:p-8 rounded-3xl border border-border/50">
                <div className="flex flex-col gap-2">
                  <h4 className="text-[10px] font-display font-black tracking-widest text-red-600 uppercase">
                    THE PROBLEM
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed">
                    {project.problem || 'Scams and threat vectors leverage complex email, voice, and URL channels. Standard detectors are rigid, single-threaded, and cannot check multimodal vectors dynamically.'}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-[10px] font-display font-black tracking-widest text-green-700 uppercase">
                    THE SOLUTION
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed">
                    {project.solution || 'Orchestrated API pipelines routing files, logs, and strings to multimodal Gemini and OpenAI models. Implemented visual dashboards and database logging for real-time diagnostics.'}
                  </p>
                </div>
              </div>

              {/* Key System Features */}
              <div className="flex flex-col gap-4">
                <h3 className="font-display font-black text-xs tracking-widest text-secondary uppercase">
                  KEY SYSTEM FEATURES
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 text-xs text-secondary leading-relaxed p-4 bg-background border border-border/50 rounded-2xl"
                    >
                      <span className="font-display font-black text-primary/30">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technology Stack Grid */}
              <div className="flex flex-col gap-4">
                <h3 className="font-display font-black text-xs tracking-widest text-secondary uppercase">
                  TECHNOLOGY STACK
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-display font-black tracking-widest text-primary bg-backgroundAlt border border-border/80 px-3 py-1.5 rounded-full uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-xs font-display font-black tracking-widest rounded-full hover:bg-secondary text-center transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <Github size={16} />
                    VIEW GITHUB REPOSITORY
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-4 border border-border text-primary text-xs font-display font-black tracking-widest rounded-full hover:bg-background text-center transition-colors duration-300"
                >
                  CLOSE PREVIEW
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
