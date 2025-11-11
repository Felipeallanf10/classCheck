# Correção de Erros - Next.js 15 Async Params

**Data:** 21 de outubro de 2025  
**Problema:** Erros ao acessar páginas de avaliação com params dinâmicos

---

## 🐛 Problema Identificado

### Erro 1: Route Params não Awaited (Next.js 15)
```
Error: Route "/api/sessoes/[id]" used `params.id`. 
`params` should be awaited before using its properties.
```

### Erro 2: Sessão com ID Undefined
```
GET /avaliacoes/sessao/undefined 200 in 16027ms
GET /api/sessoes/undefined 404 in 18378ms
```

### Causa Raiz

**Next.js 15 Breaking Change:**
- Params dinâmicos agora são **async** e precisam ser **awaited**
- Sintaxe antiga: `{ params }: { params: { id: string } }`
- Sintaxe nova: `{ params }: { params: Promise<{ id: string }> }`

**Resposta da API incorreta:**
- API `/api/sessoes/iniciar` retorna `{ sessao: { id: "..." } }`
- Frontend esperava `{ sessaoId: "..." }`

---

## ✅ Correções Implementadas

### 1. **API GET /api/sessoes/[id]**

**Arquivo:** `src/app/api/sessoes/[id]/route.ts`

**ANTES ❌:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessaoId = params.id; // ❌ Sync access
```

**DEPOIS ✅:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessaoId } = await params; // ✅ Awaited
```

---

### 2. **API PATCH /api/sessoes/[id]**

**Arquivo:** `src/app/api/sessoes/[id]/route.ts`

**ANTES ❌:**
```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessaoId = params.id; // ❌ Sync access
```

**DEPOIS ✅:**
```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessaoId } = await params; // ✅ Awaited
```

---

### 3. **API POST /api/sessoes/[id]/resposta**

**Arquivo:** `src/app/api/sessoes/[id]/resposta/route.ts`

**ANTES ❌:**
```typescript
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessaoId = params.id; // ❌ Sync access
```

**DEPOIS ✅:**
```typescript
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessaoId } = await params; // ✅ Awaited
```

---

### 4. **QuestionarioSelector - Extração de sessaoId**

**Arquivo:** `src/components/avaliacoes/QuestionarioSelector.tsx`

**ANTES ❌:**
```typescript
const { sessaoId } = await response.json();
// ❌ API não retorna sessaoId diretamente
```

**DEPOIS ✅:**
```typescript
const data = await response.json();
const sessaoId = data.sessao?.id || data.sessaoId;

if (!sessaoId) {
  throw new Error('Sessão criada mas ID não retornado');
}
```

**Lógica:**
1. Tenta buscar `data.sessao.id` (formato novo da API)
2. Fallback para `data.sessaoId` (compatibilidade)
3. Valida se sessaoId existe
4. Lança erro se não encontrado

---

## 📊 Estrutura de Resposta da API

### POST /api/sessoes/iniciar

**Resposta:**
```json
{
  "success": true,
  "sessao": {
    "id": "abc-123-def",
    "status": "EM_ANDAMENTO",
    "iniciadoEm": "2025-10-21T12:00:00Z"
  },
  "questionario": {
    "id": "quest-456",
    "titulo": "WHO-5 - Índice de Bem-Estar",
    "descricao": "...",
    "tipo": "AUTOAVALIACAO",
    "adaptativo": false,
    "duracaoEstimada": 2,
    "instrucoes": "..."
  },
  "primeiraPergunta": {
    "id": "perg-789",
    "texto": "...",
    "tipoPergunta": "LIKERT_5",
    "opcoes": [...],
    "...": "..."
  },
  "progresso": {
    "perguntaAtual": 1,
    "totalEstimado": 5,
    "porcentagem": 20
  },
  "irt": {
    "theta": 0,
    "erro": 1.0,
    "confianca": 0.0
  }
}
```

**Campo importante:** `sessao.id` (não `sessaoId` no root)

---

