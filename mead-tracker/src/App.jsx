import React, { useState } from 'react';
import { BatchProvider, useBatchContext } from './context/BatchContext';
import { Activity, Beaker, Archive, LayoutDashboard, Calculator, DollarSign, Menu, Plus } from 'lucide-react';
import OverviewTab from './components/OverviewTab';
import ProductionTab from './components/ProductionTab';
import FermentationTab from './components/FermentationTab';
import AnalysisTab from './components/AnalysisTab';
import StorageTab from './components/StorageTab';
import EconomicsTab from './components/EconomicsTab';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'production', label: 'Produktion', icon: Beaker },
    { id: 'fermentation', label: 'Gärung', icon: Activity },
    { id: 'analysis', label: 'Analyse', icon: Calculator },
    { id: 'storage', label: 'Lagerung', icon: Archive },
    { id: 'economics', label: 'Wirtschaft', icon: DollarSign }
  ];

  return (
    <BatchProvider>
      <AppContent tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </BatchProvider>
  );
}

function AppContent({ tabs, activeTab, setActiveTab }) {
  const { isLoading } = useBatchContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text-main)', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTop: '4px solid var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p>Lade Bestandsdaten...</p>
      </div>
    );
  }

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <div className="sidebar-item-icon"><tab.icon size={20} /></div>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="top-header">

          <div className="user-profile">
            <span>Met Brauer</span>
            <div className="avatar">
              <div style={{ width: '100%', height: '100%', background: '#ffce20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🍯</div>
            </div>
          </div>
        </header>

        <main className="main-content-scroll">
          <div className="tab-content">
            {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
            {activeTab === 'production' && <ProductionTab />}
            {activeTab === 'fermentation' && <FermentationTab />}
            {activeTab === 'analysis' && <AnalysisTab />}
            {activeTab === 'storage' && <StorageTab />}
            {activeTab === 'economics' && <EconomicsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}



export default App;
