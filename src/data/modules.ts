import { IndianRupeeIcon, LandmarkIcon, MegaphoneIcon, ScaleIcon, WheatIcon } from 'lucide-react';
import { ModuleDef } from '../types/app';

export const modules: ModuleDef[] = [
{
  id: 'schemes',
  icon: WheatIcon,
  label: { en: 'Schemes', hi: 'योजनाएँ', ta: 'திட்டங்கள்' },
  hint: { en: 'PM-KISAN, crop insurance and more', hi: 'पीएम-किसान, फसल बीमा और अन्य', ta: 'பிஎம்-கிசான், பயிர் காப்பீடு' },
  availableOffline: true
},
{
  id: 'cooperative',
  icon: LandmarkIcon,
  label: { en: 'Cooperative', hi: 'सहकारिता', ta: 'கூட்டுறவு' },
  hint: { en: 'PACS membership, shares, meetings', hi: 'PACS सदस्यता, शेयर, बैठकें', ta: 'PACS உறுப்பினர், பங்குகள்' },
  availableOffline: true
},
{
  id: 'finance',
  icon: IndianRupeeIcon,
  label: { en: 'Finance', hi: 'वित्त', ta: 'நிதி' },
  hint: { en: 'Kisan Credit Card and crop loans', hi: 'किसान क्रेडिट कार्ड और फसल ऋण', ta: 'கிசான் கடன் அட்டை, பயிர்க் கடன்' },
  availableOffline: true
},
{
  id: 'grievance',
  icon: MegaphoneIcon,
  label: { en: 'Grievance', hi: 'शिकायत', ta: 'புகார்' },
  hint: { en: 'Make a complaint or track it', hi: 'शिकायत करें या स्थिति देखें', ta: 'புகார் செய்யவும், நிலை அறியவும்' },
  availableOffline: true
},
{
  id: 'law',
  icon: ScaleIcon,
  label: { en: 'Law', hi: 'कानून', ta: 'சட்டம்' },
  hint: { en: 'Cooperative Societies Act, by-laws', hi: 'सहकारी समिति अधिनियम, उपनियम', ta: 'கூட்டுறவுச் சங்கச் சட்டம்' },
  availableOffline: false
}];