import React, { useState } from 'react';
import { Wifi, Bluetooth, Radio, RefreshCw, CheckCircle2, Cpu, HardDrive, AlertTriangle, Zap } from 'lucide-react';

export default function IoTConnectTab() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlinePackets, setOfflinePackets] = useState(48);
  const [lastSyncTime, setLastSyncTime] = useState('Há 14 minutos');
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setOfflinePackets(0);
      setLastSyncTime('Agora mesmo');
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Status da Conexão Principal */}
      <div className="w-full rounded-3xl glass-panel-glow p-5">
        <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blueElectric to-cyanNeon flex items-center justify-center text-black">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">ESP32 Dual-Core (NodeMCU)</h2>
              <p className="text-[10px] text-emeraldPotable flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emeraldPotable animate-ping"></span>
                Conectado via Wi-Fi / AP Local
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-surface border border-surfaceBorder px-2 py-0.5 rounded-md text-cyanNeon">
            v1.4.2-idf
          </span>
        </div>

        {/* Canais de Comunicação */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-surface/70 rounded-xl p-2.5 border border-cyanNeon/30 text-center">
            <Wifi className="w-4 h-4 text-cyanNeon mx-auto mb-1" />
            <span className="text-[10px] text-textSecondary block">Wi-Fi / MQTT</span>
            <span className="text-xs font-bold text-white">Ativo (RSSI: -62dBm)</span>
          </div>

          <div className="bg-surface/70 rounded-xl p-2.5 border border-surfaceBorder text-center">
            <Bluetooth className="w-4 h-4 text-blueElectric mx-auto mb-1" />
            <span className="text-[10px] text-textSecondary block">Bluetooth BLE</span>
            <span className="text-xs font-bold text-white">Pareado</span>
          </div>

          <div className="bg-surface/70 rounded-xl p-2.5 border border-surfaceBorder text-center opacity-70">
            <Radio className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <span className="text-[10px] text-textSecondary block">Rádio LoRa</span>
            <span className="text-xs font-bold text-white">Standby (915MHz)</span>
          </div>
        </div>

        {/* Buffer Offline FIFO (Memória SPIFFS) */}
        <div className="bg-[#0A0E17]/90 rounded-2xl p-4 border border-surfaceBorder">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyanNeon" />
              <span className="text-xs font-semibold text-white">Buffer Offline (SPIFFS/LittleFS)</span>
            </div>
            <span className="text-[10px] text-textSecondary">{lastSyncTime}</span>
          </div>

          <p className="text-[11px] text-textSecondary leading-relaxed mb-3">
            Em áreas rurais remotas sem sinal de internet, as medições de 60s são armazenadas na memória flash local e sincronizadas em lote ao detectar conexão.
          </p>

          <div className="flex items-center justify-between bg-surface/50 rounded-xl p-3 border border-surfaceBorder/40 mb-3">
            <div>
              <span className="text-[10px] text-textSecondary block">Pacotes Pendentes no ESP32:</span>
              <span className="text-lg font-extrabold text-white font-mono">
                {offlinePackets} <span className="text-xs text-textSecondary font-normal">registros</span>
              </span>
            </div>
            
            <button
              onClick={handleSync}
              disabled={isSyncing || offlinePackets === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                offlinePackets === 0
                  ? 'bg-surfaceBorder text-textSecondary cursor-not-allowed'
                  : 'bg-gradient-to-r from-blueElectric to-cyanNeon text-black shadow-glow-cyan hover:scale-105 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar Lote'}
            </button>
          </div>

          {syncSuccess && (
            <div className="p-2.5 rounded-xl bg-emeraldPotable/15 border border-emeraldPotable/40 text-emeraldPotable text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>48 pacotes sincronizados com sucesso e integrados ao banco de dados!</span>
            </div>
          )}
        </div>
      </div>

      {/* Matriz de Saúde dos Sensores */}
      <div className="w-full rounded-3xl glass-panel p-5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyanNeon" />
          Status de Integridade dos Sensores
        </h3>

        <div className="space-y-2 text-xs">
          {[
            {
              name: 'Sonda Térmica da Água (Tw)',
              sensor: 'DS18B20 Inox',
              status: 'Nominal (68.5 °C)',
              health: '100%',
              color: 'text-emeraldPotable'
            },
            {
              name: 'Sonda Térmica do Vidro (Tg)',
              sensor: 'DS18B20 Inox',
              status: 'Nominal (42.0 °C)',
              health: '100%',
              color: 'text-emeraldPotable'
            },
            {
              name: 'Eletrodo de TDS / Condutividade',
              sensor: 'Analógico Chaveado (2s pulse)',
              status: '140 mg/L (Potável)',
              health: '98% (Protegido)',
              color: 'text-emeraldPotable'
            },
            {
              name: 'Sensor de Vazão de Condensado',
              sensor: 'Efeito Hall YF-S401',
              status: '0.42 L/h',
              health: '100%',
              color: 'text-emeraldPotable'
            },
            {
              name: 'Piranômetro / Sensor de Luz',
              sensor: 'BH1750 Calibrado',
              status: '850 W/m²',
              health: '96%',
              color: 'text-emeraldPotable'
            }
          ].map((s, idx) => (
            <div key={idx} className="flex justify-between items-center bg-surface/50 p-2.5 rounded-xl border border-surfaceBorder/40">
              <div>
                <span className="font-semibold text-white block">{s.name}</span>
                <span className="text-[10px] text-textSecondary">{s.sensor}</span>
              </div>
              <div className="text-right">
                <span className={`font-bold block ${s.color}`}>{s.status}</span>
                <span className="text-[10px] text-textSecondary">Saúde: {s.health}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
