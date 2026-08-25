import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Bell, Settings, SunMedium } from 'lucide-react';

export default function Header({ activeTab, onOpenSettings }) {
  const [timeStr, setTimeStr] = useState('16:31');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#0A0E17]/90 backdrop-blur-md border-b border-surfaceBorder/60 px-4 pt-2 pb-3 sticky top-0 z-40">
      {/* Top Status Bar (Smartphone Style) */}
      <div className="flex items-center justify-between text-xs text-textSecondary mb-2 select-none">
        <span className="font-semibold text-white tracking-wider">{timeStr}</span>
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5 text-cyanNeon" />
          <span className="text-[10px] bg-emeraldPotable/20 text-emeraldPotable font-medium px-1.5 py-0.2 rounded border border-emeraldPotable/30">5G / IoT</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px]">98%</span>
            <Battery className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blueElectric to-cyanNeon flex items-center justify-center shadow-glow-cyan">
            <SunMedium className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              PingoSolar
              <span className="w-2 h-2 rounded-full bg-emeraldPotable animate-pulse"></span>
            </h1>
            <p className="text-[10px] text-textSecondary flex items-center gap-1">
              Dispositivo: <span className="text-cyanNeon font-medium">PINGOSOLAR-01</span>
            </p>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenSettings && onOpenSettings()}
            className="w-8 h-8 rounded-full bg-surface border border-surfaceBorder flex items-center justify-center text-textSecondary hover:text-cyanNeon transition-colors relative"
            title="Alertas & Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-alertRed border border-surface animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-alertRed"></span>
          </button>
          
          <button
            onClick={() => onOpenSettings && onOpenSettings()}
            className="w-8 h-8 rounded-full bg-surface border border-surfaceBorder flex items-center justify-center text-textSecondary hover:text-white transition-colors"
            title="Configurações do Protótipo"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
