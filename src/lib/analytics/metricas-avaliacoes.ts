/**
 * Módulo de Análise de Métricas - Avaliações
 * 
 * Calcula médias ponderadas, tendências e agregações
 * para relatórios avançados de avaliações.
 */

export interface AvaliacaoAulaCompleta {
  id: number;
  data: Date;
  aulaTitulo: string;
  aulaMateria: string;
  professor: string;
  socioemocional?: {
    valencia: number;
    ativacao: number;
    estadoPrimario: string;
    confianca: number;
    thetaEstimado: number;
    totalPerguntas: number;
  };
  didatica?: {
    compreensaoConteudo: number;
    ritmoAula: number;
    recursosDidaticos: number;
    engajamento: number;
    pontoPositivo?: string;
    sugestao?: string;
  };
}

export interface MetricasAgregadas {
  // Gerais
  totalAvaliacoes: number;
  periodoInicio: Date;
  periodoFim: Date;
  
  // Socioemocionais
  socioemocional: {
    valenciaMedia: number;
    valenciaDesvio: number;
    ativacaoMedia: number;
    ativacaoDesvio: number;
    confiancaMedia: number;
    thetaMedio: number;
    estadosPredominantes: { estado: string; frequencia: number; percentual: number }[];
  };
  
  // Didáticas
  didatica: {
    compreensaoMedia: number;
    ritmoMedio: number;
    recursosMedio: number;
    engajamentoMedio: number;
    notaGeralMedia: number; // Média ponderada de todos
    distribuicaoNotas: { nota: number; quantidade: number }[];
  };
  
  // Por Matéria
  porMateria: {
    materia: string;
    totalAvaliacoes: number;
    valenciaMedia: number;
    engajamentoMedio: number;
    compreensaoMedia: number;
    notaGeralMedia: number;
  }[];
  
  // Tendências Temporais
  tendencias: {
    tipo: 'crescente' | 'estavel' | 'decrescente';
    metrica: string;
    variacao: number; // percentual
  }[];
}

/**
 * Calcula média ponderada dos componentes didáticos
 * Pesos: compreensão (30%), engajamento (30%), ritmo (20%), recursos (20%)
 */
export function calcularMediaDidaticaPonderada(didatica: {
  compreensaoConteudo: number;
  ritmoAula: number;
  recursosDidaticos: number;
  engajamento: number;
}): number {
  const pesos = {
    compreensao: 0.30,
    engajamento: 0.30,
    ritmo: 0.20,
    recursos: 0.20,
  };
  
  // Normalizar engajamento (0-10) para escala 0-5
  const engajamentoNormalizado = (didatica.engajamento / 10) * 5;
  
  return (
    didatica.compreensaoConteudo * pesos.compreensao +
    engajamentoNormalizado * pesos.engajamento +
    didatica.ritmoAula * pesos.ritmo +
    didatica.recursosDidaticos * pesos.recursos
  );
}

/**
 * Calcula desvio padrão
 */
function calcularDesvio(valores: number[], media: number): number {
  if (valores.length === 0) return 0;
  const variancia = valores.reduce((sum, v) => sum + Math.pow(v - media, 2), 0) / valores.length;
  return Math.sqrt(variancia);
}

/**
 * Calcula tendência (crescente, estável, decrescente)
 */
function calcularTendencia(valores: number[]): { tipo: 'crescente' | 'estavel' | 'decrescente'; variacao: number } {
  if (valores.length < 2) return { tipo: 'estavel', variacao: 0 };
  
  const metade = Math.floor(valores.length / 2);
  const primeiraMetade = valores.slice(0, metade);
  const segundaMetade = valores.slice(metade);
  
  const mediaPrimeira = primeiraMetade.reduce((a, b) => a + b, 0) / primeiraMetade.length;
  const mediaSegunda = segundaMetade.reduce((a, b) => a + b, 0) / segundaMetade.length;
  
  const variacao = ((mediaSegunda - mediaPrimeira) / mediaPrimeira) * 100;
  
  if (variacao > 5) return { tipo: 'crescente', variacao };
  if (variacao < -5) return { tipo: 'decrescente', variacao };
  return { tipo: 'estavel', variacao };
}

/**
 * Agrega todas as métricas de avaliações
 */
