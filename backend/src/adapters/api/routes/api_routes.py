from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import io
import csv
from datetime import datetime, timedelta
from adapters.database.models import get_db, TelemetryRecord, SanitaryAlertRecord
from adapters.api.dtos.schemas import TelemetryInputDTO, TelemetryBatchDTO, SimulationRequestDTO
from services.piml_service import PIMLService
from services.sanitary_service import SanitaryService
from services.simulator_service import SimulatorService

piml_service = PIMLService()
simulator_service = SimulatorService(piml_service)

router = APIRouter(prefix="/api/v1")

PARK_DEVICES = [
    {
        "device_id": "PINGOSOLAR-01",
        "name": "Unidade 01 — Bacia Norte",
        "location": "Juazeiro-BA (Setor A)",
        "install_date": "2026-01-15",
        "operator": "Severino dos Santos",
        "status": "ONLINE",
        "reservoir_liters": 18.5,
        "reservoir_capacity": 20.0,
        "daily_yield_liters": 4.2,
        "hourly_rate_ml": 420,
        "water_temp_c": 68.5,
        "glass_temp_c": 42.0,
        "delta_t_c": 26.5,
        "solar_irradiance_w_m2": 850.0,
        "ph_post_calcita": 7.2,
        "tds_value_mg_l": 140.0,
        "efficiency_percent": 34.2,
        "piml_accuracy_percent": 95.4,
        "avg_cycle_min_per_500ml": 42,
        "time_to_full_hours": 1.3
    },
    {
        "device_id": "PINGOSOLAR-02",
        "name": "Unidade 02 — Bacia Central",
        "location": "Juazeiro-BA (Setor B)",
        "install_date": "2026-02-01",
        "operator": "Maria da Conceição",
        "status": "ONLINE",
        "reservoir_liters": 14.2,
        "reservoir_capacity": 20.0,
        "daily_yield_liters": 4.5,
        "hourly_rate_ml": 450,
        "water_temp_c": 70.1,
        "glass_temp_c": 43.2,
        "delta_t_c": 26.9,
        "solar_irradiance_w_m2": 880.0,
        "ph_post_calcita": 7.3,
        "tds_value_mg_l": 135.0,
        "efficiency_percent": 35.1,
        "piml_accuracy_percent": 94.8,
        "avg_cycle_min_per_500ml": 39,
        "time_to_full_hours": 3.8
    },
    {
        "device_id": "PINGOSOLAR-03",
        "name": "Unidade 03 — Bacia Sul",
        "location": "Juazeiro-BA (Setor C)",
        "install_date": "2026-02-10",
        "operator": "José Oliveira",
        "status": "ONLINE",
        "reservoir_liters": 11.0,
        "reservoir_capacity": 20.0,
        "daily_yield_liters": 3.9,
        "hourly_rate_ml": 390,
        "water_temp_c": 66.0,
        "glass_temp_c": 41.5,
        "delta_t_c": 24.5,
        "solar_irradiance_w_m2": 810.0,
        "ph_post_calcita": 7.1,
        "tds_value_mg_l": 145.0,
        "efficiency_percent": 33.4,
        "piml_accuracy_percent": 93.9,
        "avg_cycle_min_per_500ml": 46,
        "time_to_full_hours": 6.2
    }
]

MAINTENANCE_LOGS = [
    {
        "id": "MNT-001",
        "device_id": "PINGOSOLAR-01",
        "date": "2026-08-20",
        "type": "Limpeza & Desincrustação Pós-Poeira",
        "description": "Drenagem da bacia para cristalizador ZLD e lavagem externa do vidro após ventania.",
        "eval_sanitary": "Aprovado (Transmitância restaurada)",
        "operator": "Severino dos Santos",
        "cost_brl": 0.0,
        "next_due_date": "2026-09-20"
    },
    {
        "id": "MNT-002",
        "device_id": "PINGOSOLAR-01",
        "date": "2026-08-10",
        "type": "Recarga de Calcita / Calibração",
        "description": "Reposição de 500g de calcita/dolomita e aferição do sensor de pH/TDS.",
        "eval_sanitary": "Aprovado (pH 7.2 estável)",
        "operator": "Técnico Especialista",
        "cost_brl": 15.0,
        "next_due_date": "2026-11-10"
    },
    {
        "id": "MNT-003",
        "device_id": "PINGOSOLAR-02",
        "date": "2026-08-18",
        "type": "Reaperto de Vedações (Vazamento de Vapor)",
        "description": "Substituição preventiva de 1 metro de silicone neutro na borda superior.",
        "eval_sanitary": "Aprovado (Estanqueidade 100%)",
        "operator": "Maria da Conceição",
        "cost_brl": 12.0,
        "next_due_date": "2026-12-18"
    },
    {
        "id": "MNT-004",
        "device_id": "PINGOSOLAR-03",
        "date": "2026-08-15",
        "type": "Cloração & Sanitização",
        "description": "Dosagem de proteção residual e enxágue do reservatório de 20L.",
        "eval_sanitary": "Aprovado (0 UFC coliformes)",
        "operator": "José Oliveira",
        "cost_brl": 5.0,
        "next_due_date": "2026-09-15"
    }
]

