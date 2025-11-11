# 📊 RELATÓRIO DE REESTRUTURAÇÃO - SISTEMA DE AVALIAÇÕES CLASSCHECK

**Data:** 13 de outubro de 2025  
**Autor:** Análise Técnica AI  
**Versão:** 1.0  
**Status:** 🔴 CRÍTICO - Redundâncias Identificadas

---

## 🎯 RESUMO EXECUTIVO

### Problema Identificado
Seu projeto atualmente apresenta **redundâncias conceituais e estruturais** entre as páginas `/aulas` e `/avaliacoes`, comprometendo a clareza do propósito do ClassCheck e a experiência do usuário. O sistema não reflete adequadamente seu objetivo principal: **avaliação socioemocional por aula com questionário adaptativo**.

### Impacto Atual
- ❌ Confusão sobre onde avaliar aulas (botão "Avaliar" em `/aulas` vs. página `/avaliacoes`)
- ❌ Avaliação genérica (humor + nota + feedback) não alinhada ao Modelo Circumplex
- ❌ Falta de diferenciação entre avaliação socioemocional e avaliação disciplinar
- ❌ Ausência de relatórios específicos para professor vs. turma
- ❌ Questionário adaptativo isolado em `/avaliacao-socioemocional`, não integrado ao fluxo de aulas

---

## 📋 ANÁLISE DA SITUAÇÃO ATUAL

### 1. Estrutura Atual das Páginas

#### `/aulas` (Página de Aulas)
**Propósito Atual:** Listar aulas com filtros e permitir avaliação rápida
```tsx
// Funcionalidades:
- ✅ Listagem de aulas por data
- ✅ Filtros (favoritas, status, disciplina, professor)
- ✅ Cards com informações da aula
- ⚠️ Botão "Avaliar" abre modal genérico
- ⚠️ Modal usa AvaliacaoForm (humor + nota + feedback) - SUPERFICIAL
```

**Problemas:**
- Modal de avaliação **não usa o questionário adaptativo**
- Avaliação rápida demais, não captura dados socioemocionais profundos
- Não diferencia avaliação da aula vs. avaliação do conteúdo

#### `/avaliacoes` (Histórico de Avaliações)
**Propósito Atual:** Mostrar histórico de avaliações já realizadas
```tsx
// Funcionalidades:
- ✅ Cards com avaliações passadas
- ✅ Filtros por nota/disciplina/professor
- ✅ Estatísticas (média humor, média nota)
- ⚠️ Permite editar/deletar (mas leva para modal genérico)
```

**Problemas:**
- **Redundância:** Se já avalia em `/aulas`, por que ter página separada?
- Cards mostram dados **superficiais** (humor emoji + nota + feedback texto)
- Não mostra análise circumplex, dimensões (valência/ativação)
- Métricas não conectadas ao objetivo socioemocional do TCC

#### `/avaliacao-socioemocional` (Questionário Adaptativo)
**Propósito Atual:** Sistema completo de questionário baseado no Modelo Circumplex
```tsx
// Funcionalidades:
- ✅ QuestionarioSocioemocional com motor adaptativo
- ✅ Visualização Circumplex (valência + ativação)
- ✅ Resultados científicos validados
- ✅ Histórico e análise temporal
- ❌ ISOLADO - não conectado ao fluxo de aulas!
```

**Problema CRÍTICO:**
- 🔥 **Sistema ideal existe mas está DESCONECTADO das aulas**
- Usuário avalia aula com formulário simplório em `/aulas`
- Questionário científico fica em página separada, não contextualizado por aula
- **Desperdiçando** todo o trabalho do motor adaptativo!

---

## 🧩 ANÁLISE DO MODELO DE DADOS

### Schema Prisma Atual
```prisma
model Avaliacao {
  usuarioId Int
  aulaId    Int
  humor     TipoHumor  // Enum com 5 níveis - INSUFICIENTE
  nota      Int?       // 1-5 estrelas - NÃO CIENTÍFICO
  feedback  String?    // Texto livre - SEM ESTRUTURA
}
```

### Problemas do Modelo Atual
1. **TipoHumor:** Enum simplificado (5 níveis) não captura:
   - Dimensão de **Valência** (prazer/desprazer)
   - Dimensão de **Ativação** (alta energia/baixa energia)
   - Posição no espaço circumplex

2. **Nota (1-5):** Métrica genérica que mistura:
   - Satisfação com a aula
   - Compreensão do conteúdo
   - Engajamento emocional
   - Performance do professor

3. **Feedback:** Texto livre sem categorização:
   - Difícil de analisar quantitativamente
   - Não permite relatórios estruturados
   - Não diferencia aspectos socioemocionais vs. disciplinares

