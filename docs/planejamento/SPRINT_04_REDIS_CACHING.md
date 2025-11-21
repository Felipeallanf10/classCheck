# 🚀 SPRINT 4: Cache Distribuído com Redis

**Branch**: `feature/redis-caching`  
**Prioridade**: 🟢 BAIXA (Opcional)  
**Esforço**: 8-10 horas  
**Prazo**: Semana 4

---

## 🎯 Objetivos

- ✅ Configurar Upstash Redis (free tier)
- ✅ Implementar `redis-cache.ts`
- ✅ Migrar cache LRU em memória para Redis
- ✅ Estratégia de invalidação automática
- ✅ Melhorar performance de relatórios em 40-60%

---

## 📋 Tarefas

### 1. Setup Upstash Redis

1. Acessar [upstash.com](https://upstash.com) e criar conta
2. Criar novo database Redis
   - Selecionar região mais próxima (us-east-1 ou sa-east-1)
   - Free tier: 10.000 comandos/dia
3. Copiar `REDIS_URL` e `REDIS_TOKEN`

### 2. Instalar Dependência

```bash
npm install @upstash/redis
```

### 3. Criar `src/lib/cache/redis-cache.ts`

```typescript
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300 // 5 minutos padrão
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      console.log(`[Cache] HIT: ${key}`);
      return cached as T;
    }
  } catch (error) {
    console.error(`[Cache] Erro ao buscar ${key}:`, error);
  }
  
  console.log(`[Cache] MISS: ${key}`);
  const data = await fetcher();
  
  try {
    await redis.set(key, data, { ex: ttl });
  } catch (error) {
    console.error(`[Cache] Erro ao salvar ${key}:`, error);
  }
  
  return data;
}

export async function invalidarCache(keys: string[]): Promise<void> {
  try {
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Cache] Invalidados: ${keys.join(', ')}`);
    }
  } catch (error) {
    console.error('[Cache] Erro ao invalidar:', error);
  }
}

export async function invalidarPorPrefixo(prefixo: string): Promise<void> {
  try {
    const keys = await redis.keys(`${prefixo}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Cache] Invalidados ${keys.length} keys com prefixo ${prefixo}`);
    }
  } catch (error) {
    console.error('[Cache] Erro ao invalidar por prefixo:', error);
  }
}

export async function limparCache(): Promise<void> {
  try {
    await redis.flushdb();
    console.log('[Cache] Cache completo limpo');
  } catch (error) {
    console.error('[Cache] Erro ao limpar cache:', error);
  }
}
```

### 4. Migrar API para usar Redis

```typescript
// src/app/api/relatorios/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCached } from '@/lib/cache/redis-cache';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth();
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || 'mes';
    
    const cacheKey = `relatorios:${usuario.id}:${periodo}`;
    
    const dados = await getCached(
      cacheKey,
      async () => {
        // Query Prisma original
        return await prisma.sessaoAdaptativa.findMany({
          where: {
            usuarioId: usuario.id,
            status: 'COMPLETA',
          },
          include: {
            respostas: {
              select: {
                categoria: true,
                valorNormalizado: true,
                respondidoEm: true,
              },
            },
          },
          orderBy: { iniciadoEm: 'desc' },
          take: 50,
        });
      },
      300 // 5 minutos
    );
    
    return NextResponse.json({ sucesso: true, dados });
  } catch (erro) {
    console.error('[API] Erro:', erro);
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
```

### 5. Implementar Invalidação Automática

```typescript
// src/app/api/sessoes/[id]/resposta/route.ts
import { invalidarCache, invalidarPorPrefixo } from '@/lib/cache/redis-cache';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ... lógica existente de salvar resposta ...
    
    await prisma.respostaSocioemocional.create({
      data: { /* ... */ },
    });
    
    // Invalidar caches relacionados
    await invalidarCache([
      `relatorios:${usuarioId}:mes`,
      `relatorios:${usuarioId}:semana`,
      `metricas:usuario:${usuarioId}`,
    ]);
    
    // Se resposta impacta turma, invalidar dashboard professor
    if (turmaId) {
      await invalidarCache([
        `dashboard:turma:${turmaId}:mes`,
        `dashboard:turma:${turmaId}:semana`,
      ]);
    }
    
    return NextResponse.json({ sucesso: true });
  } catch (erro) {
    console.error('[API] Erro:', erro);
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
```

### 6. Configurar Variáveis de Ambiente

```bash
# .env.local
REDIS_URL="https://your-endpoint.upstash.io"
REDIS_TOKEN="your-token-here"

# Vercel (via dashboard ou CLI)
vercel env add REDIS_URL production
vercel env add REDIS_TOKEN production
```

### 7. Criar Rota Admin para Limpar Cache

```typescript
// src/app/api/admin/cache/route.ts
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { limparCache } from '@/lib/cache/redis-cache';

export async function DELETE() {
  try {
    const usuario = await requireAuth();
    
    if (usuario.role !== 'ADMIN') {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 });
    }
    
    await limparCache();
    
    return NextResponse.json({ 
      sucesso: true, 
      mensagem: 'Cache limpo com sucesso' 
    });
  } catch (erro) {
    console.error('[API] Erro ao limpar cache:', erro);
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
```

---

## ✅ Checklist de Validação

- [ ] Redis conectado (`redis.ping()` retorna "PONG")
- [ ] Cache hit funciona (segunda chamada mais rápida)
- [ ] TTL respeitado (cache expira após tempo configurado)
- [ ] Invalidação funciona (cache limpo após nova resposta)
- [ ] Performance melhorada (comparar tempo antes/depois)
- [ ] Logs de cache aparecem no console
- [ ] Variáveis configuradas no Vercel
- [ ] Deploy em produção funciona
- [ ] Rota admin de limpeza funcional

---

## 🔧 Comandos Git

```bash
git checkout develop
git pull origin develop
git checkout -b feature/redis-caching

npm install @upstash/redis

# Criar arquivos acima

npm run dev
# Testar cache hit/miss no console

git add .
git commit -m "feat: implementar cache distribuído com Upstash Redis

- Adicionar dependência @upstash/redis
- Criar redis-cache.ts com getCached e invalidarCache
- Migrar cache LRU em memória para Redis distribuído
- Implementar invalidação automática em POST/PUT/DELETE
- Adicionar invalidação por prefixo para limpeza em lote
- Configurar variáveis REDIS_URL e REDIS_TOKEN
- Atualizar APIs de relatórios para usar Redis
- Otimizar TTL por tipo de dado (5min relatórios, 10min estáticos)
- Adicionar logs de cache hit/miss para monitoramento
- Criar rota admin para limpar cache manualmente
- Testar performance: -40% tempo de resposta em relatórios

Melhora esperada: 2s → 1.2s em relatórios com cache hit"

git push origin feature/redis-caching
```

---

## 📊 Benchmarks Esperados

**Antes (sem cache)**:
- Relatório completo: ~2000ms
- Dashboard professor: ~1500ms
- Evolução temporal: ~800ms

**Depois (com cache hit)**:
- Relatório completo: ~800ms (60% mais rápido)
- Dashboard professor: ~600ms (60% mais rápido)
- Evolução temporal: ~300ms (62% mais rápido)

---

**Próximo**: `SPRINT_05_QUESTIONARIOS_CONTEXTUAIS.md`
