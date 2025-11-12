# 🎓 ClassCheck

Sistema completo para avaliação socioemocional de aulas com **questionários adaptativos**, **análise IRT** e **dashboard administrativo**, desenvolvido com **Next.js 15**, **TypeScript**, **PostgreSQL** e **Prisma**.

## ✨ Funcionalidades Principais

### � Sistema de Autenticação
- **3 Roles**: ALUNO, PROFESSOR, ADMIN
- **NextAuth.js v4**: Autenticação JWT com sessões
- **Proteção de Rotas**: Middleware + helpers + componentes
- **Páginas Protegidas**: Dashboard, perfil, notificações, configurações

### 📊 Avaliações Socioemocionais
- **Questionários Adaptativos**: WHO-5, PHQ-9, GAD-7, PSS-10
- **Teoria de Resposta ao Item (IRT)**: Calibração automática
- **Modelo Circumplexo**: Mapeamento emocional (valencia x ativação)
- **Alertas Inteligentes**: Detecção de risco emocional

### 👨‍🏫 Painel do Professor
- **Gestão de Turmas**: Visualização de turmas e estatísticas
- **Avaliações de Aulas**: Feedback didático e emocional
- **Relatórios**: Análise longitudinal e métricas agregadas

### 👨‍💼 Painel Administrativo
- **CRUD de Usuários**: Criar, editar, desativar (alunos, professores, admins)
- **CRUD de Turmas**: Gerenciar turmas, períodos e vínculos
- **Relatórios do Sistema**: Gráficos interativos (Recharts)
- **Estatísticas Globais**: Usuários, avaliações, alertas

### 👨‍🎓 Painel do Aluno
- **Avaliar Aulas**: Questionários adaptativos por aula
- **Avaliar Professores**: Feedback sobre didática
- **Check-in Diário**: Registro de humor e bem-estar
- **Meu Progresso**: Relatórios individuais e jornada emocional

## 📋 Stack Tecnológica

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI + Design System v2
- **Gráficos**: Recharts para visualizações
- **Banco de Dados**: PostgreSQL (Neon) + Prisma ORM v6.19
- **Autenticação**: NextAuth.js v4 com JWT
- **Validação**: Zod + React Hook Form
- **State Management**: Zustand + TanStack Query

## 🎨 Design System v2 Integrado

### Componentes Disponíveis
- **Enhanced Input**: `EmailInput`, `PasswordInput` com estados avançados
- **Loading States**: `LoadingButton`, `AppLoading`, `PageLoading`
- **Feedback**: Sistema de Toast com múltiplas variantes
## 🔐 Credenciais de Teste

Após executar os seeds, use estas contas para testar:

| Papel | Email | Senha | Acesso |
|-------|-------|-------|--------|
| **ADMIN** | admin@classcheck.com | senha123 | Dashboard + Relatórios + CRUD completo |
| **PROFESSOR** | prof.matematica@classcheck.com | senha123 | Gestão de turmas + Avaliações |
| **ALUNO** | ana.costa@aluno.com | senha123 | Avaliar aulas + Check-in + Progresso |

## 🚀 Getting Started

### Pré-requisitos
- Node.js 20+
- PostgreSQL (Neon recomendado para produção)
- npm/yarn/pnpm

### 1. Clone e Instale

```bash
git clone <repository-url>
cd classcheck
npm install
```

### 2. Configure as Variáveis de Ambiente

Crie `.env.local` na raiz do projeto:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-aleatoria-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

**Gerar `NEXTAUTH_SECRET`:**
```bash
openssl rand -base64 32
```

### 3. Configure o Banco de Dados

```bash
# Executar migrações
npx prisma migrate deploy

# Popular com dados iniciais (usuários, turmas, questionários)
npx prisma db seed
```

### 4. Inicie o Servidor

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run dev:poll     # Dev com polling (WSL/Docker)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificar código
npx prisma studio    # UI para visualizar banco de dados
npx prisma db seed   # Popular banco de dados
```

## 🐳 Comandos Docker Úteis

### Gerenciamento do Ambiente

```bash
# Subir ambiente em background
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f app

# Parar ambiente
docker-compose down

# Rebuild completo
docker-compose down && docker-compose build --no-cache && docker-compose up
```

### Comandos Prisma no Container

```bash
# Gerar cliente Prisma
docker-compose exec app npx prisma generate

# Executar migrações
docker-compose exec app npx prisma migrate dev

# Reset do banco
docker-compose exec app npx prisma migrate reset

# Prisma Studio (interface visual)
docker-compose exec app npx prisma studio
```

### Outros Comandos

```bash
# Executar linting
docker-compose exec app npm run lint

# Instalar nova dependência
docker-compose exec app npm install <package-name>

# Acessar terminal do container
docker-compose exec app sh

