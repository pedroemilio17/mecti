import React from 'react';
import { Home, FileBarChart, QrCode, ShieldAlert, Cpu } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'reports', label: 'Relatórios', icon: FileBarChart },
    { id: 'iot', label: 'IoT Sync', icon: QrCode, isCenter: true },
    { id: 'alerts', label: 'Alertas', icon: ShieldAlert, badge: '2' },
    { id: 'digital-twin', label: 'Gêmeo Digital', icon: Cpu },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-[#0F1522]/95 backdrop-blur-xl border-t border-surfaceBorder/80 px-2 py-1.5 z-50">
      <div className="flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCenter) {
            return (
              <div key={item.id} className="relative -top-5 flex flex-col items-center">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-13 h-13 rounded-full bg-gradient-to-tr from-blueElectric to-cyanNeon p-3.5 text-black shadow-glow-blue flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'scale-110 ring-4 ring-cyanNeon/30' : 'hover:scale-105'
                  }`}
                  aria-label="Conexão IoT e Sincronização"
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </button>
                <span className="text-[10px] mt-1 font-medium text-cyanNeon">
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors relative ${
                isActive ? 'text-cyanNeon' : 'text-textSecondary hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 min-w-3.5 h-3.5 bg-alertRed text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-semibold text-white' : 'font-normal'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-cyanNeon mt-0.5 glow-cyan-text"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
