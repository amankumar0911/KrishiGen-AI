import React, { useState } from 'react';
import { FarmerProvider } from './context/FarmerContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import DiseaseDetection from './pages/DiseaseDetection';
import CropGuide from './pages/CropGuide';
import Planner from './pages/Planner';
import Profile from './pages/Profile';
import About from './pages/About';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'assistant':
        return <Assistant />;
      case 'disease':
        return <DiseaseDetection setActiveTab={setActiveTab} />;
      case 'guide':
        return <CropGuide />;
      case 'planner':
        return <Planner />;
      case 'profile':
        return <Profile />;
      case 'about':
        return <About />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActivePage()}
    </Layout>
  );
}

function App() {
  return (
    <FarmerProvider>
      <AppContent />
    </FarmerProvider>
  );
}

export default App;
