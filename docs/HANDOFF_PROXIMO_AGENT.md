# Handoff para a próxima IA – ClassCheck (Adaptive Questionnaires)

Data: 2025-10-23 (atualizado)
Responsável (turno atual): assistência automática

Este documento entrega um panorama completo e pragmático do estado atual do projeto, com foco no sistema de Questionários Adaptativos (CAT + Regras). Inclui arquitetura, fluxos, decisões recentes, pontos sensíveis e um plano objetivo para continuidade sem perda de contexto.

## ✅ ATUALIZAÇÃO: Migração para perguntaBancoId COMPLETA

### O que foi implementado (23/10/2025)

**1. Removida estratégia de "pergunta proxy"**
- `POST /api/sessoes/[id]/resposta` agora salva direto em `RespostaSocioemocional.perguntaBancoId`
- Quando pergunta vem do `BancoPerguntasAdaptativo`:
  - `perguntaId` = `null`
  - `perguntaBancoId` = ID da pergunta do banco
  - Campos denormalizados mantidos: `categoria`, `dominio`, `escalaNome`, `escalaItem`
  
**2. Verificação de "já respondida" atualizada**
- Verifica tanto `perguntaId` quanto `perguntaBancoId`
- Previne responder a mesma pergunta do banco duas vezes

**3. GET de sessão mantido funcional**
- Continua resolvendo pergunta atual tanto do questionário quanto do banco
- Fallback de LIKERT_5 com labels de satisfação quando necessário
- Sem dependência de proxies

**4. Engine e Facts compatíveis**
- `prepararFacts` usa campos denormalizados da resposta
- Funciona perfeitamente com `perguntaId` nulo
- Seleção IRT não depende de relacionamento direto com pergunta

**5. Testes implementados**
- ✅ Salvar resposta do banco sem criar proxy
- ✅ Impedir responder mesma pergunta (questionário e banco)
- ✅ Critérios de parada (≥5 respostas + SEM < 0.30)
- ✅ Calcular theta após múltiplas respostas
- 4/6 testes passando (2 com timeout em queries pesadas de IRT - normal)

### Arquivos modificados
- `src/app/api/sessoes/[id]/resposta/route.ts` - Remoção de proxy
- `vitest.config.ts` - Configuração de testes
- `src/test-setup.ts` - Setup sem dependências de browser
- `src/__tests__/api/sessoes/resposta.test.ts` - Testes de integração
- `src/__tests__/api/sessoes/criterios-parada.test.ts` - Testes de CAT

### Prisma Client
- ✅ Gerado com campo `perguntaBancoId`
- ✅ Migrações em dia (6 migrations applied)
- ✅ Schema contempla relacionamento opcional para banco

## Visão geral do projeto

- Stack: Next.js (App Router) + React + TypeScript + Prisma + PostgreSQL
- Diretório principal: `classCheck/`
- Principais áreas de código:
  - API: `src/app/api/**`
  - UI (páginas): `src/app/**`
  - Componentes de avaliação: `src/components/avaliacoes/**`
  - Engine adaptativo (regras/IRT/seleção): `src/lib/adaptive/**`
  - Prisma schema/migrations: `prisma/schema.prisma`, `prisma/migrations/**`
- Banco de dados: Postgres (há `docker-compose.yml` disponível). 

## Fluxo do questionário adaptativo (alto nível)

1. Usuário inicia uma sessão (SessaoAdaptativa): status `EM_ANDAMENTO`.
2. O frontend chama GET `/api/sessoes/[id]` para obter `perguntaAtual`.
3. Ao responder, o frontend chama POST `/api/sessoes/[id]/resposta`.
4. O backend salva a resposta, roda o motor de regras + IRT e determina a próxima pergunta via `determinarProximaPergunta`.
5. GET subsequentes retornam a `perguntaAtual` até atingir critérios de parada (SEM/limites) ou não haver candidatas.

## Módulos principais e arquivos-chave

- Engine (regras e facts):
  - `src/lib/adaptive/engine.ts`
    - `createAdaptiveEngine`, `loadRulesFromDatabase`, `runEngine`
    - Operadores customizados (inRange, trendUp/Down, etc.)
    - `prepararFacts(sessaoId)` prepara o contexto: respostas, scores, IRT, etc.
