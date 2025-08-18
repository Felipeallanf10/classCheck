# 🚀 Tarefa: Integrar Design System (Fase 2.1) com Autenticação (Fase 2.2) e Layouts/Home (Fase 2.3)

## ✅ Contexto Atual
- Fase 2.1 (Design System) → COMPLETA ✅
- Fase 2.2 (Páginas de Autenticação) → já implementada ✅
- Fase 2.3 (Landing Page / Dashboard / Home) → já implementada ✅

Agora precisamos **integrar tudo**, garantindo:
- Consistência visual usando **Design Tokens** e **componentes novos** da Fase 2.1
- Reaproveitamento de **componentes avançados** nos fluxos existentes
- Eliminação de duplicações (componentes antigos vs. novos)
- Responsividade e UX alinhada ao design system

---

## ✅ Passos para Integração
### 🔹 Passo 1: Revisar Páginas Existentes (Login, Cadastro, Reset Password)
- Substituir inputs antigos por **enhanced-input** (com validação e ícones)
- Garantir uso de **botões com loading** nos formulários (loading-button)
- Aplicar **tokens de cor, tipografia e espaçamento**
- Adicionar **toasts para feedback** (ex.: erro, sucesso no login)
- Ajustar layouts para usar breakpoints definidos nos tokens

---

### 🔹 Passo 2: Revisar Layouts Globais
- Atualizar `layout.tsx` e `auth-layout.tsx` para:
  - Usar **Page Loading** para transições
  - Garantir que **NavBar** só aparece em rotas logadas (/home, /favoritos, /aulas, /eventos)
  - Aplicar **theme tokens** (dark/light)
  - Centralizar tokens no **Tailwind config**
- Adicionar **feedback-states** em páginas vazias (ex.: dashboard sem dados)

---

### 🔹 Passo 3: Atualizar Landing Page (/ ou /landing)
- Aplicar tokens de cores, tipografia e espaçamento
- Melhorar CTA com **loading-button**
- Aplicar animações suaves (usando framer-motion ou tailwind transitions)
- Incluir **Empty States** para seções ainda não preenchidas

---

### 🔹 Passo 4: Melhorar Dashboard (/home)
- Substituir cards simples por:
  - **AulaCard v2** (estados completos)
  - **ProfessorCard** com rating e interações
  - **AvaliacaoCard** para histórico
- Integrar **metrics-progress** para exibir progresso
- Garantir responsividade e grid consistente

---

### 🔹 Passo 5: Ajustar Fluxos de Feedback e Notificação
- Integrar **toast system** para eventos importantes (ex.: login, logout, erro)
- Usar **confirmation-dialog** para exclusões
- Adicionar **alert-banner** para avisos globais

---

### 🔹 Passo 6: Documentar no README
- Adicionar seção **"Integração do Design System"** explicando:
  - Como usar tokens
  - Como usar componentes reutilizáveis
  - Exemplo prático de uso nos formulários e dashboards
- Atualizar **checklist** das fases concluídas
- Incluir instruções para rodar Storybook (se aplicável)

---

## ✅ Observações importantes
- Não remova código que já está funcionando. Apenas **substitua e padronize aos poucos**.
- Use **commits granulares**, exemplo:
  - `chore: replace auth inputs with enhanced-input`
  - `feat: apply design tokens to landing page`
  - `feat: integrate AulaCard v2 in dashboard`
- Sempre testar após cada substituição (páginas de login, home e landing).

---

💡 **Agora, comece pelo Passo 1 (páginas de autenticação) e siga até o Passo 6.**
