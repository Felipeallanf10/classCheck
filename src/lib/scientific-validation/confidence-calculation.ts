/**
 * Cálculos de Intervalos de Confiança e Validação Estatística
 * Para análise de dados psicométricos e comportamentais
 */

export interface ConfidenceInterval {
  lower: number;
  upper: number;
  mean: number;
  margin: number;
  confidenceLevel: number;
}

export interface StatisticalTest {
  statistic: number;
  pValue: number;
  critical: number;
  isSignificant: boolean;
  effect: 'small' | 'medium' | 'large';
}

/**
 * Calcula o intervalo de confiança para uma média
 * @param data Array de valores numéricos
 * @param confidenceLevel Nível de confiança (0.90, 0.95, 0.99)
 * @returns Objeto com intervalo de confiança
 */
export function calculateConfidenceInterval(
  data: number[], 
  confidenceLevel: number = 0.95
): ConfidenceInterval {
  if (data.length === 0) {
    throw new Error('Array de dados não pode estar vazio');
  }

  const n = data.length;
  const mean = data.reduce((sum, value) => sum + value, 0) / n;
  
  // Calcular desvio padrão
  const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (n - 1);
  const standardDeviation = Math.sqrt(variance);
  
  // Valor crítico t (aproximação para grandes amostras)
  const alpha = 1 - confidenceLevel;
  const tCritical = getTCritical(alpha / 2, n - 1);
  
  // Erro padrão
  const standardError = standardDeviation / Math.sqrt(n);
  
  // Margem de erro
  const marginOfError = tCritical * standardError;
  
  return {
    lower: mean - marginOfError,
    upper: mean + marginOfError,
    mean,
    margin: marginOfError,
    confidenceLevel
  };
}

/**
 * Aproximação do valor t crítico
 * @param alpha Nível de significância (α/2)
 * @param df Graus de liberdade
 * @returns Valor t crítico
 */
function getTCritical(alpha: number, df: number): number {
  // Aproximações para valores comuns de t
  const tTable: { [key: string]: { [key: number]: number } } = {
    '0.025': { // 95% de confiança
      1: 12.706, 5: 2.571, 10: 2.228, 15: 2.131, 20: 2.086, 
      25: 2.060, 30: 2.042, 40: 2.021, 50: 2.009, 100: 1.984, 
      1000: 1.962
    },
    '0.05': { // 90% de confiança
      1: 6.314, 5: 2.015, 10: 1.812, 15: 1.753, 20: 1.725,
      25: 1.708, 30: 1.697, 40: 1.684, 50: 1.676, 100: 1.660,
      1000: 1.645
    },
    '0.005': { // 99% de confiança
      1: 63.657, 5: 4.032, 10: 3.169, 15: 2.947, 20: 2.845,
      25: 2.787, 30: 2.750, 40: 2.704, 50: 2.678, 100: 2.626,
      1000: 2.576
    }
  };

  const alphaKey = alpha.toString();
  if (!tTable[alphaKey]) {
    return 1.96; // Valor padrão para distribuição normal
  }

  const table = tTable[alphaKey];
  
  // Encontrar o valor mais próximo de df
  const availableDf = Object.keys(table).map(Number).sort((a, b) => a - b);
  
  for (let i = 0; i < availableDf.length; i++) {
    if (df <= availableDf[i]) {
      return table[availableDf[i]];
    }
  }
  
  return table[1000]; // Para df muito grandes
}

/**
 * Teste t para uma amostra
 * @param data Array de valores
 * @param hypothesizedMean Média hipotética para teste
 * @param confidenceLevel Nível de confiança
 * @returns Resultado do teste estatístico
 */
export function oneSampleTTest(
  data: number[], 
  hypothesizedMean: number = 0, 
  confidenceLevel: number = 0.95
): StatisticalTest {
  const n = data.length;
  const sampleMean = data.reduce((sum, value) => sum + value, 0) / n;
  const variance = data.reduce((sum, value) => sum + Math.pow(value - sampleMean, 2), 0) / (n - 1);
  const standardDeviation = Math.sqrt(variance);
  
  // Estatística t
  const tStatistic = (sampleMean - hypothesizedMean) / (standardDeviation / Math.sqrt(n));
  
  // Valor crítico
  const alpha = 1 - confidenceLevel;
  const tCritical = getTCritical(alpha / 2, n - 1);
  
  // P-valor aproximado (bilateral)
  const pValue = calculatePValue(Math.abs(tStatistic), n - 1);
  
  // Tamanho do efeito (Cohen's d)
  const cohensD = Math.abs((sampleMean - hypothesizedMean) / standardDeviation);
  let effect: 'small' | 'medium' | 'large';
  if (cohensD < 0.2) effect = 'small';
  else if (cohensD < 0.8) effect = 'medium';
  else effect = 'large';
  
  return {
    statistic: tStatistic,
    pValue,
    critical: tCritical,
    isSignificant: Math.abs(tStatistic) > tCritical,
    effect
  };
}

/**
 * Teste t para duas amostras independentes
 * @param sample1 Primeira amostra
 * @param sample2 Segunda amostra
 * @param confidenceLevel Nível de confiança
 * @returns Resultado do teste estatístico
 */
