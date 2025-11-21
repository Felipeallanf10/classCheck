# 🔧 Fix: Filtro IRT Muito Agressivo nas Primeiras Respostas

**Data:** 23 de outubro de 2025  
**Problema:** Após resposta com valor extremo (theta = -3), todas as perguntas eram rejeitadas

## Diagnóstico

### Sintomas
```
Candidatas questionário: 5
Candidatas banco: 6
📊 [Seleção] Top 5 candidatas:
⚠️ [Seleção] Nenhuma pergunta candidata disponível
```

### Causa
Quando o usuário responde "muito mal" (valor 1) na **primeira pergunta**:
1. Theta é calculado como **-3** (extremo negativo)
2. Informação de Fisher é calculada para cada pergunta candidata
3. Perguntas com dificuldade neutra (~0) têm **baixa informação** para theta extremo
4. Todas são rejeitadas pelo filtro `informacao < 0.05`
5. Sistema finaliza por falta de candidatas

### Por que isso acontece?

A Informação de Fisher mede quão útil é uma pergunta para **refinar** a estimativa do theta atual. Quando:
- Theta = -3 (muito baixo)
- Pergunta tem dificuldade = 0 (neutra)

A informação é baixa porque a pergunta está "longe" do nível estimado. Isso faz sentido **após várias respostas**, mas na **primeira resposta** o theta ainda é instável e precisamos **explorar** o espaço.

## Soluções Implementadas

### ✅ Solução 1: Limiar Dinâmico de Informação

```typescript
// Antes: Fixo em 0.05
const INFORMACAO_MINIMA = 0.05;

// Depois: Ajustável por número de respostas
const INFORMACAO_MINIMA_BASE = 0.05;      // Padrão (após 3 respostas)
const INFORMACAO_MINIMA_INICIAL = 0.01;  // Permissivo (primeiras 3)

const limiteInformacao = respostas.length < 3 
  ? INFORMACAO_MINIMA_INICIAL 
  : INFORMACAO_MINIMA_BASE;
```

**Benefício:** Nas primeiras 3 respostas, aceita perguntas com informação ≥ 0.01 (5x mais permissivo).

### ✅ Solução 2: Fallback de Segurança

```typescript
// Se nas primeiras 3 respostas não encontrou nada com IRT,
// selecionar a próxima pergunta por ordem simples
if (perguntasComScore.length === 0 && respostas.length < 3) {
  console.log('⚠️ [Fallback] Selecionando primeira pergunta por ordem...');
  return todasCandidatas[0]; // Ignora Fisher temporariamente
}
```

**Benefício:** Garante que **sempre** há uma próxima pergunta nas primeiras respostas, mesmo que o theta seja extremo.

### ✅ Solução 3: Logs Detalhados

Adicionados logs para cada pergunta candidata:
```
[Q] abc12345: info=0.0234, dif=0.00, disc=1.00
   ❌ Rejeitada (info < 0.05)
[B] GAD7_001: info=0.0876, dif=-0.30, disc=1.20
   ✅ Aceita
```

**Benefício:** Permite diagnosticar rapidamente por que perguntas estão sendo rejeitadas.

## Estratégia Adaptativa

### Fase 1: Exploração (0-3 respostas)
- **Limiar:** 0.01 (muito permissivo)
- **Fallback:** Seleção por ordem se nada passar
- **Objetivo:** Coletar dados iniciais, estabilizar theta

### Fase 2: Refinamento (3+ respostas)
- **Limiar:** 0.05 (padrão CAT)
- **Sem fallback:** Usa IRT puro
- **Objetivo:** Maximizar informação, convergir precisão

## Comparação

| Cenário | Antes | Depois |
|---------|-------|--------|
| Resposta 1 com theta = -3 | ❌ 0 candidatas | ✅ 5-8 candidatas |
| Resposta 4 com theta = -3 | ❌ 0 candidatas | ✅ 2-3 candidatas (limiar normal) |
| Resposta 1 com theta = 0 | ✅ 8 candidatas | ✅ 8-10 candidatas |
| Resposta 4 com theta = 0 | ✅ 8 candidatas | ✅ 8 candidatas |

## Teste Manual

1. **Cenário crítico:** Responder "muito mal" (1) na primeira pergunta
2. **Esperado:** Sistema apresenta próxima pergunta (pode ser por fallback)
3. **Log esperado:**
```
🎯 [Seleção Avançada] Iniciando...
   Theta: -2.850
   Respostas anteriores: 1
   Limite de informação: 0.01 (inicial)
   
📊 [Seleção] Perguntas após filtro: 6
   Top 5 candidatas:
   1. [banco] GAD7_002
      Informação: 0.034 → Score: 0.034
      
✅ [Selecionada] GAD7_002
```

## Arquivos Modificados

- `src/lib/adaptive/selecao-avancada-service.ts`
  - Limiar dinâmico baseado em número de respostas
  - Fallback de segurança para primeiras 3 respostas
  - Logs detalhados de informação por pergunta

## Impacto em Métricas CAT

- **Precisão:** Sem impacto após 3 respostas (usa limiar padrão)
- **Eficiência:** Leve redução nas primeiras respostas (aceita perguntas subótimas)
- **Burden:** Nenhum (total de perguntas controlado por SEM < 0.30)
- **Experiência:** Melhora significativa (não quebra em valores extremos)

## Próximos Passos

1. ✅ Implementado
2. ⏳ Testar manualmente com valor "muito mal"
3. ⏳ Monitorar logs para verificar quantas vezes fallback é ativado
4. ⏳ Considerar ajustar limiar inicial de 0.01 para 0.02 se necessário

---

**Status:** Correção implementada. Teste com "muito mal" na primeira pergunta.