---

## 🎓 PROPÓSITO DO CLASSCHECK (Alinhamento com TCC)

### Objetivo Principal (Segundo sua descrição)
> **"Avaliação socioemocional do aluno POR AULA, com questionário adaptativo baseado no Modelo Circumplex"**

### O que isso significa:
1. **Socioemocional POR AULA:** Cada aula tem sua própria avaliação emocional
2. **Questionário Adaptativo:** Usa o motor com 5-12 perguntas personalizadas
3. **Modelo Circumplex:** Posiciona emoções em espaço 2D (valência x ativação)
4. **Feedback Real:** Dados científicos, não apenas "gostei/não gostei"

### Objetivos Secundários
1. **Avaliação Disciplinar:** Como o aluno absorveu o conteúdo (compreensão)
2. **Relatório da Turma:** Professor vê estado emocional coletivo
3. **Relatório do Professor:** Turma avalia desempenho do professor
4. **Temporal:** Evolução emocional ao longo do semestre

---

## 🏗️ PROPOSTA DE REESTRUTURAÇÃO COMPLETA

### 🎯 FASE 1: REDEFINIR CONCEITOS E SEPARAÇÕES

#### 1.1 Três Tipos de Avaliação (Não confundir!)

```
┌─────────────────────────────────────────────────────────┐
│  TIPO 1: AVALIAÇÃO SOCIOEMOCIONAL DA AULA               │
├─────────────────────────────────────────────────────────┤
│  O que é:                                               │
│  - Como o aluno SE SENTIU durante/após a aula           │
│  - Estado emocional: ansioso, engajado, entediado, etc. │
│  - Usa Questionário Adaptativo (Circumplex)            │
│                                                          │
│  Quando acontece:                                        │
│  - Logo após aula (mesmo dia)                           │
│  - Obrigatória para gerar relatórios                    │
│                                                          │
│  Dados capturados:                                       │
│  - Posição Circumplex (valência, ativação)              │
│  - Estado emocional primário                            │
│  - 5-12 respostas adaptativas                           │
│  - Nível de confiança da medição                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TIPO 2: AVALIAÇÃO DISCIPLINAR/DIDÁTICA                │
├─────────────────────────────────────────────────────────┤
│  O que é:                                               │
│  - Como o aluno ABSORVEU o conteúdo                     │
│  - Clareza da explicação, ritmo da aula, recursos       │
│  - Avalia QUALIDADE PEDAGÓGICA                          │
│                                                          │
│  Quando acontece:                                        │
│  - Opcional, após avaliação socioemocional              │
│  - Pode ser semanal (não toda aula)                     │
│                                                          │
│  Dados capturados:                                       │
│  - Compreensão do conteúdo (1-5)                        │
│  - Ritmo da aula (muito rápido/adequado/lento)          │
│  - Recursos didáticos (slides, exemplos, etc.)          │
│  - Feedback texto opcional                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TIPO 3: AVALIAÇÃO DO PROFESSOR (Coletiva)             │
├─────────────────────────────────────────────────────────┤
│  O que é:                                               │
│  - Turma avalia DESEMPENHO DO PROFESSOR                 │
│  - Mensal ou semestral (não toda aula)                  │
│  - Critérios: didática, pontualidade, empatia, etc.     │
│                                                          │
│  Quando acontece:                                        │
│  - Fim do mês ou período                                │
│  - Anônimo para incentivar honestidade                  │
│                                                          │
│  Dados capturados:                                       │
│  - Domínio do conteúdo (1-5)                            │
│  - Clareza nas explicações (1-5)                        │
│  - Pontualidade/organização (1-5)                       │
│  - Acessibilidade/empatia (1-5)                         │
│  - Comentários anônimos                                 │
└─────────────────────────────────────────────────────────┘
```

#### 1.2 Nova Estrutura de Páginas

```
📁 src/app/
├── aulas/                          [MANTER - Fluxo Principal]
│   └── page.tsx                    → Listagem + Iniciar Avaliação Socioemocional
│
├── avaliacao-aula/                 [NOVA - Fluxo Completo]
│   ├── [aulaId]/
│   │   ├── socioemocional/         → Questionário Adaptativo (Circumplex)
│   │   ├── didatica/               → Avaliação do Conteúdo/Didática
│   │   └── concluida/              → Página de sucesso
│   └── page.tsx                    → Redirecionamento
│
├── avaliacoes/                     [RENOMEAR → historico-emocional/]
│   └── page.tsx                    → Histórico com Visualizações Circumplex
│
├── relatorios/                     [EXPANDIR]
│   ├── meu-estado-emocional/       → Dashboard do aluno (temporal)
│   ├── turma/                      → Relatório para professor (estado turma)
│   └── professor/                  → Avaliação coletiva do professor
│
└── avaliacao-socioemocional/       [DEPRECAR - Funcionalidade movida]
    └── page.tsx                    → Redireciona para /aulas
```

