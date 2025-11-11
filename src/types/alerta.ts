/**
 * Tipos para Sistema de Alertas
 */

import type { NivelAlerta } from './sessao';

export type TipoAlerta =
  | 'RISCO_EVASAO'
  | 'DIFICULDADE_APRENDIZAGEM'
  | 'BAIXO_ENGAJAMENTO'
  | 'ANSIEDADE_AVALIATIVA'
  | 'FADIGA_COGNITIVA'
  | 'INCONSISTENCIA_RESPOSTAS'
  | 'TEMPO_EXCESSIVO'
  | 'PADRAO_ALEATORIO';

export type StatusAlerta = 'ATIVO' | 'VISUALIZADO' | 'EM_ACOMPANHAMENTO' | 'RESOLVIDO';

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  nivel: NivelAlerta;
  status: StatusAlerta;
  titulo: string;
  descricao: string;
  mensagem: string;
  recomendacoes: string[];
  criadoEm: Date | string;
  visualizadoEm?: Date | string;
  sessaoId: string;
  usuarioId: string;
  metadados?: {
    theta?: number;
    confianca?: number;
    tempoResposta?: number;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface ResumoAlertas {
  total: number;
  ativos: number;
  porNivel: {
    VERDE: number;
    AMARELO: number;
    LARANJA: number;
    VERMELHO: number;
  };
  porTipo: Record<TipoAlerta, number>;
}

export interface AlertaFiltros {
  nivel?: NivelAlerta[];
  tipo?: TipoAlerta[];
  status?: StatusAlerta[];
  sessaoId?: string;
  usuarioId?: string;
  dataInicio?: Date | string;
  dataFim?: Date | string;
}
