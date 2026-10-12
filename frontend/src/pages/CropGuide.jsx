import React, { useState, useEffect } from 'react';
import { getCrops } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  BookOpen,
  Search,
  Droplets,
  Thermometer,
  CloudRain,
  Layers,
  Bug,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Info,
  Calendar,
  Sparkles,
  Sprout
} from 'lucide-react';

const CropGuide = () => {
  const [crops, setCrops] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState('wheat');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('irrigation'); // irrigation, nutrients, diseases, precautions
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        const data = await getCrops();
        setCrops(data);
        if (data.length > 0) {
          setSelectedCropId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load crops:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  const filteredCrops = crops.filter((crop) => {
    const q = searchQuery.toLowerCase();
    const nameMatch =
      crop.name_en.toLowerCase().includes(q) ||
      crop.name_hi.toLowerCase().includes(q) ||
      crop.season.toLowerCase().includes(q);

    const diseaseMatch = crop.common_diseases?.some(
      (d) => d.name.toLowerCase().includes(q) || d.symptoms.toLowerCase().includes(q)
    );

    const pestMatch = crop.common_pests?.some(
      (p) => p.name.toLowerCase().includes(q) || p.symptoms.toLowerCase().includes(q)
    );

    return nameMatch || diseaseMatch || pestMatch;
  });

  const currentCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Disclaimer */}
      <DisclaimerBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1c2826] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-krishi-700" />
            <span>फसल मार्गदर्शिका (Crop Care Guide)</span>
          </h1>
          <p className="text-xs md:text-sm text-[#6b6255] mt-1">
            गेहूं, धान, टमाटर और आलू के लिए बुवाई, संतुलित पोषण, क्रांतिक सिंचाई और रोग सुरक्षा का संपूर्ण वैज्ञानिक विवरण।
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8a7f6e] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="फसल, रोग या कीट खोजें..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#dcd4c3] rounded-xl text-xs text-[#1c2826] focus:outline-none focus:ring-2 focus:ring-krishi-500/30"
          />
        </div>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filteredCrops.map((crop) => {
          const isSelected = crop.id === selectedCropId;
          return (
            <button
              key={crop.id}
              onClick={() => setSelectedCropId(crop.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap border shrink-0 ${
                isSelected
                  ? 'bg-krishi-700 text-white border-krishi-800 shadow-xs'
                  : 'bg-white hover:bg-[#efe9dc] text-[#554b3c] border-[#ded7c8]'
              }`}
            >
              <Sprout className={`w-4 h-4 ${isSelected ? 'text-[#74c69d]' : 'text-krishi-600'}`} />
              <span>
                {crop.name_hi} ({crop.name_en})
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-[#2d6a4f] text-[#cdddcF]' : 'bg-[#f0ebe0] text-[#736a5c]'
                }`}
              >
                {crop.season.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {currentCrop ? (
        <div className="space-y-6">
          {/* Crop Profile Header Card */}
          <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 md:p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e8e2d5]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-bold text-[#1c2826]">
                    {currentCrop.name_hi} ({currentCrop.name_en})
                  </h2>
                  <span className="text-xs italic text-[#736a5c]">
                    {currentCrop.botanical_name}
                  </span>
                </div>
                <p className="text-xs text-[#6b6255] mt-1">
                  मौसम: <strong className="text-krishi-800">{currentCrop.season}</strong> • बुवाई: {currentCrop.sowing_period} • कटाई: {currentCrop.harvest_period}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-[#f4f7f4] text-krishi-800 border border-[#cdddcF] font-semibold">
                  {currentCrop.category}
                </span>
              </div>
            </div>

            {/* Environmental Requirements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="bg-white p-3.5 rounded-xl border border-[#ded7c8]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#6b6255] mb-1">
                  <Thermometer className="w-4 h-4 text-amber-600" />
                  <span>तापमान (Temperature)</span>
                </div>
                <p className="text-xs text-[#1c2826] font-medium leading-relaxed">
                  {currentCrop.temperature_range}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#ded7c8]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#6b6255] mb-1">
                  <CloudRain className="w-4 h-4 text-blue-600" />
                  <span>जल / वर्षा (Water Need)</span>
                </div>
                <p className="text-xs text-[#1c2826] font-medium leading-relaxed">
                  {currentCrop.rainfall}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#ded7c8]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#6b6255] mb-1">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>उपयुक्त मिट्टी (Soil Types)</span>
                </div>
                <p className="text-xs text-[#1c2826] font-medium leading-relaxed">
                  {currentCrop.soil_types.join(', ')}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#ded7c8]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#6b6255] mb-1">
                  <Droplets className="w-4 h-4 text-teal-600" />
                  <span>मिट्टी का pH मान (Soil pH)</span>
                </div>
                <p className="text-xs text-[#1c2826] font-medium leading-relaxed">
                  {currentCrop.soil_ph}
                </p>
              </div>
            </div>
          </div>

          {/* Sub-Section Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#ded7c8] pb-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('irrigation')}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'irrigation'
                  ? 'border-krishi-700 text-krishi-800 bg-[#f4f7f4]'
                  : 'border-transparent text-[#736a5c] hover:text-[#1c2826]'
              }`}
            >
              💧 क्रांतिक सिंचाई अनुसूची (Irrigation)
            </button>
            <button
              onClick={() => setActiveTab('nutrients')}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'nutrients'
                  ? 'border-krishi-700 text-krishi-800 bg-[#f4f7f4]'
                  : 'border-transparent text-[#736a5c] hover:text-[#1c2826]'
              }`}
            >
              🌱 संतुलित पोषण व खाद (Nutrient Management)
            </button>
            <button
              onClick={() => setActiveTab('diseases')}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'diseases'
                  ? 'border-krishi-700 text-krishi-800 bg-[#f4f7f4]'
                  : 'border-transparent text-[#736a5c] hover:text-[#1c2826]'
              }`}
            >
              🛡️ प्रमुख रोग व कीट नियंत्रण (Pests & Diseases)
            </button>
            <button
              onClick={() => setActiveTab('precautions')}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'precautions'
                  ? 'border-krishi-700 text-krishi-800 bg-[#f4f7f4]'
                  : 'border-transparent text-[#736a5c] hover:text-[#1c2826]'
              }`}
            >
              ⚠️ अवस्था-वार सावधानियां (Stage Precautions)
            </button>
          </div>

          {/* Tab 1: Irrigation Schedule */}
          {activeTab === 'irrigation' && (
            <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1c2826]">
                  सिंचाई की क्रांतिक अवस्थाएं (Critical Irrigation Schedule)
                </h3>
                <p className="text-xs text-[#736a5c] mt-0.5">
                  इन अवस्थाओं पर नमी की कमी होने से फसल की उपज में भारी गिरावट आ सकती है।
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f4f1e8] text-[#554b3c] border-b border-[#ded7c8]">
                      <th className="p-3 font-semibold">अवस्था (Stage)</th>
                      <th className="p-3 font-semibold">समय (Timing)</th>
                      <th className="p-3 font-semibold">महत्व (Criticality)</th>
                      <th className="p-3 font-semibold">विशेष निर्देश (Notes)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ece6d9]">
                    {currentCrop.irrigation_schedule?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/60 transition-colors">
                        <td className="p-3 font-semibold text-[#1c2826]">{item.stage}</td>
                        <td className="p-3 text-[#554b3c]">{item.timing}</td>
                        <td className="p-3">
                          {item.critical ? (
                            <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                              अत्यंत आवश्यक (Critical)
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded text-[10px]">
                              सामान्य (Optional)
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[#4b4336] leading-relaxed">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Nutrient Management */}
          {activeTab === 'nutrients' && (
            <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 md:p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#1c2826]">
                  संतुलित उर्वरक एवं खाद प्रबंधन (Nutrient Management)
                </h3>
                <p className="text-xs text-[#736a5c] mt-0.5">
                  सिफारिश किया गया N:P:K अनुपात: <strong className="text-krishi-800">{currentCrop.nutrient_management?.npk_ratio}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#ded7c8]">
                  <h4 className="text-xs font-bold text-krishi-800 uppercase tracking-wider mb-2">
                    जैविक खाद (Organic Manure / FYM)
                  </h4>
                  <p className="text-xs text-[#3d362b] leading-relaxed">
                    {currentCrop.nutrient_management?.organic}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ded7c8]">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                    सूक्ष्म पोषक तत्व (Micronutrients)
                  </h4>
                  <p className="text-xs text-[#3d362b] leading-relaxed">
                    {currentCrop.nutrient_management?.micronutrients}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#1c2826] uppercase tracking-wider mb-2">
                  उर्वरक देने की समय सारणी (Application Schedule)
                </h4>
                <div className="space-y-2">
                  {currentCrop.nutrient_management?.fertilizer_schedule?.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-[#ded7c8] text-xs text-[#2e271e] flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-krishi-100 text-krishi-800 font-bold shrink-0 flex items-center justify-center text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Pests & Diseases */}
          {activeTab === 'diseases' && (
            <div className="space-y-6">
              {/* Diseases */}
              <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#1c2826] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>प्रमुख रोग एवं उपचार (Common Diseases & Treatments)</span>
                </h3>

                <div className="space-y-3">
                  {currentCrop.common_diseases?.map((dis, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-xl border border-[#ded7c8] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-rose-900">{dis.name}</h4>
                        <span className="text-[10px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded border border-rose-200">
                          फंगल / बैक्टीरियल रोग
                        </span>
                      </div>
                      <p className="text-xs text-[#4b4336] leading-relaxed">
                        <strong>लक्षण:</strong> {dis.symptoms}
                      </p>
                      <p className="text-xs text-[#3a5a40] leading-relaxed">
                        <strong>बचाव:</strong> {dis.prevention}
                      </p>
                      <div className="p-2.5 rounded-lg bg-[#f4f7f4] border border-[#cdddcF] text-xs text-krishi-900 font-medium">
                        <strong>रासायनिक/जैविक उपचार:</strong> {dis.treatment}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pests */}
              <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#1c2826] flex items-center gap-2">
                  <Bug className="w-5 h-5 text-amber-600" />
                  <span>हानिकारक कीट एवं रोकथाम (Pest Management)</span>
                </h3>

                <div className="space-y-3">
                  {currentCrop.common_pests?.map((pst, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-xl border border-[#ded7c8] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-amber-900">{pst.name}</h4>
                        <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded border border-amber-200">
                          कीट प्रकोप
                        </span>
                      </div>
                      <p className="text-xs text-[#4b4336] leading-relaxed">
                        <strong>लक्षण व क्षति:</strong> {pst.symptoms}
                      </p>
                      <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-amber-950 font-medium">
                        <strong>नियंत्रण उपाय:</strong> {pst.management}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Growth Stage Precautions */}
          {activeTab === 'precautions' && (
            <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1c2826]">
                  विकास अवस्था के अनुसार जरूरी सावधानियां (Stage Precautions)
                </h3>
                <p className="text-xs text-[#736a5c] mt-0.5">
                  प्रत्येक चरण में इन सावधानियों को बरतकर फसल हानि से बचें।
                </p>
              </div>

              <div className="space-y-3">
                {currentCrop.growth_stage_precautions?.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-xl border border-[#ded7c8] flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-krishi-700 font-bold shrink-0 flex items-center justify-center text-xs border border-emerald-200">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1c2826]">{stage.stage}</h4>
                      <p className="text-xs text-[#554b3c] leading-relaxed mt-1">
                        {stage.precautions}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Distinction: General Educational vs Regional Advice */}
          <div className="bg-[#f0f6f2] border border-[#a5c4a9] rounded-2xl p-4 md:p-5 text-xs text-krishi-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-krishi-950">
              <Info className="w-4 h-4 text-krishi-700" />
              <span>क्षेत्रीय कृषि विश्वविद्यालय परामर्श (Regional Agricultural Context)</span>
            </div>
            <p className="leading-relaxed text-[#23533e]">
              {currentCrop.regional_notes}
            </p>
            <p className="text-[11px] text-[#40916c] italic">
              * यह जानकारी सामान्य वैज्ञानिक मार्गदर्शिका है। अपने जिले की जलवायु और अनुमोदित किस्मों की पुष्टि स्थानीय कृषि विज्ञान केंद्र (KVK) से अवश्य करें।
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CropGuide;

