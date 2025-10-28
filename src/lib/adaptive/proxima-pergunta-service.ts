/**
 * Serviço de Próxima Pergunta Adaptativa
 * 
 * Orquestra rules engine + validação + IRT para selecionar dinamicamente
 * a próxima pergunta baseada no histórico de respostas do usuário.
 * 
 * ATUALIZADO: Integrado com sistema CAT avançado (Fisher Information)
 */

import { PrismaClient } from '@prisma/client';
import {
  createAdaptiveEngine,
  loadRulesFromDatabase,
  runEngine,
  prepararFacts,
  type AdaptiveFacts,
  type RuleEvent,
  type AdaptiveAction
} from './engine';
import { validarRespostaPorTipo } from '@/lib/validations/resposta-schemas';
import {
  selecionarPerguntaAvancada,
  calcularSEM,
  verificarCriteriosParada
} from './selecao-avancada-service';
import {
  analisarRespostasClinicas,
  type Alerta,
  type PadraoDetectado
} from './regras-clinicas-avancadas';

const prisma = new PrismaClient();

// ==============================================
// TIPOS E INTERFACES
// ==============================================

export interface ConfiguracaoIRT {
  discriminacao: number; // a (0.5-2.5)
  dificuldade: number;    // b (-3 a +3)
  acerto: number;         // c (0-0.3)
}

export interface SelecaoPergunta {
  perguntaId: string;
  razao: string;
  score: number;
  informacao: number; // Informação de Fisher (IRT)
}

export interface ProximaPerguntaResult {
  pergunta?: any | null;
  thetaAtualizado: number;
  erroEstimacao: number;
  confianca: number;
  eventos: RuleEvent[];
  sem?: number; // Standard Error of Measurement
  informacaoFisher?: number; // Informação da pergunta selecionada
  origemPergunta?: 'questionario' | 'banco'; // De onde veio a pergunta
  finalizar?: boolean; // Se deve finalizar a sessão
  motivo?: string; // Motivo da finalização
  alerta?: Alerta; // Alerta clínico gerado
  padroes?: PadraoDetectado[]; // Padrões clínicos detectados
}

export interface FiltrosCategoria {
  categoria?: string;
  dominio?: string;
  dificuldadeMinima?: number;
  dificuldadeMaxima?: number;
  prioridade?: string;
}

// ==============================================
// CONSTANTES
// ==============================================

const THETA_INICIAL = 0;
const ERRO_INICIAL = 1;
const LIMITE_INFORMACAO = 0.05; // REDUZIDO: Mínimo de informação de Fisher (era 0.3)
const MAX_PERGUNTAS_CATEGORIA = 5;
const TEMPO_RESPOSTA_NORMAL = { min: 2, max: 180 }; // segundos

// ==============================================
// FUNÇÕES IRT (ITEM RESPONSE THEORY)
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
  const probabilidade = acerto + (1 - acerto) / (1 + Math.exp(-expoente));
  return Math.max(0, Math.min(1, probabilidade));
}

/**
 * Calcula informação de Fisher para uma pergunta
 */
function calcularInformacao(
  theta: number,
  config: ConfiguracaoIRT
): number {
  const p = probabilidadeAcerto(theta, config);
  const q = 1 - p;
  const { discriminacao, acerto } = config;
  
  if (p === 0 || q === 0) return 0;
  
  const numerador = Math.pow(discriminacao, 2) * Math.pow(p - acerto, 2);
  const denominador = p * q * Math.pow(1 - acerto, 2);
  
  return numerador / denominador;
}

/**
 * Atualiza theta usando método de máxima verossimilhança (MLE)
 */
