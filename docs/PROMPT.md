# 🚀 Implementar Fase 2.4 - Páginas de Avaliação (Frontend)

## ✅ CONTEXTO ATUAL
- Design System v2 completo (tokens, UI components, loading, toast)
- Páginas de autenticação e dashboard prontos
- Layout exclusivo para auth já implementado
- Não implementar backend agora → usar mocks e states locais
- Objetivo: Criar páginas e componentes interativos com UX completa

---

## ✅ OBJETIVO DA FASE
Criar a experiência completa de avaliações para o usuário logado:
- Avaliar aulas (com humor, estrelas, feedback)
- Modal de avaliação rápida
- Histórico visual de avaliações
- Responsividade + dark/light mode

---

## ✅ O QUE IMPLEMENTAR (SEM BACKEND)
### 🔹 **Passo 1: Criar Branch**
`feature/avaliacoes-frontend`

---

### 🔹 **Passo 2: Componentes Base**
Local: `src/components/avaliacao/`

1. **RatingStars.tsx**
   - 5 estrelas interativas
   - Estados: vazio, hover, selecionado
   - Animações suaves
   - Integrar com tokens (cor amarelo para selecionado)

2. **HumorSelector.tsx**
   - 5 ícones de humor (muito triste → muito feliz)
   - Hover effects e cores associadas
   - Interativo (seleciona humor)

3. **AvaliacaoForm.tsx**
   - Campos:
     - HumorSelector
     - RatingStars
     - Textarea opcional (500 caracteres máx + contador)
   - Validação com Zod
   - Botão de envio com estado loading (simulação)

---

### 🔹 **Passo 3: Componentes Avançados**
1. **AvaliacaoModal.tsx**
   - Modal para avaliação rápida
   - Integrar AvaliacaoForm
   - Fechar automaticamente após envio simulado

2. **AvaliacaoCard.tsx**
   - Mostrar:
     - Aula (mocked)
     - Data (mocked)
     - Nota (estrelas preenchidas)
     - Humor (ícone)
     - Feedback textual
   - Botões: editar/excluir (apenas simulação visual)

3. **StatsCard.tsx**
   - Componente com estatísticas básicas mockadas:
     - Avaliações feitas
     - Média de humor
     - Média de estrelas
   - Pode usar gráfico simples com barras ou ícones

---

### 🔹 **Passo 4: Páginas**
Local: `src/app/`

1. **`/aulas/[id]/avaliar/page.tsx`**
   - Mostrar:
     - Detalhes mockados da aula
     - AvaliacaoForm
   - Estado de loading ao enviar

2. **`/avaliacoes/page.tsx`**
   - Histórico mockado:
     - Lista de AvaliacaoCard
     - StatsCard no topo
     - Filtros básicos (por humor ou nota) → só UI (sem lógica real)
   - EmptyState se não houver avaliações (mock controlado)

---

### 🔹 **Passo 5: Integração Simulada**
- Ao enviar uma avaliação:
  - Simular delay com `setTimeout`
  - Exibir toast de sucesso
  - Atualizar lista mock localmente (useState)

- Modal:
  - Abrir/fechar corretamente
  - Resetar formulário após envio

---

### 🔹 **Passo 6: Validação e UX**
- Validar formulário com Zod:
  - Humor obrigatório
  - Nota obrigatória
  - Feedback opcional (máx. 500 chars)
- Exibir erros abaixo dos campos
- Mostrar contador de caracteres no feedback

---

### ✅ CHECKLIST FINAL
- [ ] RatingStars funcional
- [ ] HumorSelector funcional
- [ ] AvaliacaoForm com validação
- [ ] AvaliacaoModal integrado
- [ ] AvaliacaoCard estilizado
- [ ] StatsCard com métricas mockadas
- [ ] Página `/aulas/[id]/avaliar` completa
- [ ] Página `/avaliacoes` completa
- [ ] Loading states + toasts funcionando
- [ ] Responsividade mobile + dark/light mode
- [ ] Código limpo, tipado e seguindo design system

---

💡 **Commits sugeridos:**
- `feat: add rating stars component`
- `feat: implement humor selector`
- `feat: create avaliacao form`
- `feat: add avaliacao modal`
- `feat: add avaliacao card and stats card`
- `feat: create avaliacao pages with mock data`

Implemente TUDO em sequência usando **React + Next.js + TypeScript + shadcn/ui + Tailwind + Zod**, mantendo consistência com o Design System. 🚀
