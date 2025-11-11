/**
 * Regras Clínicas Avançadas para Sistema CAT
 * 
 * Implementa detecção de padrões clínicos complexos:
 * - Co-ocorrências (depressão + ansiedade, insônia + depressão)
 * - Desvios estatísticos (2SD do baseline)
 * - Alertas multi-nível (VERDE/AMARELO/LARANJA/VERMELHO)
 * - Detecção de ideação suicida e risco crítico
 * 
 * Baseado em literatura clínica e protocolos de triagem
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==============================================
// TIPOS E INTERFACES
// ==============================================

export type NivelAlerta = 'VERDE' | 'AMARELO' | 'LARANJA' | 'VERMELHO';

export interface Alerta {
  nivel: NivelAlerta;
  categoria: string;
  titulo: string;
  descricao: string;
  scores: Record<string, number>;
  recomendacoes: string[];
  acoes: string[];
  urgencia: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  timestamp: Date;
}

export interface PadraoDetectado {
  tipo: 'CO_OCORRENCIA' | 'DESVIO_ESTATISTICO' | 'TENDENCIA' | 'RISCO_CRITICO';
  nome: string;
  descricao: string;
  confianca: number; // 0-1
  construtos: string[];
  evidencias: string[];
}

export interface ScoresPorCategoria {
  ANSIEDADE?: number;
  DEPRESSAO?: number;
  ESTRESSE?: number;
  SONO?: number;
  BEM_ESTAR?: number;
  PENSAMENTOS_NEGATIVOS?: number;
  [key: string]: number | undefined;
}

export interface MediasHistoricas {
  categoria: string;
  media: number;
  desvioPadrao: number;
  numeroSessoes: number;
}

// ==============================================
// THRESHOLDS CLÍNICOS (baseados em literatura)
// ==============================================

const THRESHOLDS = {
  // PHQ-9 (Depressão)
  PHQ9: {
    LEVE: 5,
    MODERADA: 10,
    MODERADAMENTE_GRAVE: 15,
    GRAVE: 20
  },
  
  // GAD-7 (Ansiedade)
  GAD7: {
    LEVE: 5,
    MODERADA: 10,
    GRAVE: 15
  },
  
  // PSS-10 (Estresse)
  PSS10: {
    BAIXO: 13,
    MODERADO: 27,
    ALTO: 40
  },
  
  // ISI (Insônia)
  ISI: {
    AUSENTE: 7,
    LIMIAR: 14,
    MODERADA: 21,
    GRAVE: 28
  },
  
  // SWLS (Satisfação com Vida)
  SWLS: {
    EXTREMAMENTE_INSATISFEITO: 9,
    INSATISFEITO: 19,
    LEVEMENTE_SATISFEITO: 25,
    SATISFEITO: 30
  }
};

// ==============================================
// CÁLCULO DE SCORES POR ESCALA
// ==============================================

/**
 * Calcula score bruto de uma escala a partir das respostas
 */
function calcularScoreEscala(
  respostas: any[],
  escalaNome: string
): number {
  const respostasEscala = respostas.filter(r => r.escalaNome === escalaNome);
  
  if (respostasEscala.length === 0) return 0;
  
  // Score = soma dos valores normalizados * escala máxima
  const somaValores = respostasEscala.reduce((sum, r) => {
    const valor = r.valor || 0;
    return sum + valor;
  }, 0);
  
  return somaValores;
}

/**
 * Calcula scores de todas as escalas presentes
 */
function calcularScoresEscalas(respostas: any[]): Record<string, number> {
  const scores: Record<string, number> = {};
  const escalas = new Set(respostas.map(r => r.escalaNome).filter(Boolean));
  
  for (const escala of escalas) {
    scores[escala] = calcularScoreEscala(respostas, escala);
  }
  
  return scores;
}

/**
 * Agrupa scores por categoria (BEM_ESTAR, ANSIEDADE, etc.)
 */
function calcularScoresPorCategoria(respostas: any[]): ScoresPorCategoria {
  const scores: ScoresPorCategoria = {};
  const categorias = new Set(respostas.map(r => r.categoria).filter(Boolean));
  
  for (const categoria of categorias) {
    const respostasCategoria = respostas.filter(r => r.categoria === categoria);
    const media = respostasCategoria.reduce((sum, r) => sum + (r.valorNormalizado || 0), 0) / respostasCategoria.length;
    scores[categoria] = media;
  }
  
  return scores;
}

