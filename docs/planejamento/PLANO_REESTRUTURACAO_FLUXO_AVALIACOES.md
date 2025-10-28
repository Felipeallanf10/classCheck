# 🗺️ PLANO DE REESTRUTURAÇÃO: Fluxo de Avaliações ClassCheck

## 📋 Situação Atual (CONFUSA)

### Páginas Existentes de Avaliação

#### 1. **Avaliação de Aulas** (3 páginas)
- `/avaliacao-aula/[aulaId]/socioemocional` - Avaliação emocional da aula
- `/avaliacao-aula/[aulaId]/didatica` - Avaliação didática (metodologia, recursos)
- `/avaliacao-aula/[aulaId]/concluida` - Página de conclusão/sucesso

#### 2. **Avaliação de Professores** (1 página)
- `/professores/[id]/avaliar` - Avaliar professor específico

#### 3. **Avaliação Socioemocional Standalone** (1 página)
- `/avaliacao-socioemocional` - Questionário adaptativo isolado

#### 4. **Histórico/Visualização** (3 páginas)
- `/avaliacoes` - Lista de avaliações de aulas (REDUNDANTE)
- `/relatorios/meu-estado-emocional` - Evolução socioemocional
- `/questionario/historico` - Histórico de questionários

### 🚨 Problemas Identificados

1. **CONFUSÃO DE TIPOS DE AVALIAÇÃO**
   - Usuário não entende diferença entre:
     - Avaliação socioemocional DA AULA
     - Avaliação socioemocional GERAL (standalone)
     - Avaliação didática da aula
     - Avaliação do professor

2. **MÚLTIPLOS PONTOS DE ENTRADA**
   - Card de aula → avaliar
   - Botão floating → avaliar
   - Página de professores → avaliar professor
   - Menu → avaliação socioemocional standalone
   - Resultado: usuário perdido

3. **FLUXO QUEBRADO**
   ```
   Atual (confuso):
   Aula → Socioemocional → Didática → Concluída → "Ver Evolução" → ???
   
   Problema: Onde está MINHA avaliação daquela aula?
   ```

4. **REDUNDÂNCIA**
   - `/avaliacoes` vs `/relatorios/meu-estado-emocional` (já discutido)
   - Avaliação socioemocional em 2 lugares

5. **SIDEBAR SOBRECARREGADA**
   - 9 itens principais + 3 institucionais
   - "Avaliações" + "Avaliação Socioemocional" confunde

---

## 🎯 PROPOSTA: Arquitetura Simplificada

### Princípios de Design

1. **Um ponto de entrada claro** por tipo de avaliação
2. **Hierarquia visual** para guiar o usuário
3. **Contexto sempre visível** (o que estou avaliando?)
4. **Fluxo linear e previsível**
5. **Menos é mais**: reduzir páginas e opções

---

## 🏗️ Nova Arquitetura

### TIPO 1: Avaliação de Aula (Completa)

**Conceito:** Ao avaliar uma aula, usuário passa por 2 etapas obrigatórias.

#### Fluxo Proposto:
```
/aulas
  └─ Card: "Geografia - 14/10"
       └─ Botão: "Avaliar Aula" 
            │
            ▼
/aulas/[id]/avaliar  ← NOVA PÁGINA ÚNICA
  │
  ├─ ETAPA 1: Socioemocional
  │    ├─ "Como você se sentiu nesta aula?"
  │    ├─ Circumplex ou emojis
  │    └─ Feedback opcional
  │
  ├─ ETAPA 2: Didática (pode pular)
  │    ├─ "Avalie os aspectos da aula"
  │    ├─ Compreensão, ritmo, recursos, engajamento
  │    └─ Sugestões opcionais
  │
  └─ ETAPA 3: Resumo + Enviar
       └─ Preview das respostas
            │
            ▼
/aulas/[id]/avaliar/sucesso  ← NOVA PÁGINA
  │
  ├─ "Avaliação enviada! 🎉"
  ├─ Impacto (gamificação)
  ├─ Botão: "Ver Esta Avaliação" → /aulas/[id]/detalhes
  └─ Botão: "Voltar para Aulas"
```

