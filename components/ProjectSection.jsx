'use client';

import { useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const PROJECTS = [
  {
    title: 'Guardian AI',
    category: 'Security Platform',
    number: '01',
    subtitle: 'AI-Powered Multimodal Scam Detection Platform',
    description: 'Engineered a full-stack, API-driven cybersecurity platform designed to analyze images, video, voice, email, SMS, URLs, and documents to detect scams in real time.',
    features: [
      'Engineers a multimodal scan system for real-time security checking',
      'Designed modular dashboard structure with digital safety metrics',
      'Implemented JWT security handling and custom API orchestration layers',
      'Threat intelligence integration and AI alerts'
    ],
    tags: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'Gemini API', 'OpenAI API', 'Supabase', 'MongoDB'],
    githubUrl: 'https://github.com/riyaladwa/guardian-ai.git',
    featured: true,
    layoutType: 'horizontal',
    problem: 'Scam vectors are constantly evolving and spanning different media (text, images, voice call recordings, files). Traditional anti-virus filters fail on cross-media contextual scams.',
    solution: 'Created a unified gateway routing media uploads to targeted Google Gemini (multimodal) and OpenAI API engines, providing immediate risk categorization, threat severity level, and mitigation advice.'
  },
  {
    title: 'Civic Twin AI',
    category: 'Urban Simulation',
    number: '02',
    subtitle: 'AI-Powered City Digital Twin',
    description: 'Civic Twin AI is an intelligent urban platform that uses digital-twin concepts, AI-powered predictions, simulations, and map-based visualization to help understand and monitor city-level problems.',
    features: [
      'Digital representation of city systems and mapping data',
      'AI-powered simulations & predictive diagnostics',
      'Google Maps & geospatial visualization',
      'Supabase-powered real-time alert system'
    ],
    tags: ['React.js', 'JavaScript', 'Vite', 'Supabase', 'Google Maps', 'AI APIs'],
    githubUrl: 'https://github.com/riyaladwa/civic-twin-ai.git',
    featured: false,
    layoutType: 'vertical',
    problem: 'Analyzing complex city traffic gridlock, water drainage bottlenecks, or emergency vehicle routes is usually segmented and lacks interactive simulation and real-time alerts.',
    solution: 'Built an interactive Google Maps geospatial representation of municipal coordinates linked with AI forecasting, simulating gridlocks and raising real-time alerts to Supabase webhooks.'
  },
  {
    title: 'TaskPro Manager',
    category: 'Productivity Tool',
    number: '03',
    subtitle: 'Full-Stack Productivity Application',
    description: 'Built a full-stack task manager with complete CRUD operations and real-time UI sync, backed by a Node.js/Express REST API and a persistent MongoDB/Supabase database.',
    features: [
      'Full CRUD operations and real-time UI synchronization',
      'JWT authentication and middleware-based route protection',
      'Coordinated asynchronous data flow between client and backend',
      'Modular frontend architecture with reusable UI components'
    ],
    tags: ['React.js', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Supabase', 'Gemini API', 'CSS'],
    githubUrl: 'https://github.com/riyaladwa/TaskPro-Manager.git',
    featured: false,
    layoutType: 'horizontal',
    problem: 'Developers and students need robust task synchronization across multiple sessions, without complex interfaces or lagging reactivity.',
    solution: 'Implemented full CRUD operations and secure JWT route middleware, allowing real-time board updates connected to a MongoDB backend.'
  }
];

export default function ProjectSection() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section 
      id="work" 
      className="relative min-h-screen w-full flex flex-col justify-center bg-backgroundAlt/30 py-24 px-6 border-b border-border/80"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Title block */}
        <div className="mb-16">
          <span className="font-display font-black text-2xl tracking-widest text-primary/10 block mb-2">
            03
          </span>
          <h2 className="font-display font-black text-xs tracking-[0.2em] text-secondary mb-4">
            SELECTED WORK
          </h2>
          <h3 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-primary">
            THINGS I&apos;VE BUILT.
          </h3>
        </div>

        {/* Bento Grid Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Expanded Modal view */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
