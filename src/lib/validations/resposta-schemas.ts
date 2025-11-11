/**
 * Schemas de Validação - Respostas
 * 
 * Schemas Zod para validação de respostas dos questionários adaptativos.
 * Validação específica por tipo de pergunta.
 */

import { z } from 'zod';

// ==============================================
// HELPERS
// ==============================================

// Validação flexível de perguntaId (UUID ou ID customizado)
const perguntaIdSchema = z.string().min(1);

// ==============================================
// SCHEMAS DE RESPOSTAS POR TIPO
// ==============================================

// Resposta Likert 5 (1-5)
export const RespostaLikert5Schema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.number().int().min(1).max(5),
  tempoResposta: z.number().int().positive() // segundos
});

// Resposta Likert 7 (1-7)
export const RespostaLikert7Schema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.number().int().min(1).max(7),
  tempoResposta: z.number().int().positive()
});

// Resposta Likert 10 (0-10)
export const RespostaLikert10Schema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.number().int().min(0).max(10),
  tempoResposta: z.number().int().positive()
});

// Resposta Escala Visual (0-100)
export const RespostaEscalaVisualSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.number().min(0).max(100),
  tempoResposta: z.number().int().positive()
});

// Resposta Múltipla Escolha (uma opção)
export const RespostaMultiplaEscolhaSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.string(), // ID da opção selecionada
  valorTexto: z.string().optional(), // Texto da opção
  tempoResposta: z.number().int().positive()
});

// Resposta Múltipla Seleção (múltiplas opções)
export const RespostaMultiplaSelecaoSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.array(z.string()).min(0), // Array de IDs
  valoresTexto: z.array(z.string()).optional(),
  tempoResposta: z.number().int().positive()
});

// Resposta Texto Curto
export const RespostaTextoCurtoSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.string().min(1).max(200),
  tempoResposta: z.number().int().positive()
});

// Resposta Texto Longo
export const RespostaTextoLongoSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.string().min(1).max(1000),
  tempoResposta: z.number().int().positive()
});

// Resposta Sim/Não
export const RespostaSimNaoSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.boolean(),
  tempoResposta: z.number().int().positive()
});

// Resposta Emoji Picker
export const RespostaEmojiPickerSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.number().int().min(1).max(5), // Valor numérico do emoji (1-5)
  tempoResposta: z.number().int().positive()
});

// Resposta Slider Numérico
export const RespostaSliderNumericoSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.number(),
  tempoResposta: z.number().int().positive()
});

// Resposta Escala de Frequência
export const RespostaEscalaFrequenciaSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.enum(['nunca', 'raramente', 'as_vezes', 'frequentemente', 'sempre']),
  tempoResposta: z.number().int().positive()
});

// Resposta Escala de Intensidade
export const RespostaEscalaIntensidadeSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.enum(['nada', 'pouco', 'moderado', 'muito', 'extremamente']),
  tempoResposta: z.number().int().positive()
});

// Resposta Data
export const RespostaDataSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.string().datetime().or(z.date()),
  tempoResposta: z.number().int().positive()
});

// Resposta Hora
export const RespostaHoraSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)'),
  tempoResposta: z.number().int().positive()
});

// Resposta Ranking
export const RespostaRankingSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.array(z.object({
    opcaoId: z.string(),
    posicao: z.number().int().positive()
  })),
  tempoResposta: z.number().int().positive()
});

// ==============================================
// SCHEMA GENÉRICO DE RESPOSTA
// ==============================================

export const RespostaGenericaSchema = z.object({
  sessaoId: z.string().uuid(),
  perguntaId: perguntaIdSchema,
  usuarioId: z.number().int().positive(),
  valor: z.any(), // Qualquer tipo de valor
  valorNormalizado: z.number().min(0).max(1).optional(),
  tempoResposta: z.number().int().positive(),
  tentativas: z.number().int().positive().default(1),
  alterada: z.boolean().default(false),
  valencia: z.number().min(-1).max(1).optional(),
  ativacao: z.number().min(-1).max(1).optional(),
  ordem: z.number().int().positive()
});

