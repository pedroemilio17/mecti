const API_BASE_URL = 'http://localhost:8000/api/v1';

const MOCK_DEVICES = [
  {
    device_id: "PINGOSOLAR-01",
    name: "Unidade 01 — Bacia Norte",
    location: "Juazeiro-BA (Setor A)",
    install_date: "2026-01-15",
    operator: "Severino dos Santos",
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
    efficiency_percent: 34.2,
    piml_accuracy_percent: 95.4,
    avg_cycle_min_per_500ml: 42,
    time_to_full_hours: 1.3
  },
  {
    device_id: "PINGOSOLAR-02",
    name: "Unidade 02 — Bacia Central",
    location: "Juazeiro-BA (Setor B)",
    install_date: "2026-02-01",
    operator: "Maria da Conceição",
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
    efficiency_percent: 35.1,
    piml_accuracy_percent: 94.8,
    avg_cycle_min_per_500ml: 39,
    time_to_full_hours: 3.8
  },
  {
    device_id: "PINGOSOLAR-03",
    name: "Unidade 03 — Bacia Sul",
    location: "Juazeiro-BA (Setor C)",
    install_date: "2026-02-10",
    operator: "José Oliveira",
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
    efficiency_percent: 33.4,
    piml_accuracy_percent: 93.9,
    avg_cycle_min_per_500ml: 46,
    time_to_full_hours: 6.2
  }
];

const MOCK_MAINTENANCE = [
  {
    id: "MNT-001",
    device_id: "PINGOSOLAR-01",
    date: "2026-08-20",
    type: "Limpeza & Desincrustação Pós-Poeira",
    description: "Drenagem da bacia para cristalizador ZLD e lavagem externa do vidro após ventania.",
    eval_sanitary: "Aprovado (Transmitância restaurada)",
    operator: "Severino dos Santos",
    cost_brl: 0.0,
    next_due_date: "2026-09-20"
  },
  {
    id: "MNT-002",
    device_id: "PINGOSOLAR-01",
    date: "2026-08-10",
    type: "Recarga de Calcita / Calibração",
    description: "Reposição de 500g de calcita mineral e aferição de sondas de pH.",
    eval_sanitary: "Aprovado (pH 7.2 estável)",
    operator: "Técnico Especialista",
    cost_brl: 15.0,
    next_due_date: "2026-11-10"
  },
  {
    id: "MNT-003",
    device_id: "PINGOSOLAR-02",
    date: "2026-08-18",
    type: "Reaperto de Vedações (Vazamento de Vapor)",
    description: "Substituição preventiva de 1 metro de silicone neutro na borda superior.",
    eval_sanitary: "Aprovado (Estanqueidade 100%)",
    operator: "Maria da Conceição",
    cost_brl: 12.0,
    next_due_date: "2026-12-18"
  },
  {
    id: "MNT-004",
    device_id: "PINGOSOLAR-03",
    date: "2026-08-15",
    type: "Cloração & Sanitização",
    description: "Dosagem de proteção residual no reservatório de 20L.",
    eval_sanitary: "Aprovado (0 UFC coliformes)",
    operator: "José Oliveira",
    cost_brl: 5.0,
    next_due_date: "2026-09-15"
  }
];

