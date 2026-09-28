import { OfflinePack } from '../types/app';

export const offlinePacks: OfflinePack[] = [
{ id: 'pmkisan', name: 'PM-KISAN answers', sizeMb: 1.4, updated: '2026-09-12', downloaded: true },
{ id: 'pmfby', name: 'Crop insurance (PMFBY)', sizeMb: 2.1, updated: '2026-09-20', downloaded: true },
{ id: 'kcc', name: 'Kisan Credit Card', sizeMb: 0.9, updated: '2026-08-30', downloaded: true },
{ id: 'pacs', name: 'PACS membership & services', sizeMb: 1.2, updated: '2026-07-18', downloaded: true },
{ id: 'tn-act', name: 'TN Co-operative Societies Act, 1983', sizeMb: 3.8, updated: '2026-07-18', downloaded: false },
{ id: 'grievance', name: 'Complaint letter templates', sizeMb: 0.6, updated: '2026-09-01', downloaded: true }];


export const offlineStorageLimitMb = 50;