# 🔐 Sistema de Usuário Temporário - Documentação

**Data:** 13 de Outubro de 2025  
**Status:** ✅ Implementado (Temporário)

---

## 🎯 PROBLEMA IDENTIFICADO

O sistema estava usando `usuarioId: 1` hardcoded em todas as APIs, mas o usuário real no banco é o ID `3`, causando inconsistências:

- ❌ Dashboard não exibia avaliações do usuário correto
- ❌ Novas avaliações eram salvas no usuário errado
- ❌ Dados desconexos entre usuário logado e avaliações

---

## ✅ SOLUÇÃO IMPLEMENTADA

### 1. Arquivo Central de Configuração

**Arquivo:** `src/lib/auth-temp.ts`

```typescript
export const CURRENT_USER_ID = 3

export function getCurrentUserId(): number {
  return CURRENT_USER_ID
}
```

**Vantagens:**
- ✅ Um único lugar para trocar o ID do usuário
- ✅ Facilita debug e testes
- ✅ Preparado para migração futura para auth real
- ✅ Documentação centralizada

### 2. Nova API: Minhas Avaliações

**Endpoint:** `GET /api/avaliacoes/socioemocionais/minhas`

**Antes:**
```typescript
fetch('/api/avaliacoes/socioemocionais/usuario/1') // ID fixo
```

**Depois:**
```typescript
fetch('/api/avaliacoes/socioemocionais/minhas') // Auto-detecta usuário
```

**Como funciona:**
- Importa `getCurrentUserId()` de `auth-temp.ts`
- Busca avaliações do usuário correto automaticamente
- Retorna dados formatados e prontos para o frontend

### 3. APIs Atualizadas

Todas as APIs agora usam `getCurrentUserId()`:

✅ **POST /api/avaliacoes/socioemocional**
- Salva avaliação no usuário correto
- Importa: `import { getCurrentUserId } from '@/lib/auth-temp'`

✅ **POST /api/avaliacoes/didatica**
- Salva avaliação no usuário correto
- Importa: `import { getCurrentUserId } from '@/lib/auth-temp'`

✅ **GET /api/avaliacoes/socioemocionais/minhas**
- Busca avaliações do usuário correto
- Importa: `import { getCurrentUserId } from '@/lib/auth-temp'`

### 4. Frontend Atualizado

**Página:** `src/app/relatorios/meu-estado-emocional/page.tsx`

**Antes:**
```typescript
const response = await fetch('/api/avaliacoes/socioemocionais/usuario/1')
```

**Depois:**
```typescript
const response = await fetch('/api/avaliacoes/socioemocionais/minhas')
```

---

## 🔄 COMO TROCAR DE USUÁRIO

### Método 1: Editar arquivo central (Recomendado)

1. Abra `src/lib/auth-temp.ts`
2. Altere `CURRENT_USER_ID = 3` para o ID desejado
3. Salve e recarregue a página

### Método 2: Consultar usuários no banco

```bash
npx prisma studio
```

- Abra a tabela `Usuario`
- Copie o ID desejado
- Atualize `CURRENT_USER_ID` em `auth-temp.ts`

---

## 📊 USUÁRIOS DISPONÍVEIS

### ID 1 - João Silva
- **Email:** aluno@teste.com
- **Origem:** seed-aulas.js
- **Avaliações:** 2 socioemocionais (Geografia, Português)

### ID 3 - Seu Usuário Atual
- **Email:** usuario@atual.com (ou outro)
- **Origem:** Banco de dados principal
- **Avaliações:** As que você criar testando o sistema

---

## 🚀 MIGRAÇÃO FUTURA PARA AUTH REAL

### Quando implementar NextAuth/Clerk:

**1. Atualizar `auth-temp.ts`:**

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function getCurrentUserId(): Promise<number> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error('Usuário não autenticado')
  }
  
  return parseInt(session.user.id)
}
```

**2. Atualizar APIs:**

Nenhuma mudança necessária! As APIs já importam `getCurrentUserId()`, então basta atualizar a implementação em `auth-temp.ts`.

**3. Proteger rotas:**

```typescript
// Em cada página protegida
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

export default async function Page() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }
  
  // Resto do código...
}
```

---

## 🧪 TESTANDO

### 1. Verificar Dashboard
```
http://localhost:3000/relatorios/meu-estado-emocional
```

Deve exibir avaliações do usuário ID 3.

### 2. Criar Nova Avaliação
1. Acesse `/aulas`
2. Clique em "Avaliar" em uma aula concluída
3. Complete o questionário
4. Verifique no dashboard se apareceu

### 3. Verificar no Prisma Studio
```bash
npx prisma studio
```

- Abra tabela `AvaliacaoSocioemocional`
- Confirme que `usuarioId = 3` nas novas avaliações

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

- [x] Criado `src/lib/auth-temp.ts` com `CURRENT_USER_ID = 3`
- [x] Criada API `GET /api/avaliacoes/socioemocionais/minhas`
- [x] Atualizada API `POST /api/avaliacoes/socioemocional`
- [x] Atualizada API `POST /api/avaliacoes/didatica`
- [x] Atualizado frontend `/relatorios/meu-estado-emocional`
- [x] Testado fluxo completo: avaliar → salvar → visualizar dashboard
- [x] Documentação criada

---

## ⚠️ LIMITAÇÕES ATUAIS

### Não implementado (ainda):
- ❌ Login/logout real
- ❌ Múltiplos usuários simultâneos
- ❌ Sessões persistentes
- ❌ Proteção de rotas
- ❌ Tokens JWT
- ❌ Refresh tokens
- ❌ OAuth (Google, GitHub, etc.)

### Bom o suficiente para:
- ✅ Desenvolvimento e testes
- ✅ Demonstração do TCC
- ✅ MVP funcional
- ✅ Prova de conceito

---

## 🎓 RECOMENDAÇÕES PARA PRODUÇÃO

### Opção 1: NextAuth.js (Recomendado)
```bash
npm install next-auth
```

- Integração nativa com Next.js
- Suporte a múltiplos providers
- Sessões seguras
- Amplamente utilizado

### Opção 2: Clerk
```bash
npm install @clerk/nextjs
```

- UI pronta para login/signup
- Dashboard de gerenciamento
- Webhooks para sincronização
- Plano gratuito generoso

### Opção 3: Auth0
```bash
npm install @auth0/nextjs-auth0
```

- Solução enterprise
- Compliance LGPD
- SSO e MFA
- Escalabilidade

---

## 🔗 ARQUIVOS MODIFICADOS

1. **Criados:**
   - `src/lib/auth-temp.ts` (config central)
   - `src/app/api/avaliacoes/socioemocionais/minhas/route.ts` (nova API)
   - `docs/AUTH_TEMP_SYSTEM.md` (esta documentação)

2. **Modificados:**
   - `src/app/relatorios/meu-estado-emocional/page.tsx` (usa nova API)
   - `src/app/api/avaliacoes/socioemocional/route.ts` (importa getCurrentUserId)
   - `src/app/api/avaliacoes/didatica/route.ts` (importa getCurrentUserId)

---

## ✅ RESULTADO FINAL

**Antes:**
- Dashboard vazio (buscava usuário ID 1)
- Avaliações salvas no usuário errado

**Depois:**
- ✅ Dashboard funcional (busca usuário ID 3)
- ✅ Avaliações salvas no usuário correto
- ✅ Sistema consistente
- ✅ Fácil de trocar usuário para testes
- ✅ Preparado para auth real no futuro

---

**Próximos passos:** Implementar SPRINT 4 - Dashboard Professor 🚀
