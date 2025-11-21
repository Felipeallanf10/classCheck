# 🚀 SPRINT 7: APIs Faltantes de Relatórios

**Branch**: `feature/missing-report-apis`  
**Esforço**: 10-12 horas  
**Prazo**: Semana 7  
**Dependências**: Sistema de cache (Sprint 4), Dashboards básicos  

---

## 🎯 Objetivos do Sprint

- ✅ Criar 4 APIs padronizadas de relatórios
- ✅ Implementar tipos `RelatorioResponse<T>` consistentes
- ✅ Integrar caching com Upstash Redis
- ✅ Validação Zod em todos os endpoints
- ✅ Metadata de performance (tempo processamento, cache hit)
- ✅ Queries Prisma otimizadas

---

## 📊 APIs a Implementar

### 1. `/api/relatorios/evolucao-temporal` - Série Temporal de Theta
**Descrição**: Retorna evolução do theta ao longo do tempo (últimos N dias)  
**Query Params**: `usuarioId`, `dias` (padrão: 30)  
**Response**: Array de pontos (data, theta, confiança) + tendência

### 2. `/api/relatorios/comparativo-periodos` - Comparação Entre Períodos
**Descrição**: Compara médias de theta/scores entre 2 períodos (ex: últimas 4 semanas)  
**Query Params**: `usuarioId`, `periodoDias` (padrão: 7)  
**Response**: Array de períodos com médias + variação percentual

### 3. `/api/relatorios/mapa-calor` - Heatmap Emocional
**Descrição**: Valencia × Ativação agregados por data/hora (padrão CircumPlex)  
**Query Params**: `usuarioId`, `dias` (padrão: 30)  
**Response**: Matriz 7x24 (dias da semana × horas do dia) com médias

### 4. `/api/relatorios/radar-categorias` - Scores por Categoria
**Descrição**: Scores normalizados 0-100 por categoria socioemocional  
**Query Params**: `usuarioId`, `dias` (padrão: 30)  
**Response**: Objeto com categorias e scores + percentil

---

## 📂 Estrutura de Types

### Arquivo: `src/types/relatorios.ts`

```typescript
// Response padronizado
export interface RelatorioResponse<T> {
  sucesso: boolean;
  dados: T;
  metadata: {
    periodoInicio: string; // ISO 8601
    periodoFim: string;
    totalRegistros: number;
    tempoProcessamento: number; // ms
    cacheHit: boolean;
    geradoEm: string; // ISO 8601
  };
}

// API 1: Evolução Temporal
export interface EvolucaoTemporal {
  pontos: Array<{
    data: Date;
    theta: number;
    confianca: number;
    scoreNormalizado: number; // 0-100
  }>;
  tendencia: 'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE';
  variacao: number; // % entre primeiro e último ponto
  media: number;
  desvio: number;
}

// API 2: Comparativo Períodos
export interface ComparativoPeriodos {
  periodos: Array<{
    label: string; // "Semana 1", "Semana 2"
    inicio: Date;
    fim: Date;
    mediaTheta: number;
    mediasScores: Record<string, number>; // categoria → score
    totalSessoes: number;
  }>;
  variacaoPercentual: number; // % mudança entre último e primeiro período
  melhorPeriodo: string;
  piorPeriodo: string;
}

// API 3: Mapa Calor
export interface MapaCalor {
  matriz: number[][]; // [diaSemana][hora] → média valencia/ativação
  labels: {
    dias: string[]; // ["Dom", "Seg", "Ter", ...]
    horas: string[]; // ["00h", "01h", ..., "23h"]
  };
  estatisticas: {
    horarioMaisPositivo: string; // "Seg 10h"
    horarioMaisNegativo: string;
    mediaGeral: number;
  };
}

// API 4: Radar Categorias
export interface RadarCategorias {
  categorias: Array<{
    nome: string; // "ANSIEDADE", "DEPRESSAO", etc
    score: number; // 0-100 (normalizado)
    percentil: number; // Comparado com população
    interpretacao: string; // "Abaixo da média", "Normal", "Elevado"
  }>;
  scoreGeral: number; // 0-100
  alertas: string[]; // Categorias com score < 30 ou > 70
}
```

