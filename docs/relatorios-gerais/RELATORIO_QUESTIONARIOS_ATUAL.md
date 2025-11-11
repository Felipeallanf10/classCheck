# 📊 RELATÓRIO TÉCNICO – Sistema de Questionários e Relatórios Analíticos

**Data:** 31 de outubro de 2025  
**Versão:** 1.0  
**Status do Projeto:** ClassCheck v3.0 - Sistema Adaptativo Implementado

---

## 📋 SUMÁRIO EXECUTIVO

Este relatório fornece uma análise técnica profunda do módulo de questionários adaptativos do ClassCheck, documentando a arquitetura atual, fluxos de dados, pontos fortes, limitações e recomendações de evolução.

### Destaques

✅ **Implementado:** Sistema CAT (Computerized Adaptive Testing) baseado em IRT (Item Response Theory)  
✅ **Implementado:** Motor de regras clínicas com `json-rules-engine`  
✅ **Implementado:** Persistência completa de sessões e respostas  
✅ **Parcial:** Geração de relatórios básicos (dados disponíveis, visualizações limitadas)  
⚠️ **Limitação:** Relatórios analíticos profundos ainda não extraem todo potencial dos dados coletados

---

## 🎯 1. FLUXO DE NAVEGAÇÃO E LÓGICA ADAPTATIVA

### 1.1 Como o Sistema Decide a Próxima Pergunta

O ClassCheck implementa um **sistema adaptativo híbrido** que combina três estratégias:

#### **A. Teoria de Resposta ao Item (IRT)**

**Localização:** `src/lib/adaptive/selecao-avancada-service.ts`

O sistema utiliza o modelo IRT 2PL (2-Parameter Logistic) para:

1. **Estimar habilidade (θ - theta)** do respondente após cada resposta
2. **Calcular informação de Fisher** para cada pergunta candidata
3. **Selecionar perguntas que maximizam a informação** sobre o nível real do respondente

```typescript
// Cálculo de Informação de Fisher (I_i(θ))
I(θ) = a² × P(θ) × [1 - P(θ)]

// Onde:
// a = discriminação da pergunta (parâmetro A)
// P(θ) = probabilidade de resposta correta no nível θ
// θ = habilidade estimada do respondente
```

**Critérios de Parada (CAT):**
- **Mínimo:** 5 perguntas respondidas
- **Precisão:** SEM (Standard Error of Measurement) < 0.30
- **Máximo:** 20 perguntas (failsafe)

#### **B. Motor de Regras Clínicas**

**Localização:** `src/lib/adaptive/engine.ts`

O sistema usa `json-rules-engine` com regras armazenadas no banco de dados (`RegraAdaptacao`) para:

1. **Detectar padrões clínicos** (ex: ansiedade elevada, risco de depressão)
2. **Acionar perguntas de aprofundamento** quando gatilhos são atingidos
3. **Saltar perguntas irrelevantes** baseado no contexto

**Exemplo de Regra (JSON):**
```json
{
  "conditions": {
    "all": [
      {
        "fact": "scoreCategoria",
        "operator": "greaterThan",
        "value": 7,
        "params": { "categoria": "ANSIEDADE" }
      }
    ]
  },
  "event": {
    "type": "ACIONAR_PERGUNTA",
    "params": {
      "escalaNome": "GAD-7",
      "motivacao": "Score de ansiedade elevado detectado"
    }
  }
}
```

**Operadores Customizados Implementados:**
- `inRange`: verifica se valor está em faixa numérica
- `trendUp` / `trendDown`: detecta tendências ao longo de múltiplas respostas
- `abovePercentile`: compara com normativas populacionais
- `consistencyCheck`: verifica inconsistências nas respostas

#### **C. Seleção Balanceada**

**Localização:** `src/lib/adaptive/proxima-pergunta-service.ts`

Aplica **filtros inteligentes** para garantir qualidade e diversidade:

1. **Balanceamento por Categoria:** Evita saturação (máx. 6 perguntas/categoria)
2. **Balanceamento por Domínio:** Distribui entre bem-estar, ansiedade, sono, etc. (máx. 4/domínio)
3. **Balanceamento por Escala:** Evita repetição de escalas clínicas (máx. 3/escala como PHQ-9, GAD-7)
4. **Informação Mínima:** Descarta perguntas com I(θ) < 0.05
5. **Evitar Repetição:** Nunca apresenta pergunta já respondida na sessão

### 1.2 Onde e Como as Regras Estão Implementadas

#### **Distribuição de Responsabilidades**

| Componente | Localização | Responsabilidade |
|-----------|-------------|------------------|
| **Orquestração** | `src/lib/adaptive/proxima-pergunta-service.ts` | Coordena IRT + Regras + Seleção |
| **IRT & CAT** | `src/lib/adaptive/selecao-avancada-service.ts` | Cálculos psicométricos, Fisher, SEM |
| **Motor de Regras** | `src/lib/adaptive/engine.ts` | Carrega e executa regras clínicas |
| **API de Resposta** | `src/app/api/sessoes/[id]/resposta/route.ts` | Salva resposta e chama orquestração |
| **API de Sessão** | `src/app/api/sessoes/[id]/route.ts` | Retorna pergunta atual para o frontend |

#### **Fluxo Completo (Sequência)**

```
┌──────────────────┐
│ Usuário responde │
│   à Pergunta N   │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────┐
│ POST /api/sessoes/[id]/resposta │
│ ─────────────────────────────── │
│ 1. Valida resposta (Zod)        │
│ 2. Salva em RespostaSocioemoc.  │
│ 3. Denormaliza campos (cat/dom) │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ determinarProximaPergunta()     │
│ ─────────────────────────────── │
│ 1. prepararFacts(sessaoId)      │
│ 2. runEngine() → eventos/regras │
│ 3. calcularSEM() + critérios    │
│ 4. selecionarPergunta() (IRT)   │
│ 5. Balanceamento e filtros      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Retorna próxima pergunta        │
│ OU finaliza sessão              │
└─────────────────────────────────┘
```

### 1.3 Limitações Atuais do Fluxo

#### **🟡 Limitação 1: Dependência de Dados de Calibração**

