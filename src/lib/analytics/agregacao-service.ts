/**
 * Serviço de Agregação de Métricas Socioemocionais
 * 
 * Pré-agrega dados de sessões para otimizar queries de relatórios.
 * Executa agregações por período (diária, semanal, mensal, trimestral, anual).
 */

import { prisma } from '../prisma';
import { CategoriaPergunta, GranularidadeMetrica } from '@prisma/client';

/**
 * Calcula período de agregação com base na granularidade
 */
function calcularPeriodo(granularidade: GranularidadeMetrica, dataReferencia: Date = new Date()): { inicio: Date; fim: Date } {
  const inicio = new Date(dataReferencia);
  const fim = new Date(dataReferencia);

  switch (granularidade) {
    case 'DIARIA':
      inicio.setHours(0, 0, 0, 0);
      fim.setHours(23, 59, 59, 999);
      break;

    case 'SEMANAL':
      // Início da semana (domingo)
      const diaSemana = inicio.getDay();
      inicio.setDate(inicio.getDate() - diaSemana);
      inicio.setHours(0, 0, 0, 0);
      // Fim da semana (sábado)
      fim.setDate(inicio.getDate() + 6);
      fim.setHours(23, 59, 59, 999);
      break;

    case 'MENSAL':
      inicio.setDate(1);
      inicio.setHours(0, 0, 0, 0);
      fim.setMonth(fim.getMonth() + 1);
      fim.setDate(0); // Último dia do mês
      fim.setHours(23, 59, 59, 999);
      break;

    case 'TRIMESTRAL':
      const mesAtual = inicio.getMonth();
      const trimestreInicio = Math.floor(mesAtual / 3) * 3;
      inicio.setMonth(trimestreInicio);
      inicio.setDate(1);
      inicio.setHours(0, 0, 0, 0);
      fim.setMonth(trimestreInicio + 3);
      fim.setDate(0);
      fim.setHours(23, 59, 59, 999);
      break;

    case 'ANUAL':
      inicio.setMonth(0);
      inicio.setDate(1);
      inicio.setHours(0, 0, 0, 0);
      fim.setMonth(11);
      fim.setDate(31);
      fim.setHours(23, 59, 59, 999);
      break;
  }

  return { inicio, fim };
}

/**
 * Calcula estatísticas descritivas de um array de números
 */
function calcularEstatisticas(valores: number[]) {
  if (valores.length === 0) {
    return {
      minimo: 0,
      maximo: 0,
      medio: 0,
      mediana: 0,
      desvioPadrao: 0
    };
  }

  const ordenados = [...valores].sort((a, b) => a - b);
  const minimo = ordenados[0];
  const maximo = ordenados[ordenados.length - 1];
  const medio = valores.reduce((a, b) => a + b, 0) / valores.length;

  // Mediana
  const meio = Math.floor(ordenados.length / 2);
  const mediana = ordenados.length % 2 === 0
    ? (ordenados[meio - 1] + ordenados[meio]) / 2
    : ordenados[meio];

  // Desvio padrão
  const variancia = valores.reduce((acc, val) => acc + Math.pow(val - medio, 2), 0) / valores.length;
  const desvioPadrao = Math.sqrt(variancia);

  return { minimo, maximo, medio, mediana, desvioPadrao };
}

/**
 * Agrega métricas para um usuário e período específico
 */
export async function agregarMetricasUsuario(
  usuarioId: number,
  granularidade: GranularidadeMetrica,
  dataReferencia?: Date
): Promise<void> {
  const { inicio, fim } = calcularPeriodo(granularidade, dataReferencia);

  // Buscar sessões do período
  const sessoes = await prisma.sessaoAdaptativa.findMany({
    where: {
      usuarioId,
      iniciadoEm: {
        gte: inicio,
        lte: fim
      },
      status: 'FINALIZADA'
    },
    include: {
      respostas: {
        include: {
          pergunta: true
        }
      }
    }
  });

  if (sessoes.length === 0) {
    console.log(`Nenhuma sessão encontrada para usuário ${usuarioId} no período ${inicio} - ${fim}`);
    return;
  }

  // Agrupar por categoria
  const categorias = Object.values(CategoriaPergunta);

  for (const categoria of categorias) {
    await agregarPorCategoria(usuarioId, categoria, granularidade, inicio, fim, sessoes);
  }

  // Agregar métricas gerais (sem categoria específica)
  await agregarGeral(usuarioId, granularidade, inicio, fim, sessoes);
}

/**
 * Agrega métricas para uma categoria específica
 */
