# 🧭 INSTRUÇÕES DE IMPLEMENTAÇÃO — FASE 2  
## Consolidação de Conteúdo: Unificação de Questionários e Ajuda/Suporte  
**Projeto:** ClassCheck v3.0  
**Responsável Técnico:** [Nome do Desenvolvedor]  
**Gerente de Projeto:** Felipe Allan  
**Branch:** `refactor/phase2-forms-and-questionarios`  
**Base:** `develop`

---

## 🎯 OBJETIVO GERAL

Unificar as páginas redundantes `/questionario` + `/avaliacao-socioemocional` e `/ajuda` + `/suporte`, criando fluxos coesos e modulares com navegação por **Tabs**.  
O foco é melhorar **usabilidade**, **organização do código** e **descoberta de funcionalidades**, mantendo consistência visual e semântica em toda a aplicação.

---

## 🧱 ESTRUTURA DE ALTO NÍVEL

### **1. Avaliação Socioemocional (Nova Estrutura)**
- **Rota unificada:** `/avaliacao-socioemocional`
- **Tabs:**
  - Nova Avaliação  
  - Histórico  
  - Análise

### **2. Central de Ajuda (Nova Estrutura)**
- **Rota unificada:** `/ajuda`
- **Tabs:**
  - Perguntas Frequentes  
  - Falar com Suporte  
  - Tutoriais  

### **Rotas antigas redirecionadas:**
- `/questionario` → `/avaliacao-socioemocional`
- `/questionario/*` → `/avaliacao-socioemocional`
- `/suporte` → `/ajuda?tab=suporte`

---

## ⚙️ ETAPAS DE IMPLEMENTAÇÃO

### **FASE A — Estrutura e Setup (Dia 1)**

