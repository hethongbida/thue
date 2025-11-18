import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ComplianceRoadmap from './components/pages/ComplianceRoadmap';
import HKDModule from './components/pages/HKDModule';
import PITModule from './components/pages/PITModule';
import ECommerceModule from './components/pages/ECommerceModule';
import CorporateTaxModule from './components/pages/CorporateTaxModule';
import Chatbot from './components/chatbot/Chatbot';
import { AppView } from './types';
import UserProfileModal from './components/profile/UserProfileModal';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);


  const renderView = () => {
    switch (currentView) {
      case 'hkd':
        return <HKDModule />;
      case 'pit':
        return <PITModule />;
      case 'ecommerce':
        return <ECommerceModule />;
      case 'corporate':
        return <CorporateTaxModule />;
      case 'home':
      default:
        return <ComplianceRoadmap setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-300 font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} onProfileClick={() => setIsProfileModalOpen(true)} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {renderView()}
      </main>
      <Footer />
      <Chatbot />
      {isProfileModalOpen && <UserProfileModal onClose={() => setIsProfileModalOpen(false)} />}
    </div>
  );
};

export default App;
