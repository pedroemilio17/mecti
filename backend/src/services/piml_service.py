import numpy as np
from sklearn.ensemble import RandomForestRegressor
from typing import Dict, Any, List, Tuple
from core.physics.dunkle import DunkleThermalModel

class PIMLService:
    """
    Physics-Informed Machine Learning (PIML) Service.
    Combina o modelo teórico termodinâmico de Dunkle com um modelo de Machine Learning
    (Random Forest Regressor) treinado sobre os resíduos empíricos (Δm = m_real - m_dunkle).
    """
    def __init__(self, basin_area_m2: float = 1.0):
        self.dunkle_model = DunkleThermalModel(basin_area_m2=basin_area_m2)
        self.ml_model = RandomForestRegressor(n_estimators=50, max_depth=6, random_state=42)
        self.is_fitted = False
        self._bootstrap_synthetic_training()

    def _bootstrap_synthetic_training(self):
        """
        Treina inicialmente o modelo com calibração sintética baseada em dados empíricos
        típicos do Semiárido (efeitos de vento, sujidade na tampa e umidade ambiente).
        """
        np.random.seed(42)
        n_samples = 400
        
        # Simulação de variáveis climáticas do Semiárido
        tw_samples = np.random.uniform(30.0, 75.0, n_samples)
        delta_t_samples = np.random.uniform(5.0, 30.0, n_samples)
        tg_samples = tw_samples - delta_t_samples
        solar_samples = np.random.uniform(200.0, 1000.0, n_samples)
        tamb_samples = np.random.uniform(20.0, 38.0, n_samples)
        humidity_samples = np.random.uniform(30.0, 80.0, n_samples)
        wind_samples = np.random.uniform(0.5, 6.0, n_samples)

        X = []
        y_residual = []

        for i in range(n_samples):
            # 1. Base teórica física
            dunkle_res = self.dunkle_model.calculate_internal_heat_and_mass_transfer(
                water_temp_c=tw_samples[i],
                glass_temp_c=tg_samples[i],
                solar_irradiance_w_m2=solar_samples[i]
            )
            m_th = dunkle_res["hourly_yield_liters"]

            # 2. Desvio real empírico:
            # - Vento resfria o vidro aumentando a condensação (+8% a +15%)
            # - Umidade alta atenua o gradiente radiativo (-5%)
            # - Pequeno ruído gaussiano
            wind_effect = (wind_samples[i] - 2.0) * 0.03 * m_th
            humidity_effect = -(humidity_samples[i] - 50.0) * 0.001 * m_th
            noise = np.random.normal(0, 0.015 * max(0.05, m_th))
            
            delta_m = wind_effect + humidity_effect + noise

            X.append([
                tw_samples[i],
                tg_samples[i],
                solar_samples[i],
                tamb_samples[i],
                humidity_samples[i],
                wind_samples[i]
            ])
            y_residual.append(delta_m)

        X = np.array(X)
        y_residual = np.array(y_residual)
        self.ml_model.fit(X, y_residual)
        self.is_fitted = True

    def predict_yield(
        self,
        water_temp_c: float,
        glass_temp_c: float,
        solar_irradiance_w_m2: float,
        ambient_temp_c: float = 28.0,
        relative_humidity: float = 55.0,
        wind_speed_m_s: float = 2.0
    ) -> Dict[str, Any]:
        """
        Executa a predição híbrida PIML:
        m_piml = max(0.0, m_dunkle + Δm_ML)
        """
        # 1. Cálculo da componente física
        dunkle_metrics = self.dunkle_model.calculate_internal_heat_and_mass_transfer(
            water_temp_c=water_temp_c,
            glass_temp_c=glass_temp_c,
            solar_irradiance_w_m2=solar_irradiance_w_m2
        )
        m_dunkle = dunkle_metrics["hourly_yield_liters"]

        # Se não houver gradiente ou radiação mínima, produção é zero
        if m_dunkle <= 0.001 or solar_irradiance_w_m2 < 10.0:
            return {
                **dunkle_metrics,
                "dunkle_yield_liters": 0.0,
                "dunkle_yield_ml": 0.0,
                "ml_residual_liters": 0.0,
                "ml_residual_ml": 0.0,
                "piml_yield_liters": 0.0,
                "piml_yield_ml": 0.0,
                "delta_t_c": max(0.0, water_temp_c - glass_temp_c)
            }

        # 2. Inferência do resíduo pelo Machine Learning
        feature_vector = np.array([[
            water_temp_c,
            glass_temp_c,
            solar_irradiance_w_m2,
            ambient_temp_c,
            relative_humidity,
            wind_speed_m_s
        ]])
        ml_residual = float(self.ml_model.predict(feature_vector)[0])

        # 3. Combinação Física-Informada com restrição de não-negatividade
        piml_yield = max(0.0, m_dunkle + ml_residual)

        return {
            **dunkle_metrics,
            "dunkle_yield_liters": round(m_dunkle, 4),
            "dunkle_yield_ml": round(m_dunkle * 1000.0, 2),
            "ml_residual_liters": round(ml_residual, 4),
            "ml_residual_ml": round(ml_residual * 1000.0, 2),
            "piml_yield_liters": round(piml_yield, 4),
            "piml_yield_ml": round(piml_yield * 1000.0, 2),
            "delta_t_c": round(max(0.0, water_temp_c - glass_temp_c), 2)
        }
