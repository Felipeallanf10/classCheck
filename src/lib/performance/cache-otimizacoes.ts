/**
 * Otimizações de Performance - Sistema Adaptativo
 * 
 * Implementa:
 * - Cache de perguntas frequentes
 * - Memoization de cálculos IRT
 * - Lazy loading de dados
 * - Compressão de respostas
 */

// Cache em memória para perguntas (pode ser substituído por Redis em produção)
const perguntasCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Cache LRU simples para resultados de cálculos IRT
 */
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Mover para o final (mais recente)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    // Se já existe, remover para reordenar
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Se atingiu limite, remover o mais antigo
    else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Cache para cálculos de informação de Fisher
const fisherCache = new LRUCache<string, number>(5000);

/**
 * Busca pergunta com cache
 */
export async function buscarPerguntaComCache(
  perguntaId: string,
  buscarFn: () => Promise<any>
): Promise<any> {
  const cacheKey = `pergunta:${perguntaId}`;
  const cached = perguntasCache.get(cacheKey);

  // Verificar se cache é válido
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Buscar do banco
  const data = await buscarFn();

  // Salvar no cache
  perguntasCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });

  return data;
}

/**
 * Calcula informação de Fisher com memoization
 */
export function calcularInformacaoComCache(
  theta: number,
  discriminacao: number,
  dificuldade: number,
  acerto: number
): number {
  // Arredondar theta para reduzir variações do cache
  const thetaRounded = Math.round(theta * 100) / 100;

  // Gerar chave única
  const key = `${thetaRounded}:${discriminacao}:${dificuldade}:${acerto}`;

  // Verificar cache
  const cached = fisherCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  // Calcular
  const p =
    acerto +
    (1 - acerto) / (1 + Math.exp(-discriminacao * (thetaRounded - dificuldade)));
  const q = 1 - p;

  const numerador = Math.pow(discriminacao, 2) * Math.pow(p - acerto, 2);
  const denominador = p * q * Math.pow(1 - acerto, 2);

  const informacao = denominador > 1e-10 ? numerador / denominador : 0;

  // Salvar no cache
  fisherCache.set(key, informacao);

  return informacao;
}

/**
 * Limpa cache expirado
 */
export function limparCacheExpirado(): void {
  const now = Date.now();

  for (const [key, value] of perguntasCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      perguntasCache.delete(key);
    }
  }
}

/**
 * Estatísticas de cache
 */
export function obterEstatisticasCache(): {
  perguntas: number;
  fisher: number;
  limparEm: number;
} {
  return {
    perguntas: perguntasCache.size,
    fisher: fisherCache.size(),
    limparEm: CACHE_TTL
  };
}

/**
 * Query builder otimizado para Prisma
 */
export const queryOtimizada = {
  /**
   * Selecionar apenas campos necessários de perguntas
   */
  perguntaMinima: {
    select: {
      id: true,
      titulo: true,
      texto: true,
      tipo: true,
      categoria: true,
      dominio: true,
      dificuldade: true,
      discriminacao: true,
      prioridade: true,
      opcoes: true
    }
  },

  /**
   * Selecionar apenas campos necessários de respostas
   */
  respostaMinima: {
    select: {
      id: true,
      valor: true,
      valorNormalizado: true,
      tempoResposta: true,
      perguntaId: true,
      categoria: true,
      dominio: true,
      pergunta: {
        select: {
          discriminacao: true,
          dificuldade: true,
          configuracaoIRT: true
        }
      }
    }
  },

  /**
   * Selecionar sessão com dados IRT mínimos
   */
  sessaoIRT: {
    select: {
      id: true,
      thetaEstimado: true,
      erroEstimacao: true,
      respostas: {
        select: {
          id: true,
          valorNormalizado: true,
          pergunta: {
            select: {
              discriminacao: true,
              dificuldade: true,
              configuracaoIRT: true
            }
          },
          perguntaBanco: {
            select: {
              parametroA: true,
              parametroB: true,
              parametroC: true
            }
          }
        }
      }
    }
  }
};

/**
 * Batch loading de perguntas
 */
export async function buscarPerguntasEmLote(
  perguntaIds: string[],
  buscarFn: (ids: string[]) => Promise<any[]>
): Promise<Map<string, any>> {
  const resultado = new Map<string, any>();
  const idsParaBuscar: string[] = [];

  // Verificar cache primeiro
  for (const id of perguntaIds) {
    const cacheKey = `pergunta:${id}`;
    const cached = perguntasCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      resultado.set(id, cached.data);
    } else {
      idsParaBuscar.push(id);
    }
  }

  // Buscar os que não estão em cache
  if (idsParaBuscar.length > 0) {
    const perguntas = await buscarFn(idsParaBuscar);

    for (const pergunta of perguntas) {
      resultado.set(pergunta.id, pergunta);

      // Atualizar cache
      perguntasCache.set(`pergunta:${pergunta.id}`, {
        data: pergunta,
        timestamp: Date.now()
      });
    }
  }

  return resultado;
}

/**
 * Comprime dados de resposta para armazenamento eficiente
 */
export function comprimirRespostas(respostas: any[]): string {
  // Extrair apenas dados essenciais
  const compressed = respostas.map((r) => ({
    p: r.perguntaId,
    v: r.valorNormalizado,
    t: r.tempoResposta,
    d: r.pergunta?.dificuldade || 0,
    a: r.pergunta?.discriminacao || 1
  }));

  return JSON.stringify(compressed);
}

/**
 * Descomprime dados de resposta
 */
export function descomprimirRespostas(compressed: string): any[] {
  const data = JSON.parse(compressed);

  return data.map((r: any) => ({
    perguntaId: r.p,
    valorNormalizado: r.v,
    tempoResposta: r.t,
    pergunta: {
      dificuldade: r.d,
      discriminacao: r.a
    }
  }));
}

/**
 * Debounce para funções assíncronas
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    return new Promise<ReturnType<T>>((resolve, reject) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, wait);
    });
  }) as T;
}

/**
 * Throttle para limitação de execução
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean = false;

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

// Executar limpeza de cache a cada 10 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(limparCacheExpirado, 10 * 60 * 1000);
}
