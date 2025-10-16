# 🧭 Guia de Navegação - Sistema de Avaliações

## 📋 Visão Geral

Este documento descreve todos os pontos de acesso e navegação para as funcionalidades de avaliação implementadas no ClassCheck, incluindo:

- ✅ Avaliação Socioemocional (IRT adaptativo)
- ✅ Avaliação Didática (4 critérios)
- ✅ Avaliação de Professores (6 critérios, mensal, anônima)
- ✅ Relatórios e Dashboards

---

## 🎯 Mapa de Navegação por Perfil

### 👨‍🎓 **Perfil: Aluno**

#### **1. Dashboard Principal** `/dashboard`

**Ações Rápidas disponíveis:**
- 🌟 **Avaliar Aula** → `/avaliacoes`
- 👥 **Avaliar Professor** → `/professores` (NOVO)
- ❤️ **Registrar Humor** → `/avaliacao-socioemocional`
- 📅 **Ver Próximas Aulas** → `/aulas`

#### **2. Sidebar**
- 🏠 Dashboard
- 📚 Aulas
- ⭐ **Professores** (NOVO)
- ❤️ Avaliações
- 🎯 Avaliação Socioemocional
- 🏆 Gamificação
- 📊 Insights
- 📄 Relatórios
- 📅 Eventos

#### **3. Fluxo de Avaliação de Aula**

```
/aulas 
  → Seleciona aula
    → /avaliacao-aula/[aulaId]/socioemocional (Questionário IRT adaptativo, 5-12 perguntas)
    → /avaliacao-aula/[aulaId]/didatica (4 critérios: compreensão, ritmo, recursos, engajamento)
    → /avaliacao-aula/[aulaId]/concluida (Página de sucesso com gamificação)
```

**Página de conclusão inclui:**
- ✨ Contador animado de avaliações
- 🔥 Sistema de streak (dias consecutivos)
- 🏆 Progresso de badges
- 💬 Mensagens motivacionais dinâmicas
- 📊 Estatísticas pessoais

#### **4. Fluxo de Avaliação de Professor** (NOVO)

```
/professores 
  → Lista todos os professores com filtros e busca
  → Clica em "Avaliar" no card do professor
    → /professores/[id]/avaliar (Formulário de avaliação anônima)
```

**Página de avaliação de professor inclui:**
- 🌟 6 critérios com avaliação por estrelas (1-5):
  - Domínio do Conteúdo
  - Clareza nas Explicações
  - Pontualidade
  - Organização
  - Acessibilidade
  - Empatia
- 🛡️ Garantia de anonimato
- 📅 Limite: 1 avaliação por mês por professor
- 💬 Campo de comentário opcional (500 caracteres)
- 📊 Preview da média em tempo real

#### **5. Dashboard Pessoal**

```
/relatorios/meu-estado-emocional
```

**Visualiza:**
- 📈 Evolução emocional ao longo do tempo
- 🎨 Distribuição de emoções (gráfico de pizza)
- 🎭 Circumplex Model (scatter plot)
- 📊 Padrões de valência e ativação
- 💡 Insights personalizados

---

### 👨‍🏫 **Perfil: Professor**

#### **1. Dashboard Principal** `/dashboard`

Mesmo dashboard unificado dos alunos com visualizações apropriadas.

#### **2. Relatórios de Turma - Socioemocional**

```
/relatorios/turma/aula/[aulaId]
```

**Visualiza (3 abas):**
- 📊 **Visão Geral**: Média de valência/ativação, distribuição de emoções
- 👥 **Detalhes**: Lista individual de avaliações anônimas
- 💡 **Insights**: Recomendações baseadas nos dados

**Botão disponível:**
- 📊 **Ver Relatório Didático** → `/relatorios/turma/aula/[aulaId]/didatica` (linha 194 do arquivo)

#### **3. Relatórios de Turma - Didática** (NOVO)

```
/relatorios/turma/aula/[aulaId]/didatica
```

**Visualiza (3 abas):**
- 📊 **Métricas**:
  - Gráfico de barras com 4 critérios
  - Cards com médias e interpretação automática
  - Distribuição de ritmo (gráfico de pizza)
- 💬 **Feedback**:
  - Pontos fortes agregados (frequência)
  - Sugestões agregadas (frequência)
  - Análise qualitativa
- 📋 **Detalhes**:
  - Listagem completa de avaliações individuais
  - Estrelas por critério
  - Comentários textuais

#### **4. Navegação entre Relatórios**

O professor pode alternar facilmente entre os relatórios socioemocional e didático da mesma aula através do botão "Ver Relatório Didático" na página socioemocional.

---

### 👔 **Perfil: Coordenação**

#### **1. Lista de Professores** `/professores`

**Funcionalidades:**
- 🔍 Busca por nome ou disciplina
- 🏷️ Filtro por departamento
- 📊 Estatísticas gerais:
  - Total de professores
  - Média geral de avaliações
  - Total de avaliações recebidas
  - Alunos ativos

**Cards de Professores exibem:**
- 👤 Foto/Avatar
- ⭐ Média de avaliação
- 📈 Total de avaliações
- 👥 Alunos ativos
- 🏆 Qualidade destaque