---

## 💾 NOVA ESTRUTURA DE DADOS

### Modelo Revisado para Prisma

```prisma
// ============================================
// AVALIAÇÃO SOCIOEMOCIONAL (Principal)
// ============================================
model AvaliacaoSocioemocional {
  id        Int      @id @default(autoincrement())
  usuarioId Int
  aulaId    Int
  
  // Dados do Circumplex
  valencia  Float    // -1.0 (negativo) a 1.0 (positivo)
  ativacao  Float    // -1.0 (baixa) a 1.0 (alta)
  estadoPrimario String // "Animado", "Calmo", "Entediado", etc.
  confianca Float    // 0.0 a 1.0 (confiança da medição)
  
  // Metadados do questionário adaptativo
  totalPerguntas Int
  tempoResposta  Int  // em segundos
  respostas      Json // Array de {perguntaId, valor, timestamp}
  
  createdAt DateTime @default(now())
  
  // Relacionamentos
  usuario Usuario @relation(fields: [usuarioId], references: [id])
  aula    Aula    @relation(fields: [aulaId], references: [id])
  
  @@unique([usuarioId, aulaId])
  @@map("avaliacoes_socioemocionais")
}

// ============================================
// AVALIAÇÃO DIDÁTICA/DISCIPLINAR (Opcional)
// ============================================
model AvaliacaoDidatica {
  id        Int      @id @default(autoincrement())
  usuarioId Int
  aulaId    Int
  
  // Critérios didáticos (1-5)
  compreensaoConteudo Int  // O quanto entendeu
  ritmoAula          Int   // Velocidade adequada
  recursosDidaticos  Int   // Slides, exemplos, etc.
  engajamento        Int   // O quanto se envolveu
  
  // Feedback estruturado
  pontoPositivo    String?  // O que funcionou bem
  pontoMelhoria    String?  // O que pode melhorar
  sugestao         String?  // Sugestões específicas
  
  createdAt DateTime @default(now())
  
  // Relacionamentos
  usuario Usuario @relation(fields: [usuarioId], references: [id])
  aula    Aula    @relation(fields: [aulaId], references: [id])
  
  @@unique([usuarioId, aulaId])
  @@map("avaliacoes_didaticas")
}

// ============================================
// AVALIAÇÃO DO PROFESSOR (Periódica/Coletiva)
// ============================================
model AvaliacaoProfessor {
  id          Int      @id @default(autoincrement())
  usuarioId   Int
  professorId Int
  periodo     String   // "2025-10" (ano-mês)
  
  // Critérios do professor (1-5)
  dominioConteudo    Int
  clarezaExplicacao  Int
  pontualidade       Int
  organizacao        Int
  acessibilidade     Int
  empatia            Int
  
  // Comentário anônimo
  comentario String?
  
  createdAt DateTime @default(now())
  
  // Relacionamentos
  usuario   Usuario   @relation(fields: [usuarioId], references: [id])
  professor Professor @relation(fields: [professorId], references: [id])
  
  @@unique([usuarioId, professorId, periodo])
  @@map("avaliacoes_professores")
}

// ============================================
// REMOVER/DEPRECAR
// ============================================
// model Avaliacao {
//   ❌ DELETAR - Substituído pelos 3 modelos acima
// }
```

---

## 🔄 FLUXO DO USUÁRIO REDESENHADO

### Fluxo Ideal: Aluno Avalia Aula

