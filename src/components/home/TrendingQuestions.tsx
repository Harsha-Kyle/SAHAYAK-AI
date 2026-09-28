import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon, WifiOffIcon } from 'lucide-react';
import { useApp, useL, useT } from '../../contexts/AppContext';
import { trendingTopics } from '../../data/trending';
import { getAnswer, getModule } from '../../utils/lookup';

export function TrendingQuestions() {
  const { online } = useApp();
  const t = useT();
  const L = useL();
  const navigate = useNavigate();

  return (
    <section aria-labelledby="trending-heading">
      <h2 id="trending-heading" className="text-title text-ink">
        {t('trending')}
      </h2>
      <ul className="mt-4 divide-y divide-line rounded-card bg-paper shadow-card">
        {trendingTopics.map((id) => {
          const answer = getAnswer(id);
          if (!answer) return null;
          const Icon = getModule(answer.module)?.icon;
          const unavailable = !online && !answer.cachedOffline;
          return (
            <li key={id}>
              <button
                type="button"
                disabled={unavailable}
                onClick={() => navigate(`/answer/${id}`)}
                className="flex min-h-tap-lg w-full items-center gap-4 px-4 py-3 text-left transition-colors duration-150 ease-out first:rounded-t-card last:rounded-b-card hover:bg-surface active:bg-brand-tint disabled:cursor-not-allowed disabled:hover:bg-paper">
                
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${unavailable ? 'bg-line text-muted' : 'bg-brand-tint text-brand'}`}>
                  
                  {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-body ${unavailable ? 'text-muted' : 'text-ink'}`}>{L(answer.question)}</span>
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
    </section>);

}