// ==============================================
// SCHEMA DE SUBMISSÃO DE RESPOSTA (API)
// ==============================================

export const SubmeterRespostaSchema = z.object({
  sessaoId: z.string().uuid(),
  perguntaId: perguntaIdSchema,
  tipoPergunta: z.enum([
    'LIKERT_5',
    'LIKERT_7',
    'LIKERT_10',
    'ESCALA_VISUAL',
    'MULTIPLA_ESCOLHA',
    'MULTIPLA_SELECAO',
    'TEXTO_CURTO',
    'TEXTO_LONGO',
    'SIM_NAO',
    'EMOJI_PICKER',
    'SLIDER_NUMERICO',
    'ESCALA_FREQUENCIA',
    'ESCALA_INTENSIDADE',
    'DATA',
    'HORA',
    'RANKING'
  ]),
  valor: z.any(),
  tempoResposta: z.number().int().positive(),
  metadata: z.object({
    dispositivo: z.enum(['mobile', 'desktop', 'tablet']).optional(),
    tentativas: z.number().int().positive().default(1),
    alterada: z.boolean().default(false)
  }).optional()
});

// ==============================================
// SCHEMA DE LOTE DE RESPOSTAS
// ==============================================

export const LoteRespostasSchema = z.object({
  sessaoId: z.string().uuid(),
  respostas: z.array(SubmeterRespostaSchema).min(1).max(50)
});

// ==============================================
// VALIDAÇÃO CUSTOMIZADA POR TIPO
// ==============================================

/**
 * Valida resposta baseada no tipo de pergunta
 */
export function validarRespostaPorTipo(
  tipoPergunta: string,
  valor: any,
  tempoResposta: number,
  perguntaId: string
): boolean {
  try {
    const baseData = { perguntaId, valor, tempoResposta };
    
    switch (tipoPergunta) {
      case 'LIKERT_5':
        RespostaLikert5Schema.parse(baseData);
        return true;
      
      case 'LIKERT_7':
        RespostaLikert7Schema.parse(baseData);
        return true;
      
      case 'LIKERT_10':
        RespostaLikert10Schema.parse(baseData);
        return true;
      
      case 'ESCALA_VISUAL':
        RespostaEscalaVisualSchema.parse(baseData);
        return true;
      
      case 'MULTIPLA_ESCOLHA':
        RespostaMultiplaEscolhaSchema.parse(baseData);
        return true;
      
      case 'MULTIPLA_SELECAO':
        RespostaMultiplaSelecaoSchema.parse(baseData);
        return true;
      
      case 'TEXTO_CURTO':
        RespostaTextoCurtoSchema.parse(baseData);
        return true;
      
      case 'TEXTO_LONGO':
        RespostaTextoLongoSchema.parse(baseData);
        return true;
      
      case 'SIM_NAO':
        RespostaSimNaoSchema.parse(baseData);
        return true;
      
      case 'EMOJI_PICKER':
      case 'EMOJI_RATING':
        RespostaEmojiPickerSchema.parse(baseData);
        return true;
      
      case 'SLIDER_NUMERICO':
        RespostaSliderNumericoSchema.parse(baseData);
        return true;
      
      case 'ESCALA_FREQUENCIA':
        RespostaEscalaFrequenciaSchema.parse(baseData);
        return true;
      
      case 'ESCALA_INTENSIDADE':
        RespostaEscalaIntensidadeSchema.parse(baseData);
        return true;
      
      case 'DATA':
        RespostaDataSchema.parse(baseData);
        return true;
      
      case 'HORA':
        RespostaHoraSchema.parse(baseData);
        return true;
      
      case 'RANKING':
        RespostaRankingSchema.parse(baseData);
        return true;
      
      default:
        return false;
    }
  } catch (error) {
    console.error(`Erro ao validar resposta do tipo ${tipoPergunta}:`, error);
    return false;
  }
}

