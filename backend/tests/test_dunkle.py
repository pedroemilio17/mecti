import pytest
import sys
import os

# Adiciona o diretório backend/src ao path de teste
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from core.physics.dunkle import DunkleThermalModel
from services.piml_service import PIMLService
from services.sanitary_service import SanitaryService
from services.simulator_service import SimulatorService

def test_dunkle_saturation_pressure():
    """Valida se a pressão de vapor saturado cresce exponencialmente com a temperatura."""
    p_30 = DunkleThermalModel.saturation_pressure_pa(30.0)
    p_60 = DunkleThermalModel.saturation_pressure_pa(60.0)
    assert p_60 > p_30 > 1000.0  # Em 60°C a pressão de vapor é expressivamente maior que em 30°C

def test_dunkle_zero_gradient():
    """Valida se a produção é nula quando não há gradiente térmico (Tw <= Tg)."""
    model = DunkleThermalModel(basin_area_m2=1.0)
    res = model.calculate_internal_heat_and_mass_transfer(water_temp_c=40.0, glass_temp_c=40.0, solar_irradiance_w_m2=800.0)
    assert res["hourly_yield_liters"] == 0.0
    assert res["q_evaporation_w_m2"] == 0.0

def test_dunkle_nominal_production():
    """Valida a produção sob condições nominais de sol pleno no Semiárido (Tw=68°C, Tg=42°C, I=850 W/m²)."""
    model = DunkleThermalModel(basin_area_m2=1.0)
    res = model.calculate_internal_heat_and_mass_transfer(water_temp_c=68.0, glass_temp_c=42.0, solar_irradiance_w_m2=850.0)
    assert res["hourly_yield_ml"] > 250.0  # Produção horária expressiva em pico solar
    assert res["thermal_efficiency_percent"] > 20.0

def test_piml_inference():
    """Valida se o serviço de Physics-Informed ML prevê valores consistentes e não negativos."""
    piml = PIMLService(basin_area_m2=1.0)
    pred = piml.predict_yield(
        water_temp_c=65.0,
        glass_temp_c=40.0,
        solar_irradiance_w_m2=800.0,
        ambient_temp_c=30.0,
        relative_humidity=50.0,
        wind_speed_m_s=2.5
    )
    assert pred["piml_yield_ml"] > 0.0
    assert "dunkle_yield_ml" in pred
    assert "ml_residual_ml" in pred

def test_sanitary_potability_portaria_888():
    """Valida o enquadramento de potabilidade e alerta da Portaria GM/MS nº 888/2021."""
    # 1. Água destilada recém-produzida
    eval_distilled = SanitaryService.evaluate_water_quality(15.0)
    assert eval_distilled["status"] == "DESMINERALIZADA"
    
    # 2. Água potável após remineralização em leito de calcita (140 mg/L)
    eval_potable = SanitaryService.evaluate_water_quality(140.0)
    assert eval_potable["status"] == "POTAVEL"
    assert eval_potable["is_potable"] == True
    
    # 3. Contaminação por respingos de salmoura (TDS > 1000 mg/L)
    eval_polluted = SanitaryService.evaluate_water_quality(1200.0)
    assert eval_polluted["status"] == "NAO_POTAVEL"
    assert eval_polluted["is_potable"] == False

def test_simulator_24h_cycle():
    """Valida a simulação do Gêmeo Digital para o Semiárido."""
    piml = PIMLService(basin_area_m2=1.0)
    sim = SimulatorService(piml)
    res = sim.simulate_24h_cycle(region_key="semiarido", custom_tds=140.0)
    
    assert len(res["hourly_series"]) == 13
    assert res["summary_kpis"]["total_real_liters_day"] > 3.0
    assert res["sanitary_status"]["is_potable"] == True