**Ações disponíveis:**
- 📊 **Ver Relatório** → `/relatorios/professor/[id]`
- 👤 **Ver Perfil** → `/professores/[id]`

#### **2. Relatório de Avaliação de Professor** (NOVO)

```
/relatorios/professor/[id]
```

**Visualiza (4 abas):**

**📊 Critérios:**
- Gráfico radar hexagonal com 6 critérios
- Cards individuais com médias e tendências
- Comparação com mês anterior

**📈 Evolução:**
- Gráfico de linha dos últimos 3 meses
- Tendência geral (subindo/estável/descendo)
- Média histórica

**💬 Feedback:**
- Análise de sentimento (positivo/neutro/negativo)
- Comentários categorizados
- Nuvem de palavras mais frequentes

**⚖️ Comparação:**
- Gráfico de barras comparativo:
  - Média do professor
  - Média do departamento
  - Média da escola
- Insights de posicionamento

---

## 🚀 Novos Recursos Implementados

### 1. **Página de Listagem de Professores** (`/professores`)

**Arquivo:** `src/app/professores/page.tsx`

**Características:**
- ✅ Design responsivo (grid adaptativo)
- ✅ Sistema de busca em tempo real
- ✅ Filtros por departamento
- ✅ Estatísticas agregadas
- ✅ Cards informativos com avatares
- ✅ Emojis dinâmicos baseados na média
- ✅ Badges de destaque (melhor qualidade)
- ✅ Ações contextuais por perfil:
  - **Aluno**: Botão "Avaliar"
  - **Professor**: Botão "Ver Perfil"
  - **Coordenação**: Botões "Relatório" + "Ver Perfil"

**Dados mockados:** 8 professores com diferentes disciplinas e departamentos

### 2. **Item "Professores" na Sidebar**

**Arquivo:** `src/components/app-sidebar.tsx`

**Mudança:**
```tsx
const navItems = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Aulas", icon: BookOpen, href: "/aulas" },
  { label: "Professores", icon: Star, href: "/professores" }, // NOVO
  // ... resto dos itens
]
```

### 3. **Ação Rápida "Avaliar Professor"**

**Arquivo:** `src/components/dashboard/UnifiedDashboard.tsx`

**Mudança:**
```tsx
const quickActions = [
  { title: "Avaliar Aula", icon: <Star />, href: "/avaliacoes" },
  { title: "Avaliar Professor", icon: <Users />, href: "/professores" }, // NOVO
  { title: "Registrar Humor", icon: <Heart />, href: "/avaliacao-socioemocional" },
  { title: "Ver Próximas Aulas", icon: <Calendar />, href: "/aulas" }
]
```

---

## 📱 Experiência Mobile

Todas as páginas foram otimizadas para dispositivos móveis:

- ✅ Grid responsivo (1 coluna em mobile, 2-3 em desktop)
- ✅ Botões e cards adaptativos
- ✅ Textos e ícones em tamanhos apropriados
- ✅ Tabs com scroll horizontal quando necessário
- ✅ Gráficos responsivos via Recharts

---

## 🎨 Design System

### Cores por Avaliação

- **Socioemocional**: Rosa (`text-pink-600`)
- **Didática**: Azul (`text-blue-600`)
- **Professor**: Roxo (`text-purple-600`)

### Ícones Principais

- 🌟 Avaliação de Aula (Star)
- 👥 Avaliação de Professor (Users)
- ❤️ Humor/Socioemocional (Heart)
- 📊 Relatórios (BarChart3)
- 🏆 Gamificação (Trophy)

---

## 🔒 Controle de Acesso

### Perfil: Aluno
✅ Pode avaliar aulas (socioemocional + didática)
✅ Pode avaliar professores (1x por mês)
✅ Pode ver seu dashboard pessoal
❌ Não pode ver relatórios de professores

### Perfil: Professor
✅ Pode ver relatórios de suas aulas (socioemocional + didática)
✅ Pode ver lista de professores
❌ Não pode avaliar professores
❌ Não pode ver relatórios de outros professores

### Perfil: Coordenação
✅ Pode ver todos os relatórios
✅ Pode ver avaliações de professores
✅ Pode acessar comparações e estatísticas
✅ Acesso completo ao sistema

---

## 📊 Dados Disponíveis

### Mock Data Atual

**Professores:** 8 professores cadastrados
- Matemática, Física, Química (Exatas)
- História, Literatura, Geografia (Humanas)
- Biologia (Biológicas)
- Inglês (Linguagens)

**Avaliações Didáticas:** 28 avaliações por aula (mock)
**Avaliações de Professores:** 3 meses de histórico (mock)
**Avaliações Socioemocionais:** Dados completos no dashboard pessoal

---

## 🧪 Como Testar

### 1. Testar como Aluno

```bash
# Na página /professores/page.tsx, linha 119:
const [userRole] = useState<'aluno' | 'professor' | 'coordenacao'>('aluno')
```

