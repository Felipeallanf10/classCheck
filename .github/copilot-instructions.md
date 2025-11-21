# ClassCheck - AI Copilot Instructions

**Projeto**: ClassCheck - Sistema de Avaliação Socioemocional Adaptativa  
**Versão**: 3.0  
**Stack**: Next.js 15 (App Router) + TypeScript + PostgreSQL (Neon) + Prisma ORM  
**Última Atualização**: 21 de novembro de 2025

---

## 📋 Visão Geral do Projeto

ClassCheck é uma plataforma educacional para avaliação socioemocional de alunos usando questionários adaptativos baseados em **IRT (Item Response Theory)** e **Modelo Circumplex de Emoções**. O sistema oferece dashboards role-based (ALUNO, PROFESSOR, ADMIN), alertas de risco, relatórios visuais e gamificação.

### Objetivos Principais
- Avaliar estado socioemocional de alunos através de questionários clínicos (PHQ-9, GAD-7, WHO-5)
- Adaptar perguntas em tempo real usando IRT/CAT (Computer Adaptive Testing)
- Gerar alertas automáticos para casos de risco (depressão, ansiedade, estresse)
- Fornecer dashboards e relatórios para alunos, professores e administradores
- Gamificar a experiência com XP, níveis e conquistas

---

## 🏗️ Arquitetura e Stack Tecnológico

### Frontend
- **Framework**: Next.js 15 (App Router com Server Components)
- **UI Library**: shadcn/ui + Radix UI
- **Estilos**: Tailwind CSS v4
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **State Management**: Zustand (cliente), TanStack Query (server state)
- **Validação**: Zod
- **Formulários**: React Hook Form

### Backend
- **Runtime**: Next.js 15 Server Actions + API Routes
- **Database**: PostgreSQL (Neon hosted)
- **ORM**: Prisma v6.19
- **Auth**: NextAuth.js v4 (JWT + Google OAuth)
- **Criptografia**: bcryptjs

### Testing
- **Unit**: Vitest
- **E2E**: Playwright
- **Coverage**: >80% (meta)

### DevOps
- **Deploy**: Vercel
- **CI/CD**: GitHub Actions
- **Containers**: Docker + docker-compose (desenvolvimento)
- **Version Control**: Git Flow (main → develop → feature branches)

---

## 🗂️ Estrutura de Pastas

```
classCheck/
├── .github/                     # GitHub Actions, issue templates
├── docs/                        # Documentação técnica e planejamento
│   ├── planejamento/           # Roadmaps, planos de sprint
│   ├── arquitetura/            # Diagramas, decisões arquiteturais
│   ├── guias/                  # Guias de desenvolvimento
│   └── relatorios-gerais/      # Relatórios de progresso
├── prisma/
│   ├── schema.prisma           # Schema do banco (30+ models)
│   ├── migrations/             # Migrações SQL
│   └── seed*.ts                # Seeds (usuários, materias, questionários)
├── public/
│   └── emotions/               # Imagens de emojis/emoções
├── scripts/                     # Scripts CLI (balancear IRT, criar admin)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Grupo de rotas de autenticação
│   │   ├── api/               # API Routes
│   │   ├── admin/             # Dashboard admin
│   │   ├── dashboard/         # Dashboard aluno
│   │   ├── professor/         # Dashboard professor
│   │   ├── relatorios/        # Relatórios visuais
│   │   └── questionario/      # Fluxo de questionários
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── dashboard/         # Componentes de dashboard
│   │   ├── charts/            # Gráficos (Circumplex, Heatmap, Radar)
│   │   └── questionnaire/     # Componentes de questionário
│   ├── lib/
│   │   ├── adaptive/          # Algoritmos IRT e CAT
│   │   ├── validations/       # Schemas Zod
│   │   ├── performance/       # Cache e otimizações
│   │   └── psychometrics/     # Psicometria (Circumplex, escalas)
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand stores
│   └── __tests__/             # Testes unitários e E2E
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 🔑 Conceitos Fundamentais

### 1. Sistema de Roles
O sistema usa **um único modelo `Usuario`** com 3 roles:
- **ALUNO**: Faz questionários, visualiza relatórios pessoais
- **PROFESSOR**: Visualiza agregados de turmas, recebe alertas
- **ADMIN**: Gerencia usuários, materias, questionários

**Auth Helpers** (src/lib/auth.ts):
```typescript
// Buscar usuário autenticado (retorna null se não autenticado)
const usuario = await getAuthenticatedUser();

