/**
 * Critérios de Parada Avançados para CAT
 * 
 * Implementa múltiplos critérios baseados em:
 * - Precisão (SEM)
 * - Convergência de theta
 * - Estabilidade das respostas
 * - Confiabilidade global
 * - Limites operacionais
 */

import { ResultadoEstimacao, calcularSEM } from './irt-refinado';

export interface CriteriosParada {
  // Limites operacionais
  minimoPerguntas: number;
  maximoPerguntas: number;
  tempoMaximoSegundos?: number;

  // Precisão
  semAlvo: number; // Standard Error of Measurement alvo

  // Convergência
  limiteConvergencia: number; // Variação mínima de theta
  janelasConvergencia: number; // Quantas estimativas considerar

  // Confiabilidade
  confiancaMinima: number; // 0-1

  // Estabilidade
  estabilidadeMinima: boolean;
}

export interface EstadoSessao {
  numeroRespostas: number;
  tempoDecorridoSegundos: number;
  historicoEstimacoes: ResultadoEstimacao[];
  ultimoTheta: number;
  ultimoSEM: number;
  ultimaConfianca: number;
  respostasConsistentes: boolean;
}

export interface ResultadoParada {
  deveparar: boolean;
  motivo?: string;
  criterioAtingido?: string;
  metricas: {
    progresso: number; // 0-1
    qualidade: 'baixa' | 'media' | 'alta';
    recomendacao: string;
  };
}

/**
 * Critérios padrão recomendados
 */
export const CRITERIOS_PADRAO: CriteriosParada = {
  minimoPerguntas: 5,
  maximoPerguntas: 20,
  tempoMaximoSegundos: 900, // 15 minutos
  semAlvo: 0.30,
  limiteConvergencia: 0.1,
  janelasConvergencia: 3,
  confiancaMinima: 0.75,
  estabilidadeMinima: true
};

/**
 * Critérios para triagem rápida
 */
export const CRITERIOS_TRIAGEM: CriteriosParada = {
  minimoPerguntas: 3,
  maximoPerguntas: 10,
  tempoMaximoSegundos: 300, // 5 minutos
  semAlvo: 0.40, // Menos rigoroso
  limiteConvergencia: 0.15,
  janelasConvergencia: 2,
  confiancaMinima: 0.65,
  estabilidadeMinima: false
};

/**
 * Critérios para avaliação aprofundada
 */
export const CRITERIOS_APROFUNDADO: CriteriosParada = {
  minimoPerguntas: 8,
  maximoPerguntas: 30,
  tempoMaximoSegundos: 1800, // 30 minutos
  semAlvo: 0.20, // Mais rigoroso
  limiteConvergencia: 0.05,
  janelasConvergencia: 4,
  confiancaMinima: 0.85,
  estabilidadeMinima: true
};

/**
 * Verifica todos os critérios de parada
 */
export function verificarCriteriosParada(
  estado: EstadoSessao,
  criterios: CriteriosParada = CRITERIOS_PADRAO
): ResultadoParada {
  const metricas = calcularMetricas(estado, criterios);

  // 1. Verificar mínimo absoluto
  if (estado.numeroRespostas < criterios.minimoPerguntas) {
    return {
      deveparar: false,
      metricas: {
        progresso: estado.numeroRespostas / criterios.minimoPerguntas,
        qualidade: 'baixa',
        recomendacao: `Continue até pelo menos ${criterios.minimoPerguntas} perguntas`
      }
    };
  }

  // 2. Verificar máximo absoluto (burden cognitivo)
  if (estado.numeroRespostas >= criterios.maximoPerguntas) {
    return {
      deveparar: true,
      motivo: `Número máximo de perguntas atingido (${criterios.maximoPerguntas})`,
      criterioAtingido: 'MAXIMO_PERGUNTAS',
      metricas
    };
  }

  // 3. Verificar timeout
  if (
    criterios.tempoMaximoSegundos &&
    estado.tempoDecorridoSegundos >= criterios.tempoMaximoSegundos
  ) {
    return {
      deveparar: true,
      motivo: `Tempo máximo excedido (${Math.floor(criterios.tempoMaximoSegundos / 60)}min)`,
      criterioAtingido: 'TIMEOUT',
      metricas
    };
  }

  // 4. Verificar precisão (SEM)
  if (estado.ultimoSEM < criterios.semAlvo) {
    return {
      deveparar: true,
      motivo: `Precisão atingida (SEM = ${estado.ultimoSEM.toFixed(3)} < ${criterios.semAlvo})`,
      criterioAtingido: 'PRECISAO',
      metricas
    };
  }

  // 5. Verificar convergência de theta
  if (verificarConvergencia(estado, criterios)) {
    return {
      deveparar: true,
      motivo: 'Theta convergiu (variação < ' + criterios.limiteConvergencia + ')',
      criterioAtingido: 'CONVERGENCIA',
      metricas
    };
  }

  // 6. Verificar confiabilidade global
  if (
    estado.ultimaConfianca >= criterios.confiancaMinima &&
    estado.numeroRespostas >= criterios.minimoPerguntas + 2
  ) {
    return {
      deveparar: true,
      motivo: `Confiabilidade alta atingida (${(estado.ultimaConfianca * 100).toFixed(1)}%)`,
      criterioAtingido: 'CONFIABILIDADE',
      metricas
    };
  }

  // 7. Verificar combinação de critérios moderados
  if (verificarCriteriosCombinados(estado, criterios)) {
    return {
      deveparar: true,
      motivo: 'Múltiplos critérios satisfatórios atingidos',
      criterioAtingido: 'COMBINACAO',
      metricas
    };
  }

  // Continuar coletando respostas
  return {
    deveparar: false,
    metricas
  };
}

