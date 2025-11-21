# 📋 Plano de Melhorias: Questionários e Relatórios
## Sistema ClassCheck

**Data**: 21 de novembro de 2025  
**Versão**: 1.0  
**Responsável**: Sistema de Planejamento ClassCheck

---

## 📌 Visão Geral

Este documento apresenta um plano estratégico e prático para melhorar os **questionários adaptativos e não-adaptativos** e **relatórios** do sistema ClassCheck, migrando de dados mockados para dados reais do banco de dados.

---

## 🎯 Objetivos Principais

### 1. Questionários
- ✅ Completar implementação de questionários adaptativos com IRT
- ✅ Melhorar precisão e personalização das perguntas
- ✅ Otimizar algoritmo de seleção de perguntas
- ✅ Expandir banco de perguntas validado
- ✅ Implementar validação clínica automática

### 2. Relatórios
- ✅ Migrar todos os relatórios de dados mock para dados reais
- ✅ Implementar caching e otimização de queries
- ✅ Criar dashboard administrativo com métricas agregadas
- ✅ Adicionar relatórios específicos por role (Aluno, Professor, Admin)
- ✅ Implementar exportação avançada (PDF, Excel, CSV)

---

## 🔍 Análise da Situação Atual

### ✅ O que já está implementado:

#### Questionários:
- ✅ Sistema adaptativo com IRT (Item Response Theory)
- ✅ Modelo Circumplex de emoções (Valencia x Ativação)
- ✅ API de sessões (`/api/sessoes/iniciar`, `/api/sessoes/[id]/resposta`)
- ✅ Banco de perguntas (BancoPerguntasAdaptativo)
- ✅ Sistema de alertas socioemocionais
- ✅ Navegação reversa com recalibração de theta
- ✅ Logs adaptativos para auditoria

#### Relatórios:
- ✅ Componentes visuais avançados:
  - GraficoCircumplex
  - LinhaTemporalScores
  - HeatmapEmocional
  - RadarCategorias
  - MapaCalorEmocional
- ✅ API de exportação (CSV/JSON)
- ✅ Seed de dados mock para testes

### ⚠️ O que precisa melhorar:

#### Questionários:
- ❌ Banco de perguntas pequeno/incompleto
- ❌ Validação clínica das perguntas (psicólogos)
- ❌ Questionários não-adaptativos desatualizados
- ❌ Falta de personalização por contexto (aula, evento, check-in)
- ❌ Sistema de regras adaptativas pouco utilizado
- ❌ Performance do algoritmo IRT em sessões longas

#### Relatórios:
- ❌ Maioria dos dados é mockada
- ❌ Queries lentas sem otimização
- ❌ Falta de caching
- ❌ Relatórios para professor e admin incompletos
- ❌ Exportação PDF não implementada
- ❌ Dashboard administrativo básico
- ❌ Métricas agregadas não calculadas em background

---

## 📊 Parte 1: Melhorias em Questionários

### 1.1. Expansão do Banco de Perguntas

**Prioridade**: 🔴 Alta  
**Esforço**: 3-4 semanas  
**Dependências**: Consultoria com psicólogo educacional

#### Ações:

1. **Criar Perguntas Validadas por Escala Clínica**
   - [ ] PHQ-9 (9 perguntas para depressão)
   - [ ] GAD-7 (7 perguntas para ansiedade)
   - [ ] WHO-5 (5 perguntas para bem-estar)
   - [ ] PSS-10 (10 perguntas para estresse percebido)
   - [ ] Escala de Autoestima de Rosenberg (10 perguntas)
   - [ ] Escala de Solidão UCLA (3 perguntas versão curta)

2. **Criar Perguntas Contextuais Específicas**
   
   **Contexto: CHECK_IN_DIARIO**
   - 10-15 perguntas curtas (Likert 5)
   - Foco: humor atual, energia, qualidade do sono
   - Tempo: 1-2 minutos
   
   **Contexto: AULA**
   - 12-18 perguntas (mix de Likert e múltipla escolha)
   - Foco: engajamento, compreensão, estado emocional durante aula
   - Tempo: 3-5 minutos
   
   **Contexto: EVENTO**
   - 8-12 perguntas
   - Foco: impacto emocional de eventos especiais
   - Tempo: 2-3 minutos

