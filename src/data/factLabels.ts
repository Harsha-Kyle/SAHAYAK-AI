import { FactKind, Localized } from '../types/app';

export const factLabels: Record<FactKind, Localized> = {
  who: { en: 'Who can get it', hi: 'कौन पात्र है', ta: 'யார் பெறலாம்' },
  benefit: { en: 'What you get', hi: 'क्या मिलेगा', ta: 'என்ன கிடைக்கும்' },
  documents: { en: 'Documents needed', hi: 'ज़रूरी दस्तावेज़', ta: 'தேவையான ஆவணங்கள்' },
  apply: { en: 'How to apply', hi: 'आवेदन कैसे करें', ta: 'எப்படி விண்ணப்பிப்பது' }
};