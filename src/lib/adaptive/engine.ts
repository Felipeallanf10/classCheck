/**
 * Motor de Regras Adaptativas
 * 
 * Sistema baseado em json-rules-engine para adaptação inteligente de questionários.
 * Suporta 12 tipos de condições e 8 tipos de ações.
 * 
 * @see https://github.com/CacheControl/json-rules-engine
 */

import { Engine, Rule, RuleProperties } from 'json-rules-engine';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==============================================
// TIPOS E INTERFACES
// ==============================================

export interface AdaptiveFacts {
  // Resposta atual (alias para respostaAtual - compatibilidade com regras)
  resposta?: {
    perguntaId: string;
    valor: any;
    valorNormalizado: number;
    valorLength?: number;
    categoria: string;
    dominio: string;
  };
  
  // Resposta atual
  respostaAtual?: {
    perguntaId: string;
    valor: any;
    valorNormalizado: number;
    valorLength?: number;
    categoria: string;
    dominio: string;
  };
  
  // Histórico de respostas
  respostas: Array<{
    perguntaId: string;
    valor: any;
    valorNormalizado: number;
    categoria: string;
    dominio: string;
    timestamp: Date;
  }>;
  
  // Scores por categoria
  scores: {
    humor?: number;
    ansiedade?: number;
    depressao?: number;
    estresse?: number;
    sono?: number;
    concentracao?: number;
    motivacao?: number;
    relacionamentos?: number;
    autoestima?: number;
    energia?: number;
  };
  
  // Médias históricas do usuário (últimos 30 dias)
  mediasHistoricas: {
    humor?: number;
    ansiedade?: number;
    estresse?: number;
    sono?: number;
  };
  
  // IRT (Item Response Theory)
  irt?: {
    theta: number;        // Nível estimado do traço latente
    erro: number;         // Erro padrão da estimativa
    confianca: number;    // Confiança da medição (0-1)
  };
  
  // Contexto da sessão
  sessao: {
    sessaoId: string;
    questionarioId: string;
    usuarioId: number;
    perguntasRespondidas: number;
    totalPerguntas: number;
    progresso: number;
    nivelAlerta: 'VERDE' | 'AMARELO' | 'LARANJA' | 'VERMELHO';
  };
  
  // Padrões temporais
  padroes?: {
    tendencia7dias?: 'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE';
    tendencia30dias?: 'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE';
    volatilidade?: 'BAIXA' | 'MEDIA' | 'ALTA';
  };
}

export interface AdaptiveAction {
  type: 'INSERIR_PERGUNTA' | 'PULAR_SECAO' | 'FINALIZAR_QUESTIONARIO' | 
        'BUSCAR_BANCO' | 'CRIAR_ALERTA' | 'GERAR_ALERTA' | 'NOTIFICAR_PROFISSIONAL' | 
        'ALTERAR_FLUXO' | 'RECOMENDAR_RECURSO' | 'SUGERIR_QUESTIONARIO';
  params: Record<string, any>;
}

export interface RuleEvent {
  type: string;
  params: {
    regraNome: string;
    regraId: string;
    acoes: AdaptiveAction[];
    prioridade: number;
  };
}

// ==============================================
// OPERADORES CUSTOMIZADOS
// ==============================================

/**
 * Operador: inRange
 * Verifica se valor está dentro de um range
 * 
 * @example
 * { "fact": "scores.ansiedade", "operator": "inRange", "value": { "min": 5, "max": 10 } }
 */
export const inRangeOperator = (factValue: number, jsonValue: { min: number; max: number }) => {
  if (typeof factValue !== 'number') return false;
  return factValue >= jsonValue.min && factValue <= jsonValue.max;
};

/**
 * Operador: contains
 * Verifica se array contém valor específico
 * 
 * @example
 * { "fact": "respostas", "operator": "contains", "value": { "categoria": "ANSIEDADE" } }
 */
export const containsOperator = (factValue: any[], jsonValue: Record<string, any>) => {
  if (!Array.isArray(factValue)) return false;
  
  return factValue.some(item => {
    return Object.keys(jsonValue).every(key => {
      return item[key] === jsonValue[key];
    });
  });
};

