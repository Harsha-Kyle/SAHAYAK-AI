import type { LucideIcon } from 'lucide-react';

export type LangCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'kn' | 'ml' | 'bn';
export type Localized = {en: string;} & Partial<Record<LangCode, string>>;
export type ModuleId = 'schemes' | 'cooperative' | 'finance' | 'grievance' | 'law';
export type FactKind = 'who' | 'benefit' | 'documents' | 'apply';
export type Confidence = 'verified' | 'partial';

export interface Language {
  code: LangCode;
  nativeName: string;
  englishName: string;
  speechCode: string;
  greeting: string;
  listening: string;
  understanding: string;
}

export interface ModuleDef {
  id: ModuleId;
  icon: LucideIcon;
  label: Localized;
  hint: Localized;
  availableOffline: boolean;
}

export interface Fact {
  kind: FactKind;
  value: Localized;
}

export interface Source {
  document: string;
  section: string;
  lastVerified: string;
}

export interface Answer {
  id: string;
  module: ModuleId;
  short: string;
  question: Localized;
  title: Localized;
  summary: Localized;
  facts: Fact[];
  confidence: Confidence;
  confidenceNote?: Localized;
  source: Source;
  deadline?: {label: Localized;date: string;};
  cachedOffline: boolean;
  cachedOn?: string;
  followUp?: {question: Localized;targetId: string;};
}

export interface Refusal {
  id: string;
  module: ModuleId;
  question: Localized;
  title: Localized;
  reason: Localized;
}

export type HistoryKind = 'answer' | 'grievance' | 'status';

export interface HistoryItem {
  id: string;
  kind: HistoryKind;
  module: ModuleId;
  title: Localized;
  short: string;
  detail?: string;
  date: string;
  to: string;
}

export interface GrievanceDraft {
  about: string | null;
  problemId: string | null;
  claimNumber: string;
  documents: DocumentId[];
  problemText: string;
  requestedAction: string;
}

export interface GrievanceProblem {
  id: string;
  icon: LucideIcon;
  label: Localized;
  scheme: string;
  relatedAnswers: string[];
  needsPolicy: boolean;
  description: string;
  requestedAction: string;
}

export type DocumentId = 'passbook' | 'policy' | 'aadhaar';

export interface RequiredDocument {
  id: DocumentId;
  icon: LucideIcon;
  label: Localized;
}

export interface OcrField {
  label: string;
  value: string;
}

export interface StatusStage {
  label: string;
  date?: string;
  note?: string;
}

export interface StatusRecord {
  id: string;
  title: string;
  scheme: string;
  module: ModuleId;
  stages: StatusStage[];
  current: number;
  lastUpdated: string;
  listed: boolean;
}

export interface Office {
  id: string;
  name: string;
  type: string;
  distance: string;
  address: string;
  phone: string;
  dial: string;
  hours: string;
  openNow: boolean;
  mapsQuery: string;
}

export interface Helpline {
  id: string;
  name: string;
  number: string;
  dial: string;
  hours: string;
  note: string;
}

export interface OfflinePack {
  id: string;
  name: string;
  sizeMb: number;
  updated: string;
  downloaded: boolean;
}

export interface SessionQuery {
  id: string;
  question: string;
  answerTitle?: string;
  module: ModuleId;
  timestamp: string;
}

export interface PersonSession {
  id: string;
  sessionNumber: number;
  userLabel: string; // e.g. "Kiosk User #104" or "Farmer / Visitor"
  date: string;
  language: LangCode;
  queriesCount: number;
  queries: SessionQuery[];
}