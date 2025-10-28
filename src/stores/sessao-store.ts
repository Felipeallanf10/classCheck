/**
 * Store Zustand - Sessão Adaptativa
 * 
 * Gerenciamento de estado da sessão de questionário adaptativo.
 * Inclui persistência em localStorage e sincronização com backend via TanStack Query.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ==============================================
// TIPOS E INTERFACES
// ==============================================

export interface Pergunta {
  id: string;
  texto: string;
  textoAuxiliar?: string;
  categoria: string;
  dominio: string;
  tipoPergunta: string;
  opcoes?: any;
  valorMinimo?: number;
  valorMaximo?: number;
  obrigatoria: boolean;
  ordem: number;
}

export interface Resposta {
  id?: string;
  perguntaId: string;
  valor: any;
  valorNormalizado: number;
  tempoResposta: number;
  timestamp: Date;
  tentativas: number;
  alterada: boolean;
}

export type NivelAlerta = 'VERDE' | 'AMARELO' | 'LARANJA' | 'VERMELHO';

export type StatusSessao = 'INICIAL' | 'EM_ANDAMENTO' | 'PAUSADA' | 'FINALIZADA' | 'CANCELADA';

export interface AlertaAtivo {
  id: string;
  nivel: NivelAlerta;
  tipo: string;
  titulo: string;
  descricao: string;
  timestamp: Date;
}

export interface ProgressoSessao {
  perguntasRespondidas: number;
  totalPerguntas: number;
  porcentagem: number;
  tempoDecorrido: number; // segundos
  tempoEstimadoRestante: number; // segundos
}

// ==============================================
// STATE INTERFACE
// ==============================================

interface SessaoAdaptativaState {
  // Identificação
  sessaoId: string | null;
  questionarioId: string | null;
  usuarioId: number | null;
  
  // Estado da sessão
  status: StatusSessao;
  iniciadaEm: Date | null;
  pausadaEm: Date | null;
  finalizadaEm: Date | null;
  
  // Perguntas
  perguntaAtual: Pergunta | null;
  proximaPergunta: Pergunta | null;
  perguntasApresentadas: string[]; // IDs
  perguntasRespondidas: string[]; // IDs
  
  // Respostas
  respostas: Resposta[];
  respostaAtual: Partial<Resposta> | null;
  
  // Alertas
  nivelAlerta: NivelAlerta;
  alertasAtivos: AlertaAtivo[];
  
  // IRT (Item Response Theory)
  thetaEstimado: number;
  erroEstimacao: number;
  confianca: number;
  
  // Progresso
  progresso: ProgressoSessao;
  
  // UI State
  carregando: boolean;
  erro: string | null;
  tempoInicioResposta: number | null; // timestamp
  
  // ==============================================
  // ACTIONS
  // ==============================================
  
  /**
   * Inicializa nova sessão
   */
  iniciarSessao: (
    questionarioId: string,
    usuarioId: number,
    primeiraPergunta: Pergunta
  ) => void;
  
  /**
   * Carrega sessão existente
   */
  carregarSessao: (sessaoId: string) => Promise<void>;
  
  /**
   * Define pergunta atual
   */
  setPerguntaAtual: (pergunta: Pergunta) => void;
  
  /**
   * Define próxima pergunta (pré-carregada)
   */
  setProximaPergunta: (pergunta: Pergunta | null) => void;
  
  /**
   * Inicia temporizador de resposta
   */
  iniciarResposta: () => void;
  
  /**
   * Atualiza resposta atual (enquanto usuário digita)
   */
  atualizarRespostaAtual: (valor: any) => void;
  
  /**
   * Submete resposta atual
   */
  submeterResposta: () => Promise<void>;
  
  /**
   * Avança para próxima pergunta
   */
  proximaPerguntaAction: () => Promise<void>;
  
  /**
   * Volta para pergunta anterior (se permitido)
   */
  perguntaAnterior: () => void;
  
  /**
   * Pausa sessão
   */
  pausarSessao: () => void;
  
  /**
   * Retoma sessão pausada
   */
  retomarSessao: () => void;
  
  /**
   * Finaliza sessão
   */
  finalizarSessao: () => Promise<void>;
  
  /**
   * Cancela sessão
   */
  cancelarSessao: () => void;
  
  /**
   * Adiciona alerta
   */
  adicionarAlerta: (alerta: AlertaAtivo) => void;
  
  /**
   * Remove alerta
   */
  removerAlerta: (alertaId: string) => void;
  
  /**
   * Atualiza nível de alerta
   */
  setNivelAlerta: (nivel: NivelAlerta) => void;
  
  /**
   * Atualiza theta IRT
   */
  atualizarTheta: (theta: number, erro: number, confianca: number) => void;
  
  /**
   * Atualiza progresso
   */
  atualizarProgresso: () => void;
  
  /**
   * Define estado de carregamento
   */
  setCarregando: (carregando: boolean) => void;
  
  /**
   * Define erro
   */
  setErro: (erro: string | null) => void;
  
  /**
   * Limpa estado (reset completo)
   */
  limparEstado: () => void;
}