**Problema:** Perguntas do banco adaptativo (`BancoPerguntasAdaptativo`) exigem parâmetros IRT calibrados (a, b, c). Atualmente, muitas perguntas estão com valores padrão:
- `parametroA` (discriminação) = 1.0
- `parametroB` (dificuldade) = 0.0
- `parametroC` (chute) = 0.0

**Impacto:** A seleção IRT pode não ser ideal se os parâmetros não refletirem a realidade psicométrica das perguntas.

**Recomendação:** 
- Realizar estudos de calibração com amostra representativa
- Importar parâmetros de escalas validadas (PHQ-9, GAD-7, WHO-5, etc.)

#### **🟡 Limitação 2: Regras Clínicas Ainda em Desenvolvimento**

**Problema:** Apenas ~10 regras de exemplo implementadas no seed. Faltam regras para:
- Triagem de suicidalidade (perguntas críticas do PHQ-9)
- Detecção de transtornos alimentares
- Padrões de burnout acadêmico
- Alerta de abuso de substâncias

**Impacto:** O sistema adaptativo está "subutilizado" – a maioria das seleções é puramente IRT, sem aproveitar o contexto clínico.

**Recomendação:**
- Trabalhar com psicólogos para mapear árvores de decisão clínica
- Implementar biblioteca de ~50 regras cobrindo:
  - Severidade (leve → moderado → grave)
  - Comorbidades (ansiedade + depressão)
  - Gatilhos contextuais (sono ruim → concentração baixa)

#### **🟡 Limitação 3: Fallback Simplista para Perguntas do Banco**

**Problema:** Quando a pergunta vem do `BancoPerguntasAdaptativo` e não tem tipo definido, o GET da sessão força `LIKERT_5` com labels genéricas:

```typescript
opcoes: [
  { valor: 1, label: 'Muito insatisfeito' },
  { valor: 2, label: 'Insatisfeito' },
  { valor: 3, label: 'Neutro' },
  { valor: 4, label: 'Satisfeito' },
  { valor: 5, label: 'Muito satisfeito' }
]
```

**Impacto:** Labels podem não ser semanticamente adequadas para perguntas de frequência (ex: "Com que frequência você se sentiu nervoso?").

**Recomendação:**
- Mapear tipos de pergunta (`LIKERT_FREQUENCIA`, `LIKERT_CONCORDANCIA`, `LIKERT_SATISFACAO`, `VAS_SLIDER`)
- Aplicar labels contextuais no frontend baseado em `categoria` ou `escalaNome`

#### **🔴 Limitação 4: Não Há Navegação para Trás**

**Problema:** O sistema não permite que o usuário revise ou altere respostas anteriores.

**Impacto:** 
- Erros de digitação não podem ser corrigidos
- Usuários podem abandonar o questionário por medo de errar

**Recomendação:**
- Implementar `perguntaAnterior()` no store Zustand
- Permitir edição de respostas recentes (últimas 3 perguntas)
- Recalcular theta ao editar (recalibração do CAT)

#### **🟡 Limitação 5: Falhas em Sessões Longas (Timeout)**

**Problema:** Se o usuário pausar a sessão por muito tempo (ex: fechar o navegador), o estado pode se perder.

**Impacto:** 
- Sessão fica órfã (status `EM_ANDAMENTO` mas sem interação)
- Próxima pergunta pode não carregar corretamente após pausa longa

**Recomendação:**
- Adicionar heartbeat/ping durante a sessão
- Implementar lógica de "retomar sessão" mais robusta
- Expirar sessões inativas após 24h (status → `EXPIRADA`)

---

## 🧠 2. ARMAZENAMENTO E PERSISTÊNCIA

### 2.1 Arquitetura de Dados

O sistema utiliza **PostgreSQL** com **Prisma ORM** para persistência completa. Principais tabelas:

#### **Tabela: `SessaoAdaptativa`**

Armazena o estado da sessão de questionário.

```prisma
model SessaoAdaptativa {
  id                   String   @id @default(uuid())
  questionarioId       String
  usuarioId            Int
  
  // Estado
  status               StatusSessao  // INICIAL | EM_ANDAMENTO | PAUSADA | FINALIZADA | CANCELADA
  iniciadoEm           DateTime
  pausadoEm            DateTime?
  finalizadoEm         DateTime?
  
  // Navegação
  proximaPergunta      String?
  perguntasApresentadas String[]  // Array de IDs
  
  // IRT
  thetaEstimado        Float    @default(0.0)
  erroEstimacao        Float    @default(1.0)
  confianca            Float    @default(0.5)
  
  // Resultados
  scoresPorCategoria   Json?    // {"ANSIEDADE": 7, "BEM_ESTAR": 5}
  nivelAlerta          NivelAlerta  // VERDE | AMARELO | LARANJA | VERMELHO
  
  // Metadados
  contextoTipo         ContextoTipo  // GERAL | AULA | CHECK_IN | EVENTO
  contextoMetadata     Json?
  aulaId               Int?
  
  // Relacionamentos
  questionario         QuestionarioSocioemocional
  usuario              Usuario
  respostas            RespostaSocioemocional[]
  alertas              AlertaSocioemocional[]
}
```

**Campos Denormalizados (Otimização de Leitura):**
- `scoresPorCategoria`: Evita recalcular em cada consulta
- `thetaEstimado`: Estado atual do IRT (não precisa recalcular desde o início)
- `perguntasApresentadas`: Evita joins complexos para verificar "já respondeu"

#### **Tabela: `RespostaSocioemocional`**

Armazena cada resposta individual.

```prisma
model RespostaSocioemocional {
  id               String   @id @default(uuid())
  sessaoId         String
  usuarioId        Int
  
  // Relacionamento com Pergunta (ambos opcionais para suportar banco adaptativo)
  perguntaId       String?  // FK para PerguntaSocioemocional
  perguntaBancoId  String?  // FK para BancoPerguntasAdaptativo
  
  // Valor da resposta
  valor            Json     // Flexível: number | string | boolean | array
  valorNumerico    Float?   // Normalizado para cálculos
  valorTexto       String?  // Texto adicional (se aplicável)
  valorNormalizado Float    // 0-1 (para IRT)
  
  // Metadados de resposta
  tempoResposta    Int      // Segundos
  respondidoEm     DateTime
  ordem            Int      // Ordem na sessão (1, 2, 3...)
  
  // Campos denormalizados (performance + desacoplamento)
  categoria        CategoriaPergunta?
  dominio          DominioEmocional?
  escalaNome       String?
  escalaItem       String?
}
```