```
┌─────────────────────────────────────────────────────────┐
│  PASSO 1: Página /aulas                                 │
├─────────────────────────────────────────────────────────┤
│  • Aluno vê lista de aulas do dia                       │
│  • Card mostra: título, professor, horário, status      │
│  • Badge indica:                                         │
│    ✅ "Avaliada" (verde) - completo                     │
│    ⏳ "Pendente" (amarelo) - aguardando avaliação       │
│    🔒 "Bloqueada" (cinza) - ainda não aconteceu        │
│  • Botão "Avaliar Aula" disponível após aula terminar  │
└─────────────────────────────────────────────────────────┘
              ↓ Clica "Avaliar Aula"
┌─────────────────────────────────────────────────────────┐
│  PASSO 2: /avaliacao-aula/[aulaId]/socioemocional      │
├─────────────────────────────────────────────────────────┤
│  QUESTIONÁRIO ADAPTATIVO (5-12 perguntas)              │
│                                                          │
│  [Introdução]                                            │
│  "Como você se sentiu durante a aula de Geografia?"     │
│                                                          │
│  [Pergunta 1 - IRT]                                      │
│  "Eu me senti energizado durante a aula"                │
│   1  2  3  4  5  6  7  8  9  10                        │
│   Discordo ←────────────────→ Concordo                 │
│                                                          │
│  [Motor Adaptativo seleciona próxima pergunta]          │
│  → Se resposta alta em ativação: pergunta sobre valência│
│  → Se resposta baixa: investiga tédio vs. relaxamento   │
│                                                          │
│  [Progresso]                                             │
│  Pergunta 3 de ~8 • Confiança: 67%                      │
│  ▓▓▓▓▓▓▓▓░░░░░░░░░░                                    │
│                                                          │
│  [Visualização em Tempo Real]                            │
│  Gráfico Circumplex com ponto atual estimado            │
└─────────────────────────────────────────────────────────┘
              ↓ Finaliza questionário (confiança > 85%)
┌─────────────────────────────────────────────────────────┐
│  PASSO 3: Resultado Socioemocional                      │
├─────────────────────────────────────────────────────────┤
│  [Resultado Imediato]                                    │
│  "Seu estado emocional: 😊 Engajado Positivo"           │
│                                                          │
│  [Circumplex]                                            │
│  • Sua posição: Valência +0.6, Ativação +0.4           │
│  • Quadrante: Alto Prazer, Alta Energia                │
│  • Emoções similares: Animado, Entusiasmado            │
│                                                          │
│  [Contexto]                                              │
│  "Você está 25% mais engajado que a média da turma      │
│   nesta aula."                                           │
│                                                          │
│  [Botões]                                                │
│  [Avaliar Conteúdo da Aula também] [Concluir]          │
└─────────────────────────────────────────────────────────┘
              ↓ (Opcional) Clica "Avaliar Conteúdo"
┌─────────────────────────────────────────────────────────┐
│  PASSO 4: /avaliacao-aula/[aulaId]/didatica            │
├─────────────────────────────────────────────────────────┤
│  AVALIAÇÃO DO CONTEÚDO (Rápida - 2 min)                │
│                                                          │
│  "O quanto você compreendeu o conteúdo?"                │
│   ⭐⭐⭐⭐⭐                                              │
│                                                          │
│  "O ritmo da aula estava:"                              │
│   ◯ Muito lento  ◉ Adequado  ◯ Muito rápido           │
│                                                          │
│  "Os recursos didáticos foram úteis?"                   │
│   ⭐⭐⭐⭐⭐                                              │
│                                                          │
│  "Algo que funcionou bem nesta aula:"                   │
│   [Texto livre opcional]                                │
│                                                          │
│  "Sugestão de melhoria:"                                │
│   [Texto livre opcional]                                │
│                                                          │
│  [Enviar Avaliação Completa]                            │
└─────────────────────────────────────────────────────────┘
              ↓ Envio bem-sucedido
┌─────────────────────────────────────────────────────────┐
│  PASSO 5: /avaliacao-aula/[aulaId]/concluida           │
├─────────────────────────────────────────────────────────┤
│  ✅ Avaliação Concluída!                                │
│                                                          │
│  Obrigado por avaliar a aula de Geografia!              │
│                                                          │
│  📊 Suas contribuições ajudam:                          │
│  • O professor a melhorar suas aulas                    │
│  • Você a acompanhar sua jornada emocional              │
│  • A escola a criar ambientes de aprendizado melhores   │
│                                                          │
│  [Ver Minha Evolução] [Voltar para Aulas]              │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 RELATÓRIOS NECESSÁRIOS

### 1. Dashboard do Aluno: "Minha Jornada Emocional"
**URL:** `/relatorios/meu-estado-emocional`

```
┌─────────────────────────────────────────────────────────┐
│  📈 MINHA JORNADA EMOCIONAL                             │
├─────────────────────────────────────────────────────────┤
│  [Gráfico de Linha - Temporal]                          │
│  Valência ao longo do tempo (últimas 30 aulas)          │
│  ↑ Positivo                                              │
│  │     •─•       •─•                                    │
│  │  •─•   •─•─•─•   •─•                                │
│  ├─────────────────────────────────→ Tempo             │
│  │                                                       │
│  ↓ Negativo                                              │
│                                                          │
│  [Heatmap Circumplex]                                    │
│  Onde você passa mais tempo emocionalmente?              │
│  Ativação Alta   [🟥🟧🟨🟩 Frequência]                   │
│      │                                                   │
│      │    🔴🔴                                           │
│      │  🔴🔴🔴🔴                                         │
│      │    🔴🔴                                           │
│      └────────────────→ Valência                        │
│                        Positivo                          │
│                                                          │
│  [Insights]                                              │
│  • Você tende a se sentir mais engajado em Matemática   │
│  • Suas aulas de manhã têm ativação 30% maior           │
│  • Sextas-feiras: valência 15% abaixo da média          │
│                                                          │
│  [Por Disciplina]                                        │
│  Geografia   😊 +0.5 ▓▓▓▓▓▓▓▓▓░ 85% positivo            │
│  Matemática  😐  0.0 ▓▓▓▓▓░░░░░ 45% neutro              │
│  História    😢 -0.3 ▓▓░░░░░░░░ 25% negativo            │
└─────────────────────────────────────────────────────────┘
```

### 2. Relatório do Professor: "Estado da Turma"
**URL:** `/relatorios/turma` (acesso: professores)

```
┌─────────────────────────────────────────────────────────┐
│  👥 RELATÓRIO EMOCIONAL DA TURMA - 3º Ano A             │
│  Geografia • Prof. Ana Costa • Outubro 2025             │
├─────────────────────────────────────────────────────────┤
│  [Distribuição Circumplex da Última Aula]               │
│  Aula: "Continentes e Oceanos" (13/10/2025)            │
│                                                          │
│  Ativação Alta                                           │
│      │                                                   │
│      │    👤👤   (Animados)                             │
│      │  👤👤👤👤👤👤 (Engajados)                         │
│      │  👤👤👤 (Calmos)                                  │
│      │    👤 (Entediado)                                │
│      └────────────────→ Valência                        │
│                                                          │
│  [Estatísticas]                                          │
│  • 78% da turma em estados positivos                    │
│  • 15% neutros (atentos mas sem emoção forte)           │
│  • 7% negativos (entediados ou frustrados)              │
│  • Média de valência: +0.42 (+12% vs. aula anterior)    │
│                                                          │
│  [Alunos que Precisam de Atenção] 🔔                    │
│  • João Silva - 3 aulas consecutivas com valência < -0.3│
│  • Maria Santos - Ativação muito baixa (possível        │
│    desengajamento)                                       │
│                                                          │
│  [Evolução Temporal - Últimas 10 Aulas]                 │
│  Valência Média da Turma                                │
│  +1.0 ┤                                                  │
│  +0.5 ┤  •─•     •─•                                    │
│   0.0 ┼──────•─────•─────                               │
│  -0.5 ┤                                                  │
│  -1.0 ┴────────────────────→                            │
│       Out 1  Out 5  Out 10  Out 13                      │
│                                                          │
│  [Feedback Didático - Últimas 5 Aulas]                  │
│  Compreensão do Conteúdo: ⭐⭐⭐⭐⭐ 4.3/5.0              │
│  Ritmo da Aula: 82% "Adequado"                          │
│  Recursos Didáticos: ⭐⭐⭐⭐☆ 3.9/5.0                    │
│                                                          │
│  💬 Comentários Recentes:                                │
│  • "Os mapas ajudaram muito a entender!" (+8 similares) │
│  • "Poderia ter mais exercícios práticos" (+3)          │
└─────────────────────────────────────────────────────────┘
```

### 3. Avaliação Coletiva do Professor
**URL:** `/relatorios/professor/[professorId]` (acesso: coordenação)

```
┌─────────────────────────────────────────────────────────┐
│  📊 AVALIAÇÃO COLETIVA - Prof. Ana Costa                │
│  Período: Outubro 2025 • Respostas: 28/32 alunos       │
├─────────────────────────────────────────────────────────┤
│  [Critérios Avaliados]                                   │
│                                                          │
│  Domínio do Conteúdo        ⭐⭐⭐⭐⭐ 4.8/5.0            │
│  Clareza nas Explicações    ⭐⭐⭐⭐⭐ 4.6/5.0            │
│  Pontualidade/Organização   ⭐⭐⭐⭐⭐ 4.9/5.0            │
│  Acessibilidade/Empatia     ⭐⭐⭐⭐☆ 4.4/5.0            │
│                                                          │
│  [Nota Geral] 4.7/5.0 ⭐⭐⭐⭐⭐                           │
│                                                          │
│  [Evolução]                                              │
│  • +0.3 vs. Setembro (melhoria significativa!)          │
│  • Acessibilidade subiu de 4.0 para 4.4                │
│                                                          │
│  [Comparação com Departamento]                           │
│  Prof. Ana Costa:    4.7 ▓▓▓▓▓▓▓▓▓░                     │
│  Média Geografia:    4.3 ▓▓▓▓▓▓▓▓░░                     │
│  Média Geral Escola: 4.1 ▓▓▓▓▓▓▓░░░                     │
│                                                          │
│  💬 Destaques dos Comentários Anônimos:                  │
│                                                          │
│  [Pontos Fortes]                                         │
│  • "Melhor professora! Explica com exemplos reais"      │
│  • "Super organizada, sempre pontual"                   │
│  • "Usa recursos visuais que facilitam o aprendizado"   │
│                                                          │
│  [Sugestões de Melhoria]                                 │
│  • "Poderia dar mais tempo para perguntas"              │
│  • "Às vezes vai rápido demais nos conceitos difíceis"  │
│                                                          │
│  [Análise de Sentimento]                                 │
│  Positivo: 89% 🟩🟩🟩🟩🟩🟩🟩🟩🟩░                        │
│  Neutro:    8% 🟨░░░░░░░░░░                             │
│  Negativo:  3% 🟥░░░░░░░░░░                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ PLANO DE IMPLEMENTAÇÃO

