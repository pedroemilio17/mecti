import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, Info, Flame, Droplet, Sparkles } from 'lucide-react';
import { fetchActiveAlerts } from '../../services/api';

export default function AlertsTab() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchActiveAlerts().then(setAlerts);
  }, []);

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* 1. Checklist de Conformidade da Portaria GM/MS nº 888/2021 */}
      <div className="w-full rounded-3xl glass-panel-glow p-5">
        <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emeraldPotable" />
            <div>
              <h2 className="text-sm font-bold text-white">Conformidade Sanitária (Portaria 888)</h2>
              <p className="text-[10px] text-textSecondary">Padrão de Potabilidade para Consumo Humano</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emeraldPotable bg-emeraldPotable/10 border border-emeraldPotable/30 px-2 py-0.5 rounded-full">
            APROVADO
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {[
            {
              param: 'Sólidos Totais Dissolvidos (TDS)',
              limit: 'VMP < 1000 mg/L (Alvo: 100-300 mg/L)',
              measured: '140.0 mg/L',
              status: 'Conforme',
              detail: 'Remineralizado por leito de calcita (Ca²⁺ e Mg²⁺ adicionados).'
            },
            {
              param: 'Potencial Hidrogeniônico (pH)',
              limit: 'Faixa recomendada: 6.0 a 9.5',
              measured: '7.2 pH',
              status: 'Neutro / Ótimo',
              detail: 'Neutralização de acidez carbônica pelo carbonato de cálcio.'
            },
            {
              param: 'Escherichia coli / Coliformes',
              limit: 'Ausência total em 100 mL',
              measured: 'Ausente (0 UFC/100mL)',
              status: 'Estéril',
              detail: 'Eliminação completa pela pasteurização solar a >65°C.'
            },
            {
              param: 'Cloro Residual Livre (CRL)',
              limit: 'Mínimo 0.2 mg/L na saída',
              measured: '0.5 mg/L',
              status: 'Protegido',
              detail: 'Dosagem de hipoclorito para proteção contra contaminação secundária.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-surface/60 rounded-xl p-3 border border-surfaceBorder/40">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">{item.param}</span>
                <span className="text-emeraldPotable font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {item.status}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-textSecondary mb-1.5">
                <span>Norma: {item.limit}</span>
                <span className="text-cyanNeon font-mono font-medium">Medido: {item.measured}</span>
              </div>
              <p className="text-[10px] text-textSecondary/80 border-t border-surfaceBorder/30 pt-1">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Gestão de Salmoura — Descarga Líquida Zero (ZLD) */}
      <div className="w-full rounded-2xl bg-[#0F1522] border border-cyanNeon/20 p-4">
        <div className="flex items-center gap-2.5 mb-2">
          <Sparkles className="w-4 h-4 text-cyanNeon" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Gestão de Rejeito Salino (ZLD)
          </h3>
        </div>
        <p className="text-[11px] text-textSecondary leading-relaxed mb-3">
          O rejeito concentrado (salmoura) é drenado para uma bandeja de secagem solar rasa anexa, evitando a contaminação do solo do Semiárido e permitindo a recuperação de sal seco para nutrição animal.
        </p>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-surface p-2 rounded-xl border border-surfaceBorder/40">
            <span className="text-[10px] text-textSecondary block">Status da Salmoura</span>
            <span className="font-bold text-cyanNeon">Drenagem Programada</span>
          </div>
          <div className="bg-surface p-2 rounded-xl border border-surfaceBorder/40">
            <span className="text-[10px] text-textSecondary block">Sal Recuperado (Mês)</span>
            <span className="font-bold text-white">1.8 kg de Sal Seco</span>
          </div>
        </div>
      </div>

      {/* 3. Feed de Alertas do Sistema */}
      <div className="w-full rounded-3xl glass-panel p-5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-alertAmber" />
          Registro Histórico de Alertas
        </h3>

        <div className="space-y-2.5">
          {alerts.map((al) => {
            const isCrit = al.severity === 'CRITICAL';
            const isSucc = al.severity === 'SUCCESS';
            const isWarn = al.severity === 'WARNING';

            return (
              <div
                key={al.id}
                className={`rounded-2xl p-3.5 border transition-all ${
                  isCrit
                    ? 'bg-alertRed/10 border-alertRed/40 text-alertRed'
                    : isSucc
                    ? 'bg-emeraldPotable/10 border-emeraldPotable/40 text-emeraldPotable'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {isCrit ? (
                      <AlertTriangle className="w-4 h-4 text-alertRed flex-shrink-0" />
                    ) : isSucc ? (
                      <CheckCircle className="w-4 h-4 text-emeraldPotable flex-shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    )}
                    <span className="text-xs font-bold text-white">{al.title}</span>
                  </div>
                  <span className="text-[9px] font-mono opacity-70">
                    {new Date(al.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-[11px] text-textSecondary mt-1 leading-relaxed">
                  {al.description}
                </p>

                {al.action_required && (
                  <div className="mt-2 pt-2 border-t border-surfaceBorder/40 text-[10px] text-white/90">
                    <span className="font-semibold text-cyanNeon">Ação Recomendada: </span>
                    {al.action_required}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
