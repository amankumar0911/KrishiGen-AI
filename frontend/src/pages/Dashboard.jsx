import React, { useState, useEffect } from 'react';
import { useFarmer } from '../context/FarmerContext';
import { getActivities, toggleActivity } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  MessageSquare,
  ScanLine,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sprout,
  Droplets,
  Sun,
  ShieldAlert,
  Sparkles,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
  const { profile, season, t, healthInfo } = useFarmer();
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(null);

  const fetchRecentActivities = async () => {
    try {
      setLoadingActivities(true);
      const data = await getActivities();
      setActivities(data.slice(0, 4)); // Show recent 4
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const handleToggle = async (id) => {
    try {
      setToggleLoading(id);
      const updated = await toggleActivity(id);
      setActivities((prev) =>
        prev.map((act) => (act.id === id ? { ...act, status: updated.status } : act))
      );
    } catch (err) {
      console.error('Error toggling activity:', err);
    } finally {
      setToggleLoading(null);
    }
  };

  const completedCount = activities.filter((a) => a.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Safety & KVK Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative leaf pattern */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-8">
          <Sprout className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#40916c] text-[#f4f7f4] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {season.tag}
            </span>
            <span className="text-xs text-[#a5c4a9] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {profile.district || profile.state || 'उत्तर प्रदेश'}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            {t.welcomeBack}, {profile.name}!
          </h1>

          <p className="text-sm md:text-base text-[#cdddcF] leading-relaxed mb-6">
            आपकी मुख्य फसल <strong className="text-white underline decoration-[#74c69d] decoration-2 underline-offset-4">{profile.primary_crop}</strong> के लिए वर्तमान रबी मौसम अनुकूल है। समय पर सिंचाई, संतुलित खाद और रोग निगरानी से भरपूर पैदावार सुनिश्चित करें।
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('assistant')}
              className="bg-[#74c69d] hover:bg-[#52b788] text-[#081c15] font-semibold px-4 py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>कृषि AI से सवाल पूछें</span>
            </button>
            <button
              onClick={() => setActiveTab('disease')}
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-2 transition-all border border-white/20"
            >
              <ScanLine className="w-4 h-4 text-[#74c69d]" />
              <span>पत्ती की तस्वीर जांचें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Season Reminder & Field Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Seasonal Reminder */}
        <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1c2826]">{season.name}</h3>
              <p className="text-xs text-[#736a5c]">मौसमी कृषि सलाह</p>
            </div>
          </div>
          <p className="text-xs text-[#4b4336] leading-relaxed">
            {season.description}
          </p>
          <div className="mt-3 pt-3 border-t border-[#f0ebe0] flex items-center justify-between text-xs text-[#615748]">
            <span>प्रमुख फसलें:</span>
            <span className="font-semibold text-krishi-800">{season.activeCrops.join(', ')}</span>
          </div>
        </div>

        {/* Soil & Farm Condition */}
        <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1c2826]">मृदा एवं खेत विवरण</h3>
              <p className="text-xs text-[#736a5c]">खेत प्रोफाइल</p>
            </div>
          </div>
          <p className="text-xs text-[#4b4336] leading-relaxed">
            प्रकार: <strong className="text-krishi-800">{profile.soil_type}</strong>
            <br />
            खेत का आकार: <strong className="text-krishi-800">{profile.farm_size_acres || 2} एकड़</strong>
          </p>
          <div className="mt-3 pt-3 border-t border-[#f0ebe0] flex items-center justify-between text-xs">
            <span className="text-[#615748]">मृदा स्वास्थ्य कार्ड:</span>
            <button
              onClick={() => setActiveTab('profile')}
              className="text-krishi-700 font-semibold hover:underline"
            >
              विवरण बदलें →
            </button>
          </div>
        </div>

        {/* Disease Alert & Advisory */}
        <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-100">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1c2826]">रोग निगरानी चेतावनी</h3>
              <p className="text-xs text-[#736a5c]">क्षेत्रीय कीट/फफूंद अलर्ट</p>
            </div>
          </div>
          <p className="text-xs text-[#4b4336] leading-relaxed">
            शीत ऋतु के दौरान गेहूं में <strong>पीला रतुआ (Yellow Rust)</strong> और आलू/टमाटर में <strong>झुलसा रोग (Blight)</strong> के प्रसार की संभावना अधिक रहती है।
          </p>
          <div className="mt-3 pt-3 border-t border-[#f0ebe0] flex items-center justify-between text-xs">
            <span className="text-[#615748]">पत्ती का रंग बदल रहा है?</span>
            <button
              onClick={() => setActiveTab('disease')}
              className="text-rose-700 font-semibold hover:underline"
            >
              स्कैन करें →
            </button>
          </div>
        </div>
      </div>

      {/* 4 Feature Quick Navigation Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#1c2826]">त्वरित सेवाएं / Quick Tools</h2>
          <span className="text-xs text-[#736a5c]">सभी सुविधाएं सक्रिय हैं</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: AI Assistant */}
          <div
            onClick={() => setActiveTab('assistant')}
            className="group bg-[#fcfbf7] border border-[#e8e2d5] hover:border-krishi-400 rounded-xl p-5 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-krishi-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-[#1c2826] mb-1">कृषि AI सहायक</h3>
              <p className="text-xs text-[#6b6255] leading-relaxed">
                हिंदी या इंग्लिश में खेती, खाद, सिंचाई और दवाओं के बारे में सीधे सवाल पूछें।
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-krishi-700 group-hover:translate-x-1 transition-transform">
              <span>बातचीत शुरू करें</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2: Crop Disease */}
          <div
            onClick={() => setActiveTab('disease')}
            className="group bg-[#fcfbf7] border border-[#e8e2d5] hover:border-krishi-400 rounded-xl p-5 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ScanLine className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-[#1c2826] mb-1">फसल रोग विश्लेषण</h3>
              <p className="text-xs text-[#6b6255] leading-relaxed">
                पत्ती की फोटो अपलोड करें और संभावित बीमारी, रोकथाम व जैविक/रासायनिक उपचार जानें।
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-700 group-hover:translate-x-1 transition-transform">
              <span>फोटो अपलोड करें</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3: Crop Guide */}
          <div
            onClick={() => setActiveTab('guide')}
            className="group bg-[#fcfbf7] border border-[#e8e2d5] hover:border-krishi-400 rounded-xl p-5 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-[#1c2826] mb-1">फसल मार्गदर्शिका</h3>
              <p className="text-xs text-[#6b6255] leading-relaxed">
                गेहूं, धान, टमाटर, और आलू के लिए बुवाई से कटाई तक सम्पूर्ण वैज्ञानिक जानकारी।
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>गाइड देखें</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 4: Planner */}
          <div
            onClick={() => setActiveTab('planner')}
            className="group bg-[#fcfbf7] border border-[#e8e2d5] hover:border-krishi-400 rounded-xl p-5 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-[#1c2826] mb-1">कृषि योजनाकार</h3>
              <p className="text-xs text-[#6b6255] leading-relaxed">
                सिंचाई, खाद डालने और छिड़काव की तारीखें नोट करें और कार्य पूरा होने पर टिक लगाएं।
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-700 group-hover:translate-x-1 transition-transform">
              <span>योजना खोलें</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Saved Farming Activities Section */}
      <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1c2826]">हाल ही की कृषि गतिविधियां</h2>
              <span className="text-[10px] font-semibold bg-[#efeae0] text-[#6b6255] px-2 py-0.5 rounded-full border border-[#ded7c8]">
                स्थानीय SQLite डेटाबेस
              </span>
            </div>
            <p className="text-xs text-[#736a5c]">
              आपके द्वारा सहेजी गई योजनाएं और पूर्ण किए गए कृषि कार्य
            </p>
          </div>
          <button
            onClick={() => setActiveTab('planner')}
            className="text-xs font-semibold text-krishi-700 hover:text-krishi-800 flex items-center gap-1 self-end sm:self-auto"
          >
            <span>सभी गतिविधियां देखें ({activities.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingActivities ? (
          <div className="py-8 text-center text-xs text-[#736a5c]">
            गतिविधियां लोड हो रही हैं...
          </div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#736a5c] bg-[#f9f7f0] rounded-xl border border-dashed border-[#ded7c8]">
            अभी कोई गतिविधि सहेजी नहीं गई है। योजनाकार में नई गतिविधि जोड़ें।
          </div>
        ) : (
          <div className="space-y-2.5">
            {activities.map((act) => {
              const isCompleted = act.status === 'completed';
              return (
                <div
                  key={act.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-3 ${
                    isCompleted
                      ? 'bg-[#f4f7f4] border-[#cdddcF]'
                      : 'bg-white border-[#e5dfd3] hover:border-krishi-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggle(act.id)}
                      disabled={toggleLoading === act.id}
                      className={`mt-0.5 p-1 rounded-full transition-colors ${
                        isCompleted
                          ? 'text-krishi-700 hover:text-krishi-800'
                          : 'text-[#9e9483] hover:text-krishi-700'
                      }`}
                      title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                    >
                      <CheckCircle2
                        className={`w-5 h-5 ${isCompleted ? 'fill-krishi-100' : ''}`}
                      />
                    </button>
                    <div>
                      <h4
                        className={`text-sm font-medium ${
                          isCompleted ? 'line-through text-[#6b6255]' : 'text-[#1c2826]'
                        }`}
                      >
                        {act.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#736a5c]">
                        <span className="font-semibold text-krishi-800">{act.crop}</span>
                        <span>•</span>
                        <span className="bg-[#f0ebe0] px-2 py-0.5 rounded text-[#5c5344]">
                          {act.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#9e9483]" />
                          {act.activity_date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {isCompleted ? 'पूर्ण (Completed)' : 'लंबित (Pending)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