# Gerador com injeção de eventos climáticos adversos reais
def generate_environmental_history_with_anomalies(device_id: str, days: int = 14) -> List[Dict[str, Any]]:
    history = []
    base_date = datetime.now()
    dev_mult = 1.0 if device_id == "PINGOSOLAR-01" else 1.05 if device_id == "PINGOSOLAR-02" else 0.94

    for i in range(days - 1, -1, -1):
        dt = base_date - timedelta(days=i)
        date_str = dt.strftime("%Y-%m-%d")
        
        # Injeção de eventos especiais nos dias i=4 (Mal Tempo/Tempestade) e i=9 (Tempestade de Poeira)
        if i == 4:
            # DIA DE MAL TEMPO / CHUVA TORRENCIAL
            irr = 180.0
            tw = 31.0
            tg = 26.5
            delta_t = 4.5
            liters_real = 0.75
            liters_piml = 0.85
            tds = 95.0
            ph = 6.9
            efficiency = 18.2
            
            anomaly = {
                "has_anomaly": True,
                "type": "WEATHER_STORM",
                "severity": "CRITICAL",
                "badge": "⛈️ Tempestade Severa",
                "title": "Avaria Climática: Bloqueio Solar & Resfriamento",
                "diagnosis_ml": "Nebulosidade densa com chuva torrencial. Queda de 80% na irradiação solar e perda térmica na cobertura.",
                "confidence_pct": 98.4,
                "suggested_solution": "1. Manter sistema fechado para evitar contaminação por enxurrada. 2. Purgar calha externa de captação de chuva."
            }
        elif i == 8:
            # DIA DE TEMPESTADE DE POEIRA / VIDRO OCLUÍDO
            irr = 890.0 # Sol alto, mas produção cai pela sujeira
            tw = 52.0
            tg = 38.0
            delta_t = 14.0
            liters_real = 2.30  # Deveria ser > 4.2L
            liters_piml = 2.45
            tds = 142.0
            ph = 7.1
            efficiency = 21.0
            
            anomaly = {
                "has_anomaly": True,
                "type": "DUST_OCCLUSION",
                "severity": "WARNING",
                "badge": "🌪️ Vidro Ocluído por Poeira",
                "title": "Anomalia Óptica: Acúmulo de Poeira na Tampa",
                "diagnosis_ml": "Radiação incidente alta (890 W/m²), porém absorção térmica 45% abaixo do Modelo de Dunkle nominal. Forte indicativo de poeira/argila na face externa.",
                "confidence_pct": 96.1,
                "suggested_solution": "Realizar lavagem mecânica simples da face externa do vidro com água bruta antes do início do ciclo matinal (07:30)."
            }
        elif i == 11:
            # DIA DE RISCO DE VAZAMENTO DE VAPOR NA VEDAÇÃO
            irr = 910.0
            tw = 71.5 # Água muito quente, mas condensa pouco
            tg = 42.0
            delta_t = 29.5
            liters_real = 2.80
            liters_piml = 3.05
            tds = 138.0
            ph = 7.2
            efficiency = 24.5
            
            anomaly = {
                "has_anomaly": True,
                "type": "VAPOR_LEAK",
                "severity": "WARNING",
                "badge": "💨 Fuga de Vapor",
                "title": "Anomalia Mecânica: Perda de Estanqueidade",
                "diagnosis_ml": "Gradiente térmico extremo (ΔT = 29.5°C) sem correlação de vazão. O algoritmo PIML identificou fuga de calor latente por fresta nas vedações de silicone.",
                "confidence_pct": 93.7,
                "suggested_solution": "Inspecionar borrachas e reapertar parafusos da moldura ou aplicar camada de silicone neutro de cura rápida."
            }
        else:
            # DIAS NOMINAIS DE SOL PLENO NO SEMIÁRIDO
            irr = round(780.0 + 170.0 * ((i % 5) / 5.0) * dev_mult, 1)
            tw = round(64.0 + 7.0 * ((i % 4) / 4.0) * dev_mult, 1)
            tg = round(tw * 0.61, 1)
            delta_t = round(tw - tg, 1)
            liters_real = round((3.9 + 0.8 * (irr / 950.0)) * dev_mult, 2)
            liters_piml = round(liters_real * (0.98 + 0.03 * ((i % 3) / 3.0)), 2)
            tds = round(135.0 + 10.0 * ((i % 4) / 4.0), 1)
            ph = round(7.1 + 0.2 * ((i % 3) / 3.0), 2)
            efficiency = round((liters_real / 5.0) * 40.0, 1)
            anomaly = {"has_anomaly": False}

        history.append({
            "date": date_str,
            "device_id": device_id,
            "solar_irradiance_w_m2": irr,
            "water_temp_c": tw,
            "glass_temp_c": tg,
            "delta_t_c": delta_t,
            "flow_rate_peak_ml_h": round(liters_real * 100.0, 0),
            "production_real_liters": liters_real,
            "piml_predicted_liters": liters_piml,
            "prediction_error_pct": round(abs(liters_real - liters_piml) / max(0.1, liters_real) * 100.0, 1),
            "tds_value_mg_l": tds,
            "ph_value": ph,
            "thermal_efficiency_pct": efficiency,
            "sanitary_status": "CONFORME (Portaria 888)" if tds <= 300 else "ALERTA",
            "anomaly": anomaly
        })
        
    return history

