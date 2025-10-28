/**
 * Tipos para o sistema de resultados de avaliação
 */

// Tipo para valores de resposta que podem ser diversos
export type ValorResposta = string | number | string[] | number[] | boolean | null;

// Tipo para opções de perguntas
export interface OpcaoPerguntaResultado {
  valor: string | number;
  texto: string;
  label?: string;
  descricao?: string;
  emoji?: string;
  cor?: string;
}

// Tipo para recomendações (podem ser strings simples ou objetos estruturados)
export type Recomendacao = string | {
  tipo: string;
  mensagem: string;
  prioridade?: 'baixa' | 'media' | 'alta';
  acoes?: string[];
};

export interface ResultadoSessao {
  success: boolean;
  sessao: {
    id: string;
    status: string;
    iniciadaEm: Date;
    finalizadaEm: Date | null;
    tempoTotal: number;
    tempoMedioResposta: number;
  };
  questionario: {
    id: string;
    titulo: string;
    descricao: string;
    tipo: string;
  };
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
  scores: {
    total: number;
    porCategoria: Record<string, number>;
    interpretacao: string;
  };
  irt: {
    theta: number;
    erro: number;
    confianca: number;
  };
  circumplex: {
    valencia: number;
    ativacao: number;
    quadrante: string;
    estado: string;
  };
  nivelAlerta: string;
  alertas: AlertaResultado[];
  recomendacoes: string[];
  respostas: RespostaResultado[];
  estatisticas: {
    totalRespostas: number;
    taxaConclusao: number;
    tempoMedioPorResposta: number;
  };
}

export interface AlertaResultado {
  id: string;
  tipo: string;
  nivel: string;
  categoria: string;
  mensagem: string;
  descricao: string;
  recomendacoes: Recomendacao[];
  criadoEm: Date;
}

export interface RespostaResultado {
  id: string;
  ordem: number;
  pergunta: {
    id: string;
    texto: string;
    textoAuxiliar: string | null;
    categoria: string;
    dominio: string | null;
    tipo: string;
    opcoes: OpcaoPerguntaResultado[];
    peso: number;
  };
  resposta: {
    valor: ValorResposta;
    valorNormalizado: number;
    tempoResposta: number;
  };
  irt: {
    thetaAposResposta: number;
    contribuicaoInfo: number;
  };
  analiseEmocional: {
    valencia: number;
    ativacao: number;
  };
}
