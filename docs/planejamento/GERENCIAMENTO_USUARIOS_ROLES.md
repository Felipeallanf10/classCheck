# 🔐 Planejamento: Gerenciamento de Usuários e Roles

## 📊 Situação Atual

### Modelos Existentes no Schema
```prisma
model Usuario {
  role: Role @default(ALUNO)  // ALUNO, PROFESSOR, ADMIN
}

model Professor {
  // Tabela separada para professores
}

enum Role {
  ALUNO
  PROFESSOR
  ADMIN
}
```

### ⚠️ **PROBLEMA IDENTIFICADO**
- **2 tabelas separadas**: `Usuario` e `Professor`
- **Confusão de identidade**: Um professor é um usuário ou não?
- **Duplicação**: Professor tem email, Usuario tem email
- **Relacionamentos quebrados**: Aulas vinculadas a `Professor`, mas avaliações a `Usuario`

---

## 🎯 SOLUÇÃO PROPOSTA: ARQUITETURA UNIFICADA

### **Opção 1: UNIFICAR TUDO EM `Usuario`** ⭐ **RECOMENDADA**

#### Vantagens:
- ✅ Autenticação simplificada (1 tabela)
- ✅ Roles definem permissões
- ✅ Um professor pode ver suas próprias avaliações como aluno
- ✅ Menos duplicação de dados

#### Schema Modificado:
```prisma
model Usuario {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  nome      String
  avatar    String?
  role      Role     @default(ALUNO)
  
  // Campos específicos de professor (nullable)
  materia   String?  // Apenas para PROFESSOR
  
  // Relacionamentos ALUNO
  avaliacoesSocioemocionais AvaliacaoSocioemocional[] // Como aluno
  avaliacoesDidaticas       AvaliacaoDidatica[]       // Como aluno
  sessoesAdaptativas        SessaoAdaptativa[]        // Como aluno
  
  // Relacionamentos PROFESSOR
  aulasMinistradas Aula[] @relation("ProfessorAulas")  // Como professor
  turmasGerenciadas Turma[] // Como professor
  
  @@map("usuarios")
}

model Aula {
  professorId Int
  professor   Usuario @relation("ProfessorAulas", fields: [professorId], references: [id])
}
```

---

### **Opção 2: MANTER 2 TABELAS COM VÍNCULO** 

#### Vantagens:
- ✅ Separação clara de responsabilidades
- ✅ Menos mudanças no código atual

#### Desvantagens:
- ❌ Complexidade na autenticação
- ❌ Um professor não pode ser aluno
- ❌ Duplicação de dados

#### Schema Modificado:
```prisma
model Usuario {
  professorId Int? @unique  // Vínculo opcional
  professor   Professor? @relation(fields: [professorId], references: [id])
}

model Professor {
  usuarioVinculado Usuario?
}
```

---

## 🔑 DECISÃO RECOMENDADA: **OPÇÃO 1**

Vou criar um plano de migração para unificar em `Usuario` com roles.

---

## 📋 VISÕES E PERMISSÕES POR ROLE

### 🎓 **ALUNO** (Role: ALUNO)

#### **Páginas Acessíveis:**
```
✅ /                           # Dashboard do aluno
✅ /aulas                       # Ver aulas disponíveis
✅ /avaliacoes/sessao/[id]      # Responder questionários
✅ /minhas-avaliacoes           # Histórico de avaliações
✅ /relatorios                  # Relatórios pessoais
✅ /relatorios/analise-avancada # Analytics pessoais
✅ /perfil                      # Editar perfil

❌ /admin/*                     # Bloqueado
❌ /professor/*                 # Bloqueado
❌ /aulas/criar                 # Bloqueado
❌ /relatorios/turma            # Bloqueado
```

#### **Funcionalidades:**
- ✅ Avaliar aulas (socioemocional + didática)
- ✅ Ver próprias estatísticas e evolução
- ✅ Comparar com períodos anteriores
- ✅ Favoritar aulas
- ✅ Receber notificações de novas aulas
- ❌ Ver dados de outros alunos
- ❌ Ver relatórios agregados da turma
- ❌ Criar/editar aulas

---

### 👨‍🏫 **PROFESSOR** (Role: PROFESSOR)

#### **Páginas Acessíveis:**
```
✅ /                            # Dashboard do professor
✅ /professor/aulas             # Gerenciar suas aulas
✅ /professor/aulas/criar       # Criar nova aula
✅ /professor/turmas            # Ver turmas
✅ /professor/relatorios        # Relatórios das turmas
✅ /professor/relatorios/turma/[id]  # Análise de turma específica
✅ /professor/alertas           # Alertas socioemocionais
✅ /perfil                      # Editar perfil

❌ /admin/*                     # Bloqueado
❌ /avaliacoes/sessao/[id]      # Bloqueado (professor não avalia)
```

