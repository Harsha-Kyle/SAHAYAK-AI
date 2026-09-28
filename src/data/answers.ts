import { Answer } from '../types/app';

export const answers: Answer[] = [
{
  id: 'pmkisan',
  module: 'schemes',
  short: 'PM-KISAN',
  question: {
    en: 'Am I eligible for PM-KISAN money?',
    hi: 'क्या मुझे पीएम-किसान का पैसा मिलेगा?',
    ta: 'எனக்கு பிஎம்-கிசான் பணம் கிடைக்குமா?'
  },
  title: { en: 'PM-KISAN Samman Nidhi', hi: 'पीएम-किसान सम्मान निधि', ta: 'பிஎம்-கிசான் சம்மான் நிதி' },
  summary: {
    en: 'Income support of ₹6,000 a year for landholding farmer families, paid directly to your bank in three instalments.',
    hi: 'भूमिधारक किसान परिवारों को साल में ₹6,000 की आय सहायता, सीधे बैंक खाते में तीन किस्तों में।',
    ta: 'நிலம் உள்ள விவசாயக் குடும்பங்களுக்கு ஆண்டுக்கு ₹6,000 வருமான உதவி, மூன்று தவணைகளாக நேரடியாக வங்கிக் கணக்கில்.'
  },
  facts: [
  {
    kind: 'who',
    value: {
      en: 'Farmer families who own cultivable land in their name. Income-tax payers, government employees and professionals such as doctors are not eligible.',
      hi: 'जिन किसान परिवारों के नाम पर खेती योग्य भूमि है। आयकरदाता, सरकारी कर्मचारी और डॉक्टर जैसे पेशेवर पात्र नहीं हैं।',
      ta: 'தங்கள் பெயரில் விவசாய நிலம் உள்ள குடும்பங்கள். வருமான வரி செலுத்துவோர், அரசு ஊழியர்கள், மருத்துவர் போன்ற தொழில்முறையாளர்கள் தகுதியற்றவர்கள்.'
    }
  },
  {
    kind: 'benefit',
    value: {
      en: '₹2,000 every four months — ₹6,000 a year, sent to your Aadhaar-linked bank account.',
      hi: 'हर चार महीने में ₹2,000 — साल में ₹6,000, आधार से जुड़े बैंक खाते में।',
      ta: 'நான்கு மாதங்களுக்கு ஒருமுறை ₹2,000 — ஆண்டுக்கு ₹6,000, ஆதார் இணைந்த வங்கிக் கணக்கில்.'
    }
  },
  {
    kind: 'documents',
    value: {
      en: 'Aadhaar card\nLand record (Patta / Khatauni)\nBank passbook\nMobile number linked to Aadhaar',
      hi: 'आधार कार्ड\nभूमि रिकॉर्ड (खतौनी)\nबैंक पासबुक\nआधार से जुड़ा मोबाइल नंबर',
      ta: 'ஆதார் அட்டை\nநிலப் பதிவு (பட்டா)\nவங்கி பாஸ்புக்\nஆதாருடன் இணைந்த கைபேசி எண்'
    }
  },
  {
    kind: 'apply',
    value: {
      en: 'Visit your nearest Common Service Centre (CSC) or PACS, or self-register at pmkisan.gov.in. Complete e-KYC with OTP or fingerprint.',
      hi: 'नज़दीकी जन सेवा केंद्र (CSC) या PACS पर जाएँ, या pmkisan.gov.in पर खुद पंजीकरण करें। OTP या अंगूठे से e-KYC पूरा करें।',
      ta: 'அருகிலுள்ள பொது சேவை மையம் (CSC) அல்லது PACS-க்குச் செல்லுங்கள், அல்லது pmkisan.gov.in-ல் பதிவு செய்யுங்கள். OTP அல்லது கைரேகை மூலம் e-KYC முடிக்கவும்.'
    }
  }],

  confidence: 'verified',
  source: {
    document: 'PM-KISAN Operational Guidelines (Revised)',
    section: 'Sec. 4 — Eligibility and exclusion criteria',
    lastVerified: '2026-09-12'
  },
  cachedOffline: true,
  cachedOn: '2026-09-12',
  followUp: {
    question: { en: 'How do I complete e-KYC?', hi: 'e-KYC कैसे करूँ?', ta: 'e-KYC எப்படி செய்வது?' },
    targetId: 'pmkisan-ekyc'
  }
},
{
  id: 'pmkisan-ekyc',
  module: 'schemes',
  short: 'e-KYC',
  question: { en: 'How do I complete PM-KISAN e-KYC?', hi: 'पीएम-किसान e-KYC कैसे करूँ?', ta: 'பிஎம்-கிசான் e-KYC எப்படி செய்வது?' },
  title: { en: 'PM-KISAN e-KYC', hi: 'पीएम-किसान e-KYC', ta: 'பிஎம்-கிசான் e-KYC' },
  summary: {
    en: 'e-KYC is compulsory to keep receiving instalments. It takes about five minutes.',
    hi: 'किस्तें मिलती रहें, इसके लिए e-KYC ज़रूरी है। इसमें लगभग पाँच मिनट लगते हैं।',
    ta: 'தவணைகள் தொடர்ந்து கிடைக்க e-KYC கட்டாயம். சுமார் ஐந்து நிமிடங்கள் ஆகும்.'
  },
  facts: [
  { kind: 'who', value: { en: 'Every registered PM-KISAN beneficiary.' } },
  { kind: 'benefit', value: { en: 'Your next instalment is released only after e-KYC is complete.' } },
  { kind: 'documents', value: { en: 'Aadhaar card\nMobile number linked to Aadhaar' } },
  {
    kind: 'apply',
    value: {
      en: 'OTP: pmkisan.gov.in → Farmers Corner → e-KYC.\nFingerprint: at any CSC for a small fee.\nFace: using the PM-KISAN mobile app.'
    }
  }],

  confidence: 'verified',
  source: {
    document: 'PM-KISAN e-KYC Advisory',
    section: 'Para 2 — Modes of authentication',
    lastVerified: '2026-09-12'
  },
  cachedOffline: true,
  cachedOn: '2026-09-12'
},
{
  id: 'pmfby',
  module: 'schemes',
  short: 'PMFBY',
  question: {
    en: 'How do I insure my paddy crop?',
    hi: 'धान की फसल का बीमा कैसे करूँ?',
    ta: 'நெல் பயிருக்கு காப்பீடு எப்படி செய்வது?'
  },
  title: {
    en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    hi: 'प्रधानमंत्री फसल बीमा योजना',
    ta: 'பிரதமர் பயிர் காப்பீட்டுத் திட்டம்'
  },
  summary: {
    en: 'Crop insurance against loss from drought, flood, pests and disease. You pay a small share of the premium; the government pays the rest.',
    hi: 'सूखा, बाढ़, कीट और रोग से फसल नुकसान का बीमा। किसान थोड़ा प्रीमियम देता है, बाकी सरकार देती है।',
    ta: 'வறட்சி, வெள்ளம், பூச்சி, நோய் ஆகியவற்றால் ஏற்படும் பயிர் இழப்புக்கு காப்பீடு. நீங்கள் சிறிய பிரீமியம் செலுத்துகிறீர்கள்; மீதியை அரசு செலுத்துகிறது.'
  },
  facts: [
  {
    kind: 'who',
    value: {
      en: 'All farmers growing notified crops in notified areas — landowners and tenant farmers. Farmers with crop loans are enrolled automatically but can opt out.',
      hi: 'अधिसूचित क्षेत्र में अधिसूचित फसल उगाने वाले सभी किसान — भूमि मालिक और बटाईदार दोनों। फसल ऋण वाले किसान अपने आप जुड़ते हैं, पर चाहें तो बाहर हो सकते हैं।'
    }
  },
  {
    kind: 'benefit',
    value: {
      en: 'Premium: 1.5% of sum insured for Rabi food crops, 2% for Kharif, 5% for commercial crops. Claim paid to your bank account after loss is assessed.',
      hi: 'प्रीमियम: रबी खाद्य फसलों पर बीमा राशि का 1.5%, खरीफ पर 2%, व्यावसायिक फसलों पर 5%। नुकसान के आकलन के बाद दावा सीधे बैंक खाते में।'
    }
  },
  {
    kind: 'documents',
    value: {
      en: 'Aadhaar card\nBank passbook\nLand record or tenancy agreement\nSowing certificate from Village Officer',
      hi: 'आधार कार्ड\nबैंक पासबुक\nभूमि रिकॉर्ड या बटाई अनुबंध\nग्राम अधिकारी से बुवाई प्रमाणपत्र'
    }
  },
  {
    kind: 'apply',
    value: {
      en: 'Through your bank or PACS (if you have a crop loan), a Common Service Centre, or the Crop Insurance app / pmfby.gov.in.',
      hi: 'अपने बैंक या PACS (अगर फसल ऋण है), जन सेवा केंद्र, या क्रॉप इंश्योरेंस ऐप / pmfby.gov.in से।'
    }
  }],

  confidence: 'verified',
  source: {
    document: 'PMFBY Revamped Operational Guidelines',
    section: 'Sec. 7 — Cut-off dates; Sec. 11 — Premium rates',
    lastVerified: '2026-09-20'
  },
  deadline: {
    label: { en: 'Rabi 2026–27 enrolment closes', hi: 'रबी 2026–27 नामांकन बंद', ta: 'ரபி 2026–27 பதிவு முடிவு' },
    date: '2026-12-31'
  },
  cachedOffline: true,
  cachedOn: '2026-09-20',
  followUp: {
    question: { en: 'How do I claim for crop loss?', hi: 'फसल नुकसान का दावा कैसे करूँ?', ta: 'பயிர் இழப்புக்கு எப்படிக் கோருவது?' },
    targetId: 'pmfby-claim'
  }
},
{
  id: 'pmfby-claim',
  module: 'schemes',
  short: 'PMFBY claim',
  question: { en: 'How do I claim for crop loss?', hi: 'फसल नुकसान का दावा कैसे करूँ?', ta: 'பயிர் இழப்புக்கு எப்படிக் கோருவது?' },
  title: { en: 'Claiming crop-loss insurance', hi: 'फसल नुकसान बीमा का दावा', ta: 'பயிர் இழப்புக் காப்பீட்டுக் கோரிக்கை' },
  summary: {
    en: 'Report crop loss within 72 hours so the insurance company can inspect your field.',
    hi: 'फसल नुकसान की सूचना 72 घंटे के अंदर दें ताकि बीमा कंपनी खेत का निरीक्षण कर सके।',
    ta: 'காப்பீட்டு நிறுவனம் வயலை ஆய்வு செய்ய, பயிர் இழப்பை 72 மணி நேரத்துக்குள் தெரிவிக்கவும்.'
  },
  facts: [
  {
    kind: 'who',
    value: { en: 'Insured farmers with local damage (hailstorm, flooding, landslide) or loss of harvested crop drying in the field within 14 days.' }
  },
  { kind: 'benefit', value: { en: 'Loss is assessed field by field; the claim is paid directly to your bank account.' } },
  { kind: 'documents', value: { en: 'Policy or application number\nPhotos of the damaged crop\nBank passbook' } },
  {
    kind: 'apply',
    value: { en: 'Call 14447 or use the Crop Insurance app within 72 hours. You can also inform your bank, PACS or the agriculture office.' }
  }],

  confidence: 'verified',
  source: {
    document: 'PMFBY Revamped Operational Guidelines',
    section: 'Sec. 19 — Localised calamities and post-harvest losses',
    lastVerified: '2026-09-20'
  },
  cachedOffline: false
},
{
  id: 'kcc',
  module: 'finance',
  short: 'KCC loan',
  question: {
    en: 'Can I get a Kisan Credit Card loan?',
    hi: 'क्या मुझे किसान क्रेडिट कार्ड ऋण मिल सकता है?',
    ta: 'எனக்கு கிசான் கடன் அட்டை கடன் கிடைக்குமா?'
  },
  title: { en: 'Kisan Credit Card (KCC)', hi: 'किसान क्रेडिट कार्ड', ta: 'கிசான் கடன் அட்டை' },
  summary: {
    en: 'A short-term crop loan at low interest from your bank or cooperative society.',
    hi: 'आपके बैंक या सहकारी समिति से कम ब्याज पर अल्पकालिक फसल ऋण।',
    ta: 'உங்கள் வங்கி அல்லது கூட்டுறவுச் சங்கத்திலிருந்து குறைந்த வட்டியில் குறுகிய காலப் பயிர்க் கடன்.'
  },
  facts: [
  { kind: 'who', value: { en: 'Owner farmers, tenant farmers, sharecroppers and self-help groups — including dairy and fisheries farmers.' } },
  { kind: 'benefit', value: { en: 'Loans up to ₹3 lakh at 7% interest. Repay on time and get 3% back — effectively 4% a year.' } },
  { kind: 'documents', value: { en: 'Aadhaar card\nLand record\nPassport-size photo\nBank passbook' } },
  { kind: 'apply', value: { en: 'Fill the one-page KCC form at your bank branch or PACS. The card should be issued within 14 days of a complete application.' } }],

  confidence: 'verified',
  source: {
    document: 'RBI Master Direction — Kisan Credit Card Scheme',
    section: 'Para 5 — Eligibility; Modified Interest Subvention Scheme',
    lastVerified: '2026-08-30'
  },
  cachedOffline: true,
  cachedOn: '2026-08-30'
},
{
  id: 'pacs-membership',
  module: 'cooperative',
  short: 'PACS',
  question: {
    en: 'How do I become a member of the village cooperative society?',
    hi: 'गाँव की सहकारी समिति का सदस्य कैसे बनूँ?',
    ta: 'கிராமக் கூட்டுறவுச் சங்கத்தில் உறுப்பினர் ஆவது எப்படி?'
  },
  title: {
    en: 'Joining your PACS',
    hi: 'अपनी PACS (प्राथमिक कृषि ऋण समिति) से जुड़ें',
    ta: 'உங்கள் PACS-ல் உறுப்பினராகுங்கள்'
  },
  summary: {
    en: 'Any adult farmer living in the society’s area can apply for membership by buying at least one share.',
    hi: 'समिति क्षेत्र में रहने वाला कोई भी वयस्क किसान कम से कम एक शेयर खरीदकर सदस्यता के लिए आवेदन कर सकता है।',
    ta: 'சங்கப் பகுதியில் வசிக்கும் எந்த வயதுவந்த விவசாயியும் குறைந்தது ஒரு பங்கு வாங்கி உறுப்பினராக விண்ணப்பிக்கலாம்.'
  },
  facts: [
  { kind: 'who', value: { en: 'Adult farmers living in the society’s area of operation who have not defaulted at another cooperative.' } },
  { kind: 'benefit', value: { en: 'Crop loans, fertiliser at fair price, a vote in the general body, and a share in profits.' } },
  { kind: 'documents', value: { en: 'Aadhaar card\nLand or residence proof\nPassport-size photo\nShare money (as fixed in the by-law)' } },
  { kind: 'apply', value: { en: 'Give the membership form to the PACS Secretary. The managing committee decides and informs you in writing.' } }],

  confidence: 'verified',
  source: {
    document: 'Tamil Nadu Co-operative Societies Act, 1983',
    section: 'Sec. 21 — Admission of members',
    lastVerified: '2026-07-18'
  },
  cachedOffline: true,
  cachedOn: '2026-07-18'
},
{
  id: 'coop-dividend',
  module: 'law',
  short: 'Dividend',
  question: {
    en: 'How much dividend can my cooperative pay?',
    hi: 'मेरी सहकारी समिति कितना लाभांश दे सकती है?',
    ta: 'எங்கள் கூட்டுறவுச் சங்கம் எவ்வளவு ஈவுத்தொகை தரலாம்?'
  },
  title: { en: 'Dividend from cooperative profits', hi: 'सहकारी लाभ से लाभांश', ta: 'கூட்டுறவு லாபத்திலிருந்து ஈவுத்தொகை' },
  summary: {
    en: 'A society can pay dividend on share capital only from net profit, after setting aside money for the reserve fund.',
    hi: 'समिति रिज़र्व फंड के लिए राशि अलग रखने के बाद केवल शुद्ध लाभ से ही शेयर पूँजी पर लाभांश दे सकती है।',
    ta: 'சேமநிதிக்கு ஒதுக்கிய பிறகே, நிகர லாபத்திலிருந்து மட்டுமே பங்கு மூலதனத்துக்கு ஈவுத்தொகை வழங்க முடியும்.'
  },
  facts: [
  { kind: 'who', value: { en: 'Members holding fully paid-up shares.' } },
  { kind: 'benefit', value: { en: 'Paid as a percentage of your share capital, up to the ceiling set in the state Act.' } },
  { kind: 'documents', value: { en: 'Share certificate\nMembership number' } },
  { kind: 'apply', value: { en: 'The rate is approved at the Annual General Meeting. Ask your society Secretary for the approved rate.' } }],

  confidence: 'partial',
  confidenceNote: {
    en: 'The exact rate depends on your society’s own by-law, which I don’t have. Please confirm with the Secretary.',
    hi: 'सही दर आपकी समिति के उपनियम पर निर्भर है, जो मेरे पास नहीं है। कृपया सचिव से पुष्टि करें।',
    ta: 'சரியான விகிதம் உங்கள் சங்கத்தின் துணைவிதியைப் பொறுத்தது; அது என்னிடம் இல்லை. செயலரிடம் உறுதிசெய்யவும்.'
  },
  source: {
    document: 'Tamil Nadu Co-operative Societies Act, 1983',
    section: 'Sec. 71 — Disposal of net profits',
    lastVerified: '2026-07-18'
  },
  cachedOffline: false,
  followUp: {
    question: {
      en: 'What does my society’s by-law say about dividend?',
      hi: 'मेरी समिति के उपनियम में लाभांश के बारे में क्या लिखा है?',
      ta: 'எங்கள் சங்கத் துணைவிதியில் ஈவுத்தொகை பற்றி என்ன உள்ளது?'
    },
    targetId: 'bylaw-dividend'
  }
}];