// ==============================================
// DETECÇÃO DE CO-OCORRÊNCIAS
// ==============================================

/**
 * Detecta depressão + ansiedade comórbida
 */
export function detectarDepressaoAnsiedade(
  scoresEscalas: Record<string, number>
): PadraoDetectado | null {
  const phq9 = scoresEscalas['PHQ-9'] || 0;
  const gad7 = scoresEscalas['GAD-7'] || 0;
  
  // Ambos em nível moderado ou superior
  if (phq9 >= THRESHOLDS.PHQ9.MODERADA && gad7 >= THRESHOLDS.GAD7.MODERADA) {
    return {
      tipo: 'CO_OCORRENCIA',
      nome: 'Depressão + Ansiedade Comórbida',
      descricao: 'Presença simultânea de sintomas depressivos e ansiosos em níveis moderados a graves',
      confianca: Math.min(
        (phq9 / THRESHOLDS.PHQ9.GRAVE),
        (gad7 / THRESHOLDS.GAD7.GRAVE)
      ),
      construtos: ['DEPRESSAO', 'ANSIEDADE'],
      evidencias: [
        `PHQ-9: ${phq9} (≥ ${THRESHOLDS.PHQ9.MODERADA} = moderado)`,
        `GAD-7: ${gad7} (≥ ${THRESHOLDS.GAD7.MODERADA} = moderado)`,
        'Padrão comum: 60% dos casos de depressão apresentam ansiedade comórbida'
      ]
    };
  }
  
  return null;
}

/**
 * Detecta insônia + depressão
 */
export function detectarInsoniaDepressao(
  scoresEscalas: Record<string, number>
): PadraoDetectado | null {
  const isi = scoresEscalas['ISI'] || 0;
  const phq9 = scoresEscalas['PHQ-9'] || 0;
  
  // Insônia moderada + depressão leve ou superior
  if (isi >= THRESHOLDS.ISI.MODERADA && phq9 >= THRESHOLDS.PHQ9.LEVE) {
    return {
      tipo: 'CO_OCORRENCIA',
      nome: 'Insônia + Depressão',
      descricao: 'Distúrbios do sono associados a sintomas depressivos',
      confianca: Math.min(
        (isi / THRESHOLDS.ISI.GRAVE),
        (phq9 / THRESHOLDS.PHQ9.GRAVE)
      ),
      construtos: ['SONO', 'DEPRESSAO'],
      evidencias: [
        `ISI: ${isi} (≥ ${THRESHOLDS.ISI.MODERADA} = moderado)`,
        `PHQ-9: ${phq9} (≥ ${THRESHOLDS.PHQ9.LEVE} = leve)`,
        'Insônia é sintoma presente em 80% dos episódios depressivos'
      ]
    };
  }
  
  return null;
}

/**
 * Detecta estresse + ansiedade
 */
export function detectarEstresseAnsiedade(
  scoresEscalas: Record<string, number>
): PadraoDetectado | null {
  const pss10 = scoresEscalas['PSS-10'] || 0;
  const gad7 = scoresEscalas['GAD-7'] || 0;
  
  // Estresse alto + ansiedade moderada
  if (pss10 >= THRESHOLDS.PSS10.MODERADO && gad7 >= THRESHOLDS.GAD7.MODERADA) {
    return {
      tipo: 'CO_OCORRENCIA',
      nome: 'Estresse Crônico + Ansiedade',
      descricao: 'Estresse percebido elevado associado a sintomas ansiosos',
      confianca: Math.min(
        (pss10 / THRESHOLDS.PSS10.ALTO),
        (gad7 / THRESHOLDS.GAD7.GRAVE)
      ),
      construtos: ['ESTRESSE', 'ANSIEDADE'],
      evidencias: [
        `PSS-10: ${pss10} (≥ ${THRESHOLDS.PSS10.MODERADO} = moderado)`,
        `GAD-7: ${gad7} (≥ ${THRESHOLDS.GAD7.MODERADA} = moderado)`,
        'Estresse crônico é fator de risco para transtornos de ansiedade'
      ]
    };
  }
  
  return null;
}

/**
 * Detecta bem-estar baixo + sono ruim
 */
