import React, { useState, useEffect, useRef } from 'react';
import { useFarmer } from '../context/FarmerContext';
import { sendChatMessage, getChatHistory, clearChatHistory } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  Send,
  Sparkles,
  AlertCircle,
  Trash2,
  HelpCircle,
  Sprout,
  ArrowRight,
  Bot,
  User,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle,
  Clock
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'गेहूं में पीला रतुआ (Yellow Rust) के लक्षण और उपचार',
  'First irrigation (CRI stage) schedule for wheat',
  'टमाटर में पत्ती मरोड़ (Leaf Curl) रोग और सफेद मक्खी नियंत्रण',
  'धान में झुलसा रोग (Blast) की रोकथाम',
  'DAP और यूरिया खाद का सही अनुपात क्या होना चाहिए?',
  'मिट्टी की नमी जांचने का आसान देसी तरीका क्या है?'
];

const GROWTH_STAGES = [
  'बुवाई पूर्व / खेत की तैयारी (Land Preparation)',
  'अंकुरण एवं प्रारंभिक अवस्था (Germination & Seedling)',
  'कल्ले फूटना / वानस्पतिक वृद्धि (Tillering & Vegetative)',
  'फूल एवं परागण अवस्था (Flowering & Pollination)',
  'फल / दाना भराव अवस्था (Fruit / Grain Filling)',
  'परिपक्वता एवं कटाई अवस्था (Maturity & Harvesting)'
];

