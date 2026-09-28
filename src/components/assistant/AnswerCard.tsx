import React from 'react';
import { useL } from '../../contexts/AppContext';
import { Answer } from '../../types/app';
import { getModule } from '../../utils/lookup';
import { ConfidenceBadge } from './ConfidenceBadge';
import { FactRow } from './FactRow';
import { SourceCitation } from './SourceCitation';

interface AnswerCardProps {
  answer: Answer;
  listen?: React.ReactNode;
  headingTag?: 'h1' | 'h2' | 'h3';
}

export function AnswerCard({ answer, listen, headingTag = 'h1' }: AnswerCardProps) {
  const L = useL();
  const module = getModule(answer.module);
  const Heading = headingTag;
  const ModuleIcon = module?.icon;

  return (
    <article aria-labelledby={`answer-${answer.id}`} className="rounded-card bg-paper p-5 shadow-card md:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          {ModuleIcon &&
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
              <ModuleIcon className="h-7 w-7" aria-hidden="true" />
            </span>
          }
          <div className="min-w-0">
            {module && <p className="text-small text-muted">{L(module.label)}</p>}
            <Heading id={`answer-${answer.id}`} className="text-title text-ink">
              {L(answer.title)}
            </Heading>
          </div>
        </div>
        <ConfidenceBadge confidence={answer.confidence} />
      </header>

      <p className="mt-5 text-body text-ink">{L(answer.summary)}</p>

      {answer.confidence === 'partial' && answer.confidenceNote &&
      <p className="mt-4 rounded-2xl border-2 border-saffron bg-saffron-tint p-4 text-small text-ink">
          {L(answer.confidenceNote)}
        </p>
      }

      {listen && <div className="mt-5">{listen}</div>}

      <ul className="mt-7 divide-y divide-line">
        {answer.facts.map((fact) =>
        <FactRow key={fact.kind} fact={fact} />
        )}
      </ul>

      <SourceCitation source={answer.source} />
    </article>);

}