import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './pages/AuthModal';
import { Dashboard } from './pages/Dashboard';
import { MockInterview } from './pages/MockInterview';
import { CodingLab } from './pages/CodingLab';
import { AptitudeArena } from './pages/AptitudeArena';
import { ResumeCoach } from './pages/ResumeCoach';
import { GroupDiscussion } from './pages/GroupDiscussion';
import { QuestionBank } from './pages/QuestionBank';
import { ProgressPage } from './pages/ProgressPage';
import { Achievements } from './pages/Achievements';
import { SettingsPage } from './pages/SettingsPage';
import { InterviewReport } from './pages/InterviewReport';

const AppContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [viewingReportId, setViewingReportId] = useState(null);

  // If user is not authenticated or visits initial landing page
  if (!user && activeTab === 'landing') {
    return (
      <>
        <LandingPage onStart={() => setAuthModalOpen(true)} />
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)}
          onComplete={() => setAuthModalOpen(false)}
        />
      </>
    );
  }

  const renderActiveTab = () => {
    if (viewingReportId) {
      return (
        <InterviewReport 
          interviewId={viewingReportId} 
          onBack={() => setViewingReportId(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'mock_interview':
        return <MockInterview onFinish={() => setViewingReportId(1)} />;
      case 'coding_lab':
        return <CodingLab />;
      case 'aptitude':
        return <AptitudeArena />;
      case 'resume_coach':
        return <ResumeCoach onStartResumeInterview={() => setActiveTab('mock_interview')} />;
      case 'gd_arena':
        return <GroupDiscussion />;
      case 'question_bank':
        return <QuestionBank />;
      case 'progress':
        return <ProgressPage />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
      case 'profile':
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar & Mobile Nav */}
      <Navigation activeTab={activeTab} setActiveTab={(tab) => { setViewingReportId(null); setActiveTab(tab); }} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-8 pb-24 md:pb-8">
          {renderActiveTab()}
        </main>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        onComplete={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
