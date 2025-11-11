/**
 * Tipos para Perguntas Socioemocionais
 */

// Tipo para valores de resposta
export type ValorResposta = string | number | string[] | number[] | boolean | null;

export type TipoPergunta =
  | 'LIKERT_5'
  | 'LIKERT_7'
  | 'ESCALA_FREQUENCIA' // PHQ-9, GAD-7 (0-3: Nenhuma vez, Vários dias, Mais da metade, Quase todos)
  | 'ESCALA_INTENSIDADE' // PANAS, ISI (1-5: Nada, Pouco, Moderado, Bastante, Extremamente)
  | 'ESCALA_VISUAL' // Circumplex Model (bidimensional: valência x ativação)
  | 'SIM_NAO'
  | 'MULTIPLA_ESCOLHA'
  | 'MULTIPLA_ESCOLHA_MULTIPLA'
  | 'MULTIPLA_SELECAO'
  | 'ESCALA_NUMERICA'
  | 'ESCALA_VISUAL_ANALOGICA'
  | 'TEXTO_CURTO'
  | 'TEXTO_LONGO'
  | 'SLIDER'
  | 'SLIDER_NUMERICO' // Range slider numérico (alias de SLIDER)
  | 'EMOJI_RATING'
  | 'EMOJI_PICKER' // Seletor de emojis (alias de EMOJI_RATING)
  | 'CIRCUMPLEX_GRID'
  | 'DRAG_DROP'
  | 'IMAGEM_ESCOLHA'
  | 'AUDIO_RESPOSTA'
  | 'VIDEO_RESPOSTA';

export type CategoriaPergunta =
  | 'BEM_ESTAR'
  | 'ANSIEDADE'
  | 'DEPRESSAO'
  | 'HUMOR'
  | 'ENERGIA'
  | 'SONO'
  | 'CONCENTRACAO'
  | 'AUTOESTIMA'
  | 'RELACIONAMENTOS'
  | 'ESTRESSE'
  | 'MOTIVACAO'
  | 'EMOCIONAL';

export type DominioEmocional =
  | 'VALENCIA_POSITIVA'
  | 'VALENCIA_NEGATIVA'
  | 'ATIVACAO_ALTA'
  | 'ATIVACAO_BAIXA';

export interface OpcaoPergunta {
  valor: string | number;
  texto: string;
  label?: string; // Alias para texto (usado em seeds JSON)
  descricao?: string;
  emoji?: string;
  imagem?: string;
  cor?: string;
}

export interface PerguntaSocioemocional {
  id: string;
  texto: string;
  textoAuxiliar?: string;
  categoria: CategoriaPergunta;
  dominio?: DominioEmocional;
  tipoPergunta: TipoPergunta;
  obrigatoria: boolean;
  ordem: number;
  
  // Opções (para perguntas de escolha)
  opcoes?: OpcaoPergunta[];
  
  // Validação
  valorMinimo?: number;
  valorMaximo?: number;
  padraoResposta?: string; // Regex para validação
  
  // IRT (Item Response Theory)
  dificuldade?: number; // -3 a 3
  discriminacao?: number; // 0 a 3
  peso?: number; // 0.0 a 1.0
  
  // Escalas oficiais
  escalaNome?: string; // "WHO5", "PHQ9", "GAD7"
  escalaItem?: string; // "WHO5_1", "PHQ9_9"
  
  // Metadata
  instrucoes?: string;
  tooltip?: string;
  placeholder?: string;
  ativo: boolean;
}

export interface RespostaForm {
  perguntaId: string;
  valor: ValorResposta;
  tempoResposta: number; // em segundos
  timestamp: Date;
}

export interface ValidacaoResposta {
  valido: boolean;
  erro?: string;
  avisos?: string[];
}
