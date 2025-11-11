# Correções de Mapeamento - Prisma Schema vs API

## Campos Corrigidos

### SessaoAdaptativa
- `iniciadaEm` → `iniciadoEm` ✅
- `finalizadaEm` → `finalizadoEm` ✅
- `pausadaEm` → **NÃO EXISTE** (usar status: PAUSADA)
- `thetaAtual` → `thetaEstimado` ✅
- `totalPerguntasEstimado` → **NÃO EXISTE** (calcular manualmente)
- `aulaId` → **NÃO EXISTE no schema** (remover)

### RespostaSocioemocional
- `valorNumerico` → **NÃO EXISTE** (usar `valor` como Json)
- `categoria` → **NÃO EXISTE** (obter da relação com pergunta)
- `respondidoEm` → `timestamp` ✅

### AlertaSocioemocional
- `ativo` → **NÃO EXISTE** (usar `status: StatusAlerta`)
- `criadoEm` → `timestamp` ✅

### RegraAdaptacao
- `ativa` → `ativo` ✅

## Ações Necessárias
1. Remover `aulaId` da criação de sessão
2. Não usar `pausadaEm` - apenas atualizar `status`
3. Usar `thetaEstimado` ao invés de `thetaAtual`
4. Calcular `totalPerguntasEstimado` baseado no número de perguntas do questionário
5. Não salvar `valorNumerico` separado - apenas no `valor` Json
6. Buscar `categoria` através da relação com pergunta
7. Usar `timestamp` ao invés de `respondidoEm`
8. Filtrar alertas por `status` ao invés de `ativo`
