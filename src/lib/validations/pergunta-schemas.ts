/**
 * Schemas de Validação - Perguntas
 * 
 * Schemas Zod para validação de cada tipo de pergunta do sistema adaptativo.
 * Garante type-safety e validação em tempo de execução.
 */

import { z } from 'zod';

// ==============================================
// ENUMS
// ==============================================

export const TipoPerguntaEnum = z.enum([
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
]);

export const CategoriaPerguntaEnum = z.enum([
  'HUMOR_GERAL',
  'ANSIEDADE',
  'DEPRESSAO',
  'ESTRESSE',
  'SONO',
  'CONCENTRACAO',
  'MOTIVACAO',
  'RELACIONAMENTOS',
  'AUTOESTIMA',
  'ENERGIA',
  'FADIGA',
  'IRRITABILIDADE',
  'PENSAMENTOS_NEGATIVOS',
  'APOIO_SOCIAL',
  'DESEMPENHO_ACADEMICO',
  'SATISFACAO_VIDA',
  'BEM_ESTAR',
  'SAUDE_FISICA'
]);

// ==============================================
// SCHEMAS DE OPÇÕES
// ==============================================

export const OpcaoLikertSchema = z.object({
  valor: z.number(),
  label: z.string(),
  descricao: z.string().optional()
});

export const OpcaoMultiplaEscolhaSchema = z.object({
  id: z.string(),
  texto: z.string(),
  valor: z.union([z.string(), z.number()]),
  peso: z.number().optional() // Para pontuação
});

export const OpcaoFrequenciaSchema = z.object({
  valor: z.enum(['nunca', 'raramente', 'as_vezes', 'frequentemente', 'sempre']),
  label: z.string(),
  pontuacao: z.number().min(0).max(1)
});

export const OpcaoIntensidadeSchema = z.object({
  valor: z.enum(['nada', 'pouco', 'moderado', 'muito', 'extremamente']),
  label: z.string(),
  pontuacao: z.number().min(0).max(1)
});

export const OpcaoEmojiSchema = z.object({
  id: z.string(),
  emoji: z.string(),
  label: z.string(),
  valor: z.number().min(1).max(5)
});

// ==============================================
// SCHEMAS DE PERGUNTAS
// ==============================================

const PerguntaBaseSchema = z.object({
  id: z.string().uuid(),
  texto: z.string().min(5, 'Pergunta deve ter pelo menos 5 caracteres'),
  textoAuxiliar: z.string().optional(),
  categoria: CategoriaPerguntaEnum,
  dominio: z.string(),
  tipoPergunta: TipoPerguntaEnum,
  obrigatoria: z.boolean().default(true),
  ordem: z.number().int().positive(),
  tags: z.array(z.string()).optional(),
  escalaNome: z.string().optional(),
  escalaItem: z.string().optional()
});

// Likert 5 pontos (1-5)
export const PerguntaLikert5Schema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('LIKERT_5'),
  opcoes: z.array(OpcaoLikertSchema).length(5),
  valorMinimo: z.literal(1),
  valorMaximo: z.literal(5)
});

// Likert 7 pontos (1-7)
export const PerguntaLikert7Schema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('LIKERT_7'),
  opcoes: z.array(OpcaoLikertSchema).length(7),
  valorMinimo: z.literal(1),
  valorMaximo: z.literal(7)
});

// Likert 10 pontos (0-10)
export const PerguntaLikert10Schema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('LIKERT_10'),
  opcoes: z.array(OpcaoLikertSchema).length(11), // 0 a 10 = 11 opções
  valorMinimo: z.literal(0),
  valorMaximo: z.literal(10)
});

// Escala Visual (Slider)
export const PerguntaEscalaVisualSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('ESCALA_VISUAL'),
  valorMinimo: z.number().default(0),
  valorMaximo: z.number().default(100),
  passo: z.number().positive().optional(),
  labelMinimo: z.string().optional(),
  labelMaximo: z.string().optional(),
  mostrarValor: z.boolean().default(true)
});

// Múltipla Escolha (uma opção)
export const PerguntaMultiplaEscolhaSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('MULTIPLA_ESCOLHA'),
  opcoes: z.array(OpcaoMultiplaEscolhaSchema).min(2, 'Deve ter pelo menos 2 opções'),
  permitirOutro: z.boolean().default(false),
  textoOutro: z.string().optional()
});