# Ver status dos containers
docker-compose ps
```

## 📁 Estrutura do Projeto

```
classcheck/
├── � src/
│   ├── app/                   # App Router (Next.js 15)
│   │   ├── (auth)/           # Rotas públicas (login, cadastro)
│   │   ├── home/             # Dashboard principal
│   │   ├── perfil/           # Edição de perfil
│   │   ├── notificacoes/     # Sistema de notificações
│   │   ├── configuracoes/    # Configurações por role
│   │   ├── professor/        # Rotas do professor
│   │   │   └── turmas/       # Gestão de turmas
│   │   ├── admin/            # Rotas administrativas
│   │   │   ├── usuarios/     # CRUD de usuários
│   │   │   ├── turmas/       # CRUD de turmas
│   │   │   └── relatorios/   # Dashboard com gráficos
│   │   └── api/              # API Routes protegidas
│   ├── components/            # Componentes React
│   │   ├── ui/               # Design System v2
│   │   ├── auth/             # ProtectedRoute
│   │   └── *.tsx             # Componentes ClassCheck
│   ├── lib/                  # Utilitários
│   │   ├── auth.ts           # NextAuth config
│   │   ├── auth-helpers.ts   # checkRole, requireAuth
│   │   └── prisma.ts         # Prisma client
│   ├── middleware.ts         # Proteção de rotas global
│   └── types/                # TypeScript types
├── 🔧 prisma/                 # Banco de dados
│   ├── schema.prisma         # Modelo do banco
│   ├── migrations/           # Histórico de migrações
│   └── seed*.ts              # Scripts de população
├── � docs/                   # Documentação técnica
│   ├── GUIA_TESTES.md        # Fluxo de testes
│   └── GUIA_DEPLOY.md        # Guia de deploy
├── 📄 CHANGELOG.md           # Histórico de mudanças
└── 📄 .env.local             # Variáveis de ambiente (não versionado)
```

## � Sistema de Autenticação

### Roles e Permissões

| Role | Acesso | Funcionalidades |
|------|--------|----------------|
| **ALUNO** | `/home`, `/perfil`, `/notificacoes` | Avaliar aulas, check-in, ver progresso |
| **PROFESSOR** | `+/professor/*` | Gestão de turmas, relatórios de avaliações |
| **ADMIN** | `+/admin/*` | CRUD completo, relatórios do sistema |

### Proteção de Rotas

#### Middleware (Global)
```typescript
// src/middleware.ts
// Protege todas as rotas exceto: /, /login, /cadastro, /reset-password
// Redireciona não autenticados para /login
```

#### Helpers de API
```typescript
import { checkRole, requireAuth } from '@/lib/auth-helpers'

// Apenas ADMIN
const { authorized, userId, userRole, error } = await checkRole(['ADMIN'])

// Qualquer autenticado
const { authorized, userId, userRole, error } = await requireAuth()
```

#### Componente Frontend
```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      {/* Conteúdo protegido */}
    </ProtectedRoute>
  )
}
```

## � Recursos do Sistema

### Design System v2
- **15 componentes UI**: Integrados com shadcn/ui + tokens customizados
- **Toasts**: Sistema de notificações global
- **Confirmações**: Diálogos reutilizáveis com `useConfirm`
- **Métricas**: `ClassCheckMetrics` para dashboards
- **Formulários**: `EmailInput`, `PasswordInput`, `LoadingButton`

### Banco de Dados
- **Modelo Usuario Unificado**: role:Role, senha:String, materia:String?
- **Relações**: TurmaAluno, TurmaProfessor (junction tables)
- **Seeds Disponíveis**:
  - `seed-completo.ts`: Usuários, turmas, vinculos
  - `seed-adaptativo.ts`: Questionários WHO-5, PHQ-9, GAD-7, PSS-10
  - `seed-usuarios-auth.ts`: Dados de autenticação

### APIs Protegidas
- `/api/admin/*` → ADMIN only
- `/api/professor/*` → PROFESSOR, ADMIN
- `/api/perfil` → Authenticated (edição de perfil + senha)
- `/api/notificacoes` → Authenticated (listar, marcar lida)
- `/api/professores` → Authenticated (filtrado por turma para ALUNO)
- `/api/alertas` → Authenticated (filtrado por usuarioId)

## 🎨 Tokens de Design

```tsx
// Cores primárias
className="bg-primary-600 text-primary-50"
className="border-primary-200 hover:border-primary-300"

// Estados de feedback
className="bg-success-50 text-success-900"
className="bg-warning-100 border-warning-500"
className="bg-error-50 text-error-700"
```

## 📚 Documentação Adicional

- [� CHANGELOG.md](CHANGELOG.md) - Histórico completo de mudanças
- [🧪 Guia de Testes](docs/GUIA_TESTES.md) - Fluxos de teste por role
- [� Guia de Deploy](docs/GUIA_DEPLOY.md) - Instruções de implantação
- [🤝 Como Contribuir](CONTRIBUTING.md) - Guidelines para colaboração
- [� Arquitetura de Autenticação](docs/GUIA_AUTENTICACAO_FRONTEND.md) - Detalhes técnicos

## 🎯 Status das Funcionalidades

### ✅ Implementado e Testado
- **Sistema de Autenticação**: NextAuth.js v4 com 3 roles (ALUNO, PROFESSOR, ADMIN)
- **Proteção de Rotas**: Middleware + API helpers + componente ProtectedRoute
- **Páginas Administrativas**: CRUD de usuários, turmas, relatórios com gráficos
- **Páginas do Professor**: Gestão de turmas com estatísticas
- **Páginas do Aluno**: Perfil, notificações, configurações
- **Filtros de Dados**: Dados filtrados por usuário e role
- **Design System v2**: 15 componentes UI integrados
- **Banco de Dados**: PostgreSQL com Prisma, migrações aplicadas
- **Seeds**: Usuários, turmas, questionários adaptativos

### 🔄 Em Desenvolvimento
- Melhorias no sistema de avaliações adaptativas
- Testes de integração automatizados
- Refinamento de relatórios e métricas

### 📋 Roadmap
- PWA (Progressive Web App)
- Notificações push em tempo real
- Relatórios em PDF
- API móvel
- Testes E2E completos

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para mais detalhes.

## 📄 Licença

Este projeto é parte de um Trabalho de Conclusão de Curso (TCC).

## 👨‍💻 Autor

Desenvolvido com ❤️ por Felipe e Nickollas

---

**Versão:** 3.0.0  
**Última Atualização:** Novembro 2024
- Storybook para documentação de componentes

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/Felipeallanf10/classCheck/issues)
- **Discussões**: [GitHub Discussions](https://github.com/Felipeallanf10/classCheck/discussions)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
