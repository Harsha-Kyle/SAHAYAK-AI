import { StatusRecord } from '../types/app';

export const statusRecords: StatusRecord[] = [
{
  id: 'PMFBY-2026-TN-118402',
  title: 'Crop insurance claim — Paddy, Kharif 2026',
  scheme: 'PMFBY',
  module: 'schemes',
  stages: [
  { label: 'Loss reported', date: '2026-08-19' },
  { label: 'Field inspected', date: '2026-08-28' },
  { label: 'Claim approved by insurer', note: 'Waiting for the insurance company. This usually takes 2–3 weeks after inspection.' },
  { label: 'Paid to your bank account' }],

  current: 2,
  lastUpdated: '2026-09-25T18:40:00',
  listed: true
},
{
  id: 'GRV-TN-2026-047911',
  title: 'Complaint — crop insurance claim not paid',
  scheme: 'District Grievance Cell',
  module: 'grievance',
  stages: [
  { label: 'Complaint submitted', date: '2026-09-24' },
  { label: 'Received by district office', date: '2026-09-25' },
  { label: 'Under review', note: 'Assigned to the Block Agriculture Officer, Orathanadu.' },
  { label: 'Resolved' }],

  current: 2,
  lastUpdated: '2026-09-25T18:40:00',
  listed: true
},
{
  id: 'PMKISAN-TN-0098812',
  title: 'PM-KISAN instalment (Aug–Nov 2026)',
  scheme: 'PM-KISAN',
  module: 'schemes',
  stages: [
  { label: 'Registered', date: '2023-02-10' },
  { label: 'e-KYC verified', date: '2026-06-02' },
  { label: 'Instalment approved', date: '2026-08-01' },
  { label: '₹2,000 paid to your bank', date: '2026-08-02' }],

  current: 4,
  lastUpdated: '2026-09-25T18:40:00',
  listed: true
},
{
  id: 'GRV-TN-2026-048213',
  title: 'Complaint — submitted today',
  scheme: 'District Grievance Cell',
  module: 'grievance',
  stages: [
  { label: 'Complaint submitted', date: '2026-09-27' },
  { label: 'Received by district office', note: 'Usually within 2 working days.' },
  { label: 'Under review' },
  { label: 'Resolved' }],

  current: 1,
  lastUpdated: '2026-09-27T10:00:00',
  listed: false
}];