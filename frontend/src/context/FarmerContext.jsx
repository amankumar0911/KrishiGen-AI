import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, updateProfile as apiUpdateProfile, getHealth } from '../services/api';

const FarmerContext = createContext(null);

export const UI_TRANSLATIONS = {
  hi: {
    appTitle: 'कृषिजेन AI',
    tagline: 'भारतीय किसानों का स्मार्ट कृषि सहायक',
    dashboard: 'डैशबोर्ड',
    assistant: 'कृषि AI सहायक',
    diseaseDetection: 'फसल रोग जांच',
    cropGuide: 'फसल मार्गदर्शिका',
    planner: 'कृषि योजनाकार',
    profile: 'किसान प्रोफाइल',
    about: 'परियोजना के बारे में',
    demoModeActive: 'डेमो मोड सक्रिय',
    liveAIActive: 'लाइव AI सक्रिय',
    serverOffline: 'सर्वर ऑफलाइन',
    currentSeason: 'वर्तमान कृषि मौसम',
    welcomeBack: 'राम राम',
    primaryCrop: 'मुख्य फसल',
    soilType: 'मिट्टी का प्रकार',
    state: 'राज्य / क्षेत्र',
    saveChanges: 'बदलाव सहेजें',
    savedSuccessfully: 'सफलतापूर्वक सहेजा गया!',
  },
  en: {
    appTitle: 'KrishiGen AI',
    tagline: 'Smart Farming Assistant for Indian Farmers',
    dashboard: 'Dashboard',
    assistant: 'Krishi AI Assistant',
    diseaseDetection: 'Crop Disease Analysis',
    cropGuide: 'Crop Care Guide',
    planner: 'Farming Planner',
    profile: 'Farmer Profile',
    about: 'About Project',
    demoModeActive: 'Demo Mode Active',
    liveAIActive: 'Live AI Active',
    serverOffline: 'Server Offline',
    currentSeason: 'Current Agricultural Season',
    welcomeBack: 'Welcome back',
    primaryCrop: 'Primary Crop',
    soilType: 'Soil Type',
    state: 'State / Region',
    saveChanges: 'Save Changes',
    savedSuccessfully: 'Saved successfully!',
  },
  'hi-en': {
    appTitle: 'KrishiGen AI',
    tagline: 'Indian Farmers ka Smart AI Assistant',
    dashboard: 'Dashboard',
    assistant: 'Krishi AI Chat',
    diseaseDetection: 'Disease Scan',
    cropGuide: 'Crop Guide',
    planner: 'Farming Planner',
    profile: 'Profile',
    about: 'About Project',
    demoModeActive: 'Demo Mode Active',
    liveAIActive: 'Live AI Active',
    serverOffline: 'Server Offline',
    currentSeason: 'Current Season',
    welcomeBack: 'Namaste',
    primaryCrop: 'Main Crop',
    soilType: 'Soil Type',
    state: 'State / Region',
    saveChanges: 'Save Changes',
    savedSuccessfully: 'Successfully save ho gaya!',
  }
};

export const FarmerProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    name: 'Ramesh Kumar',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    preferred_language: 'hi',
    primary_crop: 'Wheat (गेहूं)',
    soil_type: 'Alluvial Soil (जलोढ़ मिट्टी)',
    farm_size_acres: 3.5,
  });

  const [language, setLanguage] = useState('hi');
  const [healthInfo, setHealthInfo] = useState({
    status: 'checking',
    live_ai_configured: false,
    version: '1.0.0',
  });
  const [loading, setLoading] = useState(true);

  // Determine current Indian agricultural season based on month
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 10 || month <= 3) {
      return {
        name: 'Rabi Season (रबी - Winter)',
        tag: 'Rabi (रबी)',
        description: 'Sowing of wheat, mustard, potato, gram. Ideal cool weather growth period.',
        activeCrops: ['Wheat', 'Potato', 'Mustard', 'Barley'],
      };
    } else if (month >= 4 && month <= 6) {
      return {
        name: 'Zaid Season (जायद - Summer)',
        tag: 'Zaid (जायद)',
        description: 'Cucurbits, watermelon, fodder crops, vegetables with regular irrigation.',
        activeCrops: ['Watermelon', 'Cucumber', 'Tomato', 'Moong'],
      };
    } else {
      return {
        name: 'Kharif Season (खरीफ - Monsoon)',
        tag: 'Kharif (खरीफ)',
        description: 'Paddy/Rice, maize, cotton, pulses relying on South-West monsoon rains.',
        activeCrops: ['Rice (Paddy)', 'Cotton', 'Maize', 'Soybean'],
      };
    }
  };

  const season = getCurrentSeason();

  // Load profile from backend
  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      if (data.preferred_language) {
        setLanguage(data.preferred_language);
      }
    } catch (err) {
      console.warn('Backend unavailable, using default profile values:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check backend health
  const checkHealth = async () => {
    try {
      const data = await getHealth();
      setHealthInfo(data);
    } catch (err) {
      setHealthInfo({
        status: 'offline',
        live_ai_configured: false,
        version: '1.0.0',
      });
    }
  };

  useEffect(() => {
    loadProfile();
    checkHealth();
  }, []);

  const saveProfile = async (updatedData) => {
    try {
      const saved = await apiUpdateProfile(updatedData);
      setProfile(saved);
      if (saved.preferred_language) {
        setLanguage(saved.preferred_language);
      }
      return { success: true, data: saved };
    } catch (err) {
      // Fallback local update if backend has a temporary connection glitch
      setProfile((prev) => ({ ...prev, ...updatedData }));
      return { success: false, error: err.message };
    }
  };

  const handleSetLanguage = (langKey) => {
    setLanguage(langKey);
    saveProfile({ preferred_language: langKey });
  };

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <FarmerContext.Provider
      value={{
        profile,
        language,
        setLanguage: handleSetLanguage,
        season,
        healthInfo,
        loading,
        saveProfile,
        refreshProfile: loadProfile,
        refreshHealth: checkHealth,
        t,
      }}
    >
      {children}
    </FarmerContext.Provider>
  );
};

export const useFarmer = () => {
  const context = useContext(FarmerContext);
  if (!context) {
    throw new Error('useFarmer must be used within a FarmerProvider');
  }
  return context;
};

