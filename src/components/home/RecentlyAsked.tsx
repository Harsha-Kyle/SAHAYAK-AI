import React from 'react';
import { Link } from 'react-router-dom';
import { useApp, useL, useT } from '../../contexts/AppContext';
import { getModule } from '../../utils/lookup';

export function RecentlyAsked() {
  const { history } = useApp();
  const t = useT();
  const L = useL();
  const items = history.slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading">
      <div className="flex items-baseline justify-between">
        <h2 id="recent-heading" className="text-title text-ink">
          {t('recentlyAsked')}
        </h2>
        <Link to="/history" className="text-small font-semibold text-navy underline-offset-4 hover:underline">
          See all
        </Link>
      </div>
      <ul className="mt-4 grid grid-cols-4 gap-2">
        {items.map((item) => {
          const Icon = getModule(item.module)?.icon;
          return (
            <li key={item.id}>
              <Link
                to={item.to}
                aria-label={L(item.title)}
                className="group flex flex-col items-center gap-2 rounded-2xl p-1 text-center">
                
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-line bg-paper text-brand transition-[transform,border-color] duration-150 ease-out group-hover:border-brand group-active:scale-95">
                  {Icon && <Icon className="h-7 w-7" aria-hidden="true" />}
                </span>
                <span className="w-full truncate text-small font-semibold text-ink">{item.short}</span>
              </Link>
            </li>);

        })}
      </ul>
    </section>);

}