// ==============================================
// ESTADO INICIAL
// ==============================================

const estadoInicial = {
  sessaoId: null,
  questionarioId: null,
  usuarioId: null,
  status: 'INICIAL' as StatusSessao,
  iniciadaEm: null,
  pausadaEm: null,
  finalizadaEm: null,
  perguntaAtual: null,
  proximaPergunta: null,
  perguntasApresentadas: [],
  perguntasRespondidas: [],
  respostas: [],
  respostaAtual: null,
  nivelAlerta: 'VERDE' as NivelAlerta,
  alertasAtivos: [],
  thetaEstimado: 0,
  erroEstimacao: 1,
  confianca: 0.5,
  progresso: {
    perguntasRespondidas: 0,
    totalPerguntas: 0,
    porcentagem: 0,
    tempoDecorrido: 0,
    tempoEstimadoRestante: 0
  },
  carregando: false,
  erro: null,
  tempoInicioResposta: null
};

// ==============================================
// STORE
// ==============================================

export const useSessaoAdaptativaStore = create<SessaoAdaptativaState>()(
  persist(
    immer((set, get) => ({
      ...estadoInicial,
      
      // Iniciar Sessão
      iniciarSessao: (questionarioId, usuarioId, primeiraPergunta) => {
        set((state) => {
          state.sessaoId = `sessao-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          state.questionarioId = questionarioId;
          state.usuarioId = usuarioId;
          state.status = 'EM_ANDAMENTO';
          state.iniciadaEm = new Date();
          state.perguntaAtual = primeiraPergunta;
          state.perguntasApresentadas = [primeiraPergunta.id];
          state.tempoInicioResposta = Date.now();
        });
      },
      
      // Carregar Sessão
      carregarSessao: async (sessaoId) => {
        set({ carregando: true, erro: null });
        
        try {
          // TODO: Fazer requisição para API
          // const response = await fetch(`/api/sessao/${sessaoId}`);
          // const data = await response.json();
          
          // Por enquanto, apenas simula
          console.log('Carregando sessão:', sessaoId);
          
          set({ carregando: false });
        } catch (error) {
          set({ 
            carregando: false, 
            erro: error instanceof Error ? error.message : 'Erro desconhecido'
          });
        }
      },
      
      // Set Pergunta Atual
      setPerguntaAtual: (pergunta) => {
        set((state) => {
          state.perguntaAtual = pergunta;
          
          // Adicionar às apresentadas se não estiver
          if (!state.perguntasApresentadas.includes(pergunta.id)) {
            state.perguntasApresentadas.push(pergunta.id);
          }
          
          // Iniciar timer de resposta
          state.tempoInicioResposta = Date.now();
          state.respostaAtual = {
            perguntaId: pergunta.id,
            tentativas: 1,
            alterada: false
          };
        });
      },
      
      // Set Próxima Pergunta
      setProximaPergunta: (pergunta) => {
        set({ proximaPergunta: pergunta });
      },
      
      // Iniciar Resposta
      iniciarResposta: () => {
        set({ tempoInicioResposta: Date.now() });
      },
      
      // Atualizar Resposta Atual
      atualizarRespostaAtual: (valor) => {
        set((state) => {
          if (state.respostaAtual) {
            const jaAlterada = state.respostaAtual.alterada;
            state.respostaAtual.valor = valor;
            state.respostaAtual.alterada = jaAlterada || true;
            state.respostaAtual.tentativas = (state.respostaAtual.tentativas || 0) + (jaAlterada ? 0 : 1);
          }
        });
      },
      
      // Submeter Resposta
      submeterResposta: async () => {
        const state = get();
        
        if (!state.respostaAtual || !state.tempoInicioResposta) {
          throw new Error('Nenhuma resposta para submeter');
        }
        
        set({ carregando: true, erro: null });
        
        try {
          const tempoResposta = Math.floor((Date.now() - state.tempoInicioResposta) / 1000);
          
          const resposta: Resposta = {
            perguntaId: state.respostaAtual.perguntaId!,
            valor: state.respostaAtual.valor,
            valorNormalizado: 0.5, // TODO: Calcular normalização
            tempoResposta,
            timestamp: new Date(),
            tentativas: state.respostaAtual.tentativas || 1,
            alterada: state.respostaAtual.alterada || false
          };
          
          // TODO: Enviar para API
          // const response = await fetch('/api/resposta', {
          //   method: 'POST',
          //   body: JSON.stringify({ sessaoId: state.sessaoId, resposta })
          // });
          
          set((state) => {
            state.respostas.push(resposta);
            state.perguntasRespondidas.push(resposta.perguntaId);
            state.respostaAtual = null;
            state.tempoInicioResposta = null;
          });
          
          // Atualizar progresso
          get().atualizarProgresso();
          
          set({ carregando: false });
        } catch (error) {
          set({ 
            carregando: false,
            erro: error instanceof Error ? error.message : 'Erro ao submeter resposta'
          });
        }
      },
      
      // Próxima Pergunta
      proximaPerguntaAction: async () => {
        const state = get();
        
        set({ carregando: true, erro: null });
        
        try {
          // TODO: Requisitar próxima pergunta da API
          // const response = await fetch(`/api/sessao/${state.sessaoId}/proxima`);
          // const proximaPergunta = await response.json();
          
          // Se já temos próxima pergunta pré-carregada
          if (state.proximaPergunta) {
            get().setPerguntaAtual(state.proximaPergunta);
            set({ proximaPergunta: null });
          }
          
          set({ carregando: false });
        } catch (error) {
          set({
            carregando: false,
            erro: error instanceof Error ? error.message : 'Erro ao buscar próxima pergunta'
          });
        }
      },
      
      // Pergunta Anterior
      perguntaAnterior: () => {
        set((state) => {
          const indiceAtual = state.perguntasApresentadas.findIndex(
            (id: string) => id === state.perguntaAtual?.id
          );
          
          if (indiceAtual > 0) {
            const perguntaAnteriorId = state.perguntasApresentadas[indiceAtual - 1];
            // TODO: Carregar pergunta anterior
            console.log('Voltando para pergunta:', perguntaAnteriorId);
          }
        });
      },
      
      // Pausar Sessão
      pausarSessao: () => {
        set((state) => {
          state.status = 'PAUSADA';
          state.pausadaEm = new Date();
        });
      },
      
      // Retomar Sessão
      retomarSessao: () => {
        set((state) => {
          state.status = 'EM_ANDAMENTO';
          state.pausadaEm = null;
        });
      },
      
      // Finalizar Sessão
      finalizarSessao: async () => {
        set({ carregando: true, erro: null });
        
        try {
          // TODO: Enviar finalização para API
          // const response = await fetch(`/api/sessao/${get().sessaoId}/finalizar`, {
          //   method: 'POST'
          // });
          
          set((state) => {
            state.status = 'FINALIZADA';
            state.finalizadaEm = new Date();
          });
          
          set({ carregando: false });
        } catch (error) {
          set({
            carregando: false,
            erro: error instanceof Error ? error.message : 'Erro ao finalizar sessão'
          });
        }
      },
      
      // Cancelar Sessão
      cancelarSessao: () => {
        set((state) => {
          state.status = 'CANCELADA';
          state.finalizadaEm = new Date();
        });
      },
      
      // Adicionar Alerta
      adicionarAlerta: (alerta) => {
        set((state) => {
          state.alertasAtivos.push(alerta);
          
          // Atualizar nível de alerta para o mais grave
          const niveis: NivelAlerta[] = ['VERDE', 'AMARELO', 'LARANJA', 'VERMELHO'];
          const nivelMaisGrave = state.alertasAtivos.reduce((max: NivelAlerta, a: AlertaAtivo) => {
            const indexA = niveis.indexOf(a.nivel);
            const indexMax = niveis.indexOf(max);
            return indexA > indexMax ? a.nivel : max;
          }, 'VERDE' as NivelAlerta);
          
          state.nivelAlerta = nivelMaisGrave;
        });
      },
      
      // Remover Alerta
      removerAlerta: (alertaId) => {
        set((state) => {
          state.alertasAtivos = state.alertasAtivos.filter((a: AlertaAtivo) => a.id !== alertaId);
          
          // Recalcular nível de alerta
          if (state.alertasAtivos.length === 0) {
            state.nivelAlerta = 'VERDE';
          } else {
            const niveis: NivelAlerta[] = ['VERDE', 'AMARELO', 'LARANJA', 'VERMELHO'];
            state.nivelAlerta = state.alertasAtivos.reduce((max: NivelAlerta, a: AlertaAtivo) => {
              const indexA = niveis.indexOf(a.nivel);
              const indexMax = niveis.indexOf(max);
              return indexA > indexMax ? a.nivel : max;
            }, 'VERDE' as NivelAlerta);
          }
        });
      },
      
      // Set Nível Alerta
      setNivelAlerta: (nivel) => {
        set({ nivelAlerta: nivel });
      },
      
      // Atualizar Theta
      atualizarTheta: (theta, erro, confianca) => {
        set({ thetaEstimado: theta, erroEstimacao: erro, confianca });
      },
      
      // Atualizar Progresso
      atualizarProgresso: () => {
        set((state) => {
          const perguntasRespondidas = state.perguntasRespondidas.length;
          const totalPerguntas = Math.max(state.perguntasApresentadas.length, 10); // Mínimo estimado
          const porcentagem = totalPerguntas > 0 
            ? Math.round((perguntasRespondidas / totalPerguntas) * 100)
            : 0;
          
          const tempoDecorrido = state.iniciadaEm 
            ? Math.floor((Date.now() - state.iniciadaEm.getTime()) / 1000)
            : 0;
          
          // Estimar tempo restante (assumindo média de 15 segundos por pergunta)
          const perguntasRestantes = totalPerguntas - perguntasRespondidas;
          const tempoEstimadoRestante = perguntasRestantes * 15;
          
          state.progresso = {
            perguntasRespondidas,
            totalPerguntas,
            porcentagem,
            tempoDecorrido,
            tempoEstimadoRestante
          };
        });
      },
      
      // Set Carregando
      setCarregando: (carregando) => {
        set({ carregando });
      },
      
      // Set Erro
      setErro: (erro) => {
        set({ erro });
      },
      
      // Limpar Estado
      limparEstado: () => {
        set(estadoInicial);
      }
    })),
    {
      name: 'sessao-adaptativa-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Salvar apenas dados essenciais no localStorage
        sessaoId: state.sessaoId,
        questionarioId: state.questionarioId,
        usuarioId: state.usuarioId,
        status: state.status,
        iniciadaEm: state.iniciadaEm,
        perguntasRespondidas: state.perguntasRespondidas,
        respostas: state.respostas,
        nivelAlerta: state.nivelAlerta
      })
    }
  )
);

// ==============================================
// SELECTORS (HOOKS CUSTOMIZADOS)
// ==============================================

/**
 * Hook para obter status da sessão
 */
export const useStatusSessao = () => {
  return useSessaoAdaptativaStore((state) => state.status);
};

/**
 * Hook para obter pergunta atual
 */
export const usePerguntaAtual = () => {
  return useSessaoAdaptativaStore((state) => state.perguntaAtual);
};

/**
 * Hook para obter progresso
 */
export const useProgresso = () => {
  return useSessaoAdaptativaStore((state) => state.progresso);
};

/**
 * Hook para obter nível de alerta
 */
export const useNivelAlerta = () => {
  return useSessaoAdaptativaStore((state) => state.nivelAlerta);
};

/**
 * Hook para obter alertas ativos
 */
export const useAlertasAtivos = () => {
  return useSessaoAdaptativaStore((state) => state.alertasAtivos);
};

/**
 * Hook para obter estado de carregamento
 */
export const useCarregando = () => {
  return useSessaoAdaptativaStore((state) => state.carregando);
};

/**
 * Hook para obter erro
 */
export const useErro = () => {
  return useSessaoAdaptativaStore((state) => state.erro);
};

// ==============================================
// EXPORT
// ==============================================

export default useSessaoAdaptativaStore;