export function calcularMetricasAgregadas(avaliacoes: AvaliacaoAulaCompleta[]): MetricasAgregadas {
  if (avaliacoes.length === 0) {
    throw new Error('Nenhuma avaliação para calcular métricas');
  }
  
  // Ordenar por data
  const avaliacoesOrdenadas = [...avaliacoes].sort((a, b) => 
    new Date(a.data).getTime() - new Date(b.data).getTime()
  );
  
  // Filtrar avaliações com dados socioemocionais
  const comSocioemocional = avaliacoesOrdenadas.filter(a => a.socioemocional);
  const comDidatica = avaliacoesOrdenadas.filter(a => a.didatica);
  
  // Socioemocional
  const valencias = comSocioemocional.map(a => a.socioemocional!.valencia);
  const ativacoes = comSocioemocional.map(a => a.socioemocional!.ativacao);
  const confiancas = comSocioemocional.map(a => a.socioemocional!.confianca);
  const thetas = comSocioemocional.map(a => a.socioemocional!.thetaEstimado);
  
  const valenciaMedia = valencias.reduce((a, b) => a + b, 0) / valencias.length;
  const ativacaoMedia = ativacoes.reduce((a, b) => a + b, 0) / ativacoes.length;
  const confiancaMedia = confiancas.reduce((a, b) => a + b, 0) / confiancas.length;
  const thetaMedio = thetas.reduce((a, b) => a + b, 0) / thetas.length;
  
  // Estados predominantes
  const estadosCount = comSocioemocional.reduce((acc, av) => {
    const estado = av.socioemocional!.estadoPrimario;
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const estadosPredominantes = Object.entries(estadosCount)
    .map(([estado, frequencia]) => ({
      estado,
      frequencia,
      percentual: (frequencia / comSocioemocional.length) * 100
    }))
    .sort((a, b) => b.frequencia - a.frequencia);
  
  // Didática
  const compreensoes = comDidatica.map(a => a.didatica!.compreensaoConteudo);
  const ritmos = comDidatica.map(a => a.didatica!.ritmoAula);
  const recursos = comDidatica.map(a => a.didatica!.recursosDidaticos);
  const engajamentos = comDidatica.map(a => a.didatica!.engajamento);
  
  const compreensaoMedia = compreensoes.reduce((a, b) => a + b, 0) / compreensoes.length;
  const ritmoMedio = ritmos.reduce((a, b) => a + b, 0) / ritmos.length;
  const recursosMedio = recursos.reduce((a, b) => a + b, 0) / recursos.length;
  const engajamentoMedio = engajamentos.reduce((a, b) => a + b, 0) / engajamentos.length;
  
  // Notas gerais ponderadas
  const notasGerais = comDidatica.map(a => calcularMediaDidaticaPonderada(a.didatica!));
  const notaGeralMedia = notasGerais.reduce((a, b) => a + b, 0) / notasGerais.length;
  
  // Distribuição de notas (arredondadas)
  const notasArredondadas = notasGerais.map(n => Math.round(n));
  const distribuicaoNotas = [1, 2, 3, 4, 5].map(nota => ({
    nota,
    quantidade: notasArredondadas.filter(n => n === nota).length
  }));
  
  // Por Matéria
  const materias = [...new Set(avaliacoesOrdenadas.map(a => a.aulaMateria))];
  const porMateria = materias.map(materia => {
    const daMateria = avaliacoesOrdenadas.filter(a => a.aulaMateria === materia);
    const comSocio = daMateria.filter(a => a.socioemocional);
    const comDida = daMateria.filter(a => a.didatica);
    
    return {
      materia,
      totalAvaliacoes: daMateria.length,
      valenciaMedia: comSocio.length > 0
        ? comSocio.reduce((sum, a) => sum + a.socioemocional!.valencia, 0) / comSocio.length
        : 0,
      engajamentoMedio: comDida.length > 0
        ? comDida.reduce((sum, a) => sum + a.didatica!.engajamento, 0) / comDida.length
        : 0,
      compreensaoMedia: comDida.length > 0
        ? comDida.reduce((sum, a) => sum + a.didatica!.compreensaoConteudo, 0) / comDida.length
        : 0,
      notaGeralMedia: comDida.length > 0
        ? comDida.reduce((sum, a) => sum + calcularMediaDidaticaPonderada(a.didatica!), 0) / comDida.length
        : 0,
    };
  }).sort((a, b) => b.notaGeralMedia - a.notaGeralMedia);
  
  // Tendências
  const tendenciaValencia = calcularTendencia(valencias);
  const tendenciaEngajamento = calcularTendencia(engajamentos);
  const tendenciaCompreensao = calcularTendencia(compreensoes);
  
  const tendencias = [
    { tipo: tendenciaValencia.tipo, metrica: 'Valência Emocional', variacao: tendenciaValencia.variacao },
    { tipo: tendenciaEngajamento.tipo, metrica: 'Engajamento', variacao: tendenciaEngajamento.variacao },
    { tipo: tendenciaCompreensao.tipo, metrica: 'Compreensão', variacao: tendenciaCompreensao.variacao },
  ];
  
  return {
    totalAvaliacoes: avaliacoes.length,
    periodoInicio: new Date(avaliacoesOrdenadas[0].data),
    periodoFim: new Date(avaliacoesOrdenadas[avaliacoesOrdenadas.length - 1].data),
    
    socioemocional: {
      valenciaMedia,
      valenciaDesvio: calcularDesvio(valencias, valenciaMedia),
      ativacaoMedia,
      ativacaoDesvio: calcularDesvio(ativacoes, ativacaoMedia),
      confiancaMedia,
      thetaMedio,
      estadosPredominantes,
    },
    
    didatica: {
      compreensaoMedia,
      ritmoMedio,
      recursosMedio,
      engajamentoMedio,
      notaGeralMedia,
      distribuicaoNotas,
    },
    
    porMateria,
    tendencias,
  };
}

/**
 * Formata percentual com sinal
 */
export function formatarVariacao(variacao: number): string {
  const sinal = variacao > 0 ? '+' : '';
  return `${sinal}${variacao.toFixed(1)}%`;
}

/**
 * Determina cor da tendência
 */
export function corTendencia(tipo: 'crescente' | 'estavel' | 'decrescente'): string {
  switch (tipo) {
    case 'crescente': return 'text-green-600 dark:text-green-400';
    case 'decrescente': return 'text-red-600 dark:text-red-400';
    case 'estavel': return 'text-blue-600 dark:text-blue-400';
  }
}

/**
 * Ícone da tendência
 */
export function iconeTendencia(tipo: 'crescente' | 'estavel' | 'decrescente'): string {
  switch (tipo) {
    case 'crescente': return '📈';
    case 'decrescente': return '📉';
    case 'estavel': return '➡️';
  }
}
