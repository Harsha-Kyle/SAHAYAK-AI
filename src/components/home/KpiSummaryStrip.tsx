import React from 'react';
import { CheckCircle2Icon, GlobeIcon, MessageSquareIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function KpiSummaryStrip() {
  const { usedLanguagesCount, topicQueryCounts } = useApp();

  const totalQueries = Object.values(topicQueryCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="my-2 grid w-full max-w-4xl grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3">
      {/* Active Users Today */}
      <div className="flex flex-col justify-between rounded-card border border-line bg-paper p-3 shadow-card">
        <div className="flex items-center justify-between">
          <UsersIcon className="h-4 w-4 text-brand" aria-hidden="true" />
          <span className="flex items-center rounded-full bg-saffron-tint px-1.5 py-0.5 text-[11px] font-bold text-ink">
            <TrendingUpIcon className="mr-0.5 h-3 w-3 text-saffron" aria-hidden="true" />
            <span className="text-saffron">↑</span> 12%
          </span>
        </div>
        <div className="mt-2 text-left">
          <div className="text-xl font-bold leading-tight text-ink sm:text-2xl">1,284</div>
          <p className="text-[11px] font-medium text-muted">Active Users Today</p>
        </div>
      </div>

      {/* Queries Answered Today */}
      <div className="flex flex-col justify-between rounded-card border border-line bg-paper p-3 shadow-card">
        <div className="flex items-center justify-between">
          <MessageSquareIcon className="h-4 w-4 text-brand" aria-hidden="true" />
        </div>
        <div className="mt-2 text-left">
          <div className="text-xl font-bold leading-tight text-ink sm:text-2xl">{totalQueries.toLocaleString()}</div>
          <p className="text-[11px] font-medium text-muted">Queries Answered</p>
        </div>
      </div>

      {/* Resolution Rate */}
      <div className="flex flex-col justify-between rounded-card border border-line bg-paper p-3 shadow-card">
        <div className="flex items-center justify-between">
          <CheckCircle2Icon className="h-4 w-4 text-brand" aria-hidden="true" />
          <span className="rounded-full bg-brand-tint px-1.5 py-0.5 text-[11px] font-semibold text-brand-dark">
            92% verified
          </span>
        </div>
        <div className="mt-2 text-left">
          <div className="text-xl font-bold leading-tight text-ink sm:text-2xl">92%</div>
          <p className="text-[11px] font-medium text-muted">Resolution Rate</p>
        </div>
      </div>

      {/* Languages in Use */}
      <div className="flex flex-col justify-between rounded-card border border-line bg-paper p-3 shadow-card">
        <div className="flex items-center justify-between">
          <GlobeIcon className="h-4 w-4 text-brand" aria-hidden="true" />
          <span className="rounded-full bg-saffron-tint px-1.5 py-0.5 text-[11px] font-semibold text-ink">
            {usedLanguagesCount} used
          </span>
        </div>
        <div className="mt-2 text-left">
          <div className="text-xl font-bold leading-tight text-ink sm:text-2xl">{usedLanguagesCount}</div>
          <p className="text-[11px] font-medium text-muted">Languages Used</p>
        </div>
      </div>
    </div>
  );
}
