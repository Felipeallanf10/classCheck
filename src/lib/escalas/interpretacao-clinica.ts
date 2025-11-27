/**
 * Módulo de Interpretação Clínica de Escalas Validadas
 * 
 * Implementa funções para interpretar scores das escalas psicológicas:
 * - PHQ-9 (Patient Health Questionnaire - Depressão)
 * - GAD-7 (Generalized Anxiety Disorder - Ansiedade)
 * - WHO-5 (Well-Being Index - Bem-Estar)
 * 
 * Referências:
 * - PHQ-9: Kroenke et al., 2001 | Faixa: 0-27
 * - GAD-7: Spitzer et al., 2006 | Faixa: 0-21
 * - WHO-5: Bech et al., 2003 | Faixa: 0-25
 */

export type NivelAlerta = 'VERDE' | 'AMARELO' | 'LARANJA' | 'VERMELHO';
export type CategoriaClinica = 'MINIMA' | 'LEVE' | 'MODERADA' | 'MODERADAMENTE_GRAVE' | 'GRAVE';

export interface InterpretacaoClinica {
  escala: string;
  score: number;
  scoreMaximo: number;
  percentual: number;
  categoria: CategoriaClinica;
  nivelAlerta: NivelAlerta;
  descricao: string;
  recomendacao: string;
  requerAcaoImediata: boolean;
}

/**
 * PHQ-9 - Patient Health Questionnaire (Depressão)
 * 
 * Pontuação:
 * - 0-4: Mínima
 * - 5-9: Leve
 * - 10-14: Moderada
 * - 15-19: Moderadamente grave
 * - 20-27: Grave
 * 
 * Atenção: PHQ-9 item 9 (pensamentos suicidas) requer ação imediata se > 0
 */
export function interpretarPHQ9(score: number, item9Valor?: number): InterpretacaoClinica {
  const scoreMaximo = 27;
  const percentual = Math.round((score / scoreMaximo) * 100);
  
  let categoria: CategoriaClinica;
  let nivelAlerta: NivelAlerta;
  let descricao: string;
  let recomendacao: string;
  let requerAcaoImediata = false;

  // Verificar item 9 (pensamentos suicidas) - PRIORIDADE MÁXIMA
  if (item9Valor !== undefined && item9Valor > 0) {
    categoria = 'GRAVE';
    requerAcaoImediata = true;
    nivelAlerta = 'VERMELHO';
    descricao = '⚠️ ALERTA CRÍTICO: Pensamentos autodestrutivos relatados. Requer avaliação imediata por profissional de saúde mental.';
    recomendacao = 'AÇÃO IMEDIATA: Encaminhar para psicólogo/psiquiatra com urgência. Notificar coordenação pedagógica e responsáveis.';
  } 
  // Categorização por score total
  else if (score <= 4) {
    categoria = 'MINIMA';
    nivelAlerta = 'VERDE';
    descricao = 'Ausência ou sintomas mínimos de depressão. Estado emocional dentro da normalidade.';
    recomendacao = 'Manter rotinas saudáveis: sono adequado, atividade física regular e momentos de lazer.';
  } else if (score <= 9) {
    categoria = 'LEVE';
    nivelAlerta = 'AMARELO';
    descricao = 'Sintomas leves de depressão. Podem impactar levemente o funcionamento diário.';
    recomendacao = 'Monitorar evolução. Considerar técnicas de relaxamento, mindfulness e apoio psicológico preventivo.';
  } else if (score <= 14) {
    categoria = 'MODERADA';
    nivelAlerta = 'LARANJA';
    descricao = 'Sintomas moderados de depressão. Impacto significativo no funcionamento diário e qualidade de vida.';
    recomendacao = 'Recomenda-se avaliação com psicólogo. Considerar psicoterapia e técnicas de intervenção cognitivo-comportamental.';
  } else if (score <= 19) {
    categoria = 'MODERADAMENTE_GRAVE';
    nivelAlerta = 'VERMELHO';
    descricao = 'Sintomas moderadamente graves de depressão. Impacto severo no funcionamento e bem-estar.';
    recomendacao = 'Avaliação com psicólogo/psiquiatra necessária. Considerar terapia combinada (psicoterapia + farmacoterapia).';
    requerAcaoImediata = true;
  } else {
    categoria = 'GRAVE';
    nivelAlerta = 'VERMELHO';
    descricao = 'Sintomas graves de depressão. Comprometimento significativo do funcionamento e risco à saúde.';
    recomendacao = 'URGENTE: Encaminhamento imediato para psiquiatra. Monitoramento intensivo necessário.';
    requerAcaoImediata = true;
  }

  return {
    escala: 'PHQ-9',
    score,
    scoreMaximo,
    percentual,
    categoria,
    nivelAlerta,
    descricao,
    recomendacao,
    requerAcaoImediata,
  };
}

