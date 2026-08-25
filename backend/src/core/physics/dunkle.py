import math
from typing import Dict, Any

class DunkleThermalModel:
    """
    Implementação rigorosa do Modelo de Transferência de Calor e Massa de Dunkle (1961)
    para destiladores solares do tipo bacia simples (single-basin solar still).
    """
    def __init__(self, basin_area_m2: float = 1.0, glass_emissivity: float = 0.9, water_emissivity: float = 0.95):
        self.area = basin_area_m2
        # Emissividade efetiva entre água e cobertura de vidro
        self.effective_emissivity = 1.0 / (1.0 / water_emissivity + 1.0 / glass_emissivity - 1.0)
        self.sigma = 5.67e-8  # Constante de Stefan-Boltzmann [W/(m^2·K^4)]

    @staticmethod
    def saturation_pressure_pa(temp_celsius: float) -> float:
        """
        Calcula a pressão de vapor saturado da água em Pascal (Pa) a partir da temperatura em °C.
        Equação modificada para destiladores solares.
        """
        temp_k = temp_celsius + 273.15
        if temp_k <= 0:
            return 0.0
        # Equação de Antoine / Dunkle formulation
        return math.exp(25.317 - (5144.0 / temp_k))

    @staticmethod
    def latent_heat_of_vaporization(temp_celsius: float) -> float:
        """
        Calor latente de vaporização da água h_fg em Joules por quilograma (J/kg).
        """
        return (2.501e6 - 2370.0 * temp_celsius)

    def calculate_internal_heat_and_mass_transfer(
        self,
        water_temp_c: float,
        glass_temp_c: float,
        solar_irradiance_w_m2: float = 800.0
    ) -> Dict[str, float]:
        """
        Calcula os fluxos de calor por convecção (qc), radiação (qr), evaporação (qevp)
        e a taxa horária de condensação teórica (m_th em kg/h ou L/h).
        """
        # Se a água não estiver mais quente que o vidro, a condensação útil cessa
        delta_t = max(0.0, water_temp_c - glass_temp_c)
        if delta_t <= 0.01:
            return {
                "q_convection_w_m2": 0.0,
                "q_radiation_w_m2": 0.0,
                "q_evaporation_w_m2": 0.0,
                "h_cw": 0.0,
                "hourly_yield_liters": 0.0,
                "hourly_yield_ml": 0.0,
                "thermal_efficiency_percent": 0.0
            }

        p_w = self.saturation_pressure_pa(water_temp_c)
        p_g = self.saturation_pressure_pa(glass_temp_c)
        t_w_k = water_temp_c + 273.15
        t_g_k = glass_temp_c + 273.15

        # Coeficiente convectivo interno h_cw (Dunkle)
        # Termo de empuxo corrigido por diferença de pressão parcial
        denom = 268900.0 - p_w
        if denom <= 0:
            denom = 1.0
        pressure_factor = ((p_w - p_g) / denom) * t_w_k
        driving_force = delta_t + pressure_factor
        driving_force = max(0.0, driving_force)

        h_cw = 0.884 * (driving_force ** (1.0 / 3.0))

        # 1. Calor por convecção q_c [W/m^2]
        q_c = h_cw * delta_t

        # 2. Calor por radiação q_r [W/m^2]
        q_r = self.effective_emissivity * self.sigma * (t_w_k**4 - t_g_k**4)
        q_r = max(0.0, q_r)

        # 3. Calor por evaporação q_evp [W/m^2]
        # q_evp = 0.01627 * h_cw * (P_w - P_g)
        delta_p = max(0.0, p_w - p_g)
        q_evp = 0.01627 * h_cw * delta_p

        # 4. Taxa de condensação de água pura m_th [kg/(m^2·s)] -> [kg/h ou L/h]
        h_fg = self.latent_heat_of_vaporization(water_temp_c)
        m_dot_kg_s = q_evp / h_fg  # kg/(m^2·s)
        hourly_yield_kg = m_dot_kg_s * self.area * 3600.0  # kg/h = L/h
        hourly_yield_ml = hourly_yield_kg * 1000.0

        # 5. Eficiência térmica instantânea (%)
        # eta = (q_evp / I) * 100
        solar_input = max(10.0, solar_irradiance_w_m2)
        efficiency = min(100.0, (q_evp / solar_input) * 100.0)

        return {
            "q_convection_w_m2": round(q_c, 2),
            "q_radiation_w_m2": round(q_r, 2),
            "q_evaporation_w_m2": round(q_evp, 2),
            "h_cw": round(h_cw, 3),
            "hourly_yield_liters": round(hourly_yield_kg, 4),
            "hourly_yield_ml": round(hourly_yield_ml, 2),
            "thermal_efficiency_percent": round(efficiency, 2)
        }
