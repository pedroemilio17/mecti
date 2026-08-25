Dossiê Intelectual de Pesquisa: Sistema Inteligente de Dessalinização Solar Modular, Monitoramento IoT e Adaptação Microclimática
Resumo Executivo
A escassez hídrica global e regional representa um desafio multidimensional que afeta a saúde pública, o desenvolvimento econômico e a estabilidade social. No Brasil, a região do Semiárido destaca-se pela acentuada vulnerabilidade hídrica, caracterizada pela irregularidade pluviométrica e pela presença generalizada de águas subterrâneas salobras e salinas retidas no embasamento cristalino1. Para mitigar essa vulnerabilidade, intervenções públicas como o Programa Água Doce implantaram mais de mil sistemas de dessalinização baseados majoritariamente em osmose reversa2. Contudo, a dependência de infraestrutura elétrica contínua, o custo de substituição de membranas e a necessidade de manutenção especializada limitam a autonomia de comunidades isoladas e de pequena escala3.
Este estudo investiga a viabilidade técnica, científica e econômica de um sistema inteligente de dessalinização solar passiva e semi-ativa, otimizado por sensoriamento em tempo real, modelagem matemática híbrida e algoritmos de Aprendizado de Máquina (Machine Learning). A solução proposta fundamenta-se nos princípios físicos da destilação solar por evaporação e condensação, integrando melhorias construtivas para a maximização da eficiência térmica e do fluxo de massa. A inovação central do projeto não reside na invenção do princípio de destilação, mas na aplicação integrada de uma arquitetura IoT de baixo custo e no desenvolvimento de um pipeline de análise preditiva. Esse pipeline é capaz de estimar a produção de água destilada, identificar anomalias operacionais e adaptar o funcionamento do sistema a diferentes condições ecoclimáticas.
A análise da qualidade da água produzida demonstra que, embora a destilação elimine sais dissolvidos e microrganismos patogênicos, a água resultante não é automaticamente potável segundo a Portaria GM/MS nº 888/20214. A ausência de minerais essenciais e o pH ácido resultante da absorção de dióxido de carbono atmosférico exigem etapas subsequentes de remineralização e ajuste físico-químico antes do consumo humano5. Ademais, o descarte do efluente concentrado (salmoura) constitui um gargalo ambiental crítico que demanda estratégias de cristalização por secagem solar para evitar a degradação do solo6.
A avaliação do Custo Nivelado da Água (Levelized Cost of Water - LCOW) demonstra que, embora a destilação solar apresente uma taxa de produção diária por metro quadrado inferior à de sistemas industriais, seu custo operacional reduzido e sua modularidade garantem viabilidade econômica para o suprimento descentralizado de água em áreas remotas7. Este dossiê consolida a base teórica, as equações governantes, o protocolo experimental, a matriz de riscos e a arquitetura de software necessárias para fundamentar a defesa técnica do projeto.
Definição do Problema e Contexto Hídrico
A escassez hídrica manifesta-se em três dimensões distintas no cenário socioeconômico: a escassez física, caracterizada pela ausência de recursos hídricos renováveis em volume suficiente para atender às demandas humanas e ecossistêmicas; a escassez econômica, associada à falta de capital, infraestrutura ou capacidade institucional para captar, tratar e distribuir a água disponível; e as barreiras de acesso, nas quais populações vulneráveis são privadas de água potável devido à contaminação local ou a distâncias logísticas inviáveis.
No contexto brasileiro, a vulnerabilidade hídrica atinge sua expressão mais crítica no Semiárido, região que abrange uma área superior a 1 milhão de km² espalhada por dez estados. A estrutura geológica local é predominantemente composta por rochas do embasamento cristalino, cujas fraturas armazenam águas subterrâneas com elevados teores de sais dissolvidos. Dados da Agência Nacional de Águas e Saneamento Básico (ANA) e do Ministério da Integração e do Desenvolvimento Regional (MIDR) indicam que mais de 80% dos poços profundos perfurados no Semiárido, a exemplo do estado do Ceará, apresentam águas salobras ou salinas, inadequadas para consumo direto sem tratamento prévio1.
FATO: O Programa Água Doce (PAD), coordenado pelo Governo Federal, implantou 1.068 sistemas de dessalinização em 298 municípios do Semiárido brasileiro, produzindo diariamente cerca de 4,2 milhões de litros de água dessalinizada para aproximadamente 264 mil pessoas2.
EVIDÊNCIA: A priorização de atendimento pelo Programa Água Doce utiliza o Índice de Condição de Acesso à Água (ICAA), um indicador ponderado que combina o IDH-M (peso 1), a pluviometria, a taxa de mortalidade infantil, a intensidade da pobreza e a ocorrência de águas subterrâneas salobras ou salinas (pesos 2)3. Esse critério demonstra a correlação direta entre a vulnerabilidade social e a indisponibilidade de água potável no subsolo do Semiárido.
O suprimento emergencial via caminhões-pipa apresenta limitações estruturais graves: possui elevado custo por litro transportado, pegada de carbono significativa, vulnerabilidade a interrupções operacionais e risco constante de recontaminação microbiológica durante o armazenamento em reservatórios comunitários precários1. A dessalinização local surge, portanto, como uma solução estrutural para converter poços salobros subutilizados em fontes permanentes de segurança hídrica.
Estado da Arte e Mapeamento Tecnológico
A seleção da tecnologia de dessalinização para comunidades isoladas exige a avaliação comparativa entre processos térmicos e processos por membranas. A tabela abaixo sintetiza as principais tecnologias disponíveis no mercado e na literatura científica.

Tecnologia
Princípio Físico
Fonte de Energia
Custo CAPEX / OPEX
Produtividade Típica
Adequação a Comunidades Isoladas
Principais Limitações
Destilação Solar Passiva
Evaporação e condensação natural
Radiação solar direta
Baixo / Muito Baixo
2,5 a 5,0 L/m²/dia
Altíssima
Baixa taxa de produção por área útil; dependência de condições climáticas.
Humidificação-Desumidificação (HDH)
Mudança de fase com circulação forçada de ar
Solar térmica e elétrica
Médio / Médio
10 a 25 L/m²/dia
Média
Exige ventiladores e bombas de circulação; maior complexidade mecânica.
Osmose Reversa (RO)
Separação por membrana via alta pressão hidráulica
Energia elétrica (Rede/PV)
Alto / Elevado
Varia conforme dimensionamento
Média a Baixa
Requer pré-tratamento rigoroso, substituição periódica de membranas e energia contínua3.
Eletrodiálise (ED)
Migração iônica por campo elétrico
Energia elétrica
Elevado / Médio
Alta para água salobra
Baixa
Ineficiente para águas de alta salinidade; requer operação técnica especializada.
Nanofiltração (NF)
Separação por tamanho de poro e carga iônica
Pressão hidráulica
Médio-Alto / Médio
Média-Alta
Baixa a Média
Remoção parcial de íons monovalentes (, ); suscetível ao incrustamento de membranas.