**Benefícios:**
- ✅ Uma única URL para avaliar aula
- ✅ Fluxo linear (etapa 1 → 2 → 3)
- ✅ Contexto sempre visível (nome da aula no header)
- ✅ Pode pular etapa 2 (didática) se quiser
- ✅ Sucesso mostra próximos passos claros

---

### TIPO 2: Avaliação de Professor

**Conceito:** Independente da aula, usuário pode avaliar professor a qualquer momento.

#### Fluxo Proposto:
```
/professores
  └─ Card: "Prof. Ana Costa"
       └─ Botão: "Avaliar Professor"
            │
            ▼
/professores/[id]/avaliar  ← JÁ EXISTE (manter)
  │
  ├─ Critérios (clareza, didática, disponibilidade, etc.)
  ├─ Nota geral
  └─ Feedback anônimo opcional
       │
       ▼
/professores/[id]/avaliar/sucesso  ← NOVA PÁGINA
  │
  ├─ "Avaliação enviada! 🙏"
  ├─ "Seu feedback é anônimo e ajuda muito"
  └─ Botão: "Ver Relatório do Professor" → /relatorios/professor/[id]
```

**Benefícios:**
- ✅ Fluxo independente de aulas
- ✅ Anonimato reforçado
- ✅ Link direto para ver impacto

---

### TIPO 3: Check-in Socioemocional (Diário)

**Conceito:** Usuário pode registrar estado emocional SEM estar vinculado a uma aula específica.

#### Fluxo Proposto:
```
/check-in  ← RENOMEAR de /avaliacao-socioemocional
  │
  ├─ "Como você está se sentindo hoje?"
  ├─ Questionário adaptativo
  └─ Registro rápido (1-2min)
       │
       ▼
/check-in/sucesso
  │
  ├─ "Check-in registrado! 🧘"
  ├─ Insight rápido (ex: "Você está no quadrante 'Calmo'")
  └─ Botão: "Ver Minha Jornada" → /relatorios/meu-estado-emocional
```

**Uso:**
- Manhã antes das aulas
- Momento de pausa/reflexão
- Tracking longitudinal de bem-estar

**Benefícios:**
- ✅ Nome claro: "Check-in" (não "Avaliação Socioemocional")
- ✅ Desvinculado de aulas
- ✅ Foco em bem-estar geral

---

### TIPO 4: Visualização (Histórico e Relatórios)

**Conceito:** Um único lugar para ver TODAS as avaliações e evolução.

#### Nova Estrutura:
```
/minhas-avaliacoes  ← NOVA PÁGINA CONSOLIDADA
  │
  ├─ Tab: "Aulas" 
  │    ├─ Lista de aulas avaliadas
  │    ├─ Filtros (disciplina, professor, data)
  │    └─ Click em aula → /aulas/[id]/detalhes
  │
  ├─ Tab: "Professores"
  │    ├─ Lista de professores avaliados
  │    └─ Click → /professores/[id]
  │
  ├─ Tab: "Check-ins"
  │    ├─ Lista de check-ins socioemocionais
  │    └─ Gráfico de evolução inline
  │
  └─ Tab: "Estatísticas"
       ├─ Total de avaliações
       ├─ Média de humor
       ├─ Disciplinas favoritas
       └─ Insights gerais
```

**Complemento:**
- `/relatorios/meu-estado-emocional` - Mantém como página de análise PROFUNDA
- Diferença: 
  - `/minhas-avaliacoes` = Lista/CRUD
  - `/relatorios/meu-estado-emocional` = Análise/Insights

---

## 📱 Nova Navegação (Sidebar)

