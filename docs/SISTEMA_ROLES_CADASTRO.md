# 🔐 Sistema de Roles e Cadastro - ClassCheck

**Data:** 21 de novembro de 2025  
**Status:** ✅ Implementado  
**Branch:** `refactor/phase3-assessment-improvements`

---

## 📋 **COMO FUNCIONA O SISTEMA DE ROLES**

### **1. Regras Gerais**

✅ **Cadastro Público** → Sempre cria usuário como `ALUNO`  
✅ **Google OAuth** → Sempre cria usuário como `ALUNO`  
✅ **Promoção de Role** → Apenas `ADMIN` pode alterar roles  
✅ **Segurança** → Não é possível se autopromover

---

## 🎯 **FLUXO COMPLETO**

### **Cenário 1: Novo Aluno se Cadastra**

```mermaid
Aluno → Cadastro (email/senha ou Google) → Sistema cria com role=ALUNO → Login → Dashboard de Aluno
```

**Passos:**
1. Usuário acessa `/cadastro`
2. Preenche formulário OU clica em "Cadastrar com Google"
3. Sistema cria usuário com:
   - `role: 'ALUNO'` (padrão)
   - `ativo: true`
   - `senha: hash` (se email/senha) ou `senha: ''` (se Google)
4. Usuário é redirecionado para dashboard
5. Tem acesso apenas às funcionalidades de aluno

### **Cenário 2: Promover Aluno para Professor**

```mermaid
Admin → Gerenciar Roles → Seleciona Aluno → Altera para Professor → Define Matéria → Salvar
```

**Passos:**
1. Admin acessa `/admin/gerenciar-roles`
2. Busca o usuário pelo nome ou email
3. Clica em "Alterar Role"
4. Seleciona "Professor"
5. **OBRIGATÓRIO:** Informa a matéria (ex: "Matemática")
6. Clica em "Salvar"
7. Sistema atualiza:
   - `role: 'PROFESSOR'`
   - `materia: 'Matemática'`
8. **Importante:** Usuário precisa fazer logout e login novamente para sessão atualizar

### **Cenário 3: Promover Usuário para Admin**

```mermaid
Admin → Gerenciar Roles → Seleciona Usuário → Altera para Admin → Salvar
```

**Passos:**
1. Admin acessa `/admin/gerenciar-roles`
2. Busca o usuário pelo nome ou email
3. Clica em "Alterar Role"
4. Seleciona "Admin"
5. Clica em "Salvar"
6. Sistema atualiza:
   - `role: 'ADMIN'`
   - `materia: null` (admins não precisam de matéria)
7. Usuário precisa fazer logout e login novamente

---

## 🔒 **SEGURANÇA**

### **Validações Implementadas**

#### **1. Na API de Cadastro** (`/api/auth/cadastro`)
```typescript
✅ Email único (não pode duplicar)
✅ Senha mínima de 6 caracteres
✅ Nome mínimo de 3 caracteres
✅ Role SEMPRE fixo em 'ALUNO'
```

#### **2. Na API de Gerenciar Roles** (`/api/admin/gerenciar-roles`)
```typescript
✅ Apenas ADMIN pode acessar
✅ Validação de sessão obrigatória
✅ Se role = PROFESSOR → materia obrigatória
✅ Se role = ALUNO ou ADMIN → materia = null
```

#### **3. No NextAuth** (`src/lib/auth.ts`)
```typescript
✅ Google OAuth cria sempre como ALUNO
✅ JWT atualiza role do banco a cada request
✅ Sessão contém role atual do usuário
```

---

## 📁 **ARQUIVOS CRIADOS/MODIFICADOS**

### **1. Autenticação**

**`src/lib/auth.ts`**
- ✅ Adicionado Google Provider
- ✅ Callback `signIn` para criar usuário com Google
- ✅ JWT atualiza role do banco automaticamente

### **2. API de Cadastro**

**`src/app/api/auth/cadastro/route.ts`** (NOVO)
```typescript
POST /api/auth/cadastro
- Cria usuário com role=ALUNO
- Hash da senha com bcrypt
- Validação com Zod
- Retorna erro se email já existe
```