// Múltipla Seleção (múltiplas opções)
export const PerguntaMultiplaSelecaoSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('MULTIPLA_SELECAO'),
  opcoes: z.array(OpcaoMultiplaEscolhaSchema).min(2, 'Deve ter pelo menos 2 opções'),
  minimoSelecoes: z.number().int().min(0).optional(),
  maximoSelecoes: z.number().int().positive().optional(),
  permitirOutro: z.boolean().default(false)
});

// Texto Curto
export const PerguntaTextoCurtoSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('TEXTO_CURTO'),
  placeholder: z.string().optional(),
  caracteresMínimo: z.number().int().min(0).default(0),
  caracteresMaximo: z.number().int().positive().default(200),
  padraoResposta: z.string().optional(), // Regex
  mensagemErro: z.string().optional()
});

// Texto Longo (Textarea)
export const PerguntaTextoLongoSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('TEXTO_LONGO'),
  placeholder: z.string().optional(),
  caracteresMínimo: z.number().int().min(0).default(0),
  caracteresMaximo: z.number().int().positive().default(1000),
  linhasMinimas: z.number().int().positive().default(3)
});

// Sim/Não (Boolean)
export const PerguntaSimNaoSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('SIM_NAO'),
  labelSim: z.string().default('Sim'),
  labelNao: z.string().default('Não')
});

// Emoji Picker
export const PerguntaEmojiPickerSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('EMOJI_PICKER'),
  opcoes: z.array(OpcaoEmojiSchema).min(3).max(10)
});

// Slider Numérico
export const PerguntaSliderNumericoSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('SLIDER_NUMERICO'),
  valorMinimo: z.number(),
  valorMaximo: z.number(),
  passo: z.number().positive().default(1),
  labelMinimo: z.string().optional(),
  labelMaximo: z.string().optional(),
  unidade: z.string().optional() // "horas", "dias", "kg", etc
});

// Escala de Frequência
export const PerguntaEscalaFrequenciaSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('ESCALA_FREQUENCIA'),
  opcoes: z.array(OpcaoFrequenciaSchema).length(5)
});

// Escala de Intensidade
export const PerguntaEscalaIntensidadeSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('ESCALA_INTENSIDADE'),
  opcoes: z.array(OpcaoIntensidadeSchema).length(5)
});

// Data
export const PerguntaDataSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('DATA'),
  dataMinima: z.date().optional(),
  dataMaxima: z.date().optional(),
  permitirFuturo: z.boolean().default(true),
  permitirPassado: z.boolean().default(true)
});

// Hora
export const PerguntaHoraSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('HORA'),
  formato24h: z.boolean().default(true),
  horaMinima: z.string().optional(), // "08:00"
  horaMaxima: z.string().optional()  // "18:00"
});

// Ranking (ordenar opções)
export const PerguntaRankingSchema = PerguntaBaseSchema.extend({
  tipoPergunta: z.literal('RANKING'),
  opcoes: z.array(OpcaoMultiplaEscolhaSchema).min(3).max(10),
  permitirEmpates: z.boolean().default(false)
});

// ==============================================
// SCHEMA UNION (TODAS AS PERGUNTAS)
// ==============================================

export const PerguntaSchema = z.discriminatedUnion('tipoPergunta', [
  PerguntaLikert5Schema,
  PerguntaLikert7Schema,
  PerguntaLikert10Schema,
  PerguntaEscalaVisualSchema,
  PerguntaMultiplaEscolhaSchema,
  PerguntaMultiplaSelecaoSchema,
  PerguntaTextoCurtoSchema,
  PerguntaTextoLongoSchema,
  PerguntaSimNaoSchema,
  PerguntaEmojiPickerSchema,
  PerguntaSliderNumericoSchema,
  PerguntaEscalaFrequenciaSchema,
  PerguntaEscalaIntensidadeSchema,
  PerguntaDataSchema,
  PerguntaHoraSchema,
  PerguntaRankingSchema
]);

// ==============================================
// SCHEMA DE CRIAÇÃO DE PERGUNTA
// ==============================================

