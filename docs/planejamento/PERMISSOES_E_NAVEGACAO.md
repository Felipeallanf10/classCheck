# Planejamento de Permissões e Acesso por Role

## 📋 Mapeamento Completo de Páginas e Permissões

### 🎯 Estrutura Atual do Frontend

```
src/app/
├── (auth)/
│   ├── login/          ✅ PÚBLICO (todos)
│   ├── cadastro/       ✅ PÚBLICO (todos)
│   └── reset-password/ ✅ PÚBLICO (todos)
│
├── (aluno)/
│   ├── aluno/          🔒 APENAS ALUNO
│   └── avaliar/        🔒 APENAS ALUNO (avaliação de aulas)
│
├── (professor)/
│   └── professor/      🔒 APENAS PROFESSOR + ADMIN
│
├── (admin)/
│   └── admin/          🔒 APENAS ADMIN
│
├── dashboard/          ⚠️ PROBLEMA: Quem acessa?
├── analytics/          ⚠️ PROBLEMA: Quem vê analytics?
├── avaliacoes/         ⚠️ PROBLEMA: Professor ou Aluno?
├── configuracoes/      ⚠️ Todos podem configurar perfil?
├── perfil/             ⚠️ Todos têm perfil?
├── playground/         ❌ REMOVER (desenvolvimento)
└── questionarios/      ⚠️ PROBLEMA: Uso indefinido
```

---

## 🔐 Regras de Acesso por Role

### **ALUNO** 👨‍🎓
**Pode acessar:**
- ✅ `/aluno` - Dashboard pessoal
- ✅ `/aluno/avaliacoes` - Ver SUAS avaliações (histórico)
- ✅ `/aluno/avaliar` - Avaliar aulas
- ✅ `/aluno/perfil` - Editar seu perfil
- ✅ `/aluno/estatisticas` - Ver suas estatísticas pessoais
- ✅ `/aluno/relatorios` - Ver relatórios pessoais (longitudinal individual)

**NÃO pode acessar:**
- ❌ Dados de outros alunos
- ❌ Turmas (gestão)
- ❌ Analytics agregadas (do professor)
- ❌ Páginas administrativas
- ❌ Criação de aulas/questionários

---

### **PROFESSOR** 👨‍🏫
**Pode acessar:**
- ✅ `/professor` - Dashboard com suas turmas
- ✅ `/professor/turmas` - Listar e ver turmas que leciona
- ✅ `/professor/turmas/[id]` - Detalhes de uma turma específica
- ✅ `/professor/analytics` - Analytics AGREGADAS da turma (sem identificação individual)
- ✅ `/professor/aulas` - Listar e criar aulas
- ✅ `/professor/relatorios` - Relatórios agregados da turma
- ✅ `/professor/perfil` - Editar seu perfil

**Regras especiais:**
- 🔒 Vê apenas dados AGREGADOS dos alunos (sem nomes em analytics)
- 🔒 Pode ver alertas de alunos em risco (sem detalhes sensíveis)
- 🔒 Vê apenas suas turmas e suas aulas
- 🔒 NÃO pode ver avaliações individuais nominais

**NÃO pode acessar:**
- ❌ Dados individuais identificados dos alunos
- ❌ Páginas administrativas
- ❌ Gestão de usuários/turmas (apenas visualização)
- ❌ Configurações do sistema

---

### **ADMIN** 👑
**Pode acessar:**
- ✅ `/admin` - Dashboard administrativo
- ✅ `/admin/usuarios` - CRUD de usuários
- ✅ `/admin/turmas` - CRUD de turmas
- ✅ `/admin/relatorios` - Relatórios gerais do sistema
- ✅ `/admin/configuracoes` - Configurações do sistema
- ✅ **TUDO** que professor e aluno podem acessar (para testes/suporte)

**Poderes especiais:**
- ⭐ Acesso total a todos os dados
- ⭐ Pode se passar por outros roles (visualização)
- ⭐ Gestão completa do sistema

---

## 🗺️ Reestruturação Proposta

### **Páginas a MOVER/RENOMEAR:**

```typescript
// ANTES (atual)
/dashboard          → ❌ REMOVER (qual dashboard?)
/analytics          → ❌ REMOVER (mover para roles específicos)
/avaliacoes         → ❌ REMOVER (duplicado)
/configuracoes      → ❌ REMOVER (mover para /perfil)

// DEPOIS (organizado)
/aluno              → ✅ Dashboard do aluno
/aluno/avaliar      → ✅ Avaliação de aulas (MOVER de /questionarios)
/aluno/historico    → ✅ Histórico de avaliações
/aluno/perfil       → ✅ Perfil e configurações

/professor          → ✅ Dashboard do professor
/professor/turmas   → ✅ Gestão de turmas
/professor/analytics → ✅ Analytics agregadas (MOVER de /analytics)
/professor/aulas    → ✅ Gestão de aulas
/professor/perfil   → ✅ Perfil

/admin              → ✅ Dashboard admin
/admin/usuarios     → ✅ Gestão de usuários (CRIAR)
/admin/turmas       → ✅ Gestão de turmas (CRIAR)
/admin/sistema      → ✅ Configurações (MOVER de /configuracoes)
```

---

## 🛡️ Implementação de Segurança

### **1. Proteção no Middleware** (`src/middleware.ts`)

```typescript
// Regras a adicionar:
const roleRoutes = {
  ALUNO: ['/aluno'],
  PROFESSOR: ['/professor'],
  ADMIN: ['/admin']
}

// Verificar se usuário tem permissão para a rota
if (path.startsWith('/professor') && role !== 'PROFESSOR' && role !== 'ADMIN') {
  redirect('/aluno') // Redireciona para seu dashboard
}
```

