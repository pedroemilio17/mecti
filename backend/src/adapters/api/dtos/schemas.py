from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class TelemetryInputDTO(BaseModel):
    device_id: str = "PINGOSOLAR-01"
    water_temp_c: float = Field(..., description="Temperatura da água salobra na bacia (°C)")
    glass_temp_c: float = Field(..., description="Temperatura interna da cobertura de vidro (°C)")
    ambient_temp_c: float = Field(28.0, description="Temperatura ambiente (°C)")
    solar_irradiance_w_m2: float = Field(800.0, description="Radiação solar global incidente (W/m²)")
    relative_humidity: float = Field(50.0, description="Umidade relativa do ar (%)")
    tds_value_mg_l: float = Field(140.0, description="Sólidos Totais Dissolvidos no condensado (mg/L)")
    flow_rate_l_h: Optional[float] = Field(0.42, description="Vazão horária instantânea (L/h)")
    accumulated_liters_day: Optional[float] = Field(4.2, description="Volume total diário acumulado (L)")

class TelemetryBatchDTO(BaseModel):
    device_id: str = "PINGOSOLAR-01"
    records: List[TelemetryInputDTO]

class SimulationRequestDTO(BaseModel):
    region_key: str = "semiarido"
    basin_area_m2: float = 1.0
    glass_tilt_deg: float = 18.0
    water_depth_mm: float = 15.0
    custom_irradiance_mult: float = 1.0
    custom_tds: float = 140.0

class AlertResolveDTO(BaseModel):
    alert_id: int
    notes: Optional[str] = None