// Exigir autenticação (redireciona para /login se não autenticado)
const usuario = await requireAuth();

// Proteger Server Action
export const minhaAction = withAuth(async (usuario, data) => { ... });

// Proteger por role
export const adminAction = withRoles(['ADMIN'], async (usuario, data) => { ... });
```

### 2. IRT (Item Response Theory)
Algoritmo adaptativo que estima habilidade (θ - theta) do respondente e seleciona perguntas ideais.

**Arquivos principais**:
- `src/lib/adaptive/irt-refinado.ts`: Cálculo de theta (MLE, EAP, MAP)
- `src/lib/adaptive/proxima-pergunta-service.ts`: Seleção de perguntas
- `src/lib/adaptive/criterios-parada.ts`: Quando finalizar

**Parâmetros IRT (modelo 3PL)**:
```typescript
interface ConfiguracaoIRT {
  discriminacao: number; // a (0.5-2.5) - quão bem diferencia habilidades
  dificuldade: number;   // b (-3 a +3) - nível de dificuldade
  acerto: number;        // c (0-0.3) - probabilidade de chute
}
```

**Fluxo adaptativo**:
1. Inicia com θ = 0 (neutro)
2. Seleciona pergunta com máxima informação em θ
3. Aluno responde
4. Recalcula θ via MLE/EAP
5. Repete até critério de parada (erro < 0.3 ou 20 perguntas)

### 3. Modelo Circumplex de Emoções
Russell's Circumplex Model: emoções em 2 dimensões (valencia × ativação)

**Valencia**: Prazer (-1 negativo, +1 positivo)  
**Ativação**: Energia (-1 baixa, +1 alta)

**Categorias emocionais**:
- Alta Valencia + Alta Ativação = Animado
- Alta Valencia + Baixa Ativação = Calmo
- Baixa Valencia + Alta Ativação = Ansioso
- Baixa Valencia + Baixa Ativação = Triste

**Implementação**: Perguntas armazenam `valencia` e `ativacao`, respostas calculam posição no circumplex.

### 4. Banco de Perguntas Adaptativo
Modelo: `BancoPerguntasAdaptativo` (Prisma)

**Categorias**:
- `HUMOR_GERAL`, `ANSIEDADE`, `DEPRESSAO`, `ESTRESSE`, `AUTOESTIMA`, `SONO`, `RELACIONAMENTOS`

**Tipos de Pergunta** (15 tipos suportados):
- `LIKERT_5`, `LIKERT_7`, `LIKERT_10`
- `ESCALA_VISUAL_ANALOGICA`
- `MULTIPLA_ESCOLHA`, `MULTIPLA_SELECAO`
- `SIM_NAO`, `TEXTO_CURTO`, `TEXTO_LONGO`
- `EMOJI_PICKER`, `SLIDER_NUMERICO`
- `ESCALA_FREQUENCIA`, `ESCALA_INTENSIDADE`
- `DATA`, `HORA`, `RANKING`

### 5. Sessões Adaptativas
Fluxo completo de questionário:

**API Endpoints**:
```typescript
// Iniciar sessão
POST /api/sessoes/iniciar
Body: { questionarioId: string, usuarioId: number, contexto?: string }
Response: { sessaoId, primeiraPergunta }

// Submeter resposta
POST /api/sessoes/[id]/resposta
Body: { perguntaId, valor, tempoResposta }
Response: { proximaPergunta | resultado }

// Obter resultado
GET /api/sessoes/[id]/resultado
Response: { thetaFinal, erro, categorias, alertas }