function generateLocalHistoryWithAnomalies(deviceId, days = 14) {
  const list = [];
  const now = new Date();
  const devMult = deviceId === "PINGOSOLAR-01" ? 1.0 : deviceId === "PINGOSOLAR-02" ? 1.05 : 0.94;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    let irr, tw, tg, delta_t, litersReal, litersPiml, tds, ph, efficiency, anomaly;

    if (i === 4) {
      // 1. DIA DE MAL TEMPO / TEMPESTADE DE CHUVA SEVERA
      irr = 180.0;
      tw = 31.0;
      tg = 26.5;
      delta_t = 4.5;
      litersReal = 0.75;
      litersPiml = 0.85;
      tds = 95.0;
      ph = 6.9;
      efficiency = 18.2;
      anomaly = {
        has_anomaly: true,
        type: "WEATHER_STORM",
        severity: "CRITICAL",
        badge: "⛈️ Tempestade Severa",
        title: "Avaria Climática: Bloqueio Solar & Resfriamento",
        diagnosis_ml: "Nebulosidade densa com chuva torrencial. Queda de 80% na irradiação solar e perda térmica na cobertura.",
        confidence_pct: 98.4,
        suggested_solution: "1. Manter sistema fechado para evitar contaminação por enxurrada. 2. Purgar calha externa de captação de chuva."
      };
    } else if (i === 8) {
      // 2. DIA DE TEMPESTADE DE POEIRA / VIDRO OCLUÍDO
      irr = 890.0;
      tw = 52.0;
      tg = 38.0;
      delta_t = 14.0;
      litersReal = 2.30;
      litersPiml = 2.45;
      tds = 142.0;
      ph = 7.1;
      efficiency = 21.0;
      anomaly = {
        has_anomaly: true,
        type: "DUST_OCCLUSION",
        severity: "WARNING",
        badge: "🌪️ Vidro Ocluído por Poeira",
        title: "Anomalia Óptica: Acúmulo de Poeira na Tampa",
        diagnosis_ml: "Radiação incidente alta (890 W/m²), porém absorção térmica 45% abaixo do Modelo de Dunkle nominal. Forte indicativo de poeira/argila na face externa.",
        confidence_pct: 96.1,
        suggested_solution: "Realizar lavagem mecânica simples da face externa do vidro com água bruta antes do início do ciclo matinal (07:30)."
      };
    } else if (i === 11) {
      // 3. DIA DE FUGA DE VAPOR POR FISSURA
      irr = 910.0;
      tw = 71.5;
      tg = 42.0;
      delta_t = 29.5;
      litersReal = 2.80;
      litersPiml = 3.05;
      tds = 138.0;
      ph = 7.2;
      efficiency = 24.5;
      anomaly = {
        has_anomaly: true,
        type: "VAPOR_LEAK",
        severity: "WARNING",
        badge: "💨 Fuga de Vapor",
        title: "Anomalia Mecânica: Perda de Estanqueidade",
        diagnosis_ml: "Gradiente térmico extremo (ΔT = 29.5°C) sem correlação de vazão. O algoritmo PIML identificou fuga de calor latente por fresta nas vedações de silicone.",
        confidence_pct: 93.7,
        suggested_solution: "Inspecionar borrachas e reapertar parafusos da moldura ou aplicar camada de silicone neutro de cura rápida."
      };
    } else {
      irr = +(780 + 170 * ((i % 5) / 5) * devMult).toFixed(1);
      tw = +(64 + 7 * ((i % 4) / 4) * devMult).toFixed(1);
      tg = +(tw * 0.61).toFixed(1);
      delta_t = +(tw - tg).toFixed(1);
      litersReal = +((3.9 + 0.8 * (irr / 950)) * devMult).toFixed(2);
      litersPiml = +(litersReal * (0.98 + 0.03 * ((i % 3) / 3))).toFixed(2);
      tds = +(135 + 10 * ((i % 4) / 4)).toFixed(1);
      ph = +(7.1 + 0.2 * ((i % 3) / 3)).toFixed(2);
      efficiency = +((litersReal / 5) * 40).toFixed(1);
      anomaly = { has_anomaly: false };
    }

    list.push({
      date: dateStr,
      device_id: deviceId || "PINGOSOLAR-01",
      solar_irradiance_w_m2: irr,
      water_temp_c: tw,
      glass_temp_c: tg,
      delta_t_c: delta_t,
      flow_rate_peak_ml_h: Math.round(litersReal * 100),
      production_real_liters: litersReal,
      piml_predicted_liters: litersPiml,
      prediction_error_pct: +(Math.abs(litersReal - litersPiml) / Math.max(0.1, litersReal) * 100).toFixed(1),
      tds_value_mg_l: tds,
      ph_value: ph,
      thermal_efficiency_pct: efficiency,
      sanitary_status: tds <= 300 ? "CONFORME (Portaria 888)" : "ALERTA",
      anomaly: anomaly
    });
  }
  return list;
}

