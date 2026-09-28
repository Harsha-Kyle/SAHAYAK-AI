import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppShell } from './components/layout/AppShell';
import { AppProvider } from './contexts/AppContext';
import { AnswerPage } from './pages/AnswerPage';
import { Chatbot } from './pages/Chatbot';
import { ComponentLibrary } from './pages/ComponentLibrary';
import { Confirm } from './pages/Confirm';
import { DataOverview } from './pages/DataOverview';
import { DocumentCapture } from './pages/grievance/DocumentCapture';
import { GrievanceDraft } from './pages/grievance/GrievanceDraft';
import { GrievanceFlow } from './pages/grievance/GrievanceFlow';
import { History } from './pages/History';
import { Home } from './pages/Home';
import { KioskIdle } from './pages/KioskIdle';
import { LanguageSelect } from './pages/LanguageSelect';
import { Listening } from './pages/Listening';
import { ModuleTopics } from './pages/ModuleTopics';
import { Onboarding } from './pages/Onboarding';
import { Processing } from './pages/Processing';
import { Refusal } from './pages/Refusal';
import { Reminder } from './pages/Reminder';
import { Settings } from './pages/Settings';
import { StatusTracker } from './pages/StatusTracker';
import { TalkToHuman } from './pages/TalkToHuman';

interface AppProps {
  layout?: 'responsive' | 'kiosk';
  startOffline?: boolean;
  showOnboarding?: boolean;
}

export function App({ layout = 'responsive', startOffline = false, showOnboarding = true }: AppProps) {
  return (
    <AppProvider initialKiosk={layout === 'kiosk'} forcedOffline={startOffline} skipOnboarding={!showOnboarding}>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{ style: { fontSize: '1rem' } }} />
        <Routes>
          <Route path="/welcome" element={<Onboarding />} />
          <Route path="/kiosk" element={<KioskIdle />} />
          <Route path="/language" element={<LanguageSelect />} />
          <Route path="/listen" element={<Listening />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/grievance/capture" element={<DocumentCapture />} />
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/data-overview" element={<DataOverview />} />
            <Route path="/module/:id" element={<ModuleTopics />} />
            <Route path="/confirm/:id" element={<Confirm />} />
            <Route path="/answer/:id" element={<AnswerPage />} />
            <Route path="/refusal/:id" element={<Refusal />} />
            <Route path="/reminder/:id" element={<Reminder />} />
            <Route path="/grievance" element={<GrievanceFlow />} />
            <Route path="/grievance/draft" element={<GrievanceDraft />} />
            <Route path="/status" element={<StatusTracker />} />
            <Route path="/history" element={<History />} />
            <Route path="/help" element={<TalkToHuman />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/components" element={<ComponentLibrary />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}