// Atualizar status
PATCH /api/sessoes/[id]
Body: { status: 'EM_ANDAMENTO' | 'COMPLETA' | 'ABANDONADA' }
```

**Modelos Prisma**:
- `SessaoAdaptativa`: Sessão de questionário
- `RespostaSocioemocional`: Respostas individuais
- `LogAdaptativo`: Auditoria de decisões IRT
- `AlertaSocioemocional`: Alertas gerados automaticamente

---

## 📐 Padrões de Código

### 1. API Routes (App Router)
```typescript
// src/app/api/exemplo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Forçar dinâmico (não pré-renderizar)
export const dynamic = 'force-dynamic';

// Schema de validação
const ExemploSchema = z.object({
  campo: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // Parse e validação
    const body = await request.json();
    const validatedData = ExemploSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { erro: 'Dados inválidos', detalhes: validatedData.error.flatten() },
        { status: 400 }
      );
    }
    
    // Lógica de negócio
    const resultado = await prisma.exemplo.create({
      data: validatedData.data,
    });
    
    return NextResponse.json(resultado, { status: 201 });
  } catch (erro) {
    console.error('Erro na API:', erro);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

### 2. Server Components (Páginas)
```typescript
// src/app/exemplo/page.tsx
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function ExemploPage() {
  // Autenticação obrigatória
  const usuario = await requireAuth();
  
  // Fetch de dados no servidor
  const dados = await prisma.exemplo.findMany({
    where: { usuarioId: usuario.id },
  });
  
  return (
    <div>
      <h1>Olá, {usuario.nome}</h1>
      {/* Renderizar dados */}
    </div>
  );
}
```

### 3. Client Components (Interatividade)
```typescript
// src/components/exemplo/ExemploInterativo.tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function ExemploInterativo() {
  const [valor, setValor] = useState('');
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async (data: { campo: string }) => {
      const res = await fetch('/api/exemplo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Falha na requisição');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Sucesso!', description: 'Dados salvos' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Falha ao salvar', variant: 'destructive' });
    },
  });
  
  return (
    <Button onClick={() => mutation.mutate({ campo: valor })}>
      Enviar
    </Button>
  );
}
```

### 4. Validação com Zod
```typescript
// src/lib/validations/exemplo-schemas.ts
import { z } from 'zod';

export const ExemploSchema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres').max(50),
  email: z.string().email('Email inválido'),
  idade: z.number().int().positive().max(120),
  ativo: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
});

export type Exemplo = z.infer<typeof ExemploSchema>;
```

### 5. Prisma Queries (Boas Práticas)
```typescript
// ✅ BOM: Select apenas campos necessários
const usuario = await prisma.usuario.findUnique({
  where: { id },
  select: { id: true, nome: true, email: true },
});

// ✅ BOM: Usar include para relacionamentos necessários
const sessao = await prisma.sessaoAdaptativa.findUnique({
  where: { id: sessaoId },
  include: {
    respostas: { select: { id: true, valor: true } },
    usuario: { select: { nome: true } },
  },
});

// ❌ EVITAR: Buscar tudo sem select
const dados = await prisma.sessaoAdaptativa.findMany(); // Traz TODOS os campos

// ✅ BOM: Filtros eficientes com índices
const alertas = await prisma.alertaSocioemocional.findMany({
  where: {
    usuarioId,
    status: 'PENDENTE',
    createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
});
```

---

## 🎨 Padrões de UI/UX

### 1. Componentes shadcn/ui
Sempre use componentes shadcn/ui quando disponíveis:
- `Button`, `Input`, `Select`, `Checkbox`, `RadioGroup`
- `Dialog`, `Sheet`, `Popover`, `Tooltip`
- `Card`, `Badge`, `Alert`, `Progress`
- `Table`, `Tabs`, `Separator`

**Importação**:
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
```

### 2. Design Tokens
```typescript
// src/lib/design-tokens.ts
export const designTokens = {
  colors: {
    primary: { 500: '#3b82f6', 600: '#2563eb' },
    success: { 500: '#10b981' },
    danger: { 500: '#ef4444' },
  },
  spacing: {
    xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px',
  },
  typography: {
    h1: 'text-4xl font-bold',
    body: 'text-base',
  },
};
```

### 3. Loading States
```typescript
import { Spinner } from '@/components/ui/spinner';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

// Para loading inline
{isLoading && <Spinner size="sm" />}

// Para skeletons de cards
<LoadingSkeleton variant="card" count={3} />
```

### 4. Feedback (Toast)
```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

toast({
  title: 'Sucesso',
  description: 'Operação concluída',
  variant: 'default', // 'default' | 'success' | 'destructive'
});
```

---

## 🧪 Padrões de Teste

### 1. Testes Unitários (Vitest)
```typescript
// src/__tests__/lib/irt-refinado.test.ts
import { describe, it, expect } from 'vitest';
import { estimarThetaMLE, calcularInformacao } from '@/lib/adaptive/irt-refinado';

describe('IRT Refinado', () => {
  it('deve estimar theta corretamente', () => {
    const respostas = [
      { valorNormalizado: 0.8, configuracaoIRT: { discriminacao: 1.5, dificuldade: 0.5, acerto: 0.2 } },
    ];
    
    const resultado = estimarThetaMLE(respostas);
    
    expect(resultado.theta).toBeGreaterThan(0);
    expect(resultado.convergiu).toBe(true);
  });
});
```

### 2. Testes E2E (Playwright)
```typescript
// tests/e2e/questionario.spec.ts
import { test, expect } from '@playwright/test';

test('deve completar questionário adaptativo', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'aluno@teste.com');
  await page.fill('[name="senha"]', 'senha123');
  await page.click('button[type="submit"]');
  
  await page.goto('/questionario/iniciar?tipo=CHECK_IN_DIARIO');
  
  // Responder primeira pergunta
  await page.click('[data-testid="resposta-4"]'); // Likert 5
  await page.click('button:has-text("Próxima")');
  
  // Verificar se avançou
  await expect(page.locator('[data-testid="progresso"]')).toContainText('2/');
});
```

---

## 🛠️ Workflows de Desenvolvimento

### 1. Git Flow
```bash
# Criar nova feature
git checkout develop
git pull origin develop
git checkout -b feature/nova-funcionalidade