#### **Funcionalidades:**
- ✅ Criar/editar/cancelar aulas
- ✅ Ver relatórios agregados da turma (anônimos)
- ✅ Ver tendências emocionais da turma
- ✅ Receber alertas de alunos em risco
- ✅ Exportar dados (CSV/PDF)
- ✅ Comparar turmas
- ❌ Ver dados individuais identificados (apenas agregados anônimos)
- ❌ Editar avaliações dos alunos

---

### 🔧 **ADMIN** (Role: ADMIN)

#### **Páginas Acessíveis:**
```
✅ TUDO (sem restrições)
✅ /admin/usuarios              # Gerenciar usuários
✅ /admin/professores           # Gerenciar professores
✅ /admin/turmas                # Gerenciar turmas
✅ /admin/relatorios            # Relatórios globais
✅ /admin/banco-perguntas       # Gerenciar perguntas
✅ /admin/configuracoes         # Configurações do sistema
```

#### **Funcionalidades:**
- ✅ Gerenciar todos os usuários
- ✅ Promover ALUNO → PROFESSOR
- ✅ Ver todos os dados do sistema
- ✅ Configurar parâmetros IRT
- ✅ Gerenciar banco de perguntas
- ✅ Logs de auditoria

---

## 🛠️ IMPLEMENTAÇÃO TÉCNICA

### **1. Middleware de Autenticação**

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const ROLE_PERMISSIONS = {
  ALUNO: [
    '/',
    '/aulas',
    '/avaliacoes',
    '/minhas-avaliacoes',
    '/relatorios',
    '/perfil',
  ],
  PROFESSOR: [
    '/',
    '/professor',
    '/perfil',
  ],
  ADMIN: [
    '*', // Acesso total
  ],
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const { role } = session.user;
  const path = request.nextUrl.pathname;
  
  // Verificar permissões
  if (!hasPermission(role, path)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  return NextResponse.next();
}

function hasPermission(role: string, path: string): boolean {
  const allowedPaths = ROLE_PERMISSIONS[role];
  
  if (allowedPaths.includes('*')) return true;
  
  return allowedPaths.some(allowedPath => 
    path.startsWith(allowedPath)
  );
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
```

---

### **2. Componente de Proteção de Rota**

```typescript
// src/components/auth/ProtectedRoute.tsx
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
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !allowedRoles.includes(user.role))) {
      router.push(fallbackUrl);
    }
  }, [user, isLoading, allowedRoles, router, fallbackUrl]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
```

**Uso:**
```typescript
// src/app/professor/aulas/page.tsx
export default function AulasProfessorPage() {
  return (
    <ProtectedRoute allowedRoles={['PROFESSOR', 'ADMIN']}>
      <h1>Minhas Aulas</h1>
      {/* Conteúdo */}
    </ProtectedRoute>
  );
}
```

---

### **3. Hook de Sessão/Usuário**

```typescript
// src/hooks/useSession.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { Role } from '@prisma/client';

interface SessionUser {
  id: number;
  nome: string;
  email: string;
  role: Role;
  avatar?: string;
  materia?: string; // Para professores
}

async function fetchSession(): Promise<SessionUser | null> {
  const response = await fetch('/api/auth/session');
  
  if (!response.ok) {
    return null;
  }
  
  return response.json();
}

export function useSession() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    user,
    isLoading,
    error,
    isAluno: user?.role === 'ALUNO',
    isProfessor: user?.role === 'PROFESSOR',
    isAdmin: user?.role === 'ADMIN',
  };
}
```

---

### **4. Componente de Layout Condicional**

```typescript
// src/components/layout/DynamicLayout.tsx
'use client';

import { useSession } from '@/hooks/useSession';
import { AlunoLayout } from './AlunoLayout';
import { ProfessorLayout } from './ProfessorLayout';
import { AdminLayout } from './AdminLayout';