---

## 🔧 Implementação das APIs

### API 1: `/api/relatorios/evolucao-temporal/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getCached, invalidarCache } from '@/lib/performance/redis-cache';
import { subDays } from 'date-fns';
import type { EvolucaoTemporal, RelatorioResponse } from '@/types/relatorios';

export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  usuarioId: z.string().transform(Number),
  dias: z.string().optional().default('30').transform(Number)
});

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Validar query params
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const validated = QuerySchema.parse(params);
    
    const { usuarioId, dias } = validated;
    const periodoInicio = subDays(new Date(), dias);
    const periodoFim = new Date();
    
    // Tentar cache
    const cacheKey = `evolucao:${usuarioId}:${dias}`;
    const cached = await getCached<EvolucaoTemporal>(cacheKey);
    
    if (cached) {
      return NextResponse.json({
        sucesso: true,
        dados: cached,
        metadata: {
          periodoInicio: periodoInicio.toISOString(),
          periodoFim: periodoFim.toISOString(),
          totalRegistros: cached.pontos.length,
          tempoProcessamento: Date.now() - startTime,
          cacheHit: true,
          geradoEm: new Date().toISOString()
        }
      } as RelatorioResponse<EvolucaoTemporal>);
    }
    
    // Buscar dados do banco
    const sessoes = await prisma.sessaoAdaptativa.findMany({
      where: {
        usuarioId,
        status: 'COMPLETA',
        iniciadoEm: {
          gte: periodoInicio,
          lte: periodoFim
        }
      },
      select: {
        thetaEstimado: true,
        confianca: true,
        iniciadoEm: true
      },
      orderBy: { iniciadoEm: 'asc' }
    });
    
    // Calcular pontos
    const pontos = sessoes.map(s => ({
      data: s.iniciadoEm,
      theta: s.thetaEstimado || 0,
      confianca: s.confianca || 0,
      scoreNormalizado: normalizarTheta(s.thetaEstimado || 0) // -3/+3 → 0-100
    }));
    
    // Calcular tendência
    const tendencia = calcularTendencia(pontos);
    const variacao = pontos.length >= 2
      ? ((pontos[pontos.length - 1].theta - pontos[0].theta) / Math.abs(pontos[0].theta)) * 100
      : 0;
    
    const media = pontos.reduce((acc, p) => acc + p.theta, 0) / pontos.length;
    const desvio = Math.sqrt(
      pontos.reduce((acc, p) => acc + Math.pow(p.theta - media, 2), 0) / pontos.length
    );
    
    const resultado: EvolucaoTemporal = {
      pontos,
      tendencia,
      variacao,
      media,
      desvio
    };
    
    // Cachear (5 minutos)
    await setCached(cacheKey, resultado, 300);
    
    return NextResponse.json({
      sucesso: true,
      dados: resultado,
      metadata: {
        periodoInicio: periodoInicio.toISOString(),
        periodoFim: periodoFim.toISOString(),
        totalRegistros: pontos.length,
        tempoProcessamento: Date.now() - startTime,
        cacheHit: false,
        geradoEm: new Date().toISOString()
      }
    } as RelatorioResponse<EvolucaoTemporal>);
    
  } catch (erro) {
    console.error('[API Evolução Temporal]', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Erro ao gerar relatório' },
      { status: 500 }
    );
  }
}

// Helpers
function normalizarTheta(theta: number): number {
  // Converter theta (-3 a +3) para escala 0-100
  return Math.round(((theta + 3) / 6) * 100);
}

function calcularTendencia(pontos: Array<{ theta: number }>): 'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE' {
  if (pontos.length < 2) return 'ESTAVEL';
  
  const primeiro = pontos[0].theta;
  const ultimo = pontos[pontos.length - 1].theta;
  const diff = ultimo - primeiro;
  
  if (Math.abs(diff) < 0.3) return 'ESTAVEL';
  return diff > 0 ? 'CRESCENTE' : 'DECRESCENTE';
}
```

---

### API 2: `/api/relatorios/comparativo-periodos/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import type { ComparativoPeriodos, RelatorioResponse } from '@/types/relatorios';

