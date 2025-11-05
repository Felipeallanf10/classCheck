

Try  HackMD Logo HackMD
📋 RELATÓRIO PARCIAL - 3º BIMESTRE
ClassCheck - Sistema de Avaliação e Feedback Educacional
Prazo de Entrega: 24/09/2025
Data do Relatório: 01/10/2025
Disciplina: TCC
Professor: Fábio Francisco Luiz
Repositório: https://github.com/Felipeallanf10/classCheck
Branch Atual: develop

Equipe:

Felipe Allan Nascimento Cruz - Full Stack Developer & Tech Lead
Nickollas Teixeira Medeiros - Frontend Developer & UI/UX Specialist
1. DESCRIÇÃO RESUMIDA DO PROJETO
🎯 Objetivo
O ClassCheck é um sistema web educacional que revoluciona a forma como instituições de ensino coletam e analisam feedback de estudantes. O projeto visa permitir uma gestão pedagógica mais eficiente e humanizada através de avaliações em tempo real e monitoramento socioemocional contínuo.

👥 Público-Alvo
O sistema atende três perfis principais de usuários:

Alunos: Avaliam aulas, registram humor diário e fornecem feedback estruturado sobre as disciplinas e docentes
Professores: Acessam relatórios detalhados sobre suas aulas, visualizam métricas de desempenho e engajamento dos alunos
Gestão Escolar: Visualizam dashboards consolidados com métricas institucionais, tendências e análises comparativas
🎯 Problema que Resolve
Problemas Identificados:

Feedback Tardio: Tradicionalmente, avaliações são realizadas apenas ao final do período letivo, quando já é tarde demais para implementar melhorias e ajustes pedagógicos

Desconexão Emocional: Instituições de ensino carecem de ferramentas adequadas para monitorar o bem-estar socioemocional dos alunos de forma contínua e sistemática

Dados Fragmentados: Informações sobre desempenho docente, engajamento estudantil e satisfação estão dispersas em planilhas, formulários físicos e sistemas desconectados, dificultando análises integradas

Nossa Solução:

✅ Sistema centralizado de avaliações em tempo real com feedback imediato
✅ Registro diário de humor e bem-estar socioemocional dos estudantes
✅ Dashboards inteligentes com métricas acionáveis e visualizações interativas
✅ Interface responsiva acessível de qualquer dispositivo (PWA-ready)
✅ Relatórios exportáveis para gestão estratégica

2. TECNOLOGIAS ESCOLHIDAS/IMPLEMENTADAS
🎨 Frontend
Tecnologia	Versão	Justificativa da Escolha
Next.js	15.4.1	Framework React moderno com Server-Side Rendering (SSR), roteamento automático baseado em arquivos e otimizações de performance out-of-the-box. O App Router permite uso de React Server Components, reduzindo significativamente o bundle JavaScript enviado ao cliente
React	19.0.0	Biblioteca JavaScript para construção de interfaces componentizadas e reativas. A versão 19 traz concurrent rendering e melhorias de performance
TypeScript	5.x	Superset do JavaScript com tipagem estática que previne bugs em tempo de desenvolvimento, melhora o IntelliSense e facilita refatoração de código em larga escala
Tailwind CSS	4.x	Framework CSS utilitário que acelera o desenvolvimento mantendo consistência visual. Permite prototipação rápida sem sair do HTML/JSX
shadcn/ui	Latest	Design system baseado em Radix UI com componentes acessíveis (WCAG 2.1 AA), totalmente customizáveis e com suporte a temas dark/light
Recharts	2.15.4	Biblioteca de gráficos React declarativa e componível, ideal para dashboards interativos com animações fluidas
React Hook Form	7.62.0	Gerenciamento de formulários performático com validação integrada, reduzindo re-renders desnecessários
Zod	3.25.76	Biblioteca de validação de schemas TypeScript-first com inferência automática de tipos
Decisão Técnica - Por que Next.js 15?

API Routes integradas: Eliminam necessidade de backend separado para endpoints simples
Image Optimization automática: Reduz tamanho de imagens em até 60% com formato WebP/AVIF
Deploy simplificado: Integração nativa com Vercel para CI/CD com zero configuração
React Server Components: Renderização no servidor reduz JavaScript no cliente
SEO otimizado: SSR garante indexação completa por mecanismos de busca
🔧 Backend & Banco de Dados
Tecnologia	Versão	Justificativa da Escolha
Prisma ORM	6.15.0	ORM TypeScript-first com client auto-gerado, migrations versionadas e type-safety end-to-end. Facilita evolução do schema com comandos declarativos
PostgreSQL	16.x	Banco de dados relacional robusto e open-source com suporte a ACID, JSON nativo, window functions e triggers. Superior ao MySQL em queries analíticas complexas
NextAuth.js	4.24.11	Biblioteca completa de autenticação para Next.js com suporte a múltiplos providers (credenciais, OAuth, JWT) e integração nativa com Prisma
Docker	24.x	Plataforma de containerização que garante ambiente idêntico entre desenvolvimento, staging e produção, eliminando o clássico "funciona na minha máquina"
Zod	3.25.76	Validação de schemas em runtime com inferência automática de tipos TypeScript, usada tanto no frontend quanto backend
Por que PostgreSQL em vez de MySQL?

