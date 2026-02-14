import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { DonorPortal } from './components/DonorPortal';
import { ReceiverHub } from './components/ReceiverHub';
import { PlatformAnalytics } from './components/PlatformAnalytics';

type ViewType = 'donor' | 'receiver' | 'analytics';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('donor');

  return (
    <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === 'donor' && <DonorPortal />}
      {currentView === 'receiver' && <ReceiverHub />}
      {currentView === 'analytics' && <PlatformAnalytics />}
    </DashboardLayout>
  );
}