export function detectarBemEstarBaixoSono(
  scoresEscalas: Record<string, number>,
  scoresCategorias: ScoresPorCategoria
): PadraoDetectado | null {
  const swls = scoresEscalas['SWLS'] || 0;
  const isi = scoresEscalas['ISI'] || 0;
  const bemEstar = scoresCategorias.BEM_ESTAR || 0;
  
  // Satisfação com vida baixa + insônia
  if (swls < THRESHOLDS.SWLS.INSATISFEITO && isi >= THRESHOLDS.ISI.LIMIAR) {
    return {
      tipo: 'CO_OCORRENCIA',
      nome: 'Bem-Estar Baixo + Distúrbios do Sono',
      descricao: 'Baixa satisfação com a vida associada a problemas de sono',
      confianca: Math.min(
        1 - (swls / THRESHOLDS.SWLS.SATISFEITO),
        (isi / THRESHOLDS.ISI.GRAVE)
      ),
      construtos: ['BEM_ESTAR', 'SONO'],
      evidencias: [
        `SWLS: ${swls} (< ${THRESHOLDS.SWLS.INSATISFEITO} = insatisfeito)`,
        `ISI: ${isi} (≥ ${THRESHOLDS.ISI.LIMIAR} = limiar)`,
        'Qualidade do sono impacta diretamente satisfação com a vida'
      ]
    };
  }
  
  return null;
}

/**
 * Detecta todos os padrões de co-ocorrência
 */
function detectarCoOcorrencias(
  respostas: any[]
): PadraoDetectado[] {
  const scoresEscalas = calcularScoresEscalas(respostas);
  const scoresCategorias = calcularScoresPorCategoria(respostas);
  
  const padroes: PadraoDetectado[] = [];
  
  const deteccoes = [
    detectarDepressaoAnsiedade(scoresEscalas),
    detectarInsoniaDepressao(scoresEscalas),
    detectarEstresseAnsiedade(scoresEscalas),
    detectarBemEstarBaixoSono(scoresEscalas, scoresCategorias)
  ];
  
  for (const deteccao of deteccoes) {
    if (deteccao) padroes.push(deteccao);
  }
  
  return padroes;
}

// ==============================================
// DETECÇÃO DE IDEAÇÃO SUICIDA E RISCO CRÍTICO
// ==============================================

/**
 * Detecta ideação suicida (PHQ9_09)
 */
export function detectarIdeacaoSuicida(respostas: any[]): PadraoDetectado | null {
  const phq9_09 = respostas.find(r => 
    r.escalaItem === 'PHQ9_09' ||
    r.codigo === 'PHQ9_09' || 
    r.pergunta?.codigo === 'PHQ9_09' ||
    r.subcategoria === 'ideacao_suicida'
  );
  
  if (phq9_09 && (phq9_09.valor > 0 || phq9_09.valorNumerico > 0)) {
    const frequencia = phq9_09.valorNumerico || phq9_09.valor || 0;
    
    return {
      tipo: 'RISCO_CRITICO',
      nome: 'Ideação Suicida Detectada',
      descricao: 'Pensamentos de autolesão ou morte reportados',
      confianca: 1.0, // Máxima confiança quando endossado
      construtos: ['PENSAMENTOS_NEGATIVOS', 'DEPRESSAO'],
      evidencias: [
        `PHQ9_09 endossado com valor ${frequencia}/3`,
        frequencia === 1 ? 'Frequência: Vários dias' :
        frequencia === 2 ? 'Frequência: Mais da metade dos dias' :
        'Frequência: Quase todos os dias',
        'PROTOCOLO: Avaliação imediata de risco suicida necessária'
      ]
    };
  }
  
  return null;
}

/**
 * Detecta risco crítico combinado
 */
export function detectarRiscoCritico(
  respostas: any[],
  scoresEscalas: Record<string, number>
): PadraoDetectado | null {
  const phq9 = scoresEscalas['PHQ-9'] || 0;
  const gad7 = scoresEscalas['GAD-7'] || 0;
  
  // Depressão grave + ansiedade grave
  if (phq9 >= THRESHOLDS.PHQ9.GRAVE && gad7 >= THRESHOLDS.GAD7.GRAVE) {
    return {
      tipo: 'RISCO_CRITICO',
      nome: 'Risco Crítico: Depressão + Ansiedade Graves',
      descricao: 'Níveis graves simultâneos de depressão e ansiedade',
      confianca: 1.0,
      construtos: ['DEPRESSAO', 'ANSIEDADE'],
      evidencias: [
        `PHQ-9: ${phq9} (≥ ${THRESHOLDS.PHQ9.GRAVE} = grave)`,
        `GAD-7: ${gad7} (≥ ${THRESHOLDS.GAD7.GRAVE} = grave)`,
        'PROTOCOLO: Encaminhamento psiquiátrico urgente recomendado'
      ]
    };
  }
  
  return null;
}