3. **Script de População do Banco**
   ```bash
   # Criar seed especializado
   prisma/seed-banco-perguntas-completo.ts
   ```

#### Estrutura de Perguntas:

```typescript
// Exemplo: PHQ-9 Item 1
{
  codigo: "PHQ9_001",
  texto: "Nas últimas 2 semanas, com que frequência você se sentiu desanimado(a), deprimido(a) ou sem esperança?",
  categoria: "DEPRESSAO",
  dominio: "TRISTE",
  tipoPergunta: "ESCALA_FREQUENCIA",
  opcoes: [
    { valor: 0, label: "Nenhuma vez" },
    { valor: 1, label: "Vários dias" },
    { valor: 2, label: "Mais da metade dos dias" },
    { valor: 3, label: "Quase todos os dias" }
  ],
  // IRT: calibrar após coleta de dados
  parametroA: 1.8,  // alta discriminação
  parametroB: 0.5,  // dificuldade média
  parametroC: 0.0,  // sem chute
  escalaNome: "PHQ9",
  escalaItem: "PHQ9_1",
  validada: true
}
```

#### Scripts a criar:

```bash
prisma/seeds/
├── seed-phq9.ts          # 9 perguntas PHQ-9
├── seed-gad7.ts          # 7 perguntas GAD-7
├── seed-who5.ts          # 5 perguntas WHO-5
├── seed-checkin.ts       # 15 perguntas check-in
├── seed-aula.ts          # 18 perguntas contexto aula
└── seed-master.ts        # Executa todos os seeds
```

---

### 1.2. Questionários Não-Adaptativos Estruturados

**Prioridade**: 🟡 Média  
**Esforço**: 1-2 semanas

#### Ações:

1. **Criar Templates de Questionários Fixos**
   
   ```typescript
   // src/lib/questionarios/templates.ts
   
   export const TEMPLATE_PHQ9: QuestionarioTemplate = {
     id: "phq9-depression-screening",
     titulo: "PHQ-9 - Rastreio de Depressão",
     tipo: "AUTOAVALIACAO",
     adaptativo: false,
     perguntas: [
       // 9 perguntas fixas PHQ-9
     ],
     interpretacao: (score) => interpretarPHQ9(score),
     alertaThreshold: 10 // Score ≥ 10 = alerta moderado
   }
   
   export const TEMPLATE_GAD7: QuestionarioTemplate = {
     id: "gad7-anxiety-screening",
     titulo: "GAD-7 - Rastreio de Ansiedade",
     tipo: "AUTOAVALIACAO",
     adaptativo: false,
     perguntas: [
       // 7 perguntas fixas GAD-7
     ],
     interpretacao: (score) => interpretarGAD7(score),
     alertaThreshold: 10
   }
   ```

2. **Criar Questionário de Check-in Diário**
   
   ```typescript
   // Questionário curto (1-2 min)
   export const TEMPLATE_CHECKIN_DIARIO = {
     perguntas: [
       "Como você está se sentindo hoje?", // Escala 1-10
       "Como foi seu sono?", // 5 opções
       "Quão motivado você está?", // Escala 1-10
       "Algo está te preocupando?", // Sim/Não + Texto opcional
     ]
   }
   ```

3. **Sistema de Aplicação Programada**
   
   ```typescript
   // src/lib/questionarios/scheduler.ts
   
   interface AgendamentoQuestionario {
     questionarioId: string;
     frequencia: FrequenciaQuestionario;
     diasDaSemana?: number[]; // 0=Domingo, 6=Sábado
     horarios?: string[]; // ["09:00", "18:00"]
     ativo: boolean;
   }
   ```

---

### 1.3. Sistema de Regras Adaptativas Avançado

**Prioridade**: 🟡 Média  
**Esforço**: 2 semanas

#### Ações:

