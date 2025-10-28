/**
 * Tipos para o sistema de resultados de avaliação
 */

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
  recomendacoes: any;
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
    opcoes: any;
    peso: number;
  };
  resposta: {
    valor: any;
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
