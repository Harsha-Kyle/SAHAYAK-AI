import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { MicOffIcon } from 'lucide-react';
import { ContextCue } from '../components/assistant/ContextCue';
import { Button } from '../components/ui/Button';
import { useApp, useL, useT } from '../contexts/AppContext';
import { useGoBack } from '../hooks/useGoBack';
import { getAnswer, getIntent, getLanguage } from '../utils/lookup';

export function Processing() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const reduce = useReducedMotion();
  const { language, helperMode } = useApp();
  const t = useT();
  const L = useL();
  const topic = params.get('topic');
  const ctx = params.get('ctx');
  const intent = getIntent(topic);
  const ctxAnswer = getAnswer(ctx);
  const lang = getLanguage(language);

  useEffect(() => {
    if (!intent) return;
    const id = window.setTimeout(
      () => navigate(`/confirm/${intent.id}${ctx ? `?ctx=${ctx}` : ''}`, { replace: true }),
      helperMode ? 2200 : 1500
    );
    return () => window.clearTimeout(id);
  }, [ctx, helperMode, intent, navigate]);

  if (!intent) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-paper px-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-navy-tint text-navy">
          <MicOffIcon className="h-10 w-10" aria-hidden="true" />
        </span>
        <h1 className="text-display text-ink">Sorry, I didn’t catch that</h1>
        <p className="max-w-md text-body text-muted">Please speak a little closer to the phone, or choose a topic from the home screen.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" size="lg" onClick={() => navigate('/listen', { replace: true })}>
            {t('tryAgain')}
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/')}>
            {t('navHome')}
          </Button>
        </div>
      </div>);

  }

  return (
    <div className="fixed inset-0 flex flex-col bg-paper" role="status" aria-live="polite">
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        {ctxAnswer &&
        <div className="w-full max-w-md">
            <ContextCue title={L(ctxAnswer.title)} />
          </div>
        }
        <div aria-hidden="true" className="flex gap-3">
          {[0, 1, 2].map((i) =>
          <motion.span
            key={i}
            className="h-5 w-5 rounded-full bg-brand"
            animate={reduce ? { opacity: 1 } : { scale: [0.7, 1.1, 0.7], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }} />

          )}
        </div>
        <h1 lang={language} className="text-display text-ink">
          {lang.understanding}
        </h1>
        <p lang={language} className="max-w-xl text-title text-muted">
          “{L(intent.question)}”
        </p>
      </main>
      <footer className="flex justify-center pb-10">
        <Button variant="ghost" size="lg" onClick={goBack}>
          {t('cancel')}
        </Button>
      </footer>
    </div>);

}