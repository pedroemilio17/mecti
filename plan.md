# ☀️ PingoSolar — Plano Detalhado de Engenharia e Software

> **Sistema Inteligente de Dessalinização Solar Modular com Monitoramento IoT e Adaptação Microclimática via Physics-Informed Machine Learning (PIML)**

---

## 📑 Sumário Executivo

O **PingoSolar** é um sistema cibernético-físico projetado para enfrentar a escassez hídrica e a salinidade das águas subterrâneas no Semiárido brasileiro. Ele combina:
1. **Destilação Solar Passiva/Semi-Ativa**: Princípios de evaporação e condensação natural otimizados termicamente.
2. **Pós-Tratamento Mineral Obrigatório**: Enquadramento à **Portaria GM/MS nº 888/2021** através de leito de calcita/dolomita e cloração residual.
3. **Gestão Sustentável de Efluentes**: Descarga Líquida Zero (*Zero Liquid Discharge* - ZLD) por cristalização solar do sal.
4. **Sensoriamento IoT de Baixo Custo (ESP32)**: Aquisição contínua em arquitetura *offline-first* com buffer local.
5. **Physics-Informed Machine Learning (PIML)**: Modelo preditivo híbrido combinando a equação física de Dunkle com regressão de resíduos (Scikit-Learn).
6. **Interface Mobile-First / Bento Grid Operacional**: Dashboard de alta densidade voltado aos cuidadores de campo, com gestão multi-unidades, nível de reservatório em litros, pH pós-filtro e predição meteorológica.
7. **Módulo Avançado de Relatórios, Diagnóstico de Anomalias & Exportação CSV**: Identificação instintiva de **mal tempo, tempestades e avarias mecânicas** através do desvio entre Dunkle e medições reais, com diagnóstico de causa-raiz e sugestão de soluções pelo Machine Learning.

---

## 🧠 1. Motor de Diagnóstico Inteligente de Anomalias Climáticas & Físicas (ML)

O algoritmo de **Physics-Informed Machine Learning (PIML)** compara a curva física ideal de Dunkle com os dados coletados pelos sensores e classifica automaticamente as seguintes avarias:

| Padrão Detectado pelos Sensores | Diagnóstico da IA / Causa-Raiz | Ação Corretiva Sugerida pelo Sistema |
| :--- | :--- | :--- |
| **Queda de 80% na Radiação + $T_w$ caindo para 31°C** | ⛈️ **Tempestade Severa / Mal Tempo**: Nebulosidade densa com chuva torrencial e resfriamento periférico do vidro. | Manter sistema fechado para evitar contaminação por enxurrada. Purgar calha externa de captação de chuva. |
| **Radiação alta (890 W/m²), mas $T_w$ 45% abaixo do Dunkle** | 🌪️ **Vidro Ocluído por Poeira**: Acúmulo de partículas e argila reduzindo a transmitância óptica da cobertura. | Realizar lavagem mecânica simples da face externa do vidro com água bruta antes das 07:30. |
| **$T_w$ extrema (>70°C), $\Delta T > 29°C$ sem vazão proporcional** | 💨 **Fuga de Vapor / Micro-fissura**: Perda de calor latente por escape de vapor nas vedações de borracha/silicone. | Inspecionar juntas, reapertar parafusos da moldura ou aplicar camada de silicone neutro de cura rápida. |
| **TDS subindo subitamente para >600 mg/L** | 🌊 **Respingo de Salmoura**: Lâmina d'água excessiva ou agitação na bacia atingindo a calha coletora. | Drenar 30% da salmoura para o cristalizador ZLD e purgar os últimos 500 mL do lote. |

---

## 📊 2. Estrutura do Módulo de Relatórios (`ReportsTab.jsx`)

- **Seletor de Estações do Parque**: `[ Todas as Unidades ]`, `[ Unidade 01 — Bacia Norte ]`, `[ Unidade 02 ]` e `[ Unidade 03 ]`.
- **Filtros Temporais**: `[ 7 dias ]`, `[ 14 dias ]`, `[ 30 dias ]`.
- **Exportação de Dados**:
  - `[ 📥 CSV Telemetria + IA ]`: Variáveis ambientais, produção real, previsão PIML, erro %, diagnóstico de anomalia e soluções sugeridas.
  - `[ 📋 Manutenções ]`: Histórico de intervenções e despesas operacionais.
- **5 Sub-Abas de Análise no Aplicativo**:
  1. **📊 Visão Geral & IA**: KPIs consolidados, acurácia PIML (94.8%) e gráfico com alertas pulsantes de mal tempo.
  2. **🧠 Diagnóstico IA**: Cards detalhados de cada evento climático adverso com diagnóstico do modelo, nível de confiança e solução passo a passo.
  3. **🌡️ Clima & Ambiente**: Tabela de telemetria com badges de anomalias dia a dia.
  4. **🔧 Diário de Bordo**: Lista de intervenções técnicas, avaliações sanitárias e próximas revisões.
  5. **💰 Gastos & Economia LCOW**: Economia líquida frente ao caminhão-pipa.

---

## 🚀 3. Status de Conclusão do Roadmap

- [x] **Fase 1: Backend & Modelagem Física**: Equações de Dunkle, PIML Scikit-Learn e SQLite.
- [x] **Fase 2: Endpoints REST**: Rotas de telemetria, KPIs, simulação e relatórios avançados com diagnóstico de anomalias.
- [x] **Fase 3: Frontend React 19**: Design Dark Cyber-Solar, Bento Grid na Home, Módulo de Relatórios e Diagnóstico ML.
- [x] **Fase 4: Validação & Build**: 6/6 testes unitários no backend e `npm run build` aprovado com 0 erros.