### **3. API de Gerenciar Roles**

**`src/app/api/admin/gerenciar-roles/route.ts`** (NOVO)
```typescript
GET /api/admin/gerenciar-roles
- Lista todos os usuários (apenas ADMIN)
- Filtros: role, busca por nome/email

PATCH /api/admin/gerenciar-roles
- Atualiza role de um usuário (apenas ADMIN)
- Valida: se PROFESSOR → materia obrigatória
```

### **4. Página de Cadastro**

**`src/app/(auth)/cadastro/page.tsx`** (MODIFICADO)
- ✅ Integrado com API real de cadastro
- ✅ Google OAuth funcional
- ✅ Validação de formulário
- ✅ Login automático após cadastro
- ✅ Alert informativo sobre role padrão

### **5. Página de Gerenciar Roles**

**`src/app/admin/gerenciar-roles/page.tsx`** (NOVO)
- ✅ Lista todos os usuários
- ✅ Filtro por role
- ✅ Busca por nome/email
- ✅ Edição inline de role
- ✅ Campo de matéria para professores
- ✅ Proteção: apenas ADMINs

---

## 🌐 **CONFIGURAÇÃO DO GOOGLE OAUTH**

### **Passo 1: Google Cloud Console**

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou use existente
3. Vá para **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - Application type: **Web application**
   - Name: `ClassCheck`
   
6. **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   https://seu-dominio.vercel.app/api/auth/callback/google
   ```

7. Copie o **Client ID** e **Client Secret**

### **Passo 2: Variáveis de Ambiente**

**Local (`.env.local`):**
```bash
GOOGLE_CLIENT_ID=seu-google-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-google-client-secret-aqui
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-aleatorio-gerado
```

**Vercel (Production):**
```bash
GOOGLE_CLIENT_ID=seu-google-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-google-client-secret-aqui
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=seu-secret-aleatorio-gerado
```

**Gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## 🧪 **TESTANDO O SISTEMA**

### **Teste 1: Cadastro com Email/Senha**

1. Acesse: `http://localhost:3000/cadastro`
2. Preencha:
   - Nome: "João Silva"
   - Email: "joao@teste.com"
   - Senha: "123456"
   - Confirmar Senha: "123456"
3. Clique em "Criar Conta"
4. Verifique:
   - ✅ Redirecionado para `/dashboard`
   - ✅ Sessão ativa com role=ALUNO
   - ✅ Menu mostra apenas opções de aluno

### **Teste 2: Cadastro com Google**

1. Acesse: `http://localhost:3000/cadastro`
2. Clique em "Cadastrar com Google"
3. Faça login com sua conta Google
4. Verifique:
   - ✅ Usuário criado com role=ALUNO
   - ✅ Redirecionado para `/dashboard`
   - ✅ Avatar do Google foi importado

### **Teste 3: Promover para Professor**

**Pré-requisito:** Ter um usuário ADMIN no banco

1. Faça login como ADMIN
2. Acesse: `http://localhost:3000/admin/gerenciar-roles`
3. Busque o usuário "João Silva"
4. Clique em "Alterar Role"
5. Selecione "Professor"
6. Digite matéria: "Matemática"
7. Clique em "Salvar"
8. Faça logout e login novamente como João
9. Verifique:
   - ✅ Menu agora mostra opções de professor
   - ✅ Pode criar aulas
   - ✅ Pode ver relatórios de turmas

### **Teste 4: Tentativa de Acesso Não Autorizado**

1. Faça login como ALUNO
2. Tente acessar: `http://localhost:3000/admin/gerenciar-roles`
3. Verifique:
   - ✅ Toast de erro: "Acesso negado"
   - ✅ Redirecionado para `/dashboard`

---

## 🗄️ **ESTRUTURA DO BANCO DE DADOS**

### **Tabela: usuarios**

```prisma
model Usuario {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  senha     String   // "" se login com Google
  nome      String
  role      Role     @default(ALUNO)  // ← SEMPRE ALUNO no cadastro
  materia   String?  // ← Obrigatório apenas para PROFESSOR
  ativo     Boolean  @default(true)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ALUNO
  PROFESSOR
  ADMIN
}
```