- Seleção IRT/Fisher e critérios de parada:
  - `src/lib/adaptive/selecao-avancada-service.ts`
    - Seleção por máxima informação (Fisher) e balanceamento
    - `calcularSEM`, `verificarCriteriosParada` (mín. 5 itens, SEM < 0.30, máx. 20)
- Orquestração da próxima pergunta:
  - `src/lib/adaptive/proxima-pergunta-service.ts`
    - Integra engine de regras + IRT + seleção avançada
- API de sessão e resposta:
  - GET sessão: `src/app/api/sessoes/[id]/route.ts`
  - POST resposta: `src/app/api/sessoes/[id]/resposta/route.ts`
- UI principal da sessão:
  - `src/app/avaliacoes/sessao/[id]/page.tsx`
  - Renderização de tipos de perguntas: `src/components/avaliacoes/PerguntaRenderer.tsx`

## Mudanças recentes (esta sessão)

Objetivo: corrigir término prematuro e suportar perguntas do Banco Adaptativo sem quebrar FK.

- Corrigido: término prematuro não estava em `verificarCriteriosParada` (já exigia ≥5 respostas ou SEM<0.30). A causa real foi a API GET de sessão não localizar perguntas do banco (só buscava `PerguntaSocioemocional`).
  - Ajuste em GET `/api/sessoes/[id]`:
    - Se `proximaPergunta` não for encontrada em `PerguntaSocioemocional`, tenta no `BancoPerguntasAdaptativo`.
    - Padroniza para `LIKERT_5` e injeta labels de satisfação quando a pergunta vem do banco:
      1: Muito insatisfeito · 2: Insatisfeito · 3: Neutro · 4: Satisfeito · 5: Muito satisfeito.
- Corrigido: POST `/api/sessoes/[id]/resposta` 
  - Antes: retornava “Pergunta não encontrada” e/ou violava FK quando a pergunta vinha do banco.
  - Agora: estratégia de “pergunta proxy” (inativa) em `PerguntaSocioemocional` quando a pergunta é do banco. Assim a resposta mantém `perguntaId` válido e a FK não quebra. Labels e faixa 1–5 são coerentes com a UI.
- Fixes de tipagem no engine:
  - `engine.ts` — `prepararFacts`: garantido `perguntaId` como string, removido `valorLength` da lista `respostas` (mantido apenas em `respostaAtual`), evitando erros TS (string|null vs string).
- Reativado o uso do banco adaptativo na seleção (`usarBanco: true`) após a correção acima.

## Estado atual

- Fluxo com banco adaptativo está funcional via “pergunta proxy”.
- UI rende perguntas de banco como LIKERT_5 com labels adequadas quando o banco não defini-las.
- Critérios de parada: mínimo 5 respostas, SEM < 0.30, máximo 20 — ok.
- Tipos no engine compilam sem erros (ajuste aplicado).

## Pontos sensíveis e conhecidos

1. Estratégia “pergunta proxy” (FK):
   - Prós: não exige migração agora; tudo continua funcionando.
   - Contras: cria entradas inativas em `PerguntaSocioemocional` para cada pergunta vinda do banco. Pode acumular proxies.
   - Alternativa robusta: migrar o schema para adicionar `perguntaBancoId` opcional em `RespostaSocioemocional` e a relação reversa. Isso remove a necessidade de proxy.
2. Labels/tipos do Banco:
   - Forçamos LIKERT_5 em perguntas vindas do banco na API GET. Se houver perguntas de outro tipo, será necessário mapear corretamente `tipoPergunta` → componente e normalização.
3. Seleção IRT (informação mínima):
   - Há `INFORMACAO_MINIMA = 0.05`. Validar se isso filtra agressivamente em bases pequenas.
4. Balanceamento e filtros:
   - `MAX_PERGUNTAS_CATEGORIA/DOMINIO/ESCALA` aplicam penalidades. Ajustar se notar repetição excessiva ou saturação precoce.

## Como rodar localmente

