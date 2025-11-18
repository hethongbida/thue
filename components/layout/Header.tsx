import React from 'react';
import { AppView } from '../../types';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onProfileClick }) => {
  const navItems = [
    { view: 'home', label: 'Lộ trình' },
    { view: 'hkd', label: 'Hộ Kinh Doanh' },
    { view: 'pit', label: 'Thuế Cá Nhân' },
    { view: 'corporate', label: 'Thuế Doanh Nghiệp' },
    { view: 'ecommerce', label: 'TMĐT' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/75 backdrop-blur-lg border-b border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-teal-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span className="text-xl font-bold text-slate-100">Tax Helper 2026</span>
          </div>
          <div className="flex items-center space-x-2">
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view as AppView)}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                    currentView === item.view 
                    ? 'bg-teal-500 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <button
              onClick={onProfileClick}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
              aria-label="Hồ sơ người nộp thuế"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
            <button className="md:hidden p-2 rounded-md text-slate-400 hover:bg-slate-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;