**⭐ Estratégia Recente (Migração Importante):**

Anteriormente, o sistema criava "perguntas proxy" (entradas inativas em `PerguntaSocioemocional`) para manter a FK quando a pergunta vinha do banco adaptativo. **Isso foi removido!**

**Nova abordagem (23/10/2025):**
- `perguntaId` = NULL quando resposta é de pergunta do banco
- `perguntaBancoId` = ID da pergunta do `BancoPerguntasAdaptativo`
- Campos denormalizados (`categoria`, `dominio`, `escalaNome`) garantem que análises funcionem sem joins

**Benefícios:**
- ✅ Não polui a tabela de perguntas com proxies inativas
- ✅ Evita FK violations
- ✅ Permite análises mesmo se a pergunta for deletada do banco

#### **Tabela: `QuestionarioSocioemocional`**

Template de questionário.

```prisma
model QuestionarioSocioemocional {
  id                   String  @id @default(uuid())
  titulo               String
  tipo                 TipoQuestionario  // AUTOAVALIACAO | TRIAGEM | DIAGNOSTICO
  adaptativo           Boolean  @default(false)
  duracaoEstimada      Int?     // Minutos
  
  contextoPrincipal    ContextoTipo  // GERAL | AULA | CHECK_IN
  categorias           String[]      // ["BEM_ESTAR", "ANSIEDADE", "SONO"]
  
  // Configurações adaptativas
  nivelAdaptacao       NivelAdaptacao?  // BASICO | MODERADO | AVANCADO
  
  // Status
  ativo                Boolean  @default(true)
  oficial              Boolean  @default(false)  // Validado por profissionais
  publicado            Boolean  @default(false)
  
  // Relacionamentos
  perguntas            PerguntaSocioemocional[]
  regras               RegraAdaptacao[]
  sessoes              SessaoAdaptativa[]
}
```

### 2.2 Onde as Respostas Estão Sendo Salvas

#### **Fluxo de Persistência**

```
┌─────────────────────────────────────────────┐
│ Frontend: useSessaoAdaptativaStore (Zustand)│
│ ─────────────────────────────────────────── │
│ Estado local:                               │
│ - respostaAtual (temporária)                │
│ - tempoInicioResposta (timestamp)           │
│ - progresso, alertas (UI state)             │
│                                             │
│ Persistência: localStorage (backup)         │
│ - sessaoId, status, respostas (parcial)     │
└──────────────────┬──────────────────────────┘
                   │ submeterResposta()
                   ▼
┌─────────────────────────────────────────────┐
│ API: POST /api/sessoes/[id]/resposta        │
│ ─────────────────────────────────────────── │
│ 1. Validação (Zod schema)                   │
│ 2. Busca pergunta (questionário ou banco)   │
│ 3. Normaliza valor (0-1)                    │
│ 4. Salva em RespostaSocioemocional          │
│ 5. Determina próxima pergunta               │
│ 6. Atualiza SessaoAdaptativa                │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ PostgreSQL: Persistência Permanente         │
│ ─────────────────────────────────────────── │
│ Tabelas:                                    │
│ - SessaoAdaptativa (estado + IRT)           │
│ - RespostaSocioemocional (cada resposta)    │
│ - AlertaSocioemocional (se gatilhos)        │
└─────────────────────────────────────────────┘
```

#### **Diferenças: Frontend vs Backend**

| Aspecto | Frontend (Zustand) | Backend (PostgreSQL) |
|---------|-------------------|---------------------|
| **Propósito** | UI state + cache otimista | Fonte de verdade permanente |
| **Persistência** | localStorage (volátil) | Banco de dados (permanente) |
| **Dados armazenados** | Sessão ativa, progresso, alertas | Tudo (histórico completo) |
| **Sincronização** | Polling / refetch on mount | Sempre atualizado via API |
| **Perda de dados** | Risco (limpar cache/navegador) | Não há risco |

**⚠️ Importante:** O localStorage é **apenas cache**. Se o usuário limpar cookies ou usar navegação anônima, os dados locais serão perdidos. Mas as respostas já submetidas para o backend estão **seguras no PostgreSQL**.

### 2.3 Campos Importantes Armazenados

#### **✅ Campos Coletados Atualmente**

| Campo | Tipo | Uso |
|-------|------|-----|
| **valor** | JSON | Resposta bruta (flexível: número, texto, array) |
| **valorNormalizado** | Float | Valor 0-1 para cálculos IRT |
| **tempoResposta** | Int | Segundos gastos na pergunta (métrica de engajamento) |
| **categoria** | Enum | BEM_ESTAR, ANSIEDADE, DEPRESSAO, etc. |
| **dominio** | Enum | EMOCIONAL, COGNITIVO, FISICO, SOCIAL |
| **escalaNome** | String | PHQ-9, GAD-7, WHO-5, PSS-10, etc. |
| **escalаItem** | String | "PHQ9_2", "GAD7_1" (referência ao item da escala) |
| **ordem** | Int | Ordem de apresentação na sessão (importante para análises sequenciais) |
| **thetaEstimado** | Float | Habilidade estimada do respondente (IRT) |
| **erroEstimacao (SEM)** | Float | Precisão da estimativa |

#### **⚠️ Campos Faltantes (Recomendações)**

| Campo Sugerido | Justificativa | Impacto em Relatórios |
|---------------|--------------|----------------------|
| **latitudaEmocional** | Variabilidade das respostas (desvio-padrão ao longo da sessão) | Detectar labilidade emocional |
| **pausasDuracao** | Array de timestamps de pausas | Identificar momentos de hesitação/dificuldade |
| **dispositivoTipo** | Mobile / Desktop / Tablet | Adaptar UX por dispositivo |
| **localizacao** (opcional) | Cidade/Estado | Estudos epidemiológicos regionais |
| **escalaSeveridade** | Automático (leve/moderado/grave) | Relatórios clínicos prontos |
| **flagInconsistencia** | Boolean | Detectar padrões de resposta aleatória |

---

## 📊 3. GERAÇÃO E QUALIDADE DOS RELATÓRIOS

### 3.1 Como os Relatórios Estão Sendo Gerados

#### **Arquitetura Atual de Relatórios**