function atualizarTheta(
  thetaAtual: number,
  respostas: Array<{
    valorNormalizado: number;
    configuracaoIRT: ConfiguracaoIRT;
  }>
): { theta: number; erro: number } {
  if (respostas.length === 0) {
    return { theta: THETA_INICIAL, erro: ERRO_INICIAL };
  }
  
  let theta = thetaAtual;
  const maxIteracoes = 20;
  const tolerancia = 0.001;
  const maxPasso = 0.5; // Limite de passo por iteração para evitar saltos extremos
  
  // Método de Newton-Raphson
  for (let iter = 0; iter < maxIteracoes; iter++) {
    let primeiraDerivada = 0;
    let segundaDerivada = 0;
    
    for (const resposta of respostas) {
      const p = probabilidadeAcerto(theta, resposta.configuracaoIRT);
      const q = 1 - p;
      const { discriminacao, acerto } = resposta.configuracaoIRT;
      // Clampar resposta observada para evitar valores extremos que causem instabilidade
      const u = Math.max(0.001, Math.min(0.999, resposta.valorNormalizado)); // 0..1
      
      // Primeira derivada da log-verossimilhança
      const termo1 = discriminacao * (p - acerto) / (p * (1 - acerto));
      primeiraDerivada += (u - p) * termo1;
      
      // Segunda derivada
      const termo2 = Math.pow(discriminacao, 2) * Math.pow(p - acerto, 2);
      const termo3 = p * q * Math.pow(1 - acerto, 2);
      // Evitar divisão por números muito pequenos
      if (termo3 > 1e-9) {
        segundaDerivada -= termo2 / termo3;
      }
    }
    
    // Atualização de theta
    let delta = 0;
    if (Math.abs(segundaDerivada) > 1e-9) {
      delta = primeiraDerivada / Math.abs(segundaDerivada);
    }
    // Limitar passo por iteração
    delta = Math.max(-maxPasso, Math.min(maxPasso, delta));
    theta = theta + delta;
    
    // Limitar theta ao intervalo razoável
    theta = Math.max(-3, Math.min(3, theta));
    
    // Verificar convergência
    if (Math.abs(delta) < tolerancia) {
      break;
    }
  }
  
  // Calcular erro padrão (inverso da raiz da informação total)
  let informacaoTotal = 0;
  for (const resposta of respostas) {
    informacaoTotal += calcularInformacao(theta, resposta.configuracaoIRT);
  }
  
  const erro = informacaoTotal > 0 ? 1 / Math.sqrt(informacaoTotal) : ERRO_INICIAL;
  
  return { theta, erro };
}

/**
 * Calcula confiança na estimativa (0-1)
 */
function calcularConfianca(erro: number): number {
  // Erro baixo = alta confiança
  // Erro alto = baixa confiança
  const confianca = Math.exp(-erro);
  return Math.max(0, Math.min(1, confianca));
}

// ==============================================
// SELEÇÃO DE PERGUNTAS
// ==============================================

/**
 * Filtra perguntas candidatas
 */
async function filtrarPerguntasCandidatas(
  questionarioId: string,
  perguntasRespondidas: string[],
  filtros?: FiltrosCategoria
): Promise<any[]> {
  const where: any = {
    questionarioId,
    ativo: true,
    NOT: {
      id: { in: perguntasRespondidas }
    }
  };
  
  if (filtros?.categoria) {
    where.categoria = filtros.categoria;
  }
  
  if (filtros?.dominio) {
    where.dominio = filtros.dominio;
  }
  
  if (filtros?.prioridade) {
    where.prioridade = filtros.prioridade;
  }
  
  const perguntas = await prisma.perguntaSocioemocional.findMany({
    where
  });
  
  // Filtrar por dificuldade IRT
  return perguntas.filter((p: any) => {
    if (!filtros?.dificuldadeMinima && !filtros?.dificuldadeMaxima) {
      return true;
    }
    
    const dificuldade = p.configuracaoIRT?.dificuldade ?? 0;
    
    if (filtros.dificuldadeMinima && dificuldade < filtros.dificuldadeMinima) {
      return false;
    }
    
    if (filtros.dificuldadeMaxima && dificuldade > filtros.dificuldadeMaxima) {
      return false;
    }
    
    return true;
  });
}

/**
 * Verifica dependências de uma pergunta
 * Por enquanto sempre retorna true, pois não temos modelo de dependências
 */
