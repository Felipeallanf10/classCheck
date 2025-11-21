# 📚 ClassCheck - Documentação Técnica

**Projeto**: ClassCheck - Sistema de Avaliação Socioemocional Adaptativa  
**Versão**: 3.0  
**Stack**: Next.js 15 + TypeScript + PostgreSQL + Prisma  
**Última Atualização**: 21 de novembro de 2025  

---

## 🎯 Navegação Rápida

| Documento | Descrição |
|-----------|-----------|
| **📖 [INDEX.md](./INDEX.md)** | **Catálogo completo** de todos os documentos (120+ arquivos) |
| **🚀 [COMECE AQUI](./planejamento/COMECE_AQUI.md)** | Ponto de entrada para desenvolvimento |
| **📋 [PLANO COMPLETO](./planejamento/PLANO_COMPLETO_OVERVIEW.md)** | Roadmap 10 semanas de melhorias |
| **🏃 [SPRINTS](./planejamento/LISTA_SPRINTS_COMPLETA.md)** | 10 Sprints detalhados (100-120h) |
| **📖 [GUIA RÁPIDO](./guias/GUIA_INICIO_RAPIDO.md)** | Setup e início rápido |
| **🏗️ [ARQUITETURA](./arquitetura/DIAGRAMA_ER_CLASSCHECK.md)** | Diagramas e estrutura |

---

## 📂 Estrutura da Documentação

```
docs/
├── 📖 INDEX.md                    ⭐ ÍNDICE GERAL - Comece aqui
├── 📄 README.md                   Este arquivo
│
├── 🎯 planejamento/              Planos, roadmaps, sprints
│   ├── COMECE_AQUI.md            ⭐ Ponto de entrada
│   ├── PLANO_COMPLETO_OVERVIEW.md
│   ├── LISTA_SPRINTS_COMPLETA.md
│   └── SPRINT_01 a 10.md         10 Sprints detalhados
│
├── 🏗️ arquitetura/               Diagramas, decisões técnicas
│   ├── DIAGRAMA_ER_CLASSCHECK.md
│   └── MAPA_FLUXOS_COMPLETO.md
│
├── 🧠 sistema-adaptativo/        IRT, CAT, algoritmos
│   ├── SISTEMA_ADAPTATIVO_COMPLETO.md
│   └── RESUMO_EXECUTIVO_CAT_DOUTORADO.md
│
├── 💻 implementacoes/            Features implementadas
│   └── RESUMO_EXECUTIVO_IMPLEMENTACOES.md
│
├── 🧩 componentes/               Componentes React/UI
│   └── COMPONENTES_UI_TIPOS_PERGUNTAS.md
│
├── 📖 guias/                     Tutoriais práticos
│   ├── GUIA_INICIO_RAPIDO.md
│   ├── SETUP.md
│   └── GIT_WORKFLOW.md
│
├── 🔬 analises/                  Análises técnicas
│   └── RELATORIO_ANALISE_TECNICA.md
│
├── 📊 relatorios-gerais/        Relatórios de progresso
│   └── RELATORIO_FINAL_TCC.md
│
├── 🏃 sprints/                   Sprints concluídos (1-4)
├── 🔄 migracao/                  Migrações de BD
├── 🔧 api-correções/             Correções e melhorias
└── 📈 analytics/                 Modelos analíticos
```

---

## 🚀 Quick Start

### Para Novos Desenvolvedores

1. **Leia o Índice Completo**:
   ```bash
   cat docs/INDEX.md
   ```

2. **Configure o Ambiente**:
   - [SETUP.md](./guias/SETUP.md) - Instalação completa
   - [GUIA_INICIO_RAPIDO.md](./guias/GUIA_INICIO_RAPIDO.md) - Quick start

3. **Entenda o Workflow**:
   - [GIT_WORKFLOW.md](./guias/GIT_WORKFLOW.md) - Git flow
   - [COMECE_AQUI.md](./planejamento/COMECE_AQUI.md) - Desenvolvimento

### Para Implementar Melhorias

1. **Consulte o Plano**:
   - [PLANO_COMPLETO_OVERVIEW.md](./planejamento/PLANO_COMPLETO_OVERVIEW.md)

2. **Escolha um Sprint** (1-10):
   - [SPRINT_01_ESCALAS_CLINICAS.md](./planejamento/SPRINT_01_ESCALAS_CLINICAS.md)
   - [SPRINT_02_EXPORTACAO_PDF_EXCEL.md](./planejamento/SPRINT_02_EXPORTACAO_PDF_EXCEL.md)
   - ... até Sprint 10

3. **Siga o Checklist**:
   - Cada Sprint tem código completo
   - Commits semânticos padronizados
   - Testes incluídos

