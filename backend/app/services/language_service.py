from typing import Tuple

SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "mr": "Marathi",
    "bn": "Bengali",
    "gu": "Gujarati",
    "pa": "Punjabi",
    "or": "Odia"
}

class LanguageService:
    @staticmethod
    def detect_language(text: str) -> str:
        """Detect language code based on unicode scripts or return en."""
        if not text:
            return "en"
        
        # Check Tamil script range (0B80–0BFF)
        if any('\u0b80' <= char <= '\u0bff' for char in text):
            return "ta"
        # Check Devanagari script range (0900–097F) for Hindi/Marathi
        if any('\u0900' <= char <= '\u097f' for char in text):
            return "hi"
        # Check Telugu script range (0C00–0C7F)
        if any('\u0c00' <= char <= '\u0c7f' for char in text):
            return "te"
        # Check Kannada script range (0C80–0CFF)
        if any('\u0c80' <= char <= '\u0cff' for char in text):
            return "kn"
        # Check Malayalam script range (0D00–0D7F)
        if any('\u0d00' <= char <= '\u0d7f' for char in text):
            return "ml"
        # Check Bengali script range (0980–09FF)
        if any('\u0980' <= char <= '\u09ff' for char in text):
            return "bn"

        return "en"

language_service = LanguageService()