1. **Expandir Motor de Regras (json-rules-engine)**
   
   ```typescript
   // src/lib/adaptive/regras-predefinidas.ts
   
   export const REGRA_ANSIEDADE_ALTA: RegraAdaptacao = {
     nome: "Detectar Ansiedade Alta",
     condicoes: {
       all: [
         { fact: "categoria", operator: "equal", value: "ANSIEDADE" },
         { fact: "scoreAtual", operator: "greaterThan", value: 7 }
       ]
     },
     acoes: [
       { tipo: "INSERIR_PERGUNTA", params: { escala: "GAD7" } },
       { tipo: "CRIAR_ALERTA", params: { nivel: "LARANJA" } }
     ]
   }
   
   export const REGRA_TERMINO_PRECOCE: RegraAdaptacao = {
     nome: "Terminar se Confiança Alta",
     condicoes: {
       all: [
         { fact: "confianca", operator: "greaterThan", value: 0.95 },
         { fact: "perguntasRespondidas", operator: "greaterThan", value: 5 }
       ]
     },
     acoes: [
       { tipo: "FINALIZAR_QUESTIONARIO", params: { motivo: "CONFIANCA_ALTA" } }
     ]
   }
   ```

2. **Criar Dashboard de Monitoramento de Regras**
   
   - Exibir regras ativas
   - Quantas vezes foram acionadas
   - Taxa de acerto (alertas verdadeiros vs falsos positivos)
   - Impacto na experiência (redução de perguntas, precisão)

---

### 1.4. Otimização de Performance IRT

**Prioridade**: 🟢 Baixa (para depois)  
**Esforço**: 1 semana

#### Ações:

1. **Caching de Cálculos IRT**
   ```typescript
   // Cache de probabilidades P(θ) para perguntas comuns
   const cacheIRT = new Map<string, number>();
   ```

2. **Pré-cálculo de Informação de Fisher**
   - Calcular matriz de informação para valores comuns de theta
   - Reduzir overhead em sessões longas

3. **Limitar Precisão do Newton-Raphson**
   - Tolerância atual: 0.001
   - Aumentar para 0.01 em contextos não-críticos
   - Reduzir iterações máximas de 20 para 10

---

## 📈 Parte 2: Melhorias em Relatórios

### 2.1. Migração de Dados Mock para Dados Reais

**Prioridade**: 🔴 Crítica  
**Esforço**: 2-3 semanas

#### Ações:

1. **Auditar Todos os Componentes de Relatório**
   
   Componentes a revisar:
   - [ ] `RelatorioLongitudinal.tsx`
   - [ ] `GraficoTendenciasTurma.tsx`
   - [ ] `ComparativoPeriodos.tsx`
   - [ ] `MapaCalorEmocional.tsx`
   - [ ] `GraficoCircumplex.tsx`
   - [ ] `RadarCategorias.tsx`
   - [ ] `HeatmapEmocional.tsx`
   - [ ] `MapaCircumplexTurma.tsx`
   - [ ] `AnalisePorMateria.tsx`

2. **Criar APIs Faltantes**
   
   APIs a criar/completar:
   ```bash
   src/app/api/relatorios/
   ├── metricas-avaliacoes/route.ts      # ✅ Existe?
   ├── evolucao-temporal/route.ts        # ❌ Criar
   ├── comparativo-periodos/route.ts     # ❌ Criar
   ├── mapa-calor/route.ts               # ❌ Criar
   ├── radar-categorias/route.ts         # ❌ Criar
   └── dashboard-professor/route.ts      # ❌ Criar
   ```

3. **Padrão de API Response**
   
   ```typescript
   // src/types/relatorios.ts
   
   export interface RelatorioResponse<T> {
     sucesso: boolean;
     dados: T;
     metadata: {
       periodoInicio: string;
       periodoFim: string;
       totalRegistros: number;
       tempoProcessamento: number; // ms
       cacheHit: boolean;
     };
     erro?: {
       codigo: string;
       mensagem: string;
     };
   }
   
   export interface MetricasAvaliacoes {
     usuarioId: number;
     periodo: {
       inicio: Date;
       fim: Date;
     };
     scoresPorCategoria: Record<CategoriaPergunta, {
       minimo: number;
       maximo: number;
       media: number;
       mediana: number;
       desvioPadrao: number;
       tendencia: "CRESCENTE" | "ESTAVEL" | "DECRESCENTE";
     }>;
     thetaEvolucao: Array<{
       data: Date;
       theta: number;
       confianca: number;
     }>;
     alertas: {
       total: number;
       porNivel: Record<NivelAlerta, number>;
       naoLidos: number;
     };
     estatisticas: {
       totalSessoes: number;
       totalRespostas: number;
       tempoMedioResposta: number;
       taxaResposta: number;
     };
   }
   ```

