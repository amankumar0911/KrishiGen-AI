import React from 'react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  Info,
  GraduationCap,
  Code2,
  Cpu,
  Database,
  ShieldCheck,
  PhoneCall,
  ExternalLink,
  Sprout,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Sparkles
} from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Advisory */}
      <DisclaimerBanner />

      {/* Hero Header */}
      <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-krishi-700 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-krishi-700 bg-krishi-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-krishi-200">
              B.Tech CSE AI/ML Capstone Project
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-[#1c2826] mt-1">
              KrishiGen AI — Smart Farming Assistant
            </h1>
          </div>
        </div>

        <p className="text-xs md:text-sm text-[#4b4336] leading-relaxed mt-3">
          <strong>KrishiGen AI</strong> is a practical, full-stack artificial intelligence web application developed specifically for Indian farmers. The project addresses the real-world gap where smallholder farmers face challenges accessing immediate, localized, and understandable agricultural advice during critical crop growth stages.
        </p>
      </div>

      {/* Problem Statement & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 shadow-xs">
          <h2 className="text-sm font-bold text-[#1c2826] mb-2 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-rose-600" />
            <span>Problem Statement</span>
          </h2>
          <p className="text-xs text-[#554b3c] leading-relaxed">
            In rural India, sudden pest outbreaks, fungal blights, and erratic weather can reduce crop yields by 20% to 50%. While advanced agritech dashboards exist, they often rely on complex English interfaces, expensive subscriptions, and generic advice disconnected from local cropping cycles (Kharif, Rabi, Zaid).
          </p>
        </div>

        <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 shadow-xs">
          <h2 className="text-sm font-bold text-[#1c2826] mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-krishi-700" />
            <span>The KrishiGen AI Solution</span>
          </h2>
          <p className="text-xs text-[#554b3c] leading-relaxed">
            KrishiGen AI provides an accessible, calming interface where farmers can ask questions in Hindi, English, or Hinglish, analyze leaf diseases with vision AI, follow scientific stage-wise irrigation schedules, and organize seasonal farm tasks with SQLite persistent tracking.
          </p>
        </div>
      </div>

      {/* Technology Stack & Architecture */}
      <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#1c2826] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-krishi-700" />
          <span>System Architecture & Technology Stack</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-[#ded7c8]">
            <h3 className="font-bold text-krishi-800 mb-1">Frontend</h3>
            <p className="text-[#554b3c]">
              • React.js (Vite)<br />
              • Tailwind CSS<br />
              • Lucide Icons<br />
              • Recharts Visualization
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#ded7c8]">
            <h3 className="font-bold text-krishi-800 mb-1">Backend API</h3>
            <p className="text-[#554b3c]">
              • Python 3.11+<br />
              • FastAPI Framework<br />
              • Pydantic v2 Schemas<br />
              • Uvicorn ASGI Server
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#ded7c8]">
            <h3 className="font-bold text-krishi-800 mb-1">AI / Vision Engine</h3>
            <p className="text-[#554b3c]">
              • Google Gemini Vision API<br />
              • Multi-turn Gemini Chat<br />
              • Pre-configured Demo Mode<br />
              • Server-side API Key Security
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#ded7c8]">
            <h3 className="font-bold text-krishi-800 mb-1">Persistent Storage</h3>
            <p className="text-[#554b3c]">
              • SQLite Database<br />
              • SQLAlchemy 2.0 ORM<br />
              • Activity CRUD Tracking<br />
              • Stored Farmer Profile
            </p>
          </div>
        </div>

        {/* Engineering Highlights */}
        <div className="mt-4 pt-4 border-t border-[#f0ebe0] space-y-2 text-xs text-[#4b4336]">
          <h3 className="font-bold text-[#1c2826]">Key Engineering & Design Principles:</h3>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>
              <strong>Zero Key Exposure:</strong> API credentials strictly live in the backend <code className="bg-[#f0ebe0] px-1 py-0.5 rounded text-[11px]">.env</code> file. The frontend never possesses or exposes private keys.
            </li>
            <li>
              <strong>Graceful Demo Mode:</strong> If no external API key is provided, the system does not crash or display broken cards. It transparently shifts to an authentic agricultural knowledge base with clear labels.
            </li>
            <li>
              <strong>Safety-First Extensibility:</strong> Disease analysis emphasizes preliminary guidance, direct KVK helpline access, and ethical AI plant pathology warnings.
            </li>
            <li>
              <strong>Accessible Farmer Interface:</strong> Designed with warm, high-contrast, earthy colors and zero clutter for seamless usability on both smartphones and desktop displays.
            </li>
          </ul>
        </div>
      </div>

      {/* Official Government & Research References */}
      <div className="bg-[#f0f6f2] border border-[#a5c4a9] rounded-2xl p-5 md:p-6 text-xs text-krishi-900 space-y-3">
        <h2 className="text-sm font-bold text-krishi-950 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-krishi-700" />
          <span>Indian Agricultural References & Extension Portals</span>
        </h2>
        <p className="text-[#2d6a4f] leading-relaxed">
          The recommendations, pest thresholds, and irrigation timelines in KrishiGen AI are compiled in accordance with standard extension packages published by:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-white p-3 rounded-xl border border-[#cdddcF]">
            <strong className="block text-[#1b4332]">ICAR (Indian Council of Agricultural Research)</strong>
            <span className="text-[#52796f] text-[11px]">National apex body for coordinating agricultural research & education.</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#cdddcF]">
            <strong className="block text-[#1b4332]">Kisan Call Centre (KCC)</strong>
            <span className="text-[#52796f] text-[11px]">Toll-free 1800-180-1551 for 24/7 expert farmer queries in 22 local languages.</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#cdddcF]">
            <strong className="block text-[#1b4332]">KVK Portal (Krishi Vigyan Kendra)</strong>
            <span className="text-[#52796f] text-[11px]">730+ district-level farm science centers across all Indian states.</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#cdddcF]">
            <strong className="block text-[#1b4332]">Soil Health Card Scheme</strong>
            <span className="text-[#52796f] text-[11px]">Scientific assessment of 12 soil nutrient parameters for balanced fertilization.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

