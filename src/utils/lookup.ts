import { answers } from '../data/answers';
import { languages } from '../data/languages';
import { modules } from '../data/modules';
import { refusals } from '../data/refusals';
import { Answer, LangCode, Language, Localized, ModuleDef, ModuleId, Refusal } from '../types/app';

export interface Intent {
  id: string;
  kind: 'answer' | 'refusal';
  module: ModuleId;
  title: Localized;
  question: Localized;
}

export function getAnswer(id?: string | null): Answer | undefined {
  return answers.find((a) => a.id === id);
}

export function getRefusal(id?: string | null): Refusal | undefined {
  return refusals.find((r) => r.id === id);
}

export function getModule(id?: string | null): ModuleDef | undefined {
  return modules.find((m) => m.id === id);
}

export function getLanguage(code: LangCode): Language {
  return languages.find((l) => l.code === code) ?? languages[0];
}

export function getIntent(id?: string | null): Intent | undefined {
  const answer = getAnswer(id);
  if (answer) {
    return { id: answer.id, kind: 'answer', module: answer.module, title: answer.title, question: answer.question };
  }
  const refusal = getRefusal(id);
  if (refusal) {
    return { id: refusal.id, kind: 'refusal', module: refusal.module, title: refusal.title, question: refusal.question };
  }
  return undefined;
}

export function routeForIntent(intent: Intent, ctx?: string | null): string {
  const base = intent.kind === 'answer' ? `/answer/${intent.id}` : `/refusal/${intent.id}`;
  return ctx ? `${base}?ctx=${ctx}` : base;
}