---

## 📖 Documentação por Área

### 🧠 Sistema Adaptativo (IRT/CAT)
O coração do ClassCheck - algoritmos de teste adaptativo computadorizado.

- [SISTEMA_ADAPTATIVO_COMPLETO.md](./sistema-adaptativo/SISTEMA_ADAPTATIVO_COMPLETO.md) - Overview completo
- [RESUMO_EXECUTIVO_CAT_DOUTORADO.md](./sistema-adaptativo/RESUMO_EXECUTIVO_CAT_DOUTORADO.md) - Nível doutorado
- [IMPLEMENTACAO_CAT_COMPLETA.md](./sistema-adaptativo/IMPLEMENTACAO_CAT_COMPLETA.md) - Código implementado
- [REGRAS_CLINICAS_AVANCADAS.md](./sistema-adaptativo/REGRAS_CLINICAS_AVANCADAS.md) - Regras de alerta

### 🏗️ Arquitetura
Estrutura técnica do sistema.

- [DIAGRAMA_ER_CLASSCHECK.md](./arquitetura/DIAGRAMA_ER_CLASSCHECK.md) - Modelo de dados (30+ models)
- [MAPA_FLUXOS_COMPLETO.md](./arquitetura/MAPA_FLUXOS_COMPLETO.md) - Fluxos do sistema
- [AUTH_TEMP_SYSTEM.md](./arquitetura/AUTH_TEMP_SYSTEM.md) - Autenticação
- [REFINAMENTO_UX_UI.md](./arquitetura/REFINAMENTO_UX_UI.md) - Design e UX

### 🧩 Componentes UI
Componentes React com shadcn/ui.

- [COMPONENTES_UI_TIPOS_PERGUNTAS.md](./componentes/COMPONENTES_UI_TIPOS_PERGUNTAS.md) - 15 tipos de perguntas
- [PERGUNTA_RENDERER_COMPONENT.md](./componentes/PERGUNTA_RENDERER_COMPONENT.md) - Renderizador universal
- [PROGRESSBAR_ADAPTATIVO.md](./componentes/PROGRESSBAR_ADAPTATIVO.md) - Progress bar dinâmico
- [ALERTA_PANEL.md](./componentes/ALERTA_PANEL.md) - Painel de alertas

### 🔧 APIs
Documentação de endpoints.

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - APIs principais
- [API_ROUTES_COMPLETO.md](./api-correções/API_ROUTES_COMPLETO.md) - Rotas completas
- Sprints 2, 7 para novas APIs

---

## 📊 Estatísticas do Projeto

### Documentação (Novembro 2025)
- **📄 Arquivos Markdown**: 120+
- **📁 Categorias**: 12
- **🎯 Sprints Planejados**: 10 (100-120 horas)
- **📖 Guias Práticos**: 8+
- **📊 Relatórios**: 20+

### Código Implementado
- **🗄️ Models Prisma**: 30+ (Usuario, SessaoAdaptativa, BancoPerguntasAdaptativo, etc)
- **🧩 Componentes React**: 50+
- **🔌 API Routes**: 25+
- **❓ Perguntas**: 125+ planejadas (21 clínicas + 45 contextuais + 59 escalas)
- **🧪 Testes**: Vitest + Playwright
- **🎨 UI**: shadcn/ui + Tailwind CSS

---

## 🎯 Roadmap Completo

### ✅ Concluído (v3.0)
- ✅ Sistema de autenticação (NextAuth + Google OAuth)
- ✅ Sistema de roles (ALUNO, PROFESSOR, ADMIN)
- ✅ Dashboard básico por role
- ✅ IRT refinado (MLE, EAP, MAP)
- ✅ CAT (Computer Adaptive Testing)
- ✅ Banco de perguntas adaptativo (15 tipos)
- ✅ Sistema de matérias e turmas
- ✅ Migrações PostgreSQL (Neon)
- ✅ Modelo Circumplex de emoções
- ✅ Alertas socioemocionais
- ✅ Deploy Vercel configurado

### 🚧 Planejado (Sprints 1-10)

| Sprint | Título | Esforço | Status |
|--------|--------|---------|--------|
| 1 | Escalas Clínicas (PHQ-9, GAD-7, WHO-5) | 8-10h | 📋 Planejado |
| 2 | Exportação PDF/Excel | 10-12h | 📋 Planejado |
| 3 | Dashboard Professor | 12-14h | 📋 Planejado |
| 4 | Redis Caching (Upstash) | 6-8h | 📋 Planejado |
| 5 | Questionários Contextuais (45 perguntas) | 10-12h | 📋 Planejado |
| 6 | Regras Adaptativas Avançadas | 12-14h | 📋 Planejado |
| 7 | APIs de Relatórios | 10-12h | 📋 Planejado |
| 8 | Melhorias Dashboard Aluno | 8-10h | 📋 Planejado |
| 9 | Dashboard Admin Completo | 14-16h | 📋 Planejado |
| 10 | Otimização Performance IRT | 6-8h | 📋 Planejado |

