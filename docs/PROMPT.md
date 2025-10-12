# 🧭 GUIA COMPLETO DE EXECUÇÃO — REESTRUTURAÇÃO FUNCIONAL CLASSCHECK v3.0

**Objetivo:**  
Aplicar o **Relatório de Coesão Funcional** de forma controlada, organizando e unificando o sistema ClassCheck para eliminar redundâncias, melhorar a clareza funcional e simplificar a navegação — **sem perda de funcionalidades existentes**.

---

## ⚙️ DIRETRIZES GERAIS DE EXECUÇÃO

### 🧩 1. Organização de Branches
Cada fase da reestruturação deve ser feita em uma **branch separada**, seguindo este padrão:

| Fase | Branch | Objetivo |
|------|---------|-----------|
| 1 | `refactor/phase1-dashboard-unification` | Unificação de dashboards e exportação |
| 2 | `refactor/phase2-forms-and-questionarios` | Unificação de questionários e ajuda/suporte |
| 3 | `refactor/phase3-help-and-cleanup` | Integração de favoritos, limpeza e refinamentos |

> 🧱 **Importante:** Nenhuma branch deve ser mergeada sem validação funcional completa e aprovação do gerente de projeto.

---

### 🧾 2. Padrão de Commits
Use **commits semânticos e descritivos**, por exemplo:

feat(dashboard): unificação das páginas /home e /dashboard
refactor(relatorios): integração da exportação dentro da página principal
fix(routes): ajuste dos redirecionamentos para nova estrutura
docs(refactor): criação do relatório da fase 1

yaml
Copiar código

---

### 🧱 3. Padrão de Relatórios
Ao final de cada fase, gerar um arquivo Markdown dentro de:

/docs/relatorios/refactor-faseX.md

markdown
Copiar código

O relatório deve conter:
- ✅ Lista de alterações aplicadas  
- ⚙️ Páginas removidas/unificadas  
- 🧩 Novos componentes criados  
- 🔁 Redirecionamentos aplicados  
- 🧪 Testes executados e status do build

---

## 🚀 FASE 1 — UNIFICAÇÕES CRÍTICAS (2–3 DIAS)

### 🎯 Objetivo:
Eliminar as redundâncias mais impactantes: **/home**, **/dashboard** e **/exportacao**.

### Passos:

#### 1. Unificar `/home` e `/dashboard`
- Consolidar ambas em `/dashboard`.
- Mover componentes úteis de `/home` (como `PersonalStats`, `QuickActions`, etc.).
- Estruturar `/dashboard` com as seções:
  - Resumo pessoal  
  - Humor e desempenho  
  - Análises recentes  
  - Atividades e atalhos rápidos
- Atualizar `app-sidebar.tsx` e redirecionar `/home` → `/dashboard`.

#### 2. Integrar `/exportacao` dentro de `/relatorios`
- Criar componente `components/relatorios/ExportDropdown.tsx` com botões:
  - PDF  
  - Excel  
  - CSV
