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
        <div className="logo">
          <HexagonIcon />
          <h2>Acme Tracker</h2>
        </div>
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
        <div className="sidebar-bottom">
          <button className="btn btn-primary" style={{ width: '100%', borderRadius: '12px' }} onClick={() => handleTabClick('overview')}>
            <Plus size={18} /> Neue Charge
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="top-header">
          <div className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} style={{ color: 'var(--text-secondary)' }} />
            <span>Met Tracker Pro</span>
          </div>
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

function HexagonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 2.26795C11.6188 1.91068 12.3812 1.91068 13 2.26795L20.3589 6.51666C20.9777 6.87393 21.3589 7.53421 21.3589 8.24871V15.7513C21.3589 16.4658 20.9777 17.1261 20.3589 17.4833L13 21.732C12.3812 22.0893 11.6188 22.0893 11 21.732L3.64106 17.4833C3.02221 17.1261 2.64106 16.4658 2.64106 15.7513V8.24871C2.64106 7.53421 3.02221 6.87393 3.64106 6.51666L11 2.26795Z" stroke="#00b8d9" strokeWidth="2.5" />
    </svg>
  );
}

export default App;
