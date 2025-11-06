# 🔄 Guia de Migração: MySQL → PostgreSQL

Este guia orienta como migrar completamente do MySQL para PostgreSQL no projeto ClassCheck.

## ✅ O que foi alterado

### 1. **Docker Compose** (`docker-compose.yml`)
- ✅ MySQL 8.0 → PostgreSQL 16
- ✅ Porta 3307 → 5433
- ✅ phpMyAdmin removido (usar DBeaver)
- ✅ Variáveis de ambiente atualizadas

### 2. **Schema Prisma** (`prisma/schema.prisma`)
- ✅ Provider: `mysql` → `postgresql`
- ✅ Tipos ajustados: `@db.TinyInt` → `@db.SmallInt`
- ✅ URL de conexão atualizada

### 3. **Dependências** (`package.json`)
- ✅ Adicionado: `pg` e `@types/pg`

### 4. **Configurações de Ambiente**
- ✅ `.env.example` atualizado
- ✅ DATABASE_URL com PostgreSQL

### 5. **Documentação**
- ✅ README.md atualizado
- ✅ Guia do DBeaver criado

## 🚀 Como fazer a migração

### Opção 1: Script Automático (Recomendado)

```bash
# Dar permissão de execução ao script
chmod +x scripts/migrate-to-postgresql.sh

# Executar migração
./scripts/migrate-to-postgresql.sh
```

### Opção 2: Migração Manual

#### 1. **Parar ambiente atual**
```bash
docker-compose down -v
```

#### 2. **Limpar volumes MySQL (opcional)**
```bash
docker volume prune -f
```

#### 3. **Atualizar variáveis de ambiente**
```bash
# Criar .env.local se não existir
cp .env.example .env.local

# Verificar se DATABASE_URL está correto:
# DATABASE_URL="postgresql://classcheck_user:classcheck_password@localhost:5433/classcheck_db?schema=public"
```

#### 4. **Gerar Prisma Client**
```bash
npx prisma generate
```

#### 5. **Subir PostgreSQL**
```bash
docker-compose up db -d

# Aguardar PostgreSQL estar pronto (15-30 segundos)
```

#### 6. **Executar migrações**
```bash
npx prisma migrate dev --name "init_postgresql"
```

#### 7. **Subir aplicação completa**
```bash
docker-compose up -d
```

## 📊 Configurar DBeaver

### 1. **Baixar DBeaver**
- https://dbeaver.io/download/

### 2. **Criar nova conexão PostgreSQL**
```
Host: localhost
Port: 5433
Database: classcheck_db
Username: classcheck_user
Password: classcheck_password
```

### 3. **Testar conexão**
- Clique em "Test Connection"
- Se necessário, baixe o driver PostgreSQL

Veja o guia completo: [`docs/DBEAVER_SETUP.md`](DBEAVER_SETUP.md)

## 🔍 Verificação

### 1. **Testar conexão**
```bash
# Via Docker
docker-compose exec db psql -U classcheck_user -d classcheck_db -c "SELECT version();"

# Via terminal local (se tiver psql instalado)
psql -h localhost -p 5433 -U classcheck_user -d classcheck_db -c "SELECT version();"
```

### 2. **Verificar aplicação**
- Acesse: http://localhost:3000
- Verifique se não há erros de conexão

### 3. **Prisma Studio**
```bash
npx prisma studio
```

## ⚠️ Possíveis problemas

### 1. **Erro "Port already in use"**
```bash
# Verificar se algo está usando a porta 5433
lsof -i :5433

# Parar todos os containers
docker-compose down
docker system prune -f
```

### 2. **Erro de permissão no script**
```bash
chmod +x scripts/migrate-to-postgresql.sh
```

### 3. **Erro de conexão PostgreSQL**
```bash
# Aguardar mais tempo
sleep 30

# Verificar logs
docker-compose logs db
```

### 4. **Prisma Client desatualizado**
```bash
npx prisma generate
npm run build
```

## 🔙 Como voltar para MySQL (se necessário)

1. Restaurar arquivos:
   - `docker-compose.yml`
   - `prisma/schema.prisma`
   - `.env.example`

2. Remover dependências PostgreSQL:
   ```bash
   npm uninstall pg @types/pg
   ```

3. Executar:
   ```bash
   docker-compose down -v
   npx prisma generate
   docker-compose up --build
   ```

## 📝 Diferenças importantes

| Aspecto | MySQL | PostgreSQL |
|---------|-------|------------|
| **Porta padrão** | 3306 | 5432 (usamos 5433) |
| **Tipos** | TinyInt | SmallInt |
| **Case Sensitivity** | Não | Sim |
| **String de conexão** | mysql:// | postgresql:// |
| **Admin Tool** | phpMyAdmin | DBeaver/pgAdmin |

## ✅ Checklist pós-migração

- [ ] PostgreSQL funcionando na porta 5433
- [ ] Aplicação conecta ao banco sem erros
- [ ] Prisma migrations executadas
- [ ] DBeaver conecta ao banco
- [ ] Funcionalidades da aplicação funcionam
- [ ] README.md e documentação atualizados

---

**💡 Dica**: Mantenha um backup dos dados importantes antes de fazer a migração!
