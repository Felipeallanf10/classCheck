# 🚀 Tarefa: Completar Fase 2.1 - Design System & Componentes Base

## ✅ Contexto
Estamos desenvolvendo o **ClassCheck** (Next.js + Tailwind + shadcn/ui).  
Atualmente temos:
- Theme system (dark/light) ✅
- Layout básico com Header, Sidebar, Footer ✅
- shadcn/ui instalado ✅
- Alguns componentes específicos ✅

## ✅ Objetivo
Implementar **Design Tokens**, **componentes essenciais** e **melhorar os existentes** para concluir a Fase 2.1.

---

## ✅ Sequência de execução (passo a passo)
### 🔹 Passo 1: Criar Design Tokens
- Criar `src/lib/design-tokens.ts` com:
  - **Colors:** primary, success, warning, danger (em escalas)
  - **Spacing:** xs, sm, md, lg, xl
  - **Typography:** fontFamily, fontSize, lineHeight
  - **Shadows:** customizados
  - **Border radius:** padrão
  - **Breakpoints:** mobile, tablet, desktop
- Atualizar `tailwind.config.js` para usar tokens (theme.extend).

---

### 🔹 Passo 2: Criar Componentes de Loading
- `src/components/ui/spinner.tsx` → Spinner com variants
- `src/components/ui/loading-skeleton.tsx` → Skeleton para cards/listas
- `src/components/ui/loading-button.tsx` → Botão com estado loading
- `src/components/ui/page-loading.tsx` → Tela de loading global

---

### 🔹 Passo 3: Criar Sistema de Toast (Notificações)
- `src/components/ui/toast.tsx` → Componente toast (success, error, warning, info)
- `src/hooks/use-toast.ts` → Hook para gerenciar fila
- `src/components/ToastProvider.tsx` → Provider global
- `src/lib/toast-config.ts` → Configurações padrão

---

### 🔹 Passo 4: Melhorar Inputs Avançados
- Atualizar `src/components/ui/input.tsx` para:
  - Estados visuais (erro/sucesso)
  - Ícones internos (search, password)
  - Máscaras para telefone/CPF/email
  - Helper text e error messages
  - Input groups (prefix/suffix)

---

### 🔹 Passo 5: Criar Componentes Específicos do ClassCheck
- `src/components/AulaCard.tsx`:
  - Estados: favorita, avaliada, pendente, cancelada
  - Ações: avaliar, favoritar, ver detalhes, compartilhar
  - Badge de status + animações hover
- `src/components/ProfessorCard.tsx`:
  - Foto, nome, disciplina, rating médio (estrelas), nº de avaliações
- `src/components/AvaliacaoCard.tsx`:
  - Data, nota, comentário, humor, status
  - Ações: editar/excluir

---

### 🔹 Passo 6: Estados e Feedback
- `src/components/ui/empty-state.tsx` → Mensagem quando lista vazia
- `src/components/ui/error-boundary.tsx` → Captura de erros
- `src/components/ui/confirmation-dialog.tsx` → Confirmação de ações
- `src/components/ui/alert-banner.tsx` → Avisos importantes

---

### 🔹 Passo 7: Componentes Avançados (se houver tempo)
- `src/components/ui/data-table.tsx` → Tabela com sorting/filtering
- `src/components/ui/date-range-picker.tsx` → Filtro de datas
- `src/components/ui/rating.tsx` → Sistema de estrelas (usado no ProfessorCard)
- `src/components/ui/file-upload.tsx`
- `src/components/ui/search-input.tsx`

---

## ✅ Observações importantes
- Siga boas práticas de acessibilidade.
- Use **shadcn/ui** para manter consistência visual.
- Cada componente deve ter exemplos práticos no final do arquivo ou em `storybook` (se disponível).
- Utilize **TypeScript** rigorosamente.
- Mantenha os estilos dentro do padrão Tailwind.
- Cada passo deve ser implementado em **commits separados**.

---

💡 **Agora, comece pelo Passo 1 e siga a ordem até o Passo 7. Gere os arquivos, implemente as funcionalidades e use placeholders onde necessário.**
