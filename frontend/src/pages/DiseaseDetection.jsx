import React, { useState, useEffect, useRef } from 'react';
import { useFarmer } from '../context/FarmerContext';
import { analyzeCropImage, getSampleDiseaseCases } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  UploadCloud,
  FileImage,
  X,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  Info,
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';

const DiseaseDetection = ({ setActiveTab }) => {
  const { healthInfo } = useFarmer();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [samples, setSamples] = useState([]);
  const [activeSampleId, setActiveSampleId] = useState(null);

  const fileInputRef = useRef(null);

  // Load educational reference samples from backend
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const data = await getSampleDiseaseCases();
        setSamples(data);
      } catch (err) {
        console.warn('Could not load disease samples:', err);
      }
    };
    fetchSamples();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('कृपया केवल JPG, PNG या WebP प्रारूप की फोटो अपलोड करें।');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('फोटो का आकार 5MB से कम होना चाहिए।');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    setActiveSampleId(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const pseudoEvent = { target: { files: [file] } };
      handleFileChange(pseudoEvent);
    }
  };

  const handleClearImage = () => {
    if (previewUrl && !previewUrl.startsWith('data:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setErrorMessage(null);
    setActiveSampleId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setErrorMessage(null);
    try {
      const data = await analyzeCropImage(selectedFile);
      setResult(data);
    } catch (err) {
      setErrorMessage(err.message || 'तस्वीर का विश्लेषण करने में समस्या आई।');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectSample = (sample) => {
    setActiveSampleId(sample.id);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(sample);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Advisory Banner */}
      <DisclaimerBanner />

      {/* Page Title & Vision Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1c2826] flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-krishi-700" />
            <span>फसल पत्ती रोग जांच (Crop Leaf Disease Analysis)</span>
          </h1>
          <p className="text-xs md:text-sm text-[#6b6255] mt-1">
            प्रभावित पत्ती की स्पष्ट फोटो अपलोड करें। AI संभावित रोग, गंभीरता और तुरंत किए जाने वाले उपचार की पहचान करेगा।
          </p>
        </div>

        {/* Vision AI Status Pill */}
        <div
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            healthInfo.live_ai_configured
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}
        >
          {healthInfo.live_ai_configured ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vision AI Active</span>
            </>
          ) : (
            <>
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Vision Unconfigured (Demo / Samples Available)</span>
            </>
          )}
        </div>
      </div>

      {/* Main Grid: Upload Area & Diagnosis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Samples (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-[#1c2826] mb-2">तस्वीर अपलोड करें / Upload Leaf Photo</h2>
            <p className="text-xs text-[#736a5c] mb-4">
              अच्छी रोशनी में पत्ती के रोगग्रस्त भाग की स्पष्ट फोटो खींचें (अधिकतम 5 MB)।
            </p>

            {/* Drag & Drop Zone */}
            {!previewUrl ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#c3baa8] hover:border-krishi-600 rounded-xl p-8 text-center cursor-pointer transition-colors bg-[#f9f7f0] hover:bg-[#f4f7f4] group"
              >
                <div className="w-12 h-12 rounded-full bg-white text-krishi-700 flex items-center justify-center mx-auto mb-3 shadow-xs group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs md:text-sm font-semibold text-[#1c2826] mb-1">
                  तस्वीर चुनने के लिए क्लिक करें या ड्रैग करें
                </p>
                <p className="text-[11px] text-[#736a5c]">JPG, PNG या WebP प्रारूप (अधिकतम 5MB)</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />
              </div>
            ) : (
              /* Image Preview Card */
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-[#ded7c8] bg-black/5 aspect-4/3 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Uploaded crop leaf"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6b6255] px-1">
                  <span className="truncate max-w-[200px] font-medium">
                    {selectedFile?.name || 'Uploaded Leaf Photo'}
                  </span>
                  <span>{selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : ''}</span>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full bg-krishi-700 hover:bg-krishi-800 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>रोग पहचान विश्लेषण जारी है...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>पत्ती का विश्लेषण करें (Analyze Leaf)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Interactive Educational Sample Cases */}
          {samples.length > 0 && (
            <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-[#1c2826] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-krishi-700" />
                  <span>शैक्षिक संदर्भ केस / Educational Reference Samples</span>
                </h3>
              </div>
              <p className="text-[11px] text-[#736a5c] mb-3">
                यदि आपके पास अभी तस्वीर नहीं है, तो नीचे दिए गए प्रामाणिक केस चुनकर रिपोर्ट देखें:
              </p>
              <div className="space-y-2">
                {samples.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSample(s)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      activeSampleId === s.id
                        ? 'bg-krishi-100 border-krishi-400 font-semibold text-krishi-900'
                        : 'bg-white border-[#e5dfd3] hover:border-krishi-300 text-[#1c2826]'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-krishi-800">{s.crop_name}</p>
                      <p className="text-[11px] text-[#6b6255]">{s.disease_detected}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-krishi-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Diagnostic Report (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 md:p-6 shadow-xs space-y-5 animate-fadeIn">
              {/* Report Header */}
              <div className="pb-4 border-b border-[#e8e2d5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-krishi-700 bg-krishi-100 px-2 py-0.5 rounded-full border border-krishi-200">
                    {result.crop_name}
                  </span>
                  <h2 className="text-lg md:text-xl font-bold text-[#1c2826] mt-1">
                    {result.disease_detected}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Severity Badge */}
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      result.severity?.toLowerCase().includes('high') || result.severity?.toLowerCase().includes('severe')
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    गंभीरता: {result.severity}
                  </span>

                  {/* Confidence Badge (only shown when actually present) */}
                  {result.confidence && (
                    <span className="text-xs font-medium text-[#615748] bg-[#f0ebe0] px-2.5 py-1 rounded-full border border-[#ded7c8]">
                      {result.confidence}
                    </span>
                  )}
                </div>
              </div>

              {/* Demo Mode Notice Banner if unconfigured */}
              {result.is_demo && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-950">
                      डेमो मोड / शैक्षणिक मार्गदर्शन सूचना:
                    </span>
                    <span>
                      {result.disclaimer ||
                        'लाइव मॉडल सक्रिय करने के लिए backend/.env में GEMINI_API_KEY कॉन्फ़िगर करें। कोई कृत्रिम अनुमान नहीं लगाया गया है।'}
                    </span>
                  </div>
                </div>
              )}

              {/* Symptoms Checklist */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5c5344] mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>पहचाने गए मुख्य लक्षण (Identified Symptoms)</span>
                </h3>
                <ul className="space-y-1.5">
                  {result.symptoms?.map((sym, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-[#2b241c] flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#ece6d9]"
                    >
                      <span className="text-amber-700 font-bold shrink-0">•</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Immediate Practical Actions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-krishi-800 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-krishi-700" />
                  <span>तत्काल प्राथमिक कदम (Immediate Actions)</span>
                </h3>
                <div className="space-y-1.5">
                  {result.immediate_actions?.map((act, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-[#1c2826] bg-[#f4f7f4] p-2.5 rounded-lg border border-[#cdddcF] flex items-start gap-2 font-medium"
                    >
                      <span className="text-krishi-700 font-bold shrink-0">{idx + 1}.</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Treatment (Chemical / Organic) */}
              <div className="bg-white p-3.5 rounded-xl border border-[#ded7c8]">
                <h3 className="text-xs font-bold text-krishi-900 uppercase tracking-wider mb-1">
                  अनुशंसित दवा व खुराक (Recommended Treatment Protocol)
                </h3>
                <p className="text-xs text-[#3d362b] leading-relaxed">
                  {result.recommended_treatment}
                </p>
              </div>

              {/* Preventative Measures */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5c5344] mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-krishi-700" />
                  <span>दीर्घकालिक बचाव के उपाय (Preventative Measures)</span>
                </h3>
                <ul className="space-y-1 text-xs text-[#4b4336] list-disc list-inside bg-white p-3 rounded-xl border border-[#ded7c8]">
                  {result.preventative_measures?.map((prev, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {prev}
                    </li>
                  ))}
                </ul>
              </div>

              {/* KVK Helpline Guidance Box */}
              <div className="p-3.5 rounded-xl bg-[#f0f6f2] border border-[#a5c4a9] text-xs text-krishi-900 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <PhoneCall className="w-4 h-4 text-krishi-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-krishi-950">
                      कृषि विज्ञान केंद्र (KVK) परामर्श:
                    </span>
                    <span>{result.kvk_contact_advice}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('guide')}
                  className="shrink-0 bg-krishi-700 hover:bg-krishi-800 text-white px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-colors whitespace-nowrap"
                >
                  फसल गाइड देखें →
                </button>
              </div>
            </div>
          ) : (
            /* Empty State Guidance */
            <div className="h-full min-h-[350px] bg-[#fcfbf7] border border-dashed border-[#dcd4c3] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#f4f7f4] text-krishi-700 flex items-center justify-center mb-3">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#1c2826] mb-1">
                कोई रोग रिपोर्ट अभी तैयार नहीं है
              </h3>
              <p className="text-xs text-[#736a5c] max-w-md leading-relaxed mb-4">
                बाईं ओर से अपनी फसल की पत्ती की तस्वीर अपलोड करें या तुरंत डेमो रिपोर्ट देखने के लिए "शैक्षिक संदर्भ केस" में से किसी एक पर क्लिक करें।
              </p>
              <div className="flex items-center gap-2 text-xs text-krishi-800 font-semibold">
                <span>ICAR व कृषि विज्ञान केंद्र मानकों पर आधारित</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;