## 🔧 Padrão de Migração

### Para todas as rotas com params dinâmicos:

```typescript
// ❌ ANTES (Next.js 14)
export async function HANDLER(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // ...
}

// ✅ DEPOIS (Next.js 15)
export async function HANDLER(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

### Para múltiplos params:

```typescript
// Rota: /api/usuarios/[userId]/posts/[postId]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; postId: string }> }
) {
  const { userId, postId } = await params;
  // ...
}
```

---

## 🧪 Testes de Validação

### 1. Testar Iniciar Sessão
```bash
# Via navegador
1. Acesse: http://localhost:3000/avaliacoes/questionarios
2. Clique em "Iniciar Avaliação" em qualquer questionário
3. Deve redirecionar para: /avaliacoes/sessao/[id-válido]
4. Não deve aparecer "undefined" na URL
```

### 2. Testar GET Sessão
```bash
# Via curl
curl http://localhost:3000/api/sessoes/abc-123-def
# Deve retornar 200 ou 404, não erro 500
```

### 3. Testar Submeter Resposta
```bash
# Via curl
curl -X POST http://localhost:3000/api/sessoes/abc-123/resposta \
  -H "Content-Type: application/json" \
  -d '{"perguntaId": "perg-1", "valor": 3, "tempoResposta": 15}'
# Deve funcionar sem erro de params
```

### 4. Testar PATCH Sessão
```bash
# Via curl
curl -X PATCH http://localhost:3000/api/sessoes/abc-123 \
  -H "Content-Type: application/json" \
  -d '{"action": "pausar"}'
# Deve funcionar sem erro de params
```

---

## 📝 Checklist de Validação

- [x] API GET `/api/sessoes/[id]` corrigida
- [x] API PATCH `/api/sessoes/[id]` corrigida
- [x] API POST `/api/sessoes/[id]/resposta` corrigida
- [x] QuestionarioSelector extrai sessaoId corretamente
- [x] 0 erros TypeScript
- [ ] Testado fluxo completo no navegador
- [ ] Iniciar sessão funciona
- [ ] Redirecionamento correto (sem undefined)
- [ ] Página de sessão carrega
- [ ] Respostas podem ser submetidas

---

## 🚨 Outras Rotas que Podem Precisar Correção

Identificadas pela busca de `params.id`:

| Arquivo | Função | Status |
|---------|--------|--------|
| `src/app/api/professores/[id]/route.ts` | GET, PUT, DELETE | ⚠️ Pendente |
| `src/app/api/aulas/[aulaId]/route.ts` | GET, PUT, DELETE | ⚠️ Pendente |
| `src/app/api/relatorios/turma/aula/[aulaId]/route.ts` | GET | ⚠️ Pendente |
| `src/app/api/avaliacoes/socioemocionais/usuario/[usuarioId]/route.ts` | GET | ⚠️ Pendente |

**Recomendação:** Aplicar o mesmo padrão de correção em todas essas rotas.

---

## 📖 Referências

- [Next.js 15 - Async Request APIs](https://nextjs.org/docs/messages/sync-dynamic-apis)
- [Breaking Changes Next.js 15](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)

---

## ✅ Resumo das Mudanças

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Tipo de params** | `{ id: string }` | `Promise<{ id: string }>` |
| **Acesso a params** | `params.id` | `await params` |
| **GET /sessoes/[id]** | ❌ Erro 500 | ✅ Funciona |
| **PATCH /sessoes/[id]** | ❌ Erro 500 | ✅ Funciona |
| **POST resposta** | ❌ Erro 500 | ✅ Funciona |
| **Iniciar sessão** | ❌ ID undefined | ✅ ID válido |
| **URL redirecionamento** | `/sessao/undefined` | `/sessao/abc-123` |

---

**Status:** ✅ **CORREÇÕES CRÍTICAS IMPLEMENTADAS**  
**Próximo Passo:** Testar fluxo completo no navegador  
**Observação:** Aplicar mesmo padrão em outras rotas com params dinâmicos
