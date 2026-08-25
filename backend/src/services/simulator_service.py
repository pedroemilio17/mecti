import math
from typing import Dict, Any, List
from services.piml_service import PIMLService
from services.sanitary_service import SanitaryService

class SimulatorService:
    """
    Gêmeo Digital (Digital Twin) e Gerador de Telemetria Sintética.
    Permite simular o comportamento diário completo (06:00 às 18:00) de um destilador solar
    sob diferentes perfis climáticos do Brasil (Semiárido, Tropical, Litoral, etc.).
    """
    REGIONAL_PRESETS = {
        "semiarido": {
            "name": "Semiárido Brasileiro (Juazeiro-BA / Caicó-RN)",
            "peak_irradiance": 950.0,
            "t_ambient_peak": 34.0,
            "humidity": 45.0,
            "wind_speed": 2.5,
            "expected_yield_liters_day": 4.5
        },
        "tropical_seco": {
            "name": "Tropical com Estação Seca (Cuiabá-MT)",
            "peak_irradiance": 880.0,
            "t_ambient_peak": 32.0,
            "humidity": 65.0,
            "wind_speed": 1.8,
            "expected_yield_liters_day": 3.9
        },
        "litoral": {
            "name": "Litoral Úmido (Santos-SP / Salvador-BA)",
            "peak_irradiance": 750.0,
            "t_ambient_peak": 26.0,
            "humidity": 82.0,
            "wind_speed": 3.2,
            "expected_yield_liters_day": 3.1
        },
        "altitude": {
            "name": "Serrana / Alta Altitude (Lages-SC / Garanhuns-PE)",
            "peak_irradiance": 700.0,
            "t_ambient_peak": 19.0,
            "humidity": 85.0,
            "wind_speed": 4.0,
            "expected_yield_liters_day": 2.4
        }
    }

    def __init__(self, piml_service: PIMLService):
        self.piml_service = piml_service

    def simulate_24h_cycle(
        self,
        region_key: str = "semiarido",
        basin_area_m2: float = 1.0,
        glass_tilt_deg: float = 18.0,
        water_depth_mm: float = 15.0,
        custom_irradiance_mult: float = 1.0,
        custom_tds: float = 140.0
    ) -> Dict[str, Any]:
        """
        Simula a produção horária das 06:00 às 18:00 com curvas senoidais de radiação solar
        e defasagem térmica da água (inércia térmica).
        """
        preset = self.REGIONAL_PRESETS.get(region_key, self.REGIONAL_PRESETS["semiarido"])
        peak_irr = preset["peak_irradiance"] * custom_irradiance_mult
        t_amb_max = preset["t_ambient_peak"]
        rh = preset["humidity"]
        wind = preset["wind_speed"]

        hours = []
        series_data = []
        accumulated_real_liters = 0.0
        accumulated_dunkle_liters = 0.0
        accumulated_piml_liters = 0.0

        # Simula de 06:00 até 18:00 (13 pontos horários)
        for h in range(6, 19):
            time_str = f"{h:02d}:00"
            hours.append(time_str)

            # Modelo de radiação solar diária (senoide truncada)
            solar_angle = (h - 6) / 12.0 * math.pi
            irradiance = max(0.0, peak_irr * math.sin(solar_angle))

            # Inércia térmica: temperatura da água atinge pico ~13h30
            thermal_lag_angle = max(0.0, (h - 6.5) / 12.0 * math.pi)
            water_temp = 22.0 + (t_amb_max - 22.0) * 0.4 + (52.0 * (math.sin(thermal_lag_angle) ** 1.4) if irradiance > 10 else 0.0)
            
            # Ajuste de profundidade da lâmina d'água: lâmina mais rasa aquece mais rápido
            depth_factor = 15.0 / max(5.0, water_depth_mm)
            water_temp = min(78.0, water_temp * (0.9 + 0.1 * depth_factor))

            # Temperatura da cobertura de vidro (mais fria que a água devido a perdas externas)
            glass_temp = 20.0 + (water_temp - 20.0) * 0.58 - (wind * 0.5)
            glass_temp = max(18.0, glass_temp)

            ambient_temp = 22.0 + (t_amb_max - 22.0) * math.sin(solar_angle)

            # Cálculo de rendimento com PIML
            piml_res = self.piml_service.predict_yield(
                water_temp_c=water_temp,
                glass_temp_c=glass_temp,
                solar_irradiance_w_m2=irradiance,
                ambient_temp_c=ambient_temp,
                relative_humidity=rh,
                wind_speed_m_s=wind
            )

            dunkle_hourly_ml = piml_res["dunkle_yield_ml"]
            piml_hourly_ml = piml_res["piml_yield_ml"]

            # Produção "Real" medida com pequeno ruído e flutuação de vento
            real_hourly_ml = max(0.0, piml_hourly_ml * (1.0 + 0.04 * math.sin(h * 1.5)))

            accumulated_dunkle_liters += (dunkle_hourly_ml / 1000.0)
            accumulated_piml_liters += (piml_hourly_ml / 1000.0)
            accumulated_real_liters += (real_hourly_ml / 1000.0)

            series_data.append({
                "time": time_str,
                "hour": h,
                "solar_irradiance_w_m2": round(irradiance, 1),
                "water_temp_c": round(water_temp, 1),
                "glass_temp_c": round(glass_temp, 1),
                "delta_t_c": round(max(0.0, water_temp - glass_temp), 1),
                "ambient_temp_c": round(ambient_temp, 1),
                "dunkle_yield_ml": round(dunkle_hourly_ml, 1),
                "piml_yield_ml": round(piml_hourly_ml, 1),
                "real_yield_ml": round(real_hourly_ml, 1),
                "thermal_efficiency_percent": piml_res["thermal_efficiency_percent"]
            })

        # Avaliação de qualidade sanitária
        sanitary_eval = SanitaryService.evaluate_water_quality(custom_tds)
        
        # Alertas operacionais
        latest_point = series_data[len(series_data) // 2]  # ~12:00
        alerts = SanitaryService.check_operational_alerts(
            tds_value=custom_tds,
            water_temp=latest_point["water_temp_c"],
            glass_temp=latest_point["glass_temp_c"],
            flow_rate=latest_point["real_yield_ml"] / 1000.0,
            irradiance=latest_point["solar_irradiance_w_m2"]
        )

        return {
            "preset_info": preset,
            "parameters": {
                "region_key": region_key,
                "basin_area_m2": basin_area_m2,
                "glass_tilt_deg": glass_tilt_deg,
                "water_depth_mm": water_depth_mm,
                "tds_value_mg_l": custom_tds
            },
            "summary_kpis": {
                "total_real_liters_day": round(accumulated_real_liters, 2),
                "total_dunkle_liters_day": round(accumulated_dunkle_liters, 2),
                "total_piml_liters_day": round(accumulated_piml_liters, 2),
                "average_efficiency_percent": round(sum(p["thermal_efficiency_percent"] for p in series_data) / len(series_data), 1),
                "max_delta_t_c": round(max(p["delta_t_c"] for p in series_data), 1),
                "peak_hourly_ml": round(max(p["real_yield_ml"] for p in series_data), 1)
            },
            "sanitary_status": sanitary_eval,
            "active_alerts": alerts,
            "hourly_series": series_data
        }
