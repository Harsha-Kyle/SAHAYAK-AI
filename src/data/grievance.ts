import {
  BanknoteIcon,
  BookOpenIcon,
  ClockIcon,
  CreditCardIcon,
  FingerprintIcon,
  LandmarkIcon,
  ReceiptIcon } from
'lucide-react';
import { DocumentId, GrievanceProblem, OcrField, RequiredDocument } from '../types/app';

export const grievanceProblems: GrievanceProblem[] = [
{
  id: 'claim-not-paid',
  icon: BanknoteIcon,
  label: { en: 'Crop insurance claim not paid', hi: 'फसल बीमा का पैसा नहीं मिला', ta: 'பயிர் காப்பீட்டுத் தொகை வரவில்லை' },
  scheme: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
  relatedAnswers: ['pmfby', 'pmfby-claim'],
  needsPolicy: true,
  description:
  'My paddy crop (Samba, Kharif 2026) was damaged by heavy rain in August 2026. I reported the loss on time and the field was inspected, but the claim amount has not been credited to my bank account.',
  requestedAction: 'Please verify my claim and release the pending claim amount to my bank account at the earliest.'
},
{
  id: 'instalment-stopped',
  icon: ClockIcon,
  label: { en: 'PM-KISAN instalment stopped', hi: 'पीएम-किसान की किस्त रुक गई', ta: 'பிஎம்-கிசான் தவணை நின்றுவிட்டது' },
  scheme: 'PM-KISAN Samman Nidhi',
  relatedAnswers: ['pmkisan', 'pmkisan-ekyc'],
  needsPolicy: false,
  description:
  'I received PM-KISAN instalments earlier, but the latest instalment has not been credited even though my e-KYC is complete.',
  requestedAction: 'Please check my beneficiary status and release the pending instalment.'
},
{
  id: 'wrong-details',
  icon: CreditCardIcon,
  label: { en: 'Wrong name or bank details', hi: 'नाम या बैंक विवरण गलत', ta: 'பெயர் அல்லது வங்கி விவரம் தவறு' },
  scheme: 'PM-KISAN Samman Nidhi',
  relatedAnswers: [],
  needsPolicy: false,
  description: 'My name and bank account details are recorded incorrectly, so payments to me are failing.',
  requestedAction: 'Please correct my records as per the attached documents.'
},
{
  id: 'loan-delay',
  icon: LandmarkIcon,
  label: { en: 'Cooperative loan delayed', hi: 'सहकारी ऋण में देरी', ta: 'கூட்டுறவுக் கடன் தாமதம்' },
  scheme: 'Kisan Credit Card through PACS',
  relatedAnswers: ['kcc', 'pacs-membership'],
  needsPolicy: false,
  description: 'I applied for a crop loan under the Kisan Credit Card scheme at my PACS more than 30 days ago and have not received a decision.',
  requestedAction: 'Please process my KCC loan application and inform me of the decision in writing.'
}];


export const requiredDocuments: RequiredDocument[] = [
{
  id: 'passbook',
  icon: BookOpenIcon,
  label: { en: 'Bank passbook (first page)', hi: 'बैंक पासबुक (पहला पन्ना)', ta: 'வங்கி பாஸ்புக் (முதல் பக்கம்)' }
},
{
  id: 'policy',
  icon: ReceiptIcon,
  label: { en: 'Insurance policy or receipt', hi: 'बीमा पॉलिसी या रसीद', ta: 'காப்பீட்டு பாலிசி அல்லது ரசீது' }
},
{
  id: 'aadhaar',
  icon: FingerprintIcon,
  label: { en: 'Aadhaar card', hi: 'आधार कार्ड', ta: 'ஆதார் அட்டை' }
}];


export const ocrSamples: Record<DocumentId, OcrField[]> = {
  passbook: [
  { label: 'Account holder', value: 'Murugan S.' },
  { label: 'Account number', value: '•••• •••• 3307' },
  { label: 'IFSC', value: 'IOBA0001234' },
  { label: 'Branch', value: 'Indian Overseas Bank, Orathanadu' }],

  policy: [
  { label: 'Policy number', value: 'PMFBY-2026-TN-118402' },
  { label: 'Crop', value: 'Paddy (Samba)' },
  { label: 'Season', value: 'Kharif 2026' },
  { label: 'Sum insured', value: '₹42,500' }],

  aadhaar: [
  { label: 'Name', value: 'Murugan S.' },
  { label: 'Aadhaar number', value: 'XXXX XXXX 4821' },
  { label: 'Year of birth', value: '1971' }]

};

export const grievanceReference = 'GRV-TN-2026-048213';