/**
 * @file interpretacao-clinica.ts
 * @description Funções de interpretação clínica baseadas em escalas validadas (PHQ-9, GAD-7, WHO-5)
 * @author ClassCheck v3.0
 * @date 2025-11-02
 */

import { prisma } from '@/lib/prisma';
import { CategoriaPergunta } from '@prisma/client';

/**
 * Níveis de severidade clínica
 */
export enum NivelSeveridade {
  MINIMO = 'MINIMO',
  LEVE = 'LEVE',
  MODERADO = 'MODERADO',
  MODERADAMENTE_GRAVE = 'MODERADAMENTE_GRAVE',
  GRAVE = 'GRAVE',
}

/**
 * Interface para interpretação clínica
 */
export interface InterpretacaoClinica {
  escala: string;
  score: number;
  nivelSeveridade: NivelSeveridade;
  descricao: string;
  recomendacoes: string[];
  necessitaAlerta: boolean;
  cor: string; // Para visualização
}

/**
 * Interpreta score do PHQ-9 (Patient Health Questionnaire - Depressão)
 * Referência: Kroenke et al., 2001
 * 
 * @param score Score total (0-27)
 * @returns Interpretação clínica
 */
export function interpretarPHQ9(score: number): InterpretacaoClinica {
  let nivelSeveridade: NivelSeveridade;
  let descricao: string;
  let recomendacoes: string[];
  let necessitaAlerta: boolean;
  let cor: string;

  if (score >= 0 && score <= 4) {
    nivelSeveridade = NivelSeveridade.MINIMO;
    descricao = 'Sintomas depressivos mínimos ou ausentes';
    recomendacoes = [
      'Manter hábitos saudáveis de vida',
      'Continuar atividades de autocuidado',
    ];
    necessitaAlerta = false;
    cor = '#22c55e'; // verde
  } else if (score <= 9) {
    nivelSeveridade = NivelSeveridade.LEVE;
    descricao = 'Sintomas depressivos leves';
    recomendacoes = [
      'Monitorar sintomas regularmente',
      'Praticar técnicas de relaxamento',
      'Manter rotina de exercícios físicos',
    ];
    necessitaAlerta = false;
    cor = '#84cc16'; // verde-claro
  } else if (score <= 14) {
    nivelSeveridade = NivelSeveridade.MODERADO;
    descricao = 'Sintomas depressivos moderados';
    recomendacoes = [
      'Considerar avaliação com profissional de saúde mental',
      'Implementar estratégias de enfrentamento',
      'Buscar apoio social',
    ];
    necessitaAlerta = true;
    cor = '#eab308'; // amarelo
  } else if (score <= 19) {
    nivelSeveridade = NivelSeveridade.MODERADAMENTE_GRAVE;
    descricao = 'Sintomas depressivos moderadamente graves';
    recomendacoes = [
      'Consulta com profissional de saúde mental recomendada',
      'Considerar intervenção terapêutica',
      'Rede de apoio familiar e social',
    ];
    necessitaAlerta = true;
    cor = '#f59e0b'; // laranja
  } else {
    nivelSeveridade = NivelSeveridade.GRAVE;
    descricao = 'Sintomas depressivos graves';
    recomendacoes = [
      'URGENTE: Avaliação profissional imediata necessária',
      'Possível necessidade de tratamento farmacológico',
      'Acompanhamento psicológico intensivo',
    ];
    necessitaAlerta = true;
    cor = '#ef4444'; // vermelho
  }

  return {
    escala: 'PHQ-9',
    score,
    nivelSeveridade,
    descricao,
    recomendacoes,
    necessitaAlerta,
    cor,
  };
}

/**
 * Interpreta score do GAD-7 (Generalized Anxiety Disorder - Ansiedade)
 * Referência: Spitzer et al., 2006
 * 
 * @param score Score total (0-21)
 * @returns Interpretação clínica
 */
