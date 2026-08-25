import time
import math
import httpx

API_ENDPOINT = "http://localhost:8000/api/v1/telemetry"
DEVICE_ID = "PINGOSOLAR-01"

def simulate_sensor_loop():
    print(f"☀️ Iniciando simulação de transmissão IoT (ESP32) para {DEVICE_ID}...")
    print(f"📡 Enviando telemetria a cada 5 segundos para {API_ENDPOINT}...\n")
    
    t = 0
    while True:
        # Simula variação horária da radiação solar (0 a 1000 W/m²)
        solar_angle = (t % 120) / 120.0 * math.pi
        irradiance = max(0.0, 950.0 * math.sin(solar_angle))
        
        tw = 25.0 + (50.0 * (math.sin(solar_angle) ** 1.3) if irradiance > 10 else 0.0)
        tg = 22.0 + (tw - 22.0) * 0.55
        flow = max(0.0, (tw - tg) * 0.02 * (irradiance / 950.0))
        
        payload = {
            "device_id": DEVICE_ID,
            "water_temp_c": round(tw, 1),
            "glass_temp_c": round(tg, 1),
            "ambient_temp_c": 31.0,
            "solar_irradiance_w_m2": round(irradiance, 1),
            "relative_humidity": 48.0,
            "tds_value_mg_l": 140.0,
            "flow_rate_l_h": round(flow, 3),
            "accumulated_liters_day": 4.2
        }

        try:
            with httpx.Client() as client:
                res = client.post(API_ENDPOINT, json=payload, timeout=3.0)
                if res.status_code == 200:
                    data = res.json()
                    piml = data.get("piml_inference", {})
                    print(f"✅ [ESP32 -> API] Tw: {tw:.1f}°C | Tg: {tg:.1f}°C | I: {irradiance:.0f} W/m² | PIML Previsto: {piml.get('piml_yield_ml', 0):.1f} mL/h")
                else:
                    print(f"⚠️ Erro HTTP {res.status_code}")
        except Exception as e:
            print(f"❌ Falha de conexão: {e}")

        t += 1
        time.sleep(5)

if __name__ == "__main__":
    simulate_sensor_loop()
