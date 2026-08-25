import React, { useState, useEffect } from 'react';
import { 
  FileBarChart, 
  Download, 
  Layers, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Wrench, 
  Sparkles, 
  Droplets, 
  Thermometer, 
  Sun, 
  ShieldCheck, 
  CheckCircle2,
  Table,
  BarChart2,
  FileSpreadsheet,
  AlertTriangle,
  CloudRain,
  Wind,
  Zap,
  Lightbulb,
  Check,
  ChevronRight
} from 'lucide-react';
import { fetchDetailedReport, exportDataToCSV, exportMaintenanceToCSV } from '../../services/api';

export default function ReportsTab() {
  const [selectedDevice, setSelectedDevice] = useState('PINGOSOLAR-01');
  const [selectedDays, setSelectedDays] = useState(14);
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview', 'anomalies', 'environment', 'maintenance', 'financial'
  const [reportData, setReportData] = useState(null);
  const [selectedAnomalyIndex, setSelectedAnomalyIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDetailedReport(selectedDevice, selectedDays).then((res) => {
      setReportData(res);
      setLoading(false);
    });
  }, [selectedDevice, selectedDays]);

  const summary = reportData?.metrics_summary || {};
  const history = reportData?.environmental_history || [];
  const anomalies = reportData?.detected_anomalies || [];
  const maintenance = reportData?.maintenance_records || [];
  const devices = reportData?.all_devices || [];

  const handleExportTelemetry = () => {
    if (history.length > 0) {
      exportDataToCSV(history, `pingosolar_telemetria_avancada_${selectedDevice}_${selectedDays}dias.csv`);
    }
  };

  const handleExportMaintenance = () => {
    if (maintenance.length > 0) {
      exportMaintenanceToCSV(maintenance, `pingosolar_manutencoes_${selectedDevice}.csv`);
    }
  };

  // SVG Chart Dimensions
  const width = 340;
  const height = 120;
  const padding = { top: 12, right: 10, bottom: 20, left: 28 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;
  const maxVal = Math.max(6, ...history.map(h => Math.max(h.production_real_liters, h.piml_predicted_liters)));

  const getX = (i) => padding.left + (i / Math.max(1, history.length - 1)) * graphWidth;
  const getY = (val) => padding.top + graphHeight - (Math.min(maxVal, val) / maxVal) * graphHeight;

  const realPoints = history.map((pt, i) => `${getX(i)},${getY(pt.production_real_liters)}`).join(' ');
  const pimlPoints = history.map((pt, i) => `${getX(i)},${getY(pt.piml_predicted_liters)}`).join(' ');

  return (
    <div className="space-y-3.5 pb-24 animate-fadeIn">
      
      {/* 1. TOPO: Filtros de Estação & Período + Botão de Exportação CSV */}
      <div className="rounded-3xl glass-panel-glow p-4">
        <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <FileBarChart className="w-4 h-4 text-cyanNeon" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Diagnóstico de Engenharia & Telemetria
            </h2>
          </div>
          {anomalies.length > 0 && (
            <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" /> {anomalies.length} Anomalias IA
            </span>
          )}
        </div>

        {/* Seletor de Estação / Dispositivo */}
        <div className="mb-3">
          <label className="text-[10px] text-textSecondary uppercase tracking-wider block mb-1 font-semibold">
            Selecionar Estação de Dessalinização:
          </label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedDevice('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedDevice === 'ALL'
                  ? 'bg-gradient-to-r from-blueElectric to-cyanNeon text-black shadow-glow-cyan scale-[1.02]'
                  : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-white'
              }`}
            >
              🌐 Todas as Unidades
            </button>

            {devices.map((d, i) => (
              <button
                key={d.device_id}
                onClick={() => setSelectedDevice(d.device_id)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedDevice === d.device_id
                    ? 'bg-cyanNeon/20 border border-cyanNeon text-white shadow-glow-cyan scale-[1.02]'
                    : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-white'
                }`}
              >
                ☀️ Unidade 0{i + 1} ({d.name.split('—')[1]?.trim() || d.device_id})
              </button>
            ))}
          </div>
        </div>

        {/* Linha de Controles: Filtro de Dias e Botões de Exportação */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-surfaceBorder/40">
          <div className="flex items-center gap-1">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setSelectedDays(days)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedDays === days
                    ? 'bg-white text-black font-bold'
                    : 'bg-surface/80 text-textSecondary hover:text-white border border-surfaceBorder'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>

          {/* Botões de Ação de Download CSV */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportTelemetry}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emeraldPotable to-emerald-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all"
              title="Baixar CSV com variáveis ambientais, telemetria e diagnósticos de IA"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>CSV Telemetria + IA</span>
            </button>

            <button
              onClick={handleExportMaintenance}
              className="px-2.5 py-1.5 rounded-xl bg-surface border border-surfaceBorder hover:border-cyanNeon text-cyanNeon text-[11px] font-semibold flex items-center gap-1 hover:text-white transition-all active:scale-95"
              title="Baixar CSV com histórico de manutenções e despesas"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Manutenções</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUB-ABAS INTERNAS DE NAVEGAÇÃO */}
      <div className="grid grid-cols-5 gap-1 bg-[#0A0E17]/90 p-1 rounded-2xl border border-surfaceBorder text-center text-xs">
        {[
          { id: 'overview', label: '📊 Visão' },
          { id: 'anomalies', label: `🧠 IA (${anomalies.length})`, highlight: anomalies.length > 0 },
          { id: 'environment', label: '🌡️ Clima' },
          { id: 'maintenance', label: '🔧 Diário' },
          { id: 'financial', label: '💰 Custos' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`py-1.5 rounded-xl font-bold transition-all text-[10px] ${
              activeSubTab === tab.id
                ? 'bg-surface text-cyanNeon shadow-sm border border-cyanNeon/30'
                : tab.highlight
                ? 'text-amber-400 hover:text-amber-300'
                : 'text-textSecondary hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. SUB-ABA 1: VISÃO GERAL & ANÁLISE PREDITIVA PIML */}
      {activeSubTab === 'overview' && (
        <div className="space-y-3 animate-fadeIn">
          {/* Quadro de Métricas Chave */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-surface/80 rounded-2xl p-2.5 border border-cyanNeon/30">
              <span className="text-[9px] text-textSecondary block">Total Produzido</span>
              <span className="text-base font-extrabold text-cyanNeon font-mono">
                {summary.total_water_liters_period} L
              </span>
              <span className="text-[8px] text-emeraldPotable block mt-0.5">
                Média: {summary.avg_daily_yield_liters} L/dia
              </span>
            </div>

            <div className="bg-surface/80 rounded-2xl p-2.5 border border-surfaceBorder">
              <span className="text-[9px] text-textSecondary block">Eficiência Térmica</span>
              <span className="text-base font-extrabold text-greenNeon font-mono">
                {summary.avg_thermal_efficiency_pct}%
              </span>
              <span className="text-[8px] text-textSecondary block mt-0.5">
                ΔT Médio: {summary.avg_delta_t_c}°C
              </span>
            </div>

            <div className="bg-surface/80 rounded-2xl p-2.5 border border-purple-500/30">
              <span className="text-[9px] text-textSecondary block">Acurácia PIML</span>
              <span className="text-base font-extrabold text-purple-400 font-mono">
                {summary.piml_model_accuracy_pct}%
              </span>
              <span className="text-[8px] text-purple-300 block mt-0.5">
                Detecta anomalias
              </span>
            </div>
          </div>

          {/* Gráfico Comparativo com Destaque de Anomalias */}
          <div className="rounded-3xl glass-panel p-4">
            <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyanNeon" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Produção Real vs IA com Alertas
                </span>
              </div>
              <span className="text-[9px] text-textSecondary font-mono">
                {selectedDays} dias
              </span>
            </div>

            <div className="w-full h-[130px] bg-[#0A0E17]/80 rounded-2xl p-1 border border-surfaceBorder mb-2">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Grid */}
                {[0, 2, 4, 6].map((yVal) => (
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
                      {yVal}L
                    </text>
                  </g>
                ))}

                {/* Previsão PIML (Pontilhada Cyan) */}
                <polyline fill="none" stroke="#00D2FF" strokeWidth="2" strokeDasharray="3 2" points={pimlPoints} />
                
                {/* Produção Real (Sólida Verde/Azul) */}
                <polyline fill="none" stroke="#00E676" strokeWidth="2.5" points={realPoints} />

                {/* Pontos com Indicador de Anomalia / Mal Tempo */}
                {history.map((pt, i) => {
                  const hasAnom = pt.anomaly?.has_anomaly;
                  return (
                    <g key={i} className="cursor-pointer" onClick={() => setActiveSubTab('anomalies')}>
                      <circle 
                        cx={getX(i)} 
                        cy={getY(pt.production_real_liters)} 
                        r={hasAnom ? "5.5" : "3"} 
                        fill={hasAnom ? (pt.anomaly.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B') : '#00E676'} 
                        stroke="#0A0E17" 
                        strokeWidth="1.5"
                        className={hasAnom ? "animate-pulse" : ""}
                      />
                      {hasAnom && (
                        <circle 
                          cx={getX(i)} 
                          cy={getY(pt.production_real_liters)} 
                          r="9" 
                          fill="none" 
                          stroke={pt.anomaly.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B'} 
                          strokeWidth="1" 
                          strokeDasharray="2 2"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[9px] text-textSecondary px-1">
              <span className="flex items-center gap-1"><span className="w-2 h-1 bg-greenNeon rounded-full inline-block"></span> Produção Real</span>
              <span className="flex items-center gap-1"><span className="w-2 h-0.5 border-b border-dashed border-cyanNeon inline-block"></span> Previsão PIML</span>
              <span className="flex items-center gap-1 text-alertRed font-bold"><span className="w-2 h-2 rounded-full bg-alertRed inline-block animate-ping"></span> Mal Tempo / Avaria</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUB-ABA 2: DIAGNÓSTICO INTELIGENTE DE ANOMALIAS (ML / IA) */}
      {activeSubTab === 'anomalies' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="rounded-3xl bg-gradient-to-r from-amber-500/20 via-surface to-surface border border-amber-500/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Diagnóstico Preditivo por Aprendizado de Máquina
                </h3>
              </div>
              <span className="text-[10px] font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
                {anomalies.length} Eventos Detectados
              </span>
            </div>
            <p className="text-[11px] text-textSecondary leading-relaxed">
              O modelo compara a taxa física de <strong>Dunkle</strong> com a medição dos sensores e identifica automaticamente a causa-raiz de desvios climáticos ou mecânicos.
            </p>
          </div>

          {/* Cards Detalhados de Cada Anomalia com Solução Sugerida */}
          <div className="space-y-3">
            {anomalies.map((anomItem, idx) => {
              const an = anomItem.anomaly;
              const isCrit = an.severity === 'CRITICAL';

              return (
                <div 
                  key={idx}
                  className={`rounded-3xl p-4 border transition-all ${
                    isCrit 
                      ? 'bg-alertRed/10 border-alertRed/40 shadow-lg shadow-red-950/20' 
                      : 'bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {isCrit ? (
                        <CloudRain className="w-5 h-5 text-alertRed flex-shrink-0" />
                      ) : (
                        <Wind className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      )}
                      <div>
                        <span className="text-xs font-bold text-white block">{an.title}</span>
                        <span className="text-[10px] text-textSecondary font-mono">{anomItem.date} • {anomItem.device_id}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isCrit ? 'bg-alertRed/20 text-alertRed border-alertRed/40' : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    }`}>
                      {an.badge}
                    </span>
                  </div>

                  {/* Diagnóstico da IA */}
                  <div className="bg-[#0A0E17]/80 rounded-2xl p-3 border border-surfaceBorder/60 my-2 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-cyanNeon mb-1 font-semibold">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyanNeon" /> Diagnóstico do Algoritmo PIML:
                      </span>
                      <span>Confiança: {an.confidence_pct}%</span>
                    </div>
                    <p className="text-[11px] text-textSecondary leading-relaxed">
                      {an.diagnosis_ml}
                    </p>

                    <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-surfaceBorder/40 text-[10px] text-center">
                      <div>
                        <span className="text-textSecondary block">Sol Medido:</span>
                        <span className="font-bold text-white">{anomItem.solar_irradiance_w_m2} W/m²</span>
                      </div>
                      <div>
                        <span className="text-textSecondary block">Real vs IA:</span>
                        <span className="font-bold text-orange-400">{anomItem.production_real_liters}L <span className="text-[8px] text-textSecondary">(vs {anomItem.piml_predicted_liters}L)</span></span>
                      </div>
                      <div>
                        <span className="text-textSecondary block">Temp. Água:</span>
                        <span className="font-bold text-white">{anomItem.water_temp_c}°C</span>
                      </div>
                    </div>
                  </div>

                  {/* Sugestão de Solução Prática */}
                  <div className="bg-emeraldPotable/10 border border-emeraldPotable/30 rounded-2xl p-3 text-xs">
                    <span className="text-[11px] font-bold text-emeraldPotable flex items-center gap-1.5 mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-emeraldPotable" /> Ação Corretiva Sugerida pelo Sistema:
                    </span>
                    <p className="text-[11px] text-emerald-100/90 leading-relaxed font-medium">
                      {an.suggested_solution}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. SUB-ABA 3: TABELA DE VARIÁVEIS AMBIENTAIS */}
      {activeSubTab === 'environment' && (
        <div className="rounded-3xl glass-panel p-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-2 mb-3">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Registros de Telemetria & Eventos
              </span>
            </div>
            <span className="text-[10px] text-textSecondary font-mono">
              {history.length} dias
            </span>
          </div>

          <div className="overflow-x-auto text-xs max-h-[320px] overflow-y-auto pr-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surfaceBorder text-textSecondary text-[10px] uppercase">
                  <th className="py-1.5 px-2">Data</th>
                  <th className="py-1.5 px-1">Sol</th>
                  <th className="py-1.5 px-1">Tw</th>
                  <th className="py-1.5 px-1">ΔT</th>
                  <th className="py-1.5 px-1">Litros</th>
                  <th className="py-1.5 px-1">Status / IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surfaceBorder/40 font-mono text-[11px]">
                {history.map((r, i) => {
                  const hasAnom = r.anomaly?.has_anomaly;
                  return (
                    <tr key={i} className={`hover:bg-surface/50 transition-colors ${hasAnom ? 'bg-amber-500/10' : ''}`}>
                      <td className="py-2 px-2 text-white font-semibold flex items-center gap-1">
                        {hasAnom && <span className="w-1.5 h-1.5 rounded-full bg-alertRed animate-ping"></span>}
                        {r.date.slice(5)}
                      </td>
                      <td className={`py-2 px-1 ${r.solar_irradiance_w_m2 < 300 ? 'text-blue-400 font-bold' : 'text-orange-300'}`}>
                        {r.solar_irradiance_w_m2.toFixed(0)}W
                      </td>
                      <td className="py-2 px-1 text-white">{r.water_temp_c}°C</td>
                      <td className="py-2 px-1 text-cyanNeon">{r.delta_t_c}°C</td>
                      <td className="py-2 px-1 font-bold text-greenNeon">{r.production_real_liters}L</td>
                      <td className="py-2 px-1">
                        {hasAnom ? (
                          <span className="text-[9px] font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded border border-amber-400/30">
                            {r.anomaly.badge.split(' ')[0]} Anomalia
                          </span>
                        ) : (
                          <span className="text-[9px] text-emeraldPotable font-medium">Nominal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SUB-ABA 4: DIÁRIO DE MANUTENÇÃO */}
      {activeSubTab === 'maintenance' && (
        <div className="rounded-3xl glass-panel p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-2">
            <div className="flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-cyanNeon" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Diário de Manutenção & Avaliação
              </span>
            </div>
            <span className="text-[10px] text-emeraldPotable font-semibold bg-emeraldPotable/10 px-2 py-0.5 rounded-full border border-emeraldPotable/30">
              Conforme
            </span>
          </div>

          <div className="space-y-2.5">
            {maintenance.map((m) => (
              <div key={m.id} className="bg-surface/70 rounded-2xl p-3 border border-surfaceBorder/50 text-xs">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <span className="font-bold text-white block">{m.type}</span>
                    <span className="text-[10px] text-cyanNeon font-mono">{m.id} • {m.device_id}</span>
                  </div>
                  <span className="text-[10px] text-textSecondary font-mono">{m.date}</span>
                </div>

                <p className="text-[11px] text-textSecondary my-1.5 leading-relaxed">
                  {m.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surfaceBorder/40 text-[10px]">
                  <div>
                    <span className="text-textSecondary block">Responsável:</span>
                    <span className="font-semibold text-white">{m.operator}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-textSecondary block">Custo Direto:</span>
                    <span className="font-bold text-emeraldPotable">R$ {m.cost_brl.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-2 bg-[#0A0E17]/60 p-1.5 rounded-lg flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> {m.eval_sanitary}
                  </span>
                  <span className="text-textSecondary">Próxima: {m.next_due_date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SUB-ABA 5: GASTOS & RETORNO LCOW */}
      {activeSubTab === 'financial' && (
        <div className="rounded-3xl glass-panel p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-2">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emeraldPotable" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Balanço de Gastos & Economia
              </span>
            </div>
            <span className="text-[10px] text-emeraldPotable font-extrabold">
              ROI Positivo
            </span>
          </div>

          <div className="bg-[#0A0E17]/80 rounded-2xl p-3.5 border border-surfaceBorder">
            <span className="text-[10px] text-textSecondary uppercase tracking-wider block">
              Economia Líquida Gerada no Período
            </span>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-2xl font-black text-emeraldPotable font-mono">
                R$ {summary.estimated_net_savings_brl}
              </span>
              <span className="text-[10px] text-textSecondary">
                vs R$ 0,45/L do caminhão-pipa
              </span>
            </div>
            <p className="text-[10px] text-textSecondary leading-relaxed border-t border-surfaceBorder/40 pt-1.5">
              Considerando custo de produção de <strong className="text-white">R$ 0,18/L</strong> somado a <strong className="text-white">R$ {summary.total_maintenance_spent_brl}</strong> em insumos de calcita/cloro no período.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-surface/70 p-2.5 rounded-xl border border-surfaceBorder/40">
              <span className="text-[9px] text-textSecondary block">Gasto Total com Insumos</span>
              <span className="font-extrabold text-white font-mono">
                R$ {summary.total_maintenance_spent_brl}
              </span>
            </div>
            <div className="bg-surface/70 p-2.5 rounded-xl border border-surfaceBorder/40">
              <span className="text-[9px] text-textSecondary block">Volume Purificado</span>
              <span className="font-extrabold text-cyanNeon font-mono">
                {summary.total_water_liters_period} Litros
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