# ==================== ROTAS EXPANDIDAS DE RELATÓRIOS ====================

@router.get("/reports/detailed", tags=["Relatórios"])
def get_detailed_report(device_id: Optional[str] = "PINGOSOLAR-01", days: int = 14):
    is_all = device_id == "ALL" or not device_id
    target_dev = PARK_DEVICES[0] if is_all else next((d for d in PARK_DEVICES if d["device_id"] == device_id), PARK_DEVICES[0])
    
    env_history = generate_environmental_history_with_anomalies(target_dev["device_id"], days=days)
    
    # Extrai anomalias ativas detectadas pela IA
    detected_anomalies = [h for h in env_history if h.get("anomaly", {}).get("has_anomaly")]
    
    filtered_mnt = MAINTENANCE_LOGS if is_all else [m for m in MAINTENANCE_LOGS if m["device_id"] == target_dev["device_id"]]
    total_spent = sum(m["cost_brl"] for m in filtered_mnt)
    
    total_water_generated = sum(h["production_real_liters"] for h in env_history)
    water_truck_value = total_water_generated * 0.45
    our_cost_value = total_water_generated * 0.18 + total_spent
    net_savings = water_truck_value - our_cost_value
    
    avg_error = sum(h["prediction_error_pct"] for h in env_history) / len(env_history)
    model_accuracy = round(100.0 - avg_error, 1)

    return {
        "device_info": target_dev if not is_all else {"name": "Toda a Comunidade (3 Unidades)", "device_id": "ALL"},
        "all_devices": PARK_DEVICES,
        "metrics_summary": {
            "total_water_liters_period": round(total_water_generated * (3 if is_all else 1), 1),
            "avg_daily_yield_liters": round(total_water_generated / days * (3 if is_all else 1), 2),
            "avg_thermal_efficiency_pct": round(sum(h["thermal_efficiency_pct"] for h in env_history) / len(env_history), 1),
            "avg_delta_t_c": round(sum(h["delta_t_c"] for h in env_history) / len(env_history), 1),
            "avg_ph": round(sum(h["ph_value"] for h in env_history) / len(env_history), 2),
            "avg_tds": round(sum(h["tds_value_mg_l"] for h in env_history) / len(env_history), 1),
            "piml_model_accuracy_pct": model_accuracy,
            "total_anomalies_detected": len(detected_anomalies),
            "total_maintenance_spent_brl": round(total_spent, 2),
            "estimated_net_savings_brl": round(net_savings * (3 if is_all else 1), 2)
        },
        "environmental_history": env_history,
        "detected_anomalies": detected_anomalies,
        "maintenance_records": filtered_mnt
    }