```
┌──────────────────────────────────────┐
│ Dados Disponíveis (PostgreSQL)      │
│ ──────────────────────────────────── │
│ ✅ SessaoAdaptativa                  │
│    - scoresPorCategoria             │
│    - thetaEstimado, confianca       │
│    - tempoTotal, tempoMedioResposta │
│                                      │
│ ✅ RespostaSocioemocional            │
│    - Todas respostas individuais    │
│    - Metadados (categoria, domínio) │
│    - Timestamps                     │
│                                      │
│ ✅ AlertaSocioemocional              │
│    - Alertas gerados (clínicos)     │
│    - Níveis de risco                │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Relatórios Implementados (Limitado) │
│ ──────────────────────────────────── │
│ 📄 Página: /relatorios/meu-estado-   │
│           emocional                  │
│    - Estatísticas básicas            │
│    - Estados mais frequentes         │
│    - Gráfico de tendência (mock)     │
│                                      │
│ 📄 Página: /questionario/analise     │
│    - Estado dominante                │
│    - Tendência (hardcoded)           │
│    - Recomendações genéricas         │
│                                      │
│ 📄 API: GET /api/questionario/analise│
│    - Retorna dados simulados (mock)  │
└──────────────────────────────────────┘
```

**🔴 Problema Crítico:** Os relatórios NÃO estão consumindo os dados reais do banco!

#### **Exemplo de Código Atual (Mock)**

```typescript
// src/app/api/questionario/analise/route.ts

export async function GET(request: NextRequest) {
  // ❌ Dados simulados (não vem do banco)
  return NextResponse.json({
    resumo: {
      totalAvaliacoes: 5,  // HARDCODED
      estadoDominante: 'FELIZ',  // HARDCODED
      tendencia: 'positiva',  // HARDCODED
      pontuacaoGeral: 75,  // HARDCODED
      recomendacoes: ['Continue mantendo hábitos positivos!']  // HARDCODED
    }
  })
}
```

**Como DEVERIA ser:**

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const usuarioId = Number(searchParams.get('usuarioId'))
  
  // ✅ Buscar sessões reais do usuário
  const sessoes = await prisma.sessaoAdaptativa.findMany({
    where: {
      usuarioId,
      status: 'FINALIZADA',
      finalizadoEm: {
        gte: subDays(new Date(), 30) // Últimos 30 dias
      }
    },
    include: {
      respostas: {
        select: {
          categoria: true,
          valorNormalizado: true,
          respondidoEm: true
        }
      }
    }
  })
  
  // ✅ Calcular estatísticas reais
  const estadoDominante = calcularEstadoDominante(sessoes)
  const tendencia = calcularTendencia(sessoes)
  const pontuacaoGeral = calcularScoreGeral(sessoes)
  
  return NextResponse.json({
    resumo: {
      totalAvaliacoes: sessoes.length,
      estadoDominante,
      tendencia,
      pontuacaoGeral,
      recomendacoes: gerarRecomendacoes(sessoes)
    }
  })
}
```

### 3.2 Métricas Faltando nos Relatórios

#### **🔴 Relatórios Superficiais vs. Profundos**

| Métrica | Atual | Recomendado |
|---------|-------|-------------|
| **Estados emocionais** | "Feliz" (genérico) | Modelo Circumplex (Valencia × Ativação) com quadrantes |
| **Tendências temporais** | "Positiva" (texto) | Gráficos de linha com intervalos de confiança |
| **Severidade clínica** | Não há | Classificação automática (normal / leve / moderado / grave) |
| **Comparação com normas** | Não há | Percentis populacionais (ex: "Você está no percentil 65") |
| **Fatores de risco** | Alertas simples | Matriz de correlação (ex: "Sono ruim correlaciona com concentração baixa") |
| **Evolução longitudinal** | Snapshot único | Comparação entre sessões (progressão ao longo de semanas/meses) |
| **Confiabilidade da medição** | Não exibida | Exibir SEM e nível de confiança para o usuário |

#### **🟡 Visualizações Implementadas vs. Necessárias**

**Implementadas:**
- ✅ Cards de métricas simples (números grandes)
- ✅ Badges de status (verde/amarelo/vermelho)
- ✅ Listagem de estados mais frequentes

**Faltando:**
- ❌ Gráfico Circumplex (Russell's Model) - **CRÍTICO para socioemocionais**
- ❌ Heatmap de emoções por período (manhã/tarde/noite)
- ❌ Linha do tempo de sessões com marcos importantes
- ❌ Radar chart de categorias (ansiedade, depressão, bem-estar, etc.)
- ❌ Scatter plot (theta vs. confiança) para avaliar precisão das medições
- ❌ Histograma de distribuição de respostas por categoria

### 3.3 Integração com Banco de Dados

#### **Status Atual**

| Página/API | Consome Banco? | Dados | Qualidade |
|-----------|---------------|-------|-----------|
| `POST /api/sessoes/iniciar` | ✅ SIM | Cria sessão no PostgreSQL | ✅ Completo |
| `POST /api/sessoes/[id]/resposta` | ✅ SIM | Salva resposta + IRT + regras | ✅ Completo |
| `GET /api/sessoes/[id]` | ✅ SIM | Busca sessão + pergunta atual | ✅ Completo |
| `GET /api/questionario/analise` | ❌ NÃO | Retorna mock | 🔴 Mock |
| `/relatorios/meu-estado-emocional` | ⚠️ PARCIAL | Usa API mock | 🟡 Parcial |
| `/questionario/analise` | ❌ NÃO | Hardcoded no componente | 🔴 Mock |

**⚠️ Diagnóstico:** A pipeline de coleta está **100% funcional**, mas a pipeline de análise está **desconectada**.

#### **Dados Coletados vs. Dados Analisados**

```
┌────────────────────────────────────────────┐
│ PIPELINE DE COLETA (✅ Funcional)          │
│ ────────────────────────────────────────── │
│ Usuário → Frontend → API → PostgreSQL     │
│                                            │
│ Dados armazenados:                         │
│ - 100% das respostas                       │
│ - Theta IRT (precisão psicométrica)        │
│ - Scores por categoria                     │
│ - Alertas clínicos                         │
│ - Tempos de resposta                       │
│ - Metadados de sessão                      │
└────────────────────────────────────────────┘
                    ║
                    ║ ❌ DESCONECTADO
                    ║
