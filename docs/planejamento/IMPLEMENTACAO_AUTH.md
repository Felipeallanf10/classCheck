# 🔐 Implementação: Sistema de Autenticação e Autorização

**Branch:** `feature/auth-and-roles`  
**Base:** `refactor/phase3-assessment-improvements`

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### ✅ **FASE 1: Preparação e Dependências (30min)**

- [ ] Instalar dependências
  ```bash
  npm install next-auth @auth/prisma-adapter bcryptjs
  npm install -D @types/bcryptjs
  ```

- [ ] Configurar variáveis de ambiente
  ```env
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=sua-chave-secreta-aqui
  ```

- [ ] Gerar secret
  ```bash
  openssl rand -base64 32
  ```

---

### ✅ **FASE 2: Schema e Migração do Banco (1-2h)**

#### 2.1 Atualizar Schema Prisma

- [ ] Remover duplicação Usuario/Professor
- [ ] Adicionar modelos NextAuth
- [ ] Adicionar campos de autenticação
- [ ] Criar migration

**Arquivo:** `prisma/schema.prisma`

```prisma
model Usuario {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  nome          String
  senha         String    // Hash bcrypt
  avatar        String?
  role          Role      @default(ALUNO)
  ativo         Boolean   @default(true)
  
  // Campos específicos de professor
  materia       String?   // Apenas para PROFESSOR
  
  // NextAuth
  accounts      Account[]
  sessions      Session[]
  
  // Relacionamentos existentes...
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("usuarios")
}

// NextAuth Models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user Usuario @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         Usuario  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

enum Role {
  ALUNO
  PROFESSOR
  ADMIN
}
```

#### 2.2 Migração de Dados

- [ ] Script SQL para migrar Professor → Usuario

**Arquivo:** `scripts/migrate-professor-to-usuario.sql`

```sql
-- Inserir professores como usuários
INSERT INTO usuarios (id, email, nome, senha, role, materia, ativo, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  email,
  nome,
  '$2a$10$default-hash', -- Será resetado no primeiro login
  'PROFESSOR'::Role,
  materia,
  ativo,
  "createdAt",
  "updatedAt"
FROM professores;

-- Atualizar FK em aulas (vai precisar ajuste manual)
-- Criar mapeamento temp
CREATE TEMP TABLE professor_mapping AS
SELECT 
  p.id as old_id,
  u.id as new_id
FROM professores p
JOIN usuarios u ON u.email = p.email;

-- Atualizar aulas.professorId
UPDATE aulas a
SET "professorId" = pm.new_id::int
FROM professor_mapping pm
WHERE a."professorId" = pm.old_id;
```

---

### ✅ **FASE 3: NextAuth Setup (2h)**

#### 3.1 Configurar NextAuth

- [ ] Criar arquivo de configuração

**Arquivo:** `src/lib/auth/config.ts`

```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        senha: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          throw new Error('Credenciais inválidas');
        }

        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        });

        if (!usuario || !usuario.ativo) {
          throw new Error('Usuário não encontrado ou inativo');
        }

        const senhaCorreta = await bcrypt.compare(
          credentials.senha,
          usuario.senha
        );

        if (!senhaCorreta) {
          throw new Error('Senha incorreta');
        }

        return {
          id: usuario.id,
          email: usuario.email,
          nome: usuario.nome,
          role: usuario.role,
          avatar: usuario.avatar,
          materia: usuario.materia,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.materia = user.materia;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.materia = token.materia as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

#### 3.2 API Route

- [ ] Criar route handler

**Arquivo:** `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

---

### ✅ **FASE 4: Componentes de Autenticação (2-3h)**

#### 4.1 Página de Login

- [ ] Criar UI de login

**Arquivo:** `src/app/login/page.tsx`

```typescript
'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      senha,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Email ou senha incorretos');
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            ClassCheck Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium mb-2">
                Senha
              </label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 4.2 Hook useSession Customizado

- [ ] Criar hook com tipagem

**Arquivo:** `src/hooks/useSession.ts`

```typescript
'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';
import { Role } from '@prisma/client';

export interface SessionUser {
  id: string;
  nome: string;
  email: string;
  role: Role;
  avatar?: string;
  materia?: string;
}

export function useSession() {
  const { data: session, status } = useNextAuthSession();

  return {
    user: session?.user as SessionUser | undefined,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isAluno: session?.user?.role === 'ALUNO',
    isProfessor: session?.user?.role === 'PROFESSOR',
    isAdmin: session?.user?.role === 'ADMIN',
  };
}
```

---

### ✅ **FASE 5: Middleware de Proteção (1-2h)**

#### 5.1 Middleware Principal

- [ ] Criar middleware de rota

**Arquivo:** `src/middleware.ts`

```typescript
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Rotas públicas
    if (path.startsWith('/login') || path.startsWith('/api/auth')) {
      return NextResponse.next();
    }

    // Não autenticado → redireciona para login
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Verificar permissões por role
    const role = token.role as string;

    // Rotas de professor
    if (path.startsWith('/professor')) {
      if (role !== 'PROFESSOR' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Rotas de admin
    if (path.startsWith('/admin')) {
      if (role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|public).*)',
  ],
};
```

#### 5.2 Componente de Proteção

- [ ] Criar ProtectedRoute

**Arquivo:** `src/components/auth/ProtectedRoute.tsx`

```typescript
'use client';