async function verificarDependencias(
  perguntaId: string,
  respostasIds: string[]
): Promise<boolean> {
  // TODO: Implementar quando modelo DependenciaPergunta for criado
  // const dependencias = await prisma.dependenciaPergunta.findMany({
  //   where: { perguntaOrigemId: perguntaId }
  // });
  
  return true; // Por enquanto, todas as perguntas podem ser apresentadas
}

/**
 * Calcula score de informação para cada pergunta candidata
 */
async function calcularScoresPerguntas(
  perguntas: any[],
  theta: number,
  respostasIds: string[]
): Promise<SelecaoPergunta[]> {
  const scores: SelecaoPergunta[] = [];
  
  console.log(`[calcularScoresPerguntas] Processando ${perguntas.length} candidatas, theta=${theta.toFixed(3)}`);
  
  for (const pergunta of perguntas) {
    // Verificar dependências
    const dependenciasOk = await verificarDependencias(pergunta.id, respostasIds);
    if (!dependenciasOk) continue;
    
    // Calcular informação de Fisher
    const config: ConfiguracaoIRT = {
      discriminacao: pergunta.configuracaoIRT?.discriminacao ?? pergunta.discriminacao ?? 1,
      dificuldade: pergunta.configuracaoIRT?.dificuldade ?? pergunta.dificuldade ?? 0,
      acerto: pergunta.configuracaoIRT?.acerto ?? 0.2
    };
    
    const informacao = calcularInformacao(theta, config);
    
    console.log(`[calcularScoresPerguntas] Pergunta ${pergunta.id}: informacao=${informacao.toFixed(3)}, limite=${LIMITE_INFORMACAO}`);
    
    // Pular perguntas com informação muito baixa
    if (informacao < LIMITE_INFORMACAO) {
      console.log(`[calcularScoresPerguntas] ❌ Rejeitada (info < ${LIMITE_INFORMACAO})`);
      continue;
    }
    
    console.log(`[calcularScoresPerguntas] ✅ Aceita`);
    
    // Calcular score final (informação + prioridade)
    let score = informacao;
    
    if (pergunta.prioridade === 'ALTA') {
      score *= 1.5;
    } else if (pergunta.prioridade === 'BAIXA') {
      score *= 0.7;
    }
    
    scores.push({
      perguntaId: pergunta.id,
      razao: `Informação: ${informacao.toFixed(3)}, Prioridade: ${pergunta.prioridade}`,
      score,
      informacao
    });
  }
  
  console.log(`[calcularScoresPerguntas] ${scores.length} perguntas aceitas de ${perguntas.length} candidatas`);
  
  // Ordenar por score (maior primeiro)
  return scores.sort((a, b) => b.score - a.score);
}

/**
 * Seleciona melhor pergunta baseada em múltiplos critérios
 */
async function selecionarMelhorPergunta(
  scores: SelecaoPergunta[],
  facts: AdaptiveFacts
): Promise<string | null> {
  console.log(`[selecionarMelhorPergunta] Recebeu ${scores.length} scores`);
  
  if (scores.length === 0) {
    console.log(`[selecionarMelhorPergunta] ❌ Nenhum score disponível, retornando null`);
    return null;
  }
  
  // Balancear categorias (não fazer muitas perguntas da mesma categoria)
  const contadorCategorias = new Map<string, number>();
  
  for (const resposta of facts.respostas) {
    const categoria = resposta.categoria;
    contadorCategorias.set(categoria, (contadorCategorias.get(categoria) || 0) + 1);
  }
  
  // Filtrar perguntas de categorias que já atingiram limite
  const scoresBalanceados = scores.filter((s) => {
    // TODO: Buscar categoria da pergunta
    // const categoria = await obterCategoriaPergunta(s.perguntaId);
    // const count = contadorCategorias.get(categoria) || 0;
    // return count < MAX_PERGUNTAS_CATEGORIA;
    return true; // Por enquanto aceitar todas
  });
  
  const perguntaSelecionada = scoresBalanceados.length > 0 ? scoresBalanceados[0].perguntaId : scores[0].perguntaId;
  console.log(`[selecionarMelhorPergunta] ✅ Selecionada: ${perguntaSelecionada} (score: ${scores[0].score.toFixed(3)})`);
  
  // Retornar a melhor pergunta
  return perguntaSelecionada;
}

// ==============================================
// PROCESSAMENTO DE AÇÕES
// ==============================================

/**
 * Processa ações geradas pelo rules engine
 */
async function processarAcoes(
  acoes: AdaptiveAction[],
  sessaoId: string
): Promise<{
  perguntaSugerida: string | null;
  alertasGerados: string[];
  sugestoes: string[];
}> {
  console.log(`[processarAcoes] Processando ${acoes.length} ações para sessão ${sessaoId}`);
  
  let perguntaSugerida: string | null = null;
  const alertasGerados: string[] = [];
  const sugestoes: string[] = [];
  
  for (const acao of acoes) {
    console.log(`[processarAcoes] Ação: ${acao.type}`, acao.params);
    
    switch (acao.type) {
      case 'BUSCAR_BANCO':
        // Buscar pergunta específica do banco
        if (acao.params.perguntaId) {
          perguntaSugerida = acao.params.perguntaId;
        }
        break;
      
      case 'CRIAR_ALERTA':
        // Criar alerta no banco
        // First get session data to extract required fields
        const sessaoData = await prisma.sessaoAdaptativa.findUnique({
          where: { id: sessaoId },
          select: { usuarioId: true, questionarioId: true }
        });
        
        if (!sessaoData) {
          throw new Error(`Sessão ${sessaoId} não encontrada para criar alerta`);
        }
        
        const alerta = await prisma.alertaSocioemocional.create({
          data: {
            sessaoId,
            usuarioId: sessaoData.usuarioId,
            questionarioId: sessaoData.questionarioId,
            categoria: acao.params.categoria || 'BEM_ESTAR',
            nivel: acao.params.nivel || 'AMARELO',
            tipo: acao.params.tipo || 'OUTROS',
            titulo: acao.params.titulo || 'Alerta',
            descricao: acao.params.descricao || '',
            dadosContexto: acao.params.dadosContexto || {}
          }
        });
        alertasGerados.push(alerta.id);
        break;
      
      case 'GERAR_ALERTA':
        // Suporte ao alias GERAR_ALERTA vindo das regras
        {
          const sessaoData2 = await prisma.sessaoAdaptativa.findUnique({
            where: { id: sessaoId },
            select: { usuarioId: true, questionarioId: true }
          });
          if (!sessaoData2) {
            throw new Error(`Sessão ${sessaoId} não encontrada para criar alerta`);
          }
          const alerta2 = await prisma.alertaSocioemocional.create({
            data: {
              sessaoId,
              usuarioId: sessaoData2.usuarioId,
              questionarioId: sessaoData2.questionarioId,
              categoria: acao.params.categoria || 'BEM_ESTAR',
              nivel: acao.params.nivel || 'AMARELO',
              tipo: acao.params.tipo || 'OUTROS',
              titulo: acao.params.titulo || 'Alerta',
              descricao: acao.params.descricao || acao.params.mensagem || '',
              dadosContexto: acao.params.dadosContexto || {}
            }
          });
          alertasGerados.push(alerta2.id);
        }
        break;
      
      case 'ALTERAR_FLUXO':
        // Alterar fluxo do questionário
        console.log('Alterando fluxo:', acao.params);
        // TODO: Implementar lógica de alteração de fluxo
        break;
      
      case 'FINALIZAR_QUESTIONARIO':
        // Marcar para finalização
        await prisma.sessaoAdaptativa.update({
          where: { id: sessaoId },
          data: {
            finalizadoEm: new Date(),
            status: 'FINALIZADA'
          }
        });
        break;
      
      case 'RECOMENDAR_RECURSO':
        // Adicionar recomendação
        sugestoes.push(acao.params.mensagem || 'Recurso recomendado');
        break;
      
      case 'SUGERIR_QUESTIONARIO':
        // Registrar sugestão de questionário
        sugestoes.push(
          acao.params.motivo
            ? `Sugerir questionário ${acao.params.questionarioId}: ${acao.params.motivo}`
            : `Sugerir questionário ${acao.params.questionarioId}`
        );
        break;
      
      case 'INSERIR_PERGUNTA':
        // Inserir pergunta específica no fluxo
        if (acao.params.perguntaId) {
          perguntaSugerida = acao.params.perguntaId;
        }
        break;
      
      case 'PULAR_SECAO':
        // Pular seção do questionário
        console.log('Pulando seção:', acao.params.secao);
        break;
      
      case 'NOTIFICAR_PROFISSIONAL':
        // Criar notificação para profissional
        console.log('Notificar profissional:', acao.params);
        // TODO: Implementar sistema de notificações
        break;
    }
  }
  
  return { perguntaSugerida, alertasGerados, sugestoes };
}

// ==============================================
// FUNÇÃO PRINCIPAL
// ==============================================

/**
 * Determina próxima pergunta adaptativa
 */
export async function determinarProximaPergunta(
  sessaoId: string,
  filtros?: FiltrosCategoria
): Promise<ProximaPerguntaResult> {
  // 1. Carregar dados da sessão
  const sessao = await prisma.sessaoAdaptativa.findUnique({
    where: { id: sessaoId },
    include: {
      respostas: {
        include: {
          pergunta: true,
          perguntaBanco: true, // Incluir também perguntas do banco
        }
      },
      questionario: true
    }
  });
  
  if (!sessao) {
    throw new Error(`Sessão ${sessaoId} não encontrada`);
  }
  // Conjunto de perguntas já vistas (respondidas ou apresentadas)
  const perguntasJaVistas = new Set<string>([
    ...sessao.perguntasApresentadas,
    ...sessao.respostas
      .map((r: any) => [r.perguntaId, r.perguntaBancoId])
      .flat()
      .filter((id): id is string => id !== null && id !== undefined),
  ]);
  
  // 2. Preparar facts para rules engine
  const facts = await prepararFacts(sessaoId);
  
  // 3. Executar rules engine
  const engine = createAdaptiveEngine();
  await loadRulesFromDatabase(engine, sessao.questionarioId);
  const events = await runEngine(engine, facts);
  
  // 4. Processar ações geradas
  const acoes = events.map(e => e.params.acoes).flat() as AdaptiveAction[];
  const { perguntaSugerida, alertasGerados, sugestoes } = await processarAcoes(
    acoes,
    sessaoId
  );
  
  // 5. Atualizar theta IRT
  // IMPORTANTE: Suportar respostas tanto do questionário quanto do banco
  const respostasIRT = sessao.respostas
    .filter((r: any) => {
      // Deve ter valor normalizado
      if (r.valorNormalizado === null) return false;
      
      // Deve ter parâmetros IRT (pergunta do questionário OU do banco)
      const temPerguntaQuestionario = r.pergunta?.discriminacao !== undefined;
      const temPerguntaBanco = r.perguntaBanco?.parametroA !== undefined;
      
      return temPerguntaQuestionario || temPerguntaBanco;
    })
    .map((r: any) => {
      // Usar parâmetros da pergunta do questionário ou do banco
      const discriminacao = r.pergunta?.discriminacao ?? r.perguntaBanco?.parametroA ?? 1.0;
      const dificuldade = r.pergunta?.dificuldade ?? r.perguntaBanco?.parametroB ?? 0.0;
      
      return {
        valorNormalizado: r.valorNormalizado!,
        configuracaoIRT: {
          discriminacao,
          dificuldade,
          // Usar 2PL temporariamente para itens não-binários (acerto=0)
          acerto: 0.0
        }
      };
    });
  
  console.log('[determinarProximaPergunta] Respostas IRT processadas:', {
    total: sessao.respostas.length,
    comIRT: respostasIRT.length,
    detalhes: respostasIRT.map(r => ({
      valorNormalizado: r.valorNormalizado,
      discriminacao: r.configuracaoIRT.discriminacao,
      dificuldade: r.configuracaoIRT.dificuldade
    }))
  });
  
  const { theta, erro } = atualizarTheta(
    sessao.thetaEstimado || THETA_INICIAL,
    respostasIRT
  );
  
  console.log('[determinarProximaPergunta] Theta atualizado:', {
    thetaAnterior: sessao.thetaEstimado,
    thetaNovo: theta,
    erro
  });
  
  const confianca = calcularConfianca(erro);
  
  // Salvar theta atualizado
  await prisma.sessaoAdaptativa.update({
    where: { id: sessaoId },
    data: {
      thetaEstimado: theta,
      erroEstimacao: erro
    }
  });
  
  // 6. Se rules engine sugeriu pergunta específica, usar ela (desde que não repetida)
  if (perguntaSugerida && !perguntasJaVistas.has(perguntaSugerida)) {
    const pergunta = await prisma.perguntaSocioemocional.findUnique({
      where: { id: perguntaSugerida }
    });
    
    if (pergunta) {
      return {
        pergunta,
        eventos: events,
        thetaAtualizado: theta,
        erroEstimacao: erro,
        confianca
      };
    }
  }
  if (perguntaSugerida && perguntasJaVistas.has(perguntaSugerida)) {
    console.log('[determinarProximaPergunta] Pergunta sugerida já vista. Ignorando sugestão:', perguntaSugerida);
  }
  
  // 7. Calcular SEM (Standard Error of Measurement)
  const sem = calcularSEM(respostasIRT, theta);
  
  console.log(`[determinarProximaPergunta] 📊 SEM atual: ${sem.toFixed(3)}, Confiança: ${(1 / (1 + sem)).toFixed(3)}`);
  
  // 8. Verificar critérios de parada do CAT
  const { deveparar, motivo } = verificarCriteriosParada(
    sessao.respostas,
    theta,
    sem
  );
  
  if (deveparar) {
    console.log(`[determinarProximaPergunta] 🛑 Encerrando CAT: ${motivo}`);
    
    await prisma.sessaoAdaptativa.update({
      where: { id: sessaoId },
      data: { finalizadoEm: new Date() }
    });
    
    return {
      pergunta: null,
      eventos: events,
      thetaAtualizado: theta,
      erroEstimacao: erro,
      confianca: 1 / (1 + sem),
      sem,
      finalizar: true,
      motivo
    };
  }
  
  // 9. Preparar exclusões (perguntas já vistas)
  // IMPORTANTE: incluir tanto perguntaId quanto perguntaBancoId para evitar duplicatas
  const perguntasRespondidas = sessao.respostas
    .map((r: any) => [r.perguntaId, r.perguntaBancoId])
    .flat()
    .filter((id): id is string => id !== null && id !== undefined);
  
  const perguntasExcluir = Array.from(new Set([
    ...perguntasRespondidas,
    ...sessao.perguntasApresentadas
  ]));
  
  console.log('[determinarProximaPergunta] Debug perguntas:', {
    respostasTotal: sessao.respostas.length,
    perguntasRespondidas: perguntasRespondidas.length,
    perguntasApresentadas: sessao.perguntasApresentadas.length,
    perguntasExcluir: perguntasExcluir.length,
    questionarioId: sessao.questionarioId
  });
  
  // 10. SELEÇÃO AVANÇADA com Fisher Information
  const categoriasRelevantes = determinarCategoriasRelevantes(sessao.respostas);
  const dominiosRelevantes = determinarDominiosRelevantes(theta);
  
  console.log('[determinarProximaPergunta] 🎯 Filtros inteligentes:', {
    categorias: categoriasRelevantes,
    dominios: dominiosRelevantes
  });
  
  const perguntaSelecionada = await selecionarPerguntaAvancada(
    sessao.questionarioId,
    theta,
    respostasIRT,
    perguntasExcluir,
    {
      usarBanco: true, // ✅ REATIVADO: Agora com suporte a banco adaptativo no schema
      categoriasRelevantes,
      dominiosRelevantes
    }
  );
  
  if (!perguntaSelecionada) {
    console.log('[determinarProximaPergunta] ⚠️ Sem perguntas candidatas disponíveis');
    
    await prisma.sessaoAdaptativa.update({
      where: { id: sessaoId },
      data: { finalizadoEm: new Date() }
    });
    
    return {
      pergunta: null,
      eventos: events,
      thetaAtualizado: theta,
      erroEstimacao: erro,
      confianca: 1 / (1 + sem),
      sem,
      finalizar: true,
      motivo: 'Sem perguntas candidatas disponíveis'
    };
  }
  
  // 11. Carregar pergunta completa do DB
  const pergunta = perguntaSelecionada.origem === 'banco'
    ? await prisma.bancoPerguntasAdaptativo.findUnique({
        where: { id: perguntaSelecionada.id }
      })
    : await prisma.perguntaSocioemocional.findUnique({
        where: { id: perguntaSelecionada.id }
      });
  
  if (!pergunta) {
    throw new Error(`Pergunta ${perguntaSelecionada.id} não encontrada`);
  }
  
  // 12. Atualizar perguntas apresentadas
  await prisma.sessaoAdaptativa.update({
    where: { id: sessaoId },
    data: {
      perguntasApresentadas: {
        push: perguntaSelecionada.id
      }
    }
  });
  
  console.log(`[determinarProximaPergunta] ✅ Pergunta selecionada: ${perguntaSelecionada.codigo || pergunta.id}`);
  console.log(`   Informação: ${perguntaSelecionada.informacao.toFixed(3)}, Origem: ${perguntaSelecionada.origem}`);
  
  // 13. Análise clínica (executar se temos respostas suficientes)
  let alerta: Alerta | undefined;
  let padroes: PadraoDetectado[] | undefined;
  
  if (sessao.respostas.length >= 5) {
    try {
      const analiseClinica = await analisarRespostasClinicas(
        sessaoId,
        sessao.usuarioId
      );
      
      alerta = analiseClinica.alerta;
      padroes = analiseClinica.padroes;
      
      console.log('\n🏥 [Análise Clínica]');
      console.log(`   Nível: ${alerta.nivel} (${alerta.urgencia})`);
      console.log(`   Padrões: ${padroes.length}`);
      
      if (padroes.length > 0) {
        console.log('   Detectados:');
        padroes.forEach(p => {
          console.log(`   - ${p.nome} (${(p.confianca * 100).toFixed(0)}%)`);
        });
      }
      
      if (alerta.acoes.length > 0) {
        console.log(`   Ações: ${alerta.acoes.join(', ')}`);
      }
    } catch (error) {
      console.error('[determinarProximaPergunta] ⚠️ Erro na análise clínica:', error);
      // Não interromper fluxo se análise falhar
    }
  }
  
  return {
    pergunta,
    eventos: events,
    thetaAtualizado: theta,
    erroEstimacao: erro,
    confianca: 1 / (1 + sem),
    sem,
    informacaoFisher: perguntaSelecionada.informacao,
    origemPergunta: perguntaSelecionada.origem,
    alerta,
    padroes
  };
}

/**
 * Valida resposta e prepara para salvar
 */
export async function validarEProcessarResposta(
  sessaoId: string,
  perguntaId: string,
  valor: any,
  tempoResposta: number
): Promise<{
  valorNormalizado: number;
  validacao: { valido: boolean; erros: string[] };
  anomalias: string[];
}> {
  // Buscar pergunta
  const pergunta = await prisma.perguntaSocioemocional.findUnique({
    where: { id: perguntaId }
  });
  
  if (!pergunta) {
    throw new Error(`Pergunta ${perguntaId} não encontrada`);
  }
  
  // Validar resposta
  const resultadoValidacao = validarRespostaPorTipo(
    pergunta.tipoPergunta,
    valor,
    tempoResposta,
    perguntaId
  );
  
  const validacao = {
    valido: resultadoValidacao,
    erros: resultadoValidacao ? [] : ['Resposta inválida para o tipo de pergunta']
  };
  
  // Normalizar valor (0-1)
  let valorNormalizado = 0.5;
  
  switch (pergunta.tipoPergunta) {
    case 'LIKERT_5':
      valorNormalizado = (valor - 1) / 4;
      break;
    case 'LIKERT_7':
      valorNormalizado = (valor - 1) / 6;
      break;
    case 'LIKERT_10':
      valorNormalizado = valor / 10;
      break;
    case 'ESCALA_VISUAL':
      valorNormalizado = valor / 100;
      break;
    case 'SIM_NAO':
      valorNormalizado = valor ? 1 : 0;
      break;
    // Outros tipos...
    default:
      valorNormalizado = 0.5;
  }
  
  // Detectar anomalias
  const anomalias: string[] = [];
  
  if (tempoResposta < TEMPO_RESPOSTA_NORMAL.min) {
    anomalias.push('RESPOSTA_MUITO_RAPIDA');
  }
  
  if (tempoResposta > TEMPO_RESPOSTA_NORMAL.max) {
    anomalias.push('RESPOSTA_MUITO_LENTA');
  }
  
  return {
    valorNormalizado,
    validacao,
    anomalias
  };
}

// ==============================================
// FUNÇÕES AUXILIARES PARA CAT AVANÇADO
// ==============================================

/**
 * Determina categorias relevantes baseado em respostas anteriores
 */
function determinarCategoriasRelevantes(respostas: any[]): string[] {
  const categorias = new Set<string>();
  
  for (const r of respostas) {
    const valorNorm = r.valorNormalizado || 0;
    
    // Se detectar ansiedade alta, priorizar categoria
    if (r.categoria === 'ANSIEDADE' && valorNorm > 0.6) {
      categorias.add('ANSIEDADE');
      categorias.add('ESTRESSE'); // Co-ocorrência comum
    }
    
    // Se detectar pensamentos negativos/depressão, priorizar
    if (r.categoria === 'PENSAMENTOS_NEGATIVOS' && valorNorm > 0.6) {
      categorias.add('PENSAMENTOS_NEGATIVOS');
      categorias.add('BEM_ESTAR');
    }
    
    // Se detectar problemas de sono, investigar mais
    if (r.categoria === 'SONO' && valorNorm > 0.5) {
      categorias.add('SONO');
      categorias.add('ESTRESSE'); // Relação comum
    }
    
    // Se bem-estar baixo, investigar depressão
    if (r.categoria === 'BEM_ESTAR' && valorNorm < 0.4) {
      categorias.add('PENSAMENTOS_NEGATIVOS');
      categorias.add('SONO');
    }
  }
  
  // Se nenhuma categoria específica, permitir todas (filtro vazio)
  return categorias.size > 0 ? Array.from(categorias) : [];
}

/**
 * Determina domínios relevantes baseado em theta atual
 */
function determinarDominiosRelevantes(theta: number): string[] {
  const dominios: string[] = [];
  
  // Theta muito negativo → estados de baixa energia/valencia negativa
  if (theta < -0.5) {
    dominios.push('DEPRIMIDO', 'ENTEDIADO', 'LETARGICO', 'TRISTE');
  }
  
  // Theta muito positivo → estados de alta energia/valencia negativa (ansiedade)
  if (theta > 0.5) {
    dominios.push('NERVOSO', 'ANSIOSO', 'TENSO');
  }
  
  // Theta neutro → explorar estados equilibrados
  if (theta >= -0.5 && theta <= 0.5) {
    dominios.push('CALMO', 'RELAXADO', 'ANIMADO', 'FELIZ');
  }
  
  // Se theta extremo (muito alto), investigar também estados positivos de contraste
  if (theta > 1.0) {
    dominios.push('FELIZ', 'ANIMADO'); // Para contrastar
  }
  
  if (theta < -1.0) {
    dominios.push('CALMO', 'RELAXADO'); // Para contrastar
  }
  
  return dominios;
}

// ==============================================
// EXPORT
// ==============================================

export {
  probabilidadeAcerto,
  calcularInformacao,
  atualizarTheta,
  calcularConfianca,
  filtrarPerguntasCandidatas,
  verificarDependencias,
  calcularScoresPerguntas,
  selecionarMelhorPergunta,
  determinarCategoriasRelevantes,
  determinarDominiosRelevantes
};
