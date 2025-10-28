/**
 * Serviço Avançado de Seleção de Perguntas com Fisher Information
 * 
 * Implementa CAT (Computerized Adaptive Testing) de nível profissional
 * com seleção por máxima informação e balanceamento inteligente.
 */

import { prisma } from '@/lib/prisma';

// ==============================================
// TIPOS E CONSTANTES
// ==============================================

interface ConfiguracaoIRT {
  discriminacao: number; // a (0.5 - 2.5)
  dificuldade: number;   // b (-3 a +3)
  acerto: number;        // c (0 - 0.3)
}

interface PerguntaComScore {
  id: string;
  codigo?: string;
  titulo: string;
  categoria: string;
  dominio?: string;
  subcategoria?: string;
  prioridade?: string;
  configuracaoIRT: ConfiguracaoIRT;
  informacao: number;
  scoreAjustado: number;
  origem: 'questionario' | 'banco';
}

interface ContadoresBalanceamento {
  categorias: Map<string, number>;
  dominios: Map<string, number>;
  escalas: Map<string, number>;
}

// Parâmetros de balanceamento
const MAX_PERGUNTAS_CATEGORIA = 5;
const MAX_PERGUNTAS_DOMINIO = 4;
const MAX_PERGUNTAS_ESCALA = 3;
const PENALIDADE_REPETICAO_CATEGORIA = 0.7;
const PENALIDADE_REPETICAO_DOMINIO = 0.8;
const PENALIDADE_REPETICAO_ESCALA = 0.85;

// Informação mínima aceitável (ajustável dinamicamente)
const INFORMACAO_MINIMA_BASE = 0.05;
const INFORMACAO_MINIMA_INICIAL = 0.01; // Mais permissivo nas primeiras respostas

// ==============================================
// FUNÇÕES IRT CORE
// ==============================================

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
  
  return acerto + (1 - acerto) / (1 + Math.exp(-expCapped));
}

/**
 * Calcula informação de Fisher no theta atual
 */
function calcularInformacao(
  theta: number,
  config: ConfiguracaoIRT
): number {
  const p = probabilidadeAcerto(theta, config);
  const q = 1 - p;
  const { discriminacao, acerto } = config;
  
  // Evitar divisão por zero
  if (p === 0 || q === 0 || p === 1 || q === 1) {
    return 0;
  }
  
  const numerador = Math.pow(discriminacao, 2) * Math.pow(p - acerto, 2);
  const denominador = p * q * Math.pow(1 - acerto, 2);
  
  // Evitar divisão por números muito pequenos
  if (denominador < 1e-10) {
    return 0;
  }
  
  return numerador / denominador;
}

// ==============================================
// BUSCA DE PERGUNTAS CANDIDATAS
// ==============================================

/**
 * Busca perguntas do questionário regular
 */
async function buscarPerguntasQuestionario(
  questionarioId: string,
  perguntasExcluir: string[]
): Promise<any[]> {
  return await prisma.perguntaSocioemocional.findMany({
    where: {
      questionarioId,
      ativo: true,
      NOT: {
        id: { in: perguntasExcluir }
      }
    }
  });
}

/**
 * Busca perguntas do banco adaptativo
 */
async function buscarPerguntasBanco(
  categoriasRelevantes?: string[],
  dominiosRelevantes?: string[],
  perguntasExcluir: string[] = []
): Promise<any[]> {
  const where: any = {
    NOT: {
      id: { in: perguntasExcluir }
    }
  };
  
  // Filtros opcionais por categoria/dominio
  if (categoriasRelevantes && categoriasRelevantes.length > 0) {
    where.categoria = { in: categoriasRelevantes };
  }
  
  if (dominiosRelevantes && dominiosRelevantes.length > 0) {
    where.dominio = { in: dominiosRelevantes };
  }
  
  return await prisma.bancoPerguntasAdaptativo.findMany({
    where
  });
}

// ==============================================
// BALANCEAMENTO E SELEÇÃO
// ==============================================

/**
 * Calcula contadores de categorias/domínios já respondidos
 */
