# 🚀 Guia de Deploy - ClassCheck

Este guia fornece instruções completas para fazer o deploy do ClassCheck em produção usando **Vercel** e **Neon PostgreSQL**.

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Deploy na Vercel](#-deploy-na-vercel)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Migrações de Banco](#-migrações-de-banco)
- [Seeds e Dados Iniciais](#-seeds-e-dados-iniciais)
- [Segurança em Produção](#-segurança-em-produção)
- [Monitoramento](#-monitoramento)
- [Troubleshooting](#-troubleshooting)

## 🎯 Pré-requisitos

Antes de iniciar o deploy, certifique-se de ter:

- ✅ Conta no [Vercel](https://vercel.com)
- ✅ Conta no [Neon](https://neon.tech) (PostgreSQL gratuito)
- ✅ Repositório Git (GitHub, GitLab ou Bitbucket)
- ✅ Node.js 20+ instalado localmente (para testes)
- ✅ CLI da Vercel instalada (opcional): `npm i -g vercel`

## 🗄️ Configuração do Banco de Dados

### 1. Criar Projeto no Neon

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Clique em **"Create a project"**
3. Configure:
   - **Name:** `classcheck-production`
   - **Region:** Escolha o mais próximo (ex: `aws-us-east-1`)
   - **PostgreSQL Version:** 16 (recomendado)
4. Clique em **"Create project"**

### 2. Obter Connection String

Após criar o projeto:

1. Vá em **Dashboard** → **Connection Details**
2. Copie a **Connection String** (formato: `postgresql://user:password@host/database?sslmode=require`)
3. Salve em local seguro - será usada como `DATABASE_URL`

**Exemplo:**
```
postgresql://classcheck_user:AbCd1234@ep-cool-forest-123456.us-east-1.aws.neon.tech/classcheck?sslmode=require
```

### 3. Configurar Prisma para Produção

Nenhuma alteração necessária no `schema.prisma` - Prisma já está configurado para PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## ☁️ Deploy na Vercel

### Opção 1: Deploy via Dashboard (Recomendado)

#### 1. Conectar Repositório

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório do GitHub/GitLab/Bitbucket
4. Clique em **"Import"**

#### 2. Configurar Projeto

**Configure as seguintes opções:**

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `./` (raiz) |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` (padrão) |
| **Install Command** | `npm install` |

#### 3. Configurar Variáveis de Ambiente

Na seção **"Environment Variables"**, adicione:

| Name | Value | Description |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Connection string do Neon (obtida no passo anterior) |
| `NEXTAUTH_SECRET` | `[chave-aleatoria]` | Chave secreta para JWT (gerar com `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://seu-app.vercel.app` | URL do seu app (atualizar após primeiro deploy) |
| `NODE_ENV` | `production` | Ambiente de produção |

**⚠️ IMPORTANTE:**
- Marque todas as variáveis para **Production**, **Preview** e **Development**
- `NEXTAUTH_SECRET` deve ser uma string aleatória forte (mínimo 32 caracteres)

#### 4. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. Após conclusão, clique em **"Visit"** para acessar o app

### Opção 2: Deploy via CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel

# Siga as instruções:
# - Set up and deploy? Y
# - Which scope? (selecione seu time/conta)
# - Link to existing project? N
# - What's your project's name? classcheck
# - In which directory is your code located? ./
# - Want to override the settings? N

# 4. Configurar variáveis de ambiente
vercel env add DATABASE_URL
# Cole a connection string do Neon

vercel env add NEXTAUTH_SECRET
# Cole a chave gerada com openssl

vercel env add NEXTAUTH_URL
# Digite a URL do seu app (ex: https://classcheck.vercel.app)

# 5. Deploy para produção
vercel --prod
```

## 🔐 Variáveis de Ambiente

### Gerar NEXTAUTH_SECRET

Use um dos métodos abaixo para gerar uma chave forte:

**Método 1: OpenSSL (Linux/Mac/WSL)**
```bash
openssl rand -base64 32
```

**Método 2: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Método 3: Online (use com cautela)**
- [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

### Arquivo .env.production (Referência)

**⚠️ NUNCA commitar este arquivo!**

```bash
# Database
DATABASE_URL="postgresql://user:password@host.neon.tech/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-aleatoria-de-32-caracteres"
NEXTAUTH_URL="https://classcheck.vercel.app"

# Node
NODE_ENV="production"
```

### Atualizar Variáveis de Ambiente

**Via Dashboard:**
1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Edite ou adicione variáveis
4. Clique em **"Save"**
5. Faça um novo deploy para aplicar mudanças

**Via CLI:**
```bash
# Atualizar variável existente
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production

# Listar todas as variáveis
vercel env ls
```

## 🛠️ Migrações de Banco

### 1. Aplicar Migrações em Produção

Após o primeiro deploy, você precisa aplicar as migrações ao banco de dados:

**Opção A: Via Vercel CLI (Recomendado)**

```bash
# 1. Conectar ao projeto
vercel link

# 2. Baixar variáveis de ambiente
vercel env pull .env.production.local

# 3. Aplicar migrações
DATABASE_URL="$(grep DATABASE_URL .env.production.local | cut -d '=' -f2-)" npx prisma migrate deploy

# 4. Limpar arquivo temporário
rm .env.production.local
```

**Opção B: Localmente com Connection String**

```bash
# Substitua pela sua connection string
DATABASE_URL="postgresql://user:password@host.neon.tech/database?sslmode=require" npx prisma migrate deploy
```

**Opção C: Via Vercel Build (Automatizado)**

Adicione ao `package.json`:

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

Isso executará as migrações automaticamente a cada deploy.

### 2. Verificar Migrações

```bash
# Verificar status das migrações
DATABASE_URL="[sua-connection-string]" npx prisma migrate status
```

**Output esperado:**
```
Database schema is up to date!
```

## 🌱 Seeds e Dados Iniciais

### Executar Seeds em Produção

**⚠️ ATENÇÃO:** Seeds devem ser executados apenas UMA VEZ após o deploy inicial.

```bash
# 1. Baixar variáveis de ambiente da Vercel
vercel env pull .env.production.local

# 2. Executar seed
DATABASE_URL="$(grep DATABASE_URL .env.production.local | cut -d '=' -f2-)" npx prisma db seed

# 3. Limpar arquivo temporário
rm .env.production.local
```

### Seeds Disponíveis

| Seed | Descrição | Executar? |
|------|-----------|-----------|
| `seed-completo.ts` | Usuários, turmas, vínculos | ✅ Sim (apenas uma vez) |
| `seed-adaptativo.ts` | Questionários WHO-5, PHQ-9, GAD-7, PSS-10 | ✅ Sim |
| `seed-usuarios-auth.ts` | Dados de autenticação | ✅ Sim |
| `seed-avaliacoes-mock.ts` | Avaliações de teste | ⚠️ Apenas em staging |

### Usuário Administrador Padrão

Após executar os seeds, o seguinte usuário ADMIN estará disponível:

| Campo | Valor |
|-------|-------|
| **Email** | admin@classcheck.com |
| **Senha** | senha123 |
| **Role** | ADMIN |

**⚠️ SEGURANÇA:** Altere a senha deste usuário imediatamente após o primeiro login!

## 🔒 Segurança em Produção

### Checklist de Segurança

- [ ] **NEXTAUTH_SECRET** é forte e aleatório (mínimo 32 caracteres)
- [ ] **DATABASE_URL** está configurado com `sslmode=require`
- [ ] Senha do admin padrão foi alterada
- [ ] Variáveis de ambiente **NÃO** estão commitadas no Git
- [ ] `.env*.local` está no `.gitignore`
- [ ] CORS configurado corretamente (se aplicável)
- [ ] Rate limiting implementado (próxima versão)
- [ ] HTTPS habilitado (Vercel habilita automaticamente)

### Alterar Senha do Admin Padrão

1. Faça login com `admin@classcheck.com` / `senha123`
2. Acesse **Perfil** → **Alterar Senha**
3. Preencha:
   - Senha Atual: `senha123`
   - Nova Senha: `[senha-forte-e-única]`
   - Confirmar Senha: `[repetir-senha]`
4. Clique em **"Salvar"**

### Proteção de Variáveis de Ambiente

**Adicionar ao `.gitignore`:**
```
# Variáveis de ambiente
.env
.env.local
.env*.local
.env.production.local
```

**Verificar se não foram commitadas:**
```bash
git log --all --full-history -- .env
```

Se encontrar commits com `.env`, use:
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

### Rotação de Segredos

**A cada 90 dias, rotacione:**

1. **NEXTAUTH_SECRET:**
   ```bash
   # Gerar novo secret
   openssl rand -base64 32
   
   # Atualizar na Vercel
   vercel env rm NEXTAUTH_SECRET production
   vercel env add NEXTAUTH_SECRET production
   # Cole o novo secret
   
   # Redeploy
   vercel --prod
   ```

2. **DATABASE_URL:** Se necessário, rotacione via Neon Console:
   - Neon Dashboard → Settings → Reset Password
   - Atualize a connection string na Vercel

## 📊 Monitoramento

### Vercel Analytics

1. Acesse seu projeto na Vercel
2. Vá em **Analytics**
3. Habilite **Web Analytics** (gratuito)

**Métricas disponíveis:**
- Page views
- Top pages
- Unique visitors
- Referrers

### Vercel Logs

**Via Dashboard:**
1. Vá em **Deployments**
2. Clique no deployment ativo
3. Aba **"Logs"**

**Via CLI:**
```bash
# Ver logs em tempo real
vercel logs --follow

# Filtrar por função
vercel logs --filter=/api/perfil
```

### Neon Monitoring

1. Acesse Neon Console
2. Dashboard do projeto
3. Veja métricas:
   - Connections
   - Query performance
   - Storage usage

### Alertas de Erro

Configure notificações de erro:

1. Vercel Dashboard → Settings → **Notifications**
2. Habilite:
   - ✅ Failed deployments
   - ✅ Build errors
   - ✅ Runtime errors
3. Configure destinos:
   - Email
   - Slack (opcional)
   - Discord (opcional)

## 🛠️ Troubleshooting

### Erro: "Database connection failed"

**Causa:** Connection string inválida ou banco de dados inacessível

**Solução:**
1. Verifique `DATABASE_URL` na Vercel:
   ```bash
   vercel env ls
   ```
2. Teste a connection string localmente:
   ```bash
   DATABASE_URL="[sua-connection-string]" npx prisma db pull
   ```
3. Certifique-se de que `?sslmode=require` está no final da URL
4. Verifique se o IP da Vercel está permitido no Neon (normalmente já está)

### Erro: "NextAuth JWT error"

**Causa:** `NEXTAUTH_SECRET` ausente ou inválido

**Solução:**
1. Gere um novo secret:
   ```bash
   openssl rand -base64 32
   ```
2. Adicione/atualize na Vercel:
   ```bash
   vercel env add NEXTAUTH_SECRET production
   ```
3. Redeploy:
   ```bash
   vercel --prod
   ```

### Erro: "Prisma Client is not generated"

**Causa:** Prisma Client não foi gerado durante o build

**Solução:**
1. Adicione `prisma generate` ao build script:
   ```json
   {
     "scripts": {
       "vercel-build": "prisma generate && next build"
     }
   }
   ```
2. Commit e push:
   ```bash
   git add package.json
   git commit -m "fix: adicionar prisma generate ao build"
   git push
   ```

### Erro 500: "Internal Server Error"

**Diagnóstico:**

1. **Ver logs da Vercel:**
   ```bash
   vercel logs --follow
   ```

2. **Verificar variáveis de ambiente:**
   ```bash
   vercel env ls
   ```
   Certifique-se de que todas as variáveis estão presentes.

3. **Testar localmente com env de produção:**
   ```bash
   vercel env pull .env.production.local
   npm run build
   npm run start
   ```

### Migrações não aplicadas

**Diagnóstico:**
```bash
DATABASE_URL="[connection-string]" npx prisma migrate status
```

**Se mostrar migrações pendentes:**
```bash
DATABASE_URL="[connection-string]" npx prisma migrate deploy
```

**Prevenir no futuro:** Use `vercel-build` script:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### Performance Lenta

**Otimizações:**

1. **Habilitar Edge Caching:**
   ```typescript
   // src/app/api/*/route.ts
   export const runtime = 'edge' // Para APIs leves
   ```

2. **Otimizar queries Prisma:**
   ```typescript
   // Usar select para trazer apenas campos necessários
   const users = await prisma.usuario.findMany({
     select: { id: true, nome: true, email: true }
   })
   ```

3. **Implementar ISR (Incremental Static Regeneration):**
   ```typescript
   // src/app/page.tsx
   export const revalidate = 3600 // Revalidar a cada 1 hora
   ```

4. **Habilitar Neon's Autoscaling:**
   - Neon Console → Settings → **Autoscaling** → ON

## 🔄 Deploy Contínuo

### Configurar CI/CD

Vercel automaticamente faz deploy a cada push para o branch principal. Para customizar:

**`.vercel.json`:**
```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "develop": true
    }
  },
  "framework": "nextjs",
  "buildCommand": "npm run vercel-build",
  "installCommand": "npm install",
  "regions": ["iad1"]
}
```

### Preview Deploys

Cada Pull Request gera automaticamente um preview deploy:

1. Crie um PR no GitHub
2. Vercel comenta com link do preview
3. Teste as mudanças antes de mergear
4. Merge → deploy automático para produção

### Ambientes

| Branch | Ambiente | URL | Uso |
|--------|----------|-----|-----|
| `main` | **Production** | classcheck.vercel.app | Usuários finais |
| `develop` | **Staging** | classcheck-dev.vercel.app | Testes internos |
| PRs | **Preview** | classcheck-git-{branch}.vercel.app | Review de código |

## 📋 Checklist Final

Antes de marcar o deploy como completo:

- [ ] Aplicação acessível na URL de produção
- [ ] Login funciona com credenciais de teste
- [ ] Todas as páginas carregam sem erro 500
- [ ] Migrações aplicadas (verificar com `prisma migrate status`)
- [ ] Seeds executados (admin@classcheck.com existe)
- [ ] Senha do admin padrão alterada
- [ ] Variáveis de ambiente configuradas corretamente
- [ ] HTTPS habilitado (automático na Vercel)
- [ ] Logs de erro configurados
- [ ] Analytics habilitado
- [ ] Monitoramento do banco configurado (Neon)
- [ ] Domínio customizado configurado (se aplicável)
- [ ] README atualizado com URL de produção

## 🌐 Domínio Customizado (Opcional)

### Adicionar Domínio

1. Vercel Dashboard → Settings → **Domains**
2. Clique em **"Add"**
3. Digite seu domínio (ex: `classcheck.com`)
4. Siga as instruções de DNS:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
5. Aguarde propagação DNS (até 48h)

### Atualizar NEXTAUTH_URL

Após configurar domínio:

```bash
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
# Digite: https://classcheck.com

vercel --prod
```

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Neon](https://neon.tech/docs)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

## 🆘 Suporte

Se encontrar problemas não cobertos neste guia:

1. Verifique [Vercel Status](https://www.vercel-status.com)
2. Consulte [Neon Status](https://neonstatus.com)
3. Abra uma issue no repositório do projeto
4. Contate o suporte da Vercel (para clientes pagos)

---

**Última Atualização:** Novembro 2024  
**Mantido por:** Equipe ClassCheck  
**Versão do Guia:** 1.0.0
