"""
PHASE 2 — TEXT CLEANER IMPLEMENTATION
Developer A (Friend) Task: Clean text, strip header/footer noise, normalize whitespace,
while preserving numbers, currency, and section structure.
"""

import re
import unicodedata
import logging

logger = logging.getLogger("sahayak.rag.ingestion.cleaner")

class BaseTextCleaner:
    def clean_text(self, text: str) -> str:
        """
        Remove headers, footers, whitespace noise, and bad characters.
        """
        raise NotImplementedError("Developer A: Implement clean_text in Phase 2.")

class TextCleaner(BaseTextCleaner):
    def __init__(self):
        # Patterns for repetitive headers, footers, and page counters
        self.page_number_pattern = re.compile(r"^\s*(?:Page|p\.|pg\.)\s*\d+(?:\s*(?:of|/)\s*\d+)?\s*$", re.IGNORECASE | re.MULTILINE)
        self.date_footer_pattern = re.compile(r"^\s*(?:Printed on|Generated on|Dated)\s*:?.*$", re.IGNORECASE | re.MULTILINE)
        self.url_line_pattern = re.compile(r"^\s*https?://\S+\s*$", re.MULTILINE)

    def clean_text(self, text: str) -> str:
        """
        Clean and normalize raw extracted document text:
        1. Remove control characters (except newline, tab).
        2. Strip recurring header/footer artifacts.
        3. Normalize Unicode (preserve Devanagari, Tamil, etc.).
        4. Normalize whitespace while preserving paragraphs and section markers.
        """
        if not text:
            return ""

        # Step 1: Normalize Unicode (NFC form)
        cleaned = unicodedata.normalize("NFC", text)

        # Step 2: Remove non-printable control characters (keep \n, \t, \r)
        cleaned = "".join(ch for ch in cleaned if ch in {"\n", "\t", "\r"} or unicodedata.category(ch)[0] != "C")

        # Step 3: Remove standalone page number lines (e.g., "Page 12 of 45" or "12")
        cleaned = self.page_number_pattern.sub("", cleaned)
        cleaned = self.date_footer_pattern.sub("", cleaned)

        # Step 4: Fix broken hyphenated linebreaks (e.g. "gov- \n ernment" -> "government")
        cleaned = re.sub(r"(\b\w+)-\s*\n\s*(\w+\b)", r"\1\2", cleaned)

        # Step 5: Normalize horizontal whitespace (tabs and multiple spaces -> single space)
        lines = []
        for line in cleaned.splitlines():
            line_stripped = re.sub(r"[ \t]+", " ", line).strip()
            # Retain page delimiter markers
            if line_stripped.startswith("--- Page"):
                lines.append(line_stripped)
                continue
            # Filter trivial noise lines (e.g., solitary dashes, dots)
            if re.match(r"^[-=_.*~]{3,}$", line_stripped):
                continue
            lines.append(line_stripped)

        # Step 6: Collapse 3+ newlines into 2 (preserving paragraph breaks)
        cleaned_text = "\n".join(lines)
        cleaned_text = re.sub(r"\n{3,}", "\n\n", cleaned_text)

        return cleaned_text.strip()

text_cleaner = TextCleaner()
