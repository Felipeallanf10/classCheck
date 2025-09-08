# ==============================================
# CONFIGURAÇÃO DBEAVER - CLASSCHECK
# ==============================================

## Configurações de Conexão PostgreSQL

**Host:** localhost  
**Porta:** 5433  
**Database:** classcheck_db  
**Usuário:** classcheck_user  
**Senha:** classcheck_password  

### Passos para conectar no DBeaver:

1. **Baixar DBeaver:**
   - https://dbeaver.io/download/

2. **Criar Nova Conexão:**
   - Clique em "Nova Conexão" (ícone +)
   - Selecione "PostgreSQL"

3. **Configurar Conexão:**
   ```
   Server Host: localhost
   Port: 5433
   Database: classcheck_db
   Username: classcheck_user
   Password:   
   ```

4. **Configurações Avançadas (Opcional):**
   - **Driver:** PostgreSQL JDBC Driver
   - **SSL:** Desabilitado (desenvolvimento local)
   - **Schema padrão:** public

5. **Testar Conexão:**
   - Clique em "Test Connection"
   - Se aparecer erro de driver, clique em "Download" para baixar automaticamente

### Comandos Docker Úteis:

```bash
# Subir apenas o banco PostgreSQL
docker-compose up db -d

# Ver logs do banco
docker-compose logs -f db

# Conectar diretamente no banco via terminal
docker-compose exec db psql -U classcheck_user -d classcheck_db
```

### Queries Úteis no DBeaver:

```sql
-- Ver todas as tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver estrutura de uma tabela
\d usuarios

-- Backup do banco
pg_dump -h localhost -p 5433 -U classcheck_user classcheck_db > backup.sql

-- Restaurar backup
psql -h localhost -p 5433 -U classcheck_user -d classcheck_db < backup.sql
```

### Diferenças PostgreSQL vs MySQL:

1. **Porta padrão:** 5432 → Usamos 5433 para evitar conflitos
2. **Tipos de dados:** TinyInt → SmallInt
3. **Sintaxe:** Algumas diferenças menores nas queries
4. **Case sensitivity:** PostgreSQL é case-sensitive para nomes de tabelas/colunas
5. **Autoincrement:** `SERIAL` ou `@default(autoincrement())` no Prisma
