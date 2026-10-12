import React from 'react';
import { useFarmer } from '../context/FarmerContext';
import {
  LayoutDashboard,
  MessageSquare,
  ScanLine,
  BookOpen,
  CalendarCheck,
  User,
  Info,
  Sprout,
  X,
  PhoneCall,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { profile, t, healthInfo } = useFarmer();

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'assistant', label: t.assistant, icon: MessageSquare, badge: 'AI' },
    { id: 'disease', label: t.diseaseDetection, icon: ScanLine, badge: 'Vision' },
    { id: 'guide', label: t.cropGuide, icon: BookOpen },
    { id: 'planner', label: t.planner, icon: CalendarCheck },
    { id: 'profile', label: t.profile, icon: User },
    { id: 'about', label: t.about, icon: Info },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#1b4332] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#2d6a4f]/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] flex items-center justify-center text-[#74c69d] shadow-inner">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-lg tracking-tight text-white">KrishiGen AI</h1>
                <span className="text-[10px] bg-[#40916c] text-[#f4f7f4] font-semibold px-1.5 py-0.5 rounded">v1.0</span>
              </div>
              <p className="text-xs text-[#a5c4a9]">Smart Farming Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#cdddcF] hover:bg-[#2d6a4f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#2d6a4f] text-white shadow-sm font-semibold'
                    : 'text-[#cdddcF] hover:bg-[#23533e] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#74c69d]' : 'text-[#a5c4a9]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isActive
                        ? 'bg-[#74c69d] text-[#081c15]'
                        : 'bg-[#2d6a4f] text-[#cdddcF]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Farmer Quick Card */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-[#143326]/80 border border-[#2d6a4f]/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-[#a5c4a9]">किसान प्रोफाइल</span>
            <span className="text-[10px] text-[#74c69d]">{profile.farm_size_acres || 2} Acres</span>
          </div>
          <p className="text-xs font-semibold text-white truncate">{profile.name}</p>
          <p className="text-[11px] text-[#cdddcF] truncate">
            {profile.primary_crop} • {profile.district || profile.state}
          </p>
        </div>

        {/* Emergency Agricultural Helpline */}
        <div className="p-3.5 bg-[#081c15]/50 border-t border-[#2d6a4f]/60 text-xs text-[#a5c4a9]">
          <div className="flex items-center gap-2 text-white font-medium mb-1">
            <PhoneCall className="w-3.5 h-3.5 text-[#74c69d]" />
            <span>Kisan Call Centre (KCC)</span>
          </div>
          <p className="text-[11px] text-[#cdddcF]">
            Toll-Free Helpline: <span className="text-white font-bold tracking-wide">1800-180-1551</span>
          </p>
          <p className="text-[10px] text-[#8ea792] mt-0.5">ICAR / KVK Verified Guidance</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