export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  usuarioId: z.string().transform(Number),
  periodoDias: z.string().optional().default('7').transform(Number),
  numeroPeriodos: z.string().optional().default('4').transform(Number)
});

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const { usuarioId, periodoDias, numeroPeriodos } = QuerySchema.parse(params);
    
    const periodos: ComparativoPeriodos['periodos'] = [];
    
    // Buscar dados de cada período
    for (let i = 0; i < numeroPeriodos; i++) {
      const inicio = startOfDay(subDays(new Date(), (i + 1) * periodoDias));
      const fim = endOfDay(subDays(new Date(), i * periodoDias));
      
      const sessoes = await prisma.sessaoAdaptativa.findMany({
        where: {
          usuarioId,
          status: 'COMPLETA',
          iniciadoEm: { gte: inicio, lte: fim }
        },
        select: {
          thetaEstimado: true,
          respostas: {
            select: {
              pergunta: {
                select: { categoria: true }
              },
              valorNormalizado: true
            }
          }
        }
      });
      
      // Calcular médias
      const mediaTheta = sessoes.reduce((acc, s) => acc + (s.thetaEstimado || 0), 0) / (sessoes.length || 1);
      
      const mediasScores: Record<string, number> = {};
      sessoes.forEach(s => {
        s.respostas.forEach(r => {
          const cat = r.pergunta.categoria;
          if (!mediasScores[cat]) mediasScores[cat] = 0;
          mediasScores[cat] += r.valorNormalizado;
        });
      });
      Object.keys(mediasScores).forEach(cat => {
        mediasScores[cat] /= sessoes.length || 1;
      });
      
      periodos.push({
        label: `Período ${numeroPeriodos - i}`,
        inicio,
        fim,
        mediaTheta,
        mediasScores,
        totalSessoes: sessoes.length
      });
    }
    
    // Calcular variação percentual
    const primeiro = periodos[periodos.length - 1];
    const ultimo = periodos[0];
    const variacaoPercentual = ((ultimo.mediaTheta - primeiro.mediaTheta) / Math.abs(primeiro.mediaTheta)) * 100;
    
    // Melhor e pior período
    const sorted = [...periodos].sort((a, b) => b.mediaTheta - a.mediaTheta);
    const melhorPeriodo = sorted[0].label;
    const piorPeriodo = sorted[sorted.length - 1].label;
    
    const resultado: ComparativoPeriodos = {
      periodos: periodos.reverse(), // Ordem cronológica
      variacaoPercentual,
      melhorPeriodo,
      piorPeriodo
    };
    
    return NextResponse.json({
      sucesso: true,
      dados: resultado,
      metadata: {
        periodoInicio: periodos[0].inicio.toISOString(),
        periodoFim: periodos[periodos.length - 1].fim.toISOString(),
        totalRegistros: periodos.reduce((acc, p) => acc + p.totalSessoes, 0),
        tempoProcessamento: Date.now() - startTime,
        cacheHit: false,
        geradoEm: new Date().toISOString()
      }
    } as RelatorioResponse<ComparativoPeriodos>);
    
  } catch (erro) {
    console.error('[API Comparativo]', erro);
    return NextResponse.json({ sucesso: false, erro: 'Erro ao gerar relatório' }, { status: 500 });
  }
}
```

---

### API 3: `/api/relatorios/mapa-calor/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { subDays, getDay, getHours, format } from 'date-fns';
import type { MapaCalor, RelatorioResponse } from '@/types/relatorios';