**Fluxo:**
1. Acesse `/dashboard`
2. Clique em "Avaliar Professor" nas ações rápidas
3. Na lista, clique em "Avaliar" em qualquer professor
4. Preencha os 6 critérios com estrelas
5. Adicione comentário (opcional)
6. Envie a avaliação
7. Tente avaliar novamente (verá mensagem de limite mensal)

### 2. Testar como Professor

```bash
# Na página /professores/page.tsx, linha 119:
const [userRole] = useState<'aluno' | 'professor' | 'coordenacao'>('professor')
```

**Fluxo:**
1. Acesse `/relatorios/turma/aula/1`
2. Visualize o relatório socioemocional
3. Clique em "📊 Ver Relatório Didático"
4. Explore as 3 abas (Métricas, Feedback, Detalhes)

### 3. Testar como Coordenação

```bash
# Na página /professores/page.tsx, linha 119:
const [userRole] = useState<'aluno' | 'professor' | 'coordenacao'>('coordenacao')
```

**Fluxo:**
1. Acesse `/professores`
2. Use filtros e busca
3. Clique em "Relatório" em qualquer professor
4. Explore as 4 abas (Critérios, Evolução, Feedback, Comparação)
5. Analise tendências e comparações

---

## 🎯 Próximos Passos (Futuro)

### Integração Backend
- [ ] Conectar com API real
- [ ] Implementar autenticação e autorização
- [ ] Persistência real de avaliações
- [ ] Sistema de notificações

### Melhorias UX
- [ ] Filtros avançados (por média, departamento, período)
- [ ] Exportação de relatórios em PDF
- [ ] Comparações customizadas
- [ ] Alertas automáticos para coordenação

### Gamificação Expandida
- [ ] Badges por tipo de avaliação
- [ ] Ranking de participação
- [ ] Recompensas por consistência
- [ ] Desafios mensais

---

## 📚 Arquivos Criados/Modificados

### Novos Arquivos:
1. `src/app/professores/page.tsx` - Listagem de professores
2. `src/app/professores/[id]/avaliar/page.tsx` - Formulário de avaliação
3. `src/app/relatorios/professor/[id]/page.tsx` - Relatório de avaliações
4. `src/app/relatorios/turma/aula/[aulaId]/didatica/page.tsx` - Relatório didático
5. `src/app/avaliacao-aula/[aulaId]/concluida/page.tsx` - Página de conclusão gamificada
6. `docs/IMPLEMENTACOES_FRONTEND_COMPLETAS.md` - Documentação técnica completa
7. `docs/NAVEGACAO_AVALIACOES.md` - Este documento

### Arquivos Modificados:
1. `src/components/app-sidebar.tsx` - Adicionado item "Professores"
2. `src/components/dashboard/UnifiedDashboard.tsx` - Adicionada ação rápida
3. `src/app/globals.css` - Adicionadas animações (bounce-once, fadeInUp)

---

## 🎉 Resumo das Implementações

| Funcionalidade | Status | Acesso |
|---------------|--------|--------|
| Avaliação Socioemocional | ✅ Completo | `/avaliacao-aula/[aulaId]/socioemocional` |
| Avaliação Didática | ✅ Completo | `/avaliacao-aula/[aulaId]/didatica` |
| Avaliação de Professores | ✅ Completo | `/professores/[id]/avaliar` |
| Dashboard Pessoal (Aluno) | ✅ Completo | `/relatorios/meu-estado-emocional` |
| Relatório Socioemocional (Prof) | ✅ Completo | `/relatorios/turma/aula/[aulaId]` |
| Relatório Didático (Prof) | ✅ Completo | `/relatorios/turma/aula/[aulaId]/didatica` |
| Relatório Avaliação (Coord) | ✅ Completo | `/relatorios/professor/[id]` |
| Listagem de Professores | ✅ Completo | `/professores` |
| Página de Conclusão | ✅ Completo | `/avaliacao-aula/[aulaId]/concluida` |
| Navegação Sidebar | ✅ Completo | Todos os perfis |
| Ações Rápidas Dashboard | ✅ Completo | Todos os perfis |

---

## 💡 Dicas de Uso

### Para Demonstrações TCC:

1. **Preparar dados:** Ajuste os mocks para refletir cenários realistas
2. **Testar todos os perfis:** Demonstre cada perspectiva (aluno/professor/coordenação)
3. **Destacar gamificação:** Mostre o sistema de streaks e badges
4. **Mostrar navegação fluida:** Demonstre como o usuário encontra facilmente as funcionalidades
5. **Enfatizar anonimato:** Explique as garantias de privacidade nas avaliações

### Para Desenvolvimento Futuro:

1. **Backend primeiro:** Implemente as APIs seguindo as interfaces dos mocks
2. **Autenticação:** Use NextAuth.js ou similar para controle de sessão
3. **Banco de dados:** PostgreSQL já configurado, rode as migrations
4. **Testes:** Adicione testes E2E com Playwright ou Cypress
5. **Performance:** Implemente cache e otimize queries

---

**Última atualização:** 2025-01-08
**Versão:** 1.0.0
**Status:** Sistema de navegação completo e funcional ✅