#### 📋 Ações:
1. Criar a nova branch:
   ```bash
   git checkout -b refactor/phase2-forms-and-questionarios develop
Criar diretórios base:

bash
Copiar código
src/components/avaliacao/
src/components/ajuda/
Implementar layout base com Tabs para ambas as páginas:

src/app/avaliacao-socioemocional/page.tsx

src/app/ajuda/page.tsx

🧩 Exemplo base:
tsx
Copiar código
<Tabs defaultValue="novo" className="w-full">
  <TabsList className="mb-4">
    <TabsTrigger value="novo">Nova Avaliação</TabsTrigger>
    <TabsTrigger value="historico">Histórico</TabsTrigger>
    <TabsTrigger value="analise">Análise</TabsTrigger>
  </TabsList>
  <TabsContent value="novo">
    <NovaAvaliacaoTab />
  </TabsContent>
  <TabsContent value="historico">
    <HistoricoTab />
  </TabsContent>
  <TabsContent value="analise">
    <AnaliseTab />
  </TabsContent>
</Tabs>
✅ Commits esperados:
bash
Copiar código
feat(avaliacao): create tabbed layout for unified evaluation page
feat(ajuda): create base structure with tab navigation
FASE B — Migração de Questionários (Dia 2)
📋 Ações:
Mover lógica dos componentes existentes em /questionario para dentro dos novos componentes:

NovaAvaliacaoTab.tsx → formulário principal

HistoricoTab.tsx → listagem de respostas anteriores

AnaliseTab.tsx → gráficos e estatísticas

Criar QuestionarioForm.tsx com validação via Zod e integração com a lógica antiga.

Implementar redirecionamento:

tsx
Copiar código
// src/app/questionario/page.tsx
import { redirect } from 'next/navigation';
export default function Redirect() {
  redirect('/avaliacao-socioemocional');
}
Atualizar app-sidebar.tsx removendo /questionario.

✅ Commits esperados:
bash
Copiar código
feat(avaliacao): migrate questionario components to unified structure
refactor(routes): redirect /questionario to /avaliacao-socioemocional
fix(sidebar): update navigation for unified evaluation
FASE C — Migração de Ajuda e Suporte (Dia 3)
📋 Ações:
Criar os seguintes componentes:

bash
Copiar código
src/components/ajuda/
├── FAQSection.tsx
├── SupportSection.tsx
├── TutoriaisSection.tsx
├── QuickContactCard.tsx
└── SearchFAQ.tsx
Implementar layout com tabs:

tsx
Copiar código
<Tabs defaultValue="faq">
  <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
  <TabsTrigger value="suporte">Falar com Suporte</TabsTrigger>
  <TabsTrigger value="tutoriais">Tutoriais</TabsTrigger>
</Tabs>
Adicionar busca em FAQs e formulário funcional de suporte.

Implementar redirecionamento:

tsx
Copiar código
// src/app/suporte/page.tsx
import { redirect } from 'next/navigation';
export default function Redirect() {
  redirect('/ajuda?tab=suporte');
}
Atualizar sidebar removendo /suporte.

✅ Commits esperados:
bash
Copiar código
feat(ajuda): implement FAQ, Support, and Tutorials sections
feat(ajuda): add search and quick contact features
refactor(routes): redirect /suporte to /ajuda
FASE D — Testes e Polimento (Dia 4)
📋 Ações:
Testar todos os fluxos de avaliação:

Submissão de formulário

Visualização de histórico

Exibição de gráficos

Testar central de ajuda:

Busca em FAQ

Envio de formulário de suporte

Redirecionamento com query ?tab=suporte

Validar responsividade e dark mode.

Executar:

bash
Copiar código
npm run lint
npm run build
npm run test
✅ Commits esperados:
bash
Copiar código
test(avaliacao): validate evaluation flows and redirects
test(ajuda): verify support and FAQ functionality
docs(refactor): add phase 2 completion notes
🧠 BOAS PRÁTICAS E DIRETRIZES
Padrão visual: manter design system do shadcn/ui

Performance: usar lazy loading em tabs não ativas

Acessibilidade: garantir suporte a teclado e aria-labels

Responsividade:

Ocultar elementos não essenciais em mobile

Reordenar layouts de grids para telas menores

Feedback do usuário:

Mostrar toast em redirecionamentos

Banner “Nova Estrutura de Avaliação” nas primeiras execuções

🚨 RISCOS E MITIGAÇÕES
Risco	Mitigação
Quebra de links externos	Redirects permanentes (Next.js middleware)
Confusão de usuários	Toasts + changelog in-app
Erros em formulários migrados	Testes E2E e validação com Zod
Regressão de estilo	Snapshot visual e revisão por UI Lead

🧾 CRITÉRIOS DE CONCLUSÃO
✅ /questionario removido e redirecionado
✅ /avaliacao-socioemocional consolidado com tabs
✅ /ajuda unificado com /suporte
✅ Responsividade validada
✅ Testes e build sem erros
✅ Documentação atualizada (docs/refactor/phase2.md)

💾 COMMITS RECOMENDADOS (Sequência)
scss
Copiar código
feat(avaliacao): create tab layout for unified evaluation
feat(avaliacao): migrate old questionario components
feat(ajuda): unify help and support with tabs
refactor(routes): redirect old paths to new structure
fix(ui): improve mobile responsiveness and dark mode
test(core): validate unified flows and redirects
docs(refactor): complete phase 2 consolidation report
📈 RESULTADO ESPERADO
Redução de 4 para 2 rotas principais

Eliminação de ~10 componentes duplicados

Melhor experiência de navegação e consistência visual

Base sólida para futuras expansões do sistema (Fase 3)

🗓️ PRAZO E EXECUÇÃO
Etapa	Duração	Responsável
Fase A	1 dia	Dev
Fase B	1 dia	Dev
Fase C	1 dia	Dev
Fase D	1 dia	QA + Dev
Total	4 dias úteis	-

✅ CONCLUSÃO
Após esta fase, o ClassCheck v3.0 passará a ter:

Estrutura coesa e enxuta

Fluxos de avaliação e suporte unificados

Melhor UX, performance e manutenibilidade

🧭 Próximo passo: Após testes e merge da Fase 2, iniciar planejamento da Fase 3 (Refinamentos e Gamificação).