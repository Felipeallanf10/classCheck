# 🎓 ClassCheck

Sistema para avaliação socioemocional de aulas, desenvolvido com **Next.js 15**, **TypeScript**, **MySQL** e **Prisma**, integrando um **Design System v2** completo.

## 📋 Stack Tecnológica

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI + Design System v2 Customizado
- **Design System**: 15 componentes integrados com tokens de design
- **Notifications**: Sistema de Toast + Confirmações globais
- **Banco de Dados**: MySQL 8.0 + Prisma ORM
- **Containerização**: Docker + Docker Compose
- **Autenticação**: NextAuth.js (configuração futura)

## 🎨 Design System v2 Integrado

### Componentes Disponíveis
- **Enhanced Input**: `EmailInput`, `PasswordInput` com estados avançados
- **Loading States**: `LoadingButton`, `AppLoading`, `PageLoading`
- **Feedback**: Sistema de Toast com múltiplas variantes
- **Metrics**: `MetricsProgress`, `ClassCheckMetrics` para dashboards
- **Confirmations**: Hook `useConfirm` para diálogos globais

### Tokens de Design
- **Colors**: `primary-*`, `success-*`, `warning-*`, `error-*`, `info-*`
- **Typography**: Gradientes, tamanhos responsivos
- **Animations**: Transições suaves, hover effects, loading states
- **Layout**: Grids responsivos, cards com elevação

### Integração Completa
✅ **Páginas de Autenticação**: Login, Cadastro, Reset Password  
✅ **Layouts**: ConditionalLayout com AppLoading  
✅ **Landing Page**: Hero, Features com design tokens  
✅ **Dashboard**: Métricas com ClassCheckMetrics  
✅ **Sistema de Toasts**: Feedback global integrado  
✅ **Confirmações**: Diálogos de confirmação reutilizáveis  

## 🚀 Getting Started

### Opção 1: Ambiente Dockerizado (Recomendado)

#### Pré-requisitos
- Docker e Docker Compose instalados
- Git

#### Passos:

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd classcheck
```

2. **Configure as variáveis de ambiente:**
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite conforme necessário (opcional para desenvolvimento)
```

3. **Suba o ambiente:**
```bash
# Primeira execução (build + start)
docker-compose up --build

# Execuções seguintes
docker-compose up
```

4. **Acesse a aplicação:**
- **App**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080
- **MySQL**: localhost:3306

### Opção 2: Desenvolvimento Local

#### Pré-requisitos
- Node.js 20+
- MySQL 8.0
- npm/yarn/pnpm

#### Passos:

1. **Instale as dependências:**
```bash
npm install
```

2. **Configure o banco de dados:**
```bash
# Configure .env.local com sua string de conexão MySQL
cp .env.example .env.local
```

3. **Execute as migrações Prisma:**
```bash
npx prisma migrate dev
```

4. **Inicie o servidor:**
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

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
├── 🐳 docker/                  # Configurações Docker
│   └── mysql/
│       └── init/              # Scripts de inicialização MySQL
├── 📱 src/
│   ├── app/                   # App Router (Next.js 15)
│   │   ├── (auth)/           # Páginas de autenticação integradas
│   │   ├── home/             # Dashboard com métricas v2
│   │   └── aulas/            # Listagem de aulas melhorada
│   ├── components/            # Componentes React
│   │   ├── ui/               # Design System v2 (15 componentes)
│   │   ├── landing/          # Landing page com design tokens
│   │   └── *.tsx             # Componentes ClassCheck
│   ├── hooks/                # Custom Hooks
│   │   ├── use-toast.ts      # Sistema de notificações
│   │   └── use-confirm.tsx   # Confirmações globais
│   └── lib/                  # Utilitários
├── 🔧 prisma/                 # Schema e migrações (a criar)
├── 📄 Dockerfile             # Imagem Docker da aplicação
├── 📄 docker-compose.yml     # Orquestração dos serviços
└── 📄 .env.example          # Exemplo de variáveis de ambiente
```

## 🚀 Funcionalidades do Design System

### 📝 Componentes de Formulário
```tsx
import { EmailInput, PasswordInput } from '@/components/ui/enhanced-input'
import { LoadingButton } from '@/components/ui/loading-button'

// Uso nos formulários de auth
<EmailInput 
  label="E-mail" 
  error={errors.email?.message}
  loading={isLoading}
/>
<LoadingButton loading={isSubmitting}>
  Entrar
</LoadingButton>
```

### 📊 Métricas do Dashboard
```tsx
import { ClassCheckMetrics } from '@/components/ui/metrics-progress'

// Dashboard integrado
<ClassCheckMetrics 
  userType="aluno"
  data={{
    totalAulas: 25,
    aulasCompletadas: 12,
    avaliacaoMedia: 4.2
  }}
/>
```

### 🔔 Sistema de Notificações
```tsx
import { useToast } from '@/hooks/use-toast'
import { useConfirm } from '@/hooks/use-confirm'

const { toast } = useToast()
const { confirm } = useConfirm()

// Notificações
toast.success("Ação realizada com sucesso!")
toast.error("Erro ao processar solicitação")

// Confirmações
const confirmed = await confirm({
  title: 'Confirmar exclusão',
  description: 'Esta ação não pode ser desfeita',
  variant: 'destructive'
})
```

### 🎨 Tokens de Design
```tsx
// Cores primárias
className="bg-primary-600 text-primary-50"
className="border-primary-200 hover:border-primary-300"

// Estados de feedback
className="bg-success-50 text-success-900"
className="bg-warning-100 border-warning-500"
className="bg-error-50 text-error-700"
```

## 🌐 URLs do Ambiente

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **App** | http://localhost:3000 | Aplicação Next.js |
| **phpMyAdmin** | http://localhost:8080 | Interface MySQL |
| **MySQL** | localhost:3306 | Banco de dados |

## 🔧 Configuração de Banco

### Credenciais Docker (desenvolvimento):
- **Host**: localhost
- **Port**: 3306  
- **Database**: classcheck_db
- **User**: classcheck_user
- **Password**: classcheck_password

## 📚 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Desenvolvimento local |
| `npm run build` | Build para produção |
| `npm run start` | Executar versão de produção |
| `npm run lint` | Linting com ESLint |

## 📖 Documentação Adicional

- [📋 Setup Detalhado](docs/SETUP.md) - Guia completo de instalação
- [🤝 Como Contribuir](CONTRIBUTING.md) - Guidelines para colaboração  
- [📊 Relatório Técnico](RELATORIO_ANALISE_TECNICA.md) - Análise técnica do projeto

## 🎯 Funcionalidades

### ✅ Implementado
- **Design System v2**: 15 componentes integrados com tokens de design
- **Autenticação Melhorada**: Login, cadastro e reset com enhanced inputs
- **Dashboard Avançado**: Métricas responsivas com ClassCheckMetrics
- **Sistema de Feedback**: Toasts e confirmações globais
- **Landing Page v2**: Hero e features com design tokens aplicados
- **Animações**: Transições suaves e loading states
- **Modo Escuro**: Tema completo com design tokens
- **Componentes UI**: shadcn/ui customizados e otimizados

### 🔄 Em Desenvolvimento
- Sistema de autenticação (NextAuth)
- Integração com banco MySQL + Prisma
- APIs REST para CRUD
- Testes automatizados
- Cards de Aula v2 (AulaCard, ProfessorCard)

### 📋 Roadmap
- PWA (Progressive Web App)
- Notificações push
- Relatórios em PDF com design system
- Dashboard administrativo
- API móvel
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
