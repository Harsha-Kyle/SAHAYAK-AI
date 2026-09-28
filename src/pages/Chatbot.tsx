import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AlertCircleIcon, BotIcon, CheckCircleIcon, ClockIcon, ExternalLinkIcon, LogOutIcon, MicIcon, SendIcon, SparklesIcon, SquareIcon, UserIcon } from 'lucide-react';
import { AnswerCard } from '../components/assistant/AnswerCard';
import { ListenButton } from '../components/assistant/ListenButton';
import { useApp, useL, useT } from '../contexts/AppContext';
import { answers } from '../data/answers';
import { useSpeech } from '../hooks/useSpeech';
import { sendChatMessage, ChatSource } from '../services/api';
import { Answer, ModuleId } from '../types/app';
import { getLanguage } from '../utils/lookup';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  answer?: Answer;
  // Real backend response fields
  apiAnswer?: string;
  apiSources?: ChatSource[];
  apiConfidence?: number;
  apiLanguage?: string;
  apiError?: boolean;
  timestamp: string;
}

const BAR_COUNT = 20;

export function Chatbot() {
  const [params] = useSearchParams();
  const autoListenParam = params.get('autoListen') === 'true';
  const initialModuleParam = (params.get('module') as ModuleId) || null;

  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { language, recordQueryInSession, closeSessionAndStartNew, currentSession } = useApp();
  const t = useT();
  const L = useL();
  const lang = getLanguage(language);
  const { speaking, toggle, stop } = useSpeech();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: lang.greeting + ` I am your Cooperative Sahayak assistant. (${currentSession.userLabel}). How can I help you today with PM-KISAN, Crop Insurance, PACS, or KCC loans?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [showIdleModal, setShowIdleModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isListening, isThinking]);

  // Handle autoListen when arriving from Home page mic button
  useEffect(() => {
    if (autoListenParam) {
      startListening();
    }
  }, [autoListenParam]);

  // Handle preset module parameter from Topic tiles click
  useEffect(() => {
    if (initialModuleParam) {
      const topicAnswer = answers.find((a) => a.module === initialModuleParam);
      if (topicAnswer) {
        handleUserSubmit(L(topicAnswer.question), initialModuleParam);
      }
    }
  }, [initialModuleParam]);

  // 5-minute Idle Activity Timer setup
  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    // 5 minutes = 300,000ms
    idleTimerRef.current = window.setTimeout(() => {
      setShowIdleModal(true);
    }, 300000);
  };

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [messages]);

  const startListening = () => {
    stop();
    setIsListening(true);
    resetIdleTimer();
    if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
    voiceTimerRef.current = window.setTimeout(() => {
      handleUserSubmit('Am I eligible for PM-KISAN money?', 'schemes');
      setIsListening(false);
    }, 3200);
  };

  const stopListening = () => {
    if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
    setIsListening(false);
  };

  const handleUserSubmit = async (queryText: string, forcedModule?: ModuleId) => {
    if (!queryText.trim()) return;

    stopListening();
    setInputQuery('');
    resetIdleTimer();

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    // Guess module for session tracking (best-effort, before API responds)
    const lower = queryText.toLowerCase();
    let guessedModule: ModuleId = 'schemes';
    if (lower.includes('kcc') || lower.includes('loan')) guessedModule = 'finance';
    else if (lower.includes('pacs') || lower.includes('cooperative') || lower.includes('member')) guessedModule = 'cooperative';
    else if (lower.includes('grievance') || lower.includes('complaint')) guessedModule = 'grievance';
    else if (lower.includes('law') || lower.includes('act') || lower.includes('rule')) guessedModule = 'law';
    if (forcedModule) guessedModule = forcedModule;

    try {
      // ── Real API Call ─────────────────────────────────────────────────────
      const result = await sendChatMessage({
        message: queryText,
        language: language,
        session_id: currentSession.id,
      });

      setIsThinking(false);

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        apiAnswer: result.answer,
        apiSources: result.sources,
        apiConfidence: result.confidence,
        apiLanguage: result.language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Record query in session & increment topic counter
      recordQueryInSession({
        question: queryText,
        answerTitle: result.answer.substring(0, 60),
        module: guessedModule,
      });

    } catch (err) {
      console.error('Backend API error:', err);
      setIsThinking(false);

      // Show error message in chat
      const errMsgId = `ai-err-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: errMsgId,
          sender: 'ai',
          apiError: true,
          apiAnswer: 'Sorry, I could not connect to the server. Please check the backend is running and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleEndSession = () => {
    stop();
    closeSessionAndStartNew();
    navigate('/', { replace: true });
  };

  const handleListenAnswer = (msgId: string, answer: Answer) => {
    if (speakingMessageId === msgId && speaking) {
      stop();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(msgId);
      const textToSpeak = `${L(answer.title)}. ${L(answer.summary)}`;
      toggle(textToSpeak, language);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-50">
      {/* Subheader with End Session & Test Idle buttons */}
      <div className="flex items-center justify-between border-b border-line bg-paper px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-ink">{currentSession.userLabel}</span>
          <span className="text-muted">({currentSession.queriesCount} queries asked)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowIdleModal(true)}
            className="flex items-center gap-1 rounded-full border border-line bg-slate-100 px-3 py-1 font-medium text-ink hover:bg-slate-200"
            title="Test 5-min idle pop-up prompt"
          >
            <ClockIcon className="h-3.5 w-3.5 text-navy" />
            Test Idle Prompt
          </button>

          <button
            type="button"
            onClick={handleEndSession}
            className="flex items-center gap-1 rounded-full bg-saffron px-3 py-1 font-bold text-ink hover:bg-saffron-dark transition-colors"
          >
            <LogOutIcon className="h-3.5 w-3.5" />
            End Session & Next User
          </button>
        </div>
      </div>

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6 pb-24">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
                  msg.sender === 'user' ? 'bg-brand-dark' : 'bg-brand'
                }`}
              >
                {msg.sender === 'user' ? <UserIcon className="h-5 w-5" /> : <BotIcon className="h-5 w-5" />}
              </div>

              {/* Message Bubble or Answer Card */}
              <div className={`max-w-[88%] sm:max-w-[80%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.text && (
                  <div
                    className={`inline-block rounded-2xl px-4 py-3 text-body shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-brand text-white rounded-tr-none'
                        : 'bg-paper text-ink border border-line rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                )}

                {msg.answer && (
                  <div className="mt-1 w-full">
                    <AnswerCard
                      answer={msg.answer}
                      listen={
                        <ListenButton
                          speaking={speakingMessageId === msg.id && speaking}
                          onToggle={() => handleListenAnswer(msg.id, msg.answer!)}
                          size="md"
                        />
                      }
                      headingTag="h2"
                    />
                  </div>
                )}

                {/* ── Real Backend (Gemini) Answer ─────────────────────── */}
                {msg.apiAnswer && (
                  <div className={`mt-1 rounded-2xl border shadow-sm px-4 py-3 text-body ${
                    msg.apiError
                      ? 'border-red-200 bg-red-50 text-red-700'
                      : 'border-line bg-paper text-ink rounded-tl-none'
                  }`}>
                    {/* Error / OK icon row */}
                    <div className="flex items-center gap-2 mb-2">
                      {msg.apiError
                        ? <AlertCircleIcon className="h-4 w-4 text-red-500 shrink-0" />
                        : <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                      }
                      {!msg.apiError && msg.apiConfidence !== undefined && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          msg.apiConfidence >= 0.8
                            ? 'bg-emerald-100 text-emerald-700'
                            : msg.apiConfidence >= 0.5
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {Math.round(msg.apiConfidence * 100)}% confident
                        </span>
                      )}
                    </div>

                    {/* Answer text */}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.apiAnswer}</p>

                    {/* Source citations */}
                    {!msg.apiError && msg.apiSources && msg.apiSources.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {msg.apiSources.map((src, i) => (
                          src.source_url && src.source_url !== '#' ? (
                            <a
                              key={i}
                              href={src.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand-tint px-2.5 py-0.5 text-[11px] font-semibold text-brand-dark hover:bg-brand/10 transition-colors"
                            >
                              <ExternalLinkIcon className="h-3 w-3" />
                              {src.title}{src.section ? ` — ${src.section}` : ''}
                            </a>
                          ) : (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700"
                            >
                              📜 {src.title}{src.section ? ` — ${src.section}` : ''}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                )}


                <span className="mt-1 block text-[11px] font-medium text-muted">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {/* Listening Inline State */}
          {isListening && (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-saffron text-ink">
                <MicIcon className="h-5 w-5 animate-pulse" />
              </div>
              <div className="rounded-2xl border-2 border-saffron bg-saffron-tint p-4 text-ink shadow-sm max-w-md w-full">
                <div className="flex items-center justify-between">
                  <span className="text-small font-bold text-ink flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-saffron animate-ping" />
                    Listening… Speak your question now
                  </span>
                  <button
                    type="button"
                    onClick={stopListening}
                    className="flex items-center gap-1 rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink border border-line hover:bg-slate-100"
                  >
                    <SquareIcon className="h-3 w-3 fill-current text-navy" /> Done
                  </button>
                </div>
                {/* Waveform */}
                <div aria-hidden="true" className="mt-3 flex h-10 items-center justify-center gap-1">
                  {Array.from({ length: BAR_COUNT }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="h-full w-1 origin-center rounded-full bg-brand"
                      animate={
                        reduce
                          ? { scaleY: 0.2 }
                          : { scaleY: [0.15, 0.4 + ((i * 29) % 60) / 100, 0.2] }
                      }
                      transition={{
                        duration: 0.7 + (i % 4) * 0.1,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Thinking / Generating Indicator */}
          {isThinking && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <SparklesIcon className="h-5 w-5 animate-spin" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-line bg-paper px-4 py-3 text-small text-muted shadow-sm">
                <span className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-2 font-medium text-ink">Searching official government guidelines…</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Persistent Bottom Chat Dock */}
      <div className="fixed inset-x-0 bottom-[68px] z-20 border-t border-line bg-paper p-3 shadow-lg">
        <div className="mx-auto max-w-3xl">
          {/* Quick topic suggestion pills */}
          <div className="mb-2 flex flex-nowrap overflow-x-auto gap-2 pb-1 text-xs">
            {[
              { label: 'PM-KISAN eligibility', module: 'schemes' as ModuleId },
              { label: 'Insure paddy crop', module: 'schemes' as ModuleId },
              { label: 'KCC loan process', module: 'finance' as ModuleId },
              { label: 'PACS membership', module: 'cooperative' as ModuleId },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleUserSubmit(chip.label, chip.module)}
                className="whitespace-nowrap rounded-full border border-line bg-slate-50 px-3 py-1 font-medium text-ink hover:bg-brand-tint hover:text-brand-dark transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserSubmit(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            {/* Mic button */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              title={isListening ? 'Stop listening' : 'Start mic listening'}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                isListening ? 'bg-saffron text-ink animate-bounce' : 'bg-brand text-white hover:bg-brand-dark'
              }`}
            >
              <MicIcon className="h-5 w-5" />
            </button>

            {/* Text input */}
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about PM-KISAN, crop insurance, PACS..."
              className="flex-1 rounded-2xl border border-line bg-slate-50 px-4 py-2.5 text-body text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-opacity disabled:opacity-40 hover:bg-brand-dark"
            >
              <SendIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* 5-Min Idle Prompt Modal */}
      <AnimatePresence>
        {showIdleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-card bg-paper p-6 shadow-xl border border-line text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-saffron-tint text-ink">
                <ClockIcon className="h-7 w-7 text-saffron" />
              </div>
              <h2 className="mt-4 text-title font-bold text-ink">{t('idleTitle')}</h2>
              <p className="mt-2 text-small text-muted">{t('idleBody')}</p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowIdleModal(false);
                    resetIdleTimer();
                  }}
                  className="w-full rounded-2xl bg-brand py-3 text-body font-bold text-white hover:bg-brand-dark transition-colors"
                >
                  {t('continueChatting')}
                </button>

                <button
                  type="button"
                  onClick={handleEndSession}
                  className="w-full rounded-2xl border-2 border-line bg-slate-100 py-3 text-body font-bold text-ink hover:bg-slate-200 transition-colors"
                >
                  {t('closeSession')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
