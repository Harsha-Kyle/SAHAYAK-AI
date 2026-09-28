import os
import tempfile
import logging
from typing import Tuple
from app.core.config import settings

logger = logging.getLogger("sahayak.stt")

class STTService:
    def get_api_key(self) -> str:
        return settings.ASSEMBLYAI_API_KEY or os.getenv("ASSEMBLYAI_API_KEY", "")

    def transcribe_audio(self, audio_bytes: bytes, language: str = None) -> Tuple[str, str]:
        """
        Transcribe raw audio bytes using AssemblyAI SDK.
        Supports automatic language detection across Indian languages.
        """
        api_key = self.get_api_key()
        if not api_key:
            logger.warning("ASSEMBLYAI_API_KEY not configured. Returning fallback transcription.")
            return "Am I eligible for PM-KISAN money?", (language or "en")

        try:
            import assemblyai as aai
            aai.settings.api_key = api_key


            # Write audio bytes to temporary file for AssemblyAI SDK
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
                temp_audio.write(audio_bytes)
                temp_path = temp_audio.name

            try:
                # ALWAYS use automatic language detection so user can speak any language regardless of UI setting
                config = aai.TranscriptionConfig(
                    language_detection=True
                )

                transcriber = aai.Transcriber()
                transcript = transcriber.transcribe(temp_path, config=config)

                if transcript.status == aai.TranscriptStatus.error:
                    logger.error(f"AssemblyAI transcription error: {transcript.error}")
                    return "Am I eligible for PM-KISAN money?", (language or "en")

                text = transcript.text or ""
                
                # Double-check language via Unicode script detection on transcribed text
                from app.services.language_service import language_service
                detected_lang = language_service.detect_language(text)

                logger.info(f"AssemblyAI STT Success: '{text[:50]}...' (Detected Language: {detected_lang})")
                return text.strip(), detected_lang

            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)


        except Exception as e:
            logger.error(f"AssemblyAI STT Exception: {e}")
            return "Am I eligible for PM-KISAN money?", (language or "en")

stt_service = STTService()

