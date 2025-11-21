# 📊 Modelo de Dados Analítico - ClassCheck v3.0

**Data:** 02/11/2025  
**Versão:** 1.0

---

## 🎯 Visão Geral

O modelo analítico do ClassCheck implementa um sistema de **agregação e pré-processamento** de métricas socioemocionais para otimizar consultas e análises longitudinais.

### Princípios

1. **Separação de Concerns**: Dados transacionais vs. dados analíticos
2. **Pré-agregação**: Cálculos pesados executados em background
3. **Granularidade Flexível**: Diária, semanal, mensal, trimestral, anual
4. **Versionamento**: Suporte a diferentes versões de cálculo

---

## 📐 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────┐
│         CAMADA TRANSACIONAL (OLTP)                  │
├─────────────────────────────────────────────────────┤
│  SessaoAdaptativa                                   │
│  RespostaSocioemocional                             │
│  AlertaSocioemocional                               │
│  LogAdaptativo                                      │
└─────────────────────────────────────────────────────┘
                       ↓
          ┌────────────────────────┐
          │  Serviço de Agregação  │
          │  (Background/Cron)     │
          └────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│         CAMADA ANALÍTICA (OLAP)                     │
├─────────────────────────────────────────────────────┤
│  MetricaSocioemocional (Pré-agregada)               │
│  HistoricoEmocional (Temporal)                      │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│         CAMADA DE APRESENTAÇÃO                      │
├─────────────────────────────────────────────────────┤
│  APIs de Relatórios                                 │
│  Exportações (CSV/JSON)                             │
│  Dashboards Visuais                                 │
└─────────────────────────────────────────────────────┘
```

---

## 🗄️ Modelo de Dados

### MetricaSocioemocional

Tabela central de agregação de métricas.

**Campos Principais:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `usuarioId` | Int | FK para Usuario |
| `categoria` | Enum | Categoria específica ou NULL (global) |
| `dominio` | Enum | Domínio emocional |
| `granularidade` | Enum | DIARIA, SEMANAL, MENSAL, TRIMESTRAL, ANUAL |
| `periodoInicio` | DateTime | Início do período |
| `periodoFim` | DateTime | Fim do período |

**Métricas de Score:**

| Campo | Descrição |
|-------|-----------|
| `scoreMinimo` | Menor score no período |
| `scoreMaximo` | Maior score no período |
| `scoreMedio` | Média aritmética |
| `scoreMediana` | Valor mediano |
| `desvioPadrao` | Desvio padrão |

**Métricas IRT:**

| Campo | Descrição |
|-------|-----------|
| `thetaMedio` | Habilidade média estimada (IRT) |
| `thetaMinimo` | Menor theta |
| `thetaMaximo` | Maior theta |
| `confiancaMedia` | Confiança média das estimativas |

**Modelo Circumplex:**

| Campo | Descrição |
|-------|-----------|
| `valenciaMedia` | Valência média (-1 a 1) |
| `ativacaoMedia` | Ativação média (-1 a 1) |

**Estatísticas:**

| Campo | Descrição |
|-------|-----------|
| `totalSessoes` | Sessões concluídas |
| `totalRespostas` | Respostas registradas |
| `taxaResposta` | % de questões respondidas |
| `tempoMedioResposta` | Média de tempo (segundos) |

**Tendências:**

| Campo | Descrição |
|-------|-----------|
| `tendencia` | ASCENDENTE, ESTAVEL, DESCENDENTE |
| `variacaoPercent` | % de mudança vs. período anterior |

**Alertas:**

| Campo | Descrição |
|-------|-----------|
| `alertasVermelhos` | Contagem de alertas críticos |
| `alertasLaranjas` | Contagem de alertas moderados |
| `alertasAmarelos` | Contagem de alertas leves |

**Escalas Clínicas:**

| Campo | Descrição |
|-------|-----------|
| `scorePHQ9` | Patient Health Questionnaire-9 |
| `scoreGAD7` | Generalized Anxiety Disorder-7 |
| `scoreWHO5` | WHO-5 Well-Being Index |

---

## 🔄 Processo de Agregação

### Fluxo de Trabalho

```
1. Trigger (Cron ou Manual)
   ↓
2. Buscar sessões do período
   ↓
3. Calcular estatísticas por categoria
   ↓
4. Calcular métricas IRT
   ↓
5. Calcular modelo Circumplex
   ↓
6. Contar alertas
   ↓
7. Comparar com período anterior (tendência)
   ↓
8. Upsert em MetricaSocioemocional
```

### Frequência Recomendada

| Granularidade | Frequência de Execução |
|---------------|------------------------|
| DIARIA | Diariamente às 02:00 |
| SEMANAL | Segundas-feiras às 03:00 |
| MENSAL | Primeiro dia do mês às 04:00 |
| TRIMESTRAL | Primeiro dia do trimestre às 05:00 |
| ANUAL | 1º de janeiro às 06:00 |

---

## 📊 Cálculos Estatísticos

### Média, Mediana, Desvio Padrão

```typescript
// Média
media = Σ(valores) / n

// Mediana
valores_ordenados = sort(valores)
mediana = valores_ordenados[n/2]

// Desvio Padrão
variancia = Σ((valor - media)²) / n
desvioPadrao = √variancia
```

### Tendência

```typescript
variacao = ((mediaAtual - mediaAnterior) / mediaAnterior) * 100

