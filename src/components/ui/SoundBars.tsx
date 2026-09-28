import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SoundBarsProps {
  className?: string;
  barClassName?: string;
}

export function SoundBars({ className = '', barClassName = 'bg-current' }: SoundBarsProps) {
  const reduce = useReducedMotion();
  return (
    <span aria-hidden="true" className={`inline-flex h-5 items-center gap-[3px] ${className}`}>
      {[0, 1, 2, 3].map((i) =>
      <motion.span
        key={i}
        className={`h-full w-[3px] origin-center rounded-full ${barClassName}`}
        animate={reduce ? { scaleY: 0.6 } : { scaleY: [0.3, 1, 0.45, 0.85, 0.3] }}
        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }} />

      )}
    </span>);

}