import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HandHelpingIcon, WifiOffIcon, XIcon } from 'lucide-react';
import { ContextCue } from '../components/assistant/ContextCue';
import { MicButton } from '../components/assistant/MicButton';
import { Button } from '../components/ui/Button';
import { useApp, useL, useT } from '../contexts/AppContext';
import { useGoBack } from '../hooks/useGoBack';
import { getAnswer, getIntent, getLanguage } from '../utils/lookup';

const BAR_COUNT = 28;

export function Listening() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const reduce = useReducedMotion();
  const { language, helperMode, online, takeDemoTopic } = useApp();
  const t = useT();
  const L = useL();
  const lang = getLanguage(language);
  const [topic] = useState(() => params.get('topic') ?? takeDemoTopic());
  const ctx = params.get('ctx');
  const ctxAnswer = getAnswer(ctx);
  const intent = getIntent(topic);
  const [phase, setPhase] = useState<'listening' | 'heard'>('listening');

  const proceed = useCallback(() => {
    navigate(`/processing?topic=${topic}${ctx ? `&ctx=${ctx}` : ''}`, { replace: true });
  }, [ctx, navigate, topic]);

  useEffect(() => {
    const id = window.setTimeout(() => setPhase('heard'), helperMode ? 3200 : 2600);
    return () => window.clearTimeout(id);
  }, [helperMode]);

  useEffect(() => {
    if (phase !== 'heard' || helperMode) return;
    const id = window.setTimeout(proceed, 1500);
    return () => window.clearTimeout(id);
  }, [phase, helperMode, proceed]);

  return (
    <div className="fixed inset-0 flex flex-col bg-brand-dark text-white" role="dialog" aria-modal="true" aria-label={lang.listening}>
      <header className="page-container flex items-center justify-between gap-3 py-4">
        <button
          type="button"
          onClick={goBack}
          aria-label={t('cancel')}
          className="flex h-tap w-tap items-center justify-center rounded-full border-2 border-paper transition-colors duration-150 ease-out hover:bg-brand active:bg-brand">
          
          <XIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex flex-wrap justify-end gap-2">
          {!online &&
          <span className="inline-flex min-h-[2.5rem] items-center gap-2 rounded-full bg-paper px-3 text-small font-semibold text-ink">
              <WifiOffIcon className="h-5 w-5" aria-hidden="true" />
              Offline · saved topics only
            </span>
          }
          {helperMode &&
          <span className="inline-flex min-h-[2.5rem] items-center gap-2 rounded-full bg-saffron px-3 text-small font-semibold text-ink">
              <HandHelpingIcon className="h-5 w-5" aria-hidden="true" />
              {t('helperMode')}
            </span>
          }
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 text-center">
        {ctxAnswer &&
        <div className="w-full max-w-md">
            <ContextCue title={L(ctxAnswer.title)} onDark />
          </div>
        }

        <MicButton size="lg" state={phase === 'listening' ? 'listening' : 'idle'} label="Stop listening" onClick={proceed} />

        <h1 lang={language} className="text-display" aria-live="polite">
          {lang.listening}
        </h1>

        <div aria-hidden="true" className="flex h-20 items-center gap-1.5">
          {Array.from({ length: BAR_COUNT }).map((_, i) =>
          <motion.span
            key={i}
            className="h-full w-1.5 origin-center rounded-full bg-saffron"
            animate={
            reduce || phase === 'heard' ?
            { scaleY: 0.12 } :
            { scaleY: [0.15, 0.35 + i * 37 % 60 / 100, 0.2] }
            }
            transition={{ duration: 0.8 + i % 5 * 0.12, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }} />

          )}
        </div>

        <div className="min-h-[4rem] max-w-2xl">
          <AnimatePresence>
            {phase === 'heard' && intent &&
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              lang={language}
              className="text-title">
              
                “{L(intent.question)}”
              </motion.p>
            }
          </AnimatePresence>
          {helperMode && phase === 'listening' &&
          <p className="text-body">Let the farmer finish speaking, then tap Done.</p>
          }
        </div>
      </main>

      <footer className="page-container flex flex-col gap-3 pb-10 sm:flex-row sm:justify-center">
        {helperMode &&
        <Button variant="primary" size="lg" onClick={proceed} disabled={phase !== 'heard'}>
            {t('done')}
          </Button>
        }
        <button
          type="button"
          onClick={goBack}
          className="inline-flex min-h-tap-lg items-center justify-center gap-2 rounded-2xl border-2 border-paper px-8 text-body font-semibold text-white transition-colors duration-150 ease-out hover:bg-brand active:bg-brand">
          
          <XIcon className="h-5 w-5" aria-hidden="true" />
          {t('cancel')}
        </button>
      </footer>
    </div>);

}