// ==============================================
// DESVIOS ESTATÍSTICOS
// ==============================================

/**
 * Busca médias históricas do usuário
 */
export async function buscarMediasHistoricas(
  usuarioId: number
): Promise<MediasHistoricas[]> {
  // Buscar últimas 10 sessões finalizadas
  const sessoes = await prisma.sessaoAdaptativa.findMany({
    where: {
      usuarioId,
      finalizadoEm: { not: null }
    },
    include: {
      respostas: true
    },
    orderBy: { finalizadoEm: 'desc' },
    take: 10
  });
  
  if (sessoes.length < 3) {
    // Insuficiente para baseline
    return [];
  }
  
  // Calcular médias por categoria
  const categorias = new Map<string, number[]>();
  
  for (const sessao of sessoes) {
    const scoresCategorias = calcularScoresPorCategoria(sessao.respostas);
    
    for (const [categoria, score] of Object.entries(scoresCategorias)) {
      if (score !== undefined) {
        if (!categorias.has(categoria)) {
          categorias.set(categoria, []);
        }
        categorias.get(categoria)!.push(score);
      }
    }
  }
  
  // Calcular média e desvio padrão
  const medias: MediasHistoricas[] = [];
  
  for (const [categoria, valores] of categorias.entries()) {
    const media = valores.reduce((sum, v) => sum + v, 0) / valores.length;
    const variancia = valores.reduce((sum, v) => sum + Math.pow(v - media, 2), 0) / valores.length;
    const desvioPadrao = Math.sqrt(variancia);
    
    medias.push({
      categoria,
      media,
      desvioPadrao,
      numeroSessoes: valores.length
    });
  }
  
  return medias;
}

/**
 * Detecta desvios estatísticos do baseline (2SD)
 */
export function detectarDesviosEstatisticos(
  scoresCategorias: ScoresPorCategoria,
  mediasHistoricas: MediasHistoricas[]
): PadraoDetectado[] {
  const padroes: PadraoDetectado[] = [];
  
  for (const media of mediasHistoricas) {
    const scoreAtual = scoresCategorias[media.categoria];
    
    if (scoreAtual === undefined) continue;
    
    const desvio = Math.abs(scoreAtual - media.media);
    const numeroDesviosPadrao = desvio / media.desvioPadrao;
    
    // Detectar desvio > 2SD
    if (numeroDesviosPadrao >= 2.0) {
      const direcao = scoreAtual > media.media ? 'aumento' : 'redução';
      
      padroes.push({
        tipo: 'DESVIO_ESTATISTICO',
        nome: `Desvio Significativo: ${media.categoria}`,
        descricao: `${direcao} atípico em relação ao baseline pessoal`,
        confianca: Math.min(numeroDesviosPadrao / 3, 1), // Máximo em 3SD
        construtos: [media.categoria],
        evidencias: [
          `Score atual: ${scoreAtual.toFixed(2)}`,
          `Média histórica: ${media.media.toFixed(2)} (±${media.desvioPadrao.toFixed(2)})`,
          `Desvio: ${numeroDesviosPadrao.toFixed(1)} desvios padrão`,
          `Baseado em ${media.numeroSessoes} sessões anteriores`
        ]
      });
    }
  }
  
  return padroes;
}

// ==============================================
// GERAÇÃO DE ALERTAS MULTI-NÍVEL
// ==============================================

/**
 * Determina nível de alerta baseado em scores
 */
