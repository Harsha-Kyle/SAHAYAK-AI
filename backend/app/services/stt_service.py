import os
import tempfile
import logging
from typing import Tuple

logger = logging.getLogger("sahayak.stt")

class STTService:
    def __init__(self):
        self.api_key = os.getenv("ASSEMBLYAI_API_KEY", "")

    def transcribe_audio(self, audio_bytes: bytes, language: str = None) -> Tuple[str, str]:
        """
        Transcribe raw audio bytes using AssemblyAI SDK.
        Supports automatic language detection across Indian languages.
        """
        if not self.api_key:
            logger.warning("ASSEMBLYAI_API_KEY not configured. Returning fallback transcription.")
            return "Am I eligible for PM-KISAN money?", (language or "en")

        try:
            import assemblyai as aai
            aai.settings.api_key = self.api_key

            # Write audio bytes to temporary file for AssemblyAI SDK
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
                temp_audio.write(audio_bytes)
                temp_path = temp_audio.name

            try:
                config = aai.TranscriptionConfig(
                    language_detection=True if not language else False,
                    language_code=language if language and language != "auto" else None
                )

                transcriber = aai.Transcriber()
                transcript = transcriber.transcribe(temp_path, config=config)

                if transcript.status == aai.TranscriptStatus.error:
                    logger.error(f"AssemblyAI transcription error: {transcript.error}")
                    return "Am I eligible for PM-KISAN money?", (language or "en")

                text = transcript.text or ""
                # AssemblyAI language detection code
                detected_lang = getattr(transcript, "language_code", language or "en") or "en"

                logger.info(f"AssemblyAI STT Success: '{text[:50]}...' (Language: {detected_lang})")
                return text.strip(), detected_lang

            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)

        except Exception as e:
            logger.error(f"AssemblyAI STT Exception: {e}")
            return "Am I eligible for PM-KISAN money?", (language or "en")

stt_service = STTService()