### SPRINT 1: Fundação (2 semanas)
**Objetivo:** Separar conceitos e preparar infraestrutura

#### Tarefas:
1. **Reestruturar Banco de Dados**
   - [ ] Criar modelo `AvaliacaoSocioemocional`
   - [ ] Criar modelo `AvaliacaoDidatica`
   - [ ] Criar modelo `AvaliacaoProfessor`
   - [ ] Migration para migrar dados antigos (se aplicável)
   - [ ] Deprecar modelo `Avaliacao` antigo

2. **Criar Estrutura de Páginas**
   - [ ] Criar `/avaliacao-aula/[aulaId]/socioemocional/page.tsx`
   - [ ] Criar `/avaliacao-aula/[aulaId]/didatica/page.tsx`
   - [ ] Criar `/avaliacao-aula/[aulaId]/concluida/page.tsx`
   - [ ] Renomear `/avaliacoes` para `/historico-emocional`

3. **Integrar Questionário Adaptativo**
   - [ ] Mover `QuestionarioSocioemocional` para fluxo de avaliação de aula
   - [ ] Criar wrapper que recebe `aulaId` como contexto
   - [ ] Salvar resultados no novo modelo `AvaliacaoSocioemocional`

4. **Atualizar Página /aulas**
   - [ ] Remover modal `AvaliacaoModal` antigo
   - [ ] Botão "Avaliar" agora redireciona para `/avaliacao-aula/[id]/socioemocional`
   - [ ] Mostrar badge "✅ Avaliada" se `AvaliacaoSocioemocional` existe