export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  usuarioId: z.string().transform(Number),
  dias: z.string().optional().default('30').transform(Number),
  metrica: z.enum(['valencia', 'ativacao']).optional().default('valencia')
});

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const { usuarioId, dias, metrica } = QuerySchema.parse(params);
    
    const periodoInicio = subDays(new Date(), dias);
    
    // Buscar respostas com valencia/ativação
    const respostas = await prisma.respostaSocioemocional.findMany({
      where: {
        sessao: {
          usuarioId,
          status: 'COMPLETA',
          iniciadoEm: { gte: periodoInicio }
        }
      },
      select: {
        pergunta: {
          select: { valencia: true, ativacao: true }
        },
        sessao: {
          select: { iniciadoEm: true }
        },
        valorNormalizado: true
      }
    });
    
    // Inicializar matriz 7x24 (dias semana × horas)
    const matriz: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    const contadores: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    
    // Preencher matriz
    respostas.forEach(r => {
      const dia = getDay(r.sessao.iniciadoEm); // 0=Dom, 6=Sab
      const hora = getHours(r.sessao.iniciadoEm);
      const valor = metrica === 'valencia' ? r.pergunta.valencia : r.pergunta.ativacao;
      
      matriz[dia][hora] += valor * r.valorNormalizado;
      contadores[dia][hora]++;
    });
    
    // Calcular médias
    for (let dia = 0; dia < 7; dia++) {
      for (let hora = 0; hora < 24; hora++) {
        if (contadores[dia][hora] > 0) {
          matriz[dia][hora] /= contadores[dia][hora];
        }
      }
    }
    
    // Labels
    const labels = {
      dias: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      horas: Array.from({ length: 24 }, (_, i) => `${i}h`)
    };
    
    // Estatísticas
    let maxValor = -Infinity;
    let minValor = Infinity;
    let horarioMaisPositivo = '';
    let horarioMaisNegativo = '';
    let soma = 0;
    let count = 0;
    
    for (let dia = 0; dia < 7; dia++) {
      for (let hora = 0; hora < 24; hora++) {
        const val = matriz[dia][hora];
        if (contadores[dia][hora] > 0) {
          soma += val;
          count++;
          
          if (val > maxValor) {
            maxValor = val;
            horarioMaisPositivo = `${labels.dias[dia]} ${hora}h`;
          }
          if (val < minValor) {
            minValor = val;
            horarioMaisNegativo = `${labels.dias[dia]} ${hora}h`;
          }
        }
      }
    }
    
    const resultado: MapaCalor = {
      matriz,
      labels,
      estatisticas: {
        horarioMaisPositivo,
        horarioMaisNegativo,
        mediaGeral: soma / (count || 1)
      }
    };
    
    return NextResponse.json({
      sucesso: true,
      dados: resultado,
      metadata: {
        periodoInicio: periodoInicio.toISOString(),
        periodoFim: new Date().toISOString(),
        totalRegistros: respostas.length,
        tempoProcessamento: Date.now() - startTime,
        cacheHit: false,
        geradoEm: new Date().toISOString()
      }
    } as RelatorioResponse<MapaCalor>);
    
  } catch (erro) {
    console.error('[API Mapa Calor]', erro);
    return NextResponse.json({ sucesso: false, erro: 'Erro ao gerar relatório' }, { status: 500 });
  }
}
```

---

### API 4: `/api/relatorios/radar-categorias/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { subDays } from 'date-fns';
import type { RadarCategorias, RelatorioResponse } from '@/types/relatorios';

