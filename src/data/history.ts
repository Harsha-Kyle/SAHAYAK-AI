import { HistoryItem, PersonSession } from '../types/app';

export const initialHistory: HistoryItem[] = [
  {
    id: 'h-pmkisan',
    kind: 'answer',
    module: 'schemes',
    title: { en: 'PM-KISAN Samman Nidhi', hi: 'पीएम-किसान सम्मान निधि', ta: 'பிஎம்-கிசான் சம்மான் நிதி' },
    short: 'PM-KISAN',
    date: '2026-09-27T09:12:00',
    to: '/answer/pmkisan'
  },
  {
    id: 'h-grv-047911',
    kind: 'grievance',
    module: 'grievance',
    title: {
      en: 'Complaint: crop insurance claim not paid',
      hi: 'शिकायत: फसल बीमा का पैसा नहीं मिला',
      ta: 'புகார்: பயிர் காப்பீட்டுத் தொகை வரவில்லை'
    },
    short: 'Complaint',
    detail: 'GRV-TN-2026-047911 · Under review',
    date: '2026-09-24T16:05:00',
    to: '/status?id=GRV-TN-2026-047911'
  },
  {
    id: 'h-kcc',
    kind: 'answer',
    module: 'finance',
    title: { en: 'Kisan Credit Card (KCC)', hi: 'किसान क्रेडिट कार्ड', ta: 'கிசான் கடன் अर्टे' },
    short: 'KCC loan',
    date: '2026-09-22T11:30:00',
    to: '/answer/kcc'
  },
  {
    id: 'h-status-pmfby',
    kind: 'status',
    module: 'schemes',
    title: { en: 'Checked: PMFBY claim status', hi: 'देखा: PMFBY दावे की स्थिति', ta: 'பார்த்தது: PMFBY கோரிக்கை நிலை' },
    short: 'PMFBY claim',
    detail: 'PMFBY-2026-TN-118402',
    date: '2026-09-20T10:02:00',
    to: '/status?id=PMFBY-2026-TN-118402'
  },
  {
    id: 'h-pacs-membership',
    kind: 'answer',
    module: 'cooperative',
    title: { en: 'Joining your PACS', hi: 'अपनी PACS से जुड़ें', ta: 'உங்கள் PACS-ல் உறுப்பினராகுங்கள்' },
    short: 'PACS',
    date: '2026-09-15T15:45:00',
    to: '/answer/pacs-membership'
  }
];

export const initialPersonSessions: PersonSession[] = [
  {
    id: 'sess-104',
    sessionNumber: 104,
    userLabel: 'Farmer / Visitor #104',
    date: '2026-09-27 09:30 AM',
    language: 'en',
    queriesCount: 2,
    queries: [
      {
        id: 'q-104-1',
        question: 'Am I eligible for PM-KISAN money?',
        answerTitle: 'PM-KISAN Samman Nidhi',
        module: 'schemes',
        timestamp: '09:30 AM'
      },
      {
        id: 'q-104-2',
        question: 'How do I complete e-KYC?',
        answerTitle: 'PM-KISAN e-KYC',
        module: 'schemes',
        timestamp: '09:32 AM'
      }
    ]
  },
  {
    id: 'sess-103',
    sessionNumber: 103,
    userLabel: 'Farmer / Visitor #103',
    date: '2026-09-26 03:15 PM',
    language: 'hi',
    queriesCount: 2,
    queries: [
      {
        id: 'q-103-1',
        question: 'धान की फसल का बीमा कैसे करूँ?',
        answerTitle: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        module: 'schemes',
        timestamp: '03:15 PM'
      },
      {
        id: 'q-103-2',
        question: 'फसल नुकसान का दावा कैसे करूँ?',
        answerTitle: 'Claiming crop-loss insurance',
        module: 'schemes',
        timestamp: '03:18 PM'
      }
    ]
  },
  {
    id: 'sess-102',
    sessionNumber: 102,
    userLabel: 'Farmer / Visitor #102',
    date: '2026-09-25 11:45 AM',
    language: 'ta',
    queriesCount: 1,
    queries: [
      {
        id: 'q-102-1',
        question: 'கிராமக் கூட்டுறவுச் சங்கத்தில் உறுப்பினர் ஆவது எப்படி?',
        answerTitle: 'Joining your PACS',
        module: 'cooperative',
        timestamp: '11:45 AM'
      }
    ]
  }
];