INFERÊNCIA: Para agrupamentos populacionais difusos e desprovidos de rede elétrica estável ou suporte técnico contínuo, a destilação solar passiva e semi-ativa apresenta o melhor compromisso entre simplicidade operacional, custo de manutenção e autonomia energética, a despeito de sua menor produtividade por metro quadrado.
Fundamentos Físicos e Termodinâmicos da Destilação Solar
O funcionamento de um destilador solar do tipo caixa (single-basin solar still) baseia-se nos processos simultâneos de transferência de calor e de massa. A radiação solar atravessa a cobertura transparente e é absorvida pelo fundo escurecido da bacia e pela lâmina d'água salobra. A energia absorvida eleva a temperatura da água, aumentando sua pressão de vapor de saturação.
A transferência de calor da massa d'água para a cobertura transparente ocorre por três mecanismos concorrentes:
Convecção (): Ocorre devido à diferença de temperatura entre a superfície da água () e a superfície interna da cobertura de vidro ().
Evaporação (): Ocorre em virtude do gradiente de pressão de vapor entre a água líquida e o ar umedecido adjacente à cobertura. O vapor ascende, entra em contato com a superfície do vidro mantida em menor temperatura, cede calor latente de vaporização () e condensa-se.
Radiação (): Transferência radiativa direta de calor entre a superfície da água e a cobertura.
O balanço energético em regime transiente para a massa d'água no reservatório é modelado pela seguinte equação de conservação de energia:

Onde:
 é a irradiação solar global incidente ().
 é a absorvidade efetiva do conjunto água e fundo do recipiente.
 é a área da superfície de evaporação ().
 é a massa de água no reservatório ().
 é o calor específico da água ().
 representa as perdas térmicas por condução através da base e das paredes do recipiente ().
A taxa de transferência de calor por evaporação () rege a quantidade de água purificada produzida, sendo expressa por:

O coeficiente de transferência de calor por evaporação () é determinado pela relação de Dunkle9:

Em que o coeficiente convectivo () é calculado a partir das equações de Sharpley-Boelter e Jakob9:

As pressões de vapor saturado da água na lâmina líquida () e na superfície do vidro () em Pascal () são expressas em função das respectivas temperaturas em :

A massa instantânea de condensado recolhida () em  é obtida por:

O calor latente de vaporização da água () ajusta-se à temperatura segundo a relação:

A eficiência térmica diária () do dessalinizador expressa a razão entre a energia consumida na mudança de fase do volume total produzido e a energia solar acumulada na superfície do coletor:

LIMITAÇÃO DO MODELO: O Modelo de Dunkle assume cavidades horizontais e regime de convecção natural laminar9. Em geometrias com inclinação superior a  ou na presença de convecção forçada interna, as equações subestimam a taxa de evaporação real em um intervalo entre  e .
Engenharia, Materiais e Otimização do Protótipo
O desempenho produtivo de um dessalinizador solar passivo depende da seleção dos materiais e das escolhas geométricas do projeto. O objetivo da engenharia do protótipo é maximizar a absorção radiativa, isolar as perdas térmicas periféricas e otimizar a taxa de condensação na superfície interna da cobertura.
Seleção de Materiais
A escolha dos componentes deve equilibrar durabilidade, condutividade térmica, atoxidade e viabilidade econômica:
Cobertura Transparente: O vidro temperado de alta transparência com baixo teor de ferro () apresenta transmitância solar superior a , elevada durabilidade contra degradação por radiação ultravioleta e excelente molhabilidade (baixo ângulo de contato com a água). Essa característica favorece a condensação em filme contínuo em vez da formação de gotas. O acrílico e o policarbonato apresentam custo reduzido e maior resistência a impactos, porém sofrem amarelamento por UV ao longo do tempo e promovem condensação em gotas (dropwise), o que causa a dispersão da radiação solar incidente.
Absorvedor Térmico (Bacia): O uso de chapa de alumínio ou aço inoxidável revestido com tinta preta fosca de alta absorvidade () garante rápida transferência de calor para a água. Plásticos de alta densidade (como PEAD) podem ser empregados pelo custo menor e imunidade à corrosão salina, embora possuam baixa condutividade térmica.
Isolamento Térmico: Para restringir as perdas por condução na base e nas paredes laterais, são aplicados materiais como poliuretano expandido (), lã de vidro ou poliestireno expandido (EPS), mantendo o coeficiente de perda global abaixo de .
Vedações: O isolamento da câmara de evaporação exige o uso de silicone de cura neutra para altas temperaturas (), imune à salinidade, prevenindo vazamentos de vapor e a entrada de ar parasita.
Geometria e Variáveis Operacionais
Inclinação da Cobertura: A inclinação da cobertura transparente deve ser ajustada em função da latitude local (), somando-se  para otimizar a captação solar anual. Para a faixa latitudinal do Semiárido brasileiro (), inclinações entre  garantem captação radiativa adequada e asseguram o escoamento gravítico do filme condensado até as calhas de coleta sem o gotejamento de retorno sobre a salmoura.
Profundidade da Lâmina d'Água: A massa de água na bacia altera a resposta dinâmica do sistema. Lâminas rasas () possuem menor inércia térmica, atingindo altas temperaturas rapidamente no período da manhã e antecipando o início da produção. Lâminas mais profundas () armazenam calor, estendendo a condensação durante o período noturno, porém reduzindo a temperatura de pico durante o dia.
Resfriamento da Cobertura Transparente: O aumento do gradiente de temperatura  eleva a taxa de evaporação. O resfriamento da superfície externa do vidro por meio de um filme intermitente de água bruta não tratada pode aumentar a produção em até , constituindo uma hipótese técnica a ser validada experimentalmente.
Variáveis Climáticas e Matriz Regional
A taxa de condensação obtida por um destilador solar é regida pelas variáveis meteorológicas locais. A integração dos dados climáticos oficiais do Instituto Nacional de Pesquisas Espaciais (INPE) e do Atlas Brasileiro de Energia Solar permite fundamentar as estimativas de desempenho regional do sistema10.
FATO: O Semiárido brasileiro apresenta os maiores índices de irradiação solar global do território nacional, com médias diárias entre , caracterizando-se também por baixas taxas de nebulosidade e elevadas temperaturas ambientes10.
A tabela a seguir apresenta a matriz comparativa de produtividade estimada com base nos dados climáticos regionais consolidados.

Região / Cidade
Tipo Climático
Irradiação Solar Global Média (kWh/m²/dia)
Temp. Média Ambiente (ºC)
Umidade Relativa Média (%)
Produtividade Estimada (L/m²/dia)
Semiárido (ex: Juazeiro-BA / Caicó-RN)
BSh (Semiárido quente)
5,8 - 6,5
27 - 30
45 - 60
4,2 - 5,5
Cuiabá - MT
Aw (Tropical com estação seca)
5,0 - 5,8
26 - 29
60 - 80
3,8 - 4,8
Litoral Sudeste (ex: Santos-SP)
Cfa / Am (Húmido)
4,2 - 5,0
21 - 24
75 - 88
2,8 - 3,8
Serrana / Alta Altitude (ex: Lages-SC)
Cfb (Temperado)
3,8 - 4,6
14 - 18
80 - 90
2,0 - 3,0