- Incluir no cabeçalho de `/relatorios`:
  ```tsx
  <PageHeader title="Relatórios" actions={<ExportDropdown />} />
Remover rota /exportacao e ajustar todas as referências.

Adicionar redirect /exportacao → /relatorios.

📦 Branch: refactor/phase1-dashboard-unification
📄 Relatório: docs/relatorios/refactor-fase1.md

🧩 FASE 2 — CONSOLIDAÇÕES DE CONTEÚDO (3–4 DIAS)
🎯 Objetivo:
Unificar páginas conceitualmente idênticas (questionários e suporte).

Passos:
1. Unificar /questionario + /avaliacao-socioemocional
Centralizar tudo em /avaliacao-socioemocional.

Estruturar com tabs (shadcn/ui):

tsx
Copiar código
<Tabs defaultValue="novo">
  <TabsTrigger value="novo">Nova Avaliação</TabsTrigger>
  <TabsTrigger value="historico">Histórico</TabsTrigger>
  <TabsTrigger value="analise">Análise</TabsTrigger>
</Tabs>
Mover conteúdos e componentes de /questionario/* para dentro de /avaliacao-socioemocional/.

Atualizar rotas e sidebar.

Adicionar redirects /questionario → /avaliacao-socioemocional.

2. Unificar /ajuda + /suporte
Criar /ajuda como página unificada.

Estrutura recomendada:

FAQSection: perguntas frequentes

SupportSection: contato com equipe

QuickContactCard: formulário rápido

Usar Accordion ou Tabs do shadcn/ui.

Remover /suporte e criar redirect /suporte → /ajuda.

📦 Branch: refactor/phase2-forms-and-questionarios
📄 Relatório: docs/relatorios/refactor-fase2.md

🧱 FASE 3 — REFINAMENTOS E LIMPEZA (1–2 DIAS)
🎯 Objetivo:
Integrar funções menores, remover páginas temporárias e revisar a navegação geral.

Passos:
1. Integrar /favoritos em /aulas
Adicionar filtro “Favoritas” no topo da lista de aulas:

tsx
Copiar código
<ToggleFilter name="Favoritas" icon={<Star />} />
Remover rota /favoritos e atualizar links no menu lateral.

2. Limpar páginas temporárias e dev
Remover /sprint3, /dev, /test e demais rotas desnecessárias.

Validar se há arquivos obsoletos em /app.

3. Revisar Navegação e Sidebar
Atualizar app-sidebar.tsx com nova estrutura:

tsx
Copiar código
{ title: "Painel", href: "/dashboard" },
{ title: "Aulas", href: "/aulas" },
{ title: "Avaliações", href: "/avaliacoes" },
{ title: "Relatórios", href: "/relatorios" },
{ title: "Ajuda", href: "/ajuda" },
Verificar todos os redirecionamentos e rotas nomeadas.

📦 Branch: refactor/phase3-help-and-cleanup
📄 Relatório: docs/relatorios/refactor-fase3.md

🧪 TESTES E VALIDAÇÕES (após cada fase)
 Build local sem erros (yarn build ou npm run build)

 Testar todos os redirects configurados

 Verificar funcionamento dos filtros e exportações

 Validar navegação mobile

 Garantir que todos os componentes reutilizados continuam funcionais

📊 RESULTADO ESPERADO
Métrica	Situação Atual	Meta Pós-Refatoração
Total de páginas	60	25
Páginas redundantes	12	0
Caminhos duplicados	7	0
Consistência de navegação	70%	100%
Build funcional	✅	✅

🧱 ESTRUTURA FINAL ESPERADA
bash
Copiar código
src/app/
├── dashboard/
├── aulas/
│   └── [id]/avaliar/
├── avaliacoes/
├── avaliacao-socioemocional/
├── relatorios/
├── insights/
├── gamificacao/
├── ajuda/
├── sobre/
├── contato/
├── politica-de-privacidade/
├── termos-de-uso/
└── (auth)/
🧠 PÓS-REFATORAÇÃO
Gerar documento final de estrutura atualizada:

/docs/estrutura-final.md

Deve conter todas as rotas e seus componentes.

Criar relatório geral consolidado:

/docs/relatorios/refactor-consolidado.md

Resumo das 3 fases, métricas, resultados e melhorias obtidas.

Enviar para revisão do gerente de projeto (Felipe Allan) antes do merge final na branch develop.

📅 CRONOGRAMA RECOMENDADO
Fase	Duração	Branch	Responsável
1	2–3 dias	refactor/phase1-dashboard-unification	[dev responsável]
2	3–4 dias	refactor/phase2-forms-and-questionarios	[dev responsável]
3	1–2 dias	refactor/phase3-help-and-cleanup	[dev responsável]
Total:	6–9 dias úteis	—	—

✅ RESULTADO FINAL DESEJADO
Sistema funcional, leve e sem redundâncias

Navegação lógica e simplificada

Estrutura de código limpa e documentada

Todas as rotas semânticas e atualizadas

Base sólida para expansão da versão 3.1

📍 Responsável pela Execução: [Nome do Desenvolvedor]
🧑‍💼 Supervisor Técnico: Felipe Allan (Gerente de Projeto)
🗓️ Data de Início: [preencher]
🗓️ Data de Entrega Estimada: [preencher]
📂 Branch Base: develop

Após concluir cada fase, gerar o relatório correspondente e enviar para revisão antes do merge.