export function twoSampleTTest(
  sample1: number[], 
  sample2: number[], 
  confidenceLevel: number = 0.95
): StatisticalTest {
  const n1 = sample1.length;
  const n2 = sample2.length;
  
  const mean1 = sample1.reduce((sum, value) => sum + value, 0) / n1;
  const mean2 = sample2.reduce((sum, value) => sum + value, 0) / n2;
  
  const var1 = sample1.reduce((sum, value) => sum + Math.pow(value - mean1, 2), 0) / (n1 - 1);
  const var2 = sample2.reduce((sum, value) => sum + Math.pow(value - mean2, 2), 0) / (n2 - 1);
  
  // Desvio padrão agrupado
  const pooledVariance = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
  const pooledSD = Math.sqrt(pooledVariance);
  
  // Erro padrão da diferença
  const standardError = pooledSD * Math.sqrt(1/n1 + 1/n2);
  
  // Estatística t
  const tStatistic = (mean1 - mean2) / standardError;
  
  // Graus de liberdade
  const df = n1 + n2 - 2;
  
  // Valor crítico
  const alpha = 1 - confidenceLevel;
  const tCritical = getTCritical(alpha / 2, df);
  
  // P-valor aproximado
  const pValue = calculatePValue(Math.abs(tStatistic), df);
  
  // Tamanho do efeito
  const cohensD = Math.abs((mean1 - mean2) / pooledSD);
  let effect: 'small' | 'medium' | 'large';
  if (cohensD < 0.2) effect = 'small';
  else if (cohensD < 0.8) effect = 'medium';
  else effect = 'large';
  
  return {
    statistic: tStatistic,
    pValue,
    critical: tCritical,
    isSignificant: Math.abs(tStatistic) > tCritical,
    effect
  };
}

/**
 * Aproximação do p-valor para distribuição t
 * @param tStatistic Valor da estatística t
 * @param df Graus de liberdade
 * @returns P-valor aproximado
 */
function calculatePValue(tStatistic: number, df: number): number {
  // Aproximação simples baseada na distribuição normal para df > 30
  if (df > 30) {
    return 2 * (1 - normalCDF(tStatistic));
  }
  
  // Para df menores, usar aproximações tabeladas
  const criticalValues = [
    { t: 1.0, p: 0.4 },
    { t: 1.5, p: 0.2 },
    { t: 2.0, p: 0.1 },
    { t: 2.5, p: 0.05 },
    { t: 3.0, p: 0.02 },
    { t: 3.5, p: 0.01 },
    { t: 4.0, p: 0.005 }
  ];
  
  for (let i = 0; i < criticalValues.length; i++) {
    if (tStatistic <= criticalValues[i].t) {
      return criticalValues[i].p;
    }
  }
  
  return 0.001; // Para valores muito altos de t
}

/**
 * Função de distribuição cumulativa normal padrão
 * @param z Valor z
 * @returns Probabilidade cumulativa
 */
function normalCDF(z: number): number {
  // Aproximação usando série de Taylor
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  return z > 0 ? 1 - prob : prob;
}

/**
 * Calcula o tamanho da amostra necessário para um intervalo de confiança
 * @param marginOfError Margem de erro desejada
 * @param standardDeviation Desvio padrão estimado
 * @param confidenceLevel Nível de confiança
 * @returns Tamanho mínimo da amostra
 */
export function calculateSampleSize(
  marginOfError: number, 
  standardDeviation: number, 
  confidenceLevel: number = 0.95
): number {
  const alpha = 1 - confidenceLevel;
  const zCritical = getTCritical(alpha / 2, 1000); // Aproximação com z
  
  const n = Math.pow((zCritical * standardDeviation) / marginOfError, 2);
  return Math.ceil(n);
}

/**
 * Análise de confiabilidade (Cronbach's Alpha)
 * @param items Array de arrays, onde cada sub-array representa as respostas de um item
 * @returns Valor de Alpha de Cronbach
 */
export function calculateCronbachAlpha(items: number[][]): number {
  if (items.length < 2) {
    throw new Error('Necessário pelo menos 2 itens para calcular Alpha de Cronbach');
  }
  
  const k = items.length; // Número de itens
  const n = items[0].length; // Número de respondentes
  
  // Calcular variância de cada item
  const itemVariances = items.map(item => {
    const mean = item.reduce((sum, value) => sum + value, 0) / n;
    return item.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (n - 1);
  });
  
  // Calcular scores totais para cada respondente
  const totalScores = Array(n).fill(0).map((_, i) => 
    items.reduce((sum, item) => sum + item[i], 0)
  );
  
  // Calcular variância dos scores totais
  const totalMean = totalScores.reduce((sum, score) => sum + score, 0) / n;
  const totalVariance = totalScores.reduce((sum, score) => sum + Math.pow(score - totalMean, 2), 0) / (n - 1);
  
  // Calcular Alpha de Cronbach
  const sumItemVariances = itemVariances.reduce((sum, variance) => sum + variance, 0);
  const alpha = (k / (k - 1)) * (1 - (sumItemVariances / totalVariance));
  
  return alpha;
}

/**
 * Utilitário para interpretar o Alpha de Cronbach
 * @param alpha Valor do Alpha de Cronbach
 * @returns Interpretação da confiabilidade
 */
export function interpretCronbachAlpha(alpha: number): string {
  if (alpha >= 0.9) return 'Excelente';
  if (alpha >= 0.8) return 'Boa';
  if (alpha >= 0.7) return 'Aceitável';
  if (alpha >= 0.6) return 'Questionável';
  return 'Pobre';
}
