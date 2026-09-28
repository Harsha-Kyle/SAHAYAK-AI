import { LangCode, Localized } from '../types/app';

export function localize(value: Localized, lang: LangCode): string {
  return value[lang] ?? value.en;
}