---

### 2.2. Sistema de Caching Robusto

**Prioridade**: 🔴 Alta  
**Esforço**: 1 semana

#### Ações:

1. **Implementar Cache com Redis (ou alternativa)**
   
   ```typescript
   // src/lib/cache/redis-cache.ts
   
   import { Redis } from '@upstash/redis'; // Alternativa gratuita para dev
   
   const redis = new Redis({
     url: process.env.REDIS_URL,
     token: process.env.REDIS_TOKEN,
   });
   
   export async function getCached<T>(
     key: string,
     fetcher: () => Promise<T>,
     ttl: number = 300 // 5 minutos
   ): Promise<T> {
     const cached = await redis.get(key);
     if (cached) return cached as T;
     
     const data = await fetcher();
     await redis.set(key, data, { ex: ttl });
     return data;
   }
   ```

2. **Estratégia de Invalidação**
   
   ```typescript
   // Invalidar cache quando dados mudam
   
   // Exemplo: nova resposta em sessão
   await prisma.respostaSocioemocional.create({ ... });
   
   // Invalidar caches relacionados
   await invalidarCache([
     `metricas:usuario:${usuarioId}`,
     `evolucao:usuario:${usuarioId}`,
     `dashboard:turma:${turmaId}`,
   ]);
   ```

3. **Cache em Memória para Dados Estáticos**
   
   ```typescript
   // src/lib/cache/memory-cache.ts
   
   const cache = new Map<string, { data: any; expires: number }>();
   
   export function getCachedSync<T>(
     key: string,
     fetcher: () => T,
     ttl: number = 60000 // 1 minuto
   ): T {
     const cached = cache.get(key);
     if (cached && cached.expires > Date.now()) {
       return cached.data as T;
     }
     
     const data = fetcher();
     cache.set(key, { data, expires: Date.now() + ttl });
     return data;
   }
   ```

---

### 2.3. Otimização de Queries Prisma

**Prioridade**: 🔴 Alta  
**Esforço**: 1 semana

#### Ações:

1. **Adicionar Índices Faltantes**
   
   ```prisma
   // prisma/schema.prisma
   
   model RespostaSocioemocional {
     // ... campos ...
     
     @@index([usuarioId, respondidoEm]) // Para queries temporais
     @@index([categoria, usuarioId])    // Para agregações
     @@index([sessaoId, ordem])         // Para navegação em sessões
   }
   
   model SessaoAdaptativa {
     @@index([usuarioId, status, iniciadoEm])
     @@index([contextoTipo, status])
     @@index([nivelAlerta, status])
   }
   
   model AlertaSocioemocional {
     @@index([usuarioId, nivel, status, criadoEm])
     @@index([nivel, status])
   }
   ```

2. **Otimizar Queries com Select/Include**
   
   ```typescript
   // ❌ Ruim: carrega tudo
   const sessoes = await prisma.sessaoAdaptativa.findMany({
     where: { usuarioId },
     include: {
       respostas: true,
       questionario: true,
       alertas: true,
     },
   });
   
   // ✅ Bom: seleciona apenas o necessário
   const sessoes = await prisma.sessaoAdaptativa.findMany({
     where: { usuarioId },
     select: {
       id: true,
       iniciadoEm: true,
       thetaEstimado: true,
       confianca: true,
       respostas: {
         select: {
           categoria: true,
           valorNormalizado: true,
           respondidoEm: true,
         },
       },
     },
   });
   ```

3. **Queries Agregadas Nativas**
   
   ```typescript
   // ❌ Ruim: agregar em memória
   const respostas = await prisma.respostaSocioemocional.findMany({ ... });
   const media = respostas.reduce((sum, r) => sum + r.valorNormalizado, 0) / respostas.length;
   
   // ✅ Bom: agregar no banco
   const resultado = await prisma.respostaSocioemocional.aggregate({
     where: { usuarioId, categoria: "ANSIEDADE" },
     _avg: { valorNormalizado: true },
     _count: true,
   });
   ```