### ANTES (9 itens - confuso):
```
✓ Dashboard
✓ Aulas
✓ Professores
✓ Avaliações                        ← REDUNDANTE
✓ Avaliação Socioemocional          ← CONFUSO
✓ Gamificação
✓ Insights
✓ Relatórios
✓ Eventos
```

### DEPOIS (7 itens - claro):
```
🏠 Início
📚 Aulas                             ← Avaliar aulas aqui
👨‍🏫 Professores                       ← Avaliar professores aqui
🧘 Check-in Diário                   ← Renomeado, propósito claro
📊 Minhas Avaliações                 ← NOVA: consolida histórico
🏆 Gamificação
📈 Relatórios
     ├─ Minha Jornada Emocional
     ├─ Por Disciplina
     └─ Relatórios da Turma
```

**Redução:** 9 → 7 itens (-22%)

---

## 🔄 Mapeamento de Mudanças

### Páginas a CRIAR:

1. **`/aulas/[id]/avaliar`** - Formulário unificado (socioemocional + didática)
2. **`/aulas/[id]/avaliar/sucesso`** - Página de conclusão
3. **`/aulas/[id]/detalhes`** - Detalhes de uma avaliação específica
4. **`/professores/[id]/avaliar/sucesso`** - Página de conclusão
5. **`/check-in`** - Renomear `/avaliacao-socioemocional`
6. **`/check-in/sucesso`** - Página de conclusão
7. **`/minhas-avaliacoes`** - Nova página consolidada com tabs

### Páginas a REMOVER:

1. ❌ `/avaliacoes` - Substituída por `/minhas-avaliacoes`
2. ❌ `/avaliacao-aula/[aulaId]/socioemocional` - Consolidado em `/aulas/[id]/avaliar`
3. ❌ `/avaliacao-aula/[aulaId]/didatica` - Consolidado em `/aulas/[id]/avaliar`
4. ❌ `/avaliacao-aula/[aulaId]/concluida` - Substituída por `/aulas/[id]/avaliar/sucesso`
5. ❌ `/avaliacao-socioemocional` - Renomeada para `/check-in`

### Páginas a MANTER:

1. ✅ `/aulas` - Lista de aulas
2. ✅ `/professores` - Lista de professores
3. ✅ `/professores/[id]/avaliar` - Avaliar professor (manter)
4. ✅ `/relatorios/meu-estado-emocional` - Análise profunda
5. ✅ `/questionario/historico` - Histórico de questionários (pode mesclar com `/minhas-avaliacoes`)
6. ✅ `/gamificacao` - Badges e conquistas
7. ✅ Todas as páginas de relatórios

---

## 🎨 Wireframe do Novo Fluxo

### 1. Avaliar Aula (Fluxo Completo)

```
┌─────────────────────────────────────────────┐
│  /aulas                                     │
│  ┌───────────────────────────────────────┐ │
│  │ 📚 Geografia - Continentes            │ │
│  │ Prof. Ana • 14/10 • 14h-15h30        │ │
│  │                                       │ │
│  │ [💭 Avaliar Aula]                    │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
                    ↓ CLICK
┌─────────────────────────────────────────────┐
│  /aulas/123/avaliar                        │
│                                             │
│  ┌─── Avaliando: Geografia - Continentes  │
│  │    📚 Prof. Ana • 14/10                │
│  └─────────────────────────────────────────│
│                                             │
│  🔵 Etapa 1 de 2  ○ Etapa 2 de 2          │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ 😊 Como você se sentiu nesta aula?  │  │
│  │                                      │  │
│  │  [Circumplex ou Emojis 1-5]         │  │
│  │                                      │  │
│  │  Comentário (opcional):              │  │
│  │  [_________________________]         │  │
│  │                                      │  │
│  │            [Próxima →]               │  │
│  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  /aulas/123/avaliar                        │
│                                             │
│  ○ Etapa 1 de 2  🔵 Etapa 2 de 2          │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ 📖 Avalie os aspectos da aula       │  │
│  │                                      │  │
│  │  Compreensão:     ⭐⭐⭐⭐☆           │  │
│  │  Ritmo:           ⭐⭐⭐⭐⭐           │  │
│  │  Recursos:        ⭐⭐⭐☆☆           │  │
│  │  Engajamento:     ⭐⭐⭐⭐☆           │  │
│  │                                      │  │
│  │  Sugestões (opcional):               │  │
│  │  [_________________________]         │  │
│  │                                      │  │
│  │  [← Voltar]  [Pular]  [Enviar ✓]   │  │
│  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  /aulas/123/avaliar/sucesso                │
│                                             │
│         ✅ Avaliação Enviada!               │
│                                             │
│  Obrigado por avaliar Geografia!           │
│  Seu feedback ajuda muito a melhorar.      │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  🏆 +10 XP  |  12/50 avaliações     │  │
│  │  Sequência: 3 dias 🔥               │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  [📊 Ver Esta Avaliação]                   │
│  [📚 Voltar para Aulas]                    │
│  [📈 Ver Minha Evolução]                   │
└─────────────────────────────────────────────┘
```

