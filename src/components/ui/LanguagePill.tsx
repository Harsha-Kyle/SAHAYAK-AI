import React from 'react';
import { CheckIcon, LanguagesIcon } from 'lucide-react';
import { LangCode } from '../../types/app';
import { getLanguage } from '../../utils/lookup';

interface LanguagePillProps {
  code: LangCode;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export function LanguagePill({ code, onClick, selected = false, disabled = false }: LanguagePillProps) {
  const lang = getLanguage(code);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Language: ${lang.englishName}. Change language`}
      className={`inline-flex min-h-tap items-center gap-2 whitespace-nowrap rounded-full border-2 px-4 text-small font-semibold transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:border-line disabled:bg-surface disabled:text-muted ${
      selected ? 'border-brand bg-brand-tint text-brand-dark' : 'border-paper bg-paper text-ink hover:border-navy active:bg-navy-tint'}`
      }>
      
      {selected ?
      <CheckIcon className="h-5 w-5" aria-hidden="true" /> :

      <LanguagesIcon className="h-5 w-5 text-navy" aria-hidden="true" />
      }
      <span lang={code}>{lang.nativeName}</span>
    </button>);

}