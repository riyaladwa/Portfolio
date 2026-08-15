'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoverType, setHoverType] = useState(null); // 'link' | 'view' | 'drag' | 'explore'
  const cursorRef = useRef(null);

  // Smooth springs for tracking mouse position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable on touchscreen devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    setIsVisible(true);

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Check what element we are hovering over
      const target = e.target;
      if (!target) return;

      // Check for custom cursor actions
      const viewElement = target.closest('[data-cursor="view"]');
      const dragElement = target.closest('[data-cursor="drag"]');
      const exploreElement = target.closest('[data-cursor="explore"]');
      const linkElement = target.closest('a, button, input, textarea, select, [role="button"]');

      if (viewElement) {
        setHoverType('view');
      } else if (dragElement) {
        setHoverType('drag');
      } else if (exploreElement) {
        setHoverType('explore');
      } else if (linkElement) {
        setHoverType('link');
      } else {
        setHoverType(null);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  // Custom styling states depending on hover
  let size = 10;
  let text = '';
  let cursorBg = 'bg-primary';
  let textColor = 'text-white';
  let borderRadius = 'rounded-full';

  if (hoverType === 'link') {
    size = 40;
    cursorBg = 'bg-primary/10 border border-primary/20 backdrop-blur-[2px]';
  } else if (hoverType === 'view') {
    size = 70;
    text = 'VIEW';
    cursorBg = 'bg-primary';
  } else if (hoverType === 'drag') {
    size = 70;
    text = 'DRAG';
    cursorBg = 'bg-primary';
  } else if (hoverType === 'explore') {
    size = 70;
    text = 'EXPLORE';
    cursorBg = 'bg-primary';
  }

  return (
    <motion.div
      ref={cursorRef}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: size,
        height: size,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center font-display text-[10px] font-bold tracking-widest transition-colors duration-250 ${borderRadius} ${cursorBg} ${textColor}`}
    >
      {text}
    </motion.div>
  );
}
