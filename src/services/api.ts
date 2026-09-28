/**
 * SAHAYAK AI — API Service Layer (Phase 5)
 * Centralises all HTTP calls to the FastAPI backend.
 * Change BACKEND_URL here if the server runs on a different host/port.
 */

export const BACKEND_URL = 'http://localhost:8000';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatSource {
  title: string;
  page?: number;
  section?: string;
  authority?: string;
  source_url?: string | null;
}

export interface ChatApiResponse {
  answer: string;
  language: string;
  sources: ChatSource[];
  confidence: number;
  session_id: string;
}

export interface ChatApiRequest {
  message: string;
  language?: string;
  session_id?: string;
}

// ─── Chat Endpoint ────────────────────────────────────────────────────────────

/**
 * POST /api/chat
 * Sends a text query to the backend RAG + Gemini pipeline.
 * Returns the AI answer, detected language, sources and confidence score.
 */
export async function sendChatMessage(
  request: ChatApiRequest,
  signal?: AbortSignal
): Promise<ChatApiResponse> {
  const res = await fetch(`${BACKEND_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`Chat API error ${res.status}: ${detail}`);
  }

  return res.json();
}

export interface VoiceApiResponse {
  query: string;
  answer: string;
  language: string;
  sources: ChatSource[];
  confidence: number;
  has_audio: boolean;
}

/**
 * POST /api/voice
 * Sends recorded audio blob (WAV/WebM) to AssemblyAI STT → RAG → Gemini → TTS pipeline.
 */
export async function sendVoiceQuery(
  audioBlob: Blob,
  language = 'en'
): Promise<VoiceApiResponse> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'speech.wav');
  formData.append('language', language);

  const res = await fetch(`${BACKEND_URL}/api/voice`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`Voice API error ${res.status}: ${detail}`);
  }

  return res.json();
}

/**
 * POST /api/transcribe
 * Sends audio blob to AssemblyAI STT and returns transcribed text + language.
 */
export async function transcribeAudio(
  audioBlob: Blob,
  language?: string
): Promise<{ text: string; language: string }> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'speech.wav');
  if (language) formData.append('language', language);

  const res = await fetch(`${BACKEND_URL}/api/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`Transcribe API error ${res.status}`);
  return res.json();
}

// ─── Health Check ─────────────────────────────────────────────────────────────

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── TTS Synthesize ───────────────────────────────────────────────────────────

/**
 * POST /api/synthesize
 * Converts an answer text to speech audio bytes using edge-tts.
 * Returns an object URL that can be set on an <audio> element.
 */
export async function synthesizeSpeech(text: string, language = 'en'): Promise<string> {
  const body = new FormData();
  body.append('text', text);
  body.append('language', language);

  const res = await fetch(`${BACKEND_URL}/api/synthesize`, {
    method: 'POST',
    body,
  });

  if (!res.ok) throw new Error(`TTS API error ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

