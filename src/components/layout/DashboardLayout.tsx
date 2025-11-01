import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import type { User } from '../../types.ts';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  activeView: string;
  onNavigate: (viewId: string) => void;
  user: User;
  pageTitle: string;
}

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onLogout, activeView, onNavigate, user, pageTitle }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleNavigate = (viewId: string) => {
    onNavigate(viewId);
    if (window.innerWidth < 1024) { // Close sidebar on mobile after navigation
        setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative min-h-screen bg-gray-100 lg:flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar}
        onLogout={onLogout} 
        activeView={activeView} 
        onNavigate={handleNavigate} 
        user={user} 
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <Header 
            onMenuClick={toggleSidebar}
            pageTitle={pageTitle}
            user={user}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;