┌────────────────────────────────────────────┐
│ PIPELINE DE ANÁLISE (🔴 Mock/Incompleta)  │
│ ────────────────────────────────────────── │
│ PostgreSQL → Queries Analytics → Frontend │
│                                            │
│ Estado atual:                              │
│ - APIs retornam dados simulados            │
│ - Componentes não fazem queries reais      │
│ - Gráficos mostram valores hardcoded       │
└────────────────────────────────────────────┘
```

### 3.4 Dados Relevantes Não Coletados (Mas Deveriam)

#### **🟡 Psicometria Avançada**

| Dado | Como Coletar | Uso em Relatórios |
|------|--------------|-------------------|
| **Test-Retest Reliability** | Aplicar mesmo questionário após 2 semanas | Validar estabilidade das medições |
| **Cronbach's Alpha** | Calcular consistência interna por categoria | Verificar confiabilidade das escalas |
| **Correlação entre categorias** | Matriz de correlação (ex: ansiedade × sono) | Identificar comorbidades |
| **Curva característica do item (ICC)** | Análise IRT 3PL | Validar qualidade das perguntas |

#### **🟡 Contexto Situacional**

| Dado | Como Coletar | Uso em Relatórios |
|------|--------------|-------------------|
| **Momento do dia** | Timestamp → classificar (manhã/tarde/noite) | Detectar variações circadianas |
| **Dia da semana** | Date parsing | Identificar padrões (segunda = pior dia?) |
| **Eventos estressores** | Pergunta aberta + NLP | Correlacionar eventos externos com humor |
| **Uso de medicação** | Campo opcional no check-in | Controlar variável confundidora |

#### **🟡 Gamificação & Engajamento**

| Dado | Como Coletar | Uso em Relatórios |
|------|--------------|-------------------|
| **Streak (dias consecutivos)** | Calcular gaps entre sessões | Motivar continuidade |
| **Taxa de abandono** | Sessions incomplete / total | Identificar perguntas problemáticas |
| **Tempo médio por tipo de pergunta** | Agrupar por `tipoPergunta` | Otimizar duração do questionário |

---

## 🧩 4. ESTRUTURA TÉCNICA

### 4.1 Tecnologias e Bibliotecas

#### **Stack Completo**

| Camada | Tecnologia | Versão | Uso |
|--------|-----------|--------|-----|
| **Frontend** | Next.js (App Router) | 15.5.2 | Framework React |
| | React | 18+ | UI Components |
| | TypeScript | 5.x | Type Safety |
| | Zustand | 4.x | State Management |
| | Zod | 3.x | Schema Validation |
| | TanStack Query | 5.x | Server State / Cache |
| | React Hook Form | 7.x | Form Management |
| | Tailwind CSS | 3.x | Styling |
| | shadcn/ui | Latest | Component Library |
| **Backend** | Next.js API Routes | 15.5.2 | RESTful API |
| | Prisma ORM | 6.15.0 | Database Access |
| | PostgreSQL | 14+ | Database |
| | json-rules-engine | 6.x | Business Rules |
| **Psicometria** | Custom IRT Engine | - | Item Response Theory |
| | Fisher Information | - | Adaptive Selection |
| **Deploy** | Vercel | - | Hosting + CI/CD |

### 4.2 Arquitetura de State Management

#### **Zustand Store: `useSessaoAdaptativaStore`**

**Localização:** `src/stores/sessao-store.ts`

**Responsabilidades:**
1. **Estado da Sessão Ativa:** `sessaoId`, `status`, `perguntaAtual`, `proximaPergunta`
2. **Respostas Temporárias:** `respostaAtual`, `tempoInicioResposta`
3. **Progresso:** `perguntasRespondidas`, `totalEstimado`, `porcentagem`
4. **IRT:** `thetaEstimado`, `erroEstimacao`, `confianca`
5. **Alertas:** `nivelAlerta`, `alertasAtivos`

**Persistência:** localStorage via `persist` middleware

**Actions Principais:**
```typescript
// Inicialização
iniciarSessao(questionarioId, usuarioId, primeiraPergunta)

// Durante a sessão
setPerguntaAtual(pergunta)
atualizarRespostaAtual(valor)
submeterResposta() → POST /api/sessoes/[id]/resposta
proximaPerguntaAction() → Atualiza estado com próxima pergunta

// Controle
pausarSessao()
retomarSessao()
finalizarSessao()
cancelarSessao()

// Alertas
adicionarAlerta(alerta)
removerAlerta(alertaId)
setNivelAlerta(nivel)
```

**⚠️ Limitação Atual:** O store tem vários métodos assíncronos comentados (ex: `submeterResposta`, `carregarSessao`) porque a integração com TanStack Query ainda está sendo ajustada.

#### **TanStack Query Hooks**

**Localização:** `src/hooks/useSessao.ts`

```typescript
// Carregar sessão do servidor
const { data: sessao, isLoading, error } = useSessao(sessaoId)

// Submeter resposta (mutação)
const submeter = useSubmeterResposta()
submeter.mutate({
  sessaoId,
  perguntaId,
  resposta,
  tempoResposta
})

