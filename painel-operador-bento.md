# ☀️ Plano de Implementação: Painel Operacional em Bento Grid (Cuidador de Campo)

> **Slug:** `painel-operador-bento.md`  
> **Status:** [CONCLUÍDO]  
> **Foco:** Reestruturação da Tela Inicial (`HomeTab.jsx`) e endpoints para máxima densidade de informação prática para o cuidador/operador do dessalinizador.

---

## 🎯 Objetivo
Transformar a interface do aplicativo em uma **central de comando tática e condensada na tela inicial**, permitindo que o operador monitore de relance o nível do reservatório, volume dessalinizado, pH pós-filtro, temperaturas, tempo médio de ciclo, múltiplos dispositivos da área e a previsão cruzada de clima + histórico.

---

## 🧩 Estrutura dos Módulos do Bento Grid Implementado

```
┌────────────────────────────────────────────────────────────────────────┐
│ [ Topo: Seletor Multi-Dispositivos: Toda a Comunidade (3) | Unidade 1, 2, 3 ]
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. RESERVATÓRIO & NÍVEL ATUAL     │ 2. PRODUÇÃO & TEMPO MÉDIO          │
│    18.5 L / 20 L (92% Cheio)      │    4.2 L produzidos hoje           │
│    [ Barra de Nível Animada ]     │    Tempo Médio: ~42 min / 500 mL   │
├───────────────────────────────────┴────────────────────────────────────┤
│ 3. ANÁLISE SANITÁRIA & FÍSICA EM TEMPO REAL (PÓS-CALCITA)              │
│    ● pH: 7.2 (Calcita)   ● TDS: 140 mg/L   ● Tw: 68.5°C   ● Tg: 42.0°C │
│    ● ΔT: 26.5°C          ● Sol: 850 W/m²   ● Status: Potável (Port.888)│
├────────────────────────────────────────────────────────────────────────┤
│ 4. PREDIÇÃO CLIMA + HISTÓRICO RECENTE (5 DIAS)                         │
│    - Histórico (Sex 4.1L | Sáb 4.3L | Dom 4.0L)                        │
│    - Clima Hoje (Sol 34°C, 950 W/m²) → Previsão PIML: 4.8 L            │
│    - Clima Amanhã (Sol 36°C) → Previsão PIML: 5.1 L                   │
├────────────────────────────────────────────────────────────────────────┤
│ 5. BARRA DE AÇÕES RÁPIDAS DO CUIDADOR                                  │
│    [ 💧 Drenar Salmoura ZLD ]  [ 🧹 Registrar Limpeza ]  [ 🧪 Validar Cloro ]
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Tarefas Concluídas

### Fase 1: Atualização dos Modelos e Endpoints do Backend
- [x] **Task 1.1**: Adicionar suporte a múltiplos dispositivos no mock do backend (`/api/v1/devices` e `/api/v1/kpis/summary`).
- [x] **Task 1.2**: Incluir métricas de nível de reservatório (`reservoir_liters`, `reservoir_capacity`), tempo médio de vazão e pH filtrado nos payloads.
- [x] **Task 1.3**: Criar timeline de previsão meteorológica + histórico cruzado de 5 dias (`forecast_timeline`).

### Fase 2: Redesenho do Componente Frontend (`HomeTab.jsx`)
- [x] **Task 2.1**: Implementar o seletor horizontal deslizante de dispositivos com visualização agregada da comunidade vs unidade individual.
- [x] **Task 2.2**: Construir o card de **Nível de Reservatório & Ritmo de Produção** (tanque com nível percentual e indicador de tempo restante para transbordo).
- [x] **Task 2.3**: Construir a grade compacta de **Indicadores Físico-Químicos** (pH 7.2, TDS 140 mg/L, $T_w$, $T_g$, $\Delta T$, Sol W/m² e badge da Portaria 888).
- [x] **Task 2.4**: Construir o card de **Predição Clima + Histórico** (gráfico condensado unindo os 3 últimos dias reais e projeção meteorológica das próximas 48h).
- [x] **Task 2.5**: Adicionar barra de botões de **Ações Rápidas do Cuidador** (drenagem de salmoura, confirmação de teste de cloro e limpeza da bacia com feedback visual).

### Fase 3: Validação e Testes com Operação em Tempo Real
- [x] **Task 3.1**: Testar a alternância entre unidades no seletor e verificar a atualização instantânea de todas as métricas na tela.
- [x] **Task 3.2**: Executar simulação de telemetria contínua com `simulate_esp32_hardware.py` e verificar a atualização suave da tela inicial.
- [x] **Task 3.3**: Executar build de produção do frontend (`npm run build` aprovado com sucesso).