/**
 * GAD-7 - Generalized Anxiety Disorder (Ansiedade)
 * 
 * Pontuação:
 * - 0-4: Mínima
 * - 5-9: Leve
 * - 10-14: Moderada
 * - 15-21: Grave
 */
export function interpretarGAD7(score: number): InterpretacaoClinica {
  const scoreMaximo = 21;
  const percentual = Math.round((score / scoreMaximo) * 100);
  
  let categoria: CategoriaClinica;
  let nivelAlerta: NivelAlerta;
  let descricao: string;
  let recomendacao: string;
  let requerAcaoImediata = false;

  if (score <= 4) {
    categoria = 'MINIMA';
    nivelAlerta = 'VERDE';
    descricao = 'Ausência ou sintomas mínimos de ansiedade. Estado emocional equilibrado.';
    recomendacao = 'Manter práticas de autocuidado: respiração consciente, exercícios físicos e sono regular.';
  } else if (score <= 9) {
    categoria = 'LEVE';
    nivelAlerta = 'AMARELO';
    descricao = 'Sintomas leves de ansiedade. Podem causar desconforto ocasional.';
    recomendacao = 'Considerar técnicas de manejo de estresse: mindfulness, relaxamento progressivo e organização de rotina.';
  } else if (score <= 14) {
    categoria = 'MODERADA';
    nivelAlerta = 'LARANJA';
    descricao = 'Sintomas moderados de ansiedade. Impacto significativo no dia a dia e bem-estar.';
    recomendacao = 'Recomenda-se avaliação psicológica. Psicoterapia cognitivo-comportamental pode ser benéfica.';
  } else {
    categoria = 'GRAVE';
    nivelAlerta = 'VERMELHO';
    descricao = 'Sintomas graves de ansiedade. Comprometimento importante do funcionamento e qualidade de vida.';
    recomendacao = 'Avaliação com psicólogo/psiquiatra necessária. Considerar intervenção terapêutica intensiva.';
    requerAcaoImediata = true;
  }

  return {
    escala: 'GAD-7',
    score,
    scoreMaximo,
    percentual,
    categoria,
    nivelAlerta,
    descricao,
    recomendacao,
    requerAcaoImediata,
  };
}

/**
 * WHO-5 - Well-Being Index (Índice de Bem-Estar)
 * 
 * Pontuação:
 * - 0-25: Score bruto (multiplicado por 4 para percentual 0-100)
 * - 0-28%: Muito baixo (alerta)
 * - 29-50%: Baixo
 * - 51-75%: Moderado
 * - 76-100%: Alto
 * 
 * Nota: WHO-5 é inverso (quanto maior, melhor)
 */