/**
 * Valida se resposta está dentro dos limites da pergunta
 */
export function validarLimitesResposta(
  valor: any,
  valorMinimo?: number,
  valorMaximo?: number
): boolean {
  if (valorMinimo === undefined || valorMaximo === undefined) {
    return true;
  }
  
  const num = Number(valor);
  if (isNaN(num)) return true; // Não numérico, sem limites
  
  return num >= valorMinimo && num <= valorMaximo;
}

/**
 * Valida padrão regex para respostas de texto
 */
export function validarPadraoTexto(valor: string, padrao?: string): boolean {
  if (!padrao) return true;
  
  try {
    const regex = new RegExp(padrao);
    return regex.test(valor);
  } catch {
    return true; // Regex inválido, aceitar resposta
  }
}

// ==============================================
// SCHEMA DE ANÁLISE DE RESPOSTA
// ==============================================

export const AnaliseRespostaSchema = z.object({
  respostaId: z.string().uuid(),
  valorNormalizado: z.number().min(0).max(1),
  valencia: z.number().min(-1).max(1),
  ativacao: z.number().min(-1).max(1),
  estadoEmocional: z.string(),
  categoria: z.string(),
  dominio: z.string(),
  contribuicaoTheta: z.number().optional(),
  confianca: z.number().min(0).max(1).optional()
});

// ==============================================
// SCHEMA DE HISTÓRICO DE RESPOSTAS
// ==============================================

export const HistoricoRespostasSchema = z.object({
  usuarioId: z.number().int().positive(),
  perguntaId: perguntaIdSchema,
  periodo: z.object({
    inicio: z.date(),
    fim: z.date()
  }),
  respostas: z.array(z.object({
    data: z.date(),
    valor: z.any(),
    valorNormalizado: z.number().min(0).max(1),
    sessaoId: z.string().uuid()
  })),
  estatisticas: z.object({
    media: z.number(),
    mediana: z.number(),
    desviaoPadrao: z.number(),
    tendencia: z.enum(['CRESCENTE', 'ESTAVEL', 'DECRESCENTE']).optional()
  }).optional()
});

// ==============================================
// SCHEMA DE VALIDAÇÃO EM TEMPO REAL
// ==============================================

export const ValidacaoTempoRealSchema = z.object({
  perguntaId: perguntaIdSchema,
  valor: z.any(),
  valido: z.boolean(),
  erros: z.array(z.object({
    campo: z.string(),
    mensagem: z.string(),
    tipo: z.enum(['OBRIGATORIO', 'FORMATO', 'LIMITE', 'PADRAO', 'OUTRO'])
  })),
  sugestoes: z.array(z.string()).optional()
});

// ==============================================
// HELPERS DE VALIDAÇÃO
// ==============================================

/**
 * Valida resposta completa (estrutura + conteúdo)
 */
export function validarRespostaCompleta(resposta: any): {
  valido: boolean;
  erros: Array<{ campo: string; mensagem: string }>;
} {
  const erros: Array<{ campo: string; mensagem: string }> = [];
  
  // Validar estrutura básica
  try {
    SubmeterRespostaSchema.parse(resposta);
  } catch (error: any) {
    if (error.errors) {
      erros.push(...error.errors.map((e: any) => ({
        campo: e.path.join('.'),
        mensagem: e.message
      })));
    }
  }
  
  // Validar tipo específico
  if (!validarRespostaPorTipo(
    resposta.tipoPergunta,
    resposta.valor,
    resposta.tempoResposta,
    resposta.perguntaId
  )) {
    erros.push({
      campo: 'valor',
      mensagem: `Valor inválido para tipo ${resposta.tipoPergunta}`
    });
  }
  
  return {
    valido: erros.length === 0,
    erros
  };
}

