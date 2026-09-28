import React from 'react';
import { CheckIcon } from 'lucide-react';
import { StatusRecord } from '../../types/app';
import { formatDate } from '../../utils/format';

interface StatusTimelineProps {
  record: StatusRecord;
}

export function StatusTimeline({ record }: StatusTimelineProps) {
  return (
    <ol className="relative" aria-label="Progress">
      {record.stages.map((stage, i) => {
        const state = i < record.current ? 'done' : i === record.current ? 'active' : 'upcoming';
        const isLast = i === record.stages.length - 1;
        return (
          <li key={stage.label} className="relative flex gap-4 pb-8 last:pb-0" aria-current={state === 'active' ? 'step' : undefined}>
            {!isLast &&
            <span
              aria-hidden="true"
              className={`absolute left-6 top-12 h-[calc(100%-3rem)] w-1 -translate-x-1/2 rounded-full ${i < record.current ? 'bg-brand' : 'bg-line'}`} />

            }
            <span
              className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-body font-semibold ${
              state === 'done' ?
              'bg-brand text-white' :
              state === 'active' ?
              'border-4 border-saffron bg-paper text-ink' :
              'border-2 border-muted bg-paper text-muted'}`
              }>
              
              {state === 'done' ?
              <CheckIcon className="h-6 w-6" strokeWidth={3} aria-hidden="true" /> :
              state === 'active' ?
              <span className="h-3.5 w-3.5 rounded-full bg-saffron" aria-hidden="true" /> :

              i + 1
              }
            </span>
            <div className="min-w-0 pt-2.5">
              <p className={`text-body font-semibold ${state === 'upcoming' ? 'text-muted' : 'text-ink'}`}>
                {stage.label}
                <span className="sr-only"> — {state === 'done' ? 'done' : state === 'active' ? 'in progress' : 'not yet'}</span>
              </p>
              {state === 'active' &&
              <span className="mt-1 inline-flex rounded-full bg-saffron-tint px-3 py-0.5 text-small font-semibold text-ink">Happening now</span>
              }
              {stage.date && <p className="mt-1 text-small text-muted">{formatDate(stage.date)}</p>}
              {stage.note && <p className="mt-1 text-small text-ink">{stage.note}</p>}
            </div>
          </li>);

      })}
    </ol>);

}