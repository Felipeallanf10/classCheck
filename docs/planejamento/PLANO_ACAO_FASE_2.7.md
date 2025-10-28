Você agora deve implementar a **Fase 2.7 - Páginas Institucionais & Utilitárias** do projeto ClassCheck.  
Esta fase é essencial para garantir **credibilidade, transparência e experiência de usuário** em situações de erro ou manutenção.  

---

# 🎯 Objetivo
Criar e integrar as páginas institucionais e utilitárias ao projeto, com design consistente baseado no **Design System v2 (shadcn/ui)** e totalmente **responsivas**, suportando **dark/light mode**.  

---

# 📂 Estrutura de Arquivos

src/
├── app/
│ ├── ajuda/
│ │ └── page.tsx # Página de Ajuda/FAQ
│ ├── contato/
│ │ └── page.tsx # Página de Contato
│ ├── sobre/
│ │ └── page.tsx # Página de Sobre
│ ├── politica-de-privacidade/
│ │ └── page.tsx # Política de Privacidade
│ ├── termos-de-uso/
│ │ └── page.tsx # Termos de Uso
│ ├── 404/
│ │ └── page.tsx # Página de Erro 404
│ └── manutencao/
│ └── page.tsx # Página de Manutenção
├── components/
│ ├── faq/FAQItem.tsx # Item expandível de FAQ
│ ├── contato/ContatoForm.tsx # Formulário de contato
│ ├── shared/PageHeader.tsx # Cabeçalho padrão para páginas
│ └── shared/PageContainer.tsx # Container responsivo
└── lib/
└── validations/contato.ts # Validação Zod para contato

markdown
Copiar código

---

# 📋 Páginas a Implementar

### 1. 📖 Página de Ajuda/FAQ (`/ajuda`)
- Seção de **perguntas frequentes** com Accordion (`shadcn/ui`)
- Organizar por categorias: Conta, Avaliações, Relatórios, Segurança
- Pesquisa rápida (filtrar perguntas)

### 2. ✉️ Página de Contato (`/contato`)
- **Formulário** com: nome, email, assunto, mensagem
- Validação com **Zod + React Hook Form**
- Botão de enviar com estado de loading
- Toast de confirmação (“Mensagem enviada com sucesso”)

### 3. ℹ️ Página de Sobre (`/sobre`)
- Texto institucional sobre o projeto ClassCheck
- Missão, visão e valores
- Seção sobre os desenvolvedores (Felipe & Nickollas)

### 4. 🔒 Política de Privacidade (`/politica-de-privacidade`)
- Texto longo em seções (scroll suave, índice fixo lateral)
- Componentes de tipografia do Design System
- Garantir **acessibilidade WCAG 2.1**

### 5. 📜 Termos de Uso (`/termos-de-uso`)
- Estrutura semelhante à Política de Privacidade
- Listas numeradas e subtítulos organizados
- Linkagem cruzada (Ex.: “Veja também nossa Política de Privacidade”)

### 6. ❌ Página de Erro 404 (`/404`)
- Design amigável com ilustração/ícone
- Botão “Voltar para Home”
- Reutilizar componentes de **Empty State**

### 7. 🛠️ Página de Manutenção (`/manutencao`)
- Mensagem clara: “Estamos em manutenção 🚧”
- Previsão de retorno (texto dinâmico)
- Ícone animado ou skeleton loading

---

# 🎨 Regras de Design
- Usar **PageHeader** com título + descrição em todas as páginas
- Conteúdo centralizado, com `max-w-3xl`
- Paleta: cores já definidas no **design-tokens.ts**
- Responsividade: mobile-first, breakpoints tablet e desktop
- Dark/Light mode integrado

---

# ⚙️ Funcionalidades Extras
- **Formulário de contato:** validação + envio simulado (mock)
- **FAQ:** busca e filtro em tempo real
- **404 e manutenção:** rotas especiais detectadas automaticamente

---

# ✅ Critérios de Aceitação
1. Todas as páginas estão acessíveis via menu lateral/nav superior
2. Design consistente com o resto da aplicação
3. Responsividade total em mobile/tablet/desktop
4. Dark/light mode funcionando em todas as páginas
5. Formulário de contato validado e com feedback visual
6. Páginas longas (termos/política) com índice de navegação funcional
7. Página 404 aparece automaticamente em rotas inválidas
8. Página de manutenção pode ser ativada via flag (`MAINTENANCE_MODE`)

---

# ⏰ Cronograma Sugerido
- **Dia 1:** FAQ + Página de Contato
- **Dia 2:** Sobre + Política de Privacidade
- **Dia 3:** Termos de Uso
- **Dia 4:** Página 404 + Página de Manutenção
- **Dia 5:** Integração no menu + testes responsivos

---

Implemente tudo em **sequência**, na branch:  
`feature/paginas-institucionais`