function calcularContadores(respostas: any[]): ContadoresBalanceamento {
  const categorias = new Map<string, number>();
  const dominios = new Map<string, number>();
  const escalas = new Map<string, number>();
  
  for (const resposta of respostas) {
    // Categoria
    if (resposta.categoria) {
      categorias.set(
        resposta.categoria,
        (categorias.get(resposta.categoria) || 0) + 1
      );
    }
    
    // Domínio
    if (resposta.dominio) {
      dominios.set(
        resposta.dominio,
        (dominios.get(resposta.dominio) || 0) + 1
      );
    }
    
    // Escala (para perguntas do banco)
    if (resposta.escalaNome) {
      escalas.set(
        resposta.escalaNome,
        (escalas.get(resposta.escalaNome) || 0) + 1
      );
    }
  }
  
  return { categorias, dominios, escalas };
}

/**
 * Aplica penalidades de balanceamento ao score
 */
function aplicarPenalidades(
  score: number,
  pergunta: any,
  contadores: ContadoresBalanceamento
): number {
  let scoreAjustado = score;
  
  // Penalidade por categoria saturada
  if (pergunta.categoria) {
    const count = contadores.categorias.get(pergunta.categoria) || 0;
    if (count >= MAX_PERGUNTAS_CATEGORIA) {
      scoreAjustado *= Math.pow(PENALIDADE_REPETICAO_CATEGORIA, count - MAX_PERGUNTAS_CATEGORIA + 1);
    }
  }
  
  // Penalidade por domínio saturado
  if (pergunta.dominio) {
    const count = contadores.dominios.get(pergunta.dominio) || 0;
    if (count >= MAX_PERGUNTAS_DOMINIO) {
      scoreAjustado *= Math.pow(PENALIDADE_REPETICAO_DOMINIO, count - MAX_PERGUNTAS_DOMINIO + 1);
    }
  }
  
  // Penalidade por escala saturada (banco adaptativo)
  if (pergunta.escalaNome) {
    const count = contadores.escalas.get(pergunta.escalaNome) || 0;
    if (count >= MAX_PERGUNTAS_ESCALA) {
      scoreAjustado *= Math.pow(PENALIDADE_REPETICAO_ESCALA, count - MAX_PERGUNTAS_ESCALA + 1);
    }
  }
  
  return scoreAjustado;
}

/**
 * Boost de prioridade clínica
 */
function aplicarBoostPrioridade(score: number, prioridade?: string): number {
  if (!prioridade) return score;
  
  switch (prioridade) {
    case 'ALTA':
      return score * 1.5;
    case 'MEDIA':
      return score * 1.0;
    case 'BAIXA':
      return score * 0.7;
    default:
      return score;
  }
}

/**
 * Seleciona pergunta por máxima informação com balanceamento
 */