/**
 * Operador: includesValue
 * Verifica se um array de valores primitivos contém um valor específico
 * 
 * @example
 * { "fact": "resposta", "operator": "includesValue", "path": "$.valor", "value": "familia" }
 */
export const includesValueOperator = (factValue: any, jsonValue: any) => {
  if (!Array.isArray(factValue)) return false;
  return factValue.includes(jsonValue);
};

/**
 * Operador: trendDown
 * Verifica se há tendência decrescente nos últimos N valores
 * 
 * @example
 * { "fact": "respostas", "operator": "trendDown", "value": { "categoria": "HUMOR_GERAL", "ultimos": 7 } }
 */
export const trendDownOperator = (factValue: any[], jsonValue: { categoria: string; ultimos: number }) => {
  if (!Array.isArray(factValue)) return false;
  
  // Filtrar por categoria e pegar últimos N
  const valores = factValue
    .filter(r => r.categoria === jsonValue.categoria)
    .slice(-jsonValue.ultimos)
    .map(r => r.valorNormalizado);
  
  if (valores.length < 3) return false; // Precisa de pelo menos 3 valores
  
  // Calcular se há tendência decrescente (regressão linear simples)
  const n = valores.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  valores.forEach((y, x) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  // Tendência decrescente se slope < -0.1
  return slope < -0.1;
};

/**
 * Operador: trendUp
 * Verifica se há tendência crescente nos últimos N valores
 */
export const trendUpOperator = (factValue: any[], jsonValue: { categoria: string; ultimos: number }) => {
  if (!Array.isArray(factValue)) return false;
  
  const valores = factValue
    .filter(r => r.categoria === jsonValue.categoria)
    .slice(-jsonValue.ultimos)
    .map(r => r.valorNormalizado);
  
  if (valores.length < 3) return false;
  
  const n = valores.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  valores.forEach((y, x) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  return slope > 0.1;
};

/**
 * Operador: deviatesFrom
 * Verifica se valor desvia mais de N desvios padrão da média
 * 
 * @example
 * { "fact": "scores.ansiedade", "operator": "deviatesFrom", "value": { "media": 5, "desvios": 2 } }
 */
export const deviatesFromOperator = (factValue: number, jsonValue: { media: number; desvios: number }) => {
  if (typeof factValue !== 'number') return false;
  
  const mediaHistorica = jsonValue.media;
  const desviosPadrao = jsonValue.desvios;
  
  // Assumindo desvio padrão de ~2 para escalas 0-10
  const threshold = desviosPadrao * 2;
  
  return Math.abs(factValue - mediaHistorica) > threshold;
};

/**
 * Operador: hasPattern
 * Verifica se há padrão específico nas respostas
 * 
 * @example
 * { "fact": "respostas", "operator": "hasPattern", "value": { "pattern": "TODAS_BAIXAS", "categoria": "HUMOR_GERAL" } }
 */
export const hasPatternOperator = (factValue: any[], jsonValue: { pattern: string; categoria?: string }) => {
  if (!Array.isArray(factValue)) return false;
  
  let valores = factValue;
  if (jsonValue.categoria) {
    valores = factValue.filter(r => r.categoria === jsonValue.categoria);
  }
  
  const valoresNormalizados = valores.map(r => r.valorNormalizado);
  
  switch (jsonValue.pattern) {
    case 'TODAS_BAIXAS':
      // Todos valores < 0.3
      return valoresNormalizados.every(v => v < 0.3);
      
    case 'TODAS_ALTAS':
      // Todos valores > 0.7
      return valoresNormalizados.every(v => v > 0.7);
      
    case 'VOLATILIDADE_ALTA':
      // Variância alta
      if (valoresNormalizados.length < 3) return false;
      const media = valoresNormalizados.reduce((a, b) => a + b, 0) / valoresNormalizados.length;
      const variancia = valoresNormalizados.reduce((sum, v) => sum + Math.pow(v - media, 2), 0) / valoresNormalizados.length;
      return variancia > 0.1;
      
    case 'CONSISTENTE':
      // Baixa variância
      if (valoresNormalizados.length < 3) return false;
      const m = valoresNormalizados.reduce((a, b) => a + b, 0) / valoresNormalizados.length;
      const v = valoresNormalizados.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / valoresNormalizados.length;
      return v < 0.05;
      
    default:
      return false;
  }
};

/**
 * Operador: multipleConditions
 * Verifica múltiplas condições em categorias diferentes
 * 
 * @example
 * { "fact": "scores", "operator": "multipleConditions", "value": { "conditions": [
 *   { "categoria": "ansiedade", "operator": ">", "value": 7 },
 *   { "categoria": "sono", "operator": "<", "value": 3 }
 * ]}}
 */
export const multipleConditionsOperator = (factValue: Record<string, number>, jsonValue: { conditions: Array<{ categoria: string; operator: string; value: number }> }) => {
  if (typeof factValue !== 'object') return false;
  
  return jsonValue.conditions.every(condition => {
    const value = factValue[condition.categoria];
    if (typeof value !== 'number') return false;
    
    switch (condition.operator) {
      case '>': return value > condition.value;
      case '>=': return value >= condition.value;
      case '<': return value < condition.value;
      case '<=': return value <= condition.value;
      case '==': return value === condition.value;
      case '!=': return value !== condition.value;
      default: return false;
    }
  });
};

// ==============================================
// ENGINE FACTORY
// ==============================================

/**
 * Cria e configura uma instância do motor de regras
 */
export function createAdaptiveEngine(): Engine {
  const engine = new Engine();
  
  // Registrar operadores customizados
  engine.addOperator('inRange', inRangeOperator);
  engine.addOperator('contains', containsOperator);
  engine.addOperator('includesValue', includesValueOperator);
  engine.addOperator('trendDown', trendDownOperator);
  engine.addOperator('trendUp', trendUpOperator);
  engine.addOperator('deviatesFrom', deviatesFromOperator);
  engine.addOperator('hasPattern', hasPatternOperator);
  engine.addOperator('multipleConditions', multipleConditionsOperator);
  
  return engine;
}

// ==============================================
// CARREGADOR DE REGRAS DO PRISMA
// ==============================================

/**
 * Carrega regras do banco de dados e adiciona ao engine
 * 
 * @param engine - Instância do Engine
 * @param questionarioId - ID do questionário
 */
export async function loadRulesFromDatabase(
  engine: Engine,
  questionarioId: string
): Promise<void> {
  const regras = await prisma.regraAdaptacao.findMany({
    where: {
      questionarioId,
      ativo: true
    },
    orderBy: {
      prioridade: 'desc' // Maior prioridade primeiro
    }
  });
  
  for (const regra of regras) {
    const ruleProperties: RuleProperties = {
      conditions: regra.condicoes as any,
      event: {
        type: regra.nome,
        params: {
          regraNome: regra.nome,
          regraId: regra.id,
          acoes: regra.acoes as unknown as AdaptiveAction[],
          prioridade: regra.prioridade
        }
      },
      priority: regra.prioridade,
      name: regra.nome
    };
    
    engine.addRule(ruleProperties);
  }
  
  console.log(`✅ Carregadas ${regras.length} regras para questionário ${questionarioId}`);
}

/**
 * Remove todas as regras do engine
 */
export function clearEngineRules(engine: Engine): void {
  // @ts-ignore - removeRule não está nos tipos mas existe
  engine.rules.forEach((rule: Rule) => engine.removeRule(rule));
}

// ==============================================
// EXECUTAR REGRAS
// ==============================================

/**
 * Executa o motor de regras com os facts fornecidos
 * 
 * @param engine - Instância do Engine
 * @param facts - Facts para avaliar
 * @returns Eventos acionados
 */
export async function runEngine(
  engine: Engine,
  facts: AdaptiveFacts
): Promise<RuleEvent[]> {
  try {
    const { events } = await engine.run(facts);
    
    console.log(`[runEngine] ${events.length} regras acionadas`);
    
    // Registrar regras acionadas no banco
    for (const event of events) {
      const params = event.params as RuleEvent['params'];
      
      console.log(`[runEngine] Regra acionada: ${params.regraNome}`, params.acoes);
      
      await prisma.regraAdaptacao.update({
        where: { id: params.regraId },
        data: {
          vezesAcionada: { increment: 1 },
          ultimoAcionamento: new Date()
        }
      });
    }
    
    return events.map(e => e as RuleEvent);
  } catch (error) {
    console.error('❌ Erro ao executar motor de regras:', error);
    throw error;
  }
}

// ==============================================
// HELPERS
// ==============================================

/**
 * Calcula scores por categoria a partir das respostas
 */
export function calcularScoresPorCategoria(respostas: AdaptiveFacts['respostas']): AdaptiveFacts['scores'] {
  const scores: AdaptiveFacts['scores'] = {};
  
  // Agrupar por categoria
  const porCategoria = respostas.reduce((acc, resposta) => {
    const cat = resposta.categoria.toLowerCase();
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(resposta.valorNormalizado);
    return acc;
  }, {} as Record<string, number[]>);
  
  // Calcular média por categoria
  for (const [categoria, valores] of Object.entries(porCategoria)) {
    const media = valores.reduce((a, b) => a + b, 0) / valores.length;
    // Converter para escala 0-10
    (scores as any)[categoria] = media * 10;
  }
  
  return scores;
}

/**
 * Normaliza valor para escala 0-1 baseado no tipo de pergunta
 */
export function normalizarValor(
  valor: any,
  tipoPergunta: string,
  escalaNome?: string
): number {
  switch (tipoPergunta) {
    case 'LIKERT_5':
      return (Number(valor) - 1) / 4; // 1-5 → 0-1
      
    case 'LIKERT_7':
      return (Number(valor) - 1) / 6; // 1-7 → 0-1
      
    case 'LIKERT_10':
      return Number(valor) / 10; // 0-10 → 0-1
      
    case 'SIM_NAO':
      return valor === true || valor === 'sim' ? 1 : 0;
      
    case 'ESCALA_VISUAL':
    case 'SLIDER_NUMERICO':
      return Number(valor) / 100; // Assume 0-100
      
    case 'ESCALA_FREQUENCIA':
      // "Nunca" (0), "Raramente" (0.25), "Às vezes" (0.5), "Frequentemente" (0.75), "Sempre" (1)
      const frequenciaMap: Record<string, number> = {
        'nunca': 0,
        'raramente': 0.25,
        'as_vezes': 0.5,
        'frequentemente': 0.75,
        'sempre': 1
      };
      return frequenciaMap[String(valor).toLowerCase()] ?? 0.5;
      
    case 'ESCALA_INTENSIDADE':
      // "Nada" (0), "Pouco" (0.25), "Moderado" (0.5), "Muito" (0.75), "Extremamente" (1)
      const intensidadeMap: Record<string, number> = {
        'nada': 0,
        'pouco': 0.25,
        'moderado': 0.5,
        'muito': 0.75,
        'extremamente': 1
      };
      return intensidadeMap[String(valor).toLowerCase()] ?? 0.5;
      
    case 'EMOJI_PICKER':
      // Assume escala de emojis 1-5
      return (Number(valor) - 1) / 4;
      
    default:
      // Tentar converter para número
      const num = Number(valor);
      return isNaN(num) ? 0.5 : Math.max(0, Math.min(1, num));
  }
}

/**
 * Prepara facts a partir da sessão adaptativa
 */
export async function prepararFacts(sessaoId: string): Promise<AdaptiveFacts> {
  const sessao = await prisma.sessaoAdaptativa.findUnique({
    where: { id: sessaoId },
    include: {
      respostas: {
        include: {
          pergunta: true
        },
        orderBy: {
          ordem: 'asc'
        }
      },
      usuario: true
    }
  });
  
  if (!sessao) {
    throw new Error(`Sessão ${sessaoId} não encontrada`);
  }
  
  // Helper: tenta normalizar o valor salvo como string
  const parseValor = (valor: any) => {
    if (valor === null || valor === undefined) return null;
    if (typeof valor !== 'string') return valor;
    const v = valor.trim();
    if (v === 'true') return true;
    if (v === 'false') return false;
    const num = Number(v);
    if (!Number.isNaN(num) && v !== '') return num;
    // Tentar JSON
    try {
      const parsed = JSON.parse(v);
      return parsed;
    } catch {
      return valor; // mantém string
    }
  };

  // Preparar respostas (garantindo tipos esperados e perguntaId como string)
  const respostas: AdaptiveFacts['respostas'] = sessao.respostas.map(r => {
    const valorParsed = parseValor(r.valor);
    const perguntaIdStr = String(r.perguntaId ?? r.pergunta?.id ?? '');
    return {
      perguntaId: perguntaIdStr,
      valor: valorParsed as any,
      valorNormalizado: r.valorNormalizado ?? 0.5,
      categoria: (r.categoria as any) ?? 'BEM_ESTAR',
      dominio: (r.dominio as any) ?? 'HUMOR',
      timestamp: r.respondidoEm,
    };
  });
  
  // Calcular scores
  const scores = calcularScoresPorCategoria(respostas);
  
  // Buscar médias históricas (últimos 30 dias)
  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
  
  const historicoEmocional = await prisma.historicoEmocional.findMany({
    where: {
      usuarioId: sessao.usuarioId,
      data: {
        gte: trintaDiasAtras
      },
      periodo: 'DIA'
    },
    orderBy: {
      data: 'desc'
    }
  });
  
  const mediasHistoricas: AdaptiveFacts['mediasHistoricas'] = {};
  if (historicoEmocional.length > 0) {
    mediasHistoricas.humor = historicoEmocional.reduce((sum, h) => sum + (h.scoreHumor ?? 0), 0) / historicoEmocional.length;
    mediasHistoricas.ansiedade = historicoEmocional.reduce((sum, h) => sum + (h.scoreAnsiedade ?? 0), 0) / historicoEmocional.length;
    mediasHistoricas.estresse = historicoEmocional.reduce((sum, h) => sum + (h.scoreEstresse ?? 0), 0) / historicoEmocional.length;
    mediasHistoricas.sono = historicoEmocional.reduce((sum, h) => sum + (h.scoreSono ?? 0), 0) / historicoEmocional.length;
  }
  
  // Preparar facts
  // Preparar resposta atual com valorLength (opcional)
  const ultimaResposta = respostas.length > 0 ? respostas[respostas.length - 1] : undefined;
  const respostaAtual = ultimaResposta
    ? {
        ...ultimaResposta,
        valorLength: Array.isArray(ultimaResposta.valor) ? (ultimaResposta.valor as any[]).length : undefined,
      }
    : undefined;

  const facts: AdaptiveFacts = {
    respostaAtual,
    resposta: respostaAtual, // Alias para compatibilidade com regras
    respostas,
    scores,
    mediasHistoricas,
    irt: {
      theta: sessao.thetaEstimado ?? 0,
      erro: sessao.erroEstimacao ?? 1,
      confianca: sessao.confianca ?? 0.5
    },
    sessao: {
      sessaoId: sessao.id,
      questionarioId: sessao.questionarioId,
      usuarioId: sessao.usuarioId,
      perguntasRespondidas: sessao.perguntasRespondidas.length,
      totalPerguntas: sessao.perguntasApresentadas.length,
      progresso: sessao.progresso,
      nivelAlerta: sessao.nivelAlerta
    }
  };
  
  return facts;
}

// ==============================================
// EXPORT DEFAULT
// ==============================================

export default {
  createAdaptiveEngine,
  loadRulesFromDatabase,
  clearEngineRules,
  runEngine,
  calcularScoresPorCategoria,
  normalizarValor,
  prepararFacts
};