import { useSession } from '@/hooks/useSession';
import { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackUrl?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  fallbackUrl = '/unauthorized' 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (!isLoading && user && !allowedRoles.includes(user.role)) {
      router.push(fallbackUrl);
    }
  }, [user, isLoading, isAuthenticated, allowedRoles, router, fallbackUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
```

---

### ✅ **FASE 6: Layouts por Role (2-3h)**

#### 6.1 Estrutura de Pastas

```
src/app/
├── (auth)/
│   ├── login/
│   └── register/
│
├── (aluno)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── aulas/
│   ├── avaliacoes/
│   └── relatorios/
│
├── (professor)/
│   ├── layout.tsx
│   └── professor/
│       ├── page.tsx
│       ├── aulas/
│       └── relatorios/
│
└── (admin)/
    ├── layout.tsx
    └── admin/
```

#### 6.2 Layout do Aluno

**Arquivo:** `src/app/(aluno)/layout.tsx`

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AlunoNavbar } from '@/components/layout/AlunoNavbar';

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['ALUNO', 'ADMIN']}>
      <div className="min-h-screen flex flex-col">
        <AlunoNavbar />
        <main className="flex-1 container mx-auto py-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
```

#### 6.3 Layout do Professor

**Arquivo:** `src/app/(professor)/layout.tsx`

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProfessorNavbar } from '@/components/layout/ProfessorNavbar';

export default function ProfessorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['PROFESSOR', 'ADMIN']}>
      <div className="min-h-screen flex flex-col">
        <ProfessorNavbar />
        <main className="flex-1 container mx-auto py-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
```

---

### ✅ **FASE 7: Dashboards Específicos (3-4h)**

#### 7.1 Dashboard do Aluno

**Arquivo:** `src/app/(aluno)/page.tsx`

```typescript
'use client';

import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAlunoPage() {
  const { user } = useSession();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Bem-vindo, {user?.nome}! 🎓
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Aulas</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Lista de aulas */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Lista de avaliações */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Gráfico pequeno */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

#### 7.2 Dashboard do Professor

**Arquivo:** `src/app/(professor)/professor/page.tsx`

```typescript
'use client';

import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardProfessorPage() {
  const { user } = useSession();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Bem-vindo, Prof. {user?.nome}! 👨‍🏫
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Suas Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Lista de turmas */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas Socioemocionais</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Alertas anônimos */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

### ✅ **FASE 8: APIs com Validação (2-3h)**

#### 8.1 Helper de Autorização

**Arquivo:** `src/lib/auth/api-helper.ts`

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from './config';
import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function requireAuth(allowedRoles?: Role[]) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      error: NextResponse.json(
        { erro: 'Não autenticado' },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role as Role)) {
    return {
      error: NextResponse.json(
        { erro: 'Sem permissão' },
        { status: 403 }
      ),
    };
  }

  return { session };
}
```

#### 8.2 Exemplo de API Protegida

**Arquivo:** `src/app/api/avaliacoes/route.ts`

```typescript
import { requireAuth } from '@/lib/auth/api-helper';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const { session, error } = await requireAuth(['ALUNO']);

  if (error) return error;

  const avaliacoes = await prisma.avaliacaoSocioemocional.findMany({
    where: {
      usuarioId: session.user.id,
    },
  });

  return NextResponse.json(avaliacoes);
}
```

---

### ✅ **FASE 9: Testes e Validação (1-2h)**

- [ ] Testar login com diferentes roles
- [ ] Testar proteção de rotas
- [ ] Testar middleware
- [ ] Testar dashboards específicos
- [ ] Testar APIs protegidas

---

## 📊 RESUMO DE TEMPO ESTIMADO

| Fase | Descrição | Tempo |
|------|-----------|-------|
| 1 | Dependências | 30min |
| 2 | Schema e Migração | 1-2h |
| 3 | NextAuth Setup | 2h |
| 4 | Componentes Auth | 2-3h |
| 5 | Middleware | 1-2h |
| 6 | Layouts por Role | 2-3h |
| 7 | Dashboards | 3-4h |
| 8 | APIs Protegidas | 2-3h |
| 9 | Testes | 1-2h |
| **TOTAL** | | **15-22h** |

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. **Instalar dependências** (Fase 1)
2. **Atualizar schema** (Fase 2)
3. **Configurar NextAuth** (Fase 3)

**Quer que eu comece pela Fase 1?** 🎯
