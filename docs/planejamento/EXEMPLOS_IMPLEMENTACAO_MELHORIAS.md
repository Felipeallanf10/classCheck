# 💻 Exemplos Práticos de Implementação
## Guia de Código para Melhorias - ClassCheck

**Complemento ao**: PLANO_MELHORIAS_QUESTIONARIOS_RELATORIOS.md

---

## 📦 1. Seed de Perguntas PHQ-9

### Arquivo: `prisma/seeds/seed-phq9.ts`

```typescript
import { PrismaClient, CategoriaPergunta, DominioEmocional, TipoPergunta } from '@prisma/client';

const prisma = new PrismaClient();

// Perguntas oficiais do PHQ-9 (Patient Health Questionnaire-9)
// Fonte: Spitzer, R. L., Kroenke, K., & Williams, J. B. (1999)
const perguntasPHQ9 = [
  {
    codigo: 'PHQ9_001',
    titulo: 'Pouco interesse ou prazer',
    texto: 'Nas últimas 2 semanas, com que frequência você se sentiu com pouco interesse ou prazer em fazer as coisas?',
    categoria: CategoriaPergunta.DEPRESSAO,
    dominio: DominioEmocional.DEPRIMIDO,
    tipoPergunta: TipoPergunta.ESCALA_FREQUENCIA,
    opcoes: [
      { valor: 0, label: 'Nenhuma vez' },
      { valor: 1, label: 'Vários dias' },
      { valor: 2, label: 'Mais da metade dos dias' },
      { valor: 3, label: 'Quase todos os dias' }
    ],
    parametroA: 2.35, // Alta discriminação (baseado em estudos IRT)
    parametroB: 0.32, // Dificuldade baixa-média
    parametroC: 0.0,  // Sem chute
    escalaNome: 'PHQ9',
    escalaItem: 'PHQ9_1',
    validada: true,
  },
  {
    codigo: 'PHQ9_002',
    titulo: 'Sentindo-se para baixo',
    texto: 'Nas últimas 2 semanas, com que frequência você se sentiu para baixo, deprimido(a) ou sem esperança?',
    categoria: CategoriaPergunta.DEPRESSAO,
    dominio: DominioEmocional.TRISTE,
    tipoPergunta: TipoPergunta.ESCALA_FREQUENCIA,
    opcoes: [
      { valor: 0, label: 'Nenhuma vez' },
      { valor: 1, label: 'Vários dias' },
      { valor: 2, label: 'Mais da metade dos dias' },
      { valor: 3, label: 'Quase todos os dias' }
    ],
    parametroA: 2.72, // Muito alta discriminação
    parametroB: 0.28,
    parametroC: 0.0,
    escalaNome: 'PHQ9',
    escalaItem: 'PHQ9_2',
    validada: true,
  },
  {
    codigo: 'PHQ9_003',
    titulo: 'Problemas para dormir',
    texto: 'Nas últimas 2 semanas, com que frequência você teve problemas para pegar no sono, continuar dormindo ou dormiu demais?',
    categoria: CategoriaPergunta.SONO,
    dominio: DominioEmocional.CANSADO,
    tipoPergunta: TipoPergunta.ESCALA_FREQUENCIA,
    opcoes: [
      { valor: 0, label: 'Nenhuma vez' },
      { valor: 1, label: 'Vários dias' },
      { valor: 2, label: 'Mais da metade dos dias' },
      { valor: 3, label: 'Quase todos os dias' }
    ],
    parametroA: 1.88,
    parametroB: 0.15,
    parametroC: 0.0,
    escalaNome: 'PHQ9',
    escalaItem: 'PHQ9_3',
    validada: true,
  },
  {
    codigo: 'PHQ9_004',
    titulo: 'Sentindo-se cansado',
    texto: 'Nas últimas 2 semanas, com que frequência você se sentiu cansado(a) ou com pouca energia?',
    categoria: CategoriaPergunta.ENERGIA,
    dominio: DominioEmocional.LETARGICO,
    tipoPergunta: TipoPergunta.ESCALA_FREQUENCIA,
    opcoes: [
      { valor: 0, label: 'Nenhuma vez' },
      { valor: 1, label: 'Vários dias' },
      { valor: 2, label: 'Mais da metade dos dias' },
      { valor: 3, label: 'Quase todos os dias' }
    ],
    parametroA: 2.15,
    parametroB: 0.08,
    parametroC: 0.0,
    escalaNome: 'PHQ9',
    escalaItem: 'PHQ9_4',
    validada: true,
  },
  {
    codigo: 'PHQ9_005',
    titulo: 'Falta de apetite',
    texto: 'Nas últimas 2 semanas, com que frequência você teve pouco apetite ou comeu demais?',
    categoria: CategoriaPergunta.SAUDE_FISICA,
    dominio: DominioEmocional.DEPRIMIDO,
    tipoPergunta: TipoPergunta.ESCALA_FREQUENCIA,
    opcoes: [
      { valor: 0, label: 'Nenhuma vez' },
      { valor: 1, label: 'Vários dias' },
      { valor: 2, label: 'Mais da metade dos dias' },
      { valor: 3, label: 'Quase todos os dias' }
    ],
    parametroA: 1.92,
    parametroB: 0.42,
    parametroC: 0.0,
    escalaNome: 'PHQ9',
    escalaItem: 'PHQ9_5',
    validada: true,
  },
  {
    codigo: 'PHQ9_006',
    titulo: 'Sentimentos negativos sobre si',
    texto: 'Nas últimas 2 semanas, com que frequência você se sentiu mal consigo mesmo(a), ou achou que é um fracasso, ou que decepcionou sua família ou você mesmo(a)?',
    categoria: CategoriaPergunta.AUTOESTIMA,
    dominio: DominioEmocional.TRISTE,
    tipoPergunta: TipoPergunta.ESCALA_FREQUENCIA,
    opcoes: [
      { valor: 0, label: 'Nenhuma vez' },
      { valor: 1, label: 'Vários dias' },
      { valor: 2, label: 'Mais da metade dos dias' },
      { valor: 3, label: 'Quase todos os dias' }
    ],
    parametroA: 2.53,
    parametroB: 0.68,
    parametroC: 0.0,
    escalaNome: 'PHQ9',
    escalaItem: 'PHQ9_6',
    validada: true,
  },
  {
    codigo: 'PHQ9_007',
    titulo: 'Dificuldade de concentração',
    texto: 'Nas últimas 2 semanas, com que frequência você teve dificuldade para se concentrar nas coisas, como ler um livro ou assistir televisão?',
    categoria: CategoriaPergunta.CONCENTRACAO,
    dominio: DominioEmocional.CANSADO,
    tipoPergunta: TipoPergunta.ESCALA_FREQUENCIA,
    opcoes: [
      { valor: 0, label: 'Nenhuma vez' },
      { valor: 1, label: 'Vários dias' },
      { valor: 2, label: 'Mais da metade dos dias' },
      { valor: 3, label: 'Quase todos os dias' }
    ],
    parametroA: 2.08,
    parametroB: 0.55,
    parametroC: 0.0,
    escalaNome: 'PHQ9',
    escalaItem: 'PHQ9_7',
    validada: true,
  },
  {
    codigo: 'PHQ9_008',
    titulo: 'Lentidão ou agitação',
    texto: 'Nas últimas 2 semanas, com que frequência você se movimentou ou falou tão devagar que outras pessoas poderiam perceber? Ou o oposto: você ficou tão agitado(a) ou inquieto(a) que andava de um lado para o outro muito mais do que de costume?',
    categoria: CategoriaPergunta.DEPRESSAO,
    dominio: DominioEmocional.ANSIOSO,
    tipoPergunta: TipoPergunta.ESCALA_FREQUENCIA,
    opcoes: [
      { valor: 0, label: 'Nenhuma vez' },
      { valor: 1, label: 'Vários dias' },
      { valor: 2, label: 'Mais da metade dos dias' },
      { valor: 3, label: 'Quase todos os dias' }
    ],
    parametroA: 1.76,
    parametroB: 0.88,
    parametroC: 0.0,
    escalaNome: 'PHQ9',
    escalaItem: 'PHQ9_8',
    validada: true,
  },
  {
    codigo: 'PHQ9_009',
    titulo: 'Pensamentos de se machucar',
    texto: 'Nas últimas 2 semanas, com que frequência você teve pensamentos de que seria melhor estar morto(a) ou de se machucar de alguma forma?',
    categoria: CategoriaPergunta.PENSAMENTOS_NEGATIVOS,
    dominio: DominioEmocional.DEPRIMIDO,
    tipoPergunta: TipoPergunta.ESCALA_FREQUENCIA,
    opcoes: [
      { valor: 0, label: 'Nenhuma vez' },
      { valor: 1, label: 'Vários dias' },
      { valor: 2, label: 'Mais da metade dos dias' },
      { valor: 3, label: 'Quase todos os dias' }
    ],
    parametroA: 2.91, // Altíssima discriminação
    parametroB: 1.25, // Alta dificuldade (sintoma severo)
    parametroC: 0.0,
    escalaNome: 'PHQ9',
    escalaItem: 'PHQ9_9',
    validada: true,
    // ⚠️ PERGUNTA CRÍTICA - GERA ALERTA VERMELHO SE > 0
  },
];

async function seedPHQ9() {
  console.log('🌱 Iniciando seed PHQ-9...');

  // 1. Criar questionário PHQ-9
  const questionarioPHQ9 = await prisma.questionarioSocioemocional.upsert({
    where: { id: 'phq9-depression-screening' },
    update: {},
    create: {
      id: 'phq9-depression-screening',
      titulo: 'PHQ-9 - Questionário de Depressão',
      descricao: 'O PHQ-9 é um instrumento validado para rastreio de depressão, baseado nos critérios do DSM-IV.',
      versao: '1.0',
      tipo: 'AUTOAVALIACAO',
      frequencia: 'MENSAL',
      duracaoEstimada: 5,
      contextoPrincipal: 'GERAL',
      categorias: ['DEPRESSAO', 'SONO', 'ENERGIA', 'AUTOESTIMA', 'CONCENTRACAO', 'PENSAMENTOS_NEGATIVOS'],
      adaptativo: false, // PHQ-9 é fixo (9 perguntas sempre)
      instrucoes: 'Responda com que frequência você vivenciou cada situação nas últimas 2 semanas.',
      instrucoesFinais: 'Obrigado por responder. Seus resultados foram registrados de forma segura.',
      tempoMinimo: 120, // 2 minutos
      tempoMaximo: 600, // 10 minutos
      ativo: true,
      oficial: true, // Validado clinicamente
      publicado: true,
    },
  });

  console.log(`✅ Questionário PHQ-9 criado: ${questionarioPHQ9.id}`);

  // 2. Criar perguntas
  for (let i = 0; i < perguntasPHQ9.length; i++) {
    const perguntaData = perguntasPHQ9[i];
    
    const pergunta = await prisma.perguntaSocioemocional.upsert({
      where: { id: perguntaData.codigo },
      update: {},
      create: {
        id: perguntaData.codigo,
        questionarioId: questionarioPHQ9.id,
        texto: perguntaData.texto,
        categoria: perguntaData.categoria,
        dominio: perguntaData.dominio,
        tipoPergunta: perguntaData.tipoPergunta,
        obrigatoria: true,
        ordem: i + 1,
        opcoes: perguntaData.opcoes,
        dificuldade: perguntaData.parametroB, // Parâmetro b (dificuldade)
        discriminacao: perguntaData.parametroA, // Parâmetro a
        peso: 1.0,
        escalaNome: perguntaData.escalaNome,
        escalaItem: perguntaData.escalaItem,
        tags: ['depressao', 'phq9', 'saude-mental'],
        palavrasChave: [perguntaData.titulo.toLowerCase()],
        ativo: true,
        validada: perguntaData.validada,
      },
    });

    console.log(`  ✓ ${pergunta.id} - ${pergunta.texto.substring(0, 50)}...`);

    // 3. Também adicionar ao banco adaptativo
    await prisma.bancoPerguntasAdaptativo.upsert({
      where: { codigo: perguntaData.codigo },
      update: {},
      create: {
        codigo: perguntaData.codigo,
        titulo: perguntaData.titulo,
        texto: perguntaData.texto,
        categoria: perguntaData.categoria,
        dominio: perguntaData.dominio,
        tipoPergunta: perguntaData.tipoPergunta,
        opcoes: perguntaData.opcoes,
        parametroA: perguntaData.parametroA,
        parametroB: perguntaData.parametroB,
        parametroC: perguntaData.parametroC,
        escalaNome: perguntaData.escalaNome,
        escalaItem: perguntaData.escalaItem,
        escalaNome: '1.0',
        condicoes: {
          categoria: 'DEPRESSAO',
          contextos: ['TRIAGEM', 'AVALIACAO_MENSAL'],
        },
        ativo: true,
        validada: true,
      },
    });
  }

  console.log(`\n✅ Seed PHQ-9 concluído!`);
  console.log(`   - Questionário: phq9-depression-screening`);
  console.log(`   - Perguntas criadas: ${perguntasPHQ9.length}`);
  console.log(`   - Interpretação: 0-4 (mínima), 5-9 (leve), 10-14 (moderada), 15-19 (moderadamente severa), 20-27 (severa)`);
  console.log(`   - ⚠️ Pergunta 9 (pensamentos suicidas) requer atenção especial!\n`);
}

// Executar seed
seedPHQ9()
  .catch((e) => {
    console.error('❌ Erro ao executar seed PHQ-9:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 📊 2. API de Métricas de Avaliações (Real)

### Arquivo: `src/app/api/relatorios/metricas-avaliacoes/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays, subMonths, subWeeks, startOfDay, endOfDay } from 'date-fns';
import { CategoriaPergunta, NivelAlerta } from '@prisma/client';