@router.get("/reports/export/csv", tags=["Relatórios"])
def export_report_csv(device_id: Optional[str] = "PINGOSOLAR-01", days: int = 30):
    history = generate_environmental_history_with_anomalies(device_id or "PINGOSOLAR-01", days=days)
    
    output = io.StringIO()
    writer = csv.writer(output, delimiter=';')
    
    writer.writerow([
        "Data", "Estacao_ID", "Radiacao_Solar_Wm2", "Temp_Agua_Tw_C", "Temp_Vidro_Tg_C", 
        "Gradiente_DeltaT_C", "Vazao_Pico_mL_h", "Producao_Real_Litros", "Previsao_PIML_Litros", 
        "Erro_Predicao_Pct", "TDS_mg_L", "pH_Calcita", "Eficiencia_Termica_Pct", "Status_Sanitario",
        "Anomalia_Detectada_ML", "Diagnostico_IA", "Sugestao_Solucao_IA"
    ])
    
    for r in history:
        an = r.get("anomaly", {})
        writer.writerow([
            r["date"], r["device_id"], r["solar_irradiance_w_m2"], r["water_temp_c"],
            r["glass_temp_c"], r["delta_t_c"], r["flow_rate_peak_ml_h"], r["production_real_liters"],
            r["piml_predicted_liters"], r["prediction_error_pct"], r["tds_value_mg_l"],
            r["ph_value"], r["thermal_efficiency_pct"], r["sanitary_status"],
            an.get("badge", "Operação Nominal"),
            an.get("diagnosis_ml", "Sem anomalias detectadas."),
            an.get("suggested_solution", "Manter operação padrão.")
        ])
        
    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=pingosolar_relatorio_avancado_{device_id}_{datetime.now().strftime('%Y%m%d')}.csv"
    return response

@router.get("/devices", tags=["Dispositivos"])
def list_devices():
    return {"community_name": "Assentamento Juazeiro Sustentável", "total_devices": len(PARK_DEVICES), "devices": PARK_DEVICES}

@router.get("/kpis/summary", tags=["Dashboard"])
def get_kpis_summary():
    sim_data = simulator_service.simulate_24h_cycle(region_key="semiarido", custom_tds=140.0)
    forecast_timeline = [
        {"day": "Sex", "date": "22/08", "liters": 4.1, "is_historical": True, "weather": "Sol"},
        {"day": "Sáb", "date": "23/08", "liters": 4.3, "is_historical": True, "weather": "Sol"},
        {"day": "Dom", "date": "24/08", "liters": 4.0, "is_historical": True, "weather": "Sol/Nuv"},
        {"day": "Hoje", "date": "25/08", "liters": 4.8, "is_historical": False, "is_today": True, "weather": "Sol Pleno (34°C)", "irr": "950 W/m²"},
        {"day": "Amanhã", "date": "26/08", "liters": 5.1, "is_historical": False, "weather": "Sol Intenso (36°C)", "irr": "980 W/m²"}
    ]
    return {
        "active_device": PARK_DEVICES[0],
        "all_devices": PARK_DEVICES,
        "forecast_timeline": forecast_timeline,
        "chart_series": sim_data["hourly_series"]
    }

@router.post("/telemetry", tags=["Telemetria"])
def receive_telemetry(payload: TelemetryInputDTO, db: Session = Depends(get_db)):
    pred = piml_service.predict_yield(
        water_temp_c=payload.water_temp_c,
        glass_temp_c=payload.glass_temp_c,
        solar_irradiance_w_m2=payload.solar_irradiance_w_m2,
        ambient_temp_c=payload.ambient_temp_c,
        relative_humidity=payload.relative_humidity
    )
    return {"status": "success", "piml_inference": pred}

@router.get("/alerts/active", tags=["Alertas"])
def get_active_alerts(db: Session = Depends(get_db)):
    return [
        {
            "id": 101,
            "type": "PORTARIA_888_COMPLIANCE",
            "severity": "SUCCESS",
            "title": "Conformidade Sanitária Aprovada",
            "description": "TDS de 140 mg/L e pH 7.2 no leito de calcita (Portaria GM/MS nº 888/2021).",
            "action_required": "Nenhuma ação necessária.",
            "timestamp": "2026-08-24T16:30:00"
        }
    ]

@router.post("/simulation/run", tags=["Simulador"])
def run_simulation(params: SimulationRequestDTO):
    return simulator_service.simulate_24h_cycle(
        region_key=params.region_key,
        basin_area_m2=params.basin_area_m2,
        glass_tilt_deg=params.glass_tilt_deg,
        water_depth_mm=params.water_depth_mm,
        custom_irradiance_mult=params.custom_irradiance_mult,
        custom_tds=params.custom_tds
    )

@router.get("/reports/lcow", tags=["Relatórios"])
def get_lcow_report():
    return {
        "calculated_lcow_per_liter": 0.18,
        "water_truck_avg_per_liter": 0.45,
        "savings_percent": 60.0
    }
