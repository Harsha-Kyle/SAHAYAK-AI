import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { RepeatAnswerButton } from './RepeatAnswerButton';
import { TopBar } from './TopBar';

export function AppShell() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-surface">
      <a
        href="#main"
        className="sr-only z-50 rounded-2xl bg-navy px-4 py-3 text-body font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        
        Skip to content
      </a>
      <TopBar />
      <main id="main" className="flex-1 pb-36">
        <Outlet />
      </main>
      <RepeatAnswerButton />
      <BottomNav />
    </div>);

}