async function agregarPorCategoria(
  usuarioId: number,
  categoria: CategoriaPergunta,
  granularidade: GranularidadeMetrica,
  periodoInicio: Date,
  periodoFim: Date,
  sessoes: any[]
) {
  // Filtrar respostas da categoria
  const respostasCategoria = sessoes.flatMap(s =>
    s.respostas.filter((r: any) => r.categoria === categoria)
  );

  if (respostasCategoria.length === 0) {
    return;
  }

  // Calcular scores
  const scores = respostasCategoria
    .filter((r: any) => r.valorNumerico !== null)
    .map((r: any) => r.valorNumerico * 10); // Normalizar para 0-10

  const estatisticas = calcularEstatisticas(scores);

  // Calcular theta
  const thetas = sessoes
    .filter(s => s.thetaEstimado !== null)
    .map(s => s.thetaEstimado);
  const thetaStats = calcularEstatisticas(thetas);

  // Calcular Circumplex (valência e ativação)
  const valencias = respostasCategoria
    .filter((r: any) => r.valencia !== null)
    .map((r: any) => r.valencia);
  const ativacoes = respostasCategoria
    .filter((r: any) => r.ativacao !== null)
    .map((r: any) => r.ativacao);

  const valenciaMedia = valencias.length > 0
    ? valencias.reduce((a, b) => a + b, 0) / valencias.length
    : null;
  const ativacaoMedia = ativacoes.length > 0
    ? ativacoes.reduce((a, b) => a + b, 0) / ativacoes.length
    : null;

  // Tempo médio de resposta
  const tempos = respostasCategoria
    .filter((r: any) => r.tempoResposta > 0)
    .map((r: any) => r.tempoResposta / 1000); // converter para segundos
  const tempoMedio = tempos.length > 0
    ? tempos.reduce((a, b) => a + b, 0) / tempos.length
    : null;

  // Calcular tendência (comparar com período anterior)
  const periodoAnterior = calcularPeriodoAnterior(granularidade, periodoInicio);
  const metricaAnterior = await prisma.metricaSocioemocional.findFirst({
    where: {
      usuarioId,
      categoria,
      granularidade,
      periodoInicio: periodoAnterior.inicio
    }
  });

  let tendencia: string | null = null;
  let variacaoPercent: number | null = null;

  if (metricaAnterior) {
    const delta = estatisticas.medio - metricaAnterior.scoreMedio;
    variacaoPercent = (delta / metricaAnterior.scoreMedio) * 100;

    if (Math.abs(variacaoPercent) < 5) {
      tendencia = 'ESTAVEL';
    } else if (variacaoPercent > 0) {
      tendencia = 'ASCENDENTE';
    } else {
      tendencia = 'DESCENDENTE';
    }
  }

  // Contar alertas do período
  const alertas = await prisma.alertaSocioemocional.findMany({
    where: {
      usuarioId,
      categoria,
      criadoEm: {
        gte: periodoInicio,
        lte: periodoFim
      }
    }
  });

  const alertasVermelhos = alertas.filter(a => a.nivel === 'VERMELHO').length;
  const alertasLaranjas = alertas.filter(a => a.nivel === 'LARANJA').length;
  const alertasAmarelos = alertas.filter(a => a.nivel === 'AMARELO').length;

  // Upsert métrica
  await prisma.metricaSocioemocional.upsert({
    where: {
      usuarioId_categoria_granularidade_periodoInicio: {
        usuarioId,
        categoria,
        granularidade,
        periodoInicio
      }
    },
    update: {
      periodoFim,
      scoreMinimo: estatisticas.minimo,
      scoreMaximo: estatisticas.maximo,
      scoreMedio: estatisticas.medio,
      scoreMediana: estatisticas.mediana,
      desvioPadrao: estatisticas.desvioPadrao,
      thetaMedio: thetaStats.medio,
      thetaMinimo: thetaStats.minimo,
      thetaMaximo: thetaStats.maximo,
      confiancaMedia: sessoes.reduce((acc, s) => acc + (s.confianca || 0), 0) / sessoes.length,
      valenciaMedia,
      ativacaoMedia,
      totalSessoes: sessoes.length,
      totalRespostas: respostasCategoria.length,
      taxaResposta: (respostasCategoria.length / (sessoes.length * 10)) * 100, // assumindo ~10 perguntas por sessão
      tempoMedioResposta: tempoMedio,
      tendencia,
      variacaoPercent,
      alertasVermelhos,
      alertasLaranjas,
      alertasAmarelos,
      calculadoEm: new Date()
    },
    create: {
      usuarioId,
      periodoInicio,
      periodoFim,
      granularidade,
      categoria,
      scoreMinimo: estatisticas.minimo,
      scoreMaximo: estatisticas.maximo,
      scoreMedio: estatisticas.medio,
      scoreMediana: estatisticas.mediana,
      desvioPadrao: estatisticas.desvioPadrao,
      thetaMedio: thetaStats.medio,
      thetaMinimo: thetaStats.minimo,
      thetaMaximo: thetaStats.maximo,
      confiancaMedia: sessoes.reduce((acc, s) => acc + (s.confianca || 0), 0) / sessoes.length,
      valenciaMedia,
      ativacaoMedia,
      totalSessoes: sessoes.length,
      totalRespostas: respostasCategoria.length,
      taxaResposta: (respostasCategoria.length / (sessoes.length * 10)) * 100,
      tempoMedioResposta: tempoMedio,
      tendencia,
      variacaoPercent,
      alertasVermelhos,
      alertasLaranjas,
      alertasAmarelos
    }
  });

  console.log(`✅ Métrica agregada: usuário=${usuarioId}, categoria=${categoria}, período=${periodoInicio.toISOString().split('T')[0]}`);
}