---

### SPRINT 2: Avaliação Didática (1 semana)
**Objetivo:** Implementar avaliação de conteúdo/didática

#### Tarefas:
1. **Criar Formulário Didático**
   - [ ] Componente `AvaliacaoDidaticaForm.tsx`
   - [ ] Critérios: compreensão, ritmo, recursos, engajamento (1-5)
   - [ ] Campos opcionais: ponto positivo, melhoria, sugestão

2. **API de Avaliação Didática**
   - [ ] `POST /api/avaliacoes/didatica` - salvar avaliação
   - [ ] `GET /api/avaliacoes/didatica/[aulaId]` - buscar por aula

3. **Página de Avaliação Didática**
   - [ ] `/avaliacao-aula/[aulaId]/didatica/page.tsx`
   - [ ] Link após avaliação socioemocional
   - [ ] Permitir pular (opcional)

---

### SPRINT 3: Relatórios do Aluno (1 semana)
**Objetivo:** Dashboard de jornada emocional individual

#### Tarefas:
1. **Página "Minha Jornada Emocional"**
   - [ ] `/relatorios/meu-estado-emocional/page.tsx`
   - [ ] Gráfico temporal de valência/ativação
   - [ ] Heatmap de frequência no circumplex
   - [ ] Insights personalizados (por disciplina, horário)

2. **API de Dados Agregados**
   - [ ] `GET /api/relatorios/aluno/[usuarioId]/evolucao` - série temporal
   - [ ] `GET /api/relatorios/aluno/[usuarioId]/por-disciplina` - métricas
   - [ ] `GET /api/relatorios/aluno/[usuarioId]/insights` - análises

3. **Componentes de Visualização**
   - [ ] `GraficoEvolucionEmocional.tsx` (já existe, adaptar)
   - [ ] `HeatmapCircumplex.tsx` (novo)
   - [ ] `InsightsCard.tsx` (cards com descobertas)

---

