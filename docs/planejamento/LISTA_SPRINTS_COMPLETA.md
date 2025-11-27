# 📋 Lista Completa de Sprints - ClassCheck v3.2

**Total**: 10 Sprints | **Duração**: 10 semanas | **Esforço**: 100-120 horas

---

## ✅ SPRINT 1: Escalas Clínicas Validadas
**Arquivo**: `SPRINT_01_ESCALAS_CLINICAS.md`  
**Status**: ✅ Criado  
**Conteúdo**: PHQ-9, GAD-7, WHO-5, PSS-10, Rosenberg, UCLA-3 (51 perguntas)

---

## ⏳ SPRINT 2: Exportação PDF e Excel
**Arquivo**: `SPRINT_02_EXPORTACAO_PDF_EXCEL.md`  
**Status**: ⏳ A criar  
**Conteúdo**:
- Implementar jsPDF para relatórios PDF
- Implementar xlsx para relatórios Excel
- API `/api/relatorios/export`
- Templates de relatórios profissionais
- Gráficos em PDF (base64 images)

---

## ⏳ SPRINT 3: Dashboard Professor Completo
**Arquivo**: `SPRINT_03_DASHBOARD_PROFESSOR.md`  
**Status**: ⏳ A criar  
**Conteúdo**:
- Rota `/professor/relatorios`
- API `/api/professor/relatorios/turma`
- Componentes: VisaoGeralTurma, AlunosEmRisco
- Filtros por turma e período
- Cálculo de nível de risco automático

---

## ⏳ SPRINT 4: Cache Distribuído Redis (Opcional)
**Arquivo**: `SPRINT_04_REDIS_CACHING.md`  
**Status**: ⏳ A criar  
**Conteúdo**:
- Setup Upstash Redis
- Implementar redis-cache.ts
- Migrar cache em memória
- Estratégia de invalidação automática
- Configurar REDIS_URL e REDIS_TOKEN

---

## ⏳ SPRINT 5: Questionários Contextuais
**Arquivo**: `SPRINT_05_QUESTIONARIOS_CONTEXTUAIS.md`  
**Status**: ⏳ A criar  
**Conteúdo**:
- CHECK_IN_DIARIO (15 perguntas)
- AULA (18 perguntas)
- EVENTO (12 perguntas)
- Templates não-adaptativos
- Sistema de agendamento

---

## ⏳ SPRINT 6: Regras Adaptativas Avançadas
**Arquivo**: `SPRINT_06_REGRAS_ADAPTATIVAS.md`  
**Status**: ⏳ A criar  
**Conteúdo**:
- Expandir json-rules-engine
- 10+ regras predefinidas (ansiedade alta, depressão severa, etc)
- Dashboard `/admin/regras`
- Logs e auditoria de regras
- Taxa de acerto e falsos positivos

---

## ⏳ SPRINT 7: APIs Faltantes de Relatórios
**Arquivo**: `SPRINT_07_APIS_RELATORIOS.md`  
**Status**: ⏳ A criar  
**Conteúdo**:
- API `/evolucao-temporal`
- API `/comparativo-periodos`
- API `/mapa-calor`
- API `/radar-categorias`
- Types RelatorioResponse<T> padronizados

---

## ⏳ SPRINT 8: Melhorias Dashboard Aluno
**Arquivo**: `SPRINT_08_DASHBOARD_ALUNO.md`  
**Status**: ⏳ A criar  
**Conteúdo**:
- Widget "Jornada Emocional"
- Widget "Conquistas Recentes"
- Widget "Próximos Check-ins"
- Gráfico Circumplex interativo
- Timeline de alertas resolvidos

---

## ⏳ SPRINT 9: Dashboard Admin Completo
**Arquivo**: `SPRINT_09_DASHBOARD_ADMIN.md`  
**Status**: ⏳ A criar  
**Conteúdo**:
- Rota `/admin/relatorios`
- Métricas do sistema (uso, performance)
- Análise clínica agregada (PHQ-9, GAD-7 distribuição)
- Mapa de calor institucional
- Logs de algoritmos adaptativos
- Relatório de eficácia de questionários

---

## ⏳ SPRINT 10: Otimização Performance IRT
**Arquivo**: `SPRINT_10_OTIMIZACAO_PERFORMANCE.md`  
**Status**: ⏳ A criar  
**Conteúdo**:
- Caching de cálculos IRT
- Pré-cálculo de Fisher Information
- Otimização Newton-Raphson (tolerância, iterações)
- Benchmarks antes/depois
- Análise de performance com 100+ respostas

---

## 📊 Estatísticas Totais

- **Arquivos criados**: 11 (1 overview + 10 sprints)
- **Novas perguntas**: ~125 (51 escalas + 45 contextuais + 29 diversas)
- **APIs criadas**: ~10
- **Componentes novos**: ~15
- **Seeds implementados**: ~12
- **Horas estimadas**: 100-120h

---

**Próximo passo**: Criar arquivos detalhados dos Sprints 2-10

**Data**: 21/11/2025
