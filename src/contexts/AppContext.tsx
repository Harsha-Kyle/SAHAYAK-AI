import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { initialHistory, initialPersonSessions } from '../data/history';
import { strings, StringKey } from '../data/strings';
import { voiceDemoTopics } from '../data/trending';
import { GrievanceDraft, HistoryItem, LangCode, Localized, ModuleId, PersonSession, SessionQuery } from '../types/app';
import { localize } from '../utils/localize';

type ReminderChannel = 'sms' | 'call';

const emptyGrievance: GrievanceDraft = {
  about: null,
  problemId: null,
  claimNumber: '',
  documents: [],
  problemText: '',
  requestedAction: ''
};

const initialTopicCounts: Record<ModuleId, number> = {
  schemes: 6224,
  cooperative: 3853,
  finance: 2668,
  grievance: 1334,
  law: 741
};

interface AppContextValue {
  language: LangCode;
  setLanguage: (code: LangCode) => void;
  easyMode: boolean;
  setEasyMode: (value: boolean) => void;
  easyModeDefault: boolean;
  setEasyModeDefault: (value: boolean) => void;
  helperMode: boolean;
  setHelperMode: (value: boolean) => void;
  kiosk: boolean;
  setKiosk: (value: boolean) => void;
  online: boolean;
  onboarded: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  personSessions: PersonSession[];
  currentSession: PersonSession;
  recordQueryInSession: (query: { question: string; answerTitle?: string; module: ModuleId }) => void;
  closeSessionAndStartNew: () => void;
  topicQueryCounts: Record<ModuleId, number>;
  incrementTopicQuery: (module: ModuleId) => void;
  usedLanguages: LangCode[];
  usedLanguagesCount: number;
  lastAnswerId: string | null;
  setLastAnswerId: (id: string | null) => void;
  reminders: Record<string, ReminderChannel>;
  setReminder: (id: string, channel: ReminderChannel | null) => void;
  grievance: GrievanceDraft;
  updateGrievance: (patch: Partial<GrievanceDraft>) => void;
  resetGrievance: (about?: string | null) => void;
  takeDemoTopic: () => string;
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  initialKiosk: boolean;
  forcedOffline: boolean;
  skipOnboarding: boolean;
  children: React.ReactNode;
}