export function DynamicLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <div>Não autenticado</div>;
  }

  switch (user.role) {
    case 'ALUNO':
      return <AlunoLayout>{children}</AlunoLayout>;
    case 'PROFESSOR':
      return <ProfessorLayout>{children}</ProfessorLayout>;
    case 'ADMIN':
      return <AdminLayout>{children}</AdminLayout>;
    default:
      return <div>Role inválida</div>;
  }
}
```

---

## 📁 ESTRUTURA DE PASTAS PROPOSTA

```
src/app/
├── (aluno)/                    # Rotas para alunos
│   ├── layout.tsx              # Layout do aluno
│   ├── page.tsx                # Dashboard do aluno
│   ├── aulas/
│   ├── avaliacoes/
│   ├── minhas-avaliacoes/
│   └── relatorios/
│
├── (professor)/                # Rotas para professores
│   ├── layout.tsx              # Layout do professor
│   ├── professor/
│   │   ├── page.tsx            # Dashboard do professor
│   │   ├── aulas/
│   │   ├── turmas/
│   │   ├── relatorios/
│   │   └── alertas/
│
├── (admin)/                    # Rotas para admin
│   ├── layout.tsx              # Layout do admin
│   └── admin/
│       ├── page.tsx
│       ├── usuarios/
│       ├── professores/
│       └── configuracoes/
│
├── api/                        # APIs com validação de role
│   ├── auth/
│   ├── avaliacoes/
│   └── analytics/
│
└── (public)/                   # Rotas públicas
    ├── login/
    └── register/
```

---

## 🔄 PLANO DE MIGRAÇÃO

### **Fase 1: Preparação (1-2h)**
- [ ] Criar enum `Role` se não existir
- [ ] Adicionar campo `role` em `Usuario`
- [ ] Criar migration para unificar `Professor` → `Usuario`

### **Fase 2: Migração de Dados (30min)**
- [ ] Script SQL para migrar professores → usuários com role PROFESSOR
- [ ] Atualizar FK `aulas.professorId` → `usuarios.id`
- [ ] Verificar integridade dos dados

### **Fase 3: Código (3-4h)**
- [ ] Criar middleware de autenticação
- [ ] Criar hook `useSession`
- [ ] Criar componente `ProtectedRoute`
- [ ] Criar layouts por role

### **Fase 4: Rotas (2-3h)**
- [ ] Reorganizar pastas por role groups
- [ ] Aplicar proteção em cada rota
- [ ] Testar fluxos de cada role

### **Fase 5: APIs (2-3h)**
- [ ] Adicionar validação de role em cada endpoint
- [ ] Filtrar dados baseado em permissões
- [ ] Testar segurança

---

## 🎨 DIFERENÇAS VISUAIS POR ROLE

### **Dashboard do ALUNO**
```
┌─────────────────────────────────────┐
│ Bem-vindo, João! 🎓                 │
├─────────────────────────────────────┤
│ 📊 Suas Estatísticas                │
│ Valencia: 0.7  Ativação: 0.5        │
│                                     │
│ 📅 Próximas Aulas (3)               │
│ • Matemática - 14:00                │
│ • História - 16:00                  │
│                                     │
│ 📈 Evolução Longitudinal            │
│ [Gráfico de linha]                  │
└─────────────────────────────────────┘
```

### **Dashboard do PROFESSOR**
```
┌─────────────────────────────────────┐
│ Bem-vindo, Prof. Maria! 👨‍🏫         │
├─────────────────────────────────────┤
│ 📊 Suas Turmas (3)                  │
│ • 3A - 25 alunos                    │
│ • 3B - 28 alunos                    │
│                                     │
│ ⚠️ Alertas Socioemocionais (2)      │
│ • Turma 3A: 3 alunos em risco       │
│                                     │
│ 📈 Tendências da Turma              │
│ [Gráfico agregado anônimo]          │
│                                     │
│ ➕ Criar Nova Aula                  │
└─────────────────────────────────────┘
```

---

## 🔒 REGRAS DE PRIVACIDADE

### **ALUNO pode ver:**
- ✅ Apenas seus próprios dados
- ✅ Comparações anônimas com a turma
- ❌ Dados de outros alunos

### **PROFESSOR pode ver:**
- ✅ Dados agregados da turma (média, tendência)
- ✅ Alertas de risco (sem identificar aluno por nome)
- ✅ Distribuição de estados emocionais
- ❌ Dados individuais identificados de alunos
- ❌ Respostas específicas de alunos

### **ADMIN pode ver:**
- ✅ Tudo (com auditoria)

---

## ✅ PRÓXIMOS PASSOS IMEDIATOS

1. **DECISÃO**: Aprovar arquitetura proposta
2. **MIGRAÇÃO**: Executar plano de migração
3. **IMPLEMENTAR**: Autenticação e proteção de rotas
4. **SEPARAR**: Criar dashboards específicos
5. **TESTAR**: Fluxos de cada role

---

**Você aprova esta arquitetura?** Posso começar a implementar a migração! 🚀