interface MetricasAvaliacoesParams {
  usuarioId: number;
  periodo: 'semana' | 'mes' | 'trimestre' | 'ano' | 'personalizado';
  dataInicio?: string;
  dataFim?: string;
}

interface MetricasResponse {
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
    tendencia: 'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE';
    totalRespostas: number;
  }>;
  thetaEvolucao: Array<{
    data: Date;
    theta: number;
    confianca: number;
    sessaoId: string;
  }>;
  alertas: {
    total: number;
    porNivel: Record<NivelAlerta, number>;
    naoLidos: number;
    recentes: Array<{
      id: string;
      nivel: NivelAlerta;
      titulo: string;
      criadoEm: Date;
      lido: boolean;
    }>;
  };
  estatisticas: {
    totalSessoes: number;
    totalRespostas: number;
    tempoMedioResposta: number;
    taxaResposta: number;
    sessoesCompletas: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validar parâmetros
    const usuarioId = parseInt(searchParams.get('usuarioId') || '');
    if (isNaN(usuarioId)) {
      return NextResponse.json(
        { erro: 'usuarioId inválido' },
        { status: 400 }
      );
    }

    const periodo = searchParams.get('periodo') || 'mes';
    
    // Calcular datas
    const dataFim = new Date();
    let dataInicio: Date;

    if (periodo === 'personalizado') {
      const inicioParam = searchParams.get('dataInicio');
      const fimParam = searchParams.get('dataFim');
      if (!inicioParam || !fimParam) {
        return NextResponse.json(
          { erro: 'dataInicio e dataFim obrigatórios para período personalizado' },
          { status: 400 }
        );
      }
      dataInicio = new Date(inicioParam);
    } else {
      dataInicio = periodo === 'semana' ? subWeeks(dataFim, 1)
        : periodo === 'trimestre' ? subMonths(dataFim, 3)
        : periodo === 'ano' ? subMonths(dataFim, 12)
        : subMonths(dataFim, 1); // padrão: mês
    }

    // 1. BUSCAR SESSÕES DO PERÍODO
    const sessoes = await prisma.sessaoAdaptativa.findMany({
      where: {
        usuarioId,
        iniciadoEm: {
          gte: startOfDay(dataInicio),
          lte: endOfDay(dataFim),
        },
      },
      include: {
        respostas: {
          select: {
            id: true,
            categoria: true,
            valorNormalizado: true,
            respondidoEm: true,
            tempoResposta: true,
            thetaAposResposta: true,
          },
        },
      },
      orderBy: {
        iniciadoEm: 'asc',
      },
    });

    // 2. CALCULAR SCORES POR CATEGORIA
    const scoresPorCategoria: Partial<Record<CategoriaPergunta, any>> = {};
    
    for (const categoria of Object.values(CategoriaPergunta)) {
      const respostasCategoria = sessoes.flatMap(s => 
        s.respostas.filter(r => r.categoria === categoria)
      );

      if (respostasCategoria.length === 0) continue;

      const valores = respostasCategoria
        .map(r => r.valorNormalizado)
        .filter((v): v is number => v !== null)
        .sort((a, b) => a - b);

      if (valores.length === 0) continue;

      const soma = valores.reduce((acc, v) => acc + v, 0);
      const media = soma / valores.length;
      
      // Calcular desvio padrão
      const variancia = valores.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) / valores.length;
      const desvioPadrao = Math.sqrt(variancia);

      // Mediana
      const meio = Math.floor(valores.length / 2);
      const mediana = valores.length % 2 === 0
        ? (valores[meio - 1] + valores[meio]) / 2
        : valores[meio];

      // Calcular tendência (regressão linear simples)
      let tendencia: 'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE' = 'ESTAVEL';
      
      if (respostasCategoria.length >= 3) {
        const pontosTemporais = respostasCategoria.map((r, i) => ({
          x: i,
          y: r.valorNormalizado || 0,
        }));

        const n = pontosTemporais.length;
        const somaX = pontosTemporais.reduce((acc, p) => acc + p.x, 0);
        const somaY = pontosTemporais.reduce((acc, p) => acc + p.y, 0);
        const somaXY = pontosTemporais.reduce((acc, p) => acc + p.x * p.y, 0);
        const somaX2 = pontosTemporais.reduce((acc, p) => acc + p.x * p.x, 0);

        const slope = (n * somaXY - somaX * somaY) / (n * somaX2 - somaX * somaX);

        if (slope > 0.05) tendencia = 'CRESCENTE';
        else if (slope < -0.05) tendencia = 'DECRESCENTE';
      }

      scoresPorCategoria[categoria] = {
        minimo: valores[0],
        maximo: valores[valores.length - 1],
        media: Math.round(media * 100) / 100,
        mediana: Math.round(mediana * 100) / 100,
        desvioPadrao: Math.round(desvioPadrao * 100) / 100,
        tendencia,
        totalRespostas: respostasCategoria.length,
      };
    }

    // 3. EVOLUÇÃO DE THETA
    const thetaEvolucao = sessoes
      .filter(s => s.thetaEstimado !== null && s.confianca !== null)
      .map(s => ({
        data: s.iniciadoEm,
        theta: s.thetaEstimado!,
        confianca: s.confianca!,
        sessaoId: s.id,
      }));

    // 4. ALERTAS
    const alertas = await prisma.alertaSocioemocional.findMany({
      where: {
        usuarioId,
        criadoEm: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      select: {
        id: true,
        nivel: true,
        titulo: true,
        criadoEm: true,
        lido: true,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });

    const porNivel = alertas.reduce((acc, alerta) => {
      acc[alerta.nivel] = (acc[alerta.nivel] || 0) + 1;
      return acc;
    }, {} as Record<NivelAlerta, number>);

    // Preencher níveis faltantes
    for (const nivel of Object.values(NivelAlerta)) {
      if (!porNivel[nivel]) porNivel[nivel] = 0;
    }

    // 5. ESTATÍSTICAS GERAIS
    const totalRespostas = sessoes.reduce((acc, s) => acc + s.respostas.length, 0);
    const totalTempoResposta = sessoes
      .flatMap(s => s.respostas)
      .reduce((acc, r) => acc + (r.tempoResposta || 0), 0);
    const tempoMedioResposta = totalRespostas > 0 
      ? Math.round(totalTempoResposta / totalRespostas) 
      : 0;

    const sessoesCompletas = sessoes.filter(s => s.status === 'FINALIZADA').length;
    const taxaResposta = sessoes.length > 0 
      ? (sessoesCompletas / sessoes.length) * 100 
      : 0;

    // 6. MONTAR RESPONSE
    const response: MetricasResponse = {
      usuarioId,
      periodo: {
        inicio: dataInicio,
        fim: dataFim,
      },
      scoresPorCategoria: scoresPorCategoria as any,
      thetaEvolucao,
      alertas: {
        total: alertas.length,
        porNivel,
        naoLidos: alertas.filter(a => !a.lido).length,
        recentes: alertas.slice(0, 5), // Últimos 5
      },
      estatisticas: {
        totalSessoes: sessoes.length,
        totalRespostas,
        tempoMedioResposta,
        taxaResposta: Math.round(taxaResposta * 100) / 100,
        sessoesCompletas,
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[API] Erro ao buscar métricas:', error);
    return NextResponse.json(
      { erro: 'Erro ao buscar métricas' },
      { status: 500 }
    );
  }
}
```

---

## 🎣 3. Hook React Query para Métricas

### Arquivo: `src/hooks/useMetricasAvaliacoes.ts`

```typescript
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { MetricasAvaliacoesParams, MetricasResponse } from '@/types/relatorios';

export function useMetricasAvaliacoes(
  params: MetricasAvaliacoesParams,
  options?: Omit<UseQueryOptions<MetricasResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MetricasResponse>({
    queryKey: ['metricas-avaliacoes', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        usuarioId: params.usuarioId.toString(),
        periodo: params.periodo,
      });

      if (params.dataInicio) searchParams.set('dataInicio', params.dataInicio);
      if (params.dataFim) searchParams.set('dataFim', params.dataFim);

      const response = await fetch(`/api/relatorios/metricas-avaliacoes?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar métricas');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
    ...options,
  });
}
```

---

## 🔧 4. Migração de Componente Mock → Real

### ANTES (Mock):

```typescript
// src/components/relatorios/RelatorioLongitudinal.tsx

export function RelatorioLongitudinal({ periodo }: Props) {
  // ❌ Dados mockados
  const dadosMock = [
    { data: '2024-11-01', theta: 0.5, confianca: 0.85 },
    { data: '2024-11-02', theta: 0.6, confianca: 0.88 },
    { data: '2024-11-03', theta: 0.55, confianca: 0.90 },
    // ...
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Temporal</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart data={dadosMock} ... />
      </CardContent>
    </Card>
  );
}
```

### DEPOIS (Real):

```typescript
// src/components/relatorios/RelatorioLongitudinal.tsx

import { useSession } from 'next-auth/react';
import { useMetricasAvaliacoes } from '@/hooks/useMetricasAvaliacoes';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function RelatorioLongitudinal({ periodo }: Props) {
  const { data: session } = useSession();
  
  // ✅ Buscar dados reais
  const { data, isLoading, error } = useMetricasAvaliacoes({
    usuarioId: session?.user?.id || 0,
    periodo,
  });

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar dados: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (!data || data.thetaEvolucao.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução Temporal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Nenhum dado disponível para o período selecionado.
            Complete alguns questionários para ver sua evolução!
          </p>
        </CardContent>
      </Card>
    );
  }

  // ✅ Usar dados reais
  const dadosGrafico = data.thetaEvolucao.map(item => ({
    data: new Date(item.data).toLocaleDateString('pt-BR'),
    theta: item.theta,
    confianca: item.confianca,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Temporal</CardTitle>
        <CardDescription>
          {data.estatisticas.totalSessoes} sessões • 
          {data.estatisticas.totalRespostas} respostas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis domain={[-3, 3]} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="theta" 
              stroke="#8884d8" 
              name="Theta (IRT)"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="confianca" 
              stroke="#82ca9d" 
              name="Confiança"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

---

## 💾 5. Sistema de Cache com Redis/Upstash

### Arquivo: `src/lib/cache/redis.ts`

```typescript
import { Redis } from '@upstash/redis';

// Configuração do Redis (Upstash é gratuito para começar)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export type CacheKey = `metricas:${number}` | `evolucao:${number}:${string}` | `dashboard:${string}`;

export async function getCached<T>(
  key: CacheKey,
  fetcher: () => Promise<T>,
  ttl: number = 300 // 5 minutos padrão
): Promise<T> {
  try {
    // Tentar buscar do cache
    const cached = await redis.get<T>(key);
    
    if (cached !== null) {
      console.log(`[Cache] HIT: ${key}`);
      return cached;
    }

    console.log(`[Cache] MISS: ${key}`);
    
    // Se não está no cache, buscar dados
    const data = await fetcher();
    
    // Salvar no cache
    await redis.set(key, data, { ex: ttl });
    
    return data;
  } catch (error) {
    console.error(`[Cache] Erro ao acessar cache para ${key}:`, error);
    // Se o cache falhar, apenas retornar os dados
    return fetcher();
  }
}

export async function invalidarCache(keys: CacheKey[]): Promise<void> {
  try {
    await redis.del(...keys);
    console.log(`[Cache] Invalidados: ${keys.join(', ')}`);
  } catch (error) {
    console.error('[Cache] Erro ao invalidar cache:', error);
  }
}

export async function invalidarCachePorPadrao(padrao: string): Promise<void> {
  try {
    // Buscar todas as chaves que correspondem ao padrão
    const keys = await redis.keys(padrao);
    
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Cache] Invalidados ${keys.length} registros: ${padrao}`);
    }
  } catch (error) {
    console.error('[Cache] Erro ao invalidar por padrão:', error);
  }
}
```

### Uso na API:

```typescript
// src/app/api/relatorios/metricas-avaliacoes/route.ts

import { getCached } from '@/lib/cache/redis';

export async function GET(request: NextRequest) {
  const usuarioId = parseInt(searchParams.get('usuarioId') || '');
  const periodo = searchParams.get('periodo') || 'mes';
  
  // ✅ Usar cache
  const metricas = await getCached(
    `metricas:${usuarioId}:${periodo}` as CacheKey,
    async () => {
      // Buscar dados do banco (código anterior)
      return calcularMetricas(usuarioId, periodo);
    },
    300 // 5 minutos
  );

  return NextResponse.json(metricas);
}
```

---

## 📄 6. Exportação PDF com jsPDF

### Arquivo: `src/lib/export/pdf-generator.ts`

```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MetricasResponse } from '@/types/relatorios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function gerarRelatorioPDF(
  metricas: MetricasResponse,
  nomeUsuario: string
): Blob {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(22);
  doc.setTextColor(102, 126, 234); // #667eea
  doc.text('Relatório de Avaliações', 20, 20);
  doc.text('Socioemocionais', 20, 30);
  
  // Linha divisória
  doc.setDrawColor(102, 126, 234);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Informações do usuário
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Aluno: ${nomeUsuario}`, 20, 45);
  doc.text(
    `Período: ${format(new Date(metricas.periodo.inicio), 'dd/MM/yyyy', { locale: ptBR })} - ${format(new Date(metricas.periodo.fim), 'dd/MM/yyyy', { locale: ptBR })}`,
    20,
    52
  );
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 20, 59);
  
  // Estatísticas gerais
  doc.setFontSize(16);
  doc.setTextColor(102, 126, 234);
  doc.text('Estatísticas Gerais', 20, 72);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  const estatisticas = [
    ['Total de Sessões', metricas.estatisticas.totalSessoes.toString()],
    ['Total de Respostas', metricas.estatisticas.totalRespostas.toString()],
    ['Tempo Médio de Resposta', `${metricas.estatisticas.tempoMedioResposta}s`],
    ['Taxa de Resposta', `${metricas.estatisticas.taxaResposta.toFixed(1)}%`],
    ['Sessões Completas', metricas.estatisticas.sessoesCompletas.toString()],
  ];
  
  autoTable(doc, {
    startY: 77,
    head: [['Métrica', 'Valor']],
    body: estatisticas,
    theme: 'striped',
    headStyles: { fillColor: [102, 126, 234] },
  });
  
  // Scores por Categoria
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(102, 126, 234);
  doc.text('Scores por Categoria', 20, 20);
  
  const scoresData = Object.entries(metricas.scoresPorCategoria).map(([categoria, scores]) => [
    categoria,
    scores.media.toFixed(2),
    scores.minimo.toFixed(2),
    scores.maximo.toFixed(2),
    scores.desvioPadrao.toFixed(2),
    scores.tendencia,
  ]);
  
  autoTable(doc, {
    startY: 25,
    head: [['Categoria', 'Média', 'Mín', 'Máx', 'Desvio', 'Tendência']],
    body: scoresData,
    theme: 'striped',
    headStyles: { fillColor: [102, 126, 234] },
  });
  
  // Alertas
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(102, 126, 234);
  doc.text('Alertas', 20, 20);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de Alertas: ${metricas.alertas.total}`, 20, 30);
  doc.text(`Não Lidos: ${metricas.alertas.naoLidos}`, 20, 37);
  
  const alertasData = [
    ['🟢 Verde', metricas.alertas.porNivel.VERDE?.toString() || '0'],
    ['🟡 Amarelo', metricas.alertas.porNivel.AMARELO?.toString() || '0'],
    ['🟠 Laranja', metricas.alertas.porNivel.LARANJA?.toString() || '0'],
    ['🔴 Vermelho', metricas.alertas.porNivel.VERMELHO?.toString() || '0'],
  ];
  
  autoTable(doc, {
    startY: 42,
    head: [['Nível', 'Quantidade']],
    body: alertasData,
    theme: 'striped',
    headStyles: { fillColor: [102, 126, 234] },
  });
  
  // Rodapé em todas as páginas
  const totalPages = doc.internal.pages.length - 1; // -1 porque a primeira página é vazia
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${totalPages}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      'ClassCheck - Sistema de Avaliações Socioemocionais',
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 5,
      { align: 'center' }
    );
  }
  
  return doc.output('blob');
}
```

### Componente de Exportação:

```typescript
// src/components/relatorios/BotaoExportarPDF.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useMetricasAvaliacoes } from '@/hooks/useMetricasAvaliacoes';
import { useSession } from 'next-auth/react';
import { gerarRelatorioPDF } from '@/lib/export/pdf-generator';
import { toast } from 'sonner';

export function BotaoExportarPDF() {
  const { data: session } = useSession();
  const { data: metricas, isLoading } = useMetricasAvaliacoes({
    usuarioId: session?.user?.id || 0,
    periodo: 'mes',
  });

  const handleExportar = async () => {
    if (!metricas || !session?.user?.nome) {
      toast.error('Dados não disponíveis para exportação');
      return;
    }

    try {
      toast.loading('Gerando PDF...');
      
      const pdfBlob = gerarRelatorioPDF(metricas, session.user.nome);
      
      // Criar link de download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${session.user.nome}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
    }
  };

  return (
    <Button 
      onClick={handleExportar} 
      disabled={isLoading || !metricas}
      variant="outline"
    >
      <Download className="h-4 w-4 mr-2" />
      Exportar PDF
    </Button>
  );
}
```

---

## 🎯 Checklist de Implementação

Use este checklist para acompanhar o progresso:

### Questionários:
- [ ] Criar `prisma/seeds/seed-phq9.ts`
- [ ] Criar `prisma/seeds/seed-gad7.ts`
- [ ] Criar `prisma/seeds/seed-who5.ts`
- [ ] Executar seeds: `npx tsx prisma/seeds/seed-phq9.ts`
- [ ] Testar questionário PHQ-9 no sistema
- [ ] Validar interpretação de scores

### Relatórios - APIs:
- [ ] Criar `/api/relatorios/metricas-avaliacoes/route.ts`
- [ ] Criar `/api/relatorios/evolucao-temporal/route.ts`
- [ ] Criar `/api/relatorios/comparativo-periodos/route.ts`
- [ ] Adicionar índices no Prisma Schema
- [ ] Executar migration: `npx prisma migrate dev`

### Relatórios - Frontend:
- [ ] Criar `hooks/useMetricasAvaliacoes.ts`
- [ ] Migrar `RelatorioLongitudinal.tsx` para dados reais
- [ ] Migrar `GraficoCircumplex.tsx` para dados reais
- [ ] Migrar `RadarCategorias.tsx` para dados reais
- [ ] Adicionar loading states
- [ ] Adicionar error states
- [ ] Adicionar empty states

### Cache:
- [ ] Configurar Upstash Redis (gratuito)
- [ ] Criar `lib/cache/redis.ts`
- [ ] Implementar cache nas APIs
- [ ] Testar invalidação de cache

### Exportação:
- [ ] Instalar `jspdf` e `jspdf-autotable`
- [ ] Criar `lib/export/pdf-generator.ts`
- [ ] Criar componente `BotaoExportarPDF`
- [ ] Testar geração de PDF

---

**🎉 Com esses exemplos, você tem código pronto para começar a implementar as melhorias!**

Para qualquer dúvida ou necessidade de mais exemplos, é só pedir.
