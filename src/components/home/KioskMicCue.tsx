import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownIcon } from 'lucide-react';

/** Kiosk only: points to the physical mic button mounted under the screen. */
export function KioskMicCue() {
  const reduce = useReducedMotion();
  return (
    <div className="mt-6 flex items-center gap-4 rounded-full border-2 border-saffron bg-saffron-tint px-6 py-3">
      <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-ink bg-saffron" />
      <p className="text-body font-semibold text-ink">Or press the orange button below the screen</p>
      <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}>
        <ArrowDownIcon className="h-6 w-6 text-ink" aria-hidden="true" />
      </motion.span>
    </div>);

}