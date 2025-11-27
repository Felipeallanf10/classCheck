# 🧪 Guia de Testes - ClassCheck

Este documento descreve os fluxos de teste para validar o sistema ClassCheck, incluindo autenticação, permissões e funcionalidades por role.

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Credenciais de Teste](#-credenciais-de-teste)
- [Testes de Autenticação](#-testes-de-autenticação)
- [Testes por Role](#-testes-por-role)
- [Testes de Segurança](#-testes-de-segurança)
- [Testes de API](#-testes-de-api)
- [Checklist Completo](#-checklist-completo)

## 🎯 Pré-requisitos

Antes de iniciar os testes, certifique-se de que:

```bash
# 1. Banco de dados configurado
npx prisma migrate deploy

# 2. Seeds executados
npx prisma db seed

# 3. Servidor em execução
npm run dev
```

Acesse: http://localhost:3000

## 🔑 Credenciais de Teste

| Role | Email | Senha | Descrição |
|------|-------|-------|-----------|
| **ADMIN** | admin@classcheck.com | senha123 | Acesso total ao sistema |
| **PROFESSOR** | prof.matematica@classcheck.com | senha123 | Gestão de turmas |
| **ALUNO** | ana.costa@aluno.com | senha123 | Avaliações e check-in |

## 🔐 Testes de Autenticação

### Teste 1: Login Bem-Sucedido

**Objetivo:** Validar fluxo de login com credenciais corretas

**Passos:**
1. Acesse http://localhost:3000/login
2. Preencha:
   - Email: `admin@classcheck.com`
   - Senha: `senha123`
3. Clique em "Entrar"

**Resultado Esperado:**
- ✅ Redirecionamento para `/home`
- ✅ Dashboard exibido com menu lateral
- ✅ Nome do usuário visível no canto superior direito
- ✅ Botão de logout disponível

### Teste 2: Login com Credenciais Inválidas

**Objetivo:** Validar tratamento de erro

**Passos:**
1. Acesse http://localhost:3000/login
2. Preencha:
   - Email: `invalido@email.com`
   - Senha: `senhaerrada`
3. Clique em "Entrar"

**Resultado Esperado:**
- ✅ Mensagem de erro exibida: "Credenciais inválidas"
- ✅ Usuário permanece na página de login
- ✅ Campos de formulário mantêm foco

### Teste 3: Logout

**Objetivo:** Validar encerramento de sessão

**Passos:**
1. Faça login com qualquer credencial
2. Clique no botão de logout (canto superior direito)
3. Confirme a ação

**Resultado Esperado:**
- ✅ Redirecionamento para `/login`
- ✅ Sessão encerrada (não é possível acessar páginas protegidas)
- ✅ Tentativa de acessar `/home` redireciona para `/login`

### Teste 4: Proteção de Rotas

**Objetivo:** Validar middleware de autenticação

**Passos:**
1. **Sem estar logado**, tente acessar:
   - http://localhost:3000/home
   - http://localhost:3000/perfil
   - http://localhost:3000/admin/usuarios

**Resultado Esperado:**
- ✅ Todas as URLs redirecionam para `/login`
- ✅ Mensagem informando que é necessário autenticação

## 👨‍💼 Testes por Role

### 🔴 ADMIN - Teste Completo

**Login:**
- Email: `admin@classcheck.com`
- Senha: `senha123`

#### Dashboard
**Caminho:** `/home`

**Verificações:**
- ✅ Dashboard exibido com estatísticas gerais
- ✅ Menu lateral contém:
  - 🏠 Home
  - 👤 Perfil
  - 🔔 Notificações
  - ⚙️ Configurações
  - 👥 **Usuários** (visível apenas para ADMIN)
  - 🏫 **Turmas** (visível apenas para ADMIN)
  - 📊 **Relatórios** (visível apenas para ADMIN)

#### Gestão de Usuários
**Caminho:** `/admin/usuarios`

**Teste de Listagem:**
1. Clique em "Usuários" no menu
2. Verificar tabela com todos os usuários
3. Filtros disponíveis: role (ALUNO, PROFESSOR, ADMIN), status (ativo/inativo)

**Teste de Criação:**
1. Clique em "Novo Usuário"
2. Preencha o formulário:
   - Nome: `Teste Admin`
   - Email: `teste.admin@classcheck.com`
   - Senha: `senha123`
   - Role: `ADMIN`
3. Clique em "Salvar"

**Resultado Esperado:**
- ✅ Usuário criado com sucesso
- ✅ Toast de confirmação exibido
- ✅ Usuário aparece na tabela

**Teste de Edição:**
1. Clique no ícone de editar de um usuário
2. Modifique o nome
3. Clique em "Salvar"

**Resultado Esperado:**
- ✅ Usuário atualizado
- ✅ Mudanças refletidas na tabela

**Teste de Desativação:**
1. Clique no ícone de excluir
2. Confirme a ação no diálogo

**Resultado Esperado:**
- ✅ Usuário desativado (não deletado)
- ✅ Status muda para "Inativo"

#### Gestão de Turmas
**Caminho:** `/admin/turmas`

**Teste de Listagem:**
1. Clique em "Turmas" no menu
2. Verificar tabela com todas as turmas

**Teste de Criação:**
1. Clique em "Nova Turma"
2. Preencha:
   - Nome: `8A-2024`
   - Ano Letivo: `2024`
   - Período: `MANHA`
3. Clique em "Salvar"

**Resultado Esperado:**
- ✅ Turma criada
- ✅ Toast de sucesso

#### Relatórios do Sistema
**Caminho:** `/admin/relatorios`

**Verificações:**
1. Cards de estatísticas no topo:
   - Total de Usuários
   - Total de Turmas
   - Total de Avaliações
   - Alertas Ativos
2. Gráficos exibidos:
   - Gráfico de pizza (distribuição de usuários por role)
   - Gráfico de área (avaliações ao longo do tempo)
   - Gráfico de barras (avaliações por turma)
3. Tabs de navegação funcionando

**Resultado Esperado:**
- ✅ Todos os dados carregam corretamente
- ✅ Gráficos renderizados com Recharts
- ✅ Interação com gráficos funcional (hover, tooltips)

#### Perfil
**Caminho:** `/perfil`

**Teste de Visualização:**
1. Verificar dados pré-preenchidos (nome, email, role)
2. Observar aviso de segurança para ADMIN (em vermelho)

**Teste de Edição:**
1. Modificar o nome
2. Clicar em "Salvar"

**Resultado Esperado:**
- ✅ Perfil atualizado
- ✅ Toast de sucesso

**Teste de Alteração de Senha:**
1. Preencher:
   - Senha Atual: `senha123`
   - Nova Senha: `novaSenha123`
   - Confirmar Senha: `novaSenha123`
2. Clicar em "Alterar Senha"
3. Fazer logout
4. Fazer login com nova senha

**Resultado Esperado:**
- ✅ Senha alterada com sucesso
- ✅ Login funciona com nova senha

#### Notificações
**Caminho:** `/notificacoes`

**Verificações:**
1. Lista de notificações exibida
2. Tabs "Todas" e "Não Lidas"
3. Badge com contagem de não lidas
4. Botão "Marcar como lida"

**Teste de Marcar como Lida:**
1. Clique em "Marcar como lida" em uma notificação
2. Verificar que a notificação some da tab "Não Lidas"
3. Badge atualizado

**Resultado Esperado:**
- ✅ Notificação marcada como lida
- ✅ UI atualizada

#### Configurações
**Caminho:** `/configuracoes`

**Verificações para ADMIN:**
- ✅ Seção "Configurações do Sistema" visível
- ✅ Opções de backup, manutenção, logs
- ✅ Outras seções de configurações gerais

### 👨‍🏫 PROFESSOR - Teste Completo

**Login:**
- Email: `prof.matematica@classcheck.com`
- Senha: `senha123`

#### Dashboard
**Caminho:** `/home`

**Verificações:**
- ✅ Dashboard exibido com métricas de professor
- ✅ Menu lateral contém:
  - 🏠 Home
  - 👤 Perfil
  - 🔔 Notificações
  - ⚙️ Configurações
  - 🏫 **Minhas Turmas** (visível para PROFESSOR)
- ✅ **NÃO** contém opções de ADMIN (Usuários, Relatórios)

#### Minhas Turmas
**Caminho:** `/professor/turmas`

**Verificações:**
1. Lista de turmas que o professor leciona
2. Para cada turma:
   - Nome da turma
   - Total de alunos
   - Avaliações recentes
   - Botão "Ver Detalhes"

**Teste de Detalhes:**
1. Clique em "Ver Detalhes" de uma turma
2. Verificar estatísticas detalhadas

**Resultado Esperado:**
- ✅ Apenas turmas do professor são exibidas
- ✅ Estatísticas corretas

#### Perfil
**Caminho:** `/perfil`

**Verificações para PROFESSOR:**
- ✅ Campo "Matéria" visível e editável
- ✅ Pode editar nome, email, matéria
- ✅ **NÃO** vê aviso de segurança de ADMIN

**Teste de Edição:**
1. Modificar matéria para "Física"
2. Salvar

**Resultado Esperado:**
- ✅ Matéria atualizada
- ✅ Mudança refletida no perfil

#### Configurações
**Caminho:** `/configuracoes`

**Verificações para PROFESSOR:**
- ✅ Seção "Configurações de Alertas" visível
- ✅ Pode configurar notificações de avaliações
- ✅ **NÃO** vê "Configurações do Sistema"

#### Teste de Segurança: Tentar Acessar Rotas ADMIN

**Objetivo:** Validar que PROFESSOR não acessa rotas de ADMIN

**Passos:**
1. Estando logado como PROFESSOR, tente acessar:
   - http://localhost:3000/admin/usuarios
   - http://localhost:3000/admin/turmas
   - http://localhost:3000/admin/relatorios

**Resultado Esperado:**
- ✅ Redirecionamento para `/home` ou página de erro 403
- ✅ Mensagem de "Acesso negado"

### 👨‍🎓 ALUNO - Teste Completo

**Login:**
- Email: `ana.costa@aluno.com`
- Senha: `senha123`

#### Dashboard
**Caminho:** `/home`

**Verificações:**
- ✅ Dashboard exibido com métricas de aluno
- ✅ Menu lateral contém:
  - 🏠 Home
  - 👤 Perfil
  - 🔔 Notificações
  - ⚙️ Configurações
- ✅ **NÃO** contém opções de PROFESSOR ou ADMIN

#### Perfil
**Caminho:** `/perfil`

**Verificações para ALUNO:**
- ✅ Pode editar apenas nome e email
- ✅ **NÃO** vê campo "Matéria"
- ✅ **NÃO** vê aviso de segurança

**Teste de Edição:**
1. Modificar nome
2. Salvar

**Resultado Esperado:**
- ✅ Nome atualizado

#### Configurações
**Caminho:** `/configuracoes`

**Verificações para ALUNO:**
- ✅ Seção "Configurações de Privacidade" visível
- ✅ Opções de visibilidade de perfil
- ✅ **NÃO** vê configurações de PROFESSOR ou ADMIN

#### Teste de Segurança: Filtro de Dados

**Objetivo:** Validar que ALUNO vê apenas seus dados

**Passos:**
1. Acesse http://localhost:3000/api/alertas
2. Verificar response JSON

**Resultado Esperado:**
- ✅ Apenas alertas do próprio aluno são retornados
- ✅ `usuarioId` de todos os registros é o ID do aluno logado

## 🔒 Testes de Segurança

### Teste 1: CSRF Protection

**Objetivo:** Validar proteção contra CSRF

**Método:** Tente fazer requisição POST para `/api/admin/usuarios` sem CSRF token

**Resultado Esperado:**
- ✅ Requisição bloqueada
- ✅ Erro 403

### Teste 2: SQL Injection

**Objetivo:** Validar sanitização de inputs

**Passos:**
1. No formulário de login, tente:
   - Email: `admin@classcheck.com' OR '1'='1`
   - Senha: `senha123`

**Resultado Esperado:**
- ✅ Login falha
- ✅ Erro de credenciais inválidas

### Teste 3: Acesso Direto a APIs

**Objetivo:** Validar proteção de endpoints

**Método:** Use Postman ou curl para testar APIs sem autenticação:

```bash
# Sem token de sessão
curl -X GET http://localhost:3000/api/admin/usuarios
```

**Resultado Esperado:**
- ✅ Status 401 Unauthorized
- ✅ Mensagem: "Você precisa estar autenticado"

### Teste 4: Escalação de Privilégios

**Objetivo:** Validar que roles inferiores não acessam rotas superiores

**Passos:**
1. Faça login como ALUNO
2. Obtenha o token de sessão do cookie
3. Tente acessar `/api/admin/usuarios` com esse token

**Resultado Esperado:**
- ✅ Status 403 Forbidden
- ✅ Mensagem: "Você não tem permissão"

## 🌐 Testes de API

### Endpoints Públicos

#### GET /api/auth/signin
- ✅ Retorna página de login

#### POST /api/auth/callback/credentials
- ✅ Aceita credenciais válidas
- ✅ Retorna erro para credenciais inválidas

### Endpoints Protegidos - ADMIN

#### GET /api/admin/usuarios
**Headers:** Cookie com sessão de ADMIN

**Response Esperado:**
```json
[
  {
    "id": 1,
    "nome": "Admin",
    "email": "admin@classcheck.com",
    "role": "ADMIN",
    "ativo": true
  },
  ...
]
```

#### POST /api/admin/usuarios
**Headers:** Cookie com sessão de ADMIN

**Body:**
```json
{
  "nome": "Novo Usuário",
  "email": "novo@email.com",
  "senha": "senha123",
  "role": "ALUNO"
}
```

**Response Esperado:**
- ✅ Status 201
- ✅ Usuário criado retornado

### Endpoints Protegidos - Authenticated

#### GET /api/perfil
**Headers:** Cookie com sessão válida

**Response Esperado:**
```json
{
  "id": 1,
  "nome": "Nome do Usuário",
  "email": "email@exemplo.com",
  "role": "ALUNO",
  "materia": null
}
```

#### PATCH /api/perfil
**Headers:** Cookie com sessão válida

**Body:**
```json
{
  "nome": "Nome Atualizado",
  "email": "novo@email.com"
}
```

**Response Esperado:**
- ✅ Status 200
- ✅ Dados atualizados retornados

## ✅ Checklist Completo

### Autenticação
- [ ] Login com credenciais válidas funciona
- [ ] Login com credenciais inválidas exibe erro
- [ ] Logout encerra sessão corretamente
- [ ] Middleware redireciona não autenticados
- [ ] Sessão persiste após reload da página

### Roles - ADMIN
- [ ] Dashboard exibe opções de admin
- [ ] CRUD de usuários funciona (criar, editar, desativar)
- [ ] CRUD de turmas funciona
- [ ] Relatórios carregam com gráficos
- [ ] Perfil mostra aviso de segurança
- [ ] Configurações do sistema visíveis

### Roles - PROFESSOR
- [ ] Dashboard exibe métricas de professor
- [ ] "Minhas Turmas" lista apenas turmas do professor
- [ ] Perfil permite editar matéria
- [ ] Configurações de alertas visíveis
- [ ] NÃO acessa rotas de ADMIN

### Roles - ALUNO
- [ ] Dashboard exibe métricas de aluno
- [ ] Perfil permite editar apenas nome/email
- [ ] Configurações de privacidade visíveis
- [ ] NÃO acessa rotas de PROFESSOR ou ADMIN
- [ ] Dados filtrados (vê apenas seus alertas)

### Segurança
- [ ] APIs protegidas retornam 401 sem autenticação
- [ ] Roles inferiores não acessam rotas superiores (403)
- [ ] Inputs sanitizados (SQL injection bloqueado)
- [ ] CSRF token validado
- [ ] Senhas hasheadas (bcrypt)

### Funcionalidades Gerais
- [ ] Notificações carregam e marcam como lidas
- [ ] Perfil atualiza corretamente
- [ ] Alteração de senha funciona
- [ ] Toasts exibem feedbacks corretos
- [ ] Loading states durante requisições

## 📝 Relatório de Bugs

Encontrou um bug? Documente aqui:

| ID | Descrição | Severidade | Status | Notas |
|----|-----------|------------|--------|-------|
| 001 | Exemplo de bug | Alta | Aberto | Em investigação |

## 🎯 Próximos Testes

- [ ] Testes de integração automatizados (Jest)
- [ ] Testes E2E (Playwright)
- [ ] Testes de performance (Lighthouse)
- [ ] Testes de acessibilidade (WCAG)
- [ ] Testes de responsividade (mobile, tablet, desktop)

---

**Última Atualização:** Novembro 2024  
**Mantido por:** Equipe ClassCheck
