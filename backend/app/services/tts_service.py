import io
import logging
import asyncio
from app.core.config import settings

logger = logging.getLogger("sahayak.tts")

# Voice map for edge-tts Neural Indian voices
EDGE_VOICE_MAP = {
    "en": "en-IN-NeerjaNeural",
    "hi": "hi-IN-SwaraNeural",
    "ta": "ta-IN-PallaviNeural",
    "te": "te-IN-MohanNeural",
    "kn": "kn-IN-GaganNeural",
    "mr": "mr-IN-AarohiNeural",
    "bn": "bn-IN-TanishaaNeural",
    "gu": "gu-IN-DhwaniNeural",
    "ml": "ml-IN-SobhanaNeural",
    "pa": "pa-IN-GurpreetNeural",
    "or": "or-IN-SubhasiniNeural"
}

class TTSService:
    async def synthesize_speech_async(self, text: str, lang: str = "en") -> bytes:
        """Synthesize high quality speech using edge-tts (Microsoft Neural voices)."""
        voice = EDGE_VOICE_MAP.get(lang.lower(), "hi-IN-SwaraNeural" if lang == "hi" else "en-IN-NeerjaNeural")
        try:
            import edge_tts
            communicate = edge_tts.Communicate(text, voice)
            fp = io.BytesIO()
            async for chunk in communicate.stream():
                if chunk["type"] == "data":
                    fp.write(chunk["data"])
            fp.seek(0)
            return fp.read()
        except Exception as e:
            logger.warning(f"edge-tts failed ({e}), falling back to gTTS.")
            return self.synthesize_speech(text, lang)

    def synthesize_speech(self, text: str, lang: str = "en") -> bytes:
        """Fallback synchronous TTS using gTTS."""
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