export async function selecionarPerguntaAvancada(
  questionarioId: string,
  theta: number,
  respostas: any[],
  perguntasExcluir: string[],
  opcoes?: {
    usarBanco?: boolean;
    categoriasRelevantes?: string[];
    dominiosRelevantes?: string[];
  }
): Promise<PerguntaComScore | null> {
  console.log(`\n🎯 [Seleção Avançada] Iniciando...`);
  console.log(`   Theta: ${theta.toFixed(3)}`);
  console.log(`   Respostas anteriores: ${respostas.length}`);
  console.log(`   Usar banco adaptativo: ${opcoes?.usarBanco ?? true}`);
  
  // Ajustar limiar de informação dinamicamente
  // Nas primeiras 3 respostas, ser mais permissivo
  const limiteInformacao = respostas.length < 3 
    ? INFORMACAO_MINIMA_INICIAL 
    : INFORMACAO_MINIMA_BASE;
  
  console.log(`   Limite de informação: ${limiteInformacao} (${respostas.length < 3 ? 'inicial' : 'padrão'})`);
  
  // 1. Buscar candidatas
  const candidatasQuestionario = await buscarPerguntasQuestionario(
    questionarioId,
    perguntasExcluir
  );
  
  let candidatasBanco: any[] = [];
  if (opcoes?.usarBanco !== false) {
    candidatasBanco = await buscarPerguntasBanco(
      opcoes?.categoriasRelevantes,
      opcoes?.dominiosRelevantes,
      perguntasExcluir
    );
  }
  
  console.log(`   Candidatas questionário: ${candidatasQuestionario.length}`);
  console.log(`   Candidatas banco: ${candidatasBanco.length}`);
  
  // 2. Calcular contadores de balanceamento
  const contadores = calcularContadores(respostas);
  
  // 3. Processar todas as candidatas
  const perguntasComScore: PerguntaComScore[] = [];
  
  // Processar perguntas do questionário
  for (const p of candidatasQuestionario) {
    const config: ConfiguracaoIRT = {
      discriminacao: p.configuracaoIRT?.discriminacao ?? p.discriminacao ?? 1.0,
      dificuldade: p.configuracaoIRT?.dificuldade ?? p.dificuldade ?? 0.0,
      acerto: p.configuracaoIRT?.acerto ?? 0.0
    };
    
    const informacao = calcularInformacao(theta, config);
    
    console.log(`   [Q] ${p.id.slice(0, 8)}: info=${informacao.toFixed(4)}, dif=${config.dificuldade.toFixed(2)}, disc=${config.discriminacao.toFixed(2)}`);
    
    // Filtrar perguntas com informação muito baixa
    if (informacao < limiteInformacao) {
      console.log(`      ❌ Rejeitada (info < ${limiteInformacao})`);
      continue;
    }
    
    let score = informacao;
    score = aplicarBoostPrioridade(score, p.prioridade);
    const scoreAjustado = aplicarPenalidades(score, p, contadores);
    
    perguntasComScore.push({
      id: p.id,
      codigo: p.codigo,
      titulo: p.titulo,
      categoria: p.categoria,
      dominio: p.dominio,
      subcategoria: p.subcategoria,
      prioridade: p.prioridade,
      configuracaoIRT: config,
      informacao,
      scoreAjustado,
      origem: 'questionario'
    });
  }
  
  // Processar perguntas do banco adaptativo
  for (const p of candidatasBanco) {
    const config: ConfiguracaoIRT = {
      discriminacao: p.parametroA ?? p.discriminacao ?? 1.0,
      dificuldade: p.parametroB ?? p.dificuldade ?? 0.0,
      acerto: p.parametroC ?? 0.0
    };
    
    const informacao = calcularInformacao(theta, config);
    
    console.log(`   [B] ${p.codigo || p.id.slice(0, 8)}: info=${informacao.toFixed(4)}, dif=${config.dificuldade.toFixed(2)}, disc=${config.discriminacao.toFixed(2)}`);
    
    if (informacao < limiteInformacao) {
      console.log(`      ❌ Rejeitada (info < ${limiteInformacao})`);
      continue;
    }
    
    // Perguntas do banco não têm prioridade, usar informação pura
    const scoreAjustado = aplicarPenalidades(informacao, p, contadores);
    
    perguntasComScore.push({
      id: p.id,
      codigo: p.codigo,
      titulo: p.titulo,
      categoria: p.categoria,
      dominio: p.dominio,
      subcategoria: p.subcategoria,
      configuracaoIRT: config,
      informacao,
      scoreAjustado,
      origem: 'banco'
    });
  }
  
  // 4. Ordenar por score ajustado (máxima informação)
  perguntasComScore.sort((a, b) => b.scoreAjustado - a.scoreAjustado);
  
  console.log(`\n📊 [Seleção] Perguntas após filtro: ${perguntasComScore.length}`);
  console.log(`   Top 5 candidatas:`);
  perguntasComScore.slice(0, 5).forEach((p, i) => {
    console.log(`   ${i + 1}. [${p.origem}] ${p.codigo || p.id.slice(0, 8)}`);
    console.log(`      Informação: ${p.informacao.toFixed(3)} → Score: ${p.scoreAjustado.toFixed(3)}`);
    console.log(`      Cat: ${p.categoria}, Dom: ${p.dominio || 'N/A'}`);
  });
  
  // 5. Fallback de segurança: Se nas primeiras 3 respostas não encontrou nada,
  //    selecionar a próxima pergunta por ordem simples (ignora informação de Fisher)
  if (perguntasComScore.length === 0 && respostas.length < 3) {
    console.log(`\n⚠️ [Fallback] Nenhuma pergunta passou no filtro IRT nas primeiras respostas`);
    console.log(`   Selecionando primeira pergunta disponível por ordem...`);
    
    const todasCandidatas = [...candidatasQuestionario, ...candidatasBanco];
    if (todasCandidatas.length > 0) {
      const perguntaFallback = todasCandidatas[0];
      const isBanco = candidatasBanco.includes(perguntaFallback);
      
      const config: ConfiguracaoIRT = isBanco
        ? {
            discriminacao: perguntaFallback.parametroA ?? 1.0,
            dificuldade: perguntaFallback.parametroB ?? 0.0,
            acerto: perguntaFallback.parametroC ?? 0.0
          }
        : {
            discriminacao: perguntaFallback.discriminacao ?? 1.0,
            dificuldade: perguntaFallback.dificuldade ?? 0.0,
            acerto: 0.0
          };
      
      const melhorFallback: PerguntaComScore = {
        id: perguntaFallback.id,
        codigo: perguntaFallback.codigo,
        titulo: perguntaFallback.titulo || perguntaFallback.texto,
        categoria: perguntaFallback.categoria,
        dominio: perguntaFallback.dominio,
        configuracaoIRT: config,
        informacao: 0.01, // Valor simbólico
        scoreAjustado: 0.01,
        origem: isBanco ? 'banco' : 'questionario'
      };
      
      console.log(`   ✅ [Fallback] ${melhorFallback.codigo || melhorFallback.id.slice(0, 8)} (${melhorFallback.origem})\n`);
      return melhorFallback;
    }
  }
  
  // 6. Retornar a melhor
  const melhor = perguntasComScore[0] || null;
  
  if (melhor) {
    console.log(`\n✅ [Selecionada] ${melhor.codigo || melhor.id}`);
    console.log(`   Informação de Fisher: ${melhor.informacao.toFixed(3)}`);
    console.log(`   Score ajustado: ${melhor.scoreAjustado.toFixed(3)}`);
    console.log(`   Origem: ${melhor.origem}\n`);
  } else {
    console.log(`\n⚠️ [Seleção] Nenhuma pergunta candidata disponível\n`);
  }
  
  return melhor;
}

