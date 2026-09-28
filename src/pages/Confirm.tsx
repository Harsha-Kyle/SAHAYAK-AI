import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { HandHelpingIcon, SearchXIcon } from 'lucide-react';
import { ConfirmButtons } from '../components/assistant/ConfirmButtons';
import { ContextCue } from '../components/assistant/ContextCue';
import { ListenButton } from '../components/assistant/ListenButton';
import { MicButton } from '../components/assistant/MicButton';
import { Button } from '../components/ui/Button';
import { OfflineState } from '../components/ui/OfflineState';
import { useApp, useL, useT } from '../contexts/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { getAnswer, getIntent, getModule, routeForIntent } from '../utils/lookup';

export function Confirm() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const ctx = params.get('ctx');
  const navigate = useNavigate();
  const { helperMode } = useApp();
  const t = useT();
  const L = useL();
  const { speaking, toggle } = useSpeech();
  const [rejected, setRejected] = useState(false);
  const intent = getIntent(id);
  const ctxAnswer = getAnswer(ctx);

  if (!intent) {
    return (
      <div className="page-container py-8">
        <OfflineState icon={SearchXIcon} title="I couldn’t match that question" body="Please try asking again in a few simple words.">
          <Button variant="primary" onClick={() => navigate('/listen')}>
            {t('tryAgain')}
          </Button>
        </OfflineState>
      </div>);

  }

  const module = getModule(intent.module);
  const Icon = module?.icon;

  return (
    <div className="page-container max-w-3xl py-8">
      {ctxAnswer && <ContextCue title={L(ctxAnswer.title)} />}

      <section aria-labelledby="confirm-heading" className="mt-6 flex flex-col items-center rounded-card bg-paper p-6 text-center shadow-card md:p-10">
        <h1 id="confirm-heading" className="text-title text-ink">
          {t('didYouAsk')}
        </h1>
        {Icon &&
        <span className="mt-8 flex h-28 w-28 items-center justify-center rounded-full bg-brand-tint text-brand">
            <Icon className="h-14 w-14" aria-hidden="true" />
          </span>
        }
        {module && <p className="mt-6 text-small text-muted">{L(module.label)}</p>}
        <p className="mt-1 text-display text-ink">{L(intent.title)}</p>
        <p className="mt-3 text-body text-muted">“{L(intent.question)}”</p>
        <div className="mt-6">
          <ListenButton size="md" speaking={speaking} onToggle={() => toggle(`${t('didYouAsk')} ${L(intent.title)}`)} />
        </div>
      </section>

      {helperMode &&
      <div className="mt-4 flex items-start gap-3 rounded-2xl border-2 border-saffron bg-saffron-tint p-4">
          <HandHelpingIcon className="mt-0.5 h-6 w-6 shrink-0 text-ink" aria-hidden="true" />
          <p className="text-small text-ink">Read the topic aloud to the farmer and check they agree before tapping Yes.</p>
        </div>
      }

      {!rejected ?
      <ConfirmButtons className="mt-6" onYes={() => navigate(routeForIntent(intent, ctx), { replace: true })} onNo={() => setRejected(true)} /> :

      <section aria-labelledby="retry-heading" className="mt-6 rounded-card bg-paper p-6 shadow-card">
          <h2 id="retry-heading" className="text-title text-ink">
            Sorry about that. Let’s try again.
          </h2>
          <div className="mt-5 flex items-center gap-5">
            <MicButton size="md" label="Ask again" onClick={() => navigate('/listen', { replace: true })} />
            <p className="text-body text-ink">Tap and say your question in a few simple words.</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {module &&
          <Button variant="outline" onClick={() => navigate(`/module/${module.id}`)}>
                See {L(module.label).toLowerCase()} questions
              </Button>
          }
            <Button variant="ghost" onClick={() => navigate('/help')}>
              {t('talkToHuman')}
            </Button>
          </div>
        </section>
      }
    </div>);

}