export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  usuarioId: z.string().transform(Number),
  dias: z.string().optional().default('30').transform(Number)
});

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const { usuarioId, dias } = QuerySchema.parse(params);
    
    const periodoInicio = subDays(new Date(), dias);
    
    // Buscar respostas agrupadas por categoria
    const respostas = await prisma.respostaSocioemocional.findMany({
      where: {
        sessao: {
          usuarioId,
          status: 'COMPLETA',
          iniciadoEm: { gte: periodoInicio }
        }
      },
      select: {
        pergunta: { select: { categoria: true } },
        valorNormalizado: true
      }
    });
    
    // Agrupar por categoria
    const scoresPorCategoria: Record<string, number[]> = {};
    respostas.forEach(r => {
      const cat = r.pergunta.categoria;
      if (!scoresPorCategoria[cat]) scoresPorCategoria[cat] = [];
      scoresPorCategoria[cat].push(r.valorNormalizado);
    });
    
    // Calcular médias e normalizar para 0-100
    const categorias = Object.entries(scoresPorCategoria).map(([nome, scores]) => {
      const media = scores.reduce((a, b) => a + b, 0) / scores.length;
      const score = Math.round(((media + 1) / 2) * 100); // -1/+1 → 0-100
      
      // Percentil (mocado - implementar comparação real depois)
      const percentil = Math.round((score / 100) * 100);
      
      let interpretacao = 'Normal';
      if (score < 30) interpretacao = 'Abaixo da média';
      if (score > 70) interpretacao = 'Elevado';
      
      return { nome, score, percentil, interpretacao };
    });
    
    const scoreGeral = Math.round(
      categorias.reduce((acc, c) => acc + c.score, 0) / categorias.length
    );
    
    const alertas = categorias
      .filter(c => c.score < 30 || c.score > 70)
      .map(c => `${c.nome}: ${c.interpretacao}`);
    
    const resultado: RadarCategorias = {
      categorias,
      scoreGeral,
      alertas
    };
    
    return NextResponse.json({
      sucesso: true,
      dados: resultado,
      metadata: {
        periodoInicio: periodoInicio.toISOString(),
        periodoFim: new Date().toISOString(),
        totalRegistros: respostas.length,
        tempoProcessamento: Date.now() - startTime,
        cacheHit: false,
        geradoEm: new Date().toISOString()
      }
    } as RelatorioResponse<RadarCategorias>);
    
  } catch (erro) {
    console.error('[API Radar]', erro);
    return NextResponse.json({ sucesso: false, erro: 'Erro ao gerar relatório' }, { status: 500 });
  }
}
```

---

## ✅ Checklist de Validação

- [ ] **4 APIs criadas** (`/evolucao-temporal`, `/comparativo-periodos`, `/mapa-calor`, `/radar-categorias`)
- [ ] **Types `RelatorioResponse<T>`** definidos e usados consistentemente
- [ ] **Validação Zod** em todas as APIs
- [ ] **Queries Prisma otimizadas** (select apenas campos necessários)
- [ ] **Metadata completa** (tempo, cache hit, total registros)
- [ ] **Cache Redis integrado** (APIs 1 e 4 cacheadas por 5 min)
- [ ] **Tratamento de erros** com try/catch e logs
- [ ] **Testes com dados reais**:
  - [ ] Evolução temporal gera tendência correta
  - [ ] Comparativo calcula variação percentual
  - [ ] Mapa calor identifica horários pico
  - [ ] Radar normaliza scores corretamente

---

## 🔧 Workflow Git

```bash
# 1. Criar branch
git checkout develop
git pull origin develop
git checkout -b feature/missing-report-apis

# 2. Implementar
# - Criar src/types/relatorios.ts
# - Criar 4 APIs em src/app/api/relatorios/
# - Adicionar testes

# 3. Commit semântico
git add .
git commit -m "feat: criar APIs faltantes de relatórios

- API /evolucao-temporal (série temporal theta + tendência)
- API /comparativo-periodos (comparação 4 semanas)
- API /mapa-calor (valencia × ativação por data/hora)
- API /radar-categorias (scores normalizados 0-100)
- Types RelatorioResponse<T> padronizados
- Validação Zod em todos endpoints
- Metadata (tempo processamento, cache hit)
- Cache Redis em APIs críticas"

# 4. Push e PR
git push origin feature/missing-report-apis
# Criar PR para develop
```

---

## 📊 Métricas de Sucesso

- **Performance**: < 2s para processar 30 dias de dados
- **Cache hit ratio**: > 60% após 1h de uso
- **Consistência**: 100% das respostas seguem `RelatorioResponse<T>`
- **Cobertura de testes**: > 80%
- **Queries otimizadas**: Todas com `select` e `include` explícitos

---

**Próximo Sprint**: Sprint 8 - Melhorias Dashboard Aluno
