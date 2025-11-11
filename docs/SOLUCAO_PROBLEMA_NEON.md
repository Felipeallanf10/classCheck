# 🔧 Solução para Problema de Conexão com Neon Database

## 🚨 Problema Identificado

```
Error: P1001: Can't reach database server at ep-young-poetry-ady8mgnb-pooler.c-2.us-east-1.aws.neon.tech:5432
```

## 📋 Possíveis Causas

1. **Banco suspenso** (mais provável): Neon suspende bancos gratuitos após ~5 minutos de inatividade
2. **Conexão de rede**: Firewall ou problema de DNS
3. **Credenciais expiradas**: Connection string pode ter expirado
4. **Limite de conexões**: Pool de conexões pode estar cheio

## ✅ Soluções (em ordem de preferência)

### Opção 1: Aguardar e Reativar (RECOMENDADO)

O Neon leva de 10-30 segundos para "acordar" um banco suspenso.

```bash
# Tente novamente após 30 segundos
npx prisma db push
```

Se funcionar, depois rode:
```bash
npx prisma migrate dev --name sistema_turmas_e_auth
```

### Opção 2: Obter Nova Connection String

1. Acesse: https://console.neon.tech/
2. Selecione seu projeto
3. Na aba "Connection Details", copie a nova connection string
4. Atualize `.env`:
   ```
   DATABASE_URL="postgresql://..."
   ```

### Opção 3: Usar Docker PostgreSQL Local (MAIS RÁPIDO)

Você já tem `docker-compose.yml` configurado! Vamos usar o banco local:

```bash
# 1. Subir o banco PostgreSQL local
docker-compose up -d postgres

# 2. Atualizar .env para usar banco local
# Substituir DATABASE_URL por:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/classcheck_dev"

# 3. Rodar migration
npx prisma migrate dev --name sistema_turmas_e_auth

# 4. Rodar seed de usuários
npx tsx prisma/seed-usuarios-auth.ts
```

**VANTAGENS DO DOCKER LOCAL:**
- ✅ Sem limites de tempo/inatividade
- ✅ Mais rápido (sem latência de rede)
- ✅ Funciona offline
- ✅ Grátis e ilimitado

### Opção 4: Criar Novo Banco Neon

Se o banco atual está com problemas persistentes:

1. Acesse https://console.neon.tech/
2. Crie um novo projeto
3. Copie a connection string
4. Atualize `.env`
5. Rode as migrations

## 🎯 Recomendação Atual

**Use o Docker local para desenvolvimento!** 

Você já tem a infraestrutura pronta no `docker-compose.yml`. É muito mais prático para desenvolvimento e testes.

Reserve o Neon para staging/produção ou para compartilhar o banco entre máquinas.

## 📝 Próximos Passos (com Docker)

```bash
# 1. Subir banco local
docker-compose up -d postgres

# 2. Ajustar .env (criar .env.local)
cp .env .env.neon  # backup da config Neon
cat > .env << EOF
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/classcheck_dev"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=FJWW/TImrwUUl7/ypB9Kzc1I5Lfox9nADyAA4t9tLg4=
JWT_SECRET=your-jwt-secret-change-in-production
DEBUG=false
LOG_LEVEL=info
EOF

# 3. Aplicar migrations
npx prisma migrate dev --name sistema_turmas_e_auth

# 4. Popular com dados de teste
npx tsx prisma/seed-usuarios-auth.ts

# 5. Iniciar app
npm run dev
```

## 🔄 Para Voltar ao Neon Depois

```bash
# Restaurar .env original
cp .env.neon .env

# OU editar DATABASE_URL manualmente
```

---

**Decisão:** O que você prefere fazer?

1. ⏰ **Aguardar** o Neon reconectar (30-60 segundos)
2. 🐳 **Docker local** (recomendado para dev - 2 minutos)
3. 🌐 **Nova connection** string do Neon
