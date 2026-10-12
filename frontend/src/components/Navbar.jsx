import React from 'react';
import { useFarmer } from '../context/FarmerContext';
import { Menu, Globe, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { profile, language, setLanguage, season, healthInfo, t } = useFarmer();

  const isLive = healthInfo.live_ai_configured;

  return (
    <header className="sticky top-0 z-30 bg-[#fcfbf7]/90 backdrop-blur-md border-b border-[#e5dfd3] px-4 lg:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Farmer Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-krishi-800 hover:bg-[#efe9dc] transition-colors focus:outline-none"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-krishi-700 bg-krishi-100/80 px-2.5 py-0.5 rounded-full border border-krishi-200">
                {season.tag}
              </span>
              <h2 className="text-sm md:text-base font-semibold text-[#1c2826] truncate">
                {t.welcomeBack}, <span className="text-krishi-700">{profile.name || 'किसान मित्र'}</span>
              </h2>
            </div>
            <p className="text-xs text-[#6b6255] hidden sm:block truncate">
              {profile.primary_crop} • {profile.state}
            </p>
          </div>
        </div>

        {/* Right: AI Mode Badge & Language Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* AI Mode Indicator */}
          <div
            title={
              isLive
                ? 'Gemini Vision & Chat API configured'
                : 'Demo Mode: Running with pre-configured local agricultural knowledge base. Add GEMINI_API_KEY to activate live AI.'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              isLive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {isLive ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="hidden md:inline">Live AI Active</span>
                <span className="md:hidden">Live</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline">Demo Mode</span>
                <span className="md:hidden">Demo</span>
              </>
            )}
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-[#f1ece1] p-0.5 rounded-lg border border-[#ded7c8]">
            <Globe className="w-3.5 h-3.5 text-[#736a5c] ml-2 mr-1 hidden sm:block" />
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                language === 'hi'
                  ? 'bg-white text-krishi-800 shadow-sm font-semibold'
                  : 'text-[#615748] hover:text-[#1c2826]'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                language === 'en'
                  ? 'bg-white text-krishi-800 shadow-sm font-semibold'
                  : 'text-[#615748] hover:text-[#1c2826]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi-en')}
              className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                language === 'hi-en'
                  ? 'bg-white text-krishi-800 shadow-sm font-semibold'
                  : 'text-[#615748] hover:text-[#1c2826]'
              }`}
            >
              Hinglish
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

