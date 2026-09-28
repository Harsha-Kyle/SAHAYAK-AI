import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDownIcon, MicIcon, PointerIcon } from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { languages } from '../data/languages';

/** Attract screen for fixed kiosks at CSCs and PACS offices. */
export function KioskIdle() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % languages.length), 2800);
    return () => window.clearInterval(id);
  }, []);

  const lang = languages[index];
  const start = () => navigate('/language?first=1');

  return (
    <div className="flex min-h-screen w-full select-none flex-col bg-brand text-white">
      <button type="button" onClick={start} aria-label="Touch to start" className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-12">
        <Logo onDark size="lg" />
        <div className="flex min-h-[8rem] items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={lang.code}
              lang={lang.code}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-3xl text-center text-display">
              
              {lang.greeting}
            </motion.p>
          </AnimatePresence>
        </div>
        <span className="inline-flex min-h-tap-lg items-center gap-4 rounded-full bg-paper px-8 text-title text-brand-dark">
          <PointerIcon className="h-8 w-8" aria-hidden="true" />
          Touch the screen to start
        </span>
      </button>

      <div className="flex flex-col items-center gap-3 border-t-2 border-brand-dark pb-8 pt-6">
        <p className="flex items-center gap-3 text-title">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-saffron text-ink">
            <MicIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          Or press the orange button below the screen
        </p>
        <motion.span animate={reduce ? undefined : { y: [0, 10, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDownIcon className="h-10 w-10" aria-hidden="true" />
        </motion.span>
        <p className="text-small">Available in 8 languages · Free for all farmers</p>
      </div>
    </div>);

}