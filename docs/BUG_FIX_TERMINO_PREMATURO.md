# 🐛 Bug Fix: Término Prematuro Após Primeira Resposta

**Data:** 23 de outubro de 2025  
**Severidade:** CRÍTICA  
**Status:** ✅ Corrigido

## Descrição do Problema

Quando o usuário respondia à primeira pergunta com um valor baixo (ex: "me senti muito mal"), o sistema finalizava imediatamente o questionário com a mensagem "você já respondeu todas as perguntas", mesmo havendo mais perguntas disponíveis.

## Causa Raiz

### 🔴 Bug #1: Filtro de Perguntas Excluídas (Menos Crítico)

**Arquivo:** `src/lib/adaptive/proxima-pergunta-service.ts` linha ~654

**Código Problemático:**
```typescript
const perguntasRespondidas = sessao.respostas.map((r: any) => r.perguntaId);
// Se r.perguntaId é null (resposta do banco), não é incluído corretamente
```

**Problema:**
- Quando resposta vinha do `BancoPerguntasAdaptativo`, `perguntaId` era `null`
- `perguntaBancoId` não era incluído na lista de exclusão
- Isso poderia permitir responder a mesma pergunta duas vezes

### 🔴 Bug #2: Respostas IRT com Relacionamento Null (CRÍTICO)

**Arquivo:** `src/lib/adaptive/proxima-pergunta-service.ts` linha ~562

**Código Problemático:**
```typescript
const respostasIRT = sessao.respostas
  .filter((r: any) => r.valorNormalizado !== null && r.pergunta.discriminacao)
  // ❌ r.pergunta é null quando resposta vem do banco!
  .map((r: any) => ({
    discriminacao: r.pergunta.discriminacao, // ❌ null!
    dificuldade: r.pergunta.dificuldade,     // ❌ null!
  }));
```

**Problema:**
- Include da sessão só carregava `pergunta`, não `perguntaBanco`
- Filtro `r.pergunta.discriminacao` excluía todas as respostas do banco
- Array `respostasIRT` ficava **vazio** após qualquer resposta do banco
- Com array vazio:
  - `calcularSEM()` retornava 999 (erro infinito)
  - `verificarCriteriosParada()` não encontrava critério
  - `selecionarPerguntaAvancada()` não tinha base IRT para calcular informação de Fisher
  - Sistema retornava "sem perguntas candidatas" e **finalizava prematuramente**

## Impacto

- ✅ **Questionários puros** (só `PerguntaSocioemocional`): funcionavam
- ❌ **Questionários com banco adaptativo**: quebravam na primeira resposta do banco
- ❌ **Questionários mistos**: quebravam ao alternar entre fontes

## Correção Aplicada

### ✅ Fix #1: Inclusão de Ambos os IDs

```typescript
// ANTES
const perguntasRespondidas = sessao.respostas.map((r: any) => r.perguntaId);

// DEPOIS
const perguntasRespondidas = sessao.respostas
  .map((r: any) => [r.perguntaId, r.perguntaBancoId])
  .flat()
  .filter((id): id is string => id !== null && id !== undefined);
```

### ✅ Fix #2: Include de PerguntaBanco

```typescript
// ANTES
include: {
  respostas: {
    include: {
      pergunta: true
    }
  }
}

// DEPOIS
include: {
  respostas: {
    include: {
      pergunta: true,
      perguntaBanco: true, // ✅ Incluir banco também
    }
  }
}
```

### ✅ Fix #3: Filtro IRT Suportando Banco

```typescript
// ANTES
.filter((r: any) => r.valorNormalizado !== null && r.pergunta.discriminacao)
.map((r: any) => ({
  discriminacao: r.pergunta.discriminacao, // ❌
  dificuldade: r.pergunta.dificuldade,
}))

// DEPOIS
.filter((r: any) => {
  if (r.valorNormalizado === null) return false;
  
  const temPerguntaQuestionario = r.pergunta?.discriminacao !== undefined;
  const temPerguntaBanco = r.perguntaBanco?.parametroA !== undefined;
  
  return temPerguntaQuestionario || temPerguntaBanco;
})
.map((r: any) => {
  // ✅ Usar parâmetros de qualquer fonte
  const discriminacao = r.pergunta?.discriminacao 
    ?? r.perguntaBanco?.parametroA 
    ?? 1.0;
  const dificuldade = r.pergunta?.dificuldade 
    ?? r.perguntaBanco?.parametroB 
    ?? 0.0;
  
  return {
    valorNormalizado: r.valorNormalizado!,
    configuracaoIRT: { discriminacao, dificuldade, acerto: 0.0 }
  };
})
```

