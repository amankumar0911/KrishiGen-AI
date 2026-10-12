import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useFarmer } from '../context/FarmerContext';
import { LayoutDashboard, MessageSquare, ScanLine, BookOpen, CalendarCheck } from 'lucide-react';

const Layout = ({ activeTab, setActiveTab, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useFarmer();

  const mobileNavItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'assistant', label: t.assistant, icon: MessageSquare },
    { id: 'disease', label: 'Scan', icon: ScanLine },
    { id: 'guide', label: t.cropGuide, icon: BookOpen },
    { id: 'planner', label: t.planner, icon: CalendarCheck },
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#1c2826] flex flex-col antialiased selection:bg-[#40916c]/20">
      {/* Sidebar for Desktop & Mobile drawer */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0 transition-all">
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#e8e2d5] bg-[#f9f7f0] py-4 px-6 text-center text-xs text-[#736a5c] hidden lg:block">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              © 2026 <strong>KrishiGen AI</strong> — Developed as a B.Tech CSE AI/ML Capstone Project for Indian Agriculture.
            </p>
            <p className="text-[11px] text-[#938875]">
              Empowering farmers with simple, reliable, and accessible technology.
            </p>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation Bar for easy thumb reach */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#1b4332] border-t border-[#2d6a4f] text-white px-2 py-1.5 flex items-center justify-around shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-all ${
                isActive
                  ? 'text-[#74c69d] font-bold scale-105'
                  : 'text-[#a5c4a9] hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#74c69d]' : 'text-[#a5c4a9]'}`} />
              <span className="truncate max-w-[64px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;

