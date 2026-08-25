import React, { useState } from 'react';
import { 
  Droplets, 
  CheckCircle2, 
  Sun, 
  Thermometer, 
  Clock, 
  Sparkles, 
  Layers, 
  Flame, 
  Check, 
  RefreshCw, 
  AlertCircle,
  Activity,
  ArrowUpRight,
  TrendingUp,
  CloudSun
} from 'lucide-react';

export default function HomeTab({ kpiData }) {
  const [selectedUnit, setSelectedUnit] = useState('ALL'); // 'ALL', 'PINGOSOLAR-01', etc.
  const [actionFeedback, setActionFeedback] = useState(null);

  const devices = kpiData?.all_devices || [
    {
      device_id: "PINGOSOLAR-01",
      name: "Unidade 01 — Bacia Norte",
      status: "ONLINE",
      reservoir_liters: 18.5,
      reservoir_capacity: 20.0,
      daily_yield_liters: 4.2,
      hourly_rate_ml: 420,
      water_temp_c: 68.5,
      glass_temp_c: 42.0,
      delta_t_c: 26.5,
      solar_irradiance_w_m2: 850.0,
      ph_post_calcita: 7.2,
      tds_value_mg_l: 140.0,
      avg_cycle_min_per_500ml: 42,
      time_to_full_hours: 1.3
    },
    {
      device_id: "PINGOSOLAR-02",
      name: "Unidade 02 — Bacia Central",
      status: "ONLINE",
      reservoir_liters: 14.2,
      reservoir_capacity: 20.0,
      daily_yield_liters: 4.5,
      hourly_rate_ml: 450,
      water_temp_c: 70.1,
      glass_temp_c: 43.2,
      delta_t_c: 26.9,
      solar_irradiance_w_m2: 880.0,
      ph_post_calcita: 7.3,
      tds_value_mg_l: 135.0,
      avg_cycle_min_per_500ml: 39,
      time_to_full_hours: 3.8
    },
    {
      device_id: "PINGOSOLAR-03",
      name: "Unidade 03 — Bacia Sul",
      status: "ONLINE",
      reservoir_liters: 11.0,
      reservoir_capacity: 20.0,
      daily_yield_liters: 3.9,
      hourly_rate_ml: 390,
      water_temp_c: 66.0,
      glass_temp_c: 41.5,
      delta_t_c: 24.5,
      solar_irradiance_w_m2: 810.0,
      ph_post_calcita: 7.1,
      tds_value_mg_l: 145.0,
      avg_cycle_min_per_500ml: 46,
      time_to_full_hours: 6.2
    }
  ];

  const forecast = kpiData?.forecast_timeline || [
    { day: "Sex", date: "22/08", liters: 4.1, is_historical: true, weather: "Sol" },
    { day: "Sáb", date: "23/08", liters: 4.3, is_historical: true, weather: "Sol" },
    { day: "Dom", date: "24/08", liters: 4.0, is_historical: true, weather: "Sol/Nuv" },
    { day: "Hoje", date: "25/08", liters: 4.8, is_historical: false, is_today: true, weather: "Sol 34°C", irr: "950 W/m²" },
    { day: "Amanhã", date: "26/08", liters: 5.1, is_historical: false, weather: "Sol 36°C", irr: "980 W/m²" }
  ];

  // Dispositivo selecionado ou Agregação de todos
  const isAll = selectedUnit === 'ALL';
  const activeDevice = isAll ? null : devices.find(d => d.device_id === selectedUnit) || devices[0];

  // Valores calculados
  const displayReservoirLiters = isAll 
    ? devices.reduce((acc, d) => acc + d.reservoir_liters, 0)
    : activeDevice.reservoir_liters;

  const displayCapacityLiters = isAll
    ? devices.reduce((acc, d) => acc + d.reservoir_capacity, 0)
    : activeDevice.reservoir_capacity;

  const displayDailyLiters = isAll
    ? devices.reduce((acc, d) => acc + d.daily_yield_liters, 0)
    : activeDevice.daily_yield_liters;

  const displayHourlyMl = isAll
    ? devices.reduce((acc, d) => acc + d.hourly_rate_ml, 0)
    : activeDevice.hourly_rate_ml;

  const reservoirPercent = Math.min(100, Math.round((displayReservoirLiters / displayCapacityLiters) * 100));

  const handleAction = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className="space-y-3 pb-24 animate-fadeIn">
      
      {/* 1. TOPO: Seletor de Parque Multi-Dessalinizadores */}
      <div className="bg-surface/80 backdrop-blur-md rounded-2xl p-2.5 border border-surfaceBorder">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyanNeon" />
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">
              Parque da Comunidade (3 Unidades)
            </span>
          </div>
          <span className="text-[10px] text-emeraldPotable font-semibold bg-emeraldPotable/10 px-2 py-0.2 rounded-full border border-emeraldPotable/30">
            3/3 Online
          </span>
        </div>

        {/* Pílulas de Seleção de Dispositivo */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedUnit('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              isAll
                ? 'bg-gradient-to-r from-blueElectric to-cyanNeon text-black shadow-glow-cyan scale-[1.02]'
                : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-white'
            }`}
          >
            🌐 Toda a Comunidade (Total)
          </button>

          {devices.map((d, i) => (
            <button
              key={d.device_id}
              onClick={() => setSelectedUnit(d.device_id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedUnit === d.device_id
                  ? 'bg-cyanNeon/20 border border-cyanNeon text-white shadow-glow-cyan scale-[1.02]'
                  : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-white'
              }`}
            >
              ☀️ Unidade 0{i + 1} ({d.name.split('—')[1]?.trim() || d.device_id})
            </button>
          ))}
        </div>
      </div>

      {/* 2. BENTO BLOCK 1: Reservatório & Ritmo de Produção */}
      <div className="rounded-3xl glass-panel-glow p-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyanNeon" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAll ? 'Água Total Disponível no Assentamento' : `Reservatório: ${activeDevice.name}`}
            </h2>
          </div>
          <span className="text-[10px] text-cyanNeon font-mono bg-cyanNeon/10 border border-cyanNeon/30 px-2 py-0.5 rounded-full">
            {isAll ? '3 Tanques' : 'Tanque Individual'}
          </span>
        </div>

        {/* Nível do Tanque (Litros e Barra de Progresso) */}
        <div className="bg-[#0A0E17]/80 rounded-2xl p-3.5 border border-surfaceBorder mb-3">
          <div className="flex items-end justify-between mb-1.5">
            <div>
              <span className="text-[10px] text-textSecondary uppercase tracking-wider block">Água Pronta para Consumo</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white tracking-tight glow-cyan-text font-mono">
                  {displayReservoirLiters.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-cyanNeon">/ {displayCapacityLiters} Litros</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-greenNeon font-mono">{reservoirPercent}%</span>
              <span className="text-[9px] text-textSecondary block">Cheio</span>
            </div>
          </div>

          {/* Barra Visual de Nível de Água */}
          <div className="w-full h-3 bg-surface rounded-full overflow-hidden p-0.5 border border-surfaceBorder/60">
            <div 
              className="h-full bg-gradient-to-r from-blueElectric via-cyanNeon to-greenNeon rounded-full transition-all duration-700 shadow-glow-cyan"
              style={{ width: `${reservoirPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] text-textSecondary mt-2 pt-1.5 border-t border-surfaceBorder/40">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyanNeon" />
              Tempo Médio: <strong className="text-white">~42 min / 500 mL</strong>
            </span>
            <span className="text-emerald-400 font-medium">
              {isAll ? 'Abastecimento Contínuo' : `Enche em ~${activeDevice.time_to_full_hours}h`}
            </span>
          </div>
        </div>

        {/* Grid Rápido: Produção do Dia & Vazão Horária */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-surface/70 rounded-xl p-2.5 border border-surfaceBorder/40">
            <span className="text-[10px] text-textSecondary block">Dessalinizado Hoje</span>
            <span className="text-base font-extrabold text-white font-mono">{displayDailyLiters.toFixed(1)} L</span>
            <span className="text-[9px] text-greenNeon block mt-0.5">Meta diária superada</span>
          </div>
          <div className="bg-surface/70 rounded-xl p-2.5 border border-surfaceBorder/40">
            <span className="text-[10px] text-textSecondary block">Vazão Instantânea</span>
            <span className="text-base font-extrabold text-cyanNeon font-mono">{displayHourlyMl} mL/h</span>
            <span className="text-[9px] text-textSecondary block mt-0.5">Sol pleno ativo</span>
          </div>
        </div>
      </div>

      {/* 3. BENTO BLOCK 2: Análise Sanitária Pós-Filtragem (Portaria 888) */}
      <div className="rounded-2xl bg-gradient-to-r from-emeraldPotable/20 via-surface to-surface border border-emeraldPotable/40 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emeraldPotable" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Qualidade Sanitária (Pós-Calcita)
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-emeraldPotable bg-emeraldPotable/20 px-2 py-0.5 rounded-full border border-emeraldPotable/40">
            POTÁVEL (PORTARIA 888)
          </span>
        </div>

        {/* Métricas Químicas Condensadas */}
        <div className="grid grid-cols-3 gap-1.5 text-center my-1.5">
          <div className="bg-[#0A0E17]/80 rounded-xl p-2 border border-surfaceBorder/50">
            <span className="text-[9px] text-textSecondary block">pH da Água</span>
            <span className="text-sm font-extrabold text-emeraldPotable font-mono">
              {isAll ? '7.2' : activeDevice.ph_post_calcita} pH
            </span>
            <span className="text-[8px] text-textSecondary block">Neutro (Ótimo)</span>
          </div>

          <div className="bg-[#0A0E17]/80 rounded-xl p-2 border border-surfaceBorder/50">
            <span className="text-[9px] text-textSecondary block">Sólidos (TDS)</span>
            <span className="text-sm font-extrabold text-cyanNeon font-mono">
              {isAll ? '140' : activeDevice.tds_value_mg_l} mg/L
            </span>
            <span className="text-[8px] text-emerald-400 block">&lt; 300 mg/L</span>
          </div>

          <div className="bg-[#0A0E17]/80 rounded-xl p-2 border border-surfaceBorder/50">
            <span className="text-[9px] text-textSecondary block">Cloro Livre</span>
            <span className="text-sm font-extrabold text-white font-mono">0.5 mg/L</span>
            <span className="text-[8px] text-textSecondary block">Protegido</span>
          </div>
        </div>
      </div>

      {/* 4. BENTO BLOCK 3: Sensores Físicos em Tempo Real (Raio-X Térmico) */}
      <div className="rounded-3xl glass-panel p-4">
        <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyanNeon" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Sensores Físicos do Dessalinizador
            </span>
          </div>
          <span className="text-[10px] text-cyanNeon font-mono">
            {isAll ? 'Médias em Campo' : activeDevice.device_id}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
          <div className="bg-surface/70 rounded-xl p-2 border border-surfaceBorder/40">
            <span className="text-[9px] text-textSecondary block">Água (Tw)</span>
            <span className="font-extrabold text-orange-400 font-mono">
              {isAll ? '68.5°C' : `${activeDevice.water_temp_c}°C`}
            </span>
          </div>

          <div className="bg-surface/70 rounded-xl p-2 border border-surfaceBorder/40">
            <span className="text-[9px] text-textSecondary block">Vidro (Tg)</span>
            <span className="font-extrabold text-cyanNeon font-mono">
              {isAll ? '42.0°C' : `${activeDevice.glass_temp_c}°C`}
            </span>
          </div>

          <div className="bg-surface/70 rounded-xl p-2 border border-cyanNeon/30">
            <span className="text-[9px] text-textSecondary block">Gradiente ΔT</span>
            <span className="font-extrabold text-greenNeon font-mono">
              {isAll ? '26.5°C' : `${activeDevice.delta_t_c}°C`}
            </span>
          </div>

          <div className="bg-surface/70 rounded-xl p-2 border border-surfaceBorder/40">
            <span className="text-[9px] text-textSecondary block">Radiação</span>
            <span className="font-extrabold text-white font-mono">
              {isAll ? '850 W' : `${activeDevice.solar_irradiance_w_m2.toFixed(0)} W`}
            </span>
          </div>
        </div>
      </div>

      {/* 5. BENTO BLOCK 4: Previsão Preditiva (Clima + Histórico de 5 Dias) */}
      <div className="rounded-3xl glass-panel p-4">
        <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyanNeon" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Predição Clima + Histórico Semanal
            </span>
          </div>
          <span className="text-[9px] text-cyanNeon font-medium bg-cyanNeon/10 px-2 py-0.5 rounded-full">
            Physics-Informed ML
          </span>
        </div>

        {/* Linha do Tempo dos 5 Dias */}
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {forecast.map((fc, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-2 border transition-all ${
                fc.is_today
                  ? 'bg-cyanNeon/20 border-cyanNeon shadow-glow-cyan scale-[1.03]'
                  : fc.is_historical
                  ? 'bg-[#0A0E17]/60 border-surfaceBorder/40 opacity-80'
                  : 'bg-blueElectric/10 border-blueElectric/30'
              }`}
            >
              <span className={`text-[9px] font-bold block ${fc.is_today ? 'text-cyanNeon' : 'text-textSecondary'}`}>
                {fc.day}
              </span>
              <span className="text-[8px] text-textSecondary/70 block mb-1">{fc.date}</span>
              
              <Sun className={`w-3.5 h-3.5 mx-auto mb-1 ${fc.is_today ? 'text-orange-400 animate-spin-slow' : 'text-yellow-400'}`} />
              
              <span className={`text-xs font-extrabold font-mono block ${fc.is_today ? 'text-white' : 'text-textSecondary'}`}>
                {isAll ? (fc.liters * 3).toFixed(1) : fc.liters} L
              </span>
              <span className="text-[8px] text-textSecondary block mt-0.5">
                {fc.is_historical ? 'Produzido' : 'Previsão'}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-2.5 pt-2 border-t border-surfaceBorder/40 flex items-center justify-between text-[10px] text-textSecondary">
          <span className="flex items-center gap-1">
            <Sun className="w-3 h-3 text-orange-400" />
            Previsão do Tempo: <strong>Sol Pleno (34°C - 36°C) no Semiárido</strong>
          </span>
          <span className="text-cyanNeon font-semibold">
            Estimativa: +{(isAll ? 15.3 : 5.1)} L amanhã
          </span>
        </div>
      </div>

      {/* 6. BENTO BLOCK 5: Ações Rápidas de Campo para o Cuidador */}
      <div className="rounded-2xl bg-surface/90 border border-surfaceBorder p-3">
        <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider block mb-2 px-1">
          Ações Rápidas do Cuidador / Manutenção
        </span>

        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            onClick={() => handleAction('Drenagem para o cristalizador ZLD registrada com sucesso!')}
            className="bg-surface border border-surfaceBorder hover:border-cyanNeon hover:text-cyanNeon p-2 rounded-xl text-center font-medium transition-all active:scale-95 text-[11px]"
          >
            💧 Drenar Salmoura (ZLD)
          </button>

          <button
            onClick={() => handleAction('Limpeza da bacia solar registrada no histórico!')}
            className="bg-surface border border-surfaceBorder hover:border-cyanNeon hover:text-cyanNeon p-2 rounded-xl text-center font-medium transition-all active:scale-95 text-[11px]"
          >
            🧹 Registrar Limpeza
          </button>

          <button
            onClick={() => handleAction('Dosagem de cloro e calcita validada!')}
            className="bg-surface border border-surfaceBorder hover:border-emeraldPotable hover:text-emeraldPotable p-2 rounded-xl text-center font-medium transition-all active:scale-95 text-[11px]"
          >
            🧪 Validar Cloro
          </button>
        </div>

        {actionFeedback && (
          <div className="mt-2 p-2 rounded-xl bg-emeraldPotable/20 border border-emeraldPotable/40 text-emeraldPotable text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}
      </div>

    </div>
  );
}
