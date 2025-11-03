/**
 * Tipos para Progresso de Sessão
 */

// Importa tipos compartilhados
import type { ValorResposta, OpcaoPerguntaResultado } from './resultado';

export type NivelAlerta = 'VERDE' | 'AMARELO' | 'LARANJA' | 'VERMELHO';

export type StatusSessao = 
  | 'INICIAL'
  | 'EM_ANDAMENTO'
  | 'PAUSADA'
  | 'FINALIZADA'
  | 'CANCELADA';

// Configurações específicas por tipo de pergunta
export interface ConfiguracaoPergunta {
  min?: number;
  max?: number;
  step?: number;
  orientacao?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  showValues?: boolean;
  customEmojis?: string[];
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface ProgressoSessao {
  perguntasRespondidas: number;
  totalEstimado: number;
  porcentagem: number; // 0-100
}

export interface IRTInfo {
  theta: number; // -3 a 3 (nível do traço latente)
  erro: number; // Erro padrão da estimativa
  confianca: number; // 0.0 a 1.0
}

export interface SessaoDetalhes {
  id: string;
  status: StatusSessao;
  progresso: ProgressoSessao;
  irt: IRTInfo;
  nivelAlerta: NivelAlerta;
  tempoDecorrido: number; // em segundos
  tempoTotal?: number; // em segundos (tempo total da sessão)
  tempoEstimado?: number; // em segundos (estimativa para conclusão)
  iniciadoEm: Date;
  pausadoEm?: Date | null;
  finalizadoEm?: Date | null;
  totalPerguntasEstimado: number;
  scoresPorCategoria?: Record<string, number>; // Scores finais por categoria (0-10)
  usuario: {
    id: number;
    nome: string;
    avatar?: string | null;
  };
  respostas?: Array<{
    id: string;
    perguntaId: string;
    resposta: ValorResposta;
    tempoResposta: number;
  }>;
  perguntaAtual?: {
    id: string;
    tipo: string;
    texto: string;
    dimensao?: string;
    obrigatoria: boolean;
    opcoes?: OpcaoPerguntaResultado[];
    configuracao?: ConfiguracaoPergunta;
  };
  questionario: {
    id: string;
    titulo: string;
    descricao?: string;
    adaptativo: boolean;
  };
}
