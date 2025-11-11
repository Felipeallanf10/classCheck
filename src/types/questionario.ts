/**
 * Tipos para Questionários Socioemocionais
 */

export type TipoQuestionario = 
  | 'CHECK_IN_DIARIO'
  | 'AVALIACAO_SEMANAL'
  | 'AVALIACAO_MENSAL'
  | 'AVALIACAO_POS_AULA'
  | 'AVALIACAO_CRITICA'
  | 'QUESTIONARIO_INICIAL'
  | 'QUESTIONARIO_FINAL'
  | 'PESQUISA_SATISFACAO'
  | 'AUTOAVALIACAO'
  | 'DIAGNOSTICO'
  | 'TRIAGEM'
  | 'ACOMPANHAMENTO'
  | 'INTERVENCAO'
  | 'PESQUISA'
  | 'SCREENING'
  | 'LONGITUDINAL'
  | 'TRANSVERSAL';

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

export interface QuestionarioResumo {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoQuestionario;
  adaptativo: boolean;
  duracaoEstimada: number;
  ativo: boolean;
  publicado: boolean;
  oficial: boolean;
  versao: string;
  instrucoes: string;
  categorias: CategoriaPergunta[];
  _count?: {
    perguntas: number;
    sessoes: number;
  };
  estatisticas?: {
    totalPerguntas: number;
    sessoesRealizadas: number;
  };
}

export interface QuestionarioFiltros {
  tipo?: TipoQuestionario;
  categoria?: CategoriaPergunta;
  adaptativo?: boolean;
  ativo?: boolean;
  oficial?: boolean;
}

export interface QuestionariosResponse {
  success: boolean;
  total: number;
  questionarios: QuestionarioResumo[];
}