/**
 * Agrega métricas gerais (todas as categorias)
 */
async function agregarGeral(
  usuarioId: number,
  granularidade: GranularidadeMetrica,
  periodoInicio: Date,
  periodoFim: Date,
  sessoes: any[]
) {
  const todasRespostas = sessoes.flatMap(s => s.respostas);

  if (todasRespostas.length === 0) {
    return;
  }

  const scores = todasRespostas
    .filter((r: any) => r.valorNumerico !== null)
    .map((r: any) => r.valorNumerico * 10);

  const estatisticas = calcularEstatisticas(scores);

  const thetas = sessoes
    .filter(s => s.thetaEstimado !== null)
    .map(s => s.thetaEstimado);
  const thetaStats = calcularEstatisticas(thetas);

  // Upsert métrica geral (sem categoria)
  await prisma.metricaSocioemocional.upsert({
    where: {
      usuarioId_categoria_granularidade_periodoInicio: {
        usuarioId,
        categoria: null as any, // TypeScript hack, o schema permite null
        granularidade,
        periodoInicio
      }
    },
    update: {
      periodoFim,
      scoreMinimo: estatisticas.minimo,
      scoreMaximo: estatisticas.maximo,
      scoreMedio: estatisticas.medio,
      scoreMediana: estatisticas.mediana,
      desvioPadrao: estatisticas.desvioPadrao,
      thetaMedio: thetaStats.medio,
      thetaMinimo: thetaStats.minimo,
      thetaMaximo: thetaStats.maximo,
      totalSessoes: sessoes.length,
      totalRespostas: todasRespostas.length,
      calculadoEm: new Date()
    },
    create: {
      usuarioId,
      periodoInicio,
      periodoFim,
      granularidade,
      categoria: null as any,
      scoreMinimo: estatisticas.minimo,
      scoreMaximo: estatisticas.maximo,
      scoreMedio: estatisticas.medio,
      scoreMediana: estatisticas.mediana,
      desvioPadrao: estatisticas.desvioPadrao,
      thetaMedio: thetaStats.medio,
      thetaMinimo: thetaStats.minimo,
      thetaMaximo: thetaStats.maximo,
      totalSessoes: sessoes.length,
      totalRespostas: todasRespostas.length
    }
  });

  console.log(`✅ Métrica geral agregada: usuário=${usuarioId}, período=${periodoInicio.toISOString().split('T')[0]}`);
}

/**
 * Calcula período anterior com base na granularidade
 */
function calcularPeriodoAnterior(granularidade: GranularidadeMetrica, dataReferencia: Date): { inicio: Date; fim: Date } {
  const data = new Date(dataReferencia);

  switch (granularidade) {
    case 'DIARIA':
      data.setDate(data.getDate() - 1);
      break;
    case 'SEMANAL':
      data.setDate(data.getDate() - 7);
      break;
    case 'MENSAL':
      data.setMonth(data.getMonth() - 1);
      break;
    case 'TRIMESTRAL':
      data.setMonth(data.getMonth() - 3);
      break;
    case 'ANUAL':
      data.setFullYear(data.getFullYear() - 1);
      break;
  }

  return calcularPeriodo(granularidade, data);
}

/**
 * Agrega métricas para todos os usuários ativos
 */
export async function agregarMetricasTodosUsuarios(granularidade: GranularidadeMetrica): Promise<void> {
  const usuarios = await prisma.usuario.findMany({
    where: { ativo: true },
    select: { id: true }
  });

  console.log(`Iniciando agregação ${granularidade} para ${usuarios.length} usuários...`);

  for (const usuario of usuarios) {
    try {
      await agregarMetricasUsuario(usuario.id, granularidade);
    } catch (error) {
      console.error(`Erro ao agregar métricas do usuário ${usuario.id}:`, error);
    }
  }

  console.log(`✅ Agregação ${granularidade} concluída!`);
}

/**
 * Busca métricas agregadas
 */
export async function buscarMetricasAgregadas(
  usuarioId: number,
  granularidade: GranularidadeMetrica,
  categoria?: CategoriaPergunta,
  limite: number = 10
) {
  return prisma.metricaSocioemocional.findMany({
    where: {
      usuarioId,
      granularidade,
      ...(categoria && { categoria })
    },
    orderBy: {
      periodoInicio: 'desc'
    },
    take: limite
  });
}