# Fazer alterações e commits semânticos
git add .
git commit -m "feat: adicionar nova funcionalidade X"

# Push e criar PR para develop
git push origin feature/nova-funcionalidade
```

### 2. Conventional Commits
Padrão obrigatório para commits:
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação (sem mudança de lógica)
refactor: refatoração
test: adicionar/corrigir testes
chore: tarefas de build/config
perf: melhoria de performance
```

**Exemplos**:
```bash
git commit -m "feat: adicionar filtro por categoria em questionários"
git commit -m "fix: corrigir cálculo de theta em sessões longas"
git commit -m "docs: atualizar README com instruções de deploy"
git commit -m "refactor: extrair lógica IRT para serviço separado"
```

### 3. Pull Request Template
Ao criar PR, incluir:
- **Descrição**: O que foi feito e por quê
- **Tipo de mudança**: Feature | Bugfix | Refactor | Docs
- **Testes**: Como testar manualmente
- **Checklist**: Linting OK, testes passando, documentação atualizada
- **Screenshots**: Se mudanças visuais

---

## 🚨 Alertas e Sistema de Regras

### 1. Geração de Alertas
Alertas são criados automaticamente ao final de sessões com base em:
- **Scores categóricos**: PHQ-9 > 10 (depressão moderada)
- **Theta extremos**: θ < -2 (baixo bem-estar)
- **Respostas críticas**: Respostas de risco em perguntas-chave

**Exemplo**:
```typescript
// src/app/api/sessoes/[id]/resposta/route.ts
if (resultado.categorias.DEPRESSAO > 10) {
  await prisma.alertaSocioemocional.create({
    data: {
      usuarioId,
      tipo: 'DEPRESSAO',
      severidade: 'MODERADA',
      descricao: 'Score PHQ-9 indica depressão moderada',
      status: 'PENDENTE',
    },
  });
}
```

### 2. Dashboard de Alertas (Professor/Admin)
```typescript
// src/app/admin/alertas/page.tsx
const alertas = await prisma.alertaSocioemocional.findMany({
  where: { status: 'PENDENTE' },
  include: { usuario: { select: { nome: true, email: true } } },
  orderBy: { severidade: 'desc' },
});
```

