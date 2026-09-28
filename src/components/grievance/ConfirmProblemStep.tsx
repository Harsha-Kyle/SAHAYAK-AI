import React, { useEffect } from 'react';
import { HandHelpingIcon } from 'lucide-react';
import { ConfirmButtons } from '../assistant/ConfirmButtons';
import { ListenButton } from '../assistant/ListenButton';
import { useApp, useL } from '../../contexts/AppContext';
import { grievanceProblems } from '../../data/grievance';
import { useSpeech } from '../../hooks/useSpeech';

interface ConfirmProblemStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ConfirmProblemStep({ onNext, onBack }: ConfirmProblemStepProps) {
  const { grievance, helperMode } = useApp();
  const L = useL();
  const { speaking, toggle } = useSpeech();
  const problem = grievanceProblems.find((p) => p.id === grievance.problemId);

  useEffect(() => {
    if (!problem) onBack();
  }, [problem, onBack]);

  if (!problem) return null;
  const Icon = problem.icon;

  return (
    <div>
      <h2 className="text-display text-ink">Is this right?</h2>
      <section className="mt-6 rounded-card bg-paper p-6 shadow-card">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <p className="text-title text-ink">{L(problem.label)}</p>
            <p className="text-small text-muted">{problem.scheme}</p>
          </div>
        </div>
        <p className="mt-5 text-body text-ink">{grievance.problemText}</p>
        <div className="mt-5">
          <ListenButton size="md" speaking={speaking} onToggle={() => toggle(`${L(problem.label)}. ${grievance.problemText}`)} />
        </div>
      </section>

      {helperMode &&
      <div className="mt-4 flex items-start gap-3 rounded-2xl border-2 border-saffron bg-saffron-tint p-4">
          <HandHelpingIcon className="mt-0.5 h-6 w-6 shrink-0 text-ink" aria-hidden="true" />
          <p className="text-small text-ink">Read this to the farmer in their language. Only tap Yes once they agree it’s correct.</p>
        </div>
      }

      <ConfirmButtons className="mt-6" onYes={onNext} onNo={onBack} />
    </div>);

}