/**
 * Calcula Standard Error of Measurement (SEM)
 */
export function calcularSEM(
  respostas: Array<{
    configuracaoIRT: ConfiguracaoIRT;
  }>,
  theta: number
): number {
  let informacaoTotal = 0;
  
  for (const resposta of respostas) {
    informacaoTotal += calcularInformacao(theta, resposta.configuracaoIRT);
  }
  
  // SEM = 1 / sqrt(I(θ))
  if (informacaoTotal <= 0) {
    return 999; // Erro infinito
  }
  
  return 1 / Math.sqrt(informacaoTotal);
}

/**
 * Verifica critérios de parada do CAT
 */
export function verificarCriteriosParada(
  respostas: any[],
  theta: number,
  sem: number
): {
  deveparar: boolean;
  motivo?: string;
} {
  const numRespostas = respostas.length;
  
  // Mínimo absoluto de perguntas
  if (numRespostas < 5) {
    return { deveparar: false };
  }
  
  // Máximo absoluto (burden cognitivo)
  if (numRespostas >= 20) {
    return {
      deveparar: true,
      motivo: 'Número máximo de perguntas atingido (20)'
    };
  }
  
  // Precisão atingida (SEM < 0.30)
  if (sem < 0.30 && numRespostas >= 5) {
    return {
      deveparar: true,
      motivo: `Precisão atingida (SEM = ${sem.toFixed(3)} < 0.30)`
    };
  }
  
  return { deveparar: false };
}
