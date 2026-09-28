import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ChevronsRightIcon } from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { OnboardingVisual } from '../components/onboarding/OnboardingVisual';
import { ProgressDots } from '../components/ui/ProgressDots';
import { useT } from '../contexts/AppContext';

const stepDescriptions = [
'Step one: tap the big orange microphone button.',
'Step two: speak your question in your own language.',
'Step three: listen to the answer, read aloud to you.'];


export function Onboarding() {
  const navigate = useNavigate();
  const t = useT();
  const [step, setStep] = useState(0);
  const last = step === stepDescriptions.length - 1;

  const finish = () => navigate('/language?first=1', { replace: true });
  const next = () => last ? finish() : setStep(step + 1);

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <header className="page-container flex items-center justify-between py-4">
        <Logo />
        <button
          type="button"
          onClick={finish}
          aria-label="Skip walkthrough"
          className="inline-flex min-h-tap items-center gap-2 rounded-full px-4 text-body font-semibold text-navy transition-colors duration-150 ease-out hover:bg-navy-tint active:bg-navy-tint">
          
          {t('skip')}
          <ChevronsRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center">
            
            <OnboardingVisual step={step} />
            <p className="sr-only" aria-live="polite">
              {stepDescriptions[step]}
            </p>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="page-container flex items-center justify-between gap-4 pb-10 pt-4">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          aria-label="Previous step"
          className="flex h-tap-lg w-tap-lg items-center justify-center rounded-full border-2 border-line text-ink transition-[transform,opacity] duration-150 ease-out active:scale-95 disabled:opacity-0">
          
          <ArrowLeftIcon className="h-7 w-7" aria-hidden="true" />
        </button>
        <ProgressDots total={stepDescriptions.length} current={step} />
        <button
          type="button"
          onClick={next}
          aria-label={last ? 'Finish walkthrough' : 'Next step'}
          className="flex h-tap-lg w-tap-lg items-center justify-center rounded-full bg-saffron text-ink shadow-raised transition-[transform,background-color] duration-150 ease-out hover:bg-saffron-dark active:scale-95">
          
          {last ? <CheckIcon className="h-8 w-8" strokeWidth={3} aria-hidden="true" /> : <ArrowRightIcon className="h-8 w-8" aria-hidden="true" />}
        </button>
      </footer>
    </div>);

}