export function interpretarGAD7(score: number): InterpretacaoClinica {
  let nivelSeveridade: NivelSeveridade;
  let descricao: string;
  let recomendacoes: string[];
  let necessitaAlerta: boolean;
  let cor: string;

  if (score >= 0 && score <= 4) {
    nivelSeveridade = NivelSeveridade.MINIMO;
    descricao = 'Ansiedade mínima';
    recomendacoes = [
      'Manter práticas de mindfulness',
      'Continuar atividades relaxantes',
    ];
    necessitaAlerta = false;
    cor = '#22c55e';
  } else if (score <= 9) {
    nivelSeveridade = NivelSeveridade.LEVE;
    descricao = 'Ansiedade leve';
    recomendacoes = [
      'Técnicas de respiração e relaxamento',
      'Exercícios físicos regulares',
      'Gestão de estresse',
    ];
    necessitaAlerta = false;
    cor = '#84cc16';
  } else if (score <= 14) {
    nivelSeveridade = NivelSeveridade.MODERADO;
    descricao = 'Ansiedade moderada';
    recomendacoes = [
      'Avaliação com profissional recomendada',
      'Técnicas de enfrentamento de ansiedade',
      'Considerar terapia cognitivo-comportamental',
    ];
    necessitaAlerta = true;
    cor = '#eab308';
  } else {
    nivelSeveridade = NivelSeveridade.GRAVE;
    descricao = 'Ansiedade grave';
    recomendacoes = [
      'Avaliação profissional urgente',
      'Intervenção terapêutica necessária',
      'Possível necessidade de tratamento medicamentoso',
    ];
    necessitaAlerta = true;
    cor = '#ef4444';
  }

  return {
    escala: 'GAD-7',
    score,
    nivelSeveridade,
    descricao,
    recomendacoes,
    necessitaAlerta,
    cor,
  };
}

/**
 * Interpreta score do WHO-5 (Well-Being Index - Bem-estar)
 * Referência: WHO, 1998
 * 
 * @param score Score total (0-25, convertido para 0-100)
 * @returns Interpretação clínica
 */
export function interpretarWHO5(score: number): InterpretacaoClinica {
  // WHO-5 usa escala de 0-100
  const scorePercentual = (score / 25) * 100;
  
  let nivelSeveridade: NivelSeveridade;
  let descricao: string;
  let recomendacoes: string[];
  let necessitaAlerta: boolean;
  let cor: string;

  if (scorePercentual < 28) {
    nivelSeveridade = NivelSeveridade.GRAVE;
    descricao = 'Bem-estar muito baixo - possível depressão';
    recomendacoes = [
      'Avaliação profissional urgente recomendada',
      'Screening para depressão necessário',
      'Suporte emocional imediato',
    ];
    necessitaAlerta = true;
    cor = '#ef4444';
  } else if (scorePercentual < 50) {
    nivelSeveridade = NivelSeveridade.MODERADO;
    descricao = 'Bem-estar reduzido';
    recomendacoes = [
      'Atenção aos sinais de mal-estar',
      'Reforçar atividades prazerosas',
      'Considerar avaliação profissional',
    ];
    necessitaAlerta = true;
    cor = '#eab308';
  } else if (scorePercentual < 75) {
    nivelSeveridade = NivelSeveridade.LEVE;
    descricao = 'Bem-estar moderado';
    recomendacoes = [
      'Manter práticas de autocuidado',
      'Cultivar relações sociais positivas',
      'Atividades físicas regulares',
    ];
    necessitaAlerta = false;
    cor = '#84cc16';
  } else {
    nivelSeveridade = NivelSeveridade.MINIMO;
    descricao = 'Bem-estar elevado';
    recomendacoes = [
      'Manter hábitos saudáveis atuais',
      'Compartilhar estratégias positivas',
    ];
    necessitaAlerta = false;
    cor = '#22c55e';
  }

  return {
    escala: 'WHO-5',
    score: scorePercentual,
    nivelSeveridade,
    descricao,
    recomendacoes,
    necessitaAlerta,
    cor,
  };
}

