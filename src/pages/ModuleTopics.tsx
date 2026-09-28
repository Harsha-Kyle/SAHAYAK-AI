import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRightIcon, ListChecksIcon, MegaphoneIcon, SearchXIcon, WifiOffIcon } from 'lucide-react';
import { MicButton } from '../components/assistant/MicButton';
import { Button } from '../components/ui/Button';
import { OfflineState } from '../components/ui/OfflineState';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useApp, useL, useT } from '../contexts/AppContext';
import { answers } from '../data/answers';
import { refusals } from '../data/refusals';
import { getModule } from '../utils/lookup';

export function ModuleTopics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { online, easyMode, resetGrievance } = useApp();
  const t = useT();
  const L = useL();
  const module = getModule(id);

  if (!module) {
    return (
      <div className="page-container py-8">
        <OfflineState icon={SearchXIcon} title="Topic not found" body="This topic isn’t available. Try asking by voice instead.">
          <Button variant="brand" onClick={() => navigate('/')}>
            {t('navHome')}
          </Button>
        </OfflineState>
      </div>);

  }

  const topics = [
  ...answers.filter((a) => a.module === module.id).map((a) => ({ id: a.id, question: a.question, to: `/answer/${a.id}`, cached: a.cachedOffline })),
  ...refusals.filter((r) => r.module === module.id).map((r) => ({ id: r.id, question: r.question, to: `/refusal/${r.id}`, cached: true }))];

  const Icon = module.icon;
  const isGrievance = module.id === 'grievance';

  return (
    <div className="page-container py-4">
      <ScreenHeader title={L(module.label)} subtitle={L(module.hint)} onBack={() => navigate('/')} />

      <div className={`mt-4 grid gap-6 ${easyMode ? '' : 'lg:grid-cols-[minmax(0,1fr)_22rem]'}`}>
        <div>
          {isGrievance ?
          <div className="grid gap-4 sm:grid-cols-2">
              <button
              type="button"
              onClick={() => {
                resetGrievance();
                navigate('/grievance');
              }}
              className="flex min-h-[10rem] flex-col items-start justify-between rounded-card bg-saffron p-6 text-left text-ink transition-[transform,background-color] duration-150 ease-out hover:bg-saffron-dark active:scale-[0.98]">
              
                <MegaphoneIcon className="h-10 w-10" aria-hidden="true" />
                <span>
                  <span className="block text-title">Make a complaint</span>
                  <span className="block text-small">I’ll ask one question at a time and write it for you.</span>
                </span>
              </button>
              <button
              type="button"
              onClick={() => navigate('/status')}
              className="flex min-h-[10rem] flex-col items-start justify-between rounded-card border-2 border-navy bg-paper p-6 text-left text-ink transition-[transform,background-color] duration-150 ease-out hover:bg-navy-tint active:scale-[0.98]">
              
                <ListChecksIcon className="h-10 w-10 text-navy" aria-hidden="true" />
                <span>
                  <span className="block text-title">{t('trackStatus')}</span>
                  <span className="block text-small text-muted">Check where your claim or complaint is now.</span>
                </span>
              </button>
            </div> :

          <section aria-labelledby="topics-heading">
              <h2 id="topics-heading" className="text-body font-semibold text-muted">
                Common questions
              </h2>
              <ul className="mt-3 divide-y divide-line rounded-card bg-paper shadow-card">
                {topics.map((topic) => {
                const unavailable = !online && !topic.cached;
                return (
                  <li key={topic.id}>
                      <button
                      type="button"
                      disabled={unavailable}
                      onClick={() => navigate(topic.to)}
                      className="flex min-h-tap-lg w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 ease-out first:rounded-t-card last:rounded-b-card hover:bg-surface active:bg-brand-tint disabled:cursor-not-allowed disabled:hover:bg-paper">
                      
                        <span className="min-w-0 flex-1">
                          <span className={`block text-body ${unavailable ? 'text-muted' : 'text-ink'}`}>{L(topic.question)}</span>
                          {unavailable &&
                        <span className="mt-1 flex items-center gap-1 text-small text-muted">
                              <WifiOffIcon className="h-4 w-4" aria-hidden="true" />
                              {t('needsInternet')}
                            </span>
                        }
                        </span>
                        <ChevronRightIcon className="h-6 w-6 shrink-0 text-navy" aria-hidden="true" />
                      </button>
                    </li>);

              })}
              </ul>
            </section>
          }
        </div>

        <aside className="flex flex-col items-center gap-5 rounded-card bg-paper p-6 text-center shadow-card">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-tint text-brand">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="text-body font-semibold text-ink">Ask anything about {L(module.label).toLowerCase()}</p>
          <MicButton size="md" label={t('tapToSpeak')} onClick={() => navigate('/listen')} />
          <p className="text-small text-muted">{t('tapToSpeak')}</p>
        </aside>
      </div>
    </div>);

}