export function determinarNivelAlerta(
  scoresEscalas: Record<string, number>,
  padroes: PadraoDetectado[]
): NivelAlerta {
  // VERMELHO: Risco crítico ou ideação suicida
  const riscosCriticos = padroes.filter(p => p.tipo === 'RISCO_CRITICO');
  if (riscosCriticos.length > 0) return 'VERMELHO';
  
  // VERMELHO: Depressão grave OU ansiedade grave
  const phq9 = scoresEscalas['PHQ-9'] || 0;
  const gad7 = scoresEscalas['GAD-7'] || 0;
  
  if (phq9 >= THRESHOLDS.PHQ9.GRAVE || gad7 >= THRESHOLDS.GAD7.GRAVE) {
    return 'VERMELHO';
  }
  
  // LARANJA: Depressão/ansiedade moderadamente grave OU múltiplas co-ocorrências
  if (phq9 >= THRESHOLDS.PHQ9.MODERADAMENTE_GRAVE || gad7 >= THRESHOLDS.GAD7.MODERADA) {
    return 'LARANJA';
  }
  
  const coOcorrencias = padroes.filter(p => p.tipo === 'CO_OCORRENCIA');
  if (coOcorrencias.length >= 2) return 'LARANJA';
  
  // AMARELO: Níveis moderados OU uma co-ocorrência
  if (phq9 >= THRESHOLDS.PHQ9.MODERADA || gad7 >= THRESHOLDS.GAD7.MODERADA) {
    return 'AMARELO';
  }
  
  if (coOcorrencias.length === 1) return 'AMARELO';
  
  // VERDE: Níveis normais/leves
  return 'VERDE';
}

/**
 * Gera recomendações baseadas em nível e padrões
 */
export function gerarRecomendacoes(
  nivel: NivelAlerta,
  padroes: PadraoDetectado[]
): string[] {
  const recomendacoes: string[] = [];
  
  if (nivel === 'VERMELHO') {
    recomendacoes.push('🚨 Procure ajuda profissional URGENTE (psicólogo/psiquiatra)');
    recomendacoes.push('💬 Se necessário, ligue 188 (CVV - Centro de Valorização da Vida)');
    recomendacoes.push('🏥 Em caso de emergência, dirija-se ao pronto-socorro mais próximo');
  } else if (nivel === 'LARANJA') {
    recomendacoes.push('⚠️ Agende consulta com psicólogo/psiquiatra nas próximas 48-72h');
    recomendacoes.push('🧘 Pratique técnicas de relaxamento (respiração, mindfulness)');
    recomendacoes.push('👥 Converse com pessoas de confiança sobre como se sente');
  } else if (nivel === 'AMARELO') {
    recomendacoes.push('📅 Considere agendar avaliação psicológica na próxima semana');
    recomendacoes.push('🏃 Mantenha atividade física regular (30min/dia)');
    recomendacoes.push('😴 Cuide da higiene do sono (horários regulares, evitar telas)');
  } else {
    recomendacoes.push('✅ Continue praticando hábitos saudáveis');
    recomendacoes.push('🎯 Mantenha atividades que geram prazer e bem-estar');
    recomendacoes.push('📊 Continue monitorando seu estado emocional regularmente');
  }
  
  // Recomendações específicas por padrão
  for (const padrao of padroes) {
    if (padrao.nome.includes('Insônia')) {
      if (!recomendacoes.some(r => r.includes('sono'))) {
        recomendacoes.push('😴 Estabeleça rotina de sono consistente (mesmo horário diariamente)');
      }
    }
    
    if (padrao.nome.includes('Estresse')) {
      if (!recomendacoes.some(r => r.includes('relaxamento'))) {
        recomendacoes.push('🧘 Pratique técnicas de gerenciamento de estresse (meditação, yoga)');
      }
    }
  }
  
  return recomendacoes;
}

/**
 * Gera ações para o sistema
 */
export function gerarAcoes(
  nivel: NivelAlerta,
  padroes: PadraoDetectado[]
): string[] {
  const acoes: string[] = [];
  
  if (nivel === 'VERMELHO') {
    acoes.push('NOTIFICAR_RESPONSAVEL');
    acoes.push('NOTIFICAR_COORDENACAO');
    acoes.push('REGISTRAR_PROTOCOLO_CRISE');
  }
  
  if (nivel === 'LARANJA' || nivel === 'VERMELHO') {
    acoes.push('SUGERIR_ENCAMINHAMENTO');
    acoes.push('AUMENTAR_FREQUENCIA_MONITORAMENTO');
  }
  
  const ideacaoSuicida = padroes.find(p => p.nome.includes('Ideação Suicida'));
  if (ideacaoSuicida) {
    acoes.push('PROTOCOLO_IDEACAO_SUICIDA');
    acoes.push('AVALIAR_PLANO_SUICIDA');
    acoes.push('CONTATO_IMEDIATO');
  }
  
  return acoes;
}

/**
 * Gera alerta completo
 */