const Assistant = () => {
  const { profile, language, healthInfo } = useFarmer();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Farming context filters
  const [selectedCrop, setSelectedCrop] = useState(profile.primary_crop || 'Wheat (गेहूं)');
  const [selectedStage, setSelectedStage] = useState(GROWTH_STAGES[2]);
  const [selectedSoil, setSelectedSoil] = useState(profile.soil_type || 'Alluvial Soil');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const history = await getChatHistory();
      if (history && history.length > 0) {
        setMessages(
          history.map((h) => ({
            id: h.id,
            sender: h.sender,
            text: h.message,
            isDemo: h.is_demo,
            timestamp: new Date(h.created_at || Date.now()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }))
        );
      } else {
        // Welcoming initial assistant prompt
        setMessages([
          {
            id: 'welcome',
            sender: 'assistant',
            text:
              `🌾 **राम राम ${profile.name}! मैं आपका KrishiGen AI कृषि सहायक हूँ।**\n\n` +
              `आप मुझसे अपनी मुख्य फसल **${selectedCrop}** या किसी भी अन्य फसल के बारे में सवाल पूछ सकते हैं।\n\n` +
              `• **रोग व कीट निदान:** पत्ती पीली होना, धब्बे, कीड़ों का प्रकोप।\n` +
              `• **खाद एवं सिंचाई:** NPK अनुपात, यूरिया की सही खुराक, पानी का समय।\n` +
              `• **मौसम अनुसार सावधानियां:** पाला, अत्यधिक ठंड या गर्मी से बचाव।\n\n` +
              `नीचे दिए गए सुझावों में से चुनें या अपना सवाल टाइप करें:`,
            isDemo: !healthInfo.live_ai_configured,
            suggestions: SUGGESTED_QUESTIONS.slice(0, 3),
            followUps: ['आपकी फसल में अभी क्या समस्या दिखाई दे रही है?'],
          },
        ]);
      }
    } catch (err) {
      console.warn('Could not load history:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (queryText) => {
    const textToSend = (queryText || inputMessage).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await sendChatMessage({
        message: textToSend,
        crop_type: selectedCrop,
        growth_stage: selectedStage,
        soil_type: selectedSoil,
        region: profile.state,
        language: language,
      });

      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: response.reply,
        isDemo: response.is_demo,
        suggestions: response.suggestions || [],
        followUps: response.follow_up_questions || [],
        disclaimer: response.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: `⚠️ **त्रुटि:** सवाल का जवाब प्राप्त नहीं हो सका (${err.message})। कृपया पुनः प्रयास करें।`,
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (window.confirm('क्या आप बातचीत का इतिहास साफ़ करना चाहते हैं?')) {
      try {
        await clearChatHistory();
        setMessages([]);
        loadHistory();
      } catch (err) {
        console.error('Failed to clear history:', err);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-h-[850px] bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl shadow-xs overflow-hidden">
      {/* Assistant Header & Context Bar */}
      <div className="bg-white border-b border-[#e8e2d5] p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-krishi-700 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1c2826]">Krishi AI Assistant</h2>
                {healthInfo.live_ai_configured ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Live Generative AI
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    Demo Knowledge Base
                  </span>
                )}
              </div>
              <p className="text-xs text-[#736a5c]">
                फसल संदर्भ: <span className="font-semibold text-krishi-800">{selectedCrop}</span> • {profile.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                showFilters
                  ? 'bg-krishi-100 text-krishi-800 border-krishi-300'
                  : 'bg-[#fcfbf7] text-[#615748] border-[#ded7c8] hover:bg-[#efe9dc]'
              }`}
              title="Toggle Farm Context Parameters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">फसल स्थिति बदलें</span>
            </button>

            <button
              onClick={handleClear}
              className="p-2 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
              title="Clear Chat History"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Collapsible Agricultural Context Bar */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-[#f0ebe0] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-fadeIn">
            <div>
              <label className="block text-[#615748] font-medium mb-1">फसल (Crop)</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-[#f9f7f0] border border-[#dcd4c3] rounded-lg p-2 text-[#1c2826] focus:outline-krishi-500"
              >
                <option value="Wheat (गेहूं)">Wheat (गेहूं)</option>
                <option value="Rice (धान)">Rice (धान)</option>
                <option value="Tomato (टमाटर)">Tomato (टमाटर)</option>
                <option value="Potato (आलू)">Potato (आलू)</option>
                <option value="Mustard (सरसों)">Mustard (सरसों)</option>
                <option value="Other">अन्य (General Agriculture)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#615748] font-medium mb-1">वृद्धि अवस्था (Growth Stage)</label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full bg-[#f9f7f0] border border-[#dcd4c3] rounded-lg p-2 text-[#1c2826] focus:outline-krishi-500"
              >
                {GROWTH_STAGES.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#615748] font-medium mb-1">मिट्टी (Soil Type)</label>
              <select
                value={selectedSoil}
                onChange={(e) => setSelectedSoil(e.target.value)}
                className="w-full bg-[#f9f7f0] border border-[#dcd4c3] rounded-lg p-2 text-[#1c2826] focus:outline-krishi-500"
              >
                <option value="Alluvial Soil (जलोढ़ मिट्टी)">Alluvial (जलोढ़)</option>
                <option value="Black Soil (काली मिट्टी)">Black Soil (काली)</option>
                <option value="Sandy Loam (बलुई दोमट)">Sandy Loam (बलुई दोमट)</option>
                <option value="Clay Loam (चिकनी दोमट)">Clay Loam (चिकनी दोमट)</option>
                <option value="Red Soil (लाल मिट्टी)">Red Soil (लाल)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#fbfaf5]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-krishi-700 text-white'
                    : 'bg-[#2d6a4f] text-[#74c69d]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs md:text-sm shadow-xs ${
                  isUser
                    ? 'bg-krishi-700 text-white rounded-tr-none'
                    : 'bg-white text-[#1c2826] border border-[#e5dfd3] rounded-tl-none'
                }`}
              >
                {/* Demo Mode Notice Badge */}
                {!isUser && msg.isDemo && (
                  <div className="mb-2 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>Demo Mode Knowledge Response</span>
                  </div>
                )}

                {/* Formatted Text Body */}
                <div className="whitespace-pre-wrap leading-relaxed space-y-1.5 font-normal">
                  {msg.text.split('\n').map((line, idx) => {
                    if (line.startsWith('•') || line.startsWith('-')) {
                      return (
                        <div key={idx} className="flex items-start gap-1.5 ml-2">
                          <span className="text-krishi-600 font-bold">•</span>
                          <span>{line.replace(/^[•-]\s*/, '')}</span>
                        </div>
                      );
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <p key={idx} className="font-bold text-krishi-900 mt-2">
                          {line.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    return <p key={idx}>{line}</p>;
                  })}
                </div>

                {/* Follow up questions suggested by assistant */}
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#f0ebe0] text-xs text-[#736a5c]">
                    <span className="font-semibold text-[#5c5344] block mb-1">
                      🔍 विस्तृत समाधान के लिए बताएं:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[#615748]">
                      {msg.followUps.map((fu, fIdx) => (
                        <li key={fIdx}>{fu}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interactive Suggestion Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        className="bg-[#f4f7f4] hover:bg-krishi-100 text-krishi-800 border border-[#cdddcF] px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors text-left flex items-center gap-1"
                      >
                        <span>{sug}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-krishi-600" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Disclaimer */}
                {msg.disclaimer && (
                  <p className="mt-2 text-[10px] text-[#8c8273] italic">
                    {msg.disclaimer}
                  </p>
                )}

                <div
                  className={`mt-1.5 text-[10px] ${
                    isUser ? 'text-white/70 text-right' : 'text-[#9c9384]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Spinner Indicator */}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2d6a4f] text-[#74c69d] flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-white border border-[#e5dfd3] rounded-2xl rounded-tl-none p-3.5 text-xs text-[#736a5c] flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-krishi-600 animate-spin" />
              <span>Krishi AI फसल समाधान तैयार कर रहा है...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Carousel */}
      <div className="px-4 py-2 bg-[#f6f3eb] border-t border-[#e8e2d5] overflow-x-auto flex items-center gap-2 text-xs no-scrollbar">
        <span className="text-[11px] font-semibold text-[#6b6255] whitespace-nowrap shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-krishi-600" />
          शीघ्र प्रश्न:
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={loading}
            className="whitespace-nowrap bg-white hover:bg-[#efe9dc] text-[#423b30] border border-[#ded7c8] px-3 py-1 rounded-full text-xs transition-colors shrink-0 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Message Form */}
      <div className="p-3.5 bg-white border-t border-[#e8e2d5]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="अपनी फसल का सवाल पूछें (उदा. गेहूं में पहली सिंचाई कब करें?)..."
            disabled={loading}
            className="flex-1 bg-[#fcfbf7] border border-[#dcd4c3] rounded-xl px-4 py-2.5 text-xs md:text-sm text-[#1c2826] focus:outline-none focus:ring-2 focus:ring-krishi-500/30 focus:border-krishi-600 transition-all placeholder:text-[#9e9483]"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="bg-krishi-700 hover:bg-krishi-800 disabled:opacity-40 text-white font-medium p-2.5 md:px-5 md:py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden md:inline text-xs md:text-sm font-semibold">पूछें</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;

