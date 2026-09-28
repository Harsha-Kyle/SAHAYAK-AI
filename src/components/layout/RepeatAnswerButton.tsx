import React from 'react';
import { RotateCcwIcon, SquareIcon } from 'lucide-react';
import { useApp, useT } from '../../contexts/AppContext';
import { useSpeech } from '../../hooks/useSpeech';
import { getAnswer } from '../../utils/lookup';
import { answerToSpeech } from '../../utils/speech';

/** Easy Mode only: one tap replays the most recent answer. */
export function RepeatAnswerButton() {
  const { easyMode, lastAnswerId, language } = useApp();
  const t = useT();
  const { speaking, toggle } = useSpeech();
  const answer = getAnswer(lastAnswerId);

  if (!easyMode || !answer) return null;

  return (
    <button
      type="button"
      onClick={() => toggle(answerToSpeech(answer, language))}
      aria-pressed={speaking}
      className="fixed bottom-[5.5rem] right-4 z-30 flex min-h-tap items-center gap-2 whitespace-nowrap rounded-full border-2 border-ink bg-saffron px-5 text-body font-semibold text-ink shadow-raised transition-[transform,background-color] duration-150 ease-out active:scale-95 active:bg-saffron-dark">
      
      {speaking ?
      <SquareIcon className="h-5 w-5 fill-current" aria-hidden="true" /> :

      <RotateCcwIcon className="h-5 w-5" aria-hidden="true" />
      }
      {speaking ? t('stop') : t('repeatAnswer')}
    </button>);

}