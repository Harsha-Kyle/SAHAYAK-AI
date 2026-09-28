import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ALargeSmallIcon, HandHelpingIcon, SettingsIcon, SnailIcon } from 'lucide-react';
import { useApp, useT } from '../../contexts/AppContext';
import { Logo } from '../brand/Logo';
import { LanguagePill } from '../ui/LanguagePill';
import { StatusChip } from '../ui/StatusChip';

export function TopBar() {
  const { language, online, helperMode, easyMode, setEasyMode } = useApp();
  const t = useT();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-brand text-white">
      <div className="page-container flex min-h-tap-lg items-center gap-2 py-2">
        <Link to="/" aria-label="Sahayak AI — home" className="rounded-full">
          <Logo onDark hideTextOnMobile />
        </Link>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {helperMode && (
            <span className="hidden min-h-[2.5rem] items-center gap-2 whitespace-nowrap rounded-full bg-saffron px-3 text-small font-semibold text-ink md:inline-flex">
              <HandHelpingIcon className="h-5 w-5" aria-hidden="true" />
              {t('helperMode')}
            </span>
          )}
          {easyMode && (
            <span className="hidden min-h-[2.5rem] items-center gap-2 whitespace-nowrap rounded-full bg-brand-dark px-3 text-small font-semibold text-white lg:inline-flex">
              <SnailIcon className="h-5 w-5" aria-hidden="true" />
              {t('slowSpeech')}
            </span>
          )}
          <StatusChip status={online ? 'online' : 'offline'} onDark compact />
          <LanguagePill code={language} onClick={() => navigate('/language')} />
          <button
            type="button"
            role="switch"
            aria-checked={easyMode}
            aria-label={t('navEasy')}
            title={t('navEasy')}
            onClick={() => setEasyMode(!easyMode)}
            className={`flex h-tap w-tap items-center justify-center rounded-full transition-colors duration-150 ease-out ${
              easyMode ? 'bg-saffron text-ink' : 'text-white hover:bg-brand-dark active:bg-brand-dark'
            }`}
          >
            <ALargeSmallIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <Link
            to="/settings"
            aria-label={t('settings')}
            className="flex h-tap w-tap items-center justify-center rounded-full text-white transition-colors duration-150 ease-out hover:bg-brand-dark active:bg-brand-dark"
          >
            <SettingsIcon className="h-6 w-6" aria-hidden="true" />
          </Link>
        </div>
      </div>
      {helperMode && (
        <div className="bg-saffron px-4 py-2 text-center text-small font-semibold text-ink md:hidden">
          <HandHelpingIcon className="mr-2 inline h-5 w-5 align-text-bottom" aria-hidden="true" />
          {t('helperMode')}
        </div>
      )}
    </header>
  );
}