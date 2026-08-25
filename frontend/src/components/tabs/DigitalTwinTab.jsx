import React, { useState, useEffect } from 'react';
import { Cpu, Sliders, Sun, Thermometer, Compass, Droplet, Play, Sparkles, Activity } from 'lucide-react';
import { runDigitalTwinSimulation } from '../../services/api';

export default function DigitalTwinTab() {
  const [regionKey, setRegionKey] = useState('semiarido');
  const [irradianceMult, setIrradianceMult] = useState(1.0);
  const [waterDepth, setWaterDepth] = useState(15.0);
  const [glassTilt, setGlassTilt] = useState(18.0);
  const [customTds, setCustomTds] = useState(140.0);
  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const executeSimulation = async () => {
    setLoading(true);
    const res = await runDigitalTwinSimulation({
      region_key: regionKey,
      basin_area_m2: 1.0,
      glass_tilt_deg: glassTilt,
      water_depth_mm: waterDepth,
      custom_irradiance_mult: irradianceMult,
      custom_tds: customTds
    });
    setSimResult(res);
    setLoading(false);
  };

  useEffect(() => {
    executeSimulation();
  }, [regionKey, irradianceMult, waterDepth, glassTilt, customTds]);

  const series = simResult?.hourly_series || [];
  const kpis = simResult?.summary_kpis || {
    total_real_liters_day: '4.20',
    total_dunkle_liters_day: '3.85',
    total_piml_liters_day: '4.15',
    average_efficiency_percent: '34.2',
    peak_hourly_ml: '680'
  };

  // SVG Chart
  const width = 340;
  const height = 130;
  const padding = { top: 10, right: 10, bottom: 20, left: 30 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;
  const maxVal = Math.max(700, ...series.map(s => s.real_yield_ml || 0));

  const getX = (i) => padding.left + (i / Math.max(1, series.length - 1)) * graphWidth;
  const getY = (val) => padding.top + graphHeight - (Math.min(maxVal, val) / maxVal) * graphHeight;

  const realPoints = series.map((pt, i) => `${getX(i)},${getY(pt.real_yield_ml)}`).join(' ');
  const pimlPoints = series.map((pt, i) => `${getX(i)},${getY(pt.piml_yield_ml)}`).join(' ');
  const dunklePoints = series.map((pt, i) => `${getX(i)},${getY(pt.dunkle_yield_ml)}`).join(' ');

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Top Banner do Gêmeo Digital */}
      <div className="w-full rounded-3xl glass-panel-glow p-5">
        <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyanNeon" />
            <div>
              <h2 className="text-sm font-bold text-white">Simulador Termodinâmico Digital Twin</h2>
              <p className="text-[10px] text-textSecondary">Physics-Informed ML + Equações de Dunkle</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-cyanNeon bg-cyanNeon/10 border border-cyanNeon/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Modo Banca
          </span>
        </div>

        {/* Resumo da Produção Estimada */}
        <div className="grid grid-cols-3 gap-2 text-center my-3">
          <div className="bg-surface/80 p-2.5 rounded-2xl border border-cyanNeon/30">
            <span className="text-[10px] text-textSecondary block">Produção Prevista</span>
            <span className="text-lg font-extrabold text-cyanNeon glow-cyan-text">
              {kpis.total_real_liters_day}
            </span>
            <span className="text-[9px] text-textSecondary block">L/dia</span>
          </div>

          <div className="bg-surface/80 p-2.5 rounded-2xl border border-surfaceBorder">
            <span className="text-[10px] text-textSecondary block">Teórico Dunkle</span>
            <span className="text-lg font-extrabold text-white">
              {kpis.total_dunkle_liters_day}
            </span>
            <span className="text-[9px] text-textSecondary block">L/dia</span>
          </div>

          <div className="bg-surface/80 p-2.5 rounded-2xl border border-surfaceBorder">
            <span className="text-[10px] text-textSecondary block">Eficiência η</span>
            <span className="text-lg font-extrabold text-greenNeon">
              {kpis.average_efficiency_percent}%
            </span>
            <span className="text-[9px] text-textSecondary block">Média Solar</span>
          </div>
        </div>

        {/* Gráfico Dinâmico da Simulação */}
        <div className="w-full h-[140px] bg-[#0A0E17]/80 rounded-2xl p-1 border border-surfaceBorder mb-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Grid */}
            {[0, 300, 600].map((yVal) => (
              <g key={yVal}>
                <line
                  x1={padding.left}
                  y1={getY(yVal)}
                  x2={width - padding.right}
                  y2={getY(yVal)}
                  stroke="#1E2B42"
                  strokeDasharray="2 3"
                />
                <text x={padding.left - 4} y={getY(yVal) + 3} fill="#64748B" fontSize="7" textAnchor="end">
                  {yVal}
                </text>
              </g>
            ))}

            <polyline fill="none" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.6" points={dunklePoints} />
            <polyline fill="none" stroke="#00D2FF" strokeWidth="2" strokeDasharray="4 2" points={pimlPoints} />
            <polyline fill="none" stroke="#00E676" strokeWidth="2.2" points={realPoints} />

            {series.map((pt, i) => (
              <text key={i} x={getX(i)} y={height - 3} fill="#94A3B8" fontSize="7" textAnchor="middle">
                {pt.time}
              </text>
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[9px] text-textSecondary px-1">
          <span className="flex items-center gap-1"><span className="w-2 h-1 bg-greenNeon rounded-full inline-block"></span> Produção Estimada</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 border-b border-dashed border-cyanNeon inline-block"></span> PIML Híbrido</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 border-b border-dotted border-sky-400 inline-block"></span> Dunkle Físico</span>
        </div>
      </div>

      {/* Painel de Controle de Parâmetros Climáticos */}
      <div className="w-full rounded-3xl glass-panel p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyanNeon" />
          Ajuste de Variáveis & Microclimas
        </h3>

        {/* Seletor de Região */}
        <div>
          <label className="text-[11px] text-textSecondary block mb-1.5 font-medium">
            Matriz Regional de Clima:
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {[
              { id: 'semiarido', label: '☀️ Semiárido (Juazeiro)' },
              { id: 'tropical_seco', label: '🌾 Tropical (Cuiabá)' },
              { id: 'litoral', label: '🌊 Litoral Úmido (Santos)' },
              { id: 'altitude', label: '⛰️ Serrana (Lages)' },
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => setRegionKey(reg.id)}
                className={`py-2 px-2.5 rounded-xl border text-left font-medium transition-all ${
                  regionKey === reg.id
                    ? 'bg-cyanNeon/15 border-cyanNeon text-white shadow-glow-cyan'
                    : 'bg-surface/60 border-surfaceBorder text-textSecondary hover:text-white'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Interativos */}
        <div className="space-y-3.5 pt-2">
          {/* Radiação Solar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-textSecondary flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-orange-400" /> Irradiação Solar (Pico)
              </span>
              <span className="font-bold text-cyanNeon font-mono">
                {(irradianceMult * 950).toFixed(0)} W/m²
              </span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.2"
              step="0.05"
              value={irradianceMult}
              onChange={(e) => setIrradianceMult(parseFloat(e.target.value))}
              className="w-full accent-cyanNeon bg-surface cursor-pointer h-1.5 rounded-lg"
            />
          </div>

          {/* Lâmina d'água na bacia */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-textSecondary flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-cyanNeon" /> Lâmina d'Água na Bacia
              </span>
              <span className="font-bold text-white font-mono">{waterDepth} mm</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="1"
              value={waterDepth}
              onChange={(e) => setWaterDepth(parseFloat(e.target.value))}
              className="w-full accent-cyanNeon bg-surface cursor-pointer h-1.5 rounded-lg"
            />
            <div className="flex justify-between text-[9px] text-textSecondary mt-0.5">
              <span>5mm (Rápido aquecimento)</span>
              <span>35mm (Inércia noturna)</span>
            </div>
          </div>

          {/* Ângulo de inclinação da cobertura de vidro */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-textSecondary flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" /> Inclinação do Vidro
              </span>
              <span className="font-bold text-white font-mono">{glassTilt}°</span>
            </div>
            <input
              type="range"
              min="10"
              max="35"
              step="1"
              value={glassTilt}
              onChange={(e) => setGlassTilt(parseFloat(e.target.value))}
              className="w-full accent-cyanNeon bg-surface cursor-pointer h-1.5 rounded-lg"
            />
          </div>

          {/* Simulação de TDS da água */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-textSecondary flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blueElectric" /> TDS do Condensado Pós-Calcita
              </span>
              <span className={`font-bold font-mono ${customTds <= 300 ? 'text-emeraldPotable' : 'text-alertRed'}`}>
                {customTds} mg/L
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="1200"
              step="10"
              value={customTds}
              onChange={(e) => setCustomTds(parseFloat(e.target.value))}
              className="w-full accent-emeraldPotable bg-surface cursor-pointer h-1.5 rounded-lg"
            />
            <div className="flex justify-between text-[9px] text-textSecondary mt-0.5">
              <span>20 mg/L (Destilada)</span>
              <span className="text-emeraldPotable">140 mg/L (Ótimo)</span>
              <span className="text-alertRed">&gt;1000 mg/L (Respingo)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