export function interpretarWHO5(score: number): InterpretacaoClinica {
  const scoreMaximo = 25;
  const percentual = Math.round((score / scoreMaximo) * 100);
  
  let categoria: CategoriaClinica;
  let nivelAlerta: NivelAlerta;
  let descricao: string;
  let recomendacao: string;
  let requerAcaoImediata = false;

  if (percentual <= 28) {
    categoria = 'GRAVE';
    nivelAlerta = 'VERMELHO';
    descricao = 'Bem-estar muito baixo. Possível indicador de depressão ou outros transtornos de humor.';
    recomendacao = 'Avaliação clínica recomendada. Considerar triagem para depressão (PHQ-9) e ansiedade (GAD-7).';
    requerAcaoImediata = true;
  } else if (percentual <= 50) {
    categoria = 'MODERADA';
    nivelAlerta = 'LARANJA';
    descricao = 'Bem-estar baixo. Qualidade de vida pode estar comprometida.';
    recomendacao = 'Considerar apoio psicológico. Identificar fatores estressores e trabalhar estratégias de enfrentamento.';
  } else if (percentual <= 75) {
    categoria = 'LEVE';
    nivelAlerta = 'AMARELO';
    descricao = 'Bem-estar moderado. Há espaço para melhoria na qualidade de vida.';
    recomendacao = 'Fortalecer hábitos saudáveis: sono, alimentação, exercícios e atividades prazerosas.';
  } else {
    categoria = 'MINIMA';
    nivelAlerta = 'VERDE';
    descricao = 'Bem-estar alto. Boa qualidade de vida e funcionamento emocional.';
    recomendacao = 'Manter práticas de autocuidado e bem-estar. Continue priorizando sua saúde mental.';
  }

  return {
    escala: 'WHO-5',
    score,
    scoreMaximo,
    percentual,
    categoria,
    nivelAlerta,
    descricao,
    recomendacao,
    requerAcaoImediata,
  };
}

/**
 * Função auxiliar para determinar se múltiplas escalas indicam alerta crítico
 */
export function analisarAlertasCombinados(
  phq9?: InterpretacaoClinica,
  gad7?: InterpretacaoClinica,
  who5?: InterpretacaoClinica
): {
  nivelMaximo: NivelAlerta;
  requerAcaoImediata: boolean;
  mensagemConsolidada: string;
} {
  const interpretacoes = [phq9, gad7, who5].filter(Boolean) as InterpretacaoClinica[];
  
  const requerAcaoImediata = interpretacoes.some((i) => i.requerAcaoImediata);
  
  const niveis: NivelAlerta[] = interpretacoes.map((i) => i.nivelAlerta);
  const nivelMaximo: NivelAlerta = niveis.includes('VERMELHO')
    ? 'VERMELHO'
    : niveis.includes('LARANJA')
    ? 'LARANJA'
    : niveis.includes('AMARELO')
    ? 'AMARELO'
    : 'VERDE';

  let mensagemConsolidada = '';
  
  if (requerAcaoImediata) {
    mensagemConsolidada = '⚠️ ALERTA CRÍTICO: Múltiplos indicadores de risco detectados. Encaminhamento para avaliação profissional necessário.';
  } else if (nivelMaximo === 'VERMELHO') {
    mensagemConsolidada = 'Atenção: Sintomas graves detectados. Recomenda-se avaliação com profissional de saúde mental.';
  } else if (nivelMaximo === 'LARANJA') {
    mensagemConsolidada = 'Sintomas moderados identificados. Considerar apoio psicológico para melhor manejo.';
  } else if (nivelMaximo === 'AMARELO') {
    mensagemConsolidada = 'Sintomas leves detectados. Monitoramento e autocuidado recomendados.';
  } else {
    mensagemConsolidada = 'Estado emocional dentro da normalidade. Continue cuidando da sua saúde mental!';
  }

  return {
    nivelMaximo,
    requerAcaoImediata,
    mensagemConsolidada,
  };
}

/**
 * Função para calcular score total de uma sessão de escala específica
 */
export function calcularScoreEscala(respostas: { valor: number }[]): number {
  return respostas.reduce((total, resposta) => total + resposta.valor, 0);
}
