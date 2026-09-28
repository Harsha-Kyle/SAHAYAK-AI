import React, { useState } from 'react';
import { MicButton } from '../assistant/MicButton';
import { useApp, useL, useT } from '../../contexts/AppContext';
import { grievanceProblems } from '../../data/grievance';
import { getLanguage } from '../../utils/lookup';

interface ProblemStepProps {
  onNext: () => void;
}

export function ProblemStep({ onNext }: ProblemStepProps) {
  const { grievance, updateGrievance, language } = useApp();
  const t = useT();
  const L = useL();
  const [listening, setListening] = useState(false);

  const suggestedId = grievanceProblems.find((p) => grievance.about && p.relatedAnswers.includes(grievance.about))?.id;
  const ordered = suggestedId ?
  [...grievanceProblems].sort((a, b) => a.id === suggestedId ? -1 : b.id === suggestedId ? 1 : 0) :
  grievanceProblems;

  const choose = (id: string) => {
    const problem = grievanceProblems.find((p) => p.id === id);
    if (!problem) return;
    updateGrievance({ problemId: problem.id, problemText: problem.description, requestedAction: problem.requestedAction });
    onNext();
  };

  const speak = () => {
    setListening(true);
    window.setTimeout(() => {
      setListening(false);
      choose(suggestedId ?? 'claim-not-paid');
    }, 2000);
  };

  return (
    <div>
      <h2 className="text-display text-ink">What is the problem?</h2>

      <div className="mt-6 flex items-center gap-5 rounded-card bg-paper p-5 shadow-card">
        <MicButton size="md" state={listening ? 'listening' : 'idle'} label="Tell me the problem in your own words" onClick={speak} />
        <div aria-live="polite">
          <p className="text-body font-semibold text-ink">{listening ? getLanguage(language).listening : 'Tell me in your own words'}</p>
          <p className="text-small text-muted">{listening ? 'Speak slowly — I’m writing it down.' : t('tapToSpeak')}</p>
        </div>
      </div>

      <p className="mt-8 text-body font-semibold text-muted">Or choose one</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {ordered.map((p) => {
          const Icon = p.icon;
          const selected = grievance.problemId === p.id;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => choose(p.id)}
                aria-pressed={selected}
                className={`flex min-h-[5.5rem] w-full items-center gap-4 rounded-card border-2 p-4 text-left transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.98] ${
                selected ? 'border-brand bg-brand-tint' : 'border-line bg-paper hover:border-navy'}`
                }>
                
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-body font-semibold text-ink">{L(p.label)}</span>
                  {p.id === suggestedId && <span className="mt-1 block text-small text-brand-dark">Matches the answer you just read</span>}
                </span>
              </button>
            </li>);

        })}
      </ul>
    </div>);

}