### 2. Check-in Diário (Rápido)

```
┌─────────────────────────────────────────────┐
│  Sidebar                                    │
│  🧘 Check-in Diário                         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  /check-in                                  │
│                                             │
│  🧘 Como você está se sentindo hoje?       │
│                                             │
│  [Questionário adaptativo - 5-7 perguntas]  │
│                                             │
│  Progresso: ████░░░░ 4/7                   │
│                                             │
│  [Concluir Check-in]                       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  /check-in/sucesso                          │
│                                             │
│         🧘 Check-in Registrado!             │
│                                             │
│  Você está no quadrante: "Calmo"           │
│  Valencia: +0.6  |  Ativação: -0.3         │
│                                             │
│  💡 Insight: Você está 20% mais calmo      │
│     que na semana passada!                 │
│                                             │
│  [📈 Ver Minha Jornada]                    │
└─────────────────────────────────────────────┘
```

### 3. Minhas Avaliações (Consolidado)

```
┌─────────────────────────────────────────────┐
│  /minhas-avaliacoes                         │
│                                             │
│  📊 Minhas Avaliações                       │
│                                             │
│  [Aulas] [Professores] [Check-ins] [Stats] │
│  ───────                                    │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ 📚 Geografia - 14/10                │  │
│  │ Humor: 😊 4/5  |  Nota: ⭐⭐⭐⭐☆      │  │
│  │ "Aula muito boa sobre continentes"  │  │
│  │ [Ver Detalhes]                       │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ 🧮 Matemática - 13/10               │  │
│  │ Humor: 😐 3/5  |  Nota: ⭐⭐⭐☆☆      │  │
│  │ "Conceito difícil"                   │  │
│  │ [Ver Detalhes]                       │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  Filtros: [📅 Data] [📚 Disciplina] [👨‍🏫 Prof]│
└─────────────────────────────────────────────┘
```

---

## 🎯 Matriz de Decisão: Onde Avaliar O Quê?

| O que avaliar?          | De onde?       | Vai para?                      |
|-------------------------|----------------|--------------------------------|
| **Aula (completa)**     | `/aulas`       | `/aulas/[id]/avaliar`          |
| **Professor**           | `/professores` | `/professores/[id]/avaliar`    |
| **Estado emocional geral** | Sidebar     | `/check-in`                    |
| **Ver minhas avaliações** | Sidebar      | `/minhas-avaliacoes`           |
| **Ver evolução profunda** | Relatórios   | `/relatorios/meu-estado-emocional` |

---

## 📊 Comparação: Antes vs Depois

### Número de Cliques para Avaliar uma Aula