### **2. Proteção nas APIs** (adicionar middleware de API)

```typescript
// src/lib/api-auth.ts
export function requireRole(allowedRoles: Role[]) {
  return async (req: NextRequest) => {
    const session = await getServerSession(authOptions)
    
    if (!session || !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
  }
}

// Usar nas rotas:
// src/app/api/turmas/route.ts
export const GET = requireRole(['PROFESSOR', 'ADMIN'])(async () => {...})
```

### **3. Proteção no Client** (componentes)

```typescript
// src/components/ProtectedContent.tsx
export function ProtectedContent({ 
  allowedRoles, 
  children 
}: { 
  allowedRoles: Role[], 
  children: React.ReactNode 
}) {
  const { userRole } = useSession()
  
  if (!allowedRoles.includes(userRole)) {
    return <AccessDenied />
  }
  
  return <>{children}</>
}
```

---

## 📊 Matriz de Permissões Detalhada

| Recurso                          | Aluno | Professor | Admin |
|----------------------------------|-------|-----------|-------|
| **Dashboards**                   |       |           |       |
| Dashboard próprio                | ✅    | ✅        | ✅    |
| Dashboard de outros roles        | ❌    | ❌        | ✅    |
| **Avaliações**                   |       |           |       |
| Criar avaliação própria          | ✅    | ❌        | ✅    |
| Ver avaliações próprias          | ✅    | ❌        | ✅    |
| Ver avaliações agregadas (turma) | ❌    | ✅        | ✅    |
| Ver avaliações individuais       | ❌    | ❌        | ✅    |
| **Turmas**                       |       |           |       |
| Ver turma que pertence           | ✅    | ❌        | ✅    |
| Ver turmas que leciona           | ❌    | ✅        | ✅    |
| Ver todas as turmas              | ❌    | ❌        | ✅    |
| Criar/Editar turmas              | ❌    | ❌        | ✅    |
| **Usuários**                     |       |           |       |
| Ver próprio perfil               | ✅    | ✅        | ✅    |
| Editar próprio perfil            | ✅    | ✅        | ✅    |
| Ver lista de alunos (turma)      | ❌    | ✅*       | ✅    |
| Ver todos os usuários            | ❌    | ❌        | ✅    |
| Criar/Editar usuários            | ❌    | ❌        | ✅    |
| **Aulas**                        |       |           |       |
| Ver suas aulas                   | ✅    | ✅        | ✅    |
| Criar aulas                      | ❌    | ✅        | ✅    |
| Editar/Deletar aulas             | ❌    | ✅        | ✅    |
| **Analytics/Relatórios**         |       |           |       |
| Relatório individual (próprio)   | ✅    | ❌        | ✅    |
| Relatório agregado (turma)       | ❌    | ✅        | ✅    |
| Relatório geral (sistema)        | ❌    | ❌        | ✅    |

*Professor vê apenas NOMES (para identificar alertas), mas NÃO vê dados sensíveis individuais

---

## 🎨 Navegação por Role

### **Aluno - Menu Simplificado**
```
🏠 Início
📊 Minhas Estatísticas
📝 Avaliar Aulas
📚 Histórico
👤 Perfil
🚪 Sair
```

### **Professor - Menu Profissional**
```
🏠 Início
👥 Minhas Turmas
📊 Analytics
📅 Aulas
📈 Relatórios
👤 Perfil
🚪 Sair
```

### **Admin - Menu Completo**
```
🏠 Início
👥 Usuários
🏫 Turmas
📅 Aulas
📊 Analytics Gerais
📈 Relatórios do Sistema
⚙️ Configurações
👤 Perfil
🚪 Sair
```

---

## 🚀 Próximos Passos de Implementação

### **FASE 1: Reorganização** ⏳
- [ ] Mover páginas existentes para estrutura correta
- [ ] Atualizar rotas no middleware
- [ ] Criar componente de navegação por role

### **FASE 2: Segurança** ⏳
- [ ] Implementar proteção de API
- [ ] Adicionar verificação de permissões em queries
- [ ] Criar HOCs/componentes de proteção

### **FASE 3: Dados** ⏳
- [ ] Filtrar queries por usuário logado
- [ ] Implementar agregação para professor
- [ ] Criar APIs específicas por role

---

## 🔍 Páginas Existentes - Decisão

### **Manter e Adaptar:**
- `/questionarios/[tipo]` → Mover para `/aluno/avaliar`
- `/analytics` → Dividir em `/professor/analytics` e `/admin/analytics`
- `/perfil` → Criar `/[role]/perfil` para cada role

### **Remover/Deprecar:**
- `/dashboard` → Substituído por `/aluno`, `/professor`, `/admin`
- `/playground` → Apenas desenvolvimento (remover em produção)
- `/avaliacoes` → Funcionalidade duplicada

### **Criar do Zero:**
- `/admin/usuarios` - CRUD de usuários
- `/admin/turmas` - CRUD de turmas
- `/professor/turmas/[id]` - Detalhes da turma
- `/aluno/historico` - Histórico de avaliações

---

## 💡 Considerações de Privacidade (LGPD)

### **Dados Sensíveis:**
- ❌ Professor NÃO vê: Respostas individuais detalhadas
- ✅ Professor VÊ: Médias, tendências, alertas (SEM nomes em gráficos)
- ✅ Aluno VÊ: Apenas seus próprios dados completos
- ✅ Admin VÊ: Tudo (com auditoria)

### **Anonimização:**
- Gráficos do professor: Pontos sem nomes
- Alertas: "3 alunos precisam de atenção" (com lista de nomes, mas sem dados)
- Comparações: Apenas percentis/médias
