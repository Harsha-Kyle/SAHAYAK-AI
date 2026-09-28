import io
import logging
from app.core.config import settings

logger = logging.getLogger("sahayak.tts")

class TTSService:
    def synthesize_speech(self, text: str, lang: str = "en") -> bytes:
        """Convert text into audio bytes using gTTS or fallback audio generator."""
        try:
            from gtts import gTTS
            tts_lang = lang if lang in ["en", "hi", "ta", "te", "kn", "ml", "mr", "bn", "gu"] else "en"
            tts = gTTS(text=text, lang=tts_lang, slow=False)
            fp = io.BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)
            return fp.read()
        except Exception as e:
            logger.warning(f"gTTS audio synthesis notice ({e}). Returning fallback audio buffer.")
            return b"RIFF....WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x80>\x00\x00\x00}\x00\x00\x02\x00\x10\x00data\x00\x00\x00\x00"

tts_service = TTSService()
