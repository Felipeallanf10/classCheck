# 🎯 Planejamento - ClassCheck

Esta pasta contém todos os planos estratégicos, roadmaps e sprints do projeto ClassCheck.

---

## ⭐ Documentos Principais

### 🚀 Ponto de Entrada
- **[COMECE_AQUI.md](./COMECE_AQUI.md)** - **START HERE** - Guia de navegação e início

### 📋 Roadmaps e Visão Geral
- **[PLANO_COMPLETO_OVERVIEW.md](./PLANO_COMPLETO_OVERVIEW.md)** - Plano completo 10 semanas (100-120h)
- **[LISTA_SPRINTS_COMPLETA.md](./LISTA_SPRINTS_COMPLETA.md)** - Índice de todos os Sprints
- **[PLANO_MELHORIAS_QUESTIONARIOS_RELATORIOS.md](./PLANO_MELHORIAS_QUESTIONARIOS_RELATORIOS.md)** - Plano original detalhado

---

## 🏃 Sprints Detalhados (10 semanas)

Cada Sprint contém:
- ✅ Objetivos claros
- ✅ Código TypeScript completo
- ✅ Exemplos Prisma
- ✅ Componentes React
- ✅ Validação Zod
- ✅ Checklist de validação
- ✅ Comandos Git
- ✅ Commits semânticos

### Sprint 1: Escalas Clínicas (8-10h)
**[SPRINT_01_ESCALAS_CLINICAS.md](./SPRINT_01_ESCALAS_CLINICAS.md)**
- PHQ-9 (9 perguntas - Depressão)
- GAD-7 (7 perguntas - Ansiedade)
- WHO-5 (5 perguntas - Bem-estar)
- Funções de interpretação
- Seeds completos

### Sprint 2: Exportação PDF/Excel (10-12h)
**[SPRINT_02_EXPORTACAO_PDF_EXCEL.md](./SPRINT_02_EXPORTACAO_PDF_EXCEL.md)**
- jsPDF para relatórios PDF
- xlsx para exportação Excel
- API `/api/relatorios/export`
- Gráficos incorporados
- Multi-sheet Excel

### Sprint 3: Dashboard Professor (12-14h)
**[SPRINT_03_DASHBOARD_PROFESSOR.md](./SPRINT_03_DASHBOARD_PROFESSOR.md)**
- Visão geral de turmas
- Lista de alunos em risco
- Relatórios agregados
- API `/api/professor/relatorios/turma`
- Componentes visuais

### Sprint 4: Redis Caching (6-8h)
**[SPRINT_04_REDIS_CACHING.md](./SPRINT_04_REDIS_CACHING.md)**
- Upstash Redis setup
- Cache de queries Prisma
- `getCached()` / `invalidarCache()`
- TTL configurável
- Migração de APIs

### Sprint 5: Questionários Contextuais (10-12h)
**[SPRINT_05_QUESTIONARIOS_CONTEXTUAIS.md](./SPRINT_05_QUESTIONARIOS_CONTEXTUAIS.md)**
- 15 perguntas check-in diário
- 18 perguntas pós-aula
- 12 perguntas eventos especiais
- Sistema de templates
- Agendamento automático

### Sprint 6: Regras Adaptativas Avançadas (12-14h)
**[SPRINT_06_REGRAS_ADAPTATIVAS.md](./SPRINT_06_REGRAS_ADAPTATIVAS.md)**
- 10+ regras predefinidas
- json-rules-engine
- Dashboard `/admin/regras`
- Logs de auditoria
- Sistema de prioridades

### Sprint 7: APIs de Relatórios (10-12h)
**[SPRINT_07_APIS_RELATORIOS.md](./SPRINT_07_APIS_RELATORIOS.md)**
- `/api/relatorios/evolucao-temporal`
- `/api/relatorios/comparativo-periodos`
- `/api/relatorios/mapa-calor`
- `/api/relatorios/radar-categorias`
- Types padronizados

### Sprint 8: Melhorias Dashboard Aluno (8-10h)
**[SPRINT_08_DASHBOARD_ALUNO.md](./SPRINT_08_DASHBOARD_ALUNO.md)**
- Widget Jornada Emocional
- Widget Conquistas/XP
- Widget Próximos Check-ins
- Circumplex Interativo
- Timeline de Alertas

### Sprint 9: Dashboard Admin Completo (14-16h)
**[SPRINT_09_DASHBOARD_ADMIN.md](./SPRINT_09_DASHBOARD_ADMIN.md)**
- Métricas do sistema
- Análise de questionários
- Análise de alertas
- Análise clínica agregada
- Logs e auditoria

### Sprint 10: Otimização Performance IRT (6-8h)
**[SPRINT_10_OTIMIZACAO_PERFORMANCE.md](./SPRINT_10_OTIMIZACAO_PERFORMANCE.md)**
- Cache LRU para P(θ)
- Pré-cálculo Fisher Information
- Tolerância ajustada
- Benchmarks
- Meta: -40% tempo (200ms → 100ms)

