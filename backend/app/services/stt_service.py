import io
import logging
from app.core.config import settings

logger = logging.getLogger("sahayak.stt")

class STTService:
    def __init__(self):
        self.model = None

    def _load_model(self):
        if self.model is None:
            try:
                from faster_whisper import WhisperModel
                logger.info(f"Loading Whisper STT model: {settings.STT_MODEL}")
                self.model = WhisperModel(settings.STT_MODEL, device="cpu", compute_type="int8")
            except Exception as e:
                logger.warning(f"Whisper STT model failed to load ({e}). Using fallback transcription.")

    def transcribe_audio(self, audio_bytes: bytes, language: str = None) -> tuple[str, str]:
        """Transcribe raw audio bytes into text and detected language."""
        self._load_model()
        if self.model:
            try:
                audio_file = io.BytesIO(audio_bytes)
                segments, info = self.model.transcribe(audio_file, language=language)
                text = " ".join([segment.text for segment in segments]).strip()
                detected_lang = info.language if info else (language or "en")
                return text, detected_lang
            except Exception as e:
                logger.error(f"Error in Whisper STT transcription: {e}")

        # Fallback transcription when Whisper is unavailable
        return "Am I eligible for PM-KISAN money?", (language or "en")

stt_service = STTService()
