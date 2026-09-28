import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useL, useT } from '../../contexts/AppContext';
import { Answer } from '../../types/app';
import { MicButton } from '../assistant/MicButton';
interface FollowUpPanelProps {
  answer: Answer;
}
export function FollowUpPanel({
  answer
}: FollowUpPanelProps) {
  const t = useT();
  const L = useL();
  const navigate = useNavigate();
  const target = answer.followUp?.targetId ?? answer.id;
  return <section aria-labelledby="followup-heading" className="rounded-card bg-paper p-5 shadow-card">
      <div className="flex items-center gap-5">
        <MicButton size="md" label={t('askFollowUp')} onClick={() => navigate(`/listen?topic=${target}&ctx=${answer.id}`)} />
        <div className="min-w-0">
          <h2 id="followup-heading" className="text-body font-semibold text-ink">
            {t('askFollowUp')}
          </h2>
          <p className="text-small text-muted">I’ll remember we’re talking about {answer.short}.</p>
        </div>
      </div>
      {answer.followUp && <button type="button" onClick={() => navigate(`/processing?topic=${target}&ctx=${answer.id}`)} className="mt-5 flex min-h-tap w-full items-center gap-3 rounded-2xl border-2 border-line px-4 py-3 text-left transition-[transform,border-color,background-color] duration-150 ease-out hover:border-navy active:scale-[0.98] active:bg-navy-tint">
          <div className="h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
          <span className="text-small text-ink">{L(answer.followUp.question)}</span>
        </button>}
    </section>;
}