---

### 2.4. Relatórios Específicos por Role

**Prioridade**: 🟡 Média  
**Esforço**: 2 semanas

#### Ações:

1. **Dashboard para ALUNO**
   
   Tela: `/relatorios` (já existe)
   
   Adicionar:
   - [ ] Widget "Sua Jornada Emocional" (últimos 30 dias)
   - [ ] Widget "Conquistas Recentes"
   - [ ] Widget "Próximos Check-ins"
   - [ ] Gráfico Circumplex interativo
   - [ ] Timeline de alertas resolvidos

2. **Dashboard para PROFESSOR**
   
   Tela: `/professor/relatorios`
   
   Criar:
   - [ ] Visão Geral da Turma
   - [ ] Alunos em Risco (alertas vermelhos/laranjas)
   - [ ] Tendências por Matéria
   - [ ] Comparativo de Aulas (engajamento x compreensão)
   - [ ] Relatório de Intervenções Realizadas

3. **Dashboard para ADMIN**
   
   Tela: `/admin/relatorios`
   
   Criar:
   - [ ] Métricas do Sistema (uso, performance)
   - [ ] Análise de Escalas Clínicas (PHQ-9, GAD-7 agregados)
   - [ ] Mapa de Calor Institucional
   - [ ] Relatório de Eficácia de Questionários
   - [ ] Logs de Algoritmos Adaptativos

#### Exemplo de API para Professor:

```typescript
// src/app/api/professor/relatorios/turma/route.ts

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const turmaId = searchParams.get('turmaId');
  
  // Buscar alunos da turma
  const alunos = await prisma.turmaAluno.findMany({
    where: { turmaId: Number(turmaId) },
    include: {
      aluno: {
        include: {
          alertasSocioemocionais: {
            where: { 
              nivel: { in: ["VERMELHO", "LARANJA"] },
              status: { in: ["PENDENTE", "EM_ANALISE"] }
            },
          },
        },
      },
    },
  });
  
  // Calcular métricas por aluno
  const metricas = await Promise.all(
    alunos.map(async (turmaAluno) => {
      const estatisticas = await calcularEstatisticasUsuario(
        turmaAluno.alunoId,
        { inicio: subMonths(new Date(), 1), fim: new Date() }
      );
      
      return {
        aluno: {
          id: turmaAluno.aluno.id,
          nome: turmaAluno.aluno.nome,
        },
        alertasAbertos: turmaAluno.aluno.alertasSocioemocionais.length,
        thetaMedio: estatisticas.thetaMedio,
        tendencia: estatisticas.tendencia,
        nivelRisco: calcularNivelRisco(estatisticas),
      };
    })
  );
  
  return NextResponse.json({ metricas });
}
```

---

### 2.5. Exportação Avançada (PDF, Excel)

**Prioridade**: 🟢 Baixa  
**Esforço**: 1-2 semanas

#### Ações:

1. **Implementar Exportação PDF**
   
   ```bash
   npm install jspdf jspdf-autotable
   ```
   
   ```typescript
   // src/lib/export/pdf-generator.ts
   
   import jsPDF from 'jspdf';
   import autoTable from 'jspdf-autotable';
   
   export function gerarRelatorioPDF(dados: MetricasAvaliacoes) {
     const doc = new jsPDF();
     
     // Cabeçalho
     doc.setFontSize(20);
     doc.text('Relatório de Avaliações Socioemocionais', 20, 20);
     
     // Informações do usuário
     doc.setFontSize(12);
     doc.text(`Período: ${dados.periodo.inicio} - ${dados.periodo.fim}`, 20, 30);
     
     // Tabela de scores
     autoTable(doc, {
       head: [['Categoria', 'Média', 'Tendência']],
       body: Object.entries(dados.scoresPorCategoria).map(([cat, score]) => [
         cat,
         score.media.toFixed(2),
         score.tendencia,
       ]),
       startY: 40,
     });
     
     // Gráfico (base64 image)
     const graficoImg = gerarGraficoBase64(dados.thetaEvolucao);
     doc.addImage(graficoImg, 'PNG', 20, 100, 170, 80);
     
     return doc.output('blob');
   }
   ```

