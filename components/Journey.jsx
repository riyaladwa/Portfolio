'use client';

import { motion } from 'framer-motion';

const MILESTONES = [
  {
    num: '01',
    title: 'Computer Science & Engineering',
    desc: 'My academic journey as a CSE student at Bapuji Institute of Engineering and Technology, Davangere (VTU), maintaining a CGPA of 8.8.',
  },
  {
    num: '02',
    title: 'Building Projects',
    desc: 'Developing core projects: Guardian AI (security scan dashboard), Civic Twin AI (urban simulation models), and TaskPro Manager (CRUD productivity tools).',
  },
  {
    num: '03',
    title: 'Exploring AI & Full-Stack Development',
    desc: 'Focusing on practical integrations using Google Gemini and OpenAI APIs, relational SQL datastores, and secure client-server architectures.',
  },
  {
    num: '04',
    title: 'DSA & Placement Preparation',
    desc: 'Currently strengthening computer science foundations in Java, Data Structures & Algorithms, and software engineering practices.',
  },
];

export default function Journey() {
  return (
    <section
      id="journey"
      className="relative py-24 px-6 bg-backgroundAlt border-b border-border/80"
    >
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Number & Sticky Title */}
        <div className="md:col-span-4 md:sticky md:top-28">
          <span className="font-display font-black text-2xl tracking-widest text-primary/10 block mb-2">
            05
          </span>
          <h2 className="font-display font-black text-xs tracking-[0.2em] text-secondary mb-4">
            MY JOURNEY
          </h2>
          <h3 className="font-display font-black text-4xl md:text-5xl tracking-tighter text-primary leading-tight">
            ACADEMIC &<br />
            BUILDING PATH.
          </h3>
        </div>

        {/* Right Column: Timeline */}
        <div className="md:col-span-8 relative w-full pl-6 md:pl-10">
          
          {/* Vertical Connecting Line */}
          <div className="absolute left-1.5 md:left-2 top-2 bottom-6 w-[1px] bg-border" />

          {/* Timeline Items */}
          <div className="flex flex-col gap-12 w-full">
            {MILESTONES.map((stone, idx) => (
              <div key={stone.num} className="relative w-full">
                
                {/* Pulsating Indicator Node */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute left-[-29px] md:left-[-39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-primary bg-backgroundAlt flex items-center justify-center z-10"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </motion.div>

                {/* Content Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white border border-border/80 p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow duration-300 select-none cursor-default"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-display font-black tracking-wider text-secondary/50 bg-backgroundAlt px-2.5 py-0.5 rounded-full uppercase">
                      STAGE {stone.num}
                    </span>
                  </div>
                  
                  <h4 className="font-display font-black text-base md:text-lg tracking-tight text-primary">
                    {stone.title}
                  </h4>
                  <p className="text-secondary text-xs md:text-sm mt-2 leading-relaxed">
                    {stone.desc}
                  </p>
                </motion.div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