export function AppProvider({ initialKiosk, forcedOffline, skipOnboarding, children }: AppProviderProps) {
  const [language, setLanguageState] = useState<LangCode>('en');
  const [easyMode, setEasyMode] = useState(false);
  const [easyModeDefault, setEasyModeDefault] = useState(false);
  const [helperMode, setHelperMode] = useState(false);
  const [kiosk, setKiosk] = useState(initialKiosk);
  const [networkOnline, setNetworkOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [onboarded, setOnboarded] = useState(skipOnboarding);
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);
  const [lastAnswerId, setLastAnswerId] = useState<string | null>(null);
  const [reminders, setReminders] = useState<Record<string, ReminderChannel>>({});
  const [grievance, setGrievance] = useState<GrievanceDraft>(emptyGrievance);
  const demoIndex = useRef(0);

  // Topic Query Counts state (live updating)
  const [topicQueryCounts, setTopicQueryCounts] = useState<Record<ModuleId, number>>(initialTopicCounts);

  // Used Languages state (different languages used in queries)
  const [usedLanguages, setUsedLanguages] = useState<LangCode[]>(['en', 'hi', 'ta', 'te']);

  // Person Sessions History
  const [personSessions, setPersonSessions] = useState<PersonSession[]>(initialPersonSessions);
  const sessionCounterRef = useRef(105);

  // Current active person session
  const [currentSession, setCurrentSession] = useState<PersonSession>(() => ({
    id: `sess-${sessionCounterRef.current}`,
    sessionNumber: sessionCounterRef.current,
    userLabel: `Farmer / Visitor #${sessionCounterRef.current}`,
    date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
    language: 'en',
    queriesCount: 0,
    queries: []
  }));

  const setLanguage = useCallback((code: LangCode) => {
    setLanguageState(code);
    setUsedLanguages((prev) => (prev.includes(code) ? prev : [...prev, code]));
  }, []);

  const incrementTopicQuery = useCallback((module: ModuleId) => {
    setTopicQueryCounts((prev) => ({
      ...prev,
      [module]: (prev[module] || 0) + 1
    }));
  }, []);

  const recordQueryInSession = useCallback((query: { question: string; answerTitle?: string; module: ModuleId }) => {
    // Increment topic query counter
    incrementTopicQuery(query.module);

    const newQueryItem: SessionQuery = {
      id: `q-${Date.now()}`,
      question: query.question,
      answerTitle: query.answerTitle,
      module: query.module,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCurrentSession((prev) => {
      const updatedQueries = [...prev.queries, newQueryItem];
      return {
        ...prev,
        queriesCount: updatedQueries.length,
        queries: updatedQueries
      };
    });
  }, [incrementTopicQuery]);

  const closeSessionAndStartNew = useCallback(() => {
    setCurrentSession((prevSession) => {
      // Save completed session to sessions history if it has queries
      if (prevSession.queries.length > 0) {
        setPersonSessions((prevList) => [prevSession, ...prevList]);
      }
      // Create fresh session for next user
      sessionCounterRef.current += 1;
      return {
        id: `sess-${sessionCounterRef.current}`,
        sessionNumber: sessionCounterRef.current,
        userLabel: `Farmer / Visitor #${sessionCounterRef.current}`,
        date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        language: 'en',
        queriesCount: 0,
        queries: []
      };
    });
  }, []);

  useEffect(() => setKiosk(initialKiosk), [initialKiosk]);
  useEffect(() => setOnboarded(skipOnboarding), [skipOnboarding]);

  useEffect(() => {
    const on = () => setNetworkOnline(true);
    const off = () => setNetworkOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.easy = String(easyMode);
    document.documentElement.dataset.kiosk = String(kiosk);
    document.documentElement.lang = language;
  }, [easyMode, kiosk, language]);

  const addHistory = useCallback((item: HistoryItem) => {
    setHistory((prev) => [item, ...prev.filter((h) => h.to !== item.to)]);
  }, []);

  const setReminder = useCallback((id: string, channel: ReminderChannel | null) => {
    setReminders((prev) => {
      const next = { ...prev };
      if (channel) next[id] = channel;
      else delete next[id];
      return next;
    });
  }, []);

  const updateGrievance = useCallback((patch: Partial<GrievanceDraft>) => {
    setGrievance((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetGrievance = useCallback((about: string | null = null) => {
    setGrievance({ ...emptyGrievance, about });
  }, []);

  const takeDemoTopic = useCallback(() => {
    const topic = voiceDemoTopics[demoIndex.current % voiceDemoTopics.length];
    demoIndex.current += 1;
    return topic;
  }, []);

  const handleEasyDefault = useCallback((value: boolean) => {
    setEasyModeDefault(value);
    if (value) setEasyMode(true);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      language,
      setLanguage,
      easyMode,
      setEasyMode,
      easyModeDefault,
      setEasyModeDefault: handleEasyDefault,
      helperMode,
      setHelperMode,
      kiosk,
      setKiosk,
      online: networkOnline && !forcedOffline,
      onboarded,
      completeOnboarding: () => setOnboarded(true),
      resetOnboarding: () => setOnboarded(false),
      history,
      addHistory,
      clearHistory: () => {
        setHistory([]);
        setPersonSessions([]);
      },
      personSessions,
      currentSession,
      recordQueryInSession,
      closeSessionAndStartNew,
      topicQueryCounts,
      incrementTopicQuery,
      usedLanguages,
      usedLanguagesCount: usedLanguages.length,
      lastAnswerId,
      setLastAnswerId,
      reminders,
      setReminder,
      grievance,
      updateGrievance,
      resetGrievance,
      takeDemoTopic
    }),
    [
      language,
      setLanguage,
      easyMode,
      easyModeDefault,
      handleEasyDefault,
      helperMode,
      kiosk,
      networkOnline,
      forcedOffline,
      onboarded,
      history,
      addHistory,
      personSessions,
      currentSession,
      recordQueryInSession,
      closeSessionAndStartNew,
      topicQueryCounts,
      incrementTopicQuery,
      usedLanguages,
      lastAnswerId,
      reminders,
      setReminder,
      grievance,
      updateGrievance,
      resetGrievance,
      takeDemoTopic
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export function useT() {
  const { language } = useApp();
  return useCallback((key: StringKey) => strings[language]?.[key] ?? strings.en[key], [language]);
}

export function useL() {
  const { language } = useApp();
  return useCallback((value: Localized) => localize(value, language), [language]);
}