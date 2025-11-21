/**
 * Rate Limiting Middleware
 * 
 * Implementa proteção contra abuso de API usando token bucket algorithm
 * com suporte a limites por IP, usuário e rota
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Estrutura de dados para rate limiting
interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

// Armazenamento em memória (para produção, usar Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configurações de rate limit por tipo de rota
export interface RateLimitConfig {
  maxTokens: number; // Máximo de tokens no bucket
  refillRate: number; // Tokens adicionados por segundo
  costPerRequest: number; // Tokens consumidos por requisição
}

// Configurações padrão
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Rotas de autenticação - mais restritivo
  auth: {
    maxTokens: 10,
    refillRate: 1, // 1 token/segundo = 60/min
    costPerRequest: 1
  },

  // Rotas de sessão adaptativa - moderado
  sessao: {
    maxTokens: 30,
    refillRate: 2, // 2 tokens/segundo = 120/min
    costPerRequest: 1
  },

  // Rotas de resposta - mais permissivo
  resposta: {
    maxTokens: 50,
    refillRate: 5, // 5 tokens/segundo = 300/min
    costPerRequest: 1
  },

  // Rotas de leitura - muito permissivo
  read: {
    maxTokens: 100,
    refillRate: 10, // 10 tokens/segundo = 600/min
    costPerRequest: 1
  },

  // Default
  default: {
    maxTokens: 60,
    refillRate: 5,
    costPerRequest: 1
  }
};

/**
 * Determina qual configuração de rate limit usar baseado na rota
 */
function getConfigForRoute(pathname: string): RateLimitConfig {
  if (pathname.includes('/api/auth')) return RATE_LIMITS.auth;
  if (pathname.includes('/api/sessoes') && pathname.includes('/resposta'))
    return RATE_LIMITS.resposta;
  if (pathname.includes('/api/sessoes')) return RATE_LIMITS.sessao;
  if (pathname.match(/\/api\/.+\/[a-f0-9-]+$/)) return RATE_LIMITS.read; // GET por ID

  return RATE_LIMITS.default;
}

/**
 * Gera chave única para rate limiting
 * Prioriza usuário logado, fallback para IP
 */
async function getRateLimitKey(req: NextRequest): Promise<string> {
  const pathname = req.nextUrl.pathname;

  try {
    // Tentar obter usuário autenticado
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token?.sub) {
      return `user:${token.sub}:${pathname}`;
    }
  } catch (error) {
    console.error('[RateLimit] Erro ao obter token:', error);
  }

  // Fallback para IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown';

  return `ip:${ip}:${pathname}`;
}

/**
 * Token Bucket Algorithm
 */
function checkRateLimit(
  key: string,
  config: RateLimitConfig
): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  let entry = rateLimitStore.get(key);

  // Inicializar se não existe
  if (!entry) {
    entry = {
      tokens: config.maxTokens,
      lastRefill: now
    };
    rateLimitStore.set(key, entry);
  }

  // Reabastecer tokens
  const timePassed = (now - entry.lastRefill) / 1000; // segundos
  const tokensToAdd = timePassed * config.refillRate;
  entry.tokens = Math.min(config.maxTokens, entry.tokens + tokensToAdd);
  entry.lastRefill = now;

  // Verificar se tem tokens suficientes
  const allowed = entry.tokens >= config.costPerRequest;

  if (allowed) {
    entry.tokens -= config.costPerRequest;
  }

  // Calcular quando resetará
  const tokensNeeded = config.costPerRequest - entry.tokens;
  const resetIn = Math.max(0, tokensNeeded / config.refillRate);

  return {
    allowed,
    remaining: Math.floor(entry.tokens),
    resetIn: Math.ceil(resetIn)
  };
}

/**
 * Middleware de rate limiting
 */
export async function rateLimitMiddleware(
  req: NextRequest
): Promise<NextResponse | null> {
  const pathname = req.nextUrl.pathname;

  // Ignorar rotas públicas
  if (
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/cadastro') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg')
  ) {
    return null; // Não aplicar rate limit
  }

  // Obter configuração e chave
  const config = getConfigForRoute(pathname);
  const key = await getRateLimitKey(req);

  // Verificar rate limit
  const { allowed, remaining, resetIn } = checkRateLimit(key, config);

  // Criar response com headers de rate limit
  const response = allowed
    ? null // Continuar para próximo handler
    : NextResponse.json(
        {
          error: 'Too Many Requests',
          message: `Rate limit excedido. Tente novamente em ${resetIn}s.`,
          retryAfter: resetIn
        },
        { status: 429 }
      );

  // Adicionar headers informativos
  const headers = new Headers(response?.headers);
  headers.set('X-RateLimit-Limit', config.maxTokens.toString());
  headers.set('X-RateLimit-Remaining', remaining.toString());
  headers.set('X-RateLimit-Reset', (Date.now() + resetIn * 1000).toString());

  if (response) {
    return new NextResponse(response.body, {
      status: response.status,
      headers
    });
  }

  return null;
}

/**
 * Limpar entradas antigas (executar periodicamente)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const expirationTime = 60 * 60 * 1000; // 1 hora

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.lastRefill > expirationTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Executar cleanup a cada 10 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000);
}

/**
 * Helper para aplicar rate limit em API routes
 */
export async function withRateLimit(
  req: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const limitResult = await rateLimitMiddleware(req);

  if (limitResult) {
    return limitResult; // Rate limit excedido
  }

  return handler(); // Continuar com handler
}

/**
 * Decorator para aplicar rate limit em funções
 */
export function RateLimit(config?: Partial<RateLimitConfig>) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req = args[0] as NextRequest;
      const limitResult = await rateLimitMiddleware(req);

      if (limitResult) {
        return limitResult;
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