---

## 📊 Relatórios e Analytics

### 1. Componentes de Gráficos
```typescript
// Gráfico Circumplex (Valencia × Ativação)
import { GraficoCircumplex } from '@/components/charts/GraficoCircumplex';
<GraficoCircumplex dados={dadosEmocoes} />

// Linha temporal de scores
import { LinhaTemporalScores } from '@/components/charts/LinhaTemporalScores';
<LinhaTemporalScores categorias={['ANSIEDADE', 'DEPRESSAO']} dados={series} />

// Radar de categorias
import { RadarCategorias } from '@/components/charts/RadarCategorias';
<RadarCategorias dados={scoresPorCategoria} />

// Heatmap emocional
import { HeatmapEmocional } from '@/components/charts/HeatmapEmocional';
<HeatmapEmocional dados={registrosDiarios} />
```

### 2. Exportação de Relatórios
```typescript
// PDF (client-side)
import { exportarRelatorioPDF } from '@/lib/exportacao/pdf-utils';
await exportarRelatorioPDF(usuario, sessoes, graficos);

// CSV (API)
GET /api/relatorios/export?formato=csv&usuarioId=123
Response: CSV file download
```

---

## 🔐 Segurança e Autenticação

### 1. NextAuth Configuration
```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({ clientId, clientSecret }),
    CredentialsProvider({ /* ... */ }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: '/login' },
};
```

### 2. Proteção de Rotas
```typescript
// Middleware (src/middleware.ts)
export { default } from 'next-auth/middleware';
export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] };

// Role-based (Server Component)
const usuario = await requireAuth();
if (usuario.role !== 'ADMIN') {
  redirect('/dashboard');
}
```

### 3. Variáveis de Ambiente
```bash
# .env.local
DATABASE_URL="postgresql://user:pass@host/db"
NEXTAUTH_SECRET="random-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

---

## 📈 Performance e Otimização

### 1. Caching (React Query)
```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['sessoes', usuarioId],
  queryFn: async () => {
    const res = await fetch(`/api/sessoes?usuarioId=${usuarioId}`);
    return res.json();
  },
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
});
```

### 2. Índices Prisma
```prisma
// prisma/schema.prisma
model SessaoAdaptativa {
  // ...
  @@index([usuarioId, status])
  @@index([questionarioId, createdAt])
}
```

### 3. Lazy Loading
```typescript
// Lazy load componentes pesados
const GraficoCircumplex = dynamic(
  () => import('@/components/charts/GraficoCircumplex'),
  { loading: () => <Spinner />, ssr: false }
);
```

---

## 🐛 Debugging e Troubleshooting

### 1. Logs Estruturados
```typescript
console.log('[IRT] Estimando theta:', { sessaoId, respostas: respostas.length });
console.error('[API] Erro ao criar alerta:', { erro: err.message, usuarioId });
```

### 2. Prisma Query Logs
```typescript
// src/lib/prisma.ts
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});
```

### 3. Problemas Comuns
**Erro: useSearchParams() needs Suspense boundary**
```typescript
// ❌ Errado
'use client';
import { useSearchParams } from 'next/navigation';
export default function Page() {
  const params = useSearchParams();
  // ...
}