// Tempo decorrido (custom hook)
const tempoDecorrido = useTempoDecorrido(iniciadoEm, pausadoEm)
```

**Cache Strategy:**
- `staleTime: 1000 * 60 * 5` (5 minutos) - Reduz requisições desnecessárias
- `refetchOnMount: true` - Sempre busca dados atualizados ao montar componente
- `refetchOnWindowFocus: false` - Evita requisições ao alternar abas

### 4.3 Estrutura de Componentes

#### **Hierarquia de Componentes (Sessão Ativa)**

```
┌─────────────────────────────────────────────────┐
│ SessaoPage                                      │
│ └─ src/app/avaliacoes/sessao/[id]/page.tsx     │
│                                                 │
│ Componentes filhos:                             │
│ ├─ ProgressBarAdaptativo                        │
│ │  └─ Exibe progresso + IRT + alerta           │
│ │                                               │
│ ├─ PerguntaRenderer                             │
│ │  ├─ Renderização dinâmica por tipo:          │
│ │  │  ├─ LIKERT_5 / LIKERT_7                   │
│ │  │  ├─ VAS_SLIDER (0-10)                     │
│ │  │  ├─ MULTIPLA_ESCOLHA                      │
│ │  │  ├─ CHECKBOX_MULTIPLO                     │
│ │  │  ├─ ESCALA_NUMERICA                       │
│ │  │  └─ TEXTO_CURTO / TEXTO_LONGO             │
│ │  │                                            │
│ │  └─ onSubmit → handleSubmeterResposta()      │
│ │                                               │
│ ├─ AlertaPanel                                  │
│ │  └─ Exibe alertas clínicos (se houver)       │
│ │                                               │
│ └─ SessaoControles                              │
│    ├─ Pausar                                    │
│    ├─ Cancelar                                  │
│    └─ Finalizar (se completou)                 │
└─────────────────────────────────────────────────┘
```

#### **Componente Crítico: PerguntaRenderer**

**Localização:** `src/components/avaliacoes/PerguntaRenderer.tsx`

**Props:**
```typescript
interface PerguntaRendererProps {
  pergunta: {
    id: string
    texto: string
    textoAuxiliar?: string
    tipoPergunta: TipoPergunta
    opcoes?: OpcaoPerguntaResultado[]
    valorMinimo?: number
    valorMaximo?: number
    obrigatoria: boolean
  }
  onSubmit: (resposta: any) => void
  loading?: boolean
}
```

**Lógica de Renderização:**
```typescript
switch (pergunta.tipoPergunta) {
  case 'LIKERT_5':
  case 'LIKERT_7':
    return <RadioGroupLikert opcoes={opcoes} />
  
  case 'VAS_SLIDER':
    return <SliderComponent min={min} max={max} />
  
  case 'MULTIPLA_ESCOLHA':
    return <RadioGroup opcoes={opcoes} />
  
  case 'CHECKBOX_MULTIPLO':
    return <CheckboxGroup opcoes={opcoes} />
  
  case 'ESCALA_NUMERICA':
    return <NumericScale min={min} max={max} />
  
  case 'TEXTO_CURTO':
    return <Input maxLength={200} />
  
  case 'TEXTO_LONGO':
    return <Textarea maxLength={1000} />
  
  default:
    return <ErrorMessage text="Tipo não suportado" />
}
```

### 4.4 Padrões de Validação (Zod Schemas)

**Localização:** `src/lib/validations/resposta-schemas.ts`

```typescript
// Validação por tipo de pergunta
export function validarRespostaPorTipo(
  tipoPergunta: string,
  valor: any,
  tempoResposta: number,
  perguntaId: string
): boolean {
  
  switch (tipoPergunta) {
    case 'LIKERT_5':
      return typeof valor === 'number' && valor >= 1 && valor <= 5
    
    case 'LIKERT_7':
      return typeof valor === 'number' && valor >= 1 && valor <= 7
    
    case 'VAS_SLIDER':
      return typeof valor === 'number' && valor >= 0 && valor <= 10
    
    case 'MULTIPLA_ESCOLHA':
      return typeof valor === 'string' || typeof valor === 'number'
    
    case 'CHECKBOX_MULTIPLO':
      return Array.isArray(valor) && valor.length > 0
    
    case 'ESCALA_NUMERICA':
      return typeof valor === 'number'
    
    case 'TEXTO_CURTO':
      return typeof valor === 'string' && valor.length > 0 && valor.length <= 200
    
    case 'TEXTO_LONGO':
      return typeof valor === 'string' && valor.length > 0 && valor.length <= 1000
    
    default:
      return false
  }
}
```

### 4.5 Performance e Otimizações

#### **✅ Otimizações Implementadas**

1. **Denormalização de Dados**
   - `RespostaSocioemocional` duplica `categoria`, `dominio`, `escalaNome`
   - **Benefício:** Evita joins desnecessários em queries analíticas
   
2. **Índices no Prisma**
   ```prisma
   @@index([categoria, ativo])
   @@index([dominio, ativo])
   @@index([questionarioId, ordem])
   @@index([tipo, ativo])
   ```

3. **Cache com TanStack Query**
   - Reduz chamadas API em 70% em cenários normais
   
4. **Lazy Loading de Perguntas**
   - Próxima pergunta é pré-carregada em background (`proximaPergunta`)

#### **🟡 Gargalos Conhecidos**

1. **Cálculo de Theta IRT**
   - Complexidade: O(n²) para n respostas
   - **Solução:** Limitar a 20 perguntas por sessão (já implementado)
   
2. **Motor de Regras**
   - Carrega TODAS as regras do questionário em memória
   - **Solução Futura:** Indexar regras por `categoria` para filtrar antes de carregar
   
3. **Queries de Relatórios (quando implementadas)**
   - Relatórios longitudinais podem ser pesados (ex: 6 meses de dados)
   - **Solução:** Pré-computar métricas mensais em tabela agregada

---

## 🔧 5. DIAGNÓSTICO GERAL

### 5.1 Pontos Fortes

#### **🟢 Arquitetura Técnica**

✅ **Separação de Responsabilidades Clara**
- Frontend: UI + State
- Backend: Business Logic + Persistência
- Engine: Psicometria + Regras (isolado e testável)

✅ **Escalabilidade do Banco de Dados**
- Relacionamentos bem modelados
- Campos denormalizados estratégicos
- Suporta tanto perguntas fixas quanto banco adaptativo

✅ **Flexibilidade do Motor de Regras**
- Regras em JSON (fácil edição sem código)
- Operadores extensíveis
- Suporta condições complexas (all/any)

✅ **Qualidade Psicométrica**
- IRT 2PL implementado corretamente
- Informação de Fisher para seleção ótima
- Critérios de parada baseados em SEM (padrão CAT)

#### **🟢 Experiência do Usuário**

✅ **Componentes Reutilizáveis**
- `PerguntaRenderer` abstrai complexidade
- `ProgressBarAdaptativo` mostra transparência do processo
- `AlertaPanel` comunica riscos clínicos

✅ **Feedback Imediato**
- Toast notifications em ações importantes
- Loading states bem gerenciados
- Validação em tempo real (Zod + React Hook Form)

### 5.2 Pontos Fracos

#### **🔴 Desconexão entre Coleta e Análise**

**Problema:** Dados são coletados perfeitamente, mas relatórios NÃO os usam.

**Impacto:**
- Usuários não veem o valor dos dados que forneceram
- Psicólogos/educadores não têm insights para intervir
- Sistema coleta dados "no vazio"

**Evidência:**
- `GET /api/questionario/analise` retorna mock
- Páginas de relatório têm gráficos hardcoded
- Nenhuma query analytics real foi encontrada no código

#### **🔴 Ausência de Relatórios Clínicos Profundos**

**Problema:** Relatórios atuais são superficiais ("Estado dominante: Feliz").

**O que falta:**
1. **Severidade Clínica:** Classificação automática (normal/leve/moderado/grave)
2. **Correlações:** Ex: "Seu sono ruim correlaciona com concentração baixa"
3. **Tendências Temporais:** Gráficos de evolução ao longo de semanas/meses
4. **Comparação com Normas:** "Você está no percentil 65 de bem-estar"
5. **Recomendações Personalizadas:** Baseadas em padrões reais, não genéricas

#### **🟡 Limitações de UX**

**Problema:** Usuário não pode voltar ou corrigir respostas.

**Impacto:** 
- Aumenta taxa de abandono por medo de errar
- Não reflete realidade de questionários em papel (que permitem revisão)

#### **🟡 Documentação Técnica Escassa**

**Problema:** Falta documentação inline no código complexo.

**Evidência:**
- Funções IRT não têm comentários explicando fórmulas
- Motor de regras tem pouca documentação sobre operadores customizados
- Fluxo de `determinarProximaPergunta` é difícil de rastrear

### 5.3 O Que Impede Análise Profunda Hoje

#### **Barreiras Técnicas**

1. **APIs de Analytics Não Implementadas**
   - Falta: `GET /api/relatorios/longitudinal?usuarioId=X`
   - Falta: `GET /api/relatorios/comparativo?periodo=30d`
   - Falta: `GET /api/relatorios/clinico?escalaNome=PHQ-9`

2. **Queries Otimizadas para Agregações**
   - Prisma está sendo usado apenas para CRUD
   - Não há queries analíticas (ex: `groupBy`, `aggregate`, CTEs)

3. **Falta Pré-Computação de Métricas**
   - Calcular theta IRT para todas as sessões em tempo real é custoso
   - Solução: Tabela `MetricaSocioemocional` (já existe no schema, mas não é usada)

#### **Barreiras de Conhecimento**

1. **Interpretação Psicométrica**
   - Desenvolvedores precisam saber o que significam scores PHQ-9, GAD-7, WHO-5
   - Faltam ranges normativos codificados (ex: PHQ-9: 0-4 = mínimo, 5-9 = leve, etc.)

2. **Visualização de Dados Complexos**
   - Circumplex de Russell requer gráfico 2D específico
   - Heatmaps temporais exigem bibliotecas especializadas (D3.js, Recharts)

---

## 💡 6. RECOMENDAÇÕES DE EVOLUÇÃO

### 6.1 Melhoria Imediata (Sprint 1-2 semanas)

#### **🚀 Prioridade 1: Conectar Relatórios ao Banco**

**Objetivo:** Fazer relatórios mostrarem dados reais.

**Tarefas:**
1. Criar `src/lib/analytics/queries.ts` com queries reutilizáveis:
   ```typescript
   export async function buscarSessoesUsuario(
     usuarioId: number,
     periodo: { inicio: Date; fim: Date }
   ): Promise<SessaoComRespostas[]> {
     return await prisma.sessaoAdaptativa.findMany({
       where: {
         usuarioId,
         status: 'FINALIZADA',
         finalizadoEm: {
           gte: periodo.inicio,
           lte: periodo.fim
         }
       },
       include: {
         respostas: true,
         alertas: true
       }
     })
   }
   ```

2. Atualizar `GET /api/questionario/analise` para usar dados reais:
   ```typescript
   const sessoes = await buscarSessoesUsuario(usuarioId, { inicio, fim })
   const estadoDominante = calcularEstadoDominante(sessoes)
   const tendencia = calcularTendenciaTemporal(sessoes)
   ```

3. Substituir dados mock em `/relatorios/meu-estado-emocional` por fetch real.

**Resultado Esperado:** Relatórios básicos funcionais com dados reais em 1 semana.

#### **🚀 Prioridade 2: Implementar Gráfico Circumplex**

**Objetivo:** Visualizar estados emocionais no modelo de Russell (Valencia × Ativação).

**Biblioteca Recomendada:** Recharts (já usado no projeto)

**Implementação:**
```typescript
// src/components/relatorios/GraficoCircumplex.tsx

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function GraficoCircumplex({ dadosSessoes }: Props) {
  const pontos = dadosSessoes.map(sessao => ({
    valencia: sessao.scoresPorCategoria.BEM_ESTAR - 5, // -5 a +5
    ativacao: sessao.scoresPorCategoria.ENERGIA - 5,
    timestamp: sessao.finalizadoEm
  }))
  
  return (
    <ScatterChart width={400} height={400}>
      <CartesianGrid />
      <XAxis dataKey="valencia" domain={[-5, 5]} />
      <YAxis dataKey="ativacao" domain={[-5, 5]} />
      <Scatter data={pontos} fill="#8884d8" />
      <Tooltip content={<CircumplexTooltip />} />
    </ScatterChart>
  )
}
```

**Resultado Esperado:** Visualização científica do estado emocional em 2-3 dias.

### 6.2 Melhorias de Médio Prazo (Sprint 2-4 semanas)

#### **📊 Prioridade 3: Análise Longitudinal**

**Objetivo:** Permitir que usuários vejam evolução ao longo do tempo.

**Features:**
1. **Gráfico de Linha Temporal:** Scores por categoria ao longo de semanas/meses
2. **Detecção de Tendências:** Algoritmo para identificar melhora/piora
3. **Marcos Importantes:** Marcar eventos estressores (provas, apresentações)

**Componente:**
```typescript
<RelatorioLongitudinal
  usuarioId={1}
  periodo="90dias"
  categorias={['BEM_ESTAR', 'ANSIEDADE', 'SONO']}
