# 🚀 Guia Prático Git - ClassCheck

## ⚡ Setup Inicial (Execute AGORA)

### 1. Verificar Estado Atual
```bash
# Ver branch atual e status
git status
git branch -a

# Ver histórico de commits
git log --oneline -5
```

### 2. Criar Branch Develop (Se não existir)
```bash
# Criar e mudar para branch develop
git checkout -b develop
git push origin develop

# Definir develop como branch padrão no GitHub (recomendado)
# Vá em Settings > Branches > Default branch > develop
```

### 3. Configurar Git Flow Localmente
```bash
# Instalar git-flow (Windows)
# Via Git Bash ou baixar: https://github.com/nvie/gitflow/wiki/Windows

# Inicializar git-flow
git flow init
# Aceite os padrões:
# - main (produção)
# - develop (desenvolvimento) 
# - feature/ (features)
# - release/ (releases)
# - hotfix/ (hotfixes)
```

## 📋 Workflow para Commits - SIGA SEMPRE

### Passo 1: Antes de Começar Qualquer Trabalho
```bash
# SEMPRE atualizar develop primeiro
git checkout develop
git pull origin develop

# Se estiver na main por engano
git checkout develop
# ou criar develop se não existir:
# git checkout -b develop
```

### Passo 2: Criar Nova Feature Branch
```bash
# Para cada nova funcionalidade/task
git checkout develop  # garantir que está na develop
git pull origin develop  # atualizar com remoto

# Criar branch para sua tarefa (use nomes descritivos)
git checkout -b feature/api-professores
# Exemplos de nomes:
# feature/api-aulas
# feature/frontend-dashboard  
# feature/auth-nextjs
# bugfix/corrigir-seed-banco
# docs/atualizar-readme
```

### Passo 3: Fazer Commits Seguindo Conventional Commits
```bash
# Adicionar arquivos modificados
git add .

# OU adicionar arquivos específicos
git add src/app/api/professores/

# Commit com mensagem padronizada
git commit -m "feat: implementar CRUD de professores"

# Exemplos de mensagens por tipo:
git commit -m "feat: adicionar API de aulas com validação Zod"
git commit -m "fix: corrigir erro na migração do Prisma"
git commit -m "docs: atualizar documentação da API"
git commit -m "style: aplicar formatação ESLint"
git commit -m "refactor: extrair componente CardAula reutilizável"
git commit -m "test: adicionar testes para GraficoHumor"
git commit -m "chore: atualizar dependências do package.json"
```

### Passo 4: Push e Pull Request
```bash
# Push da sua feature branch
git push origin feature/api-professores

# Criar Pull Request no GitHub:
# 1. Vá para o repositório no GitHub
# 2. Clique em "New Pull Request"  
# 3. Base: develop ← Compare: feature/api-professores
# 4. Adicione título e descrição
# 5. Solicite review
```

### Passo 5: Após Aprovação e Merge
```bash
# Voltar para develop
git checkout develop

# Atualizar develop local
git pull origin develop

# Deletar branch local (opcional, após merge)
git branch -d feature/api-professores

# Deletar branch remota (opcional)
git push origin --delete feature/api-professores
```

## 🎯 Padrões de Mensagens de Commit

### Tipos de Commit
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação apenas
- **style**: Mudanças que não afetam significado (espaços, formatação)
- **refactor**: Mudança de código que não corrige bug nem adiciona feature
- **test**: Adicionar ou corrigir testes
- **chore**: Mudanças no processo de build ou ferramentas auxiliares

### Estrutura da Mensagem
```
tipo: descrição curta (até 50 caracteres)

Corpo opcional explicando o que e por que (não como).
Quebra de linha em 72 caracteres.

- Pode incluir bullet points
- Pode referenciar issues: Fixes #123
```

### Exemplos Específicos do ClassCheck
```bash
# APIs
git commit -m "feat: implementar GET /api/professores com paginação"
git commit -m "feat: adicionar endpoint POST /api/aulas com validação"
git commit -m "fix: corrigir validação de email único em usuários"

# Frontend
git commit -m "feat: criar componente FormAvaliacao com React Hook Form"
git commit -m "feat: implementar dashboard com gráficos Recharts"
git commit -m "style: aplicar design system shadcn/ui"

# Database
git commit -m "feat: adicionar modelo Evento ao schema Prisma"
git commit -m "fix: corrigir seed de dados para humor_registros"
git commit -m "chore: executar migração para nova tabela eventos"

# Infrastructure
git commit -m "chore: atualizar Dockerfile para melhor cache"
git commit -m "feat: adicionar health checks no docker-compose"
git commit -m "docs: atualizar README com URLs dos serviços"
```

## 🚨 Situações de Emergência

### Se Fez Commit na Main (CUIDADO!)
```bash
# NÃO FAÇA PUSH! Primeiro mover para branch correta
git log --oneline -3  # ver últimos commits

# Resetar main para estado anterior (CUIDADO!)
git reset --hard HEAD~1  # remove último commit da main

# Criar branch correta e aplicar commit
git checkout -b feature/minha-funcionalidade
git cherry-pick COMMIT_HASH  # aplicar o commit removido
```

### Se Esqueceu de Atualizar Develop
```bash
# Na sua feature branch
git checkout develop
git pull origin develop
git checkout feature/minha-branch
git rebase develop  # ou git merge develop
```

### Se Precisa Fazer Hotfix Urgente
```bash
# Para correções críticas em produção
git checkout main
git pull origin main
git checkout -b hotfix/corrigir-bug-critico

# Fazer correção e commit
git add .
git commit -m "fix: corrigir bug crítico de autenticação"

# Merge em main E develop
git checkout main
git merge hotfix/corrigir-bug-critico
git push origin main

git checkout develop
git merge hotfix/corrigir-bug-critico
git push origin develop
```

## 📋 Checklist Antes de Cada Commit

- [ ] Estou na branch correta (feature/*, não main)?
- [ ] Código testado localmente?
- [ ] ESLint/Prettier aplicado?
- [ ] Mensagem de commit segue padrão?
- [ ] Arquivos corretos adicionados (não node_modules, .env)?

## 🔄 Comandos Diários

```bash
# Começar o dia
git checkout develop
git pull origin develop

# Começar nova tarefa
git checkout -b feature/nome-da-tarefa

# Durante o desenvolvimento (commits frequentes)
git add -A
git commit -m "feat: implementar funcionalidade X"

# Finalizar tarefa
git push origin feature/nome-da-tarefa
# Criar PR no GitHub: develop ← feature/nome-da-tarefa
```

## ⚙️ Configurações Git Recomendadas

```bash
# Configurar nome e email (se não fez)
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"

# Configurações úteis
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global core.autocrlf false  # Windows

# Alias úteis
git config --global alias.st status
git config --global alias.br branch
git config --global alias.co checkout
git config --global alias.cm commit
```

---

**🎯 REGRA DE OURO: NUNCA trabalhe diretamente na main! Sempre use feature branches!**