2. **Implementar Exportação Excel**
   
   ```bash
   npm install xlsx
   ```
   
   ```typescript
   // src/lib/export/excel-generator.ts
   
   import * as XLSX from 'xlsx';
   
   export function gerarRelatorioExcel(dados: MetricasAvaliacoes) {
     const wb = XLSX.utils.book_new();
     
     // Aba 1: Resumo
     const resumo = [
       ['Período', `${dados.periodo.inicio} - ${dados.periodo.fim}`],
       ['Total de Sessões', dados.estatisticas.totalSessoes],
       ['Total de Respostas', dados.estatisticas.totalRespostas],
       ['Tempo Médio', `${dados.estatisticas.tempoMedioResposta}s`],
     ];
     const wsResumo = XLSX.utils.aoa_to_sheet(resumo);
     XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');
     
     // Aba 2: Scores por Categoria
     const scores = Object.entries(dados.scoresPorCategoria).map(([cat, score]) => ({
       Categoria: cat,
       Média: score.media,
       Mínimo: score.minimo,
       Máximo: score.maximo,
       'Desvio Padrão': score.desvioPadrao,
       Tendência: score.tendencia,
     }));
     const wsScores = XLSX.utils.json_to_sheet(scores);
     XLSX.utils.book_append_sheet(wb, wsScores, 'Scores');
     
     // Aba 3: Evolução Theta
     const evolucao = dados.thetaEvolucao.map((item) => ({
       Data: item.data.toISOString(),
       Theta: item.theta,
       Confiança: item.confianca,
     }));
     const wsEvolucao = XLSX.utils.json_to_sheet(evolucao);
     XLSX.utils.book_append_sheet(wb, wsEvolucao, 'Evolução');
     
     return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
   }
   ```

---

### 2.6. Dashboard Administrativo Completo

**Prioridade**: 🟡 Média  
**Esforço**: 2 semanas

#### Tela: `/admin/relatorios`

#### Seções:

1. **Métricas do Sistema**
   - Total de usuários ativos
   - Total de sessões (últimos 7/30 dias)
   - Total de respostas
   - Tempo médio de resposta
   - Uptime do sistema
   - Uso de memória/CPU (se aplicável)

2. **Análise de Questionários**
   - Taxa de conclusão por questionário
   - Tempo médio de conclusão
   - Perguntas mais respondidas
   - Perguntas mais puladas
   - Algoritmos IRT mais usados

3. **Análise de Alertas**
   - Total de alertas gerados (por nível)
   - Taxa de falsos positivos
   - Tempo médio de resolução
   - Alertas não tratados (> 7 dias)

4. **Análise Clínica Agregada**
   - Distribuição PHQ-9 (% por faixa)
   - Distribuição GAD-7
   - Distribuição WHO-5
   - Tendências ao longo do tempo

5. **Logs e Auditoria**
   - Logs de erros (últimas 24h)
   - Logs de segurança
   - Ações administrativas

---

## 🗓️ Cronograma Sugerido

### Sprint 1 (Semanas 1-2): Fundação
- [ ] Criar scripts de seed para banco de perguntas (PHQ-9, GAD-7, WHO-5)
- [ ] Implementar templates de questionários não-adaptativos
- [ ] Adicionar índices no Prisma
- [ ] Auditar componentes de relatório

### Sprint 2 (Semanas 3-4): APIs de Relatórios
- [ ] Criar APIs faltantes (`/api/relatorios/*`)
- [ ] Implementar sistema de caching (Redis/Upstash)
- [ ] Otimizar queries Prisma existentes
- [ ] Criar tipos TypeScript para responses

### Sprint 3 (Semanas 5-6): Dashboards por Role
- [ ] Dashboard do Aluno (melhorias)
- [ ] Dashboard do Professor (criar)
- [ ] Dashboard do Admin (criar)
- [ ] Testar com dados reais

### Sprint 4 (Semanas 7-8): Melhorias Avançadas
- [ ] Sistema de regras adaptativas expandido
- [ ] Exportação PDF/Excel
- [ ] Otimização de performance IRT
- [ ] Validação clínica final