export const CriarPerguntaSchema = z.object({
  questionarioId: z.string().uuid(),
  texto: z.string().min(5, 'Pergunta deve ter pelo menos 5 caracteres').max(500),
  textoAuxiliar: z.string().max(1000).optional(),
  categoria: CategoriaPerguntaEnum,
  dominio: z.string(),
  tipoPergunta: TipoPerguntaEnum,
  obrigatoria: z.boolean().default(true),
  ordem: z.number().int().positive(),
  opcoes: z.any().optional(), // Validado por tipo específico
  valorMinimo: z.number().optional(),
  valorMaximo: z.number().optional(),
  padraoResposta: z.string().optional(),
  dificuldade: z.number().min(0).max(1).default(0.5),
  discriminacao: z.number().min(0).max(3).default(1.0),
  peso: z.number().min(0).max(5).default(1.0),
  escalaNome: z.string().optional(),
  escalaItem: z.string().optional(),
  tags: z.array(z.string()).optional(),
  palavrasChave: z.array(z.string()).optional(),
  ativo: z.boolean().default(true),
  validada: z.boolean().default(false)
});

// ==============================================
// SCHEMA DE ATUALIZAÇÃO DE PERGUNTA
// ==============================================

export const AtualizarPerguntaSchema = CriarPerguntaSchema.partial().extend({
  id: z.string().uuid()
});

// ==============================================
// HELPERS DE VALIDAÇÃO
// ==============================================

/**
 * Valida pergunta baseada no tipo
 */
export function validarPergunta(pergunta: any): z.infer<typeof PerguntaSchema> {
  return PerguntaSchema.parse(pergunta);
}

/**
 * Valida se opções estão corretas para o tipo de pergunta
 */
export function validarOpcoesPorTipo(tipoPergunta: string, opcoes: any): boolean {
  try {
    switch (tipoPergunta) {
      case 'LIKERT_5':
        z.array(OpcaoLikertSchema).length(5).parse(opcoes);
        return true;
      
      case 'LIKERT_7':
        z.array(OpcaoLikertSchema).length(7).parse(opcoes);
        return true;
      
      case 'LIKERT_10':
        z.array(OpcaoLikertSchema).length(11).parse(opcoes);
        return true;
      
      case 'MULTIPLA_ESCOLHA':
      case 'MULTIPLA_SELECAO':
        z.array(OpcaoMultiplaEscolhaSchema).min(2).parse(opcoes);
        return true;
      
      case 'EMOJI_PICKER':
        z.array(OpcaoEmojiSchema).min(3).max(10).parse(opcoes);
        return true;
      
      case 'ESCALA_FREQUENCIA':
        z.array(OpcaoFrequenciaSchema).length(5).parse(opcoes);
        return true;
      
      case 'ESCALA_INTENSIDADE':
        z.array(OpcaoIntensidadeSchema).length(5).parse(opcoes);
        return true;
      
      case 'RANKING':
        z.array(OpcaoMultiplaEscolhaSchema).min(3).max(10).parse(opcoes);
        return true;
      
      default:
        return true; // Tipos sem opções
    }
  } catch {
    return false;
  }
}

// ==============================================
// TYPES EXPORT
// ==============================================

export type Pergunta = z.infer<typeof PerguntaSchema>;
export type PerguntaLikert5 = z.infer<typeof PerguntaLikert5Schema>;
export type PerguntaLikert7 = z.infer<typeof PerguntaLikert7Schema>;
export type PerguntaLikert10 = z.infer<typeof PerguntaLikert10Schema>;
export type PerguntaEscalaVisual = z.infer<typeof PerguntaEscalaVisualSchema>;
export type PerguntaMultiplaEscolha = z.infer<typeof PerguntaMultiplaEscolhaSchema>;
export type PerguntaMultiplaSelecao = z.infer<typeof PerguntaMultiplaSelecaoSchema>;
export type PerguntaTextoCurto = z.infer<typeof PerguntaTextoCurtoSchema>;
export type PerguntaTextoLongo = z.infer<typeof PerguntaTextoLongoSchema>;
export type PerguntaSimNao = z.infer<typeof PerguntaSimNaoSchema>;
export type PerguntaEmojiPicker = z.infer<typeof PerguntaEmojiPickerSchema>;
export type PerguntaSliderNumerico = z.infer<typeof PerguntaSliderNumericoSchema>;
export type PerguntaEscalaFrequencia = z.infer<typeof PerguntaEscalaFrequenciaSchema>;
export type PerguntaEscalaIntensidade = z.infer<typeof PerguntaEscalaIntensidadeSchema>;
export type PerguntaData = z.infer<typeof PerguntaDataSchema>;
export type PerguntaHora = z.infer<typeof PerguntaHoraSchema>;
export type PerguntaRanking = z.infer<typeof PerguntaRankingSchema>;
export type CriarPergunta = z.infer<typeof CriarPerguntaSchema>;
export type AtualizarPergunta = z.infer<typeof AtualizarPerguntaSchema>;