export async function fetchDetailedReport(deviceId = "PINGOSOLAR-01", days = 14) {
  try {
    const res = await fetch(`${API_BASE_URL}/reports/detailed?device_id=${deviceId}&days=${days}`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    const isAll = deviceId === "ALL";
    const targetDev = isAll ? { name: "Toda a Comunidade (3 Unidades)", device_id: "ALL" } : MOCK_DEVICES.find(d => d.device_id === deviceId) || MOCK_DEVICES[0];
    const history = generateLocalHistoryWithAnomalies(targetDev.device_id, days);
    const anomalies = history.filter(h => h.anomaly?.has_anomaly);
    const mnt = isAll ? MOCK_MAINTENANCE : MOCK_MAINTENANCE.filter(m => m.device_id === targetDev.device_id);
    const totalWater = history.reduce((acc, h) => acc + h.production_real_liters, 0) * (isAll ? 3 : 1);
    const totalSpent = mnt.reduce((acc, m) => acc + m.cost_brl, 0);

    return {
      device_info: targetDev,
      all_devices: MOCK_DEVICES,
      metrics_summary: {
        total_water_liters_period: +totalWater.toFixed(1),
        avg_daily_yield_liters: +(totalWater / days).toFixed(2),
        avg_thermal_efficiency_pct: +(history.reduce((a, b) => a + b.thermal_efficiency_pct, 0) / history.length).toFixed(1),
        avg_delta_t_c: +(history.reduce((a, b) => a + b.delta_t_c, 0) / history.length).toFixed(1),
        avg_ph: +(history.reduce((a, b) => a + b.ph_value, 0) / history.length).toFixed(2),
        avg_tds: +(history.reduce((a, b) => a + b.tds_value_mg_l, 0) / history.length).toFixed(1),
        piml_model_accuracy_pct: 94.8,
        total_anomalies_detected: anomalies.length,
        total_maintenance_spent_brl: +totalSpent.toFixed(2),
        estimated_net_savings_brl: +(totalWater * (0.45 - 0.18) - totalSpent).toFixed(2)
      },
      environmental_history: history,
      detected_anomalies: anomalies,
      maintenance_records: mnt
    };
  }
}

export function exportDataToCSV(historyData, filename = "relatorio_pingosolar_avancado.csv") {
  const headers = [
    "Data", "Estacao_ID", "Radiacao_Solar_Wm2", "Temp_Agua_Tw_C", "Temp_Vidro_Tg_C",
    "Gradiente_DeltaT_C", "Vazao_Pico_mL_h", "Producao_Real_Litros", "Previsao_PIML_Litros",
    "Erro_Predicao_Pct", "TDS_mg_L", "pH_Calcita", "Eficiencia_Termica_Pct", "Status_Sanitario",
    "Anomalia_Detectada_ML", "Diagnostico_IA", "Sugestao_Solucao_IA"
  ];

  const rows = historyData.map(r => {
    const an = r.anomaly || {};
    return [
      r.date, r.device_id, r.solar_irradiance_w_m2, r.water_temp_c, r.glass_temp_c,
      r.delta_t_c, r.flow_rate_peak_ml_h, r.production_real_liters, r.piml_predicted_liters,
      `${r.prediction_error_pct}%`, r.tds_value_mg_l, r.ph_value, `${r.thermal_efficiency_pct}%`,
      `"${r.sanitary_status}"`,
      `"${an.badge || 'Operação Nominal'}"`,
      `"${an.diagnosis_ml || 'Sem anomalias detectadas.'}"`,
      `"${an.suggested_solution || 'Manter operação padrão.'}"`
    ];
  });

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportMaintenanceToCSV(mntData, filename = "manutencoes_pingosolar.csv") {
  const headers = ["ID", "Estacao", "Data", "Tipo_Intervencao", "Descricao", "Avaliacao_Sanitaria", "Responsavel", "Custo_BRL", "Proxima_Revisao"];
  const rows = mntData.map(m => [
    m.id, m.device_id, m.date, `"${m.type}"`, `"${m.description}"`, `"${m.eval_sanitary}"`, `"${m.operator}"`, `R$ ${m.cost_brl.toFixed(2)}`, m.next_due_date
  ]);

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function fetchKPISummary() {
  try {
    const res = await fetch(`${API_BASE_URL}/kpis/summary`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (err) {
    return {
      active_device: MOCK_DEVICES[0],
      all_devices: MOCK_DEVICES,
      forecast_timeline: [
        { day: "Sex", date: "22/08", liters: 4.1, is_historical: true, weather: "Sol" },
        { day: "Sáb", date: "23/08", liters: 4.3, is_historical: true, weather: "Sol" },
        { day: "Dom", date: "24/08", liters: 4.0, is_historical: true, weather: "Sol/Nuv" },
        { day: "Hoje", date: "25/08", liters: 4.8, is_historical: false, is_today: true, weather: "Sol 34°C", irr: "950 W/m²" },
        { day: "Amanhã", date: "26/08", liters: 5.1, is_historical: false, weather: "Sol 36°C", irr: "980 W/m²" }
      ]
    };
  }
}

export async function fetchActiveAlerts() {
  return [
    {
      id: 101,
      type: "PORTARIA_888_COMPLIANCE",
      severity: "SUCCESS",
      title: "Conformidade Sanitária Aprovada",
      description: "TDS de 140 mg/L e pH 7.2 no leito de calcita (Portaria GM/MS nº 888/2021).",
      action_required: "Nenhuma ação necessária.",
      timestamp: new Date().toISOString()
    }
  ];
}

export async function runDigitalTwinSimulation(params) {
  const irrMult = params.custom_irradiance_mult || 1.0;
  const baseLiters = 4.5 * irrMult;
  return {
    preset_info: { name: params.region_key.toUpperCase() },
    summary_kpis: {
      total_real_liters_day: (baseLiters).toFixed(2),
      total_dunkle_liters_day: (baseLiters * 0.91).toFixed(2),
      total_piml_liters_day: (baseLiters * 0.98).toFixed(2),
      average_efficiency_percent: (34.5 * irrMult).toFixed(1)
    },
    hourly_series: []
  };
}

export async function fetchLCOWReport() {
  return {
    calculated_lcow_per_liter: 0.18,
    water_truck_avg_per_liter: 0.45,
    savings_percent: 60.0
  };
}