/**
 * Gera alerta socioemocional no banco de dados
 * @param usuarioId ID do usuário
 * @param interpretacao Interpretação clínica
 * @param sessaoId ID da sessão que gerou o alerta
 * @param questionarioId ID do questionário
 */
export async function gerarAlertaSocioemocional(
  usuarioId: number,
  interpretacao: InterpretacaoClinica,
  sessaoId: number,
  questionarioId: string
): Promise<void> {
  if (!interpretacao.necessitaAlerta) {
    return;
  }

  try {
    // Verificar se já existe alerta recente (últimas 24h)
    const alertaExistente = await prisma.alertaSocioemocional.findFirst({
      where: {
        usuarioId,
        criadoEm: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        status: 'PENDENTE',
      },
    });

    if (alertaExistente) {
      // Atualizar alerta existente
      await prisma.alertaSocioemocional.update({
        where: { id: alertaExistente.id },
        data: {
          mensagem: `${interpretacao.escala}: ${interpretacao.descricao}`,
        },
      });
    } else {
      // Criar novo alerta
      // Mapear NivelSeveridade para NivelAlerta e TipoAlerta
      const nivelAlerta = interpretacao.nivelSeveridade === 'GRAVE' ? 'VERMELHO'
        : interpretacao.nivelSeveridade === 'MODERADAMENTE_GRAVE' ? 'LARANJA'
        : interpretacao.nivelSeveridade === 'MODERADO' ? 'AMARELO'
        : 'VERDE';
      
      const tipoAlerta = interpretacao.nivelSeveridade === 'GRAVE' ? 'CRISE_IMEDIATA'
        : interpretacao.nivelSeveridade === 'MODERADAMENTE_GRAVE' ? 'RISCO_ALTO'
        : interpretacao.nivelSeveridade === 'MODERADO' ? 'RISCO_MODERADO'
        : 'RISCO_BAIXO';

      await prisma.alertaSocioemocional.create({
        data: {
          usuarioId,
          sessaoId: String(sessaoId),
          questionarioId,
          nivel: nivelAlerta,
          tipo: tipoAlerta,
          categoria: 'BEM_ESTAR', // Categoria padrão, pode ser ajustada
          titulo: `Alerta: ${interpretacao.escala}`,
          mensagem: `${interpretacao.escala}: ${interpretacao.descricao}`,
          descricao: interpretacao.recomendacoes.join('; '),
          dadosContexto: {
            escala: interpretacao.escala,
            score: interpretacao.score,
            nivelSeveridade: interpretacao.nivelSeveridade,
          },
          regrasAcionadas: ['INTERPRETACAO_AUTOMATICA'],
        },
      });
    }

    console.log(`[Alerta] Gerado para usuário ${usuarioId}: ${interpretacao.escala} - ${interpretacao.nivelSeveridade}`);
  } catch (error) {
    console.error('[gerarAlertaSocioemocional] Erro ao criar alerta:', error);
  }
}

/**
 * Interpreta categoria específica com base nos scores
 * @param categoria Categoria socioemocional
 * @param score Score acumulado
 * @returns Interpretação clínica
 */
export function interpretarCategoria(
  categoria: CategoriaPergunta,
  score: number
): InterpretacaoClinica {
  switch (categoria) {
    case 'DEPRESSAO':
      return interpretarPHQ9(score);
    
    case 'ANSIEDADE':
      return interpretarGAD7(score);
    
    case 'BEM_ESTAR':
    case 'SATISFACAO_VIDA':
      return interpretarWHO5(score);
    
    default:
      // Interpretação genérica para outras categorias
      return {
        escala: categoria,
        score,
        nivelSeveridade: score > 15 ? NivelSeveridade.MODERADO : NivelSeveridade.LEVE,
        descricao: `Score de ${score} em ${categoria}`,
        recomendacoes: ['Continuar monitoramento'],
        necessitaAlerta: score > 15,
        cor: score > 15 ? '#eab308' : '#22c55e',
      };
  }
}