// ✅ Correto
import { Suspense } from 'react';
function SearchParamsComponent() {
  const params = useSearchParams();
  // ...
}
export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SearchParamsComponent />
    </Suspense>
  );
}
```

**Erro: Prisma Client não gerado**
```bash
npx prisma generate
```

**Erro: Migrações pendentes**
```bash
npx prisma migrate dev
```

---

## 📚 Recursos e Documentação

### Links Importantes
- **Next.js 15 Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Recharts**: https://recharts.org/en-US/
- **Zod**: https://zod.dev
- **TanStack Query**: https://tanstack.com/query/latest

### Documentação Interna
- `/docs/planejamento/PLANO_MELHORIAS_QUESTIONARIOS_RELATORIOS.md`: Roadmap de melhorias
- `/docs/arquitetura/`: Diagramas e decisões arquiteturais
- `/docs/guias/GUIA_DEPLOY.md`: Instruções de deploy
- `/CONTRIBUTING.md`: Guia de contribuição
- `/README.md`: Overview do projeto

---

## ✅ Checklist para Novas Funcionalidades

Ao criar nova funcionalidade, verificar:
- [ ] Código TypeScript tipado (sem `any`)
- [ ] Validação Zod em API routes
- [ ] Autenticação/autorização apropriada
- [ ] Queries Prisma otimizadas (select, include)
- [ ] Testes unitários (Vitest)
- [ ] Testes E2E se UI (Playwright)
- [ ] Componentes shadcn/ui usados quando possível
- [ ] Loading states implementados
- [ ] Error handling com try/catch
- [ ] Commits semânticos (conventional commits)
- [ ] Documentação atualizada (se necessário)

---

## 🎯 Diretrizes Específicas

### Ao trabalhar com IRT/Adaptativo:
1. Sempre usar funções de `src/lib/adaptive/irt-refinado.ts` para cálculos
2. Registrar decisões em `LogAdaptativo` para auditoria
3. Validar convergência de theta antes de finalizar
4. Respeitar critérios de parada (erro < 0.3 ou 20 perguntas)

### Ao criar Questionários:
1. Definir categoria, valencia, ativação
2. Configurar parâmetros IRT (discriminacao, dificuldade, acerto)
3. Validar com psicólogo se escala clínica (PHQ-9, GAD-7)
4. Testar com seed script antes de produção

### Ao gerar Relatórios:
1. Buscar dados reais do banco (evitar mocks)
2. Aplicar filtros por período, usuário, categoria
3. Otimizar queries com select/include
4. Cachear com React Query (5-10 minutos)
5. Implementar exportação (CSV/PDF)

### Ao criar APIs:
1. Validar com Zod antes de processar
2. Autenticar com `getAuthenticatedUser()` ou `requireAuth()`
3. Retornar JSON padronizado: `{ data, erro, metadados }`
4. Usar status HTTP corretos (200, 201, 400, 401, 403, 500)
5. Logar erros com contexto

---

## 🚀 Quick Start para AI Agents

### Tarefa: Criar nova API
1. Criar arquivo em `src/app/api/[nome]/route.ts`
2. Importar `NextRequest`, `NextResponse`, `prisma`, `z`
3. Definir schema Zod
4. Exportar `export async function POST/GET/PUT/DELETE`
5. Validar com `.safeParse()`
6. Executar lógica com Prisma
7. Retornar JSON com status

### Tarefa: Criar novo componente
1. Criar arquivo em `src/components/[categoria]/[Nome].tsx`
2. Usar `'use client'` se interativo
3. Importar componentes shadcn/ui
4. Tipar props com TypeScript
5. Implementar loading/error states
6. Adicionar aria-labels para acessibilidade

### Tarefa: Adicionar model Prisma
1. Editar `prisma/schema.prisma`
2. Definir model com campos tipados
3. Adicionar relações (1:N, N:M)
4. Criar índices se consultas frequentes
5. Rodar `npx prisma migrate dev --name nome_migracao`
6. Atualizar seed script se necessário

### Tarefa: Implementar teste
1. Criar arquivo em `src/__tests__/[categoria]/[nome].test.ts`
2. Importar `describe`, `it`, `expect` do Vitest
3. Mockar dependências (Prisma, fetch)
4. Testar casos de sucesso e erro
5. Rodar `npm run test` localmente

---

## 🔄 Atualizações Recentes (v3.0)
- ✅ Sistema de matérias implementado (CRUD admin)
- ✅ Gerenciamento de roles (ADMIN pode alterar roles)
- ✅ Cadastro com seleção de role
- ✅ Google OAuth integrado com role padrão (ALUNO)
- ✅ Navegação melhorada com controle de acesso por role
- ✅ 7 commits semânticos organizados no histórico Git
- ✅ Merges bem-sucedidos (feature → develop → main)
- ⚠️ Pendente: Fix Suspense em login page (deploy error)

---

**Última revisão**: 21/11/2025  
**Mantenedores**: Felipe Allan  
**Contato**: Consultar README.md para credenciais de teste
