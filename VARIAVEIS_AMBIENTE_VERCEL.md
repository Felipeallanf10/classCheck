# 🔐 Variáveis de Ambiente - Vercel

**IMPORTANTE:** Configure estas variáveis no dashboard da Vercel antes do deploy.

## 📋 Como Configurar na Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto: **classCheck**
3. Vá em: **Settings** → **Environment Variables**
4. Adicione cada variável abaixo

---

## ⚙️ Variáveis Obrigatórias

### 1. NODE_ENV
```
Chave: NODE_ENV
Valor: production
Environments: Production, Preview
```

### 2. NEXTAUTH_URL ⚠️ CRÍTICO
```
Chave: NEXTAUTH_URL
Valor: https://class-check-git-refactor-phase3-014efc-felipeallanf10s-projects.vercel.app
Environments: Production

OU use a URL principal do projeto:
Valor: https://classcheck.vercel.app
```

**IMPORTANTE:** 
- Esta URL **DEVE** ser exatamente a URL onde o site está hospedado
- Sem barra no final
- Incluir `https://`
- Atualizar se a URL mudar

### 3. NEXTAUTH_SECRET ⚠️ CRÍTICO
```
Chave: NEXTAUTH_SECRET
Valor: <gerar-string-aleatória-segura>
Environments: Production, Preview
```

**Como gerar um secret seguro:**
```bash
# Opção 1: OpenSSL
openssl rand -base64 32

# Opção 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opção 3: Online
https://generate-secret.vercel.app/32
```

### 4. DATABASE_URL ⚠️ CRÍTICO
```
Chave: DATABASE_URL
Valor: postgresql://neondb_owner:npg_0z5YpCHQZFdI@ep-young-poetry-ady8mgnb-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
Environments: Production, Preview
```

**IMPORTANTE:**
- Use a connection string do Neon PostgreSQL
- Incluir `?sslmode=require` no final
- Verificar se o banco está ativo e acessível

---

## 🔧 Variáveis Opcionais

### 5. NEXTAUTH_URL_INTERNAL (Para Preview Deployments)
```
Chave: NEXTAUTH_URL_INTERNAL
Valor: http://localhost:3000
Environments: Development (opcional)
```

### 6. JWT_SECRET (Se usar tokens customizados)
```
Chave: JWT_SECRET
Valor: <string-aleatória-diferente-do-nextauth-secret>
Environments: Production, Preview
```

---

## ✅ Checklist de Configuração

### Passo 1: Gerar Secrets
- [ ] Gerar NEXTAUTH_SECRET usando comando acima
- [ ] Copiar secret gerado

### Passo 2: Verificar URLs
- [ ] Confirmar URL exata do deploy na Vercel
- [ ] Copiar URL completa (com https://)

### Passo 3: Configurar na Vercel
- [ ] Adicionar NODE_ENV=production
- [ ] Adicionar NEXTAUTH_URL com URL correta
- [ ] Adicionar NEXTAUTH_SECRET gerado
- [ ] Adicionar DATABASE_URL do Neon

### Passo 4: Aplicar e Redeploy
- [ ] Salvar todas as variáveis
- [ ] Fazer redeploy do projeto (Deployments → ⋯ → Redeploy)
- [ ] Aguardar build completar

### Passo 5: Testar
- [ ] Acessar URL de produção
- [ ] Fazer login
- [ ] Verificar se redirect funciona
- [ ] Confirmar sessão persistindo

---

## 🐛 Troubleshooting

### Erro: "Invalid NEXTAUTH_URL"
✅ Verifique se NEXTAUTH_URL está configurado EXATAMENTE como a URL da Vercel
✅ Não pode ter barra no final
✅ Deve incluir https://

### Erro: "No secret provided"
✅ Verifique se NEXTAUTH_SECRET está configurado
✅ Deve ter pelo menos 32 caracteres
✅ Use base64 ou string aleatória segura

### Login funciona mas não redireciona
✅ Verifique NEXTAUTH_URL
✅ Limpe cookies do navegador
✅ Faça hard refresh (Ctrl+Shift+R)
✅ Verifique logs da Vercel (Functions → Logs)

### Sessão não persiste
✅ Verifique se cookies estão sendo setados (DevTools → Application → Cookies)
✅ Procure por `__Secure-next-auth.session-token`
✅ Verifique se NEXTAUTH_SECRET está igual em todos os ambientes

---

## 📊 Exemplo de Configuração Completa

```bash
# Produção
NODE_ENV=production
NEXTAUTH_URL=https://classcheck.vercel.app
NEXTAUTH_SECRET=<SEU-SECRET-GERADO-32-CHARS>
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Preview (opcional)
NEXTAUTH_URL=https://classcheck-git-branch-name.vercel.app
```

---

## 🔒 Segurança

⚠️ **NUNCA** commite secrets no Git
⚠️ **NUNCA** compartilhe NEXTAUTH_SECRET publicamente
⚠️ **SEMPRE** use HTTPS em produção
⚠️ **SEMPRE** use secrets diferentes para cada ambiente

---

## 📞 Comandos Úteis

### Gerar novo secret
```bash
openssl rand -base64 32
```

### Ver variáveis configuradas (Vercel CLI)
```bash
vercel env ls
```

### Adicionar variável (Vercel CLI)
```bash
vercel env add NEXTAUTH_SECRET production
```

---

**Última atualização:** 20/11/2025  
**Autor:** GitHub Copilot
