import React, { useState, useEffect } from 'react';
import { useFarmer } from '../context/FarmerContext';
import {
  getActivities,
  getActivityStats,
  createActivity,
  updateActivity,
  toggleActivity,
  deleteActivity
} from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  CalendarCheck,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  Filter,
  Check,
  X,
  AlertCircle,
  BarChart3,
  PieChart as PieIcon,
  Sprout
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const CATEGORIES = [
  'Sowing / बुवाई',
  'Irrigation / सिंचाई',
  'Fertilizer / खाद',
  'Pest Management / कीट रोकथाम',
  'Weeding & Tillage / निराई-गुड़ाई',
  'Harvesting / कटाई',
  'General / सामान्य'
];

const CROPS = [
  'Wheat (गेहूं)',
  'Rice (धान)',
  'Tomato (टमाटर)',
  'Potato (आलू)',
  'Mustard (सरसों)',
  'Other / अन्य'
];

const COLORS = ['#2d6a4f', '#40916c', '#bc6c25', '#d4a373', '#52b788', '#386641'];

const Planner = () => {
  const { profile } = useFarmer();
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // all, pending, completed
  const [cropFilter, setCropFilter] = useState('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    crop: profile.primary_crop || 'Wheat',
    category: 'Irrigation / सिंचाई',
    activity_date: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: '',
  });
  const [formError, setFormError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [acts, st] = await Promise.all([getActivities(), getActivityStats()]);
      setActivities(acts);
      setStats(st);
    } catch (err) {
      console.error('Failed to load planner data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingActivity(null);
    setFormData({
      title: '',
      crop: profile.primary_crop || 'Wheat',
      category: 'Irrigation / सिंचाई',
      activity_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      crop: activity.crop,
      category: activity.category,
      activity_date: activity.activity_date,
      status: activity.status,
      notes: activity.notes || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('कृपया गतिविधि का नाम भरें।');
      return;
    }

    try {
      if (editingActivity) {
        await updateActivity(editingActivity.id, formData);
        setActionSuccess('गतिविधि सफलतापूर्वक अपडेट की गई!');
      } else {
        await createActivity(formData);
        setActionSuccess('नई कृषि गतिविधि जोड़ी गई!');
      }
      setIsModalOpen(false);
      loadData();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setFormError(err.message || 'सहेजने में त्रुटि आई।');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleActivity(id);
      loadData();
    } catch (err) {
      console.error('Failed to toggle:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('क्या आप इस गतिविधि को हटाना चाहते हैं?')) {
      try {
        await deleteActivity(id);
        loadData();
        setActionSuccess('गतिविधि हटाई गई।');
        setTimeout(() => setActionSuccess(''), 3000);
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    const matchesStatus =
      activeFilter === 'all' ||
      (activeFilter === 'pending' && act.status === 'pending') ||
      (activeFilter === 'completed' && act.status === 'completed');

    const matchesCrop =
      cropFilter === 'all' || act.crop.toLowerCase().includes(cropFilter.toLowerCase());

    return matchesStatus && matchesCrop;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Advisory Banner */}
      <DisclaimerBanner />

      {/* Success Notification */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')}>
            <X className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1c2826] flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-krishi-700" />
            <span>कृषि कार्य योजनाकार (Farming Planner)</span>
          </h1>
          <p className="text-xs md:text-sm text-[#6b6255] mt-1">
            बुवाई, सिंचाई, खाद और रोग छिड़काव के सभी कार्यों की तारीख नोट करें और रिकॉर्ड बनाए रखें।
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-krishi-700 hover:bg-krishi-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs md:text-sm transition-all flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>नया कार्य जोड़ें (Add Activity)</span>
        </button>
      </div>

      {/* Overview Stat Cards & Useful Recharts Analytics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stat 1: Total & Completion Progress */}
          <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-[#736a5c]">कुल सहेजे गए कार्य / Total Tasks</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#1c2826]">{stats.total}</span>
                <span className="text-xs font-semibold text-krishi-700">
                  {stats.completed} पूर्ण • {stats.pending} लंबित
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-[#615748] mb-1 font-medium">
                <span>कार्य पूर्णता दर:</span>
                <span className="font-bold text-krishi-800">{stats.completion_rate}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#ece6d9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-krishi-600 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completion_rate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stat 2: Useful Category Distribution Chart (Recharts) */}
          <div className="md:col-span-2 bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c2826] flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-krishi-700" />
                  <span>श्रेणी-वार कार्य विश्लेषण (Category Breakdown)</span>
                </h3>
                <p className="text-[11px] text-[#736a5c]">
                  विभिन्न कृषि चरणों में आवंटित कुल कार्यों की संख्या
                </p>
              </div>
            </div>

            <div className="h-32 w-full mt-2">
              {stats.category_distribution?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.category_distribution} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#615748' }}
                      tickFormatter={(val) => val.split(' ')[0]}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#615748' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fcfbf7',
                        borderColor: '#ded7c8',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {stats.category_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#736a5c]">
                  विश्लेषण के लिए डेटा उपलब्ध नहीं है।
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Crop Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#ded7c8]">
        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-[#f4f1e8] p-1 rounded-lg">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-krishi-800 font-bold shadow-xs'
                : 'text-[#6b6255] hover:text-[#1c2826]'
            }`}
          >
            सभी कार्य ({activities.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeFilter === 'pending'
                ? 'bg-white text-amber-800 font-bold shadow-xs'
                : 'text-[#6b6255] hover:text-[#1c2826]'
            }`}
          >
            लंबित ({activities.filter((a) => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeFilter === 'completed'
                ? 'bg-white text-emerald-800 font-bold shadow-xs'
                : 'text-[#6b6255] hover:text-[#1c2826]'
            }`}
          >
            पूर्ण ({activities.filter((a) => a.status === 'completed').length})
          </button>
        </div>

        {/* Crop Filter Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#736a5c]" />
          <span className="text-[#615748] font-medium">फसल:</span>
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="bg-[#fcfbf7] border border-[#dcd4c3] rounded-lg px-2.5 py-1 text-xs text-[#1c2826] focus:outline-none"
          >
            <option value="all">सभी फसलें (All Crops)</option>
            <option value="Wheat">गेहूं (Wheat)</option>
            <option value="Rice">धान (Rice)</option>
            <option value="Tomato">टमाटर (Tomato)</option>
            <option value="Potato">आलू (Potato)</option>
          </select>
        </div>
      </div>

      {/* Activity Cards List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#736a5c]">गतिविधियां लोड हो रही हैं...</div>
        ) : filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#736a5c] bg-[#fcfbf7] rounded-2xl border border-dashed border-[#ded7c8]">
            <p className="text-sm font-semibold text-[#1c2826] mb-1">कोई गतिविधि नहीं मिली</p>
            <p className="text-xs text-[#736a5c] mb-4">
              चयनित फ़िल्टर के अनुसार कोई कार्य दर्ज नहीं है। ऊपर दिए गए बटन से नया कार्य जोड़ें।
            </p>
            <button
              onClick={openAddModal}
              className="bg-krishi-700 hover:bg-krishi-800 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
            >
              + कार्य जोड़ें
            </button>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const isCompleted = act.status === 'completed';
            return (
              <div
                key={act.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-[#f4f7f4]/80 border-[#cdddcF]'
                    : 'bg-white border-[#e5dfd3] hover:border-krishi-300 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggle(act.id)}
                    className={`mt-0.5 p-1 rounded-full transition-colors ${
                      isCompleted ? 'text-krishi-700' : 'text-[#a39a89] hover:text-krishi-700'
                    }`}
                    title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  >
                    <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'fill-krishi-100' : ''}`} />
                  </button>

                  <div>
                    <h3
                      className={`text-sm font-bold ${
                        isCompleted ? 'line-through text-[#6b6255]' : 'text-[#1c2826]'
                      }`}
                    >
                      {act.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#6b6255]">
                      <span className="font-semibold text-krishi-800">{act.crop}</span>
                      <span>•</span>
                      <span className="bg-[#f0ebe0] px-2 py-0.5 rounded text-[11px] text-[#554b3c]">
                        {act.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-[#8c8273]" />
                        तारीख: {act.activity_date}
                      </span>
                    </div>

                    {act.notes && (
                      <p className="mt-2 text-xs text-[#4a4235] bg-[#faf8f2] p-2 rounded-lg border border-[#ece6d9] leading-relaxed">
                        📝 <strong>नोट:</strong> {act.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions & Status */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {isCompleted ? 'पूर्ण' : 'लंबित'}
                  </span>

                  <button
                    onClick={() => openEditModal(act)}
                    className="p-1.5 text-[#6b6255] hover:text-krishi-800 bg-[#f4f1e8] hover:bg-[#ede8dc] rounded-lg transition-colors"
                    title="Edit Activity"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(act.id)}
                    className="p-1.5 text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                    title="Delete Activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fcfbf7] border border-[#e8e2d5] rounded-2xl max-w-lg w-full p-6 shadow-xl animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d5]">
              <h2 className="text-base font-bold text-[#1c2826]">
                {editingActivity ? 'गतिविधि संपादित करें' : 'नई कृषि गतिविधि जोड़ें'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#736a5c] hover:text-[#1c2826] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveActivity} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1c2826] mb-1">
                  कार्य का नाम (Activity Title) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="उदा. ताज जड़ अवस्था पर पहली सिंचाई..."
                  className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1c2826] mb-1">फसल (Crop)</label>
                  <select
                    value={formData.crop}
                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                    className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500"
                  >
                    {CROPS.map((c) => (
                      <option key={c} value={c.split(' ')[0]}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1c2826] mb-1">श्रेणी (Category)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat.split(' ')[0]}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1c2826] mb-1">
                    तारीख (Target Date)
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.activity_date}
                    onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
                    className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500"
                  >
                  </input>
                </div>

                <div>
                  <label className="block font-semibold text-[#1c2826] mb-1">स्थिति (Status)</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500"
                  >
                    <option value="pending">लंबित (Pending)</option>
                    <option value="completed">पूर्ण (Completed)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1c2826] mb-1">
                  अतिरिक्त निर्देश या नोट (Notes)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="उदा. दोपहर 3 बजे के बाद पानी लगाएं। यूरिया 30 किलो प्रति एकड़..."
                  className="w-full bg-white border border-[#dcd4c3] rounded-xl p-2.5 text-[#1c2826] focus:outline-krishi-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e8e2d5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#615748] hover:bg-[#efe9dc] transition-colors"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="bg-krishi-700 hover:bg-krishi-800 text-white font-semibold px-5 py-2 rounded-xl text-xs transition-colors"
                >
                  {editingActivity ? 'बदलाव सहेजें' : 'कार्य सहेजें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;

