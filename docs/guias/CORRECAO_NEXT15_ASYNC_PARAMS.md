# 🔧 Correção: Next.js 15 - Async Params

**Branch**: `fix/next15-async-params`  
**Prioridade**: 🟡 MÉDIA (não afeta runtime, apenas TypeScript)  
**Tempo estimado**: 20-30 minutos

---

## 📋 Problema

No **Next.js 15**, os `params` em rotas dinâmicas agora são **Promise** (assíncronas) em vez de objetos síncronos.

### ❌ Antes (Next.js 14):
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id; // ✓ Síncrono
}
```

### ✅ Agora (Next.js 15):
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✓ Assíncrono
}
```

---

## 📂 Arquivos a Corrigir (14 rotas)

### 1. **Admin Routes** (3 arquivos)
- `src/app/api/admin/materias/[id]/route.ts`
- `src/app/api/admin/turmas/[id]/route.ts`
- `src/app/api/admin/usuarios/[id]/route.ts`

### 2. **Public Routes** (11 arquivos)
- `src/app/api/avaliacoes/[id]/route.ts`
- `src/app/api/eventos/[id]/route.ts`
- `src/app/api/favoritos/[id]/route.ts`
- `src/app/api/humor/[id]/route.ts`
- `src/app/api/professores/[id]/route.ts`
- `src/app/api/questionario/pergunta/[id]/route.ts`
- `src/app/api/questionarios/[id]/route.ts`
- `src/app/api/sessoes/[id]/resposta/route.ts`
- `src/app/api/sessoes/[id]/resultado/route.ts`
- `src/app/api/sessoes/[id]/route.ts`
- `src/app/api/usuarios/[id]/route.ts`

---

## 🔨 Passo a Passo para Correção

### **Para cada arquivo:**

1. **Encontrar o tipo RouteParams:**
   ```typescript
   // ❌ Remover
   interface RouteParams {
     params: { id: string };
   }
   ```

2. **Atualizar assinatura da função:**
   ```typescript
   // ❌ Antes
   export async function GET(
     request: NextRequest,
     { params }: RouteParams
   ) {
   
   // ✅ Depois
   export async function GET(
     request: NextRequest,
     { params }: { params: Promise<{ id: string }> }
   ) {
   ```

3. **Adicionar await para params:**
   ```typescript
   // ❌ Antes
   const id = Number(params.id);
   
   // ✅ Depois
   const { id: idParam } = await params;
   const id = Number(idParam);
   ```

4. **Aplicar para PUT, DELETE, PATCH:**
   - Mesma lógica para todos os métodos HTTP

---

## 📝 Exemplo Completo de Correção

### ❌ **ANTES** - `src/app/api/avaliacoes/[id]/route.ts`
```typescript
interface RouteParams {
  params: { id: string };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = Number(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const avaliacao = await prisma.avaliacaoSocioemocional.findUnique({
      where: { id },
    });
    
    return NextResponse.json(avaliacao);
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}
```

### ✅ **DEPOIS** - `src/app/api/avaliacoes/[id]/route.ts`
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const avaliacao = await prisma.avaliacaoSocioemocional.findUnique({
      where: { id },
    });
    
    return NextResponse.json(avaliacao);
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}
```

---

## ✅ Checklist de Validação

Após corrigir todos os arquivos:

- [ ] `npx tsc --noEmit` - 0 erros TypeScript
- [ ] Testar cada rota no Insomnia/Postman
- [ ] Verificar se IDs são parseados corretamente
- [ ] Commit com mensagem semântica

---

## 🎯 Commit Message

```bash
git add .
git commit -m "fix: migrar params para Promise (Next.js 15)

- Atualizar 14 rotas dinâmicas para usar async params
- Adicionar await params em todos os métodos (GET, PUT, DELETE, PATCH)
- Remover interface RouteParams antiga
- Garantir compatibilidade com Next.js 15
- Resolver erros de TypeScript em rotas [id]

Closes #[issue]"
```

---

## 📚 Referências

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [Breaking Changes: Async Request APIs](https://nextjs.org/docs/messages/sync-dynamic-apis)

---

**Boa sorte com as correções!** 🚀