### SPRINT 4: Relatórios do Professor (2 semanas)
**Objetivo:** Dashboard para professor ver estado da turma

#### Tarefas:
1. **Página "Estado da Turma"**
   - [ ] `/relatorios/turma/page.tsx` (lista turmas do professor)
   - [ ] `/relatorios/turma/[turmaId]/page.tsx` (detalhes)
   - [ ] Distribuição circumplex da última aula
   - [ ] Lista de alunos que precisam atenção
   - [ ] Evolução temporal da turma

2. **API para Professores**
   - [ ] `GET /api/relatorios/turma/[turmaId]/distribuicao` - snapshot
   - [ ] `GET /api/relatorios/turma/[turmaId]/alunos-atencao` - alerta
   - [ ] `GET /api/relatorios/turma/[turmaId]/evolucao` - temporal
   - [ ] Filtros por aula, período, disciplina

3. **Componentes**
   - [ ] `DistribuicaoCircumplexTurma.tsx`
   - [ ] `AlertasAlunos.tsx` (cards com alunos em risco)
   - [ ] `EvolucaoTurma.tsx` (gráfico)

4. **Relatório Didático do Professor**
   - [ ] Agregar avaliações didáticas por professor
   - [ ] Mostrar média de critérios
   - [ ] Highlights de comentários positivos/melhorias

---

### SPRINT 5: Avaliação do Professor (1 semana)
**Objetivo:** Sistema periódico de avaliação coletiva

#### Tarefas:
1. **Página de Avaliação do Professor**
   - [ ] `/professores/[id]/avaliar/page.tsx`
   - [ ] Formulário com 6 critérios (1-5)
   - [ ] Comentário anônimo opcional
   - [ ] Limite: 1 avaliação por mês por professor

2. **API de Avaliação de Professor**
   - [ ] `POST /api/avaliacoes/professor` - salvar (anônima)
   - [ ] `GET /api/avaliacoes/professor/[id]/resumo` - agregar resultados
   - [ ] Verificar se usuário já avaliou no período

3. **Relatório para Coordenação**
   - [ ] `/relatorios/professor/[id]/page.tsx`
   - [ ] Médias por critério
   - [ ] Evolução temporal
   - [ ] Comparação com departamento
   - [ ] Análise de sentimento dos comentários

---

### SPRINT 6: Refinamentos e Testes (1 semana)
**Objetivo:** Polimento e garantia de qualidade

#### Tarefas:
1. **UX/UI**
   - [ ] Animações suaves entre etapas de avaliação
   - [ ] Loading states em gráficos
   - [ ] Responsividade mobile completa
   - [ ] Dark mode em todos os novos componentes

2. **Performance**
   - [ ] Otimizar queries de agregação
   - [ ] Cache de relatórios (Redis?)
   - [ ] Lazy loading de gráficos pesados

3. **Testes**
   - [ ] Testes unitários dos novos modelos
   - [ ] Testes de integração das APIs
   - [ ] Testes E2E do fluxo completo de avaliação

4. **Documentação**
   - [ ] Atualizar README com novos fluxos
   - [ ] Documentar APIs no Insomnia/Postman
   - [ ] Guia para professores usarem relatórios

---

## 📈 MÉTRICAS DE SUCESSO

### Indicadores Quantitativos
- **Taxa de Conclusão de Avaliação:** > 80% das aulas avaliadas
- **Tempo Médio de Avaliação:** < 3 minutos (questionário adaptativo)
- **Confiança Média das Medições:** > 85%
- **Adoção pelos Professores:** > 70% acessam relatórios semanalmente

### Indicadores Qualitativos
- **Clareza do Fluxo:** Usuários conseguem avaliar sem confusão
- **Valor Percebido:** Alunos entendem benefício da avaliação socioemocional
- **Acionabilidade:** Professores usam dados para melhorar aulas
- **Diferenciação:** Sistema se destaca por ser científico e adaptativo

---

## 🚨 ALERTAS E RISCOS

### Riscos Técnicos
1. **Performance de Agregação:** Relatórios podem ficar lentos com muitos dados
   - **Mitigação:** Pré-calcular agregações diárias (cron job)

2. **Complexidade do Motor Adaptativo:** Questionário pode não convergir
   - **Mitigação:** Limite máximo de 12 perguntas, fallback para avaliação simples

3. **Migração de Dados:** Dados antigos no modelo `Avaliacao`
   - **Mitigação:** Script de migração que tenta inferir valência/ativação

### Riscos de Produto
1. **Resistência dos Alunos:** "Muitas avaliações"
   - **Mitigação:** Gamificação, mostrar impacto claro, tornar rápido (< 3 min)

