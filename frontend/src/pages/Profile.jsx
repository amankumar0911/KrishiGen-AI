import React, { useState } from 'react';
import { useFarmer } from '../context/FarmerContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  User,
  MapPin,
  Sprout,
  Layers,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

const INDIAN_STATES = [
  'Uttar Pradesh (उत्तर प्रदेश)',
  'Punjab (पंजाब)',
  'Haryana (हरियाणा)',
  'Madhya Pradesh (मध्य प्रदेश)',
  'Bihar (बिहार)',
  'Rajasthan (राजस्थान)',
  'Maharashtra (महाराष्ट्र)',
  'Gujarat (गुजरात)',
  'West Bengal (पश्चिम बंगाल)',
  'Andhra Pradesh (आंध्र प्रदेश)',
  'Karnataka (कर्नाटक)',
  'Tamil Nadu (तमिलनाडु)',
  'Odisha (ओडिशा)',
  'Telangana (तेलंगाना)',
  'Uttarakhand (उत्तराखंड)',
  'Himachal Pradesh (हिमाचल प्रदेश)'
];

const CROPS = [
  'Wheat (गेहूं)',
  'Rice (धान / चावल)',
  'Tomato (टमाटर)',
  'Potato (आलू)',
  'Mustard (सरसों)',
  'Maize (मक्का)',
  'Cotton (कपास)',
  'Sugarcane (गन्ना)',
  'Chickpea / Gram (चना)'
];

const SOIL_TYPES = [
  'Alluvial Soil (जलोढ़ मिट्टी - सबसे उपजाऊ)',
  'Black Soil (काली मिट्टी - कपास व दलहन हेतु उपयुक्त)',
  'Red & Yellow Soil (लाल व पीली मिट्टी)',
  'Sandy Loam (बलुई दोमट - आलू व सब्जियों हेतु उत्तम)',
  'Clay Loam (चिकनी दोमट - धान व गेहूं हेतु उपयुक्त)',
  'Laterite Soil (लेटराइट मिट्टी)'
];

const Profile = () => {
  const { profile, saveProfile, t } = useFarmer();
  const [formData, setFormData] = useState({
    name: profile.name || '',
    state: profile.state || 'Uttar Pradesh (उत्तर प्रदेश)',
    district: profile.district || '',
    preferred_language: profile.preferred_language || 'hi',
    primary_crop: profile.primary_crop || 'Wheat (गेहूं)',
    soil_type: profile.soil_type || 'Alluvial Soil (जलोढ़ मिट्टी - सबसे उपजाऊ)',
    farm_size_acres: profile.farm_size_acres || 2.5,
  });

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { success: bool, message: str }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await saveProfile(formData);
      if (res.success) {
        setSaveStatus({
          success: true,
          message: 'किसान प्रोफाइल सफलतापूर्वक सहेजी गई! आपकी प्राथमिकताएं अब AI सहायक और योजनाकार में सक्रिय हैं।',
        });
      } else {
        setSaveStatus({
          success: false,
          message: 'स्थानीय रूप से अपडेट किया गया (सर्वर प्रतिक्रिया में देरी)।',
        });
      }
    } catch (err) {
      setSaveStatus({ success: false, message: err.message || 'त्रुटि हुई।' });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Safety & KVK Banner */}
      <DisclaimerBanner />

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#1c2826] flex items-center gap-2">
          <User className="w-6 h-6 text-krishi-700" />
          <span>किसान प्रोफाइल एवं प्राथमिकताएं (Farmer Profile & Settings)</span>
        </h1>
        <p className="text-xs md:text-sm text-[#6b6255] mt-1">
          यह जानकारी AI सहायक को आपके खेत और मिट्टी के अनुसार सबसे सटीक सलाह देने में मदद करती है। किसी भी संवेदनशील व्यक्तिगत डेटा की आवश्यकता नहीं है।
        </p>
      </div>

      {/* Save Status Alert */}
      {saveStatus && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-start gap-2.5 border animate-fadeIn ${
            saveStatus.success
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}
        >
          {saveStatus.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-6 md:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Section 1: Basic Identity */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#1c2826] pb-2 border-b border-[#e8e2d5] flex items-center gap-2">
              <User className="w-4 h-4 text-krishi-700" />
              <span>सामान्य विवरण (Basic Info)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1c2826] mb-1">
                  किसान का नाम या उपनाम (Name / Nickname) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="उदा. रमेश कुमार"
                  className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1c2826] mb-1">
                  पसंदीदा भाषा (Preferred Language) *
                </label>
                <select
                  value={formData.preferred_language}
                  onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
                  className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500"
                >
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="en">English (अंग्रेजी)</option>
                  <option value="hi-en">Hinglish (हिंगलिश)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Farm Location & Soil */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold text-[#1c2826] pb-2 border-b border-[#e8e2d5] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-krishi-700" />
              <span>कृषि क्षेत्र एवं भूमि विवरण (Location & Soil Characteristics)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1c2826] mb-1">
                  राज्य / क्षेत्र (State / Region) *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1c2826] mb-1">
                  जिला (District)
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="उदा. वाराणसी / करनाल / इंदौर"
                  className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1c2826] mb-1">
                  मुख्य फसल (Primary Crop) *
                </label>
                <select
                  value={formData.primary_crop}
                  onChange={(e) => setFormData({ ...formData, primary_crop: e.target.value })}
                  className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500"
                >
                  {CROPS.map((crp) => (
                    <option key={crp} value={crp}>
                      {crp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1c2826] mb-1">
                  खेत का क्षेत्रफल (Farm Size in Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="1000"
                  value={formData.farm_size_acres}
                  onChange={(e) =>
                    setFormData({ ...formData, farm_size_acres: parseFloat(e.target.value) || 1 })
                  }
                  className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#1c2826] mb-1">
                मिट्टी का प्रकार (Soil Type, if known) *
              </label>
              <select
                value={formData.soil_type}
                onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500"
              >
                {SOIL_TYPES.map((soil) => (
                  <option key={soil} value={soil}>
                    {soil}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-[#f4f7f4] rounded-xl border border-[#cdddcF] text-[11px] text-[#2d6a4f] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-krishi-700 shrink-0 mt-0.5" />
            <span>
              <strong>डेटा सुरक्षा:</strong> आपकी जानकारी केवल आपके स्थानीय डिवाइस और बैकएंड SQLite डेटाबेस में सुरक्षित रखी जाती है। कोई भी व्यावसायिक या निजी डेटा तीसरे पक्ष को साझा नहीं किया जाता।
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-krishi-700 hover:bg-krishi-800 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-xs md:text-sm transition-all flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'सहेजा जा रहा है...' : 'प्राथमिकताएं सहेजें (Save Preferences)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