✅ Tipos de dados avançados: Suporte nativo a JSON, Arrays, JSONB (indexável)
✅ Window Functions: Essenciais para cálculos analíticos (ranking, médias móveis)
✅ MVCC (Multi-Version Concurrency Control): Melhor performance em leituras concorrentes
✅ Extensibilidade: Suporte a extensões como pgvector (para IA/ML futuro)
✅ Ecosystem maduro: pgAdmin, PostGIS, Full-Text Search integrado
✅ Hospedagem gratuita: Neon, Supabase e Vercel oferecem tiers generosos

Por que Prisma ORM?

Schema declarativo: Modelo legível e versionável com Git

​​model Usuario {
​​  id        Int      @id @default(autoincrement())
​​  email     String   @unique
​​  nome      String
​​  role      Role     @default(ALUNO)
​​  createdAt DateTime @default(now())
​​}
Type Safety completo: Do banco de dados até o componente React

Prisma Studio: Interface visual para debug e manipulação de dados

Migrations automáticas: Versionamento de mudanças no schema

🐳 DevOps & Ferramentas
Ferramenta	Propósito
Docker Compose	Orquestração de 3 containers: app (Next.js:3000), database (PostgreSQL:5432), admin (pgAdmin:5050)
Git/GitHub	Controle de versão com workflow feature-branch e pull requests
Vercel	Plataforma de deploy com preview automático para PRs e CI/CD integrado
pgAdmin	Interface web para administração visual do PostgreSQL
Insomnia/Postman	Testes de APIs REST com collections organizadas por recurso
3. PLANEJAMENTO DE DEPLOY NA VERCEL
📋 Estratégia de Deploy
Fase 1: Preparação ✅ CONCLUÍDA (01/10/2025)
Variáveis de ambiente documentadas em .env.example
Build de produção testado localmente (npm run build sem erros)
TypeScript 100% limpo (zero erros de compilação)
Otimização de imagens com componente next/image
Route handlers atualizados para Next.js 15 (async params)
Análise de bundle com @next/bundle-analyzer
Fase 2: Database em Produção 📅 05-07/10/2025
Opções de Hosting Avaliadas:

Provider	Free Tier	Integração Vercel	Escolha
Neon	10GB + 100h compute	⭐⭐⭐⭐⭐ Nativa	✅ ESCOLHIDO
Supabase	500MB + 2GB bandwidth	⭐⭐⭐⭐ Boa	Plano B
Vercel Postgres	256MB + 60h compute	⭐⭐⭐⭐⭐ Perfeita	Limitações de storage
Railway	500MB + 5$ crédito	⭐⭐⭐ Regular	Custo após trial
Por que Neon PostgreSQL?

✅ Serverless Architecture: Cold start < 500ms, escala automaticamente
✅ Database Branching: Ambientes staging/produção isolados (como Git branches)
✅ Backups Point-in-Time: Recuperação de dados em qualquer momento dos últimos 7 dias
✅ Free Tier generoso: 10GB storage + 100h compute/mês (suficiente para MVP e testes)
✅ Integração Vercel: Uma linha de comando para setup completo

Passos de Migração:

Criar conta no Neon (https://neon.tech)
Provisionar database com região otimizada (us-east-1 para menor latência com Vercel)
Copiar DATABASE_URL com connection pooling habilitado
Adicionar variável na Vercel: Settings > Environment Variables
Executar migrations em produção: npx prisma migrate deploy
Seed inicial com dados de demonstração: npm run db:seed
Fase 3: Deploy Inicial 📅 08/10/2025
Configuração Vercel:

# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login e vincular projeto
vercel login
vercel link

# 3. Configurar variáveis de ambiente
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/classcheck?sslmode=require"
NEXTAUTH_URL="https://classcheck.vercel.app"
NEXTAUTH_SECRET="[gerado com: openssl rand -base64 32]"
NODE_ENV="production"

# 4. Deploy para produção
vercel --prod
Configurações de Build:

Build Command: prisma generate && next build
Output Directory: .next
Install Command: npm install
Framework Preset: Next.js
Node Version: 20.x
Otimizações Habilitadas:

✅ Compression (gzip/brotli)
✅ Image Optimization (WebP/AVIF automático)
✅ Edge Functions (para APIs geográficas)
✅ Incremental Static Regeneration (ISR)
Fase 4: CI/CD Automático 📅 10/10/2025
Workflow Configurado:

Pull Request: Deploy de preview automático em URL temporária
Commit na main: Deploy automático em produção após build e testes
Rollback: Possível via dashboard Vercel (1 clique)
Monitoramento: Vercel Analytics + Error tracking
Pipeline Planejado:

# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    - Lint (ESLint)
    - Type check (tsc --noEmit)
    - Build test (next build)
    - Unit tests (Jest) [Fase 5]
    
  deploy:
    - Vercel deploy
    - Health check
    - E2E tests (Playwright) [Fase 5]
💰 Estimativa de Custos
Serviço	Plano	Custo Mensal	Limites
Vercel	Hobby (Free)	R$ 0,00	100GB bandwidth, domínios ilimitados
Neon PostgreSQL	Free Tier	R$ 0,00	10GB storage, 100h compute/mês
Domínio .com.br	Registro.br	R$ 3,33/mês	R$ 40/ano
Total Mensal	-	R$ 3,33	-
Projeção de Escalabilidade:

Vercel Pro (R$ 100/mês): Necessário com >100k pageviews/mês ou >1000 builds/mês
Neon Scale (R$ 80/mês): Necessário com >10GB dados ou >100h compute/mês
Estimativa com 500 usuários ativos: R$ 0,00/mês (dentro do free tier)
Estimativa com 5000 usuários ativos: ~R$ 180/mês (Vercel Pro + Neon Scale)
Conclusão: O projeto pode operar gratuitamente durante todo o MVP e validação inicial. Custos só surgem com tração significativa (>1000 usuários ativos).

4. PROGRESSO ATÉ O MOMENTO
📊 Status Geral do Projeto
Progresso Global: 65% concluído

Fase	Descrição	Status	Progresso	Prazo
Fase 1	Infraestrutura & Banco	✅ Completa	100%	✅ 15/08/2025
Fase 2	Frontend & Interface	✅ Completa	100%	✅ 21/09/2025
Fase 3	APIs REST & Backend	🟡 Em Progresso	75%	🎯 07/10/2025
Fase 4	Autenticação & Segurança	⏳ Planejada	0%	🎯 14/10/2025
Fase 5	Testes & Qualidade	⏳ Planejada	0%	🎯 21/10/2025
Fase 6	Deploy & Produção	⏳ Planejada	0%	🎯 23/10/2025
✅ Funcionalidades Completamente Implementadas
1. Infraestrutura Completa (100% - 15/08/2025)
Docker Environment:

docker-compose.yml com 3 serviços:
app: Next.js development server (porta 3000)
postgres: PostgreSQL 16 (porta 5432)
pgadmin: Interface web (porta 5050)
Networks customizadas para isolamento
Volumes persistentes para dados do PostgreSQL
Health checks para inicialização ordenada
Hot reload funcionando perfeitamente (watch mode)
Scripts npm para gerenciamento do ambiente
Prisma ORM:

Schema database com 6 modelos principais:

Usuario (id, email, nome, senha, role, avatar)
Professor (id, nome, email, materia, avatar, ativo)
Aula (id, titulo, descricao, materia, dataHora, duracao, sala, status)
Avaliacao (usuarioId, aulaId, humor, nota, feedback)
HumorRegistro (usuarioId, humor, data, observacao)
Evento (titulo, descricao, dataInicio, dataFim, tipo, cor)
Relacionamentos configurados:

Usuario 1:N Avaliacao
Usuario 1:N HumorRegistro
Professor 1:N Aula
Aula 1:N Avaliacao
Enums implementados:

Role: ALUNO, PROFESSOR, ADMIN
TipoHumor: MUITO_TRISTE, TRISTE, NEUTRO, FELIZ, MUITO_FELIZ
StatusAula: AGENDADA, EM_ANDAMENTO, CONCLUIDA, CANCELADA
Migrations aplicadas com sucesso (prisma migrate dev)

Seed executado com dados de exemplo:

10 usuários (5 alunos, 3 professores, 2 admins)
5 professores cadastrados
20 aulas distribuídas em 5 disciplinas
30 avaliações históricas
50 registros de humor
15 eventos de calendário
Prisma Studio configurado (porta 5555)

pgAdmin acessível em localhost:5050

2. Frontend Completo (42 páginas - 21/09/2025)
Autenticação (3 páginas):

/login - Página de login com:

Formulário com validação Zod (email formato válido, senha mínima)
Estados de loading durante requisição
Mensagens de erro amigáveis
Link para recuperação de senha
Link para cadastro
Botão Google OAuth (visual preparado)
Layout responsivo exclusivo (sem sidebar)
/cadastro - Registro com:

Campos: nome, email, senha, confirmação de senha
Seleção de role (ALUNO/PROFESSOR via toggle)
Validação em tempo real
Indicador de força de senha
Termos de uso (checkbox obrigatório)
/reset-password - Recuperação de senha:

Input de email
Mensagem de confirmação de envio
Timer de reenvio (60 segundos)
Landing & Home (2 páginas):

/ - Landing Page com 6 seções completas:

Hero Section: Título principal, subtítulo, 2 CTAs (Começar Grátis, Ver Demo)
Features: 4 cards com ícones (Avaliações Rápidas, Dashboard Inteligente, Humor Diário, Relatórios)
Benefits: 6 benefícios + estatísticas de impacto
Testimonials: 3 depoimentos de usuários fictícios com avatares
FAQ: 8 perguntas expansíveis (Accordion)
CTA Final: Chamada para ação com formulário de email
/home - Dashboard personalizado:

Navegação condicional por role
Cards de métricas principais
Atalhos rápidos (Avaliar Aula, Registrar Humor)
Atividades recentes
Próximas aulas (calendário resumido)
Sistema de Avaliações (2 páginas + componentes):

/aulas/[id]/avaliar - Formulário completo:

Seletor de humor com 5 emojis animados:
😢 MUITO_TRISTE | 😟 TRISTE | 😐 NEUTRO | 😊 FELIZ | 😄 MUITO_FELIZ
Sistema de notas com 5 estrelas interativas (hover + click)
Campo de feedback textual (textarea com contador: 0/500 caracteres)
Validações:
Humor obrigatório
Nota obrigatória (1-5)
Feedback opcional mas recomendado (toast se vazio)
Botão de envio com loading state
Confirmação de sucesso (toast + redirecionamento)
/avaliacoes - Histórico de avaliações:

Lista de cards paginada (10 por página)
Filtros avançados:
Por disciplina (dropdown)
Por professor (dropdown)
Por período (date range picker)
Por humor (multi-select)
Cada card mostra:
Nome da aula e professor
Data e horário
Humor (emoji) + Nota (estrelas)
Preview do feedback (100 caracteres + "Ver mais")
Botão de edição (se avaliação < 7 dias)
Estatísticas no topo:
Total de avaliações
Humor médio (emoji predominante)
Nota média (número + estrelas)
Componentes de Avaliação:

FloatingButton - Botão flutuante para avaliação rápida:

Posição fixa (bottom-right)
Tooltip com texto "Avaliar Aula"
Animação de pulso sutil
Abre modal de avaliação rápida
QuickEvaluationModal - Modal de avaliação rápida:

Formulário simplificado (apenas humor + nota)
Dropdown de aulas recentes
Botão "Avaliação completa" (redireciona para página full)
Páginas Institucionais (8 páginas):

/sobre - Sobre o ClassCheck:

Seção "Nossa Missão" com texto institucional
Seção "Equipe" com cards dos desenvolvedores (foto, nome, role, skills)
Seção "Tecnologias" com badges das stacks usadas
Seção "Contato" com formulário simplificado
/ajuda - Central de Ajuda:

Barra de busca inteligente (filtra em tempo real)
Categorias de ajuda (6 seções):
Primeiros Passos
Avaliações
Dashboard
Conta e Perfil
Problemas Técnicos
Outros
Accordion com 20+ perguntas frequentes
Índice lateral navegável (desktop)
Botão "Ainda precisa de ajuda?" (redireciona para /suporte)
/contato - Página de Contato:

Formulário com campos:
Nome completo
Email
Assunto (dropdown: Dúvida, Sugestão, Problema, Comercial)
Mensagem (textarea)
Validação com Zod
Informações de contato alternativas:
Email: contato@classcheck.com
Telefone: (11) 99999-9999
Mapa de localização (iframe Google Maps - mockado)
/suporte - Central de Suporte:

Sistema de tickets (estrutura pronta)
Categorização inteligente:
Urgente (resposta em 4h)
Alta (resposta em 1 dia)
Normal (resposta em 3 dias)
Upload de anexos (estrutura preparada)
Chat ao vivo (botão preparado para futuro)
/termos-de-uso - Termos de Uso:

Documento completo com 12 seções:
Aceitação dos Termos
Descrição do Serviço
Cadastro e Conta
Uso Aceitável
Propriedade Intelectual
Privacidade
Responsabilidades do Usuário
Limitação de Responsabilidade
Modificações do Serviço
Rescisão
Lei Aplicável
Contato
Índice navegável lateral (desktop)
Última atualização: 01/10/2025
/politica-de-privacidade - Política de Privacidade:

Documento em conformidade com LGPD (Lei 13.709/2018)
10 seções principais:
Informações que Coletamos
Como Usamos suas Informações
Compartilhamento de Dados
Armazenamento e Segurança
Seus Direitos (LGPD)
Cookies
Dados de Menores
Alterações na Política
Contato do DPO
Consentimento
Índice navegável
Última atualização: 01/10/2025
/manutencao - Página de Manutenção:

Exibida durante deploys ou manutenções programadas
Animação de loading
Mensagem amigável
Tempo estimado de retorno
Status em tempo real (mockado)
/404 - Página Not Found customizada:

Ilustração SVG amigável
Mensagem de erro humanizada
Sugestões de páginas úteis
Botão "Voltar para Home"
Código de erro estilizado
Dashboards Completos (1 página unificada):

/dashboard - Dashboard Unificado com sistema de tabs:
Tab 1: Visão Geral

4 Cards de métricas principais:

Total de Avaliações (número + trend ↑↓)
Humor Médio (emoji predominante + percentual)
Taxa de Presença (percentual + gráfico mini)
Nota Média Geral (estrelas + valor numérico)
Gráfico de linha (Recharts):

Eixo X: Últimos 30 dias
Eixo Y: Número de avaliações
Tooltip interativo
Legenda customizada
Responsivo (mobile: scroll horizontal)
Calendário de eventos:

Integração com react-day-picker
Marcadores visuais por tipo de evento:
🔵 Aulas regulares
🔴 Provas
🟢 Eventos especiais
🟡 Feriados
Modal de detalhes ao clicar em dia
Navegação mensal (< >)
Tab 2: Avaliações

Tabela de aulas recentes (últimas 20):

Colunas: Disciplina, Professor, Data, Hora, Avaliações, Nota Média
Ordenação por coluna (clique no header)
Filtros:
Por disciplina (multi-select)
Por professor (multi-select)
Por período (date range)
Ação: Botão "Ver Detalhes" (redireciona para /aulas/[id])
Gráfico de barras (Recharts):

Comparativo de notas por disciplina
Barras coloridas por faixa de nota:
Verde: ≥4.0
Amarelo: 3.0-3.9
Vermelho: <3.0
Tooltip com breakdown detalhado
Tab 3: Humor & Bem-estar

Widget de humor rápido:

Seletor de emoji (hoje)
Botão "Registrar Humor"
Mensagem motivacional contextual
Gráfico de tendências emocionais (Recharts):

Eixo X: Últimos 30 dias
Eixo Y: Tipo de humor (1-5)
Linha suavizada (smoothing)
Área preenchida (gradient)
Marcadores de eventos especiais
Estatísticas de humor:

Humor predominante do mês (emoji gigante)
Distribuição percentual por humor (5 cards)
Comparativo com mês anterior (trend)
Tab 4: Relatórios

Sistema de exportação (5 formatos):

PDF: Gerado com layout profissional
Excel (.xlsx): Planilhas múltiplas
CSV: Dados brutos separados por vírgula
JSON: Estrutura completa para API
XML: Compatibilidade com sistemas legados
Configuração de relatório:

Período (date range picker)
Filtros por disciplina/professor
Métricas a incluir (checklist)
Formato de saída (dropdown)
Preview antes de exportar (modal)
Relatórios pré-configurados:

Relatório Semanal (últimos 7 dias)
Relatório Mensal (mês atual)
Relatório Semestral (6 meses)
Relatório Customizado (configuração manual)
Componentes de Dashboard:

ClassCheckMetrics - Cards de métricas especializados
TrendIndicator - Indicador visual de tendência (↑↓ com cores)
MiniChart - Gráficos miniatura para cards
ExportButton - Botão com dropdown de formatos
DataTable - Tabela com ordenação e paginação
FilterPanel - Painel lateral de filtros avançados
3. Design System v2 Completo (15 componentes)
Componentes Base:

Button - 5 variants (default, primary, secondary, ghost, danger) × 3 sizes (sm, md, lg)
Card - Container com Header, Content, Footer opcionais
Input - Text, email, password, number com label, error state, ícones
Textarea - Com contador de caracteres e redimensionamento
Select - Dropdown customizado com busca integrada
Checkbox - Com label e estados indeterminado
Radio - Grupo de opções exclusivas
Switch - Toggle on/off estilizado
Componentes Avançados:

Toast - Sistema global com 4 tipos:

Success (verde, ícone ✓)
Error (vermelho, ícone ✕)
Warning (amarelo, ícone ⚠)
Info (azul, ícone ℹ)
Auto-dismiss em 5s (configurável)
Stacking de múltiplos toasts
Animação de entrada/saída
Dialog/Modal - Overlay com backdrop:

Header com título e botão fechar
Body com scroll interno
Footer com ações (Cancelar, Confirmar)
Fechamento com ESC ou clique fora
Bloqueio de scroll do body
ConfirmationModal - Modal de confirmação reutilizável:

Props: title, message, onConfirm, onCancel
Variants: danger (vermelho), warning (amarelo)
Ícone contextual
Foco automático no botão de ação
Skeleton - Loading states profissionais:

SkeletonCard (placeholder de card)
SkeletonTable (placeholder de tabela)
SkeletonText (linhas de texto)
SkeletonAvatar (círculo de avatar)
SkeletonChart (placeholder de gráfico)
SkeletonDashboard (layout completo)
Animação de shimmer
Badge - Indicadores visuais:

Status: success, warning, error, info
Priority: high, medium, low
Size: sm, md, lg
Variants: solid, outline, ghost
Com ou sem ícone
Avatar - Imagem de perfil:

Fallback com iniciais (ex: FA para Felipe Allan)
Sizes: xs, sm, md, lg, xl
Status indicator (online/offline - bolinha colorida)
Loading skeleton integrado
Tabs - Navegação por abas:

Horizontal e vertical
Indicador de aba ativa (underline animado)
Lazy loading de conteúdo
Acessibilidade completa (navegação por teclado)
Tooltip - Dicas contextuais:

4 posições: top, right, bottom, left
Delay configurável (default: 300ms)
Seta indicadora
Acessibilidade (ARIA)
Progress - Indicadores de progresso:

Linear (barra horizontal)
Circular (anel)
Percentual visível ou oculto
Cores contextuais
Animação suave
DatePicker - Seletor de data:

Integração com react-day-picker
Single date e range (período)
Locale pt-BR
Desabilitar datas passadas/futuras
Marcadores visuais de eventos
FloatingButton - Botão de ação flutuante:

Posição fixa (6 variações: cantos + laterais)
Tooltip com texto
Animação de pulso
Badge de notificação (número)
Expandível (mini-menu)
ThemeToggle - Alternador de tema:

Ícone: ☀️ (light) ⇄ 🌙 (dark)
Animação de transição
Persistência no localStorage
Integração com next-themes
Theme System:

Design tokens CSS variables:

​​--background, --foreground
​​--primary, --primary-foreground
​​--secondary, --secondary-foreground
​​--accent, --accent-foreground
​​--destructive, --destructive-foreground
​​--muted, --muted-foreground
​​--card, --card-foreground
​​--popover, --popover-foreground
​​--border, --input, --ring
​​--radius: 0.5rem
Dark mode completo:

Transição suave entre temas
Todos os componentes compatíveis
Imagens com filtros adaptativos
Detecção automática de preferência do sistema
4. APIs REST Implementadas (15 endpoints - 75%)
Usuários (2 endpoints - 40%):

// GET /api/usuarios
// Lista todos os usuários (sem paginação - TODO)
// Retorna: { usuarios: Usuario[] }
// Status: 200 OK | 500 Internal Server Error

// POST /api/usuarios
// Cria novo usuário com validação Zod
// Body: { nome, email, senha, role? }
// Validações:
//   - Email formato válido
//   - Email único no banco
//   - Senha mínima 6 caracteres
//   - Role: ALUNO | PROFESSOR | ADMIN (default: ALUNO)
// Retorna: { usuario: Usuario }
// Status: 201 Created | 400 Bad Request | 409 Conflict
Pendentes:

PUT /api/usuarios/[id] - Atualizar dados do usuário
DELETE /api/usuarios/[id] - Remover usuário (soft delete)
GET /api/usuarios/[id] - Buscar por ID com avaliações
Professores (5 endpoints - 100%):

// GET /api/professores
// Lista professores ativos (ativo = true)
// Query params: ?page=1&limit=10 (opcional)
// Retorna: { professores: Professor[], total: number }
// Status: 200 OK

// POST /api/professores
// Cria novo professor
// Body: { nome, email, materia, avatar? }
// Validações:
//   - Email único (constraint do banco)
//   - Materia obrigatória
//   - Avatar URL válida (opcional)
// Retorna: { professor: Professor }
// Status: 201 Created | 400 Bad Request | 409 Conflict

// GET /api/professores/[id]
// Busca professor por ID com aulas relacionadas
// Include: { aulas: true }
// Retorna: { professor: Professor & { aulas: Aula[] } }
// Status: 200 OK | 404 Not Found

// PUT /api/professores/[id]
// Atualiza dados do professor
// Body: { nome?, email?, materia?, avatar?, ativo? }
// Validações: mesmas do POST
// Retorna: { professor: Professor }
// Status: 200 OK | 400 Bad Request | 404 Not Found

// DELETE /api/professores/[id]
// Remove professor (soft delete: ativo = false)
// Não deleta do banco, apenas marca como inativo
// Retorna: { success: true }
// Status: 200 OK | 404 Not Found
Aulas (5 endpoints - 100%):

// GET /api/aulas
// Lista aulas com filtros avançados
// Query params:
//   ?data=2025-10-01 (filtra por data)
//   ?materia=Matemática (filtra por disciplina)
//   ?professorId=1 (filtra por professor)
//   ?status=AGENDADA (filtra por status)
//   ?page=1&limit=10 (paginação)
// Include: { professor: true, avaliacoes: true }
// Retorna: { aulas: Aula[], total: number, page: number }
// Status: 200 OK

// POST /api/aulas
// Cria nova aula com validação de conflitos
// Body: { titulo, descricao?, materia, dataHora, duracao, sala, professorId }
// Validações:
//   - dataHora deve ser futura
//   - duracao entre 30-180 minutos
//   - Conflito de horário (mesma sala + horário)
//   - professorId deve existir
// Retorna: { aula: Aula }
// Status: 201 Created | 400 Bad Request | 409 Conflict

// GET /api/aulas/[id]
// Busca aula por ID com professor e avaliações
// Include: { professor: true, avaliacoes: { include: { usuario: true } } }
// Calcula: notaMedia, totalAvaliacoes, humorPredomin ante
// Retorna: { aula: Aula & { stats: AulaStats } }
// Status: 200 OK | 404 Not Found

// PUT /api/aulas/[id]
// Atualiza dados da aula
// Body: { titulo?, descricao?, dataHora?, duracao?, sala?, status? }
// Validações: mesmas do POST + não permitir editar aula CONCLUIDA
// Retorna: { aula: Aula }
// Status: 200 OK | 400 Bad Request | 404 Not Found

// DELETE /api/aulas/[id]
// Remove aula permanentemente do banco
// Valida: não permitir deletar aula com avaliações
// Retorna: { success: true }
// Status: 200 OK | 400 Bad Request | 404 Not Found
Validações Avançadas Implementadas:

Conflito de Horário (Aulas):
// Verifica se existe aula na mesma sala no horário conflitante
const conflito = await prisma.aula.findFirst({
  where: {
    sala: body.sala,
    dataHora: {
      gte: new Date(body.dataHora),
      lt: new Date(body.dataHora.getTime() + body.duracao * 60000)
    },
    status: { not: 'CANCELADA' }
  }
});
if (conflito) throw new Error('Conflito de horário');
Email Único:
// Valida se email já existe antes de criar
const existente = await prisma.usuario.findUnique({
  where: { email: body.email }
});
if (existente) {
  return NextResponse.json(
    { error: 'Email já cadastrado' },
    { status: 409 }
  );
}
Relacionamentos Obrigatórios:
// Valida se professor existe antes de criar aula
const professor = await prisma.professor.findUnique({
  where: { id: body.professorId }
});
if (!professor || !professor.ativo) {
  return NextResponse.json(
    { error: 'Professor não encontrado ou inativo' },
    { status: 400 }
  );
}
Error Handling Padronizado:

Todas as APIs retornam erros no formato:

{
  "error": "Mensagem de erro amigável",
  "details": "Detalhes técnicos (apenas em dev)",
  "code": "ERROR_CODE"
}
Status codes padronizados:

200: OK (sucesso)
201: Created (criado)
400: Bad Request (validação falhou)
404: Not Found (recurso não existe)
409: Conflict (duplicação/conflito)
500: Internal Server Error (erro inesperado)
Collection Insomnia:

12 requests organizadas por pasta
Variáveis de ambiente (base_url, auth_token)
Exemplos de body para POST/PUT
Testes automatizados (status code, schema)
5. DIVISÃO DE TAREFAS
👨‍💻 Felipe Allan Nascimento Cruz
Role: Full Stack Developer & Tech Lead
GitHub: @Felipeallanf10

Responsabilidades & Tarefas Executadas
1. Arquitetura & Infraestrutura (22 horas)

Tarefa	Descrição	Status	Horas
Docker Setup	Configuração docker-compose.yml com 3 serviços	✅	4h
PostgreSQL Config	Setup database com usuário, senha, volumes	✅	2h
Prisma Setup	Instalação, configuração, schema inicial	✅	3h
Database Schema	Design de 6 modelos com relacionamentos	✅	5h
Migrations	Criação e aplicação de migrations	✅	2h
Seed Script	Dados de exemplo para desenvolvimento	✅	3h
Environment Variables	.env, .env.example, documentação	✅	1h
Git Workflow	Branch strategy, .gitignore, README inicial	✅	2h
2. Backend & APIs REST (38 horas)

Tarefa	Descrição	Status	Horas
API Usuários GET	Listar todos os usuários	✅	2h
API Usuários POST	Criar com validação Zod	✅	3h
API Professores GET	Listar professores ativos	✅	2h
API Professores POST	Criar com validação de email	✅	3h
API Professores GET/:id	Buscar por ID com aulas	✅	2h
API Professores PUT	Atualizar dados	✅	3h
API Professores DELETE	Soft delete (ativo=false)	✅	2h
API Aulas GET	Listar com filtros avançados	✅	4h
API Aulas POST	Criar com validação de conflitos	✅	5h
API Aulas GET/:id	Detalhes com stats calculadas	✅	3h
API Aulas PUT	Atualizar com validações	✅	3h
API Aulas DELETE	Remover com validação	✅	2h
Error Handling	Padronização de respostas de erro	✅	2h
TypeScript Fixes	Correção async params Next.js 15	✅	2h
3. Frontend - Autenticação (16 horas)

Tarefa	Descrição	Status	Horas
Layout Auth	Layout exclusivo sem sidebar	✅	2h
Página Login	Formulário + validação + estados	✅	5h
Página Cadastro	Registro com seleção de role	✅	5h
Página Reset Password	Recuperação de senha	✅	3h
Integração Zod	Schemas de validação	✅	1h
4. Frontend - Landing & Institucional (22 horas)

Tarefa	Descrição	Status	Horas
Landing Page	6 seções completas (Hero, Features, etc)	✅	8h
Home Logada	Dashboard básico	✅	3h
Página Sobre	Missão, equipe, tecnologias	✅	2h
Página Ajuda	FAQ com busca	✅	3h
Página Contato	Formulário funcional	✅	2h
Página Suporte	Sistema de tickets	✅	2h
Termos & Privacidade	2 páginas completas LGPD	✅	2h
5. Design System v2 (14 horas)

Tarefa	Descrição	Status	Horas
Componentes Base	Button, Card, Input, Select	✅	4h
Toast System	Sistema global de notificações	✅	3h
Modal & Confirmation	Dialogs reutilizáveis	✅	2h
Skeleton Loaders	6 variações de loading	✅	2h
Theme System	Dark/light mode completo	✅	2h
Hot Reload Fix	Otimização Docker + Next.js	✅	1h
6. Documentação (10 horas)

Tarefa	Descrição	Status	Horas
README.md	Documentação técnica principal	✅	3h
PROXIMOS_PASSOS.md	Roadmap detalhado	✅	2h
API Documentation	Comentários JSDoc em todos os endpoints	✅	2h
Collection Insomnia	12 requests organizadas	✅	2h
Relatório HTML	Relatório interativo v3.0	✅	1h
Total de Horas: 122 horas
Commits Realizados: 32 commits organizados
Pull Requests: 11 PRs (9 merged, 2 em review)

👨‍💻 Nickollas Teixeira Medeiros
Role: Frontend Developer & UI/UX Specialist
GitHub: @nickollas-teixeira (assumindo)

Responsabilidades & Tarefas Executadas
1. Sistema de Avaliações (27 horas)

Tarefa	Descrição	Status	Horas
Página Avaliar Aula	Formulário completo com humor + nota + feedback	✅	8h
Seletor de Humor	5 emojis animados interativos	✅	3h
Sistema de Estrelas	Rating 1-5 com hover	✅	2h
Validação Frontend	React Hook Form + Zod	✅	2h
Página Histórico	Lista paginada de avaliações	✅	5h
Filtros Avançados	Por disciplina, professor, período	✅	4h
FloatingButton	Botão flutuante de avaliação rápida	✅	2h
Modal Avaliação Rápida	Formulário simplificado em modal	✅	1h
2. Dashboard & Relatórios (33 horas)

Tarefa	Descrição	Status	Horas
Dashboard Layout	Estrutura com sistema de tabs	✅	4h
Cards de Métricas	4 cards principais com trends	✅	4h
Gráfico de Linha	Tendências com Recharts	✅	4h
Gráfico de Barras	Comparativos por disciplina	✅	3h
Calendário Eventos	Integração react-day-picker	✅	5h
Tabela de Aulas	DataTable com ordenação	✅	4h
Sistema de Exportação	5 formatos (PDF, Excel, CSV, JSON, XML)	✅	6h
Widget Humor	Registro rápido de humor	✅	2h
Relatórios Pré-configurados	4 templates prontos	✅	1h
3. Questionários Socioemocionais (20 horas)

Tarefa	Descrição	Status	Horas
Página Humor	Estrutura principal	✅	4h
Seletor Emojis Animado	5 emojis com animações	✅	3h
Dashboard Histórico Pessoal	Visualização de registros	✅	5h
Gráficos Tendências	Linha suavizada com área	✅	4h
Modal Reflexão Diária	Pergunta motivacional	✅	2h
Estatísticas de Humor	Cards de distribuição	✅	2h
4. Componentes UI (18 horas)

Tarefa	Descrição	Status	Horas
Skeleton Loaders	6 variações (Card, Table, Text, etc)	✅	4h
Badge Component	Status, priority, size variants	✅	2h
Avatar Component	Com fallback e status indicator	✅	2h
Tooltip Component	4 posições com delay	✅	2h
Progress Component	Linear e circular	✅	2h
DatePicker	Integração react-day-picker	✅	3h
Tabs Component	Navegação por abas	✅	2h
Responsividade	Testes mobile/tablet/desktop	✅	1h
5. Integração & Testes (5 horas)

Tarefa	Descrição	Status	Horas
Integração Recharts	Setup e configuração	✅	2h
Instalação Radix UI	10 componentes primitivos	✅	1h
Testes Responsivos	Breakpoints mobile/tablet/desktop	✅	1h
Correção de Overflow	Fix de texto em páginas institucionais	✅	1h
6. Documentação (5 horas)

Tarefa	Descrição	Status	Horas
Storybook Structure	Estrutura de componentes	✅	2h
Style Guide	Guia visual de componentes	✅	2h
Screenshots	Capturas de tela do sistema	✅	1h
Total de Horas: 108 horas
Commits Realizados: 23 commits documentados
Pull Requests: 7 PRs (6 merged, 1 em review)

📊 Métricas de Colaboração do Projeto
Métrica	Felipe	Nickollas	Total
Horas Trabalhadas	122h	108h	230h
Commits	32	23	55
Pull Requests	11	7	18
Issues Resolvidas	18	14	32
Linhas de Código	~9.000	~6.000	~15.000
Arquivos Criados	~110	~70	~180
Branches Ativas:

main - Produção estável (último merge: 21/09/2025)
alpha-2.6 - Desenvolvimento ativo (atual - 65% completo)
feature/api-avaliacoes - API de avaliações (criada 01/10)
feature/nextauth-setup - Autenticação (planejada para 08/10)
Ferramentas de Colaboração:

GitHub Projects para tracking de tarefas
Discord para comunicação diária
Google Meet para pair programming (2x por semana)
Figma para design colaborativo
Notion para documentação de decisões
Processo de Review:

Minimum 1 approval obrigatório em PRs
Code review focado em: legibilidade, performance, acessibilidade
Testes manuais obrigatórios antes de merge
Merge strategy: Squash and merge (commits limpos)
6. PLANEJAMENTO BÁSICO PARA O 4º BIMESTRE
🎯 Objetivo Final (Av1 - 23/10/2025)
Entrega: Aplicação web completa em produção (Vercel) com:

✅ Autenticação funcional (NextAuth)
✅ 100% das APIs REST implementadas
✅ Todas as páginas frontend integradas com backend
✅ Testes automatizados (unitários + E2E críticos)
✅ Documentação completa (técnica + usuário)
✅ Deploy estável com monitoramento
Critérios de Sucesso:

Aplicação acessível via URL pública
3 tipos de usuário (ALUNO, PROFESSOR, ADMIN) funcionais
Fluxo completo: Login → Avaliar Aula → Ver Dashboard → Logout
Zero erros críticos em produção
Documentação permite que terceiro execute projeto localmente
📅 CRONOGRAMA SEMANAL DETALHADO
SEMANA 1: 01/10 - 07/10/2025
Objetivo: Completar 100% das APIs REST Backend

Data	Tarefa	Responsável	Horas	Entregável
01-02/10	API Avaliações (CRUD completo)	Felipe	12h	5 endpoints funcionais
- POST /api/avaliacoes (criar avaliação)		4h	Validação: 1 avaliação/usuário/aula
- GET /api/avaliacoes (listar com filtros)		3h	Filtros por usuário, aula, período
- PUT /api/avaliacoes/[id] (editar)		2h	Permitir edição < 7 dias
- GET /api/avaliacoes/stats (agregações)		2h	Média, distribuição, tendências
- GET /api/avaliacoes/aula/[id] (por aula)		1h	Todas avaliações de uma aula
03-04/10	API Humor & Bem-estar	Felipe	10h	4 endpoints funcionais
- POST /api/humor (registrar humor diário)		3h	Validação: 1 registro/usuário/dia
- GET /api/humor/usuario/[id] (histórico)		2h	Últimos 90 dias
- GET /api/humor/dashboard (dados gráficos)		3h	Agregações para Recharts
- PUT /api/humor/[id] (editar registro)		2h	Editar até 24h após criação
05-06/10	API Eventos & Calendário	Nickollas	8h	4 endpoints funcionais
- GET /api/eventos (listar por período)		2h	Filtro por mês/tipo
- POST /api/eventos (criar evento)		2h	Tipos: AULA, PROVA, EVENTO, FERIADO
- PUT /api/eventos/[id] (atualizar)		2h	Validação de datas
- DELETE /api/eventos/[id] (remover)		2h	Apenas eventos futuros
07/10	Testes & Documentação APIs	Ambos	6h	Collection + docs
- Atualizar Collection Insomnia	Felipe	2h	30+ requests organizadas
- Testes de integração manuais	Ambos	2h	Todos os fluxos críticos
- Documentação OpenAPI/Swagger	Felipe	2h	Spec completa em YAML
Entrega da Semana 1: ✅ 6 módulos de API completos (18 endpoints REST)

SEMANA 2: 08/10 - 14/10/2025
Objetivo: Sistema de Autenticação & Segurança Completo

Data	Tarefa	Responsável	Horas	Entregável
08-09/10	NextAuth Configuration	Felipe	10h	Auth funcional
- Instalar next-auth + @prisma/adapter		1h	Dependências
- Configurar /api/auth/[…nextauth]/route.ts		3h	Providers setup
- Implementar Prisma Adapter		2h	Session, User, Account models
- Provider de Credenciais (email/senha)		2h	Hash bcrypt
- JWT Strategy		1h	Secret + expiration
- Callbacks (jwt, session)		1h	Role no token
10/10	Sistema de Registro	Felipe	6h	Signup completo
- Endpoint de registro integrado		2h	POST /api/auth/register
- Hash de senha com bcrypt		2h	Salt rounds = 10
- Validação: email único, senha forte		2h	Zod schema robusto
11/10	Middleware de Proteção	Felipe	6h	Rotas protegidas
- middleware.ts com matcher		2h	Proteger /dashboard, /avaliacoes
- Verificação			