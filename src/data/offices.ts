import { Helpline, Office } from '../types/app';

export const helplines: Helpline[] = [
{
  id: 'kcc',
  name: 'Kisan Call Centre',
  number: '1800-180-1551',
  dial: '18001801551',
  hours: 'Every day, 6 AM – 10 PM',
  note: 'Free call · Speaks 22 languages'
},
{
  id: 'pmkisan',
  name: 'PM-KISAN Helpline',
  number: '155261',
  dial: '155261',
  hours: 'Mon–Sat, 9:30 AM – 6 PM',
  note: 'Payments, e-KYC, registration'
},
{
  id: 'pmfby',
  name: 'Crop Insurance Helpline',
  number: '14447',
  dial: '14447',
  hours: 'Every day, 24 hours',
  note: 'Report crop loss within 72 hours'
}];


export const offices: Office[] = [
{
  id: 'pacs-orathanadu',
  name: 'Orathanadu Primary Agricultural Cooperative Credit Society',
  type: 'PACS',
  distance: '2.4 km',
  address: 'Main Road, near Bus Stand, Orathanadu 614625',
  phone: '04372 233 145',
  dial: '04372233145',
  hours: 'Mon–Sat, 10 AM – 5 PM',
  openNow: true,
  mapsQuery: 'Primary Agricultural Cooperative Credit Society Orathanadu'
},
{
  id: 'tccb-orathanadu',
  name: 'Thanjavur Central Cooperative Bank — Orathanadu Branch',
  type: 'Cooperative bank',
  distance: '2.9 km',
  address: 'Pattukottai Road, Orathanadu 614625',
  phone: '04372 233 402',
  dial: '04372233402',
  hours: 'Mon–Fri, 10 AM – 4 PM · Sat till 1 PM',
  openNow: true,
  mapsQuery: 'Thanjavur Central Cooperative Bank Orathanadu'
},
{
  id: 'block-agri',
  name: 'Block Agriculture Office, Orathanadu',
  type: 'Agriculture office',
  distance: '3.6 km',
  address: 'Taluk Office Campus, Orathanadu 614625',
  phone: '04372 234 010',
  dial: '04372234010',
  hours: 'Mon–Fri, 10 AM – 5:45 PM',
  openNow: false,
  mapsQuery: 'Block Agriculture Office Orathanadu'
}];