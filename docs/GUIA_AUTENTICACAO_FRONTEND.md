# Guia de Autenticação e Permissões - Frontend Original

## ✅ O que foi mantido do seu frontend original:
- Todas as páginas existentes (`/dashboard`, `/analytics`, `/questionarios`, etc.)
- Toda a navegação e layouts que você criou
- Todos os componentes UI que você desenvolveu

## 🔐 O que foi adicionado (autenticação):
- Sistema de login com NextAuth
- Roles: ALUNO, PROFESSOR, ADMIN
- Middleware leve que apenas redireciona `/` para a página correta
- Componentes auxiliares para filtrar conteúdo por role

---

## 📚 Como usar nas suas páginas existentes

### **1. Proteger uma página inteira**

Se você quer que apenas PROFESSORES possam acessar `/analytics`:

```tsx
// src/app/analytics/page.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['PROFESSOR', 'ADMIN']}>
      {/* Seu conteúdo original aqui */}
      <div>
        <h1>Analytics</h1>
        {/* ... resto do código ... */}
      </div>
    </ProtectedRoute>
  )
}
```

### **2. Mostrar/ocultar partes da UI**

Se você quer mostrar um botão apenas para ADMIN:

```tsx
import { RoleBasedContent } from '@/components/RoleBasedContent'

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Este botão só aparece para ADMIN */}
      <RoleBasedContent allowedRoles={['ADMIN']}>
        <button>Configurações Avançadas</button>
      </RoleBasedContent>

      {/* Este conteúdo só aparece para ALUNO */}
      <RoleBasedContent allowedRoles={['ALUNO']}>
        <div>Suas avaliações pessoais</div>
      </RoleBasedContent>

      {/* Este conteúdo aparece para PROFESSOR e ADMIN */}
      <RoleBasedContent allowedRoles={['PROFESSOR', 'ADMIN']}>
        <div>Analytics da turma</div>
      </RoleBasedContent>
    </div>
  )
}
```

### **3. Usar permissões em lógica**

Se você precisa verificar permissões para executar código:

```tsx
'use client'

import { usePermissions } from '@/components/RoleBasedContent'

export default function MinhaPage() {
  const { isProfessor, isAdmin, isAluno, hasRole } = usePermissions()

  const handleClick = () => {
    if (isProfessor || isAdmin) {
      // Lógica apenas para professor/admin
      console.log('Ação de professor')
    } else if (isAluno) {
      // Lógica apenas para aluno
      console.log('Ação de aluno')
    }
  }

  // Verificar múltiplos roles
  const podeEditar = hasRole(['PROFESSOR', 'ADMIN'])

  return (
    <div>
      <h1>Minha Página</h1>
      <button onClick={handleClick}>
        {isProfessor ? 'Ver Turma' : 'Ver Minhas Notas'}
      </button>
      
      {podeEditar && <button>Editar</button>}
    </div>
  )
}
```

### **4. Pegar dados do usuário logado**

```tsx
'use client'

import { useSession } from '@/hooks/useSession'

export default function ProfilePage() {
  const { data: session, isAluno, isProfessor, userId } = useSession()

  if (!session) {
    return <div>Carregando...</div>
  }

  return (
    <div>
      <h1>Olá, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
      
      {isProfessor && session.user.materia && (
        <p>Matéria: {session.user.materia}</p>
      )}
    </div>
  )
}
```

---

## 🔍 Filtrando dados por usuário (Server-side)

### **Exemplo: Buscar apenas avaliações do usuário logado**

```tsx
// src/app/avaliacoes/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AvaliacoesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  // Se for ALUNO: buscar apenas SUAS avaliações
  // Se for PROFESSOR: buscar avaliações das SUAS turmas (agregadas)
  // Se for ADMIN: buscar TODAS
  
  let avaliacoes
  
  if (session.user.role === 'ALUNO') {
    avaliacoes = await prisma.avaliacaoSocioemocional.findMany({
      where: { usuarioId: parseInt(session.user.id) },
      orderBy: { createdAt: 'desc' }
    })
  } else if (session.user.role === 'PROFESSOR') {
    // Buscar avaliações das turmas que o professor leciona
    avaliacoes = await prisma.avaliacaoSocioemocional.findMany({
      where: {
        aula: {
          professor: {
            id: parseInt(session.user.id)
          }
        }
      },
      include: {
        usuario: { select: { nome: true } }, // Agregado, sem dados sensíveis
        aula: { select: { titulo: true } }
      }
    })
  } else {
    // ADMIN vê tudo
    avaliacoes = await prisma.avaliacaoSocioemocional.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  return (
    <div>
      <h1>Avaliações</h1>
      {/* Renderizar avaliacoes */}
    </div>
  )
}
```

---

## 🎯 Exemplos de uso nas suas páginas

### **/dashboard - Página principal**
```tsx
'use client'
import { usePermissions } from '@/components/RoleBasedContent'

export default function Dashboard() {
  const { isAluno, isProfessor, isAdmin } = usePermissions()

  return (
    <div>
      {isAluno && <DashboardAluno />}
      {isProfessor && <DashboardProfessor />}
      {isAdmin && <DashboardAdmin />}
    </div>
  )
}
```

### **/analytics - Apenas Professor e Admin**
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['PROFESSOR', 'ADMIN']}>
      {/* Seu código de analytics original */}
    </ProtectedRoute>
  )
}
```

### **/questionarios - Apenas Aluno**
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function QuestionariosPage() {
  return (
    <ProtectedRoute allowedRoles={['ALUNO']}>
      {/* Seu código de questionários original */}
    </ProtectedRoute>
  )
}
```

---

## 🛡️ Proteção de APIs

Para proteger APIs (opcional, quando você quiser):

```tsx
// src/app/api/turmas/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  if (session.user.role !== 'PROFESSOR' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  // Código da API
  const turmas = await prisma.turma.findMany()
  
  return NextResponse.json(turmas)
}
```

---

## 📝 Resumo

**O que você PRECISA fazer agora:**
1. Nas páginas que devem ter acesso restrito, envolver com `<ProtectedRoute>`
2. Em partes da UI que devem aparecer só para certos roles, usar `<RoleBasedContent>`
3. Quando buscar dados do banco, filtrar baseado em `session.user.id` e `session.user.role`

**O que você NÃO precisa fazer:**
- ❌ Reescrever suas páginas
- ❌ Mudar layouts
- ❌ Mudar navegação
- ❌ Mudar componentes UI

**Tudo isso é OPCIONAL e você adiciona conforme necessidade!** 🎉
