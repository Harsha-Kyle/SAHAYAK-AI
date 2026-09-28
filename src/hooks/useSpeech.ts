import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { LangCode } from '../types/app';
import { getLanguage } from '../utils/lookup';

/** Text-to-speech with a graceful simulated fallback. Easy Mode speaks slower. */
export function useSpeech() {
  const { language, easyMode } = useApp();
  const [speaking, setSpeaking] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    window.clearTimeout(timer.current);
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, lang?: LangCode) => {
      stop();
      setSpeaking(true);
      const code = getLanguage(lang ?? language).speechCode;
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = code;
        utterance.rate = easyMode ? 0.75 : 0.95;
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
      // Safety net in case the browser has no voice for this language.
      timer.current = window.setTimeout(() => setSpeaking(false), Math.min(30000, 2500 + text.length * 70));
    },
    [easyMode, language, stop]
  );

  const toggle = useCallback(
    (text: string, lang?: LangCode) => {
      if (speaking) stop();else
      speak(text, lang);
    },
    [speak, speaking, stop]
  );

  useEffect(() => stop, [stop]);

  return { speaking, speak, stop, toggle };
}