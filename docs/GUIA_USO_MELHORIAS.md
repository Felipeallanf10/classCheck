# 🚀 Guia de Uso - Melhorias do Sistema Adaptativo

Este guia mostra como usar as novas funcionalidades implementadas na versão 3.0 do sistema adaptativo.

---

## 📑 Índice

1. [IRT Refinado](#irt-refinado)
2. [Critérios de Parada](#criterios-de-parada)
3. [Rate Limiting](#rate-limiting)
4. [Cache e Performance](#cache-e-performance)
5. [Componentes de UI](#componentes-de-ui)
6. [Testes E2E](#testes-e2e)

---

## 🧮 IRT Refinado

### Estimação Robusta de Theta

```typescript
import {
  estimarThetaRobusta,
  detectarConvergenciaPrecoce,
  calcularSEM,
  type RespostaIRT
} from '@/lib/adaptive/irt-refinado';

// Preparar respostas
const respostas: RespostaIRT[] = sessao.respostas.map(r => ({
  valorNormalizado: r.valorNormalizado,
  configuracaoIRT: {
    discriminacao: r.pergunta.discriminacao || 1.0,
    dificuldade: r.pergunta.dificuldade || 0.0,
    acerto: r.pergunta.acerto || 0.0
  },
  tempoResposta: r.tempoResposta
}));

// Estimar theta
const resultado = estimarThetaRobusta(respostas, sessao.thetaEstimado);

console.log({
  theta: resultado.theta,
  erro: resultado.erro,
  convergiu: resultado.convergiu,
  metodo: resultado.metodo, // 'MLE' ou 'EAP'
  confianca: resultado.confianca,
  estavel: resultado.estavel
});

// Atualizar sessão
await prisma.sessaoAdaptativa.update({
  where: { id: sessaoId },
  data: {
    thetaEstimado: resultado.theta,
    erroEstimacao: resultado.erro
  }
});
```

### Detecção de Convergência Precoce

```typescript
// Manter histórico de estimações
const historicoEstimacoes = [];

// A cada nova resposta
historicoEstimacoes.push(resultado);

// Verificar se já convergiu
if (detectarConvergenciaPrecoce(historicoEstimacoes)) {
  console.log('✅ Theta convergiu! Pode finalizar.');
  // Não precisa de mais perguntas
}
```

### Calcular SEM

```typescript
const sem = calcularSEM(respostas, resultado.theta);

if (sem < 0.30) {
  console.log('✅ Precisão adequada atingida');
}
```

---

## 🛑 Critérios de Parada

### Uso Básico

```typescript
import {
  verificarCriteriosParada,
  criarEstadoSessao,
  CRITERIOS_PADRAO,
  formatarResultadoParada
} from '@/lib/adaptive/criterios-parada-avancados';

// Criar estado da sessão
const estado = criarEstadoSessao(
  sessao.respostas.length,
  sessao.criadoEm.getTime(),
  historicoEstimacoes,
  verificarConsistencia(sessao.respostas)
);

// Verificar critérios
const resultado = verificarCriteriosParada(estado, CRITERIOS_PADRAO);

// Log formatado
console.log(formatarResultadoParada(resultado));

// Decidir ação
if (resultado.deveparar) {
  await finalizarSessao(sessaoId, resultado.motivo);
} else {
  await buscarProximaPergunta(sessaoId);
}
```

### Perfis Diferentes

```typescript
import {
  CRITERIOS_TRIAGEM,     // Rápido: 3-10 perguntas, SEM < 0.40
  CRITERIOS_PADRAO,      // Balanceado: 5-20 perguntas, SEM < 0.30
  CRITERIOS_APROFUNDADO  // Rigoroso: 8-30 perguntas, SEM < 0.20
} from '@/lib/adaptive/criterios-parada-avancados';

// Escolher baseado no tipo de questionário
const criterios = questionario.tipo === 'TRIAGEM'
  ? CRITERIOS_TRIAGEM
  : questionario.tipo === 'COMPLETO'
    ? CRITERIOS_APROFUNDADO
    : CRITERIOS_PADRAO;

const resultado = verificarCriteriosParada(estado, criterios);
```

### Critérios Customizados

```typescript
const criteriosCustom = {
  minimoPerguntas: 7,
  maximoPerguntas: 15,
  tempoMaximoSegundos: 600, // 10 minutos
  semAlvo: 0.25,
  limiteConvergencia: 0.08,
  janelasConvergencia: 4,
  confiancaMinima: 0.80,
  estabilidadeMinima: true
};

const resultado = verificarCriteriosParada(estado, criteriosCustom);
```

---

## 🛡️ Rate Limiting

### Uso Automático no Middleware

O rate limiting é aplicado automaticamente via middleware:

```typescript
// src/middleware.ts
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';

// Já configurado, não precisa fazer nada!
```

### Aplicar em API Route Específica

```typescript
import { withRateLimit } from '@/lib/middleware/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return withRateLimit(req, async () => {
    // Sua lógica aqui
    const data = await req.json();
    // ...
    return NextResponse.json({ success: true });
  });
}
```

### Verificar Status do Rate Limit

Os headers de resposta incluem:

```http
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1699123456789
```

Cliente pode usar para exibir feedback:

```typescript
const response = await fetch('/api/sessoes/iniciar', { method: 'POST' });

const remaining = response.headers.get('X-RateLimit-Remaining');
const reset = response.headers.get('X-RateLimit-Reset');

if (response.status === 429) {
  const data = await response.json();
  alert(`Limite excedido. Tente em ${data.retryAfter}s`);
}
```

---

## ⚡ Cache e Performance

### Cache de Perguntas

```typescript
import { buscarPerguntaComCache } from '@/lib/performance/cache-otimizacoes';

const pergunta = await buscarPerguntaComCache(perguntaId, async () => {
  return await prisma.perguntaSocioemocional.findUnique({
    where: { id: perguntaId },
    include: { opcoes: true }
  });
});
```

### Batch Loading

```typescript
import { buscarPerguntasEmLote } from '@/lib/performance/cache-otimizacoes';

const perguntasMap = await buscarPerguntasEmLote(
  ['id1', 'id2', 'id3'],
  async (ids) => {
    return await prisma.perguntaSocioemocional.findMany({
      where: { id: { in: ids } }
    });
  }
);

const pergunta1 = perguntasMap.get('id1');
```

### Cálculo de Fisher com Cache

```typescript
import { calcularInformacaoComCache } from '@/lib/performance/cache-otimizacoes';

const informacao = calcularInformacaoComCache(
  theta,
  pergunta.discriminacao,
  pergunta.dificuldade,
  pergunta.acerto || 0
);
```

### Queries Otimizadas

```typescript
import { queryOtimizada } from '@/lib/performance/cache-otimizacoes';

// Buscar apenas campos necessários
const sessao = await prisma.sessaoAdaptativa.findUnique({
  where: { id: sessaoId },
  ...queryOtimizada.sessaoIRT
});

const pergunta = await prisma.perguntaSocioemocional.findUnique({
  where: { id: perguntaId },
  ...queryOtimizada.perguntaMinima
});
```

### Estatísticas de Cache

```typescript
import { obterEstatisticasCache } from '@/lib/performance/cache-otimizacoes';

const stats = obterEstatisticasCache();
console.log({
  perguntas: stats.perguntas, // Entradas em cache
  fisher: stats.fisher,        // Cálculos cacheados
  limparEm: stats.limparEm     // TTL em ms
});
```

---

## 🎨 Componentes de UI

### Loading States

```tsx
import { LoadingSpinner, SkeletonPergunta } from '@/components/feedback/FeedbackComponents';

// Durante fetch
{isLoading && <LoadingSpinner size="md" text="Carregando pergunta..." />}

// Skeleton durante transição
{isTransitioning && <SkeletonPergunta />}
```

### Progresso Adaptativo

```tsx
import { ProgressoAdaptativo } from '@/components/feedback/FeedbackComponents';

<ProgressoAdaptativo
  numeroResposta={sessao.respostas.length}
  minimoEstimado={5}
  maximoEstimado={20}
  sem={sessao.erroEstimacao}
  confianca={sessao.confianca}
/>
```

### Métricas IRT

```tsx
import { MetricasIRT } from '@/components/feedback/FeedbackComponents';

<MetricasIRT
  theta={sessao.thetaEstimado}
  sem={sessao.erroEstimacao}
  confianca={sessao.confianca}
  mostrarDetalhes={true}
/>
```

### Mensagens de Erro

```tsx
import { ErroAmigavel } from '@/components/feedback/FeedbackComponents';

{erro && (
  <ErroAmigavel
    tipo={erro.tipo} // 'rede' | 'servidor' | 'validacao' | 'timeout'
    mensagem={erro.mensagem}
    onTentarNovamente={() => refetch()}
  />
)}
```

### Feedback de Sucesso

```tsx
import { FeedbackSucesso } from '@/components/feedback/FeedbackComponents';

{sucesso && (
  <FeedbackSucesso
    titulo="Resposta registrada!"
    mensagem="Calculando próxima pergunta..."
    onContinuar={() => proximaPergunta()}
  />
)}
```

### Animações

```tsx
import { FadeIn } from '@/components/feedback/FeedbackComponents';

<FadeIn delay={100}>
  <PerguntaCard pergunta={pergunta} />
</FadeIn>

<FadeIn delay={200}>
  <OpcoesResposta opcoes={pergunta.opcoes} />
</FadeIn>
```

---

## 🧪 Testes E2E

### Executar Testes

```bash
# Todos os testes
npm run test:e2e

# Com interface visual
npm run test:e2e:ui

# Com navegador visível
npm run test:e2e:headed

# Debug (passo a passo)
npm run test:e2e:debug

# Ver relatório
npm run test:e2e:report
```

### Executar Teste Específico

```bash
# Apenas sistema adaptativo
npx playwright test sistema-adaptativo

# Apenas APIs
npx playwright test api-sessoes

# Por arquivo e descrição
npx playwright test sistema-adaptativo -g "deve adaptar perguntas"
```

### Configurar Ambiente de Teste

```env
# .env.test
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@localhost:5432/classcheck_test
```

### Escrever Novos Testes

```typescript
// e2e/meu-teste.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Minha Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
    await page.goto('/');
  });

  test('deve fazer algo', async ({ page }) => {
    // Arrange
    await page.click('button:has-text("Iniciar")');

    // Act
    await page.fill('input[name="resposta"]', 'valor');
    await page.click('button[type="submit"]');

    // Assert
    await expect(page.locator('text=Sucesso')).toBeVisible();
  });
});
```

---

## 📊 Monitoramento e Debug

### Logs Estruturados

```typescript
console.log('[Sistema Adaptativo] Iniciando seleção', {
  sessaoId,
  theta: sessao.thetaEstimado,
  respostas: sessao.respostas.length
});
```

### Métricas de Performance

```typescript
import { performance } from 'perf_hooks';

const inicio = performance.now();

// Operação
const resultado = await determinarProximaPergunta(sessaoId);

const duracao = performance.now() - inicio;
console.log(`[Perf] Próxima pergunta: ${duracao.toFixed(2)}ms`);
```

### Debug de IRT

```typescript
// Ativar logs detalhados
process.env.DEBUG_IRT = 'true';

// Logs automáticos aparecerão
const resultado = estimarThetaRobusta(respostas);
// [IRT] Iteração 1: theta=0.23, erro=0.15
// [IRT] Iteração 2: theta=0.31, erro=0.08
// ...
```

---

## 🚀 Deploy

### Checklist Pré-Deploy

- [ ] Rodar testes unitários: `npm test`
- [ ] Rodar testes E2E: `npm run test:e2e`
- [ ] Build sem erros: `npm run build`
- [ ] Migrations aplicadas: `npm run db:migrate`
- [ ] Seeds executados: `npm run db:seed:adaptativo`
- [ ] Variáveis de ambiente configuradas

### Variáveis de Produção

```env
# Rate Limiting
RATE_LIMIT_MAX_TOKENS=60
RATE_LIMIT_REFILL_RATE=5

# Cache
CACHE_TTL_SECONDS=300
REDIS_URL=redis://...  # Recomendado para produção

# Performance
ENABLE_CACHE=true
ENABLE_QUERY_OPTIMIZATION=true

# Monitoramento
SENTRY_DSN=https://...
DATADOG_API_KEY=...
```

---

## 🆘 Troubleshooting

### Cache não está funcionando

```typescript
// Limpar cache manualmente
import { limparCacheExpirado } from '@/lib/performance/cache-otimizacoes';
limparCacheExpirado();
```

### Rate limiting muito agressivo

```typescript
// Ajustar limites em src/lib/middleware/rate-limit.ts
const RATE_LIMITS = {
  sessao: {
    maxTokens: 50,  // Aumentar
    refillRate: 3,  // Aumentar
    costPerRequest: 1
  }
};
```

### Testes E2E falhando

```bash
# Reinstalar navegadores
npx playwright install

# Rodar com --headed para ver o que acontece
npm run test:e2e:headed

# Debug específico
npx playwright test --debug nome-do-teste
```

### Theta não converge

```typescript
// Verificar qualidade das respostas
const estavel = verificarEstabilidade(respostas, theta);
if (!estavel) {
  console.warn('Respostas inconsistentes detectadas');
  // Usar EAP ao invés de MLE
  const resultado = estimarThetaEAP(respostas);
}
```

---

## 📚 Mais Recursos

- [Documentação Completa](./MELHORIAS_SISTEMA_ADAPTATIVO_V3.md)
- [Guia de IRT](../docs/sistema-adaptativo/SISTEMA_ADAPTATIVO_COMPLETO.md)
- [API Reference](../docs/api-correções/API_ROUTES_COMPLETO.md)
- [Playwright Docs](https://playwright.dev/)

---

**Dúvidas?** Abra uma issue ou consulte a documentação completa.