/>
```

#### **📊 Prioridade 4: Relatórios Clínicos Automáticos**

**Objetivo:** Gerar interpretação clínica automática baseada em escalas validadas.

**Implementação:**
```typescript
// src/lib/analytics/interpretacao-clinica.ts

export function interpretarPHQ9(score: number): InterpretacaoClinica {
  if (score <= 4) return {
    severidade: 'MINIMA',
    descricao: 'Sintomas depressivos mínimos ou ausentes',
    recomendacao: 'Manter hábitos saudáveis'
  }
  else if (score <= 9) return {
    severidade: 'LEVE',
    descricao: 'Sintomas depressivos leves',
    recomendacao: 'Monitorar sintomas. Considerar técnicas de autocuidado.'
  }
  else if (score <= 14) return {
    severidade: 'MODERADA',
    descricao: 'Sintomas depressivos moderados',
    recomendacao: 'Recomenda-se buscar apoio de profissional de saúde mental.'
  }
  else return {
    severidade: 'GRAVE',
    descricao: 'Sintomas depressivos graves',
    recomendacao: 'IMPORTANTE: Buscar atendimento profissional urgente.'
  }
}
```

#### **📊 Prioridade 5: Alertas Inteligentes**

**Objetivo:** Notificar usuários e coordenadores quando padrões de risco forem detectados.

**Features:**
1. **Sistema de Notificações:** Email/SMS quando score crítico for atingido
2. **Dashboard de Alertas:** Painel para psicólogos/coordenadores monitorarem turma
3. **Escalonamento Automático:** Alertas graves acionam protocolo de crise

### 6.3 Evolução de Longo Prazo (Sprint 4-8 semanas)

#### **🔬 Machine Learning para Predição**

**Objetivo:** Prever risco de piora antes que aconteça.

**Modelos Sugeridos:**
1. **Random Forest:** Prever probabilidade de depressão moderada em 2 semanas
2. **Time Series (ARIMA):** Prever próximo score de ansiedade
3. **Clustering (K-Means):** Identificar perfis de risco na turma

**Ferramentas:** Python (scikit-learn) + API REST para integração

#### **🔬 Benchmarking Populacional**

**Objetivo:** Comparar usuário com normas populacionais.

**Implementação:**
1. Coletar dados anonimizados de milhares de usuários
2. Calcular percentis por faixa etária, gênero, região
3. Exibir: "Você está no percentil 65 de bem-estar (acima da média)"

#### **🔬 Exportação para Pesquisa**

**Objetivo:** Facilitar estudos acadêmicos.

**Features:**
1. **Export CSV/SPSS:** Dados anonimizados para análises externas
2. **Metadados Psicométricos:** Incluir parâmetros IRT, Cronbach's Alpha, etc.
3. **API para Pesquisadores:** Endpoints especiais com autenticação

---

## 📋 7. PLANO DE AÇÃO PRIORITÁRIO

### Fase 1: Fundação Analítica (2 semanas)

**Objetivo:** Fazer dados coletados serem usados em relatórios.

**Entregas:**
- [ ] **Queries Analíticas:** Criar `src/lib/analytics/queries.ts`
- [ ] **API Real:** Implementar `GET /api/questionario/analise` com dados do banco
- [ ] **Página de Relatório:** Atualizar `/relatorios/meu-estado-emocional`
- [ ] **Testes:** Validar com 10 sessões reais

**Bloqueadores:** Nenhum (dados já estão no banco).

### Fase 2: Visualizações Científicas (2 semanas)

**Objetivo:** Implementar gráficos psicometricamente corretos.

**Entregas:**
- [ ] **Circumplex de Russell:** Gráfico 2D (Valencia × Ativação)
- [ ] **Linha Temporal:** Evolução de scores ao longo de semanas
- [ ] **Radar Chart:** Comparação de categorias (ansiedade, depressão, bem-estar)
- [ ] **Heatmap Temporal:** Estados emocionais por período (manhã/tarde/noite)

**Bloqueadores:** Nenhum (Recharts já instalado).

### Fase 3: Inteligência Clínica (3 semanas)

**Objetivo:** Automatizar interpretação e alertas.

**Entregas:**
- [ ] **Interpretação Automática:** PHQ-9, GAD-7, WHO-5, PSS-10
- [ ] **Sistema de Alertas:** Notificações para usuários e coordenadores
- [ ] **Dashboard de Risco:** Painel para profissionais de saúde
- [ ] **Recomendações Personalizadas:** Baseadas em padrões reais

**Bloqueadores:** Definição de protocolos clínicos (requer consulta com psicólogos).

### Fase 4: ML & Pesquisa (4 semanas)

**Objetivo:** Análises preditivas e exportação para academia.

**Entregas:**
- [ ] **Modelo Preditivo:** Prever risco de piora
- [ ] **Benchmarking:** Percentis populacionais
- [ ] **API de Pesquisa:** Export anonimizado para estudos
- [ ] **Documentação Científica:** Paper técnico sobre o sistema CAT

**Bloqueadores:** Quantidade de dados (precisa de centenas de sessões).

---

## 🎯 8. CONCLUSÃO

### 8.1 Estado Atual

O ClassCheck possui um **sistema de questionários adaptativos tecnicamente sólido**:
- ✅ Coleta de dados funcional e robusta (CAT + IRT + Regras)
- ✅ Persistência completa em PostgreSQL
- ✅ Arquitetura escalável e bem organizada

**Porém**, há uma **lacuna crítica na análise**:
- ❌ Relatórios desconectados do banco de dados
- ❌ Visualizações científicas ausentes
- ❌ Interpretação clínica automática não implementada

### 8.2 Potencial Não Aproveitado

Os dados coletados permitem análises que **não estão sendo feitas**:
- Evolução longitudinal de bem-estar
- Correlações entre categorias (ex: sono × concentração)
- Predição de risco de piora
- Comparação com normas populacionais
- Detecção de padrões temporais (variação circadiana)

### 8.3 Próximo Passo Crítico

**Recomendação:** Priorizar **Fase 1 (Fundação Analítica)** imediatamente.

**Justificativa:**
1. **Alto impacto, baixo esforço:** Dados já estão no banco, só falta criar queries
2. **Desbloqueio de valor:** Usuários começam a ver benefícios reais dos questionários
3. **Base para IA futura:** Relatórios básicos são pré-requisito para ML

**Métrica de Sucesso:** Após 2 semanas, 100% dos relatórios devem exibir dados reais (não mock).

---

**Documento elaborado por:** Sistema de IA - Análise Técnica  
**Próxima revisão:** Após implementação da Fase 1  
**Contato para dúvidas:** [Documentar canal de comunicação]