/**
 * Verifica convergência de theta nas últimas N estimativas
 */
function verificarConvergencia(
  estado: EstadoSessao,
  criterios: CriteriosParada
): boolean {
  const historico = estado.historicoEstimacoes;

  if (historico.length < criterios.janelasConvergencia) {
    return false;
  }

  // Pegar últimas N estimativas
  const ultimas = historico.slice(-criterios.janelasConvergencia);
  const thetas = ultimas.map(e => e.theta);

  // Calcular variação
  const min = Math.min(...thetas);
  const max = Math.max(...thetas);
  const variacao = max - min;

  return variacao < criterios.limiteConvergencia;
}

/**
 * Verifica combinação de critérios moderados
 * Útil para encerrar quando múltiplos indicadores são satisfatórios
 */
function verificarCriteriosCombinados(
  estado: EstadoSessao,
  criterios: CriteriosParada
): boolean {
  // Precisa de pelo menos 7 respostas
  if (estado.numeroRespostas < 7) return false;

  let criteriosAtendidos = 0;

  // Critério 1: SEM razoável (< 0.35)
  if (estado.ultimoSEM < criterios.semAlvo * 1.15) {
    criteriosAtendidos++;
  }

  // Critério 2: Confiança moderada (> 0.70)
  if (estado.ultimaConfianca > criterios.confiancaMinima * 0.9) {
    criteriosAtendidos++;
  }

  // Critério 3: Convergência parcial
  if (
    estado.historicoEstimacoes.length >= 3 &&
    verificarConvergencia(estado, {
      ...criterios,
      limiteConvergencia: criterios.limiteConvergencia * 1.5
    })
  ) {
    criteriosAtendidos++;
  }

  // Critério 4: Respostas consistentes
  if (estado.respostasConsistentes) {
    criteriosAtendidos++;
  }

  // Encerrar se 3 ou mais critérios atendidos
  return criteriosAtendidos >= 3;
}

/**
 * Calcula métricas de qualidade e progresso
 */
function calcularMetricas(
  estado: EstadoSessao,
  criterios: CriteriosParada
): ResultadoParada['metricas'] {
  // Progresso (0-1)
  const progressoPerguntas = Math.min(
    1,
    estado.numeroRespostas / criterios.minimoPerguntas
  );
  const progressoPrecisao =
    estado.ultimoSEM < 999
      ? Math.max(0, 1 - estado.ultimoSEM / criterios.semAlvo)
      : 0;
  const progressoConfianca = estado.ultimaConfianca;

  const progresso =
    (progressoPerguntas + progressoPrecisao + progressoConfianca) / 3;

  // Qualidade
  let qualidade: 'baixa' | 'media' | 'alta' = 'baixa';
  if (estado.ultimoSEM < criterios.semAlvo && estado.ultimaConfianca > 0.75) {
    qualidade = 'alta';
  } else if (
    estado.ultimoSEM < criterios.semAlvo * 1.3 &&
    estado.ultimaConfianca > 0.65
  ) {
    qualidade = 'media';
  }

  // Recomendação
  let recomendacao = '';
  if (qualidade === 'alta') {
    recomendacao = 'Estimativa de alta qualidade, pode encerrar';
  } else if (qualidade === 'media') {
    recomendacao = `Continue para melhorar precisão (SEM atual: ${estado.ultimoSEM.toFixed(3)})`;
  } else {
    recomendacao = `Necessário mais respostas para estimativa confiável`;
  }

  return {
    progresso,
    qualidade,
    recomendacao
  };
}

/**
 * Cria estado da sessão a partir de respostas e histórico
 */
export function criarEstadoSessao(
  numeroRespostas: number,
  tempoInicioMs: number,
  historicoEstimacoes: ResultadoEstimacao[],
  respostasConsistentes: boolean = true
): EstadoSessao {
  const tempoDecorridoSegundos = Math.floor((Date.now() - tempoInicioMs) / 1000);
  const ultimaEstimacao =
    historicoEstimacoes[historicoEstimacoes.length - 1] || {
      theta: 0,
      erro: 999,
      confianca: 0
    };

  return {
    numeroRespostas,
    tempoDecorridoSegundos,
    historicoEstimacoes,
    ultimoTheta: ultimaEstimacao.theta,
    ultimoSEM: ultimaEstimacao.erro,
    ultimaConfianca: ultimaEstimacao.confianca,
    respostasConsistentes
  };
}

/**
 * Formata resultado de parada para log
 */
export function formatarResultadoParada(resultado: ResultadoParada): string {
  if (!resultado.deveparar) {
    return `⏳ Continue: ${resultado.metricas.recomendacao} (progresso: ${(resultado.metricas.progresso * 100).toFixed(0)}%)`;
  }

  return `🛑 Parar: ${resultado.motivo} [${resultado.criterioAtingido}] - Qualidade: ${resultado.metricas.qualidade}`;
}