**Total**: 100-120 horas | 10 semanas

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **UI**: shadcn/ui + Radix UI
- **Estilos**: Tailwind CSS v4
- **Gráficos**: Recharts
- **Forms**: React Hook Form + Zod
- **State**: Zustand + TanStack Query

### Backend
- **Runtime**: Next.js Server Actions + API Routes
- **Database**: PostgreSQL (Neon hosted)
- **ORM**: Prisma v6.19
- **Auth**: NextAuth.js v4
- **Cache**: Upstash Redis (Sprint 4)
- **Criptografia**: bcryptjs

### Testing
- **Unit**: Vitest
- **E2E**: Playwright
- **Coverage**: Target >80%

### DevOps
- **Deploy**: Vercel
- **CI/CD**: GitHub Actions
- **Containers**: Docker + docker-compose
- **Version Control**: Git Flow

---

## 📖 Convenções e Padrões

### Nomenclatura de Arquivos
- **Maiúsculas + underscore**: `NOME_DOCUMENTO.md`
- **Prefixos descritivos**: `SPRINT_`, `RELATORIO_`, `GUIA_`
- **Datas quando relevante**: `_DD_MM_YYYY.md`

### Estrutura de Documentos
- Título H1 com emoji descritivo
- Metadados (versão, data, autor)
- Índice interno para docs > 500 linhas
- Seções com H2/H3
- Blocos de código com linguagem: ```typescript
- Checklists: `- [ ]`
- Tabelas para comparações

### Git Workflow
- **main**: Produção estável
- **develop**: Desenvolvimento
- **feature/nome**: Features individuais
- **Commits**: Conventional Commits (feat, fix, docs, etc)

---

## 🔗 Links Importantes

### Repositório
- **GitHub**: [Felipeallanf10/classCheck](https://github.com/Felipeallanf10/classCheck)
- **Branch Principal**: `main`
- **Branch Desenvolvimento**: `develop`

### Deploy
- **Produção**: Vercel
- **Banco de Dados**: Neon PostgreSQL
- **Redis**: Upstash (Sprint 4)

### Documentação Externa
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
- [TanStack Query](https://tanstack.com/query)
- [Zod](https://zod.dev)

### Recursos Acadêmicos
- IRT (Item Response Theory)
- CAT (Computer Adaptive Testing)
- Modelo Circumplex de Russell
- Escalas: PHQ-9, GAD-7, WHO-5, UCLA-3, PSS-10

---

## 📞 Suporte e Contribuição

### Para Dúvidas sobre Documentação
1. Consulte [INDEX.md](./INDEX.md) - Índice completo
2. Leia [COMECE_AQUI.md](./planejamento/COMECE_AQUI.md)
3. Verifique o guia específico da área

### Para Questões Técnicas
1. [GUIA_INICIO_RAPIDO.md](./guias/GUIA_INICIO_RAPIDO.md)
2. [GIT_WORKFLOW.md](./guias/GIT_WORKFLOW.md)
3. [SETUP.md](./guias/SETUP.md)
4. Criar issue no GitHub

### Para Contribuir
1. Fork do repositório
2. Criar branch feature/sua-feature
3. Seguir convenções de código
4. Escrever testes
5. Criar PR para develop

---

## 📝 Manutenção da Documentação

### Ao Adicionar Novos Documentos
1. Adicionar entrada no [INDEX.md](./INDEX.md)
2. Atualizar README da pasta correspondente
3. Manter links relativos funcionando
4. Seguir convenções de nomenclatura

### Ao Arquivar Documentos
1. Mover para pasta `/archive` se necessário
2. Atualizar referências
3. Manter histórico Git

### Revisão Periódica
- Revisar índices mensalmente
- Atualizar estatísticas
- Verificar links quebrados
- Consolidar documentos similares

---

## 🎓 Contexto Acadêmico

**Projeto**: ClassCheck  
**Tipo**: TCC - Trabalho de Conclusão de Curso  
**Área**: Engenharia de Software / Saúde Mental  
**Foco**: Avaliação socioemocional adaptativa em ambiente educacional  
**Tecnologias**: Next.js, IRT/CAT, Machine Learning, Psicometria  

---

**Autor**: Felipe Allan  
**Última Atualização**: 21 de novembro de 2025  
**Versão da Documentação**: 3.0  
**Status**: Em desenvolvimento ativo