**ANTES:**
```
/aulas → Click "Avaliar" → /avaliacao-aula/[id]/socioemocional
→ Preencher → Click "Próximo" 
→ /avaliacao-aula/[id]/didatica → Preencher → Click "Enviar"
→ /avaliacao-aula/[id]/concluida → Click "Ver Evolução" → ???

Total: 5-6 cliques + confusão no final
```

**DEPOIS:**
```
/aulas → Click "Avaliar" → /aulas/[id]/avaliar (etapas 1→2)
→ Click "Enviar" → /aulas/[id]/avaliar/sucesso
→ Click "Ver Esta Avaliação" → /aulas/[id]/detalhes ✓

Total: 4 cliques + destino claro
```

**Redução: 20-30% menos cliques**

---

## 🧠 Linguagem e Nomenclatura

### Termos Confusos ANTES:
- ❌ "Avaliação Socioemocional" (muito técnico)
- ❌ "Avaliação Didática" (não é claro)
- ❌ "Minhas Avaliações" + "Avaliação Socioemocional" (redundante?)

### Termos Claros DEPOIS:
- ✅ "Avaliar Aula" (ação + objeto)
- ✅ "Avaliar Professor" (ação + objeto)
- ✅ "Check-in Diário" (familiar, não técnico)
- ✅ "Minhas Avaliações" (consolidado, único)
- ✅ "Minha Jornada Emocional" (pessoal, positivo)

---

## 🚀 Plano de Implementação

### Fase 1: Consolidação (Sprint 5 - Semana 1)
**Objetivo:** Unificar avaliação de aulas

- [ ] Criar `/aulas/[id]/avaliar` com etapas 1 e 2
- [ ] Criar `/aulas/[id]/avaliar/sucesso`
- [ ] Migrar lógica de `/avaliacao-aula/[id]/socioemocional`
- [ ] Migrar lógica de `/avaliacao-aula/[id]/didatica`
- [ ] Atualizar botões em cards de aula
- [ ] Testar fluxo completo

### Fase 2: Renomeação (Sprint 5 - Semana 1)
**Objetivo:** Clarear linguagem

- [ ] Renomear `/avaliacao-socioemocional` → `/check-in`
- [ ] Criar `/check-in/sucesso`
- [ ] Atualizar sidebar: "Check-in Diário"
- [ ] Atualizar todos os links internos

### Fase 3: Nova Página Consolidada (Sprint 5 - Semana 2)
**Objetivo:** Histórico unificado

- [ ] Criar `/minhas-avaliacoes` com tabs
- [ ] Tab 1: Aulas avaliadas
- [ ] Tab 2: Professores avaliados
- [ ] Tab 3: Check-ins
- [ ] Tab 4: Estatísticas gerais
- [ ] Adicionar à sidebar

### Fase 4: Detalhes Contextuais (Sprint 5 - Semana 2)
**Objetivo:** Ver avaliação específica

- [ ] Criar `/aulas/[id]/detalhes`
- [ ] Mostrar avaliação socioemocional + didática
- [ ] Link para evolução temporal
- [ ] Botão "Editar" (se permitido)

### Fase 5: Limpeza (Sprint 5 - Semana 3)
**Objetivo:** Remover redundância

- [ ] Remover `/avaliacoes`
- [ ] Remover `/avaliacao-aula/[id]/socioemocional`
- [ ] Remover `/avaliacao-aula/[id]/didatica`
- [ ] Remover `/avaliacao-aula/[id]/concluida`
- [ ] Atualizar sidebar (9 → 7 itens)
- [ ] Verificar todos os links quebrados
- [ ] Atualizar documentação

### Fase 6: Sucesso de Professores (Sprint 5 - Semana 3)
**Objetivo:** Completar fluxo de professores

- [ ] Criar `/professores/[id]/avaliar/sucesso`
- [ ] Melhorar feedback pós-avaliação
- [ ] Link para relatório do professor

---

## ✅ Checklist de Validação