---

## 📊 Métricas de Sucesso

### Questionários:
- ✅ Banco com pelo menos 100 perguntas validadas
- ✅ Tempo médio de resposta < 5 minutos
- ✅ Taxa de conclusão > 80%
- ✅ Confiança IRT média > 0.90

### Relatórios:
- ✅ Tempo de carregamento < 2 segundos (com cache)
- ✅ 100% dos relatórios usando dados reais
- ✅ Taxa de cache hit > 70%
- ✅ 0 dados mockados em produção

---

## 🛠️ Ferramentas e Tecnologias

### Já utilizadas:
- Prisma ORM
- PostgreSQL/Neon
- Next.js 14 (App Router)
- TypeScript
- Recharts (gráficos)
- Zod (validação)

### A adicionar:
- **Redis/Upstash**: Caching distribuído
- **jsPDF**: Exportação PDF
- **xlsx**: Exportação Excel
- **json-rules-engine**: Motor de regras (já existe, expandir)
- **date-fns**: Manipulação de datas

---

## 📚 Documentação Adicional a Criar

1. **GUIA_CRIACAO_PERGUNTAS.md**
   - Como criar perguntas validadas
   - Calibração de parâmetros IRT
   - Processo de validação clínica

2. **GUIA_OTIMIZACAO_QUERIES.md**
   - Padrões de queries eficientes
   - Uso de índices
   - Quando usar agregações

3. **API_RELATORIOS_REFERENCE.md**
   - Documentação completa de todas as APIs
   - Exemplos de requests/responses
   - Rate limits e caching

4. **DASHBOARD_CUSTOMIZATION.md**
   - Como customizar dashboards por role
   - Adicionar novos widgets
   - Temas e personalizações

---

## 🔄 Processo de Migração de Dados Mock → Real

### Checklist por Componente:

```typescript
// Exemplo: RelatorioLongitudinal.tsx

// ❌ ANTES (mock):
const dadosMock = [
  { data: '2024-01-01', score: 7.5 },
  { data: '2024-01-02', score: 7.8 },
  // ...
];

// ✅ DEPOIS (real):
import { useMetricasAvaliacoes } from '@/hooks/useMetricasAvaliacoes';

const { data, isLoading, error } = useMetricasAvaliacoes({
  usuarioId: session.user.id,
  periodo: 'mes',
});

if (isLoading) return <Skeleton />;
if (error) return <ErrorDisplay error={error} />;

// Usar data.thetaEvolucao
```

### Passos:

1. **Identificar fonte de dados mock**
2. **Criar/verificar API correspondente**
3. **Criar hook React Query**
4. **Substituir dados mock por dados da API**
5. **Adicionar tratamento de loading/erro**
6. **Testar com dados reais**
7. **Remover código mock**

---

## ⚠️ Riscos e Mitigações

### Risco 1: Dados insuficientes para relatórios
**Mitigação**: Manter seed de dados realistas para desenvolvimento/demo

### Risco 2: Performance degradada com dados reais
**Mitigação**: Implementar caching robusto + índices + paginação

### Risco 3: Queries complexas demais
**Mitigação**: Usar MaterializedViews ou tabelas agregadas pré-calculadas

### Risco 4: Validação clínica das perguntas
**Mitigação**: Consultar psicólogo educacional + usar escalas já validadas

---

## 📞 Próximos Passos Imediatos

1. ✅ Revisar e aprovar este plano
2. ✅ Definir prioridades (se discordar das sugeridas)
3. ✅ Alocar tempo para execução
4. ✅ Começar pelo Sprint 1 (fundação)

---

## 📝 Notas Finais

Este plano é **vivo e iterativo**. À medida que você implementa, pode descobrir:
- Novos requisitos
- Otimizações adicionais
- Mudanças de prioridade

**Mantenha este documento atualizado** com:
- [ ] Status de cada task
- [ ] Descobertas importantes
- [ ] Decisões técnicas tomadas
- [ ] Problemas encontrados e soluções

---

**Boa sorte com as melhorias! 🚀**

_Se precisar de ajuda para implementar qualquer parte específica deste plano, é só solicitar código/exemplos adicionais._
