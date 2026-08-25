from typing import Dict, Any, List

class SanitaryService:
    """
    Serviço de Validação de Potabilidade e Segurança Sanitária
    Baseado na Portaria GM/MS nº 888/2021 e nos riscos do destilador solar.
    """
    TDS_VMP_MAX = 1000.0  # Limite máximo permitido pela Portaria 888 (mg/L)
    TDS_RAW_DISTILLED_THRESHOLD = 50.0  # Água pura destilada recém-condensada (< 50 mg/L)
    TDS_REMINERALIZED_OPTIMAL_MIN = 100.0  # Pós-leito de calcita (100 a 300 mg/L)
    TDS_REMINERALIZED_OPTIMAL_MAX = 300.0
    TDS_SPLASH_RISK_THRESHOLD = 150.0  # Subida repentina indica respingo da salmoura

    @classmethod
    def evaluate_water_quality(cls, tds_value_mg_l: float) -> Dict[str, Any]:
        """
        Avalia o status de potabilidade da água condensada/remineralizada.
        """
        if tds_value_mg_l < 30.0:
            return {
                "status": "DESMINERALIZADA",
                "label": "Purificada / Aguardando Remineralização",
                "is_potable": True,
                "badge_color": "#00D2FF",
                "message": "Água destilada isenta de contaminantes. Direcionada para o leito de calcita.",
                "tds_value": tds_value_mg_l
            }
        elif 30.0 <= tds_value_mg_l <= cls.TDS_REMINERALIZED_OPTIMAL_MAX:
            return {
                "status": "POTAVEL",
                "label": f"Potável (TDS: {round(tds_value_mg_l, 1)} mg/L)",
                "is_potable": True,
                "badge_color": "#10B981",
                "message": "Em total conformidade com a Portaria GM/MS nº 888/2021 (pH e minerais equilibrados).",
                "tds_value": tds_value_mg_l
            }
        elif cls.TDS_REMINERALIZED_OPTIMAL_MAX < tds_value_mg_l <= cls.TDS_VMP_MAX:
            return {
                "status": "ATENCAO",
                "label": f"Potável c/ Restrição (TDS: {round(tds_value_mg_l, 1)} mg/L)",
                "is_potable": True,
                "badge_color": "#F59E0B",
                "message": "Dentro do limite normativo (< 1000 mg/L), mas acima da faixa de mineralização ideal.",
                "tds_value": tds_value_mg_l
            }
        else:
            return {
                "status": "NAO_POTAVEL",
                "label": f"Imprópria (TDS: {round(tds_value_mg_l, 1)} mg/L)",
                "is_potable": False,
                "badge_color": "#EF4444",
                "message": "ALERTA: Violação da Portaria 888. Possível contaminação por respingo de salmoura.",
                "tds_value": tds_value_mg_l
            }

    @classmethod
    def check_operational_alerts(
        cls,
        tds_value: float,
        water_temp: float,
        glass_temp: float,
        flow_rate: float,
        irradiance: float
    ) -> List[Dict[str, Any]]:
        """
        Detecta anomalias operacionais e riscos de contaminação.
        """
        alerts = []

        # 1. Risco de Respingo de Salmoura
        if tds_value > cls.TDS_SPLASH_RISK_THRESHOLD and flow_rate > 0:
            alerts.append({
                "type": "RISK_SPLASH",
                "severity": "CRITICAL",
                "title": "Risco de Respingo de Salmoura Detectado",
                "description": f"TDS elevou-se bruscamente para {tds_value:.1f} mg/L na calha de condensado. Fechamento de emergência de válvula e inspeção recomendados.",
                "action_required": "Inspecionar calha antirrespingo e purgar lote contaminado."
            })

        # 2. Anomalia de Produção (Vazamento de vapor ou obstrução)
        if irradiance > 600.0 and (water_temp - glass_temp) > 15.0 and flow_rate < 0.05:
            alerts.append({
                "type": "ANOMALY_LEAK_OR_CLOG",
                "severity": "WARNING",
                "title": "Anomalia Térmica / Produção Baixa",
                "description": "Gradiente térmico elevado sob alta radiação solar sem correspondência na vazão de condensado. Possível escape de vapor nas vedações ou duto obstruído.",
                "action_required": "Verificar vedações de silicone neutro da cobertura de vidro e calhas coletoras."
            })

        # 3. Manutenção da Bacia (Incrustação de Sais)
        if water_temp > 70.0 and (water_temp - glass_temp) < 8.0 and irradiance > 700.0:
            alerts.append({
                "type": "SALT_CRUST_WARNING",
                "severity": "INFO",
                "title": "Alerta de Incrustação de Sais (Bacia)",
                "description": "Redução da eficiência óptica da placa absorvedora. Camada de sal precipitado refletindo a radiação solar.",
                "action_required": "Realizar drenagem da salmoura para o cristalizador ZLD e enxágue rápido com água bruta."
            })

        return alerts
