import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon, Volume2Icon } from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
import { SoundBars } from '../components/ui/SoundBars';
import { useApp, useT } from '../contexts/AppContext';
import { languages } from '../data/languages';
import { useGoBack } from '../hooks/useGoBack';
import { LangCode } from '../types/app';
import { getLanguage } from '../utils/lookup';
import { useSpeech } from '../hooks/useSpeech';

export function LanguageSelect() {
  const [params] = useSearchParams();
  const first = params.get('first') === '1';
  const navigate = useNavigate();
  const goBack = useGoBack();
  const { language, setLanguage, completeOnboarding, easyMode } = useApp();
  const t = useT();
  const { speak, speaking } = useSpeech();
  const [selected, setSelected] = useState<LangCode>(language);
  const [hearing, setHearing] = useState<LangCode | null>(null);

  const hear = (code: LangCode) => {
    const lang = getLanguage(code);
    setHearing(code);
    speak(lang.nativeName, code);
  };

  const confirm = () => {
    setLanguage(selected);
    if (first) {
      completeOnboarding();
      navigate('/', { replace: true });
    } else {
      goBack();
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-surface">
      <header className="bg-brand text-white">
        <div className="page-container flex min-h-tap-lg items-center gap-3 py-2">
          {!first &&
          <button
            type="button"
            onClick={goBack}
            aria-label={t('back')}
            className="flex h-tap w-tap items-center justify-center rounded-full transition-colors duration-150 ease-out hover:bg-brand-dark">
            
              <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          }
          <Logo onDark />
        </div>
      </header>

      <main className="page-container flex-1 pb-40 pt-8">
        <h1 className="text-display text-ink">{t('chooseLanguage')}</h1>
        <p className="mt-2 text-body text-muted">Tap the speaker to hear each language. भाषा सुनने के लिए स्पीकर दबाएँ।</p>

        <ul className={`mt-8 grid gap-4 ${easyMode ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
          {languages.map((lang) => {
            const isSelected = selected === lang.code;
            const isHearing = speaking && hearing === lang.code;
            return (
              <li key={lang.code} className="relative">
                <button
                  type="button"
                  onClick={() => setSelected(lang.code)}
                  aria-pressed={isSelected}
                  aria-label={`${lang.englishName} — ${lang.nativeName}`}
                  className={`flex min-h-[8.5rem] w-full flex-col items-start justify-end rounded-card border-2 p-5 text-left transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.98] ${
                  isSelected ? 'border-brand bg-brand-tint' : 'border-line bg-paper hover:border-navy'}`
                  }>
                  
                  {isSelected &&
                  <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
                      <CheckIcon className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
                    </span>
                  }
                  <span lang={lang.code} className="text-title text-ink">
                    {lang.nativeName}
                  </span>
                  <span className={`text-small ${isSelected ? 'text-brand-dark' : 'text-muted'}`}>{lang.englishName}</span>
                </button>
                <button
                  type="button"
                  onClick={() => hear(lang.code)}
                  aria-label={`Hear ${lang.englishName}`}
                  className="absolute right-3 top-3 flex h-tap w-tap items-center justify-center rounded-full bg-paper text-navy shadow-card transition-[transform,background-color] duration-150 ease-out hover:bg-navy-tint active:scale-95">
                  
                  {isHearing ? <SoundBars /> : <Volume2Icon className="h-6 w-6" aria-hidden="true" />}
                </button>
              </li>);

          })}
        </ul>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-paper py-4">
        <div className="page-container">
          <Button variant="primary" size="lg" fullWidth onClick={confirm}>
            {t('continue')} · <span lang={selected}>{getLanguage(selected).nativeName}</span>
          </Button>
        </div>
      </div>
    </div>);

}