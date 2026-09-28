import React from 'react';

export function AnswerSkeleton() {
  return (
    <div role="status" aria-label="Loading answer" className="rounded-card bg-paper p-5 shadow-card md:p-8">
      <div className="flex animate-pulse items-start gap-4">
        <span className="h-14 w-14 rounded-full bg-line" />
        <div className="flex-1 space-y-3">
          <span className="block h-4 w-24 rounded-full bg-line" />
          <span className="block h-6 w-3/4 rounded-full bg-line" />
        </div>
      </div>
      <div className="mt-6 animate-pulse space-y-3">
        <span className="block h-4 w-full rounded-full bg-line" />
        <span className="block h-4 w-5/6 rounded-full bg-line" />
      </div>
      <span className="mt-6 block h-tap-lg w-48 animate-pulse rounded-2xl bg-line" />
      <div className="mt-8 animate-pulse space-y-6">
        {[0, 1, 2].map((i) =>
        <div key={i} className="flex gap-4">
            <span className="h-12 w-12 rounded-full bg-line" />
            <div className="flex-1 space-y-2">
              <span className="block h-4 w-32 rounded-full bg-line" />
              <span className="block h-4 w-full rounded-full bg-line" />
            </div>
          </div>
        )}
      </div>
      <span className="sr-only">Loading answer…</span>
    </div>);

}