function gerarAlerta(
  respostas: any[],
  padroes: PadraoDetectado[],
  usuarioId?: number
): Alerta {
  const scoresEscalas = calcularScoresEscalas(respostas);
  const scoresCategorias = calcularScoresPorCategoria(respostas);
  const nivel = determinarNivelAlerta(scoresEscalas, padroes);
  
  const urgencia = 
    nivel === 'VERMELHO' ? 'CRITICA' :
    nivel === 'LARANJA' ? 'ALTA' :
    nivel === 'AMARELO' ? 'MEDIA' : 'BAIXA';
  
  const titulo = 
    nivel === 'VERMELHO' ? '🚨 Alerta Crítico: Intervenção Urgente Necessária' :
    nivel === 'LARANJA' ? '⚠️ Alerta Alto: Atenção Requerida' :
    nivel === 'AMARELO' ? '⚡ Alerta Moderado: Monitoramento Recomendado' :
    '✅ Status Normal: Continue Monitorando';
  
  const descricao = padroes.length > 0
    ? `Detectados ${padroes.length} padrão(ões) clínico(s): ${padroes.map(p => p.nome).join(', ')}`
    : 'Nenhum padrão clínico significativo detectado';
  
  // Mesclar scores garantindo que não há undefined
  const scores: Record<string, number> = {};
  Object.entries({ ...scoresEscalas, ...scoresCategorias }).forEach(([key, value]) => {
    if (value !== undefined) {
      scores[key] = value;
    }
  });
  
  return {
    nivel,
    categoria: padroes[0]?.construtos[0] || 'GERAL',
    titulo,
    descricao,
    scores,
    recomendacoes: gerarRecomendacoes(nivel, padroes),
    acoes: gerarAcoes(nivel, padroes),
    urgencia,
    timestamp: new Date()
  };
}

// ==============================================
// FUNÇÃO PRINCIPAL
// ==============================================

/**
 * Analisa respostas e gera alertas/recomendações
 */
export async function analisarRespostasClinicas(
  sessaoId: string,
  usuarioId?: number
): Promise<{
  padroes: PadraoDetectado[];
  alerta: Alerta;
  mediasHistoricas?: MediasHistoricas[];
}> {
  // Buscar respostas da sessão
  const sessao = await prisma.sessaoAdaptativa.findUnique({
    where: { id: sessaoId },
    include: { respostas: true }
  });
  
  if (!sessao) {
    throw new Error(`Sessão ${sessaoId} não encontrada`);
  }
  
  const respostas = sessao.respostas;
  const padroes: PadraoDetectado[] = [];
  
  // 1. Detectar co-ocorrências
  const coOcorrencias = detectarCoOcorrencias(respostas);
  padroes.push(...coOcorrencias);
  
  // 2. Detectar ideação suicida
  const ideacaoSuicida = detectarIdeacaoSuicida(respostas);
  if (ideacaoSuicida) padroes.push(ideacaoSuicida);
  
  // 3. Detectar risco crítico
  const scoresEscalas = calcularScoresEscalas(respostas);
  const riscoCritico = detectarRiscoCritico(respostas, scoresEscalas);
  if (riscoCritico) padroes.push(riscoCritico);
  
  // 4. Detectar desvios estatísticos (se temos histórico)
  let mediasHistoricas: MediasHistoricas[] | undefined;
  if (usuarioId !== undefined) {
    mediasHistoricas = await buscarMediasHistoricas(usuarioId);
    
    if (mediasHistoricas.length > 0) {
      const scoresCategorias = calcularScoresPorCategoria(respostas);
      const desvios = detectarDesviosEstatisticos(scoresCategorias, mediasHistoricas);
      padroes.push(...desvios);
    }
  }
  
  // 5. Gerar alerta
  const alerta = gerarAlerta(respostas, padroes, usuarioId);
  
  console.log('\n🏥 [Análise Clínica]');
  console.log(`   Nível: ${alerta.nivel} (${alerta.urgencia})`);
  console.log(`   Padrões detectados: ${padroes.length}`);
  for (const padrao of padroes) {
    console.log(`   - ${padrao.nome} (confiança: ${(padrao.confianca * 100).toFixed(0)}%)`);
  }
  
  return {
    padroes,
    alerta,
    mediasHistoricas
  };
}

export {
  THRESHOLDS,
  calcularScoreEscala,
  calcularScoresEscalas,
  calcularScoresPorCategoria
};