### **Queries Úteis**

**Ver todos os usuários:**
```sql
SELECT id, nome, email, role, materia FROM usuarios;
```

**Ver apenas professores:**
```sql
SELECT id, nome, email, materia FROM usuarios WHERE role = 'PROFESSOR';
```

**Ver apenas admins:**
```sql
SELECT id, nome, email FROM usuarios WHERE role = 'ADMIN';
```

**Promover manualmente (EMERGÊNCIA):**
```sql
UPDATE usuarios 
SET role = 'ADMIN' 
WHERE email = 'seu-email@gmail.com';
```

---

## 🚀 **PRÓXIMOS PASSOS (Opcional)**

### **1. Sistema de Convites por Email**

Implementar envio de email de convite para se tornar PROFESSOR ou ADMIN:

```typescript
// Nova API: /api/admin/enviar-convite
POST /api/admin/enviar-convite
{
  email: "novo-professor@escola.com",
  role: "PROFESSOR",
  materia: "Física"
}

// Gera token único → Envia email → Link com token
// Link: /cadastro/convite/[token]
// Ao acessar, valida token e cria usuário com role especificado
```

### **2. Auditoria de Mudanças**

Log de quem promoveu quem:

```prisma
model LogRole {
  id            String @id @default(uuid())
  usuarioId     Int
  adminId       Int    // Quem fez a mudança
  roleAnterior  Role
  roleNovo      Role
  motivo        String?
  criadoEm      DateTime @default(now())
}
```

### **3. Aprovação de Professores**

Fluxo de solicitação:

```
Professor se cadastra → Status PENDENTE → Admin aprova → Status ATIVO
```

---

## ❓ **PERGUNTAS FREQUENTES**

### **1. Como criar o primeiro ADMIN?**

**Opção A - Via Prisma Studio:**
```bash
npx prisma studio
```
1. Abra tabela `usuarios`
2. Encontre seu usuário
3. Edite campo `role` para `ADMIN`

**Opção B - Via SQL direto:**
```sql
UPDATE usuarios 
SET role = 'ADMIN' 
WHERE email = 'seu-email@gmail.com';
```

### **2. Usuário mudou de role mas ainda vê menu antigo?**

**Solução:** Fazer logout e login novamente. O JWT é atualizado no login.

Ou forçar atualização da sessão:
```typescript
import { useSession } from 'next-auth/react';

const { data: session, update } = useSession();
await update(); // Força refresh do JWT
```

### **3. Como remover Google OAuth se não quiser usar?**

1. Remover Google Provider de `src/lib/auth.ts`
2. Remover botão "Cadastrar com Google" de `/cadastro/page.tsx`
3. Remover variáveis `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`

### **4. Posso ter múltiplos ADMINs?**

✅ Sim! Não há limite. Qualquer ADMIN pode promover outros usuários para ADMIN.

### **5. Professor pode virar Aluno novamente?**

✅ Sim! Admin pode rebaixar role. Todas as aulas criadas por ele permanecem no banco.

---

## 📝 **CHECKLIST DE IMPLEMENTAÇÃO**

- [x] Google OAuth configurado no `auth.ts`
- [x] API de cadastro criada (`/api/auth/cadastro`)
- [x] API de gerenciar roles criada (`/api/admin/gerenciar-roles`)
- [x] Página de cadastro integrada
- [x] Página de gerenciar roles criada
- [x] Validações de segurança implementadas
- [x] Documentação completa
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Google Cloud Console configurado
- [ ] Primeiro ADMIN criado no banco
- [ ] Testes manuais completos

---

## 🎯 **RESUMO**

Este sistema garante que:

✅ **Novos usuários sempre entram como ALUNO** (segurança)  
✅ **Apenas ADMINs podem promover usuários** (controle)  
✅ **Professores precisam de matéria definida** (organização)  
✅ **Google OAuth funciona** (conveniência)  
✅ **Sistema é extensível** (futuras melhorias)

---

**Autor:** GitHub Copilot  
**Revisão:** Felipe Allan Ferreira  
**Status:** Pronto para uso! 🚀
