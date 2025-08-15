# 🤝 Como Contribuir - ClassCheck

Guia completo para contribuir com o projeto ClassCheck.

## 🚀 Setup Inicial

### 1. Fork e Clone
```bash
# 1. Faça fork do repositório no GitHub
# 2. Clone seu fork
git clone https://github.com/SEU_USERNAME/classCheck.git
cd classcheck

# 3. Adicione o repositório original como upstream
git remote add upstream https://github.com/Felipeallanf10/classCheck.git
```

### 2. Configuração do Ambiente Docker
```bash
# Copie as variáveis de ambiente
cp .env.example .env.local

# Suba o ambiente
docker-compose up --build

# Em outro terminal, verifique se está rodando
docker-compose ps
```

### 3. URLs de Desenvolvimento
- **Aplicação**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080 (root/root_password)
- **MySQL**: localhost:3306 (classcheck_user/classcheck_password)

## 📋 Git Workflow

### Branch Strategy
```
main                    # Branch principal (produção)
├── develop            # Branch de desenvolvimento
├── feature/nova-funcionalidade
├── bugfix/correcao-bug
└── hotfix/correcao-urgente
```

### Comandos Git
```bash
# Atualizar seu fork
git fetch upstream
git checkout main
git merge upstream/main
git push origin main

# Criar nova feature
git checkout develop
git pull upstream develop
git checkout -b feature/minha-nova-funcionalidade

# Após fazer alterações
git add .
git commit -m "feat: adicionar nova funcionalidade"
git push origin feature/minha-nova-funcionalidade
```

## 📝 Padrões de Commit

### Conventional Commits
```bash
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação (sem mudança de código)
refactor: refatoração de código
test: adição/correção de testes
chore: tarefas de build/configuração
```

### Exemplos
```bash
git commit -m "feat: adicionar sistema de autenticação"
git commit -m "fix: corrigir bug no gráfico de humor"
git commit -m "docs: atualizar README com instruções Docker"
git commit -m "style: aplicar formatação ESLint"
git commit -m "refactor: extrair componente reutilizável"
git commit -m "test: adicionar testes para CalendarioEventos"
git commit -m "chore: atualizar dependências"
```

## 🧪 Testes

### Executar Testes
```bash
# Testes unitários
docker-compose exec app npm run test

# Testes com coverage
docker-compose exec app npm run test:coverage

# Testes E2E (quando implementados)
docker-compose exec app npm run test:e2e
```

### Criar Novos Testes
```bash
# Estrutura de teste
src/
├── components/
│   ├── GraficoHumor.tsx
│   └── __tests__/
│       └── GraficoHumor.test.tsx
```

## 🎨 Padrões de Código

### ESLint e Prettier
```bash
# Linting
docker-compose exec app npm run lint

# Formatação
docker-compose exec app npm run lint:fix

# Prettier
docker-compose exec app npm run format
```

### Estrutura de Componentes
```tsx
// 📁 src/components/MeuComponente.tsx
'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface MeuComponenteProps {
  título: string
  dados: unknown[]
}

export function MeuComponente({ título, dados }: MeuComponenteProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{título}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Conteúdo */}
      </CardContent>
    </Card>
  )
}
```

## 🗄️ Banco de Dados

### Migrações Prisma
```bash
# Gerar migração
docker-compose exec app npx prisma migrate dev --name nome-da-migracao

# Aplicar migrações
docker-compose exec app npx prisma migrate deploy

# Reset do banco (desenvolvimento)
docker-compose exec app npx prisma migrate reset
```

### Schema Changes
```prisma
// 📁 prisma/schema.prisma
model Usuario {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  nome      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("usuarios")
}
```

## 📋 Pull Request Process

### 1. Preparação
```bash
# Certifique-se de que está atualizado
git fetch upstream
git checkout develop
git merge upstream/develop

# Rebase sua feature branch
git checkout feature/minha-funcionalidade
git rebase develop
```

### 2. Checklist Pré-PR
- [ ] Código segue padrões ESLint
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Commits seguem conventional commits
- [ ] Branch atualizada com develop

### 3. Criando PR
```bash
# Push final
git push origin feature/minha-funcionalidade

# No GitHub:
# 1. Criar Pull Request
# 2. Base: develop ← Compare: feature/minha-funcionalidade
# 3. Preencher template de PR
```

### 4. Template de PR
```markdown
## 📋 Descrição
Breve descrição da mudança.

## 🎯 Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## 🧪 Testes
- [ ] Testes unitários adicionados/atualizados
- [ ] Testes manuais realizados

## 📱 Screenshots
(se aplicável)

## 📋 Checklist
- [ ] Código revisado
- [ ] Testes passando
- [ ] Documentação atualizada
```

## 👥 Code Review

### Para Reviewers
- **Performance**: Código eficiente?
- **Security**: Sem vulnerabilidades?
- **Maintainability**: Código limpo e legível?
- **Testing**: Testes adequados?
- **Documentation**: Documentação necessária?

### Para Authors
- Responda comentários construtivamente
- Faça alterações solicitadas
- Mantenha discussões técnicas respeitosas

## 🐛 Bug Reports

### Template de Issue
```markdown
## 🐛 Bug Report

### Descrição
Descrição clara do bug.

### Reproduzir
Passos para reproduzir:
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

### Comportamento Esperado
O que deveria acontecer.

### Screenshots
(se aplicável)

### Ambiente
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Versão: [commit hash]
```

## 💡 Feature Requests

### Template de Issue
```markdown
## 💡 Feature Request

### Problema
Que problema essa feature resolveria?

### Solução Proposta
Descrição da solução.

### Alternativas Consideradas
Outras soluções consideradas.

### Contexto Adicional
Screenshots, mockups, etc.
```

## 📚 Recursos Úteis

### Documentação
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Ferramentas
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [ESLint Rules](https://eslint.org/docs/rules/)

## 🎉 Reconhecimento

Todos os contribuidores são reconhecidos no README.md e releases.

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/Felipeallanf10/classCheck/issues)
- **Discussões**: [GitHub Discussions](https://github.com/Felipeallanf10/classCheck/discussions)

---

**Obrigado por contribuir! 🚀**
