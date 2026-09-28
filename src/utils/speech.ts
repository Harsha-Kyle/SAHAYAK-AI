import { factLabels } from '../data/factLabels';
import { Answer, LangCode } from '../types/app';
import { localize } from './localize';

export function answerToSpeech(answer: Answer, lang: LangCode): string {
  const parts = [localize(answer.title, lang), localize(answer.summary, lang)];
  answer.facts.forEach((fact) => {
    parts.push(`${localize(factLabels[fact.kind], lang)}: ${localize(fact.value, lang).replace(/\n/g, ', ')}`);
  });
  return parts.join('. ');
}