'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Briefcase, Sparkles } from 'lucide-react';

const INITIAL_DECK = [
  {
    id: 'crochet',
    type: 'beyond',
    icon: Sparkles,
    title: 'Loop and Love Business',
    subtitle: 'Beyond Code / Creative Entrepreneurship',
    description: 'Founder & designer of an e-commerce craft shop. Directs design assets, digital photography, client orders, and pricing models.',
    details: ['Product Design', 'Client Relations', 'E-commerce Marketing', 'Time Management']
  },
  {
    id: 'infosys',
    type: 'cert',
    icon: Briefcase,
    title: 'Infosys Springboard',
    subtitle: 'Core Tech & Software Foundations',
    description: 'Completed developer modules spanning software foundations, cloud structures, and core programming pipelines.',
    details: ['Software Engineering', 'Enterprise Architectures', 'Cloud Fundamentals']
  },
  {
    id: 'mongodb',
    type: 'cert',
    icon: Award,
    title: 'MongoDB Certification',
    subtitle: 'Database Structure & Operations',
    description: 'Accreditation verifying mastery of document schema models, aggregation pipelines, performance indexing, and REST database calls.',
    details: ['NoSQL Databases', 'Aggregation Pipelines', 'Schema Indexing']
  }
];

export default function RecognitionDeck() {
  const [deck, setDeck] = useState(INITIAL_DECK);

  // Recycle the top card (last item in list) to the bottom
  const recycleCard = (cardId) => {
    setDeck((prev) => {
      const copy = [...prev];
      const index = copy.findIndex((c) => c.id === cardId);
      if (index === -1) return prev;
      const [card] = copy.splice(index, 1);
      return [card, ...copy]; // Insert at start (rendered first, bottom of stack)
    });
  };

  const handleDragEnd = (event, info, card) => {
    // If tossed beyond threshold
    if (Math.abs(info.offset.x) > 120 || Math.abs(info.offset.y) > 120) {
      recycleCard(card.id);
    }
  };

  return (
    <section 
      id="recognitions" 
      className="relative min-h-screen w-full flex flex-col justify-center bg-background py-24 px-6 border-b border-border/80"
    >
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Title Block */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <span className="font-display font-black text-2xl tracking-widest text-primary/10 block mb-2">
              06
            </span>
            <h2 className="font-display font-black text-xs tracking-[0.2em] text-secondary mb-4">
              RECOGNITIONS
            </h2>
            <h3 className="font-display font-black text-4xl md:text-5xl tracking-tighter text-primary mb-6">
              ACCOMPLISHMENTS & BEYOND.
            </h3>
            <p className="text-secondary text-sm md:text-base leading-relaxed font-medium mb-4">
              A record of credentials and creative experiments that expand my skills.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10 text-[9px] tracking-widest font-black uppercase text-secondary">
              SWIPE / DRAG CARDS TO DISCOVER
            </div>
          </div>
        </div>

        {/* Draggable Stack Deck */}
        <div className="md:col-span-7 flex justify-center items-center h-[400px] relative select-none">
          <div className="relative w-80 h-96" cursor-none="true" data-cursor="drag">
            {deck.map((card, index) => {
              const Icon = card.icon;
              const isTop = index === deck.length - 1;
              
              // Stack offset styling
              const depth = deck.length - 1 - index;
              const scale = 1 - depth * 0.05;
              const yOffset = depth * 12;
              const rotation = depth * -3;

              return (
                <motion.div
                  key={card.id}
                  drag={isTop}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.7}
                  onDragEnd={(e, info) => handleDragEnd(e, info, card)}
                  style={{
                    scale,
                    y: yOffset,
                    rotate: rotation,
                    zIndex: index,
                  }}
                  animate={isTop ? { x: 0, y: 0, rotate: 0 } : {}}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 24 
                  }}
                  className={`absolute inset-0 bg-white border border-border/80 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between cursor-grab active:cursor-grabbing ${
                    isTop ? 'shadow-md border-primary/20' : 'pointer-events-none'
                  }`}
                >
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-widest font-display font-black text-secondary/60 uppercase">
                      {card.subtitle}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-backgroundAlt border border-border flex items-center justify-center text-primary">
                      <Icon size={14} />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="my-6">
                    <h4 className="text-xl md:text-2xl font-display font-black tracking-tight text-primary">
                      {card.title}
                    </h4>
                    <p className="text-secondary text-xs mt-3 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Footer tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/40">
                    {card.details.map((detail) => (
                      <span
                        key={detail}
                        className="text-[9px] font-display font-black tracking-wider text-secondary bg-background border border-border px-2 py-0.5 rounded-full uppercase"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
