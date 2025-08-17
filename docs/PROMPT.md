# 🎯 Objetivo
Adicionar as seguintes melhorias nas páginas de autenticação (`/login`, `/cadastro`, `/reset-password`), mantendo o padrão do projeto:

---

## ✅ O que já existe:
- ✅ Página de Login (/login)
- ✅ Página de Cadastro (/cadastro)
- ✅ Página de Recuperação de Senha (/reset-password)
- ✅ Validação de formulários com Zod
- ✅ Design System (shadcn/ui)
- ✅ Botão Google OAuth (apenas visual)
- ✅ Fundo personalizado com tema dark/light
- ✅ Layout exclusivo para auth

---

## ✅ O que implementar agora:
1. **Estados de Loading**:
   - Adicione um estado de carregamento (`isLoading`) para todos os botões de envio.
   - Quando `onSubmit` for executado:
     - Desabilite o botão.
     - Substitua o texto por `"Carregando..."` ou use o componente `Loader2` do `lucide-react` com animação `animate-spin`.

2. **Responsividade Mobile**:
   - Ajuste o layout `(auth)` e os componentes:
     - Garanta que o `Card` do formulário ocupe **90% da largura no mobile**.
     - Use classes Tailwind (`max-w-sm w-full`) para centralização no mobile e largura adequada no desktop.
     - Botão Google deve ser full width em mobile.

3. **Redirecionamento básico após submit**:
   - No `onSubmit` dos formulários:
     - Após `setTimeout` simulado (2 segundos), use `router.push('/dashboard')`.
     - Utilize `useRouter` do `next/navigation`.
     - Apenas para simulação por enquanto (sem autenticação real).
   - Exemplo:
     ```tsx
     const router = useRouter();
     setTimeout(() => {
       router.push('/dashboard');
     }, 2000);
     ```

---

## ✅ Critérios:
- Não remova nada do que já existe.
- Manter padrão visual **login-03 do shadcn/ui**.
- Código limpo, comentado e fácil de adaptar para integração futura com backend/NextAuth.

---

💡 **Sugestão**:
- Implemente primeiro o estado de loading no botão, depois a responsividade e por fim o redirecionamento.