INFERÊNCIA: A produtividade do destilador solar sofre redução em regiões de umidade relativa elevada e menores temperaturas médias, devido à diminuição da irradiação solar disponível e à redução das perdas radiativas da cobertura para o céu, o que atenua o gradiente térmico de condensação.
Arquitetura de Sensoriamento, IoT e Aquisição de Dados
A instrumentação do protótipo baseia-se em um conjunto mínimo viável de sensores (Minimum Viable Sensor Suite) integrado a uma unidade microprocessada de baixo consumo energético.
Matriz do Conjunto Mínimo Viável de Sensoriamento
Parâmetro Medido
Sensor Indicado
Unidade
Frequência de Coleta
Precisão Requerida
Custo Estimado (USD)
Temperatura da Água ()
DS18B20 (Inox à prova d'água)

1 min

$2 - $4
Temperatura da Cobertura ()
Termopar Tipo K / NTC 10k

1 min

$2 - $5
Temperatura Ambiente ()
DHT22 / BME280

5 min

$4 - $8
Umidade Relativa Ambiente ()
DHT22 / BME280

5 min

Incluído acima
Irradiação Solar ()
Piranômetro Pyran-01 / BH1750 calibrado

1 min

$5 - $35
Volume Produzido ()
Sensor de Fluxo Efeito Hall / Célula de Carga

Contínuo / 5 min

$6 - $15
Condutividade / TDS
Sensor TDS Analógico de Eletrodo

15 min

$10 - $20

Arquitetura de Comunicação e Fluxo de Dados
A aquisição de dados utiliza o microcontrolador ESP32 devido ao seu processador dual-core de , conectividade Wi-Fi e Bluetooth integradas, conversores analógico-digitais (ADC) e suporte a modos de economia de energia (Deep Sleep).
O fluxo físico de transferência de dados organiza-se através do sequenciamento em camadas funcionais:
Camada de Sensoriamento: Os sensores realizam as medições físico-químicas e meteorológicas na estrutura do destilador.
Camada de Processamento Local: O microcontrolador ESP32 executa a filtragem analógica de ruídos, a conversão de sinais, a calibração via software e a formatação das tabelas de dados em formato JSON.
Camada de Transmissão:
Ambiente Urbano ou Laboratorial: Envio direto via protocolo MQTT ou HTTPS sobre conexões Wi-Fi.
Ambiente Rural Isolado: Transmissão via rádio LoRa (Long Range) em topologia Ponto-a-Ponto ou via rede LoRaWAN para um gateway centralizado, cobrindo distâncias de  sem dependência de rede celular.
Camada de Ingestão e API Backend: Um servidor centralizado (desenvolvido em Node.js ou FastAPI) recebe os dados, executa a autenticação dos nós via chave API e valida a integridade das medições.
Camada de Armazenamento: Registro em banco de dados otimizado para séries temporais (TimescaleDB ou InfluxDB).
PROPOSTA: Implementar um sistema de buffer temporário na memória Flash SPIFFS/LittleFS do microcontrolador ou em cartão MicroSD local para prevenir a perda de dados durante interrupções de conectividade em zonas rurais.

Arquitetura de Software e Interface do Aplicativo
O software do sistema é concebido para ser executado em dispositivos móveis e navegadores web, fornecendo uma interface para monitoramento operacional, controle de manutenção e análise científica.
Estrutura do Dashboard e Indicadores Clave de Desempenho (KPIs)
A interface principal organiza as informações operacionais prioritárias:
Módulo Operacional Instantâneo:
KPI 1: Volume acumulado de água destilada no dia ().
KPI 2: Vazão instantânea de condensação ().
KPI 3: Qualidade da água produzida (Estimativa de TDS em ).
KPI 4: Eficiência térmica instantânea do sistema ().
Status do Dispositivo: Nível de carga da bateria, integridade dos sensores e intensidade de sinal LoRa/Wi-Fi.
Módulo Histórico e Gráficos:
Séries temporais correlacionando irradiação solar (), temperatura da água () e volume condensado.
Comparativos de produtividade em diferentes condições de nebulosidade.
Módulo de Alertas Automáticos:
Alerta de Baixa Qualidade: Disparado caso o TDS da água condensada ultrapasse , indicando contaminação por respingos de salmoura.
Alerta de Anomalia de Produção: Ativado se a irradiação solar for  por mais de 2 horas e a taxa de condensação permanecer em , sinalizando vazamento de vapor ou obstrução no canal de coleta.
Alerta de Manutenção: Disparado quando o acúmulo de sais na bacia exigir lavagem operacional.
Simulador Offline do Dashboard
Para viabilizar a validação da interface de usuário antes da conclusão da infraestrutura física de sensoriamento, o aplicativo integra um simulador numérico. O simulador processa parâmetros de entrada fornecidos pelo usuário (latitude, área, temperatura ambiente e irradiação estimada) e gera séries temporais sintéticas fundamentadas nas equações termodinâmicas de Dunkle9, replicando a estrutura de dados transmitida pelo microcontrolador.


Inteligência Artificial e Modelagem de Machine Learning
A aplicação de Aprendizado de Máquina no projeto é reservada para problemas que apresentam complexidade não-linear e inviabilidade de resolução por equações analíticas determinísticas em tempo real.
Justificativa Técnica
Modelagem de Dinâmicas Não-Lineares Complexas: A taxa de evaporação em ambiente aberto sofre interferência de rajadas de vento, nebulosidade intermitente e sujeira acumulada na cobertura. A parametrização dessas variáveis em equações diferenciais contínuas exige elevado esforço computacional.
Previsão de Produção Hídrica Futura: Capacitar a gestão comunitária a planejar o consumo de água potável nas  horas seguintes, combinando os dados do sistema com previsões meteorológicas públicas (APIs do INPE/NOAA).
Manutenção Preditiva: Detectar a incrustação de sais na placa absorvedora observando alterações graduais na inércia térmica do sistema ao longo do tempo.
Modelos Candidatos e Avaliação de Viabilidade
ESPECULAÇÃO: A adoção de redes neurais profundas (Deep Learning) no estágio atual do projeto é tecnicamente inadequada, visto que esses modelos requerem elevado volume de dados para treinamento e apresentam risco de overfitting quando aplicados a conjuntos de dados experimentais reduzidos.
A seleção de algoritmos prioriza modelos de alta interpretabilidade e menor demanda computacional para dados tabulares:
Algoritmo
Complexidade Computacional
Volume Mínimo de Amostras
Desempenho para Séries Temporais
Adequação ao Projeto
Regressão Linear Múltipla
Muito Baixa
~500 registros
Baixo (não captura não-linearidades)
Baseline inicial
Random Forest Regressor
Média
~2.000 registros
Excelente
Recomendado
XGBoost / LightGBM
Média-Alta
~5.000 registros
Excelente
Recomendado
LSTM (Long Short-Term Memory)
Altíssima
>50.000 registros
Muito Bom
Inviável no estágio atual

Abordagem Avançada: Modelo Híbrido Física-Informada (Physics-Informed ML)
A abordagem metodológica escolhida é a modelagem híbrida (Physics-Informed Machine Learning). Em vez de utilizar o modelo de IA como uma estrutura isolada, o modelo físico fundamentado nas equações termodinâmicas estabelece a estimativa teórica de produção ().
O modelo de Machine Learning é treinado exclusivamente para prever o resíduo ou desvio () entre a estimativa teórica e a medição real em campo:

Essa abordagem reduz a necessidade de grandes volumes de dados para treinamento em até , impede previsões fisicamente inconsistentes (como produção de condensado sem irradiação solar ou sem gradiente térmico) e preserva a fundamentação científica do modelo.
Sustentabilidade Multidimensional e Impacto
A avaliação de sustentabilidade do dessalinizador solar inteligente contempla os aspectos ambientais, sociais e econômicos.
Sustentabilidade Ambiental
FATO: A pegada de carbono operacional do destilador solar passivo durante a fase de funcionamento é nula, visto que o processo utiliza exclusivamente energia solar direta para a mudança de fase da água, sem consumo de eletricidade ou combustíveis fósseis.
Entretanto, a sustentabilidade ambiental global é condicionada pelo ciclo de vida dos materiais empregados na fabricação (vidro, alumínio, plásticos e componentes eletrônicos) e pelo manejo adequado dos resíduos salinos gerados.
Sustentabilidade Social
O impacto social do sistema reflete-se na promoção da autonomia hídrica de populações vulneráveis. A adoção de uma tecnologia descentralizada reduz a dependência de suprimentos externos por caminhões-pipa1. A simplicidade de operação e o uso de interfaces digitais intuitivas permitem que a própria comunidade gerencie o equipamento, incentivando o desenvolvimento de competências técnicas locais3.

Sustentabilidade Econômica
A viabilidade econômica fundamenta-se no custo operacional reduzido. Enquanto sistemas convencionais de osmose reversa exigem a substituição contínua de elementos filtrantes, consumo energético e insumos químicos3, o destilador solar passivo demanda apenas intervenções periódicas de limpeza mecânica e substituição de vedações de baixo custo.
O Problema Crítico da Salmoura e Gestão de Resíduos
À medida que a água evapora no destilador solar, os sais dissolvidos permanecem no reservatório, aumentando progressivamente a salinidade do efluente residual (salmoura).
FATO: O descarte inadequado do rejeito salino diretamente no solo causa a salinização do subsolo, altera a estrutura física da terra, reduz a capacidade de retenção de água e encrostado a camada superficial, podendo inviabilizar o cultivo agrícola e contaminar lençóis freáticos6.
EVIDÊNCIA: Avaliações técnicas sobre o impacto de dessalinizadores no Semiárido demonstraram que o descarte incorreto do rejeito de dessalinização provoca a degradação ambiental do solo no entorno dos pontos de água6.
Estratégias de Mitigação e Economia Circular
Para mitigar o impacto da salmoura, são integradas três estratégias de manejo:
Descarga Líquida Zero (Zero Liquid Discharge - ZLD) por Secagem Solar: O efluente concentrado é transferido para tanques de evaporação total rasos expostos ao sol. A evaporação completa da água permite a recuperação e cristalização do sal seco (, ).
Uso em Aquicultura e Irrigação Halófita: Salmouras com salinidade intermediária podem ser direcionadas para o cultivo de espécies aquáticas tolerantes ou para a irrigação de plantas forrageiras halófitas (como a Atriplex nummularia e a palma forrageira).
Aproveitamento Secundário do Sal: O sal cristalizado seco pode ser utilizado em aplicações não potáveis, incluindo a nutrição animal local ou a conservação de couros e peles.
Qualidade da Água e Regulamentação Aplicável
A diferenciação entre água destilada e água potável é um requisito da engenharia sanitária e da química ambiental.
FATO: A água produzida por destilação solar apresenta elevada pureza em termos de isenção de sais dissolvidos e patógenos, porém não é considerada automaticamente potável para consumo humano direto4.
Legislação Brasileira de Potabilidade
A qualidade da água para consumo humano no Brasil é regulamentada pela Portaria GM/MS nº 888, de 4 de maio de 2021, do Ministério da Saúde4. A norma estabelece os Valores Máximos Permitidos (VMP) para parâmetros físico-químicos, organolépticos, químicos e microbiológicos4.
A tabela a seguir compara os limites normativos com os valores típicos da água destilada e da água potável tratada.

Parâmetro
Unidade
Limite da Portaria GM/MS nº 888/2021 (VMP)
Água Destilada Recém-Produzida
Água Potável Ajustada (Alvo)
Sólidos Totais Dissolvidos (TDS)


[cite: 4]


pH
-
 (Recomendado na rede)14
 (Devido à absorção de )

Turbidez

 (Para saída de pós-desinfecção)5


Cloretos


[cite: 4]


Escherichia coli

Ausência em 
[cite: 14]
Ausência (Devido à pasteurização térmica)
Ausência
Cloro Residual Livre (CRL)

 (Em pontos de consumo)5



Pós-Tratamento Obrigatório
A ingestão contínua de água desmineralizada (TDS ) pode favorecer a lixiviação de eletrólitos no organismo e apresenta baixa aceitação sensorial devido à ausência de sais. Para adequar o condensado às exigências de potabilidade, o sistema integra duas etapas de pós-tratamento:
Remineralização e Ajuste de pH: O condensado passa por um leito granular de remineralização composto por calcita () e dolomita (). Esse processo eleva o pH para faixas neutras () e adiciona íons essenciais de cálcio () e magnésio ().
Desinfecção Residual: Embora o processo térmico elimine patógenos, o armazenamento da água em reservatórios expõe o volume ao risco de contaminação secundária. A dosagem de hipoclorito de sódio garante o teor mínimo de  de cloro residual livre exigido pela legislação5.
Análise Econômica e Custo Nivelado da Água (LCOW)
A avaliação financeira de sistemas de tratamento de água utiliza a métrica do Custo Nivelado da Água (Levelized Cost of Water - LCOW)7. O LCOW representa o custo total presente de capital e operação do sistema dividido pelo volume total de água potável produzido ao longo de sua vida útil estimada7.
A expressão matemática do LCOW é dada por8:

Onde:
 é o investimento inicial em materiais, fabricação e componentes de sensoriamento.
 é o custo de operação e manutenção no ano  (limpeza, trocas de vedações e insumos de cloração).
 é o volume de água potável produzido no ano  em litros () ou metros cúbicos ().
 é a taxa de desconto anual.
 é a vida útil estimada do equipamento (adotada em  para a estrutura física).

Estimativa de Custos do Protótipo Instrumentado
Componente
Descrição do Item
Custo Estimado (BRL)
Custo Estimado (USD)
Estrutura Física
Madeira naval, isolamento EPS, vedações de silicone
R$ 180,00
$ 32,00
Cobertura e Coleta
Vidro temperado , calhas de alumínio e tubulação
R$ 85,00
$ 15,00
Placa Absorvedora
Chapa de alumínio pintada com tinta preta fosca
R$ 60,00
$ 11,00
Sensoriamento e IoT
Microcontrolador ESP32, sensores , fluxo e TDS
R$ 210,00
$ 38,00
Reservatórios e Filtro
Reservatórios e leito de remineralização em calcita
R$ 75,00
$ 14,00
Custo Total de Capital (CAPEX)
Investimento Inicial Total do Protótipo
R$ 610,00
$ 110,00

Considerando um protótipo com área útil de  e produção diária média de  () no Semiárido, taxa de desconto  ao ano e  anual de R$ 30,00, o cálculo do LCOW para o protótipo resulta em aproximadamente R$ 0,15 a R$ 0,22 por litro de água potável ao longo de 10 anos.
INFERÊNCIA: Embora o custo por litro do protótipo em pequena escala seja superior ao da tarifa de redes urbanas centralizadas, ele é inferior ao custo médio do suprimento por caminhões-pipa em comunidades remotas (que varia entre R$ 0,35 e R$ 0,60 por litro transportado), confirmando a viabilidade econômica do sistema em cenários de desassecamento rural.

Metodologia Científica e Plano Experimental
Para garantir o rigor científico e gerar dados para a validação do modelo termodinâmico e o treinamento do algoritmo de Aprendizado de Máquina, é estabelecido um protocolo de Design de Experimentos (DOE).
Hipótese Científica Testável
"A eficiência térmica e a taxa de produção volumétrica de um dessalinizador solar passivo variam em função da intensidade da irradiação solar incidente e do gradiente térmico entre a massa d'água e a cobertura transparente, sendo possível prever a produtividade diária com erro médio absoluto (MAE) inferior a 10% por meio de modelagem híbrida (física e Aprendizado de Máquina)."
Mapeamento da Matriz de Variáveis
Variáveis Independentes (Manipuladas e Climáticas):
Irradiação solar global incidente ( em ).
Temperatura ambiente ( em ).
Profundidade da lâmina d'água na bacia ().
Ángulo de inclinação da cobertura ().
Variáveis Dependentes (Respostas do Sistema):
Volume diário de água condensada ( em ).
Eficiência térmica diária ( em ).
Variação do teor de sólidos dissolvidos (Redução de TDS em ).
Variáveis de Controle (Mantidas Constantes):
Área de evaporação da bacia ().
Material da cobertura (Vidro temperado de ).
Salinidade inicial da água de entrada (Padronizada com solução de  a ).
Espessura do isolamento térmico da estrutura ( de EPS).
Protocolo Experimental e Tratamento Estatístico
Os testes de campo serão conduzidos por um período contínuo de 30 dias para capturar oscilações de nebulosidade e umidade. A coleta de dados pelos sensores ocorrerá a cada 60 segundos, com gravação em memória local e transmissão remota a cada 5 minutos.
Os dados coletados passarão por procedimentos de filtragem para remoção de outliers (via amplitude interquartil - IQR), imputação de falhas pontuais e normalização. A validação dos modelos preditivos utilizará técnica de validação cruzada k-fold () e métricas formais de desempenho: Erro Quadrático Médio (), Erro Médio Absoluto () e Coeficiente de Determinação ().
Matriz de Inovação e Estado da Arte
A tabela a seguir estabelece a diferenciação entre o conhecimento técnico consolidado na literatura e as contribuições específicas desenvolvidas no projeto.

Elemento do Projeto
Já Existe na Literatura / Mercado?
Contribuição Específica do Projeto
Nível de Evidência
Status de Validação
Princípio de Destilação Solar
Sim (Documentado desde o século XIX)9.
Reconfiguração geométrica modular e uso de materiais de baixo custo.
FATO
Amplamente Validado
Sensoriamento IoT Integrado
Sim (Aplicações genéricas em meteorologia).
Sensoriamento contínuo do gradiente térmico  e salinidade em tempo real.
EVIDÊNCIA
Em Desenvolvimento
Dashboard e Aplicativo
Sim (Sistemas comerciais de monitoramento fotovoltaico).
Interface com foco em KPIs comunitários e alertas automáticos de contaminação por salmoura.
PROPOSTA
Protótipo Conceitual
Modelagem Preditiva por ML
Parcialmente (Estudos acadêmicos pontuais sem IoT).
Algoritmo Híbrido (Physics-Informed ML) para estimativa regional com reduzido volume de dados.
HIPÓTESE
Em Fase de Modelagem
Adaptação Regional Automática
Não (Equipamentos comerciais possuem parâmetros fixos).
Ajuste dinâmico das curvas de previsão conforme a latitude e dados meteorológicos da localidade.
INFERÊNCIA
Proposta Futura

Matriz de Avaliação e Mitigação de Riscos
O desenvolvimento do projeto envolve incertezas técnicas, operacionais e metodológicas. A matriz a seguir detalha as estratégias de mitigação adotadas.
Categoria do Risco
Descrição do Risco Operacional
Probabilidade
Impacto
Estratégia de Mitigação Proposta
Técnico / Físico
Vazamento de vapor de água pelas vedações da cobertura.
Média
Alto
Aplicação de juntas duplas de silicone estrutural de cura neutra e travas de pressão mecânica.
Técnico / Físico
Quebra do vidro por choque térmico ou impacto mecânico.
Baixa
Alto
Adoção de vidro temperado e instalação de grade metálica articulada de proteção.
Qualidade / Saúde
Contaminação do condensado por respingos da água salobra acumulada.
Média
Altíssimo
Inclusão de calhas defletoras antirrespingo e alerta no app acionado pelo sensor de TDS.
Hardware / IoT
Corrosão dos sensores pelo ambiente salino aquecido.
Alta
Médio
Proteção de cabos e circuitos com resina epóxi e adoção de hastes de aço inox AISI 316.
Dados / IA
Volume insuficiente de dados experimentais para treinamento de IA.
Alta
Alto
Aplicação do modelo Physics-Informed ML, reduzindo a dependência de grandes bases de dados.
Metodológico
Rejeição da comunidade ao consumo da água devido a desequilíbrio sensorial.
Média
Médio
Implementação da etapa de remineralização por leito de calcita para padronização do sabor.

Separação Rigorosa Entre Protótipo e Visão Futura
Para garantir a transparência acadêmica e a clareza na apresentação do projeto, o desenvolvimento do sistema é categorizado explicitamente entre os elementos já validados, os componentes em construção e as propostas de expansão futura.
O Que Já Existe
A fundamentação teórica da destilação solar por evaporação e condensação, as equações termodinâmicas governantes (Modelo de Dunkle)9 e as normas de potabilidade da água da Portaria GM/MS nº 888/20214.
O Que Será Construído
O protótipo físico do destilador solar do tipo caixa (), o circuito de instrumentação eletrônica baseado no microcontrolador ESP32 e o módulo granular de remineralização por calcita5.
O Que Será Testado
A taxa de produção diária de água condensada (), a eficiência térmica do protótipo, a estabilidade de leitura dos sensores sob salinidade e a redução do teor de sólidos dissolvidos (TDS).
O Que Será Simulado
A interface móvel do aplicativo e a geração sintética de séries temporais de produção por meio do simulador termodinâmico alimentado por equações físicas9.
O Que É Proposta Futura
A expansão para arranjos modulares descentralizados em escala comunitária, a transmissão de dados de longa distância via rede LoRaWAN integrada e o suporte a múltiplos idiomas no aplicativo.
O Que Ainda É Hipótese
A premissa de que o modelo de Aprendizado de Máquina Híbrido (Physics-Informed ML) alcançará erro médio absoluto (MAE) inferior a 10% na previsão de produtividade quando submetido a condições microclimáticas instáveis de campo.
Classificação Prioritária de Componentes
A estruturação do projeto prioriza os componentes essenciais para a execução do sistema, evitando a inclusão de complexidades desnecessárias no estágio inicial.
ESSENCIAL:
Estrutura física e vedações de vapor do destilador solar.
Módulo granular de remineralização e cloração do condensado5.
Sensoriamento básico de temperatura (), irradiação solar () e volume produced ().
IMPORTANTE:
Dashboard operacional para visualização de dados e recebimento de alertas de salinidade.
Modelo de predição híbrido (Physics-Informed ML) para estimativa de produtividade.
Módulo de cristalização solar para gestão da salmoura residual (ZLD)6.
DIFERENCIAL:
Sistema de resfriamento superficial do vidro ativado por gravidade.
Transmissão de dados via rádio LoRa para regiões sem cobertura celular.
FUTURO:
Representação em Digital Twin para monitoramento industrial avançado.
Suporte a pagamentos ou créditos de água no aplicativo.
DISPENSÁVEL:
Mecanismos motorizados de rastreamento solar (solução passiva simplificada apresenta maior viabilidade econômica).
Roadmap do Projeto
O plano de execução do projeto está organizado em dez etapas sequenciais:
Etapa 1 — Pesquisa Fundamental: Mapeamento do estado da arte, normas de potabilidade e modelos termodinâmicos4.
Etapa 2 — Projeto do Protótipo: Dimensionamento geométrico e seleção de materiais atóxicos e isolantes.
Etapa 3 — Construção Física: Montagem da bacia absorvedora, isolamento, calhas e vedação da cobertura de vidro.
Etapa 4 — Instrumentação IoT: Integração dos sensores ao microcontrolador ESP32 e calibração dos circuitos.
Etapa 5 — Coleta Experimental: Execução do protocolo de testes por 30 dias contínuos em campo.
Etapa 6 — Dashboard e Simulador: Programação da interface gráfica e integração do simulador termodinâmico9.
Etapa 7 — Análise Estatística: Filtragem dos dados experimentais e cálculo das métricas de erro ().
Etapa 8 — Modelagem por ML: Treinamento do algoritmo híbrido (PIML) e ajuste dos parâmetros de regressão.
Etapa 9 — Validação Sanitária: Ensaios da água remineralizada conforme a Portaria GM/MS nº 888/20214.
Etapa 10 — Estudo de Escala: Avaliação técnica e econômica do arranjo modular para aplicação comunitária.
Banco de Questões Difíceis e Defesas da Banca
Esta seção reúne 12 perguntas de aprofundamento técnico que podem ser formuladas por uma banca examinadora, acompanhadas das respectivas respostas fundamentadas e evidências requeridas.
1. Categoria: Física e Termodinâmica
Pergunta: A eficiência térmica de destiladores solares passivos raramente ultrapassa 30% a 40%. Qual o destino do restante da energia solar incidente sobre o equipamento?
Resposta: A fração restante da energia solar (60% a 70%) é dissipada por quatro vias principais: (1) reflexão óptica na superfície do vidro e na lâmina d'água (10% a 15%); (2) emissão radiativa de onda longa do reservatório aquecido para a atmosfera (15% a 20%); (3) perdas por condução térmica através da base e das paredes isoladas (10% a 15%); e (4) retenção do calor sensível necessário para elevar a temperatura da massa d'água e da estrutura do equipamento até atingir a temperatura de regime, sem que ocorra mudança de fase (10% a 15%). O projeto mitiga essas perdas aplicando isolamento de EPS de  e operando com lâmina d'água de reduzida inércia térmica ().
Evidência Necessária: Diagrama de balanço energético e Sankey de perdas térmicas do protótipo.
Possible Counter-argument: Mesmo assim, a produção volumétrica diária é insuficiente para grandes populações.
Resposta ao Contra-argumento: O sistema não pretende substituir estações industriais de dessalinização urbana, mas suprir a demanda vital descentralizada ( para ingestão direta) em agrupamentos rurais isolados da rede elétrica.
2. Categoria: Inovação e Aprendizado de Máquina
Pergunta: Qual a justificativa técnica para aplicar Machine Learning em um sistema de destilação solar, em vez de utilizar equações de transporte puramente físicas?
Resposta: Equações físicas analíticas, como o Modelo de Dunkle, preveem o comportamento do sistema sob condições estáticas de laboratório9. Em ambiente real, variáveis não controladas — tais como o acúmulo de poeira na cobertura, a degradação da pintura absorvedora, a umidade relativa flutuante e rajadas de vento — introduzem desvios não-lineares nas equações determinísticas. O Machine Learning é empregado para aprender o comportamento desse resíduo não-linear, ajustando a previsão teórica à realidade microclimática de cada local sem a necessidade de re-calibração manual dos parâmetros físicos.
Evidência Necessária: Gráfico de dispersão comparando o erro de previsão da equação física pura em relação ao modelo híbrido (Physics-Informed ML).
Possible Counter-argument: A quantidade de dados coletados em um protótipo estudantil é insuficiente para treinar um modelo sem overfitting.
Resposta ao Contra-argumento: A limitação de volume de dados é contornada pela abordagem híbrida (PIML), na qual o modelo físico estabelece a linha de base e a IA prevê apenas o resíduo, reduzindo a exigência de amostras em até 80%. "Ainda não temos evidência suficiente para afirmar isso com validação de campo em longo prazo, sendo esta a meta da nossa próxima fase experimental."
3. Categoria: Qualidade da Água e Saúde Pública
Pergunta: A água destilada é isenta de minerais essenciais. Como garantir que a água produzida pelo sistema seja segura para consumo humano contínuo?
Resposta: A água destilada bruta não é considerada potável devido à sua baixa mineralização e pH ácido resultante da absorção de 4. Por essa razão, a arquitetura do projeto inclui uma unidade obrigatória de pós-tratamento: o condensado passa por um leito granular de calcita () e dolomita (), promovendo o ajuste do pH para  e a adição de íons de cálcio e magnésio (TDS final de ), seguido de cloração residual de proteção (), atendendo aos parâmetros da Portaria GM/MS nº 888/20215.
Evidência Necessária: Laudo de análise físico-química e microbiológica da água tratada emitido por laboratório certificado.
4. Categoria: Engenharia e Materiais
Pergunta: O uso de vedações sintéticas em uma câmara que atinge temperaturas elevadas não corre o risco de liberar compostos orgânicos voláteis (VOCs) na água destilada?
Resposta: Esse risco ocorre quando são utilizados plásticos não homologados ou silicones acéticos comerciais com solventes. No projeto do protótipo, todos os componentes em contato com a água líquida ou com o vapor possuem especificação atóxica de grau alimentício (Food Grade). O reservatório é construído em alumínio e as vedações utilizam silicone de cura neutra próprio para altas temperaturas (resistente a até ), isento de plastificantes ou ftalatos.
Evidência Necessária: Ficha de Informação de Segurança de Produtos Químicos (FISPQ) dos materiais de vedação atestando atoxidade.
5. Categoria: Impacto Ambiental e Rejeitos
Pergunta: Como o projeto trata o descarte da salmoura concentrada retida na bacia sem causar a contaminação do solo?
Resposta: O descarte direto de salmoura provoca a salinização e a degradação física do solo6. O projeto adota a estratégia de Descarga Líquida Zero (Zero Liquid Discharge - ZLD) para pequena escala6. O efluente concentrado é drenado periodicamente para um cristalizador solar (uma bandeja rasa anexa), onde a evaporação completa resulta na precipitação do sal seco. Esse sal cristalizado é recolhido para uso na nutrição animal ou preservação de couros, eliminando o descarte efluente no solo.
Evidência Necessária: Ensaio de cristalização em bandeja e caracterização do sal recuperado.
6. Categoria: Sensoriamento e IoT
Pergunta: Sensores de condutividade e TDS analógicos sofrem rápida oxidação e incrustação em meios salinos quentes. Como manter a precisão das leituras do aplicativo sem trocas frequentes?
Resposta: Sensores de eletrodo galvânico sofrem degradação por eletrólise se alimentados continuamente. Para preservar os eletrodos, a leitura do sensor de TDS ocorre por pulsos chaveados via transistor, ativados apenas durante 2 segundos por medição. Além disso, a medição principal da potabilidade é realizada no canal do condensado (água purificada com baixa salinidade), reduzindo o estresse químico sobre o sensor.
Evidência Necessária: Teste de estabilidade das leituras do sensor ao longo de 500 horas de operação intermitente.
7. Categoria: Custos e Escalabilidade
Pergunta: O custo por litro produzido por um protótipo de pequena escala não é superior ao de tecnologias industriais consolidadas?
Resposta: A análise comparativa de viabilidade em comunidades rurais isoladas deve considerar o Custo Nivelado da Água (LCOW) em vez do  isolado7. Plantas industriais de osmose reversa exigem infraestrutura elétrica contínua, bombas de alta pressão e técnicos especializados para substituição de membranas3. Em localidades sem rede elétrica, a destilação solar apresenta um  insignificante e elimina custos com combustíveis ou baterias, resultando em um LCOW competitivo perante o transporte via caminhão-pipa.
Evidência Necessária: Planilha comparativa de  e  acumulados em 10 anos entre destilação solar passiva e osmose reversa a diesel.
8. Categoria: Arquiteta de Software e Operação
Pergunta: O aplicativo depende de conexão com a Internet para executar as previsões e exibir os alertas ao usuário?
Resposta: Não. O aplicativo é desenvolvido utilizando arquitetura offline-first. As rotinas de conversão e os parâmetros do modelo preditivo simplificado são executados diretamente no firmware do microcontrolador ESP32 ou localmente no dispositivo móvel via comunicação Bluetooth. A conexão com a nuvem é necessária apenas para a sincronização do histórico quando houver sinal de rede disponível.
Evidência Necessária: Demonstração funcional do aplicativo operando sem conexão com a internet via comunicação Bluetooth com o ESP32.
9. Categoria: Termodinâmica da Condensação
Pergunta: Como prevenir a redução na taxa de condensação à medida que a cobertura de vidro aquece ao longo do dia?
Resposta: À medida que o vidro absorve calor do vapor, a redução do gradiente  atenua a taxa de condensação. O projeto aborda esse fenômeno mantendo a inclinação do vidro entre  para acelerar o escoamento gravítico do filme condensado (removendo a massa aquecida da superfície do vidro) e prevendo, no protótipo semi-ativo, o resfriamento superficial por meio de um filme fino de água bruta aplicado sobre a face externa do vidro.
Evidência Necessária: Gráfico comparativo do gradiente térmico  e da vazão de condensação com e sem resfriamento externo.
10. Categoria: Metodologia Experimental
Pergunta: Como demonstrar que uma alteração geométrica no protótipo efetivamente aumentou a produção, isolando as variações da radiação solar diária?
Resposta: A validação de modificações construtivas utiliza ensaios pareados sob condições climáticas idênticas. Dois protótipos de mesmas dimensões são expostos lado a lado: uma Unidade de Controle (padrão) e uma Unidade Experimental (com a alteração de engenharia). A medição simultânea e a aplicação do teste estatístico t-Student para amostras pareadas permitem verificar se a diferença de produção obtida possui significância estatística ().
Evidência Necessária: Relatório de análise estatística de variância (ANOVA) e teste t-Student dos ensaios pareados.
11. Categoria: Segurança e Inocuidade
Pergunta: Qual o procedimento para evitar a formação de biofilmes microbiológicos no interior da bacia de evaporação durante períodos de repouso?
Resposta: O acúmulo de microorganismos é inibido pela pasteurização térmica diária provocada pela radiação solar, que eleva a temperatura da água na bacia a faixas entre . Para períodos de paralisação, o protocolo operacional determina a drenagem total da salmoura residual e a secagem da câmara interna, prevenindo a estagnação de matéria orgânica.
Evidência Necessária: Protocolo de Operação Padrão (POP) de higienização preventiva e laudo microbiológico da bacia após 30 dias de uso.
12. Categoria: Manutenção e Vida Útil
Pergunta: Como a incrustação de sais no fundo do recipiente afeta a absorção térmica e qual a frequência de limpeza necessária?
Resposta: O acúmulo de cristais de sal brancos sobre o fundo escurecido da bacia aumenta a refletância óptical do absorvedor, reduzindo a taxa de absorção de radiação. O aplicativo monitora a inércia térmica do sistema e emite um alerta de manutenção preventiva quando detecta queda na eficiência. A remoção da crosta salina é realizada por enxágue mecânico simples com a própria água bruta antes do início do ciclo diário.
Evidência Necessária: Curva experimental de degradação da eficiência térmica em função dos dias de operação sem lavagem da bacia.
Guias de Argumentação e Reformulação
Para garantir rigor técnico na apresentação e defesa do projeto, termos genéricos ou imprecisos devem ser substituídos por formulações orientadas a evidências.

Afirmação Fraca ou Imprecisa
Motivo da Inadequação Técnica
Reformulação Cientificamente Defensável
"O projeto é sustentável porque usa energia solar."
Ignora os impactos ambientais de fabricação, descarte e salmoura6.
"O sistema apresenta emissão nula de carbono na fase operacional, mitigando impactos do ciclo de vida via ZLD."
[cite: 6]
"Criamos uma solução inovadora com Inteligência Artificial."
Uso de IA não é inovação se o problema puder ser resolvido por equações simples.
"A inovação reside no modelo híbrido (PIML) que reduz os erros de estimativa física sob variações microclimáticas."
"O equipamento produz água potável a custo zero."
Desconsidera o investimento de capital (), depreciação e insumos de pós-tratamento5.
"A tecnologia reduz o Custo Nivelado da Água () frente ao transporte por caminhões-pipa em áreas remotas."
[cite: 8]
"A água destilada é pura e pronta para o consumo."
Água destilada desmineralizada não atende à Portaria GM/MS nº 888/20214.
"A destilação purifica a água de sais e patógenos, sendo a potabilidade garantida por remineralização e cloração."
[cite: 5]
"O sistema resolve a escassez de água regional."
Generalização que desconsidera as restrições de área útil e produção diária por metro quadrado.
"O sistema fornece uma alternativa descentralizada viável para o suprimento de água potável em pequenas comunidades rurais."
[cite: 1]

Guia de Apresentação Sequencial
A apresentação verbal do projeto deve seguir uma narrativa encadeada baseada na seguinte estrutura:
Abertura e Problema: Apresentação da escassez hídrica e da salinidade das águas subterrâneas no Semiárido como barreira ao desenvolvimento social1.
Diagnóstico Tecnológico: Análise das limitações de custo e infraestrutura dos sistemas convencionais de osmose reversa e do transporte por caminhões-pipa em comunidades isoladas3.
Proposta e Princípio Físico: Apresentação da destilação solar passiva e semi-ativa fundamentada nos processos de evaporação e condensação9.
Engenharia do Protótipo: Detalhamento da seleção de materiais atóxicos, isolamento térmico e inclinação da cobertura para otimização do fluxo de massa.
Pós-Tratamento e Potabilidade: Demonstração do leito de remineralização por calcita para enquadramento da água nos parâmetros da Portaria GM/MS nº 888/20214.
Camada IoT e Inteligência de Dados: Descrição da arquitetura de sensoriamento (ESP32) e do modelo híbrido de Machine Learning (Physics-Informed ML) para previsão preditiva.
Sustentabilidade e Salmoura: Exposição do método de cristalização solar para Descarga Líquida Zero (ZLD), prevenindo a degradação do solo6.
Viabilidade Econômica: Apresentação do Custo Nivelado da Água (LCOW) demonstrando a atratividade financeira do sistema ao longo de 10 anos7.
Limitações e Honestidade Científica: Reconhecimento explícito das restrições de escala por área útil e apresentação das etapas que permanecem como hipóteses a validar.
Conclusão e Próximos Passos: Síntese do impacto social e apresentação do roadmap de evolução do protótipo.
Plano de Ação Prioritário ("O Que Precisamos Fazer Agora")
Abaixo estão detalhadas as ações imediatas para a transição da fase teórica para a execução e validação experimental.
Ação 1: Construção e Ensaio de Estanqueidade do Protótipo
Objetivo: Concluir a montagem da estrutura física do destilador solar de  e validar o isolamento térmico e a vedação contra vazamentos de vapor.
Motivo: Assegurar a integridade física do equipamento antes do início da instalação dos sensores eletrônicos.
Dificuldade: Média (exige corte de materiais, fixação mecânica e aplicação de silicone neutro).
Dependências: Aquisição da chapa de alumínio, vidro temperado , placas de EPS e silicone estrutural.
Resultado Esperado: Câmara hermética capaz de sustentar temperaturas internas de água superiores a  sem vazamentos visíveis de vapor.
Critério de Conclusão: Produção contínua de condensado observada ao longo de um ensaio solar de 6 horas sem perda de estanqueidade nas vedações.
Ação 2: Programação e Calibração do Firmware do ESP32
Objetivo: Desenvolver o código de leitura dos sensores (, TDS) e estruturação dos dados em arquivos JSON.
Motivo: Garantir a gravação automatizada das séries temporais necessárias para o treinamento dos modelos de regressão.
Dificuldade: Média (programação em C++ no ambiente Arduino IDE / ESP-IDF e calibração de sinais analógicos).
Dependências: Disponibilidade dos sensores, microcontrolador ESP32 e módulo leitor de cartão SD.
Resultado Esperado: Firmware estável que realiza medições a cada 60 segundos e grava as leituras no cartão de memória local sem falhas de travamento.
Critério de Conclusão: Execução ininterrupta do circuito de sensoriamento por 48 horas seguidas com desvio de medição de temperatura inferior a .
Ação 3: Teste do Leito de Remineralização em Calcita
Objetivo: Construir o cartucho de pós-tratamento mineral e analisar os parâmetros de pH e TDS da água produzida5.
Motivo: Comprovar a adequação do condensado aos padrões da Portaria GM/MS nº 888/20214.
Dificuldade: Baixa (montagem de coluna de percolação hidráulica contendo grânulos de calcita e dolomita).
Dependências: Obtenção de amostras de água condensada pelo protótipo e grânulos minerais de grau alimentício.
Resultado Esperado: Elevação do pH do condensado de  para a faixa neutra entre  e incremento no teor de sólidos dissolvidos para .
Critério de Conclusão: Medição físico-química confirmando pH e TDS dentro das especificações normativas de potabilidade4.
Ação 4: Implementação do Simulador Termodinâmico no Aplicativo
Objetivo: Programar o módulo de simulação matemática no aplicativo móvel com base no Modelo de Dunkle9.
Motivo: Permitir a demonstração das funcionalidades do dashboard e a validação da interface de usuário antes da integração com a rede de sensores remota.
Dificuldade: Média (programação frontend e implementação de rotinas matemáticas em JavaScript/Dart).
Dependências: Consolidação das equações de evaporação e coeficientes convectivos9.
Resultado Esperado: Interface gráfica capaz de gerar curvas de produção diária e alertas operacionais simulados a partir da inserção de dados pelo usuário.
Critério de Conclusão: Simulador executando em dispositivo móvel sem erros de sintaxe e apresentando respostas coerentes com o modelo físico.
Referências citadas
Programa Água Doce - PAD - SRH - Secretaria dos Recursos Hídricos, https://www.srh.ce.gov.br/programa-agua-doce-pad/
MIDR implementou 1.068 sistemas de dessalinização em 298 municípios do semiárido brasileiro em 20 anos - Portal Gov.br, https://www.gov.br/mdr/pt-br/noticias/midr-implementou-1-068-sistemas-de-dessalinizacao-em-298-municipios-do-semiarido-brasileiro-em-2024
Programa Água Doce | Cooperativa Sul Sul Trilateral, https://ssc4c.org.br/central-de-conhecimento/boas-praticas-em-wash/programa-agua-doce
POTABILIDADE DE ÁGUAS SUBTERRÂNEAS EM SISTEMAS ALTERNATIVOS NO INTERIOR DO MARANHÃO: ESTUDO DE CASO EM CODÓ-MA DRINKABILITY - New Science, https://periodicos.newsciencepubl.com/arace/article/download/5586/7971/22326
Portaria GM/MS Nº 888, de 4 de maio de 2021: conheça!, https://microambiental.com.br/analises-de-agua/conheca-a-nova-portaria-gm-ms-n-888-de-4-de-maio-de-2021-e-entenda-as-principais-mudancas-ocorridas/
(PDF) Avaliação do sistema de dessalinização do programa água doce no município de Gravatá, PE - ResearchGate, https://www.researchgate.net/publication/371653754_Avaliacao_do_sistema_de_dessalinizacao_do_programa_agua_doce_no_municipio_de_Gravata_PE
Techno-Economic Analysis of Atmospheric Water Harvesting Across Climates, https://pubs.acs.org/aeecco/article/4/7/1769/351870/Techno-Economic-Analysis-of-Atmospheric-Water
The levelized cost of exergy: a technoeconomic framework for energy system comparison, https://pubs.rsc.org/ee/article/19/2/460/1248535/The-levelized-cost-of-exergy-a-technoeconomic
Mathematical Modelling of Heat and Mass Transfer in a Roof Type Solar Distillation System, https://www.ajol.info/index.php/njt/article/view/216220/203903
BELO HORIZONTE E AUTOGERAÇÃO DE ... - Repositorio UFMG, https://repositorio.ufmg.br/bitstream/1843/39875/1/MARTINS_HUMBERTOREVISADO.pdf
Avaliação de Políticas Públicas no Brasil:, https://repositorio.ipea.gov.br/bitstreams/a480fc20-42e8-453d-9b07-6b5128168f2f/download
Portaria Nº 888 - filtros FUSATI, https://www.fusati.com.br/portaria-no-888/
Água para Consumo Humano Industrial: Exigências e Análises - GeoAvaliar, https://geoavaliar.com.br/blog/qualidade-da-agua-para-consumo-humano-em-industrias-exigencias-e-anali
Portaria GM/MS 888: Como Adequar seu Medidor de pH - Splabor, https://www.splabor.com.br/blog/medidor-de-ph/como-se-adequar-as-normas-da-portaria-gm-ms-888/
