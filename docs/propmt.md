# 🤖 PROMPT PARA GITHUB COPILOT — Refatoração da Página `/aulas`
> **Objetivo:** Implementar as melhorias detalhadas no relatório “📊 Análise: Página de Aulas - Melhorias e Sugestões” do projeto **ClassCheck v3.0**

---

## 🎯 Contexto

A página `/aulas` atual está funcional, mas apresenta:
- Dados mockados (sem integração real)
- Layout monótono
- Falta de feedback de ações
- Filtros limitados
- Responsividade incompleta

Queremos **refatorar e evoluir** a página em **3 fases**, com foco em UX, performance e integração real.

---

## 🧩 Estrutura Técnica

### **Localização do código**
src/
├── app/
│ └── aulas/
│ └── page.tsx
├── components/
│ └── aulas/
│ ├── CardAulaEnhanced.tsx
│ ├── FiltersBar.tsx
│ ├── SidebarCalendarioEnhanced.tsx
│ ├── AulaSkeleton.tsx
│ ├── MobileDatePicker.tsx
│ ├── QuickActionsBar.tsx
│ └── ToggleFilter.tsx
└── hooks/
└── useAulas.ts

yaml
Copiar código

---

## ⚡ FASE 1 — FUNDAÇÃO (dados reais, feedback e loading)

### ✅ 1. Criar hook `useAulas.ts`
```tsx
// src/hooks/useAulas.ts
// Hook responsável por buscar aulas reais com loading e tratamento de erros
Requisitos:

Fetch em /api/aulas?date=YYYY-MM-DD

Estado: aulas, loading, error

Atualiza automaticamente quando a data muda

✅ 2. Adicionar Skeleton Loaders
tsx
Copiar código
// src/components/aulas/AulaSkeleton.tsx
// Skeleton animado para placeholder durante o carregamento
Requisitos:

Grid de placeholders (6 itens)

Suporte a dark mode (bg-gray-200 / bg-gray-700)

Transição suave

✅ 3. Sistema de Feedback
Adicionar toast em todas as ações críticas:

Favoritar/desfavoritar

Avaliar

Erros de rede

Requisitos:

Optimistic updates (UI reflete ação antes da resposta)

Toast de sucesso/erro usando useToast()

🎨 FASE 2 — INTERFACE (UI/UX aprimorada)
✅ 4. Criar CardAulaEnhanced.tsx
Substituir o card simples atual.

Requisitos:

Título + Professor + Disciplina + Horário

Descrição/preview da aula

Barra colorida por disciplina

Progresso de avaliação (se existir)

Badge de status (avaliada / pendente)

Ícone de humor se disponível

Botão contextual (Ver ou Avaliar)

✅ 5. Criar FiltersBar.tsx
Nova barra de filtros combinados acima da listagem.

Requisitos:

Filtros:

Favoritas (toggle)

Status (avaliadas/pendentes)

Disciplina (multi-select)

Professor (multi-select)

Badge com contadores

Botão “Limpar filtros”

Contador total de resultados

✅ 6. Criar SidebarCalendarioEnhanced.tsx
Reforçar o uso do calendário lateral.

Requisitos:

Destaque de dias com aulas

Modifiers visuais:

temAulas (cor primária)

temAvaliadas (verde)

temPendentes (laranja)

Estatísticas da semana (aulas / avaliadas)

Legenda explicativa

✅ 7. Adicionar Visualizações Alternativas
Implementar toggle entre Grid e List View:

tsx
Copiar código
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
Renderizar condicionalmente:

Grid: CardAulaEnhanced

List: CardAulaList (compacto)

📱 FASE 3 — PERFORMANCE + MOBILE
✅ 8. Criar MobileDatePicker.tsx
Requisitos:

Sheet (bottom drawer) para seleção de data

Quick picks: “Hoje”, “Amanhã”, “Próxima semana”

Mostra data atual no topo (🗓️ 13 de outubro, 2025 ▾)

Usa mesmo componente Calendar da versão desktop

✅ 9. Substituir FloatingButton por QuickActionsBar.tsx
Requisitos:

Card fixo inferior

Mostra quantidade de aulas pendentes

Exibe título da próxima aula a avaliar

Botão “⚡ Avaliar agora”

Opção “Ver todas (x)”

✅ 10. Otimizações de Performance
Virtualização com react-window se > 50 aulas

Animações otimizadas (CSS puro, até 12 cards animados)

will-change: transform para suavizar transições

Lazy load de componentes pesados

🧠 LÓGICA PRINCIPAL (resumo)
tsx
Copiar código
const { aulas, loading, error } = useAulas(dataSelecionada);
const [filters, setFilters] = useState(defaultFilters);
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

const aulasFiltradas = useMemo(() => {
  return aulas
    .filter(porDataSelecionada)
    .filter(porFavoritasSeAtivo)
    .filter(porStatus)
    .filter(porDisciplina)
    .filter(porProfessor);
}, [aulas, filters]);
✅ CHECKLIST DE IMPLEMENTAÇÃO
Fase 1 – Fundação
 Criar useAulas.ts

 Criar endpoint /api/aulas

 Adicionar AulaSkeleton.tsx

 Implementar loading states

 Adicionar toasts e optimistic update

 Testar fluxo completo

Fase 2 – Interface
 Implementar CardAulaEnhanced.tsx

 Implementar FiltersBar.tsx

 Atualizar SidebarCalendarioEnhanced.tsx

 Adicionar visualizações Grid/List

 Testar com dados variados (0, 10, 100 aulas)

Fase 3 – Performance e Mobile
 Criar MobileDatePicker.tsx

 Criar QuickActionsBar.tsx

 Adicionar virtualização condicional

 Otimizar animações

 Testes cross-device e Lighthouse audit

💡 ESTILO E UX
Paleta: usar shadcn/ui padrão com contraste suave

Responsivo completo (mobile/tablet/desktop)

Dark mode funcional

Feedback visual em todas as ações

Skeleton → Toast → Atualização suave

🚀 DIRETRIZES DE CÓDIGO
Padrão TypeScript + Next.js App Router

Importar componentes via aliases (@/components/...)

Usar hooks client-side apenas em 'use client'

Evitar duplicação de estado (single source of truth)

Usar useMemo e useCallback para performance

Código limpo, sem any, sem warnings no build

📦 BRANCH E COMMITS
Branch: refactor/phase3-aulas-ux-improvements

Commits sugeridos:

feat(aulas): integrar dados reais e loading states

feat(aulas): criar Cards e Filtros avançados

feat(aulas): otimizações de performance e mobile

chore(aulas): ajustes finais e testes de responsividade

🧩 REFERÊNCIAS DE DESIGN
Inspiração visual:

Google Classroom (cards por disciplina)

Linear (filtros combinados)

Notion (visualizações alternáveis)

Asana (quick actions bar)

🎯 MISSÃO PARA O COPILOT
“Refatore e aprimore a página /aulas de acordo com este documento.
Implemente os componentes listados, integre dados reais, adicione feedback visual e garanta responsividade total.
Siga as boas práticas de performance, UX e organização modular conforme descrito acima.”

📅 Prioridade: Alta
👤 Responsável: Desenvolvedor Frontend
🧭 Aprovação final: Felipe Allan (Gerente de Projeto)
📄 Base técnica: Relatório “Análise: Página de Aulas - Melhorias e Sugestões (13/10/2025)”