if (|variacao| >= 10) {
  tendencia = variacao > 0 ? 'ASCENDENTE' : 'DESCENDENTE'
} else {
  tendencia = 'ESTAVEL'
}
```

---

## 🔌 APIs Disponíveis

### POST /api/relatorios/agregar

**Descrição:** Executa agregação de métricas

**Body:**
```json
{
  "usuarioId": 1,
  "granularidade": "SEMANAL",
  "dataReferencia": "2025-11-02",
  "todosUsuarios": false
}
```

**Resposta:**
```json
{
  "mensagem": "Agregação concluída com sucesso",
  "usuarioId": 1,
  "granularidade": "SEMANAL",
  "dataReferencia": "2025-11-02T00:00:00.000Z"
}
```

### GET /api/relatorios/agregar

**Descrição:** Verifica status das agregações

**Query Params:**
- `usuarioId` (opcional): Filtrar por usuário

**Resposta:**
```json
{
  "totalMetricas": 150,
  "ultimaAgregacao": {
    "data": "2025-11-02T03:00:00.000Z",
    "granularidade": "DIARIA",
    "periodo": {
      "inicio": "2025-11-01T00:00:00.000Z",
      "fim": "2025-11-01T23:59:59.999Z"
    }
  },
  "distribuicao": [
    { "granularidade": "DIARIA", "total": 90 },
    { "granularidade": "SEMANAL", "total": 40 },
    { "granularidade": "MENSAL", "total": 20 }
  ]
}
```

### GET /api/relatorios/export

**Descrição:** Exporta dados analíticos

**Query Params:**
- `usuarioId` (opcional): Filtrar por usuário
- `formato`: `csv` ou `json`
- `tipo`: `sessoes`, `metricas`, `alertas`, `completo`
- `dataInicio` (opcional): Data de início (ISO)
- `dataFim` (opcional): Data de fim (ISO)
- `categoria` (opcional): Categoria específica

**Exemplos:**

```bash
# Exportar sessões em CSV
GET /api/relatorios/export?usuarioId=1&formato=csv&tipo=sessoes&dataInicio=2025-10-01&dataFim=2025-10-31

# Exportar métricas em JSON
GET /api/relatorios/export?formato=json&tipo=metricas&categoria=ANSIEDADE

# Exportar relatório completo
GET /api/relatorios/export?usuarioId=1&formato=json&tipo=completo
```

---

## 🎨 Casos de Uso

### 1. Dashboard de Coordenador

**Objetivo:** Visualizar progresso de toda turma

**Queries:**
```typescript
// Métricas semanais de todos os alunos
const metricas = await prisma.metricaSocioemocional.findMany({
  where: {
    granularidade: 'SEMANAL',
    periodoInicio: { gte: startOfWeek(new Date()) }
  },
  include: { usuario: true }
});
```

### 2. Relatório Individual

**Objetivo:** Acompanhamento longitudinal do aluno

**Queries:**
```typescript
// Evolução mensal do aluno
const evolucao = await prisma.metricaSocioemocional.findMany({
  where: {
    usuarioId: 1,
    granularidade: 'MENSAL',
    categoria: null // Global
  },
  orderBy: { periodoInicio: 'asc' },
  take: 12 // Último ano
});
```

### 3. Alerta de Risco

**Objetivo:** Identificar alunos que precisam de suporte

**Queries:**
```typescript
// Alunos com alertas vermelhos recentes
const alunosRisco = await prisma.metricaSocioemocional.findMany({
  where: {
    granularidade: 'SEMANAL',
    periodoInicio: { gte: subWeeks(new Date(), 1) },
    alertasVermelhos: { gt: 0 }
  },
  include: { usuario: true }
});
```

### 4. Análise de Tendências

**Objetivo:** Detectar padrões de melhora ou piora

**Queries:**
```typescript
// Categorias em tendência descendente
const tendeciasNegativas = await prisma.metricaSocioemocional.findMany({
  where: {
    usuarioId: 1,
    tendencia: 'DESCENDENTE',
    variacaoPercent: { lt: -15 } // Queda > 15%
  }
});
```

---

## 🔧 Manutenção

### Reprocessamento de Métricas

Se houver alteração no algoritmo de cálculo:

```bash
# Reprocessar últimos 30 dias
POST /api/relatorios/agregar
{
  "todosUsuarios": true,
  "granularidade": "DIARIA",
  "dataReferencia": "2025-11-02"
}
```

### Limpeza de Dados Antigos

```sql
-- Remover métricas diárias > 90 dias
DELETE FROM metricas_socioemocionais
WHERE granularidade = 'DIARIA'
AND periodo_inicio < NOW() - INTERVAL '90 days';
```

---

## 📈 Performance

### Índices

```sql
-- Consultas por usuário e período
CREATE INDEX idx_metricas_usuario_periodo 
ON metricas_socioemocionais(usuario_id, periodo_inicio, periodo_fim);

-- Consultas por categoria
CREATE INDEX idx_metricas_categoria 
ON metricas_socioemocionais(categoria, periodo_inicio);

-- Consultas por granularidade
CREATE INDEX idx_metricas_granularidade 
ON metricas_socioemocionais(granularidade, periodo_inicio);
```

### Estimativas de Volume

| Granularidade | Registros/Usuário/Ano |
|---------------|------------------------|
| DIARIA | 365 |
| SEMANAL | 52 |
| MENSAL | 12 |
| TRIMESTRAL | 4 |
| ANUAL | 1 |

**Total estimado:** ~434 registros por usuário/ano

---

## 🚀 Próximos Passos

1. **Implementar Cron Jobs** - Automatizar agregações
2. **Cache de Consultas** - Redis para queries frequentes
3. **Análise Preditiva** - ML para prever riscos
4. **Benchmarking** - Comparar com médias da turma/escola
5. **Dashboards Interativos** - Visualizações em tempo real

---

**Documentação mantida por:** Equipe ClassCheck  
**Última atualização:** 02/11/2025