/**
 * Sanitiza resposta de texto (remove HTML, scripts, etc)
 */
export function sanitizarTexto(texto: string): string {
  return texto
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Calcula tempo de resposta anormal (muito rápido ou muito lento)
 */
export function tempoRespostaAnormal(
  tempoResposta: number,
  tipoPergunta: string
): 'MUITO_RAPIDO' | 'MUITO_LENTO' | 'NORMAL' {
  // Tempos esperados em segundos por tipo
  const temposEsperados: Record<string, { min: number; max: number }> = {
    'LIKERT_5': { min: 2, max: 30 },
    'LIKERT_7': { min: 2, max: 30 },
    'LIKERT_10': { min: 2, max: 30 },
    'ESCALA_VISUAL': { min: 3, max: 45 },
    'MULTIPLA_ESCOLHA': { min: 3, max: 60 },
    'MULTIPLA_SELECAO': { min: 5, max: 90 },
    'TEXTO_CURTO': { min: 5, max: 120 },
    'TEXTO_LONGO': { min: 10, max: 300 },
    'SIM_NAO': { min: 1, max: 20 },
    'EMOJI_PICKER': { min: 2, max: 30 },
    'SLIDER_NUMERICO': { min: 2, max: 30 },
    'ESCALA_FREQUENCIA': { min: 2, max: 30 },
    'ESCALA_INTENSIDADE': { min: 2, max: 30 },
    'DATA': { min: 3, max: 60 },
    'HORA': { min: 2, max: 30 },
    'RANKING': { min: 10, max: 180 }
  };
  
  const limites = temposEsperados[tipoPergunta] || { min: 2, max: 60 };
  
  if (tempoResposta < limites.min) return 'MUITO_RAPIDO';
  if (tempoResposta > limites.max) return 'MUITO_LENTO';
  return 'NORMAL';
}

// ==============================================
// TYPES EXPORT
// ==============================================

export type RespostaLikert5 = z.infer<typeof RespostaLikert5Schema>;
export type RespostaLikert7 = z.infer<typeof RespostaLikert7Schema>;
export type RespostaLikert10 = z.infer<typeof RespostaLikert10Schema>;
export type RespostaEscalaVisual = z.infer<typeof RespostaEscalaVisualSchema>;
export type RespostaMultiplaEscolha = z.infer<typeof RespostaMultiplaEscolhaSchema>;
export type RespostaMultiplaSelecao = z.infer<typeof RespostaMultiplaSelecaoSchema>;
export type RespostaTextoCurto = z.infer<typeof RespostaTextoCurtoSchema>;
export type RespostaTextoLongo = z.infer<typeof RespostaTextoLongoSchema>;
export type RespostaSimNao = z.infer<typeof RespostaSimNaoSchema>;
export type RespostaEmojiPicker = z.infer<typeof RespostaEmojiPickerSchema>;
export type RespostaSliderNumerico = z.infer<typeof RespostaSliderNumericoSchema>;
export type RespostaEscalaFrequencia = z.infer<typeof RespostaEscalaFrequenciaSchema>;
export type RespostaEscalaIntensidade = z.infer<typeof RespostaEscalaIntensidadeSchema>;
export type RespostaData = z.infer<typeof RespostaDataSchema>;
export type RespostaHora = z.infer<typeof RespostaHoraSchema>;
export type RespostaRanking = z.infer<typeof RespostaRankingSchema>;
export type RespostaGenerica = z.infer<typeof RespostaGenericaSchema>;
export type SubmeterResposta = z.infer<typeof SubmeterRespostaSchema>;
export type LoteRespostas = z.infer<typeof LoteRespostasSchema>;
export type AnaliseResposta = z.infer<typeof AnaliseRespostaSchema>;
export type HistoricoRespostas = z.infer<typeof HistoricoRespostasSchema>;
export type ValidacaoTempoReal = z.infer<typeof ValidacaoTempoRealSchema>;