---

## 📋 Outros Planos Estratégicos

### Arquitetura e Modelagem
- [ARQUITETURA_TURMAS.md](./ARQUITETURA_TURMAS.md) - Sistema de turmas
- [PLANEJAMENTO_BANCO_DADOS_ADAPTATIVO.md](./PLANEJAMENTO_BANCO_DADOS_ADAPTATIVO.md) - BD adaptativo
- [LEVANTAMENTO_REQUISITOS_BANCO_DADOS.md](./LEVANTAMENTO_REQUISITOS_BANCO_DADOS.md)

### Autenticação e Permissões
- [IMPLEMENTACAO_AUTH.md](./IMPLEMENTACAO_AUTH.md) - Sistema de autenticação
- [GERENCIAMENTO_USUARIOS_ROLES.md](./GERENCIAMENTO_USUARIOS_ROLES.md) - Roles
- [PERMISSOES_E_NAVEGACAO.md](./PERMISSOES_E_NAVEGACAO.md) - Controle de acesso

### Integração e Fluxos
- [PLANO_INTEGRACAO_SISTEMA_ADAPTATIVO.md](./PLANO_INTEGRACAO_SISTEMA_ADAPTATIVO.md)
- [PLANO_REESTRUTURACAO_FLUXO_AVALIACOES.md](./PLANO_REESTRUTURACAO_FLUXO_AVALIACOES.md)
- [REGRAS_NEGOCIO_FLUXOS.md](./REGRAS_NEGOCIO_FLUXOS.md)

### Fases e Ações
- [PLANO_ACAO_FASE_2.7.md](./PLANO_ACAO_FASE_2.7.md)
- [PROXIMOS_PASSOS.md](./PROXIMOS_PASSOS.md)

### Histórico
- [PLANO_EXECUCAO_PROFISSIONAL_V3.1.md](./PLANO_EXECUCAO_PROFISSIONAL_V3.1.md) - Versão anterior
- [SPRINTS_04_A_10_GUIA_RAPIDO.md](./SPRINTS_04_A_10_GUIA_RAPIDO.md) - Guia resumido
- [EXEMPLOS_IMPLEMENTACAO_MELHORIAS.md](./EXEMPLOS_IMPLEMENTACAO_MELHORIAS.md)

---

## 🎯 Como Usar Esta Documentação

### Para Iniciar Desenvolvimento
1. Leia **[COMECE_AQUI.md](./COMECE_AQUI.md)**
2. Consulte **[PLANO_COMPLETO_OVERVIEW.md](./PLANO_COMPLETO_OVERVIEW.md)**
3. Escolha um Sprint para implementar

### Para Implementar um Sprint
1. Abra o arquivo `SPRINT_XX_NOME.md`
2. Leia os objetivos e dependências
3. Siga a seção de implementação (código completo)
4. Execute o checklist de validação
5. Faça commit seguindo o exemplo

### Para Entender a Estratégia
1. **Visão Geral**: [PLANO_COMPLETO_OVERVIEW.md](./PLANO_COMPLETO_OVERVIEW.md)
2. **Lista Completa**: [LISTA_SPRINTS_COMPLETA.md](./LISTA_SPRINTS_COMPLETA.md)
3. **Plano Original**: [PLANO_MELHORIAS_QUESTIONARIOS_RELATORIOS.md](./PLANO_MELHORIAS_QUESTIONARIOS_RELATORIOS.md)

---

## 📊 Resumo dos Sprints

| Sprint | Esforço | Status | Principais Entregas |
|--------|---------|--------|---------------------|
| 1 | 8-10h | 📋 Planejado | PHQ-9, GAD-7, WHO-5 (21 perguntas) |
| 2 | 10-12h | 📋 Planejado | Exportação PDF/Excel |
| 3 | 12-14h | 📋 Planejado | Dashboard Professor |
| 4 | 6-8h | 📋 Planejado | Redis Caching |
| 5 | 10-12h | 📋 Planejado | 45 perguntas contextuais |
| 6 | 12-14h | 📋 Planejado | 10+ regras adaptativas |
| 7 | 10-12h | 📋 Planejado | 4 APIs de relatórios |
| 8 | 8-10h | 📋 Planejado | 5 widgets dashboard aluno |
| 9 | 14-16h | 📋 Planejado | Dashboard admin completo |
| 10 | 6-8h | 📋 Planejado | Otimização IRT (-40%) |

**Total**: 100-120 horas | 10 semanas

---

## 🔗 Links Relacionados

- [../INDEX.md](../INDEX.md) - Índice geral da documentação
- [../guias/](../guias/) - Guias práticos
- [../implementacoes/](../implementacoes/) - Features já implementadas
- [../sistema-adaptativo/](../sistema-adaptativo/) - Documentação IRT/CAT

---

**Última Atualização**: 21 de novembro de 2025  
**Total de Documentos**: 30+  
**Status**: Todos os Sprints planejados e prontos para execução