2. **Ansiedade dos Professores:** "Sendo avaliados constantemente"
   - **Mitigação:** Foco em dados agregados, não individuais; comunicar propósito

3. **Sobrecarga de Dados:** Muitos relatórios confusos
   - **Mitigação:** Dashboards com insights principais destacados

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### 1. Decisão Estratégica (Hoje)
- [ ] Aprovar este relatório
- [ ] Definir prioridade: implementar tudo ou fazer MVP?
- [ ] Alocar recursos (tempo, pessoas)

### 2. Preparação (Amanhã)
- [ ] Criar branch `feature/avaliacao-reestruturacao`
- [ ] Backup do banco de dados atual
- [ ] Criar arquivo de tracking de progresso (checklist)

### 3. Kickoff Sprint 1 (Esta Semana)
- [ ] Implementar novos modelos Prisma
- [ ] Executar migration
- [ ] Criar primeira versão da página `/avaliacao-aula/[id]/socioemocional`
- [ ] Testar questionário adaptativo integrado

---

## 💡 RECOMENDAÇÕES FINAIS

### Para o TCC
✅ **Este alinhamento é ESSENCIAL para seu TCC fazer sentido**
- Justifica o uso do Modelo Circumplex (não é só "emoji de humor")
- Diferencia seu projeto de apps genéricos de feedback
- Permite análises científicas válidas (valência, ativação, temporal)
- Gera dados reais para sua pesquisa

### Para o Produto
✅ **Separação clara de conceitos torna o produto único**
- Socioemocional (científico) vs. Didático (prático) vs. Professor (gestão)
- Cada tipo de avaliação tem propósito distinto
- Relatórios acionáveis para diferentes stakeholders

### Priorização Sugerida
Se tiver que escolher o MVP:
1. **Obrigatório:** Avaliação Socioemocional por aula (Sprint 1)
2. **Importante:** Relatórios do aluno (Sprint 3) - mostra valor
3. **Importante:** Relatórios do professor (Sprint 4) - stakeholder chave
4. **Secundário:** Avaliação didática (Sprint 2) - pode vir depois
5. **Secundário:** Avaliação de professor (Sprint 5) - feature política

---

## 📚 REFERÊNCIAS E INSPIRAÇÕES

### Papers Científicos
- Russell, J. A. (1980). "A circumplex model of affect"
- Watson, D., & Tellegen, A. (1985). "PANAS: Positive and Negative Affect Schedule"
- Feldman Barrett, L. (2017). "How Emotions Are Made"

### Produtos Similares (mas não iguais!)
- **ClassDojo:** Foco em comportamento, não emoção
- **Seesaw:** Portfolio de aprendizado, não socioemocional
- **Kahoot!:** Gamificação de conteúdo, não estado emocional

### Diferenciais do ClassCheck
✅ Único com questionário adaptativo IRT  
✅ Único baseado em modelo científico (Circumplex)  
✅ Único com avaliação POR AULA (não geral)  
✅ Único com relatórios para aluno, professor E coordenação  

---

## ✅ CONCLUSÃO

Seu projeto **ClassCheck** tem um potencial ENORME, mas está **desperdiçando** o trabalho já feito no questionário adaptativo ao deixá-lo isolado em uma página separada.

### O que você precisa fazer:
1. **Eliminar redundância:** `/avaliacoes` como está hoje não agrega valor
2. **Integrar o adaptativo:** Todo "Avaliar Aula" deve usar `QuestionarioSocioemocional`
3. **Separar conceitos:** Socioemocional ≠ Didático ≠ Avaliação de Professor
4. **Criar relatórios acionáveis:** Dados servem para DECISÕES, não só histórico

### Impacto no TCC:
✅ Alinha tecnologia (motor adaptativo) com propósito (avaliação socioemocional)  
✅ Justifica complexidade técnica (não é só CRUD)  
✅ Gera dados científicos válidos para análise  
✅ Diferencia de qualquer outro projeto de TCC  

### Tempo estimado:
- **MVP (Sprints 1, 3, 4):** 4 semanas
- **Completo (Sprints 1-6):** 8 semanas

### Resultado final:
Um sistema de avaliação socioemocional **único no mercado**, com base científica sólida, que realmente ajuda alunos e professores a entenderem e melhorarem a experiência de aprendizado.

---

**Status:** 🟢 Pronto para Implementação  
**Aprovação necessária:** Felipe Allan (Product Owner)  
**Próximo passo:** Decidir escopo (MVP vs. Completo) e iniciar Sprint 1

---

*Gerado em: 13 de outubro de 2025*  
*Versão: 1.0*  
*Confidencial - Uso Acadêmico (TCC)*
