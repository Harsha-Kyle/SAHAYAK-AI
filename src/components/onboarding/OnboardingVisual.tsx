import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BadgeCheckIcon, MicIcon, PointerIcon, UserRoundIcon, Volume2Icon } from 'lucide-react';

interface OnboardingVisualProps {
  step: number;
}

const loop = { repeat: Infinity, ease: 'easeInOut' as const };

/** Wordless illustrations for the tap → speak → listen walkthrough. */
export function OnboardingVisual({ step }: OnboardingVisualProps) {
  const reduce = useReducedMotion();

  if (step === 0) {
    return (
      <div className="relative flex h-72 w-72 items-center justify-center md:h-80 md:w-80">
        <span className="flex h-44 w-44 items-center justify-center rounded-full bg-saffron text-ink shadow-raised">
          <MicIcon className="h-20 w-20" strokeWidth={2.25} aria-hidden="true" />
        </span>
        <motion.span
          className="absolute bottom-2 right-6 text-navy"
          animate={reduce ? undefined : { x: [18, 0, 18], y: [18, 0, 18], scale: [1, 0.92, 1] }}
          transition={{ duration: 1.8, ...loop }}>
          
          <PointerIcon className="h-24 w-24 fill-paper" strokeWidth={1.75} aria-hidden="true" />
        </motion.span>
      </div>);

  }

  if (step === 1) {
    return (
      <div className="flex h-72 items-center justify-center gap-6 md:h-80">
        <span className="flex h-36 w-36 items-center justify-center rounded-full bg-brand-tint text-brand">
          <UserRoundIcon className="h-20 w-20" aria-hidden="true" />
        </span>
        <span aria-hidden="true" className="flex h-24 items-center gap-2">
          {[0, 1, 2, 3, 4].map((i) =>
          <motion.span
            key={i}
            className="h-full w-2.5 origin-center rounded-full bg-saffron"
            animate={reduce ? { scaleY: 0.6 } : { scaleY: [0.25, 1, 0.4, 0.8, 0.25] }}
            transition={{ duration: 1.2, delay: i * 0.1, ...loop }} />

          )}
        </span>
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-saffron text-ink">
          <MicIcon className="h-12 w-12" aria-hidden="true" />
        </span>
      </div>);

  }

  return (
    <div className="flex h-72 flex-col items-center justify-center gap-6 md:h-80">
      <motion.span
        className="flex h-32 w-32 items-center justify-center rounded-full bg-brand text-white"
        animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
        transition={{ duration: 1.6, ...loop }}>
        
        <Volume2Icon className="h-16 w-16" aria-hidden="true" />
      </motion.span>
      <div aria-hidden="true" className="w-64 rounded-card bg-paper p-4 shadow-card">
        <div className="flex items-center justify-between">
          <span className="h-4 w-28 rounded-full bg-ink" />
          <BadgeCheckIcon className="h-6 w-6 text-brand" />
        </div>
        <span className="mt-3 block h-3 w-full rounded-full bg-line" />
        <span className="mt-2 block h-3 w-4/5 rounded-full bg-line" />
        <span className="mt-2 block h-3 w-3/5 rounded-full bg-line" />
      </div>
    </div>);

}