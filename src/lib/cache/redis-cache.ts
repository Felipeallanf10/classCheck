import { Redis } from '@upstash/redis';

// Inicializar cliente Redis do Upstash
// Em desenvolvimento, variáveis podem não estar configuradas (fallback para cache em memória)
let redis: Redis | null = null;

try {
  if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
    redis = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    });
    console.log('[Cache] Redis configurado com sucesso');
  } else {
    console.warn('[Cache] Redis não configurado - usando fallback em memória');
  }
} catch (error) {
  console.error('[Cache] Erro ao configurar Redis:', error);
}

// Cache em memória como fallback
const memoryCache = new Map<string, { data: any; expires: number }>();

/**
 * Buscar dados do cache ou executar fetcher
 * @param key - Chave única do cache
 * @param fetcher - Função assíncrona para buscar dados
 * @param ttl - Tempo de vida em segundos (padrão: 300s = 5min)
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  // Tentar Redis primeiro
  if (redis) {
    try {
      const cached = await redis.get(key);
      if (cached !== null) {
        console.log(`[Cache] HIT (Redis): ${key}`);
        return cached as T;
      }
    } catch (error) {
      console.error(`[Cache] Erro ao buscar do Redis ${key}:`, error);
    }
  } else {
    // Fallback: cache em memória
    const cached = memoryCache.get(key);
    if (cached && cached.expires > Date.now()) {
      console.log(`[Cache] HIT (Memory): ${key}`);
      return cached.data as T;
    }
  }

  // Cache miss - buscar dados
  console.log(`[Cache] MISS: ${key}`);
  const data = await fetcher();

  // Salvar no cache
  if (redis) {
    try {
      await redis.set(key, data, { ex: ttl });
      console.log(`[Cache] SET (Redis): ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      console.error(`[Cache] Erro ao salvar no Redis ${key}:`, error);
    }
  } else {
    // Fallback: salvar em memória
    memoryCache.set(key, {
      data,
      expires: Date.now() + ttl * 1000,
    });
    console.log(`[Cache] SET (Memory): ${key} (TTL: ${ttl}s)`);
  }

  return data;
}

/**
 * Invalidar cache de chaves específicas
 * @param keys - Array de chaves a invalidar
 */
export async function invalidarCache(keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  if (redis) {
    try {
      await redis.del(...keys);
      console.log(`[Cache] Invalidados (Redis): ${keys.join(', ')}`);
    } catch (error) {
      console.error('[Cache] Erro ao invalidar no Redis:', error);
    }
  } else {
    // Fallback: invalidar em memória
    keys.forEach((key) => memoryCache.delete(key));
    console.log(`[Cache] Invalidados (Memory): ${keys.join(', ')}`);
  }
}

/**
 * Invalidar cache por prefixo
 * @param prefixo - Prefixo das chaves (ex: "relatorios:")
 */
export async function invalidarPorPrefixo(prefixo: string): Promise<void> {
  if (redis) {
    try {
      const keys = await redis.keys(`${prefixo}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(
          `[Cache] Invalidados ${keys.length} keys com prefixo ${prefixo}`
        );
      }
    } catch (error) {
      console.error('[Cache] Erro ao invalidar por prefixo:', error);
    }
  } else {
    // Fallback: invalidar em memória
    let count = 0;
    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefixo)) {
        memoryCache.delete(key);
        count++;
      }
    }
    console.log(`[Cache] Invalidados ${count} keys com prefixo ${prefixo}`);
  }
}

/**
 * Limpar todo o cache
 * ⚠️ Use com cuidado - apenas em desenvolvimento ou admin
 */
export async function limparCache(): Promise<void> {
  if (redis) {
    try {
      await redis.flushdb();
      console.log('[Cache] Cache completo limpo (Redis)');
    } catch (error) {
      console.error('[Cache] Erro ao limpar cache Redis:', error);
    }
  } else {
    // Fallback: limpar memória
    memoryCache.clear();
    console.log('[Cache] Cache completo limpo (Memory)');
  }
}

/**
 * Verificar conexão com Redis
 * @returns true se conectado
 */
export async function verificarConexao(): Promise<boolean> {
  if (!redis) return false;

  try {
    const pong = await redis.ping();
    console.log('[Cache] Redis ping:', pong);
    return pong === 'PONG';
  } catch (error) {
    console.error('[Cache] Erro ao pingar Redis:', error);
    return false;
  }
}

/**
 * Obter estatísticas do cache (apenas Redis)
 */
export async function estatisticasCache(): Promise<{
  tipo: 'redis' | 'memory';
  keysTotal?: number;
  memoriaUsada?: string;
}> {
  if (redis) {
    try {
      const keys = await redis.keys('*');
      return {
        tipo: 'redis',
        keysTotal: keys.length,
      };
    } catch (error) {
      console.error('[Cache] Erro ao obter estatísticas:', error);
      return { tipo: 'redis' };
    }
  } else {
    return {
      tipo: 'memory',
      keysTotal: memoryCache.size,
    };
  }
}
