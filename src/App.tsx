/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlumniProvider, useAlumni } from './context/AlumniContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { DashboardView } from './components/dashboard/DashboardView';
import { NetworkView } from './components/network/NetworkView';
import { MessagesView } from './components/messages/MessagesView';
import { EventsView } from './components/events/EventsView';
import { AnnouncementsView } from './components/announcements/AnnouncementsView';
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { AdminPanelView } from './components/admin/AdminPanelView';
import { PublicProfileModal } from './components/profile/PublicProfileModal';
import { AuthPage } from './components/auth/AuthPage';
import { LandingPage } from './components/landing/LandingPage';
import { GraduationCap, LogIn, UserPlus, Globe } from 'lucide-react';

function AppContent() {
  const { activeTab, setActiveTab, currentUser } = useAlumni();
  const [currentView, setCurrentView] = useState<'landing' | 'portal' | 'auth'>(() => {
    try {
      const saved = localStorage.getItem('alumni_auth_session_real_v1');
      return saved ? 'portal' : 'auth';
    } catch {
      return 'auth';
    }
  });
  const [authViewMode, setAuthViewMode] = useState<'login' | 'register'>('login');

  const handleLoginSuccess = (role?: string) => {
    setCurrentView('portal');
    if (role && ['admin', 'registrar', 'staff', 'moderator'].includes(role)) {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Landing page view (when user explicitly chooses to view public site)
  if (currentView === 'landing') {
    return (
      <LandingPage
        onNavigateToAuth={(mode) => {
          setAuthViewMode(mode);
          setCurrentView('auth');
        }}
      />
    );
  }

  // Authentication page view (login or multi-role registration)
  if (currentView === 'auth') {
    return (
      <AuthPage
        initialMode={authViewMode}
        onLoginSuccess={handleLoginSuccess}
        onBackToApp={() => {
          if (currentUser) {
            handleLoginSuccess(currentUser.role);
          } else {
            setCurrentView('landing');
          }
        }}
      />
    );
  }

  // Protected Member Portal View (Mandatory authentication - no direct access to dashboard)
  if (!currentUser) {
    return (
      <AuthPage
        initialMode="login"
        onLoginSuccess={handleLoginSuccess}
        onBackToApp={() => setCurrentView('landing')}
      />
    );
  }

  // Member Portal View (Authenticated)
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-[#111827] antialiased selection:bg-[#991B1B] selection:text-white">
      {/* Top Global Header */}
      <Header
        onOpenAuth={(mode) => {
          setAuthViewMode(mode);
          setCurrentView('auth');
        }}
        onGoToLanding={() => setCurrentView('landing')}
      />

      {/* Main Navigation Bar */}
      <Navigation
        onOpenAuth={(mode) => {
          setAuthViewMode(mode);
          setCurrentView('auth');
        }}
      />

      {/* Primary Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'network' && <NetworkView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'events' && <EventsView />}
        {activeTab === 'announcements' && <AnnouncementsView />}
        {activeTab === 'opportunities' && <OpportunitiesView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'admin' && <AdminPanelView />}
      </main>

      {/* Public Profile Modal (Available anywhere in the app) */}
      <PublicProfileModal />

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/cecilians-seal.jpg"
              alt="Alumni Cecilian's Logo"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-stone-200 shadow-2xs shrink-0"
            />
            <span className="font-bold text-[#111827]">St. Cecilia's College Global Alumni Association</span>
            <span>•</span>
            <span>Official Institutional Network</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-stone-500 font-medium">St. Cecilia’s College - Cebu, Inc.</span>
            <span>•</span>
            <span className="text-stone-400">© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AlumniProvider>
      <AppContent />
    </AlumniProvider>
  );
}