### UX:
- [ ] Usuário consegue avaliar uma aula em < 3 minutos?
- [ ] Fica claro o que é "Check-in Diário" vs "Avaliar Aula"?
- [ ] Usuário encontra suas avaliações facilmente?
- [ ] Fluxo é linear e previsível?
- [ ] Não há confusão entre tipos de avaliação?

### Técnico:
- [ ] Sem links quebrados após mudanças?
- [ ] Sidebar tem <= 7 itens principais?
- [ ] Todas as rotas antigas redirecionam?
- [ ] Breadcrumbs corretos em todas as páginas?
- [ ] Mobile-friendly?

### Dados:
- [ ] Avaliações antigas migradas corretamente?
- [ ] Schema de banco suporta novo fluxo?
- [ ] Relatórios funcionam com nova estrutura?

---

## 📈 Métricas de Sucesso

### Quantitativas:
- **Antes:** 5-6 cliques para avaliar aula
- **Depois:** 4 cliques para avaliar aula
- **Meta:** Redução de 20-30%

- **Antes:** 9 itens na sidebar
- **Depois:** 7 itens na sidebar
- **Meta:** Redução de 22%

### Qualitativas:
- Feedback de usuários: "Ficou mais fácil avaliar"
- Menos perguntas: "Onde vejo minhas avaliações?"
- Mais engajamento: Taxa de conclusão de avaliações +30%

---

## 🎓 Documentação para Usuário

### Tutorial: "Como Avaliar uma Aula"

1. Acesse "Aulas" na sidebar
2. Encontre a aula que deseja avaliar
3. Clique em "Avaliar Aula"
4. Responda sobre como se sentiu (etapa 1)
5. Avalie aspectos da aula (etapa 2 - opcional)
6. Envie e veja seu progresso!

**Tempo estimado:** 2-3 minutos

### FAQ:

**P: Qual a diferença entre "Avaliar Aula" e "Check-in Diário"?**
R: "Avaliar Aula" é sobre uma aula específica (como foi a metodologia, recursos, etc.). "Check-in Diário" é sobre como VOCÊ está se sentindo no geral, independente de aulas.

**P: Onde vejo minhas avaliações antigas?**
R: Em "Minhas Avaliações" na sidebar. Lá você encontra tudo: aulas, professores e check-ins.

**P: Posso editar uma avaliação?**
R: Sim! Acesse "Minhas Avaliações", encontre a avaliação e clique em "Editar".

---

## 🎯 Resumo Executivo

### Problema:
Sistema atual tem 5 tipos de avaliação em 10+ páginas diferentes, causando confusão e baixo engajamento.

### Solução:
Consolidar em 3 fluxos claros:
1. **Avaliar Aula** (socioemocional + didática em uma página)
2. **Avaliar Professor** (fluxo independente)
3. **Check-in Diário** (bem-estar geral)

### Benefícios:
- ✅ 40% menos páginas (10 → 6)
- ✅ 22% menos itens na sidebar (9 → 7)
- ✅ 20-30% menos cliques
- ✅ Nomenclatura clara e consistente
- ✅ Fluxo linear e previsível

### Esforço:
- **Tempo estimado:** 2-3 semanas (Sprint 5 completa)
- **Risco:** Médio (precisa migrar dados e redirecionar rotas)
- **Impacto:** Alto (melhora significativa na UX)

### Prioridade:
**CRÍTICA** - Fundação para todas as features futuras. Sem fluxo claro, usuário não engaja.

---

## 📝 Próximos Passos Imediatos

1. **Aprovar este plano** com stakeholders
2. **Criar protótipo** da nova página `/aulas/[id]/avaliar`
3. **Validar com usuários** (teste de usabilidade)
4. **Iniciar Sprint 5** seguindo fases do plano
5. **Monitorar métricas** durante implementação

---

**Data:** 15/10/2025  
**Versão:** 1.0  
**Status:** Proposta para Aprovação  
**Autor:** Análise de Arquitetura de Informação - ClassCheck