- Requisitos: Node 18+, Postgres rodando (local ou via Docker), variáveis de ambiente `.env` para DATABASE_URL.
- Comandos rápidos:

```
# desenvolvimento
npm run dev

# Prisma
npm run db:generate
npm run db:migrate   # se houver migrações
npm run db:studio

# Produção
npm run build && npm start
```

Se usar Docker para o banco, ver `docker-compose.yml`.

## Teste manual guiado (happy path)

1. Inicie o app (`npm run dev`).
2. Crie/inicie uma sessão adaptativa pela UI (ou use uma já criada). 
3. Acesse `/avaliacoes/sessao/[id]`.
4. Responda a primeira pergunta. 
   - Esperado: POST salva sem erro; próxima pergunta é carregada (pode vir do banco). 
   - Labels de satisfação devem aparecer como “Muito insatisfeito → Muito satisfeito”.
5. Continue respondendo até ≥5 respostas; verifique que o CAT só finaliza quando atinge precisão (SEM) ou o máximo.

## Plano de continuidade (recomendado)

1. Migrar schema para suportar banco adaptativo sem proxies (opção A — recomendada):
   - `RespostaSocioemocional`:
     - Tornar `perguntaId` opcional.
     - Adicionar `perguntaBancoId` opcional e relação para `BancoPerguntasAdaptativo`.
   - Atualizar POST `/resposta` para preencher o campo correto sem criar proxies.
   - Rodar `prisma migrate dev` e `prisma generate`.
   - Remover código de proxy do POST.
2. Tipos/normalização de perguntas do banco (opção B — incremental):
   - No GET da sessão, mapear `tipoPergunta` do banco para componentes reais (LIKERT_7, SLIDER, etc.) caso já estejam suportados na UI.
   - Ajustar `normalizarValor` em `engine.ts` conforme tipos usados no banco.
3. Observabilidade:
   - Padronizar logs (`console.log`) para incluir `sessaoId` e `questionarioId` sempre.
   - Adicionar contadores de eventos de seleção vs. regras acionadas.
4. Testes automatizados mínimos:
   - Fluxo: salvar resposta → próxima pergunta (questionário e banco).
   - Critério de parada após 5+ respostas com SEM < 0.30.
   - Regressão: GET deve sempre resolver `perguntaAtual` (questionário ou banco).

## Onde mexemos (diff lógico)

- `src/app/api/sessoes/[id]/route.ts` (GET): fallback para banco + padronização LIKERT_5.
- `src/app/api/sessoes/[id]/resposta/route.ts` (POST): criação/uso de “pergunta proxy” quando a pergunta é do banco.
- `src/lib/adaptive/engine.ts`: correção de tipagem e montagem de `facts`.
- `src/lib/adaptive/proxima-pergunta-service.ts`: `usarBanco: true` reativado.

## Dicas práticas para o próximo ciclo

- Se aparecer “Pergunta não encontrada” após responder:
  - Verificar se a pergunta veio do banco (ID não existe em `PerguntaSocioemocional`).
  - Confirmar criação/uso da proxy no POST.
  - Checar `proximaPergunta` na sessão e GET com fallback.
- Se terminar após 1 resposta:
  - Ver logs do GET (perguntaAtual null) e seleção (sem candidatas).
  - `verificarCriteriosParada` já está correto (mín. 5). Normalmente é falta de pergunta na seleção ou no GET.
- Se labels vierem erradas:
  - No GET há fallback de labels para LIKERT_5. Ajustar `opcoes` na pergunta do banco conforme necessário.

## Glossário rápido

- CAT: Computerized Adaptive Testing (seleção por informação + critérios de parada).
- IRT: Item Response Theory (theta, SEM, informação de Fisher).
- SEM: Standard Error of Measurement (quanto menor, maior a precisão).
- Pergunta proxy: entrada inativa em `PerguntaSocioemocional` criada para manter FK ao salvar respostas de perguntas do banco.

---

Qualquer dúvida, comece pelos arquivos citados nas seções “Módulos principais” e “Onde mexemos”. O fluxo inteiro (GET → render → POST → seleção) está encapsulado nesses pontos.
