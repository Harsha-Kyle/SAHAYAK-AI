import { Refusal } from '../types/app';

export const refusals: Refusal[] = [
{
  id: 'bylaw-dividend',
  module: 'law',
  question: {
    en: 'What does my society’s by-law say about dividend?',
    hi: 'मेरी समिति के उपनियम में लाभांश के बारे में क्या लिखा है?',
    ta: 'எங்கள் சங்கத் துணைவிதியில் ஈவுத்தொகை பற்றி என்ன உள்ளது?'
  },
  title: {
    en: 'Your society’s by-law on dividend',
    hi: 'आपकी समिति का लाभांश उपनियम',
    ta: 'உங்கள் சங்கத்தின் ஈவுத்தொகை துணைவிதி'
  },
  reason: {
    en: 'Every cooperative society writes its own by-laws, and your society’s by-law is not in my verified documents. I won’t guess on something this important.',
    hi: 'हर सहकारी समिति अपने उपनियम खुद बनाती है, और आपकी समिति का उपनियम मेरे सत्यापित दस्तावेज़ों में नहीं है। इतनी ज़रूरी बात पर मैं अनुमान नहीं लगाऊँगा।',
    ta: 'ஒவ்வொரு கூட்டுறவுச் சங்கமும் தனது துணைவிதிகளைத் தானே எழுதுகிறது. உங்கள் சங்கத்தின் துணைவிதி என் சரிபார்த்த ஆவணங்களில் இல்லை. இவ்வளவு முக்கியமான விஷயத்தில் நான் ஊகிக்க மாட்டேன்.'
  }
}];