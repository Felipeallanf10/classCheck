# 🎯 Objetivo
Modificar a estrutura de layout para que a **navegação (Nav)** só apareça quando o usuário estiver em páginas logadas, e **não apareça na rota raiz (`/`) ou nas páginas públicas (landing, login, cadastro, reset-password)**.

---

## ✅ Regras de exibição do Nav:
- **Exibir Nav** apenas nas rotas:
  - `/home`
  - `/favoritos`
  - `/aulas`
  - `/eventos`
- **Não exibir Nav** nas rotas:
  - `/` (Landing Page)
  - `/login`
  - `/cadastro`
  - `/reset-password`

---

## ✅ Implementação sugerida:
1. No arquivo do layout principal (`src/app/layout.tsx` ou equivalente):
   - Detectar a rota atual usando `usePathname()` do `next/navigation`.
   - Criar uma lista de rotas em que o Nav deve aparecer:
     ```tsx
     const showNavRoutes = ['/home', '/favoritos', '/aulas', '/eventos'];
     ```
   - Condicionar a renderização:
     ```tsx
     const pathname = usePathname();
     const showNav = showNavRoutes.includes(pathname);

     return (
       <div className="flex min-h-screen">
         {showNav && <Nav />}
         <main className="flex-1">{children}</main>
       </div>
     );
     ```

2. Certifique-se de que:
   - O layout `(auth)` continua separado e sem Nav.
   - O layout público (Landing) também não exibe o Nav.

---

## ✅ Observações:
- Essa abordagem não exige autenticação real, apenas lógica baseada em rota.
- Quando integrar com autenticação, condicione também à sessão (usuário logado).

---

💡 **Não altere o design do Nav**, apenas a lógica de exibição.