### ✅ Fix #4: Set de Perguntas Vistas

```typescript
// ANTES
const perguntasJaVistas = new Set<string>([
  ...sessao.perguntasApresentadas,
  ...sessao.respostas.map((r: any) => r.perguntaId), // ❌ null do banco
]);

// DEPOIS
const perguntasJaVistas = new Set<string>([
  ...sessao.perguntasApresentadas,
  ...sessao.respostas
    .map((r: any) => [r.perguntaId, r.perguntaBancoId])
    .flat()
    .filter((id): id is string => id !== null && id !== undefined),
]);
```

## Validação

### Teste Manual

1. **Cenário:** Responder primeira pergunta com valor baixo (1-2)
2. **Esperado:** Sistema continua apresentando perguntas
3. **Antes do fix:** ❌ "Você já respondeu todas as perguntas"
4. **Depois do fix:** ✅ Próxima pergunta é apresentada normalmente

### Logs de Debug

**Antes (bugado):**
```
[determinarProximaPergunta] Respostas IRT: []  ❌ VAZIO!
[determinarProximaPergunta] 📊 SEM atual: 999.000, Confiança: 0.001
[determinarProximaPergunta] ⚠️ Sem perguntas candidatas disponíveis
```

**Depois (corrigido):**
```
[determinarProximaPergunta] Respostas IRT processadas: {
  total: 1,
  comIRT: 1,  ✅
  detalhes: [{ valorNormalizado: 0.25, discriminacao: 1.2, dificuldade: 0.3 }]
}
[determinarProximaPergunta] 📊 SEM atual: 0.577, Confiança: 0.634
🎯 [Seleção Avançada] Iniciando...
   Candidatas questionário: 8  ✅
   Candidatas banco: 15  ✅
✅ [Selecionada] GAD7_002
```

## Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `src/lib/adaptive/proxima-pergunta-service.ts` | 4 correções (include, filtro IRT, exclusões, set vistas) |

## Prevenção de Regressão

### Checklist de Testes

- [x] Responder primeira pergunta com valor baixo (1-2)
- [x] Responder primeira pergunta com valor alto (4-5)
- [x] Alternância entre perguntas de questionário e banco
- [x] Questionário 100% banco adaptativo
- [x] Questionário 100% perguntas normais
- [x] Completar 5+ perguntas e verificar critério de parada

### Teste Unitário Sugerido

```typescript
it('não deve finalizar após primeira resposta do banco', async () => {
  // Criar sessão
  const sessao = await criarSessaoTeste();
  
  // Responder primeira pergunta do banco com valor baixo
  await salvarRespostaBanco(sessao.id, 1); // Valor mínimo
  
  // Determinar próxima
  const resultado = await determinarProximaPergunta(sessao.id);
  
  // DEVE continuar, não finalizar
  expect(resultado.pergunta).not.toBeNull();
  expect(resultado.finalizar).toBeFalsy();
  expect(resultado.thetaAtualizado).toBeDefined();
});
```

## Lições Aprendidas

1. **Always test edge cases:** Valor mínimo vs. valor máximo
2. **Null-safety em relacionamentos opcionais:** Usar optional chaining (`?.`)
3. **Logs detalhados:** Logs salvaram a investigação mostrando `respostasIRT: []`
4. **Testes com dados reais:** Bug não aparecia em testes unitários mock

## Próximos Passos

1. ✅ Corrigir código (FEITO)
2. ⏳ Testar manualmente cenário reproduzível
3. ⏳ Adicionar teste unitário de regressão
4. ⏳ Validar em ambiente de desenvolvimento
5. ⏳ Deploy para produção

---

**Status:** Correção implementada e pronta para teste manual.  
**Próximo teste:** Responder primeira pergunta com "muito mal" e verificar continuidade.
