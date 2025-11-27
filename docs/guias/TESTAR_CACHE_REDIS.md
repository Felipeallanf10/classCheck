# 🧪 Como Verificar se o Cache Redis Está Funcionando

## Método 1: Teste Automatizado (Mais Fácil)

### 1. Certifique-se que o servidor está rodando
```bash
npm run dev
# ou
npm run dev:fast
```

### 2. Execute o script de teste
```bash
node scripts/test-cache-simple.js
```

### 3. Interprete os resultados

**✅ Cache FUNCIONANDO:**
```
1️⃣  Primeira chamada (MISS esperado)...
   Tempo: 1523ms

2️⃣  Segunda chamada (HIT esperado)...
   Tempo: 245ms

📊 Resultado:
   Primeira: 1523ms
   Segunda:  245ms
   Diferença: 1278ms (84% mais rápido)

✅ Cache FUNCIONANDO! Segunda chamada >50% mais rápida
```

**❌ Cache NÃO funcionando:**
```
1️⃣  Primeira chamada (MISS esperado)...
   Tempo: 1450ms

2️⃣  Segunda chamada (HIT esperado)...
   Tempo: 1380ms

📊 Resultado:
   Primeira: 1450ms
   Segunda:  1380ms
   Diferença: 70ms (5% mais rápido)

❌ Cache NÃO funcionando (tempos similares)
```

---

## Método 2: Verificar Logs do Servidor (Mais Detalhado)

### 1. Inicie o servidor e observe o console

**Com Redis configurado:**
```
[Cache] Redis configurado com sucesso
```

**Sem Redis (usando fallback):**
```
[Cache] Redis não configurado - usando fallback em memória
```

### 2. Faça uma chamada à API
```bash
# Terminal 1: servidor rodando
npm run dev

# Terminal 2: fazer requisições
curl http://localhost:3000/api/relatorios?tipo=geral
```

### 3. Observe os logs do servidor

**Primeira chamada (MISS):**
```
[Cache] MISS: relatorios:geral:2025-10-23T00:00:00.000Z:2025-11-22T00:00:00.000Z
[Cache] SET (Redis): relatorios:geral:... (TTL: 600s)
```
ou
```
[Cache] MISS: relatorios:geral:...
[Cache] SET (Memory): relatorios:geral:... (TTL: 600s)
```

**Segunda chamada (HIT):**
```
[Cache] HIT (Redis): relatorios:geral:...
```
ou
```
[Cache] HIT (Memory): relatorios:geral:...
```

---

## Método 3: Usando Ferramentas HTTP

### Postman / Insomnia

1. **GET** `http://localhost:3000/api/relatorios?tipo=geral`
2. Observe o tempo da primeira requisição (ex: 1500ms)
3. Repita a mesma requisição
4. Segunda deve ser muito mais rápida (ex: 300ms)

### cURL com tempo

```bash
# Primeira chamada
time curl http://localhost:3000/api/relatorios?tipo=geral

# Segunda chamada (deve ser mais rápida)
time curl http://localhost:3000/api/relatorios?tipo=geral
```

---

## Método 4: API Admin de Estatísticas (Requer ADMIN)

### 1. Faça login como ADMIN no sistema

### 2. Acesse a API de estatísticas

**GET** `/api/admin/cache`

**Response esperada:**
```json
{
  "sucesso": true,
  "dados": {
    "tipo": "redis",           // ou "memory"
    "keysTotal": 12,           // número de chaves no cache
    "conectado": true          // true se Redis está conectado
  }
}
```

### 3. Limpar cache (se necessário)

**DELETE** `/api/admin/cache`

**Response esperada:**
```json
{
  "sucesso": true,
  "mensagem": "Cache limpo com sucesso"
}
```

---

## 🔍 Troubleshooting

### Cache não está funcionando

1. **Verifique se o servidor reiniciou** após adicionar variáveis Redis
2. **Verifique o .env**:
   ```bash
   cat .env | grep REDIS
   ```
3. **Teste a conexão Redis** (se configurado):
   ```bash
   # No código, adicionar:
   await verificarConexao()
   ```

### Usando fallback em memória (sem Redis)

**Isso é normal!** O sistema funciona perfeitamente sem Redis:
- Cache em memória é rápido para desenvolvimento
- Só é perdido quando o servidor reinicia
- Para produção, recomenda-se Redis

### Redis configurado mas não conectando

1. **Verifique as credenciais** no .env
2. **Teste a URL** do Redis:
   ```bash
   curl https://your-endpoint.upstash.io
   ```
3. **Verifique os logs** do servidor ao iniciar

---

## 📊 Métricas Esperadas

### Com Cache HIT (segunda+ chamadas)

| API | Sem Cache | Com Cache | Melhora |
|-----|-----------|-----------|---------|
| Relatório Geral | ~2000ms | ~800ms | 60% |
| Relatório Professor | ~1500ms | ~600ms | 60% |
| Relatório Aluno | ~1200ms | ~400ms | 67% |
| Dashboard Turma | ~1800ms | ~700ms | 61% |

### Tempo de TTL (Time To Live)

| Cache | TTL | Motivo |
|-------|-----|--------|
| Relatório Geral | 600s (10min) | Dados mudam pouco |
| Relatório Professor | 300s (5min) | Dados moderados |
| Relatório Aluno | 300s (5min) | Dados moderados |
| Dashboard Turma | 300s (5min) | Atualiza frequentemente |

---

## 💡 Dicas

1. **Cache é invalidado automaticamente** quando:
   - Aluno finaliza uma sessão de questionário
   - Nova resposta é registrada

2. **Para testar a invalidação**:
   - Faça uma chamada (cache MISS)
   - Faça outra chamada (cache HIT)
   - Finalize uma sessão de questionário
   - Faça outra chamada (cache MISS novamente)

3. **Redis vs Memory**:
   - Redis: cache compartilhado entre instâncias (produção)
   - Memory: cache por instância (desenvolvimento)

---

**Precisa de ajuda?** Verifique os logs do servidor sempre que fizer requisições!
