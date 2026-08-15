'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send } from 'lucide-react';

const SOCIALS = [
  {
    name: 'EMAIL',
    url: 'mailto:riyaladwa9@gmail.com',
    hoverText: 'SAY HELLO →',
    icon: Mail,
    color: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
  },
  {
    name: 'GITHUB',
    url: 'https://github.com/riyaladwa',
    hoverText: 'VIEW CODE →',
    icon: Github,
    color: 'hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-200'
  },
  {
    name: 'LINKEDIN',
    url: 'https://www.linkedin.com/in/riya-ladwa-b25275306',
    hoverText: 'CONNECT →',
    icon: Linkedin,
    color: 'hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200'
  }
];

export default function Contact() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  
  // Form States
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!form.name.trim()) tempErrors.name = 'Please enter your name.';
    if (!form.email.trim()) {
      tempErrors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      tempErrors.email = 'Please enter a valid email address.';
    }
    if (!form.message.trim()) tempErrors.message = 'Please write a message.';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear errors inline
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({ type: 'success', message: 'Message sent! Thank you, Riya will get back to you shortly.' });
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send message.' });
      }
    } catch (err) {
      console.error('[API Connection Error] Submission failed:', err);
      setStatus({ type: 'error', message: 'Connection error. Please check if Next.js server is active.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="relative min-h-screen w-full flex flex-col justify-center bg-background py-24 px-6 border-b border-border/80"
    >
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Big CTA & Capsules */}
        <div className="lg:col-span-6 flex flex-col gap-10">
          <div>
            <span className="font-display font-black text-2xl tracking-widest text-primary/10 block mb-2">
              07
            </span>
            <h2 className="font-display font-black text-xs tracking-[0.2em] text-secondary mb-4">
              CONTACT
            </h2>
            <h3 className="font-display font-black text-5xl md:text-7xl leading-[0.9] tracking-tighter text-primary select-none mb-6">
              LET&apos;S BUILD<br />
              SOMETHING<br />
              MEANINGFUL.
            </h3>
            <p className="text-secondary text-sm md:text-base font-medium max-w-md">
              Have an idea, opportunity or project? Let&apos;s talk.
            </p>
          </div>

          {/* Social Capsules Grid */}
          <div className="flex flex-col gap-4 max-w-sm">
            {SOCIALS.map((social, idx) => {
              const Icon = social.icon;
              const isHovered = hoveredIdx === idx;
              
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target={social.name !== 'EMAIL' ? '_blank' : undefined}
                  rel={social.name !== 'EMAIL' ? 'noopener noreferrer' : undefined}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  whileHover={{ x: 6 }}
                  className={`flex items-center justify-between border border-border/80 px-6 py-4 rounded-2xl bg-white transition-all duration-300 ${social.color}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span className="text-xs font-display font-black tracking-widest">
                      {isHovered ? social.hoverText : social.name}
                    </span>
                  </div>
                  <span className="text-[10px] tracking-wider opacity-30 group-hover:opacity-100 font-mono">
                    // CONNECT
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-6 w-full bg-backgroundAlt/20 border border-border/60 p-6 md:p-10 rounded-[2.5rem]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[10px] font-display font-black tracking-widest text-secondary uppercase">
                FULL NAME <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className={`w-full bg-white border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors duration-200 ${
                  errors.name ? 'border-red-500 bg-red-50/10' : 'border-border'
                }`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <span className="text-[10px] text-red-500 font-semibold">{errors.name}</span>
              )}
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[10px] font-display font-black tracking-widest text-secondary uppercase">
                EMAIL ADDRESS <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className={`w-full bg-white border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors duration-200 ${
                  errors.email ? 'border-red-500 bg-red-50/10' : 'border-border'
                }`}
                placeholder="name@company.com"
              />
              {errors.email && (
                <span className="text-[10px] text-red-500 font-semibold">{errors.email}</span>
              )}
            </div>

            {/* Message Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-[10px] font-display font-black tracking-widest text-secondary uppercase">
                MESSAGE <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleInputChange}
                className={`w-full bg-white border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors duration-200 resize-none ${
                  errors.message ? 'border-red-500 bg-red-50/10' : 'border-border'
                }`}
                placeholder="Share your project idea, questions or inquiries..."
              />
              {errors.message && (
                <span className="text-[10px] text-red-500 font-semibold">{errors.message}</span>
              )}
            </div>

            {/* Form Response Alert */}
            {status.message && (
              <div 
                className={`px-4 py-3 rounded-xl text-xs font-semibold ${
                  status.type === 'success' 
                    ? 'bg-green-50 border border-green-100 text-green-700' 
                    : 'bg-red-50 border border-red-100 text-red-700'
                }`}
              >
                {status.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white hover:bg-secondary text-xs font-display font-black tracking-widest py-4 rounded-xl transition-all duration-300 disabled:opacity-55 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>SENDING...</span>
              ) : (
                <>
                  <span>SEND MESSAGE</span>
                  <Send size={12} />
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}
