import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { DonorPortal } from './components/DonorPortal';
import { ReceiverHub } from './components/ReceiverHub';
import { PlatformAnalytics } from './components/PlatformAnalytics';
import { ComposterHub } from './components/ComposterHub'; 
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { useAuth } from './context/AuthContext';

type ViewType = 'donor' | 'receiver' | 'composter' | 'analytics';

export default function App() {
  const { user, profile, loading } = useAuth();
  // We initialize to null so we can force a redirect based on the role found in the DB
  const [currentView, setCurrentView] = useState<ViewType | null>(null);
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    if (profile?.role) {
      // Logic Fix: Ensure COMPOSTER is routed to its own hub immediately
      if (profile.role === 'RECEIVER') setCurrentView('receiver');
      else if (profile.role === 'COMPOSTER') setCurrentView('composter');
      else setCurrentView('donor');
    }
  }, [profile]);

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600"></div></div>;

  if (!user) {
    return isLoginView ? <Login onSwitch={() => setIsLoginView(false)} /> : <Signup onSwitch={() => setIsLoginView(true)} />;
  }

  return (
    <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === 'donor' && <DonorPortal />}
      {currentView === 'receiver' && <ReceiverHub />}
      {currentView === 'composter' && <ComposterHub />} 
      {currentView === 'analytics' && <PlatformAnalytics />}
    </DashboardLayout>
  );
}