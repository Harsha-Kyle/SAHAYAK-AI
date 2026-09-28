import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BookXIcon, HeadsetIcon, SearchXIcon } from 'lucide-react';
import { ContextCue } from '../components/assistant/ContextCue';
import { ListenButton } from '../components/assistant/ListenButton';
import { MicButton } from '../components/assistant/MicButton';
import { OfficeCard } from '../components/help/OfficeCard';
import { Button } from '../components/ui/Button';
import { OfflineState } from '../components/ui/OfflineState';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useApp, useL, useT } from '../contexts/AppContext';
import { offices } from '../data/offices';
import { useSpeech } from '../hooks/useSpeech';
import { getAnswer, getModule, getRefusal } from '../utils/lookup';

export function Refusal() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { easyMode } = useApp();
  const t = useT();
  const L = useL();
  const { speaking, toggle } = useSpeech();
  const refusal = getRefusal(id);
  const ctxAnswer = getAnswer(params.get('ctx'));

  if (!refusal) {
    return (
      <div className="page-container py-8">
        <OfflineState icon={SearchXIcon} title="Nothing to show" body="Try asking your question again." />
      </div>);

  }

  const module = getModule(refusal.module);
  const office = offices[0];

  return (
    <div className="page-container py-4">
      <ScreenHeader title={module ? L(module.label) : ''} titleTag="p" onBack={() => navigate('/')} />
      <div className={`grid gap-6 ${easyMode ? '' : 'lg:grid-cols-[minmax(0,1fr)_24rem]'}`}>
        <div className="flex flex-col gap-4">
          {ctxAnswer && <ContextCue title={L(ctxAnswer.title)} />}
          <section aria-labelledby="refusal-heading" className="rounded-card border-2 border-navy bg-navy-tint p-6 md:p-8">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
              <BookXIcon className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="mt-5 text-small text-muted">{L(refusal.title)}</p>
            <h1 id="refusal-heading" className="text-title text-navy">
              I don’t have this by-law
            </h1>
            <p className="mt-3 text-body text-ink">{L(refusal.reason)}</p>
            <p className="mt-3 text-body text-ink">
              Your society office keeps the official copy of the by-laws. Any member can ask to see it.
            </p>
            <div className="mt-6">
              <ListenButton
                size="md"
                speaking={speaking}
                onToggle={() => toggle(`I don't have this by-law. ${L(refusal.reason)}`)} />
              
            </div>
          </section>

          <section className="rounded-card bg-paper p-5 shadow-card">
            <h2 className="text-body font-semibold text-ink">Ask something else</h2>
            <div className="mt-4 flex items-center gap-5">
              <MicButton size="md" label={t('tapToSpeak')} onClick={() => navigate('/listen')} />
              <p className="text-small text-muted">I can explain what the Tamil Nadu Co-operative Societies Act says about dividends in general.</p>
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <section aria-labelledby="office-heading" className="rounded-card bg-paper shadow-card">
            <h2 id="office-heading" className="px-5 pt-5 text-title text-ink">
              Nearest cooperative office
            </h2>
            <OfficeCard office={office} emphasis />
          </section>
          <Button variant="outline" size="lg" fullWidth icon={HeadsetIcon} onClick={() => navigate('/help')}>
            {t('talkToHuman')}
          </Button>
        </aside>
      </div>
    </div>);

}