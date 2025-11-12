/**
 * IRT Refinado - Melhorias no cálculo de Theta e convergência
 * 
 * Implementa:
 * - Método Newton-Raphson otimizado com step decay
 * - Estimação Bayesiana (EAP) como fallback
 * - Detecção de convergência precoce
 * - Estabilização de theta em casos extremos
 * - Métricas de confiabilidade aprimoradas
 */

export interface ConfiguracaoIRT {
  discriminacao: number; // a (0.5-2.5)
  dificuldade: number;   // b (-3 a +3)
  acerto: number;        // c (0-0.3)
}

export interface RespostaIRT {
  valorNormalizado: number; // 0-1
  configuracaoIRT: ConfiguracaoIRT;
  tempoResposta?: number; // segundos
}

export interface ResultadoEstimacao {
  theta: number;
  erro: number;
  convergiu: boolean;
  iteracoes: number;
  metodo: 'MLE' | 'EAP' | 'MAP';
  confianca: number;
  estavel: boolean;
}

// Constantes de configuração
const THETA_MIN = -4.0;
const THETA_MAX = 4.0;
const THETA_INICIAL = 0.0;
const MAX_ITERACOES = 30; // Aumentado de 20
const TOLERANCIA = 0.0001; // Mais rigoroso (era 0.001)
const MAX_PASSO = 0.5;
const MIN_PASSO = 0.01;
const STEP_DECAY = 0.95; // Decaimento do passo a cada iteração

// Parâmetros bayesianos (prior normal)
const PRIOR_MEAN = 0.0;
const PRIOR_SD = 1.5; // Desvio padrão do prior

/**
 * Calcula probabilidade de acerto (modelo 3PL)
 */
function probabilidadeAcerto(
  theta: number,
  config: ConfiguracaoIRT
): number {
  const { discriminacao, dificuldade, acerto } = config;
  const expoente = discriminacao * (theta - dificuldade);
  
  // Limitar expoente para evitar overflow
  const expCapped = Math.min(Math.max(expoente, -20), 20);
  
  const prob = acerto + (1 - acerto) / (1 + Math.exp(-expCapped));
  return Math.max(0.001, Math.min(0.999, prob)); // Evitar 0 ou 1 exatos
}

/**
 * Calcula informação de Fisher
 */
export function calcularInformacao(
  theta: number,
  config: ConfiguracaoIRT
): number {
  const p = probabilidadeAcerto(theta, config);
  const q = 1 - p;
  const { discriminacao, acerto } = config;
  
  if (p < 0.001 || q < 0.001) return 0;
  
  const numerador = Math.pow(discriminacao, 2) * Math.pow(p - acerto, 2);
  const denominador = p * q * Math.pow(1 - acerto, 2);
  
  if (denominador < 1e-10) return 0;
  
  return numerador / denominador;
}

/**
 * Estima theta usando Maximum Likelihood Estimation (MLE) aprimorado
 * com step decay e proteção contra divergência
 */
export function estimarThetaMLE(
  respostas: RespostaIRT[],
  thetaInicial: number = THETA_INICIAL
): ResultadoEstimacao {
  if (respostas.length === 0) {
    return {
      theta: THETA_INICIAL,
      erro: 999,
      convergiu: false,
      iteracoes: 0,
      metodo: 'MLE',
      confianca: 0,
      estavel: false
    };
  }

  let theta = Math.max(THETA_MIN, Math.min(THETA_MAX, thetaInicial));
  let passo = MAX_PASSO;
  let convergiu = false;
  let iteracoes = 0;

  // Newton-Raphson com step decay
  for (iteracoes = 0; iteracoes < MAX_ITERACOES; iteracoes++) {
    let primeiraDerivada = 0;
    let segundaDerivada = 0;

    // Calcular derivadas
    for (const resposta of respostas) {
      const { valorNormalizado, configuracaoIRT } = resposta;
      const { discriminacao, acerto } = configuracaoIRT;

      const p = probabilidadeAcerto(theta, configuracaoIRT);
      const q = 1 - p;

      if (p < 0.001 || q < 0.001) continue;

      const w = (p - acerto) / ((1 - acerto) * p);
      const e = valorNormalizado - p;

      primeiraDerivada += discriminacao * w * e;
      segundaDerivada -= Math.pow(discriminacao, 2) * w * (w + q) * p;
    }

    // Verificar convergência
    if (Math.abs(primeiraDerivada) < TOLERANCIA) {
      convergiu = true;
      break;
    }

    // Calcular passo com proteção
    if (Math.abs(segundaDerivada) < 1e-10) {
      // Derivada segunda muito pequena, usar gradiente descendente
      const ajuste = passo * Math.sign(primeiraDerivada) * 0.1;
      theta += ajuste;
    } else {
      // Newton-Raphson padrão com step decay
      let ajuste = -primeiraDerivada / segundaDerivada;
      ajuste = Math.max(-passo, Math.min(passo, ajuste));
      theta += ajuste;
    }

    // Aplicar step decay
    passo = Math.max(MIN_PASSO, passo * STEP_DECAY);

    // Clampar theta
    theta = Math.max(THETA_MIN, Math.min(THETA_MAX, theta));
  }

  // Calcular erro padrão (SEM)
  const informacaoTotal = respostas.reduce(
    (sum, r) => sum + calcularInformacao(theta, r.configuracaoIRT),
    0
  );
  const erro = informacaoTotal > 0 ? 1 / Math.sqrt(informacaoTotal) : 999;

  // Calcular confiança
  const confianca = calcularConfianca(erro, respostas.length);

  // Verificar estabilidade
  const estavel = verificarEstabilidade(respostas, theta);

  return {
    theta,
    erro,
    convergiu,
    iteracoes,
    metodo: 'MLE',
    confianca,
    estavel
  };
}

/**
 * Estima theta usando Expected A Posteriori (EAP) - Estimação Bayesiana
 * Útil quando MLE diverge ou com poucas respostas
 */
export function estimarThetaEAP(
  respostas: RespostaIRT[]
): ResultadoEstimacao {
  if (respostas.length === 0) {
    return {
      theta: THETA_INICIAL,
      erro: 999,
      convergiu: false,
      iteracoes: 0,
      metodo: 'EAP',
      confianca: 0,
      estavel: false
    };
  }

  // Quadratura de Gauss-Hermite (simplificada, 21 pontos)
  const numPontos = 21;
  const pontos: number[] = [];
  const pesos: number[] = [];

  // Gerar pontos de quadratura centrados no prior
  for (let i = 0; i < numPontos; i++) {
    const theta = THETA_MIN + (i / (numPontos - 1)) * (THETA_MAX - THETA_MIN);
    pontos.push(theta);

    // Peso = prior * likelihood
    let peso = priorNormal(theta);

    for (const resposta of respostas) {
      const p = probabilidadeAcerto(theta, resposta.configuracaoIRT);
      const likelihood = resposta.valorNormalizado === 1 ? p : (1 - p);
      peso *= likelihood;
    }

    pesos.push(peso);
  }

  // Normalizar pesos
  const somaPesos = pesos.reduce((a, b) => a + b, 0);
  const pesosNorm = pesos.map(p => p / somaPesos);

  // Calcular esperança (média posterior)
  const theta = pontos.reduce((sum, t, i) => sum + t * pesosNorm[i], 0);

  // Calcular variância posterior
  const variancia = pontos.reduce(
    (sum, t, i) => sum + Math.pow(t - theta, 2) * pesosNorm[i],
    0
  );
  const erro = Math.sqrt(variancia);

  const confianca = calcularConfianca(erro, respostas.length);
  const estavel = verificarEstabilidade(respostas, theta);

  return {
    theta: Math.max(THETA_MIN, Math.min(THETA_MAX, theta)),
    erro,
    convergiu: true,
    iteracoes: numPontos,
    metodo: 'EAP',
    confianca,
    estavel
  };
}

/**
 * Estima theta de forma robusta, usando MLE com fallback para EAP
 */
export function estimarThetaRobusta(
  respostas: RespostaIRT[],
  thetaAnterior: number = THETA_INICIAL
): ResultadoEstimacao {
  // Tentar MLE primeiro
  const resultadoMLE = estimarThetaMLE(respostas, thetaAnterior);

  // Se MLE convergiu e é estável, usar ele
  if (resultadoMLE.convergiu && resultadoMLE.estavel) {
    return resultadoMLE;
  }

  // Se MLE não convergiu ou é instável, tentar EAP
  console.warn(
    `[IRT] MLE ${resultadoMLE.convergiu ? 'instável' : 'não convergiu'}, usando EAP`
  );
  const resultadoEAP = estimarThetaEAP(respostas);

  // Se EAP também falhar, retornar MLE mesmo assim
  if (!resultadoEAP.convergiu) {
    console.warn('[IRT] EAP também falhou, usando MLE mesmo assim');
    return resultadoMLE;
  }

  return resultadoEAP;
}

/**
 * Densidade da distribuição normal (prior)
 */
function priorNormal(theta: number): number {
  const z = (theta - PRIOR_MEAN) / PRIOR_SD;
  return Math.exp(-0.5 * z * z) / (PRIOR_SD * Math.sqrt(2 * Math.PI));
}

/**
 * Calcula confiança na estimativa (0-1)
 * Leva em conta tanto o erro quanto o número de respostas
 */
function calcularConfianca(erro: number, numRespostas: number): number {
  if (erro >= 999) return 0;

  // Componente baseada em erro (SEM)
  const confiancaErro = 1 / (1 + erro);

  // Componente baseada em tamanho amostral
  const confiancaAmostra = Math.min(1, numRespostas / 10);

  // Média ponderada (70% erro, 30% amostra)
  return 0.7 * confiancaErro + 0.3 * confiancaAmostra;
}

/**
 * Verifica se a estimativa de theta está estável
 * Detecta padrões inconsistentes de respostas
 */
function verificarEstabilidade(
  respostas: RespostaIRT[],
  theta: number
): boolean {
  if (respostas.length < 3) return false;

  // Calcular resíduos (diferença entre resposta observada e esperada)
  const residuos = respostas.map(r => {
    const esperado = probabilidadeAcerto(theta, r.configuracaoIRT);
    return r.valorNormalizado - esperado;
  });

  // Calcular estatística de ajuste (RMSE)
  const mse = residuos.reduce((sum, r) => sum + r * r, 0) / residuos.length;
  const rmse = Math.sqrt(mse);

  // RMSE < 0.4 indica bom ajuste
  return rmse < 0.4;
}

/**
 * Calcula Standard Error of Measurement (SEM)
 */
export function calcularSEM(
  respostas: RespostaIRT[],
  theta: number
): number {
  const informacaoTotal = respostas.reduce(
    (sum, r) => sum + calcularInformacao(theta, r.configuracaoIRT),
    0
  );

  if (informacaoTotal <= 0) return 999;

  return 1 / Math.sqrt(informacaoTotal);
}

/**
 * Detecta convergência precoce (quando adicionar mais perguntas não melhora)
 */
export function detectarConvergenciaPrecoce(
  historico: ResultadoEstimacao[]
): boolean {
  if (historico.length < 3) return false;

  // Verificar últimas 3 estimativas
  const ultimas3 = historico.slice(-3);

  // Variação de theta
  const thetas = ultimas3.map(h => h.theta);
  const variacaoTheta = Math.max(...thetas) - Math.min(...thetas);

  // Variação de erro
  const erros = ultimas3.map(h => h.erro);
  const variacaoErro = Math.max(...erros) - Math.min(...erros);

  // Convergiu se variações são pequenas
  return variacaoTheta < 0.1 && variacaoErro < 0.05;
}
