import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import HomeTab from './components/tabs/HomeTab';
import ReportsTab from './components/tabs/ReportsTab';
import IoTConnectTab from './components/tabs/IoTConnectTab';
import AlertsTab from './components/tabs/AlertsTab';
import DigitalTwinTab from './components/tabs/DigitalTwinTab';
import { fetchKPISummary } from './services/api';
import { Sparkles, Info, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [kpiData, setKpiData] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    fetchKPISummary().then(setKpiData);
    const interval = setInterval(() => {
      fetchKPISummary().then(setKpiData);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#06090F] flex items-center justify-center p-0 sm:p-4 selection:bg-cyanNeon selection:text-black">
      {/* Mobile Device Frame (390px x 844px centered with smooth shadow on larger screens) */}
      <main className="w-full max-w-[430px] min-h-screen sm:min-h-[844px] sm:max-h-[900px] sm:rounded-[44px] bg-[#0A0E17] border-0 sm:border-[8px] sm:border-[#1E2B42] shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Dynamic Island / Speaker cutout simulation for desktop preview */}
        <div className="hidden sm:flex justify-center pt-2 pb-1 bg-[#0A0E17] z-50">
          <div className="w-24 h-4 bg-black rounded-full border border-surfaceBorder/40"></div>
        </div>

        {/* Global Header */}
        <Header activeTab={activeTab} onOpenSettings={() => setShowSettingsModal(true)} />

        {/* Scrollable Tab Views Container */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6">
          {activeTab === 'home' && <HomeTab kpiData={kpiData} />}
          {activeTab === 'reports' && <ReportsTab />}
          {activeTab === 'iot' && <IoTConnectTab />}
          {activeTab === 'alerts' && <AlertsTab />}
          {activeTab === 'digital-twin' && <DigitalTwinTab />}
        </div>

        {/* Floating Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Settings & Info Modal */}
        {showSettingsModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 p-6 flex flex-col justify-center animate-fadeIn">
            <div className="bg-surface rounded-3xl border border-cyanNeon/30 p-5 shadow-2xl relative">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="absolute top-4 right-4 text-textSecondary hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-cyanNeon" />
                <h3 className="text-sm font-bold text-white">Projeto PingoSolar</h3>
              </div>

              <p className="text-xs text-textSecondary leading-relaxed mb-4">
                Dessalinizador Solar Inteligente com monitoramento IoT (ESP32), remineralização em calcita (Portaria 888) e previsão por Physics-Informed Machine Learning (Equações de Dunkle).
              </p>

              <div className="space-y-2 text-xs text-textSecondary border-t border-surfaceBorder/60 pt-3">
                <div className="flex justify-between">
                  <span>Arquitetura Backend:</span>
                  <span className="text-white font-medium">FastAPI + Clean Arch</span>
                </div>
                <div className="flex justify-between">
                  <span>Modelo de IA:</span>
                  <span className="text-cyanNeon font-medium">PIML (Dunkle + Scikit-Learn)</span>
                </div>
                <div className="flex justify-between">
                  <span>Modo de Operação:</span>
                  <span className="text-emeraldPotable font-medium">Offline-First Híbrido</span>
                </div>
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full mt-5 py-2.5 rounded-xl bg-cyanNeon text-black font-bold text-xs shadow-glow-cyan hover:opacity-95"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
