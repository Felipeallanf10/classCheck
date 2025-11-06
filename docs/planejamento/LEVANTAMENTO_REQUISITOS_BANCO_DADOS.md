# 📊 Levantamento de Requisitos - Banco de Dados ClassCheck

**Data:** 16 de outubro de 2025  
**Versão:** 1.0  
**Responsável:** Equipe ClassCheck  
**Status:** Em Desenvolvimento

---

## 🎯 Objetivo

Documentar todos os requisitos de dados do sistema ClassCheck, com ênfase especial em:
- ✅ Questionários socioemocionais completos
- ✅ Base de perguntas e sistema adaptativo
- ✅ Micro-interações e detalhes granulares
- ✅ Gamificação e progresso do usuário
- ✅ Relatórios e analytics avançados

---

## 📋 Índice

1. [Usuários e Autenticação](#1-usuários-e-autenticação)
2. [Questionários Socioemocionais](#2-questionários-socioemocionais)
3. [Base de Perguntas Adaptativas](#3-base-de-perguntas-adaptativas)
4. [Avaliações Didáticas](#4-avaliações-didáticas)
5. [Sistema de Gamificação](#5-sistema-de-gamificação)
6. [Aulas e Calendário](#6-aulas-e-calendário)
7. [Professores e Disciplinas](#7-professores-e-disciplinas)
8. [Relatórios e Analytics](#8-relatórios-e-analytics)
9. [Notificações e Lembretes](#9-notificações-e-lembretes)
10. [Logs e Auditoria](#10-logs-e-auditoria)

---

## 1. Usuários e Autenticação

### 1.1 Entidade: Usuario

```prisma
model Usuario {
  id                String   @id @default(uuid())
  email             String   @unique
  senha             String   // Hash bcrypt
  nome              String
  nomeCompleto      String?
  avatar            String?
  role              Role     @default(ALUNO)
  
  // Dados pessoais
  dataNascimento    DateTime?
  cpf               String?   @unique
  telefone          String?
  genero            Genero?
  
  // Endereço
  endereco          String?
  cidade            String?
  estado            String?
  cep               String?
  
  // Dados acadêmicos (para alunos)
  matricula         String?   @unique
  turma             String?
  periodo           String?   // "Manhã", "Tarde", "Noite"
  anoIngresso       Int?
  
  // Preferências e configurações
  preferencias      Json?     // { tema, idioma, notificacoes, etc }
  primeiroAcesso    Boolean   @default(true)
  onboardingCompleto Boolean  @default(false)
  
  // Gamificação
  xpTotal           Int       @default(0)
  nivel             Int       @default(1)
  proximoNivel      Int       @default(100)
  
  // Status e controle
  ativo             Boolean   @default(true)
  emailVerificado   Boolean   @default(false)
  ultimoAcesso      DateTime?
  criadoEm          DateTime  @default(now())
  atualizadoEm      DateTime  @updatedAt
  
  // Relacionamentos
  avaliacoesSocioemocionais AvaliacaoSocioemocional[]
  avaliacoesDidaticas       AvaliacaoDidatica[]
  avaliacoesProfessores     AvaliacaoProfessor[]
  checkIns                  CheckIn[]
  conquistas                UsuarioConquista[]
  badges                    UsuarioBadge[]
  notificacoes              Notificacao[]
  logs                      LogAtividade[]
  sessoes                   Sessao[]
}

enum Role {
  ALUNO
  PROFESSOR
  COORDENADOR
  ADMIN
  PSICOLOGO
}

enum Genero {
  MASCULINO
  FEMININO
  NAO_BINARIO
  PREFIRO_NAO_DIZER
  OUTRO
}
```

### 1.2 Entidade: Sessao

```prisma
model Sessao {
  id           String   @id @default(uuid())
  usuarioId    String
  token        String   @unique
  refreshToken String   @unique
  
  // Dados da sessão
  ipAddress    String?
  userAgent    String?
  dispositivo  String?  // "Desktop", "Mobile", "Tablet"
  navegador    String?  // "Chrome", "Firefox", etc
  localizacao  String?  // Cidade/Estado inferido do IP
  
  // Controle
  ativo        Boolean  @default(true)
  expiraEm     DateTime
  criadoEm     DateTime @default(now())
  ultimaAtividade DateTime @default(now())
  
  // Relacionamento
  usuario      Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
}
```

---

## 2. Questionários Socioemocionais

### 2.1 Entidade: QuestionarioSocioemocional (Template)

```prisma
model QuestionarioSocioemocional {
  id              String   @id @default(uuid())
  titulo          String
  descricao       String?
  versao          String   @default("1.0")
  
  // Configurações
  tipo            TipoQuestionario
  frequencia      FrequenciaQuestionario? // Para questionários recorrentes
  duracaoEstimada Int?     // Em minutos
  
  // Categorias avaliadas
  categorias      String[] // ["humor", "ansiedade", "motivacao", "relacionamentos"]
  
  // Configurações de adaptação
  adaptativo      Boolean  @default(false)
  nivelAdaptacao  NivelAdaptacao?
  
  // Público-alvo
  rolesPermitidos Role[]
  idadeMinima     Int?
  idadeMaxima     Int?
  
  // Status e controle
  ativo           Boolean  @default(true)
  oficial         Boolean  @default(false) // Validado por psicólogos
  criadoPor       String?
  criadoEm        DateTime @default(now())
  atualizadoEm    DateTime @updatedAt
  
  // Relacionamentos
  perguntas       PerguntaSocioemocional[]
  respostas       RespostaSocioemocional[]
}

enum TipoQuestionario {
  CHECK_IN_DIARIO
  AVALIACAO_SEMANAL
  AVALIACAO_MENSAL
  AVALIACAO_POS_AULA
  AVALIACAO_CRITICA  // Momento de crise/intervenção
  QUESTIONARIO_INICIAL // Onboarding
  QUESTIONARIO_FINAL   // Fim do período
}

enum FrequenciaQuestionario {
  DIARIO
  SEMANAL
  QUINZENAL
  MENSAL
  TRIMESTRAL
  SEMESTRAL
  ANUAL
  SOB_DEMANDA
}

enum NivelAdaptacao {
  BAIXO     // Apenas ordem das perguntas
  MEDIO     // Pula perguntas baseado em respostas
  ALTO      // Adiciona/remove perguntas dinamicamente
  MUITO_ALTO // IA decide próximas perguntas
}
```

### 2.2 Entidade: PerguntaSocioemocional

```prisma
model PerguntaSocioemocional {
  id                String   @id @default(uuid())
  questionarioId    String
  
  // Conteúdo da pergunta
  texto             String
  textoDetalhado    String?  // Explicação adicional
  ordem             Int
  obrigatoria       Boolean  @default(true)
  
  // Categoria e classificação
  categoria         CategoriaSocioemocional
  subcategoria      String?
  dimensao          DimensaoEmocional? // Modelo circumplex
  
  // Tipo de pergunta e formato de resposta
  tipo              TipoPergunta
  formatoResposta   FormatoResposta
  
  // Opções de resposta (JSON)
  opcoes            Json?    // Array de opções para múltipla escolha
  escalaMin         Int?     // Para escalas Likert
  escalaMax         Int?
  labelMin          String?  // "Discordo totalmente"
  labelMax          String?  // "Concordo totalmente"
  
  // Validações
  respostaMinima    String?  // Para texto livre
  respostaMaxima    String?
  padraoResposta    String?  // Regex para validação
  
  // Sistema adaptativo
  condicoes         Json?    // Condições para mostrar esta pergunta
  gatilhos          Json?    // Que outras perguntas esta resposta gatilha
  pesoAdaptacao     Float    @default(1.0)
  
  // Pontuação e interpretação
  pontuacaoPositiva Boolean  @default(true) // Se maior = melhor
  interpretacao     Json?    // Mapa de ranges e significados
  
  // Alertas e intervenção
  nivelAlerta       NivelAlerta?
  mensagemAlerta    String?  // Se resposta indicar alerta
  acaoRecomendada   String?  // Ex: "Sugerir conversa com psicólogo"
  
  // Metadados
  tags              String[]
  fonteReferencia   String?  // Artigo científico, escala validada
  validadoCientificamente Boolean @default(false)
  
  // Status
  ativo             Boolean  @default(true)
  criadoEm          DateTime @default(now())
  atualizadoEm      DateTime @updatedAt
  
  // Relacionamentos
  questionario      QuestionarioSocioemocional @relation(fields: [questionarioId], references: [id], onDelete: Cascade)
  respostas         RespostaSocioemocional[]
}

enum CategoriaSocioemocional {
  HUMOR
  EMOCAO
  ANSIEDADE
  ESTRESSE
  MOTIVACAO
  AUTOESTIMA
  RELACIONAMENTOS
  SONO
  ALIMENTACAO
  ATIVIDADE_FISICA
  CONCENTRACAO
  EXPECTATIVAS
  SATISFACAO_ACADEMICA
  PERTENCIMENTO
  SEGURANCA
  APOIO_SOCIAL
  RESILIENCIA
  AUTOEFICACIA
}

enum DimensaoEmocional {
  // Modelo Circumplex de Russell
  ALTA_ATIVACAO_POSITIVA     // Animado, energizado
  ALTA_ATIVACAO_NEGATIVA     // Tenso, nervoso
  BAIXA_ATIVACAO_POSITIVA    // Calmo, relaxado
  BAIXA_ATIVACAO_NEGATIVA    // Triste, deprimido
  NEUTRO
}

enum TipoPergunta {
  OBJETIVA_UNICA       // Múltipla escolha - uma opção
  OBJETIVA_MULTIPLA    // Múltipla escolha - várias opções
  ESCALA_LIKERT        // 1-5, 1-7, 1-10
  ESCALA_VISUAL        // Slider visual
  ESCALA_EMOJIS        // 😞😐😊
  TEXTO_CURTO          // Input de texto (max 200 chars)
  TEXTO_LONGO          // Textarea (max 1000 chars)
  SIM_NAO              // Boolean
  CLASSIFICACAO        // Ordenar itens por preferência
  MATRIZ               // Grid de perguntas relacionadas
  TERMOMETRO           // Escala de 0-100
  SELETOR_COR          // Para identificar emoções por cor
  DESENHO_EMOCIONAL    // Marcar ponto em gráfico circumplex
}

enum FormatoResposta {
  NUMERO
  TEXTO
  BOOLEAN
  ARRAY
  JSON
  COORDENADAS  // Para mapa emocional
}

enum NivelAlerta {
  VERDE     // Tudo bem
  AMARELO   // Atenção
  LARANJA   // Preocupante
  VERMELHO  // Crítico - intervenção imediata
}
```

### 2.3 Entidade: RespostaSocioemocional

```prisma
model RespostaSocioemocional {
  id                String   @id @default(uuid())
  usuarioId         String
  questionarioId    String
  perguntaId        String
  
  // Resposta em diferentes formatos
  respostaTexto     String?
  respostaNumero    Float?
  respostaBoolean   Boolean?
  respostaArray     String[] // Para múltiplas escolhas
  respostaJson      Json?    // Para respostas complexas
  
  // Contexto da resposta
  sessaoId          String   // Agrupa respostas de uma mesma sessão
  ordem             Int      // Ordem que foi respondida
  tempoResposta     Int?     // Tempo em segundos para responder
  
  // Análise e interpretação
  pontuacao         Float?   // Pontuação normalizada (0-100)
  interpretacao     String?  // "Baixo", "Médio", "Alto"
  dimensaoEmocional DimensaoEmocional?
  alertaGerado      Boolean  @default(false)
  nivelAlerta       NivelAlerta?
  
  // Contexto adicional
  localResposta     String?  // "Web", "Mobile"
  dispositivoId     String?
  latitude          Float?   // Se autorizado geolocalização
  longitude         Float?
  
  // Flags de qualidade
  respostaValida    Boolean  @default(true)
  editada           Boolean  @default(false)
  tempoPadrao       Boolean  @default(true) // Se levou tempo esperado
  
  // Metadados
  respondidoEm      DateTime @default(now())
  atualizadoEm      DateTime @updatedAt
  
  // Relacionamentos
  usuario           Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  questionario      QuestionarioSocioemocional @relation(fields: [questionarioId], references: [id])
  pergunta          PerguntaSocioemocional @relation(fields: [perguntaId], references: [id])
  
  @@index([usuarioId, sessaoId])
  @@index([questionarioId, respondidoEm])
}
```

### 2.4 Entidade: CheckIn (Check-in Diário Rápido)

```prisma
model CheckIn {
  id                String   @id @default(uuid())
  usuarioId         String
  
  // Humor principal (obrigatório)
  humor             Humor
  intensidade       Int      // 1-5
  
  // Emoções secundárias (opcional - até 3)
  emocoes           Emocao[]
  
  // Energia e disposição
  nivelEnergia      Int?     // 0-10
  qualidadeSono     Int?     // 1-5
  
  // Texto livre opcional
  observacao        String?  // Max 500 chars
  
  // Fatores influenciadores
  fatores           String[] // ["prova", "problema_familia", "sono_ruim"]
  
  // Contexto
  momentoDia        MomentoDia
  localidade        String?  // "casa", "escola", "trabalho"
  
  // Coordenadas emocionais (Circumplex)
  valencia          Float?   // -1 a 1 (negativo a positivo)
  ativacao          Float?   // -1 a 1 (baixa a alta)
  
  // Gamificação
  xpGanho           Int      @default(5)
  streakDias        Int      @default(1)
  
  // Seguimento
  precisaApoio      Boolean  @default(false)
  apoioSolicitado   Boolean  @default(false)
  respondidoPor     String?  // ID do profissional que respondeu
  
  // Metadados
  criadoEm          DateTime @default(now())
  atualizadoEm      DateTime @updatedAt
  
  // Relacionamento
  usuario           Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  
  @@unique([usuarioId, criadoEm(sort: Desc)]) // Um check-in por dia
  @@index([usuarioId, criadoEm])
}

enum Humor {
  PESSIMO
  RUIM
  NEUTRO
  BOM
  OTIMO
}

enum Emocao {
  // Positivas
  ALEGRE
  ANIMADO
  ORGULHOSO
  GRATO
  ESPERANCOSO
  CONFIANTE
  TRANQUILO
  RELAXADO
  
  // Negativas
  TRISTE
  ANSIOSO
  ESTRESSADO
  FRUSTRADO
  IRRITADO
  ENTEDIADO
  CANSADO
  CONFUSO
  SOLITARIO
  PREOCUPADO
  NERVOSO
  ENVERGONHADO
  
  // Neutras
  SURPRESO
  CURIOSO
  REFLEXIVO
}

enum MomentoDia {
  MANHA
  TARDE
  NOITE
  MADRUGADA
}
```

---

## 3. Base de Perguntas Adaptativas

### 3.1 Entidade: BancoPerguntasAdaptativo

```prisma
model BancoPerguntasAdaptativo {
  id                String   @id @default(uuid())
  
  // Identificação
  codigo            String   @unique // "BPA-001"
  titulo            String
  descricao         String
  
  // Tipo e categoria
  dominio           DominioPergunta
  nivel             NivelDificuldade
  
  // Conteúdo
  textoPergunta     String
  contexto          String?  // Quando/como usar
  
  // Adaptação
  condicoesUso      Json     // Quando esta pergunta deve aparecer
  perguntasRelacionadas String[] // IDs de perguntas relacionadas
  
  // Seguimento (follow-up)
  temSeguimento     Boolean  @default(false)
  perguntasSeguimento Json?  // Perguntas de aprofundamento
  
  // Validade científica
  escalaValidada    String?  // Nome da escala validada
  referenciaBibliografica String?
  coeficienteAlpha  Float?   // Cronbach's alpha
  
  // Uso e eficácia
  vezesMostrada     Int      @default(0)
  vezesRespondida   Int      @default(0)
  taxaResposta      Float    @default(0)
  taxaAlerta        Float    @default(0)
  
  // Análise de qualidade
  tempoMedioResposta Int?    // Segundos
  taxaAbandonamento  Float   @default(0)
  scoreRelevancia    Float   @default(0) // 0-1
  
  // Status
  ativo             Boolean  @default(true)
  emRevisao         Boolean  @default(false)
  versao            String   @default("1.0")
  
  // Auditoria
  criadoPor         String?
  revisadoPor       String?
  aprovadoPor       String?
  criadoEm          DateTime @default(now())
  atualizadoEm      DateTime @updatedAt
  
  @@index([dominio, nivel, ativo])
}

enum DominioPergunta {
  SAUDE_MENTAL
  BEM_ESTAR_GERAL
  DESEMPENHO_ACADEMICO
  RELACIONAMENTOS_INTERPESSOAIS
  DESENVOLVIMENTO_PESSOAL
  HABITOS_VIDA
  SATISFACAO_INSTITUCIONAL
}

enum NivelDificuldade {
  MUITO_FACIL  // Perguntas simples, objetivas
  FACIL        // Requer pouco pensamento
  MEDIO        // Requer reflexão moderada
  DIFICIL      // Perguntas profundas
  MUITO_DIFICIL // Requer autoconhecimento avançado
}
```

### 3.2 Entidade: RegraAdaptacao

```prisma
model RegraAdaptacao {
  id                String   @id @default(uuid())
  nome              String
  descricao         String
  
  // Condição
  condicaoTipo      TipoCondicao
  condicaoValor     Json     // Estrutura flexível para diferentes tipos
  
  // Ação
  acaoTipo          TipoAcaoAdaptacao
  acaoParametros    Json
  
  // Prioridade
  ordem             Int
  peso              Float    @default(1.0)
  
  // Status
  ativo             Boolean  @default(true)
  criadoEm          DateTime @default(now())
  atualizadoEm      DateTime @updatedAt
}

enum TipoCondicao {
  RESPOSTA_ANTERIOR      // Se resposta X na pergunta Y
  PONTUACAO_MINIMA       // Se pontuação >= N
  PONTUACAO_MAXIMA       // Se pontuação <= N
  TEMPO_RESPOSTA         // Se tempo > N segundos
  HISTORICO_USUARIO      // Baseado em respostas passadas
  PERFIL_USUARIO         // Idade, turma, etc
  MOMENTO_DIA            // Manhã, tarde, noite
  DIA_SEMANA             // Segunda, terça, etc
  FREQUENCIA_USO         // Usuário novo vs. regular
  NIVEL_RISCO            // Alertas anteriores
  STREAK_DIAS            // Sequência de check-ins
  COMBINACAO             // AND/OR de outras condições
}

enum TipoAcaoAdaptacao {
  MOSTRAR_PERGUNTA       // Exibir pergunta específica
  PULAR_PERGUNTA         // Não mostrar pergunta
  ADICIONAR_SECAO        // Adicionar seção de perguntas
  ENCERRAR_QUESTIONARIO  // Finalizar antecipadamente
  SUGERIR_APOIO          // Recomendar conversa com profissional
  AJUSTAR_FREQUENCIA     // Mudar periodicidade
  ENVIAR_NOTIFICACAO     // Enviar lembrete personalizado
  MUDAR_INTENSIDADE      // Perguntas mais/menos profundas
}
```

### 3.3 Entidade: SessaoAdaptativa

```prisma
model SessaoAdaptativa {
  id                  String   @id @default(uuid())
  usuarioId           String
  questionarioId      String
  
  // Estado da sessão
  perguntasExibidas   String[] // IDs das perguntas já mostradas
  perguntasPuladas    String[] // IDs de perguntas que foram puladas
  regrasAplicadas     Json[]   // Histórico de regras aplicadas
  
  // Pontuação parcial
  pontuacaoParcial    Float    @default(0)
  categoriasAvaliadas String[]
  
  // Tempo e progresso
  percentualCompleto  Float    @default(0)
  tempoDecorrido      Int      @default(0) // Segundos
  pausada             Boolean  @default(false)
  pausadaEm           DateTime?
  
  // Contexto
  proximaPergunta     String?  // ID da próxima pergunta a ser exibida
  finalizada          Boolean  @default(false)
  abandonada          Boolean  @default(false)
  motivoAbandonо      String?
  
  // Metadados
  iniciadaEm          DateTime @default(now())
  finalizadaEm        DateTime?
  atualizadoEm        DateTime @updatedAt
  
  @@index([usuarioId, iniciadaEm])
}
```

---

## 4. Avaliações Didáticas

### 4.1 Entidade: AvaliacaoDidatica

```prisma
model AvaliacaoDidatica {
  id                String   @id @default(uuid())
  usuarioId         String
  aulaId            String
  
  // Avaliação geral
  notaGeral         Int      // 1-5 estrelas
  
  // Dimensões didáticas
  clareza           Int      // 1-5
  metodologia       Int      // 1-5
  ritmo             Int      // 1-5
  organizacao       Int      // 1-5
  recursos          Int      // 1-5
  interacao         Int      // 1-5
  
  // Pontos específicos
  pontosPositivos   String[] // Tags: "explicacao_clara", "exemplos_praticos"
  pontosNegativos   String[] // Tags: "muito_rapido", "pouco_tempo"
  
  // Feedback textual
  feedbackPositivo  String?  // Max 500 chars
  feedbackMelhoria  String?  // Max 500 chars
  duvidas           String?  // Dúvidas que ficaram
  
  // Aprendizado
  compreendeuConteudo Boolean
  conseguiuAcompanhar Boolean
  nivelDificuldade    NivelDificuldadeAula
  
  // Contextofísico/técnico
  ambienteAdequado   Boolean?
  recursosDisponiveis Boolean?
  problemasTecnicos  Boolean?
  descricaoProblemas String?
  
  // Tempo e participação
  tempoAvaliacao    Int?     // Segundos para avaliar
  participouAula    Boolean  @default(true)
  percentualPresenca Int?    // 0-100
  
  // Gamificação
  xpGanho           Int      @default(10)
  
  // Status
  anonima           Boolean  @default(false)
  validada          Boolean  @default(true)
  criadoEm          DateTime @default(now())
  atualizadoEm      DateTime @updatedAt
  
  // Relacionamentos
  usuario           Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  aula              Aula     @relation(fields: [aulaId], references: [id], onDelete: Cascade)
  
  @@unique([usuarioId, aulaId]) // Uma avaliação por usuário/aula
  @@index([aulaId, criadoEm])
}

enum NivelDificuldadeAula {
  MUITO_FACIL
  FACIL
  ADEQUADO
  DIFICIL
  MUITO_DIFICIL
}
```

### 4.2 Entidade: AvaliacaoProfessor

```prisma
model AvaliacaoProfessor {
  id                  String   @id @default(uuid())
  usuarioId           String
  professorId         String
  
  // Competências pedagógicas
  domínioConteudo     Int      // 1-5
  clareza Comunicacao Int      // 1-5
  capacidadeMotivacao Int      // 1-5
  relacionamentoAlunos Int     // 1-5
  pontualidade        Int      // 1-5
  disponibilidade     Int      // 1-5
  
  // Aspectos emocionais
  empatia             Int      // 1-5
  paciencia           Int      // 1-5
  respeito            Int      // 1-5
  encorajamento       Int      // 1-5
  
  // Feedback qualitativo
  pontosFortes        String[]
  areasDesenvolvimento String[]
  comentarioGeral     String?  // Max 1000 chars
  
  // Recomendação
  recomendaria        Boolean
  motivoRecomendacao  String?
  
  // Contexto
  disciplinasAvaliadas String[] // Pode avaliar várias disciplinas do mesmo prof
  periodoAvaliacao    String   // "2024.1", "2024.2"
  
  // Status
  anonima             Boolean  @default(true)
  validada            Boolean  @default(true)
  compartilhadaComProfessor Boolean @default(false)
  
  // Metadados
  criadoEm            DateTime @default(now())
  atualizadoEm        DateTime @updatedAt
  
  // Relacionamentos
  usuario             Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  professor           Professor @relation(fields: [professorId], references: [id], onDelete: Cascade)
  
  @@unique([usuarioId, professorId, periodoAvaliacao])
}
```

---

## 5. Sistema de Gamificação

### 5.1 Entidade: Conquista

```prisma
model Conquista {
  id                String   @id @default(uuid())
  
  // Identificação
  codigo            String   @unique // "PRIMEIRA_AVALIACAO"
  titulo            String   // "Primeira Avaliação"
  descricao         String
  
  // Visual
  icone             String   // URL ou nome do ícone
  cor               String   // Hex color
  raridade          Raridade
  
  // Requisitos
  tipo              TipoConquista
  criterios         Json     // Condições para desbloquear
  
  // Recompensas
  xp                Int
  badge             String?  // ID do badge concedido
  
  // Categorização
  categoria         CategoriaConquista
  tags              String[]
  
  // Visibilidade
  secreta           Boolean  @default(false)
  desativada        Boolean  @default(false)
  
  // Estatísticas
  totalDesbloqueios Int      @default(0)
  percentualUsuarios Float   @default(0)
  
  // Metadados
  criadoEm          DateTime @default(now())
  atualizadoEm      DateTime @updatedAt
  
  // Relacionamentos
  usuariosConquistaram UsuarioConquista[]
}

enum Raridade {
  COMUM
  INCOMUM
  RARO
  EPICO
  LENDARIO
}

enum TipoConquista {
  PRIMEIRA_VEZ        // Primeira ação de um tipo
  SEQUENCIA           // Streak de X dias
  QUANTIDADE          // Total de X ações
  QUALIDADE           // Atingir nota/pontuação específica
  FREQUENCIA          // Realizar X vezes por período
  TEMPO               // Manter algo por X dias/meses
  NIVEL               // Atingir nível X
  SOCIAL              // Interações com outros usuários
  ESPECIAL            // Eventos específicos
  COMBO               // Combinação de ações
}

enum CategoriaConquista {
  CHECK_IN
  AVALIACAO
  APRENDIZADO
  PARTICIPACAO
  SOCIALIZACAO
  AUTOCONHECIMENTO
  EVOLUCAO
  ESPECIAL
}
```

### 5.2 Entidade: UsuarioConquista

```prisma
model UsuarioConquista {
  id              String   @id @default(uuid())
  usuarioId       String
  conquistaId     String
  
  // Dados do desbloqueio
  desbloqueadaEm  DateTime @default(now())
  progresso       Float    @default(100) // Percentual
  
  // Visualização
  visualizada     Boolean  @default(false)
  visualizadaEm   DateTime?
  
  // Contexto
  origemDesbloqueio String? // Qual ação desbloqueou
  
  // Relacionamentos
  usuario         Usuario    @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  conquista       Conquista  @relation(fields: [conquistaId], references: [id], onDelete: Cascade)
  
  @@unique([usuarioId, conquistaId])
}
```

### 5.3 Entidade: Badge

```prisma
model Badge {
  id              String   @id @default(uuid())
  
  // Identificação
  codigo          String   @unique
  nome            String
  descricao       String
  
  // Visual
  imagemUrl       String
  corPrimaria     String
  corSecundaria   String?
  animacao        String?  // CSS animation class
  
  // Categorização
  categoria       CategoriaBadge
  nivel           NivelBadge
  raridade        Raridade
  
  // Status
  ativo           Boolean  @default(true)
  criadoEm        DateTime @default(now())
  
  // Relacionamentos
  usuariosBadges  UsuarioBadge[]
}

enum CategoriaBadge {
  INICIANTE
  PARTICIPACAO
  EXCELENCIA
  CONSTANCIA
  EVOLUCAO
  LIDERANCA
  CRIATIVIDADE
  RESILIENCIA
  ESPECIAL
}

enum NivelBadge {
  BRONZE
  PRATA
  OURO
  PLATINA
  DIAMANTE
}
```

### 5.4 Entidade: UsuarioBadge

```prisma
model UsuarioBadge {
  id              String   @id @default(uuid())
  usuarioId       String
  badgeId         String
  
  // Dados da conquista
  conquistadoEm   DateTime @default(now())
  nivel           NivelBadge
  
  // Exibição
  visivel         Boolean  @default(true)
  destacado       Boolean  @default(false)
  ordem           Int?     // Para badges destacados no perfil
  
  // Relacionamentos
  usuario         Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  badge           Badge    @relation(fields: [badgeId], references: [id], onDelete: Cascade)
  
  @@unique([usuarioId, badgeId, nivel])
}
```

### 5.5 Entidade: HistoricoXP

```prisma
model HistoricoXP {
  id              String   @id @default(uuid())
  usuarioId       String
  
  // XP ganho
  quantidade      Int
  origem          OrigemXP
  origemId        String?  // ID da avaliação, check-in, etc
  descricao       String?
  
  // Multiplicadores
  multiplicador   Float    @default(1.0)
  bonus           Int      @default(0)
  
  // Streak
  streakAtivo     Boolean  @default(false)
  diasStreak      Int?
  
  // Nivelamento
  nivelAnterior   Int
  nivelAtual      Int
  subiu Nivel     Boolean  @default(false)
  
  // Metadados
  criadoEm        DateTime @default(now())
  
  // Relacionamentos
  usuario         Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  
  @@index([usuarioId, criadoEm])
}

enum OrigemXP {
  CHECK_IN_DIARIO
  AVALIACAO_AULA
  AVALIACAO_PROFESSOR
  QUESTIONARIO_COMPLETO
  STREAK_BONUS
  CONQUISTA
  PARTICIPACAO_AULA
  FEEDBACK_DETALHADO
  PRIMEIRO_DA_SEMANA
  EVENTO_ESPECIAL
}
```

---

## 6. Aulas e Calendário

### 6.1 Entidade: Aula

```prisma
model Aula {
  id                String   @id @default(uuid())
  
  // Informações básicas
  titulo            String
  descricao         String?
  codigoAula        String?  @unique
  
  // Professor e disciplina
  professorId       String
  disciplina        String
  codigoDisciplina  String?
  
  // Agendamento
  dataHora          DateTime
  duracao           Int      // Em minutos
  sala              String?
  local             String?  // "Prédio A - Sala 201"
  online            Boolean  @default(false)
  linkOnline        String?
  
  // Tipo e categoria
  tipo              TipoAula
  formato           FormatoAula
  
  // Conteúdo
  temaAula          String?
  objetivos         String[]
  materiaisNecessarios String[]
  topicosAbordados  String[]
  
  // Anexos e recursos
  anexos            Json?    // URLs de materiais
  linkExterno       String?
  videoAula         String?  // URL
  apresentacao      String?  // URL do slide
  
  // Participação
  capacidadeMaxima  Int?
  vagas Disponiveis Int?
  inscricaoObrigatoria Boolean @default(false)
  
  // Status e controle
  status            StatusAula @default(AGENDADA)
  cancelada         Boolean  @default(false)
  motivoCancelamento String?
  remarcada         Boolean  @default(false)
  aulaOriginalId    String?  // Se foi remarcada
  
  // Avaliações
  permiteAvaliacao  Boolean  @default(true)
  avaliacaoObrigatoria Boolean @default(false)
  prazoAvaliacao    DateTime? // Até quando pode avaliar
  
  // Métricas calculadas
  mediaNotas        Float?
  totalAvaliacoes   Int      @default(0)
  taxaParticipacao  Float?
  
  // Metadados
  criadoPor         String?
  criadoEm          DateTime @default(now())
  atualizadoEm      DateTime @updatedAt
  
  // Relacionamentos
  professor         Professor @relation(fields: [professorId], references: [id])
  avaliacoes        AvaliacaoDidatica[]
  presencas         Presenca[]
  notificacoes      Notificacao[]
  
  @@index([professorId, dataHora])
  @@index([disciplina, dataHora])
}

enum TipoAula {
  TEORICA
  PRATICA
  LABORATORIO
  SEMINARIO
  WORKSHOP
  PALESTRA
  MONITORIA
  REVISAO
  AVALIACAO
  TRABALHO_GRUPO
}

enum FormatoAula {
  PRESENCIAL
  ONLINE_SINCRONO
  ONLINE_ASSINCRONO
  HIBRIDO
}

enum StatusAula {
  AGENDADA
  EM_ANDAMENTO
  CONCLUIDA
  CANCELADA
  REMARCADA
}
```

### 6.2 Entidade: Presenca

```prisma
model Presenca {
  id              String   @id @default(uuid())
  usuarioId       String
  aulaId          String
  
  // Status de presença
  presente        Boolean
  percentualPresenca Int   // 0-100 (para chegadas atrasadas)
  
  // Horários
  horarioChegada  DateTime?
  horarioSaida    DateTime?
  atrasado        Boolean  @default(false)
  minutosAtraso   Int?
  saiuMaisСedo   Boolean  @default(false)
  
  // Justificativas
  justificado     Boolean  @default(false)
  motivoAusencia  String?
  documentoComprovante String? // URL
  
  // Forma de registro
  registroAutomatico Boolean @default(false)
  registradoPor   String?  // Professor ou sistema
  
  // Participação na aula
  nivelParticipacao Int?   // 1-5
  
  // Metadados
  registradoEm    DateTime @default(now())
  atualizadoEm    DateTime @updatedAt
  
  // Relacionamentos
  usuario         Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  aula            Aula     @relation(fields: [aulaId], references: [id], onDelete: Cascade)
  
  @@unique([usuarioId, aulaId])
}
```

---

## 7. Professores e Disciplinas

### 7.1 Entidade: Professor

```prisma
model Professor {
  id                String   @id @default(uuid())
  
  // Dados pessoais
  nome              String
  nomeCompleto      String?
  email             String   @unique
  telefone          String?
  avatar            String?
  
  // Dados profissionais
  matricula         String?  @unique
  titulacao         Titulacao
  departamento      String?
  areaPrincipal     String?
  especialidades    String[]
  
  // Redes e links
  lattes            String?
  linkedin          String?
  website           String?
  
  // Biografia
  biografia         String?  // Max 2000 chars
  interessesPesquisa String[]
  
  // Disponibilidade
  horarioAtendimento Json?   // Estrutura de horários
  aceitaAgendamento Boolean  @default(true)
  
  // Avaliações
  mediaGeral        Float?
  totalAvaliacoes   Int      @default(0)
  
  // Status
  ativo             Boolean  @default(true)
  disponivelAvaliacao Boolean @default(true)
  
  // Metadados
  criadoEm          DateTime @default(now())
  atualizadoEm      DateTime @updatedAt
  
  // Relacionamentos
  aulas             Aula[]
  avaliacoes        AvaliacaoProfessor[]
  disciplinas       ProfessorDisciplina[]
}

enum Titulacao {
  GRADUACAO
  ESPECIALIZACAO
  MESTRADO
  DOUTORADO
  POS_DOUTORADO
}
```

### 7.2 Entidade: Disciplina

```prisma
model Disciplina {
  id                String   @id @default(uuid())
  
  // Identificação
  codigo            String   @unique
  nome              String
  nomeAbreviado     String?
  
  // Descrição
  ementa            String?
  objetivos         String[]
  conteudoProgramatico Json?
  
  // Carga horária
  cargaHorariaTeorica Int
  cargaHorariasPratica Int?
  totalHoras        Int
  
  // Requisitos
  prerequisitos     String[] // Códigos de disciplinas
  corequisitos      String[]
  
  // Classificação
  departamento      String
  area              String
  nivel             NivelDisciplina
  periodo           Int?     // Período recomendado
  
  // Status
  ativa             Boolean  @default(true)
  obrigatoria       Boolean
  
  // Metadados
  criadoEm          DateTime @default(now())
  atualizadoEm      DateTime @updatedAt
  
  // Relacionamentos
  professores       ProfessorDisciplina[]
}

enum NivelDisciplina {
  BASICO
  INTERMEDIARIO
  AVANCADO
  POS_GRADUACAO
}
```

### 7.3 Entidade: ProfessorDisciplina

```prisma
model ProfessorDisciplina {
  id              String   @id @default(uuid())
  professorId     String
  disciplinaId    String
  
  // Período
  periodoLetivo   String   // "2024.1"
  anoLetivo       Int
  semestre        Int
  
  // Turma
  codigoTurma     String
  horarios        Json     // Estrutura de dias e horários
  
  // Status
  ativo           Boolean  @default(true)
  
  // Metadados
  criadoEm        DateTime @default(now())
  atualizadoEm    DateTime @updatedAt
  
  // Relacionamentos
  professor       Professor @relation(fields: [professorId], references: [id])
  disciplina      Disciplina @relation(fields: [disciplinaId], references: [id])
  
  @@unique([professorId, disciplinaId, periodoLetivo, codigoTurma])
}
```

---

## 8. Relatórios e Analytics

### 8.1 Entidade: RelatorioConsolidado

```prisma
model RelatorioConsolidado {
  id                String   @id @default(uuid())
  
  // Tipo e escopo
  tipoRelatorio     TipoRelatorio
  escopo            EscopoRelatorio
  
  // Referências
  usuarioId         String?  // Para relatórios individuais
  turmaId           String?
  disciplinaId      String?
  professorId       String?
  
  // Período
  periodoInicio     DateTime
  periodoFim        DateTime
  
  // Dados agregados (JSON)
  metricas          Json     // Todas as métricas calculadas
  graficos          Json?    // Dados para gráficos
  insights          Json?    // Insights automáticos
  
  // Alertas e recomendações
  alertas           Json[]
  recomendacoes     String[]
  
  // Status
  geradoEm          DateTime @default(now())
  validoAte         DateTime?
  cache             Boolean  @default(true)
  
  @@index([tipoRelatorio, usuarioId])
  @@index([periodoInicio, periodoFim])
}

enum TipoRelatorio {
  INDIVIDUAL_ALUNO
  INDIVIDUAL_PROFESSOR
  TURMA
  DISCIPLINA
  INSTITUCIONAL
  COMPARATIVO
  TENDENCIAS
  CRITICO         // Situações de risco
}

enum EscopoRelatorio {
  DIARIO
  SEMANAL
  MENSAL
  TRIMESTRAL
  SEMESTRAL
  ANUAL
  PERSONALIZADO
}
```

### 8.2 Entidade: MetricaSocioemocional

```prisma
model MetricaSocioemocional {
  id                String   @id @default(uuid())
  usuarioId         String
  
  // Período de cálculo
  periodoInicio     DateTime
  periodoFim        DateTime
  
  // Métricas de humor
  humorMedio        Float    // 1-5
  desvioHumor       Float
  tendenciaHumor    String   // "MELHORANDO", "ESTAVEL", "PIORANDO"
  
  // Emoções predominantes
  emoçõesPositivas  Json     // Count de cada emoção
  emocõesNegativas  Json
  
  // Energia e bem-estar
  energiаMedia      Float    // 0-10
  qualidadeSonoMedia Float   // 1-5
  
  // Ansiedade e estresse
  nivelAnsiedade    Float    // Calculado
  nivelEstresse     Float
  
  // Circumplex (coordenadas médias)
  valenciaMedia     Float    // -1 a 1
  ativacaoMedia     Float    // -1 a 1
  
  // Padrões temporais
  melhorPeriodoDia  MomentoDia?
  piorPeriodoDia    MomentoDia?
  melhorDiaSemana   String?
  piorDiaSemana     String?
  
  // Frequência e engajamento
  totalCheckIns     Int
  streakMaximo      Int
  diasConsecutivos  Int
  
  // Alertas
  alertasGerados    Int
  niveisRisco       Json     // Distribuição por nível
  
  // Comparação
  posicaoPercentil  Float?   // Comparado com outros alunos
  
  // Metadados
  calculadoEm       DateTime @default(now())
  
  // Relacionamentos
  usuario           Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  
  @@index([usuarioId, periodoFim])
}
```

---

## 9. Notificações e Lembretes

### 9.1 Entidade: Notificacao

```prisma
model Notificacao {
  id              String   @id @default(uuid())
  usuarioId       String
  
  // Conteúdo
  titulo          String
  mensagem        String
  tipo            TipoNotificacao
  prioridade      PrioridadeNotificacao
  
  // Ação
  acao            String?  // "Ver avaliação", "Fazer check-in"
  link            String?  // URL de destino
  linkInterno     Boolean  @default(true)
  
  // Agendamento
  agendadaPara    DateTime?
  enviadaEm       DateTime?
  
  // Status
  lida            Boolean  @default(false)
  lidaEm          DateTime?
  respondida      Boolean  @default(false)
  
  // Canais
  enviارPush       Boolean  @default(false)
  enviarEmail     Boolean  @default(false)
  enviarSMS       Boolean  @default(false)
  
  // Relacionamentos opcionais
  aulaId          String?
  
  // Metadados
  criadoEm        DateTime @default(now())
  expiraEm        DateTime?
  
  // Relacionamentos
  usuario         Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  aula            Aula?    @relation(fields: [aulaId], references: [id], onDelete: SetNull)
  
  @@index([usuarioId, lida, criadoEm])
}

enum TipoNotificacao {
  LEMBRETE_CHECK_IN
  LEMBRETE_AVALIACAO
  CONQUISTA_DESBLOQUEADA
  NIVEL_SUBIU
  STREAK_RISCO
  ALERTA_BEM_ESTAR
  AULA_PROXIMA
  AULA_CANCELADA
  MENSAGEM_PROFESSOR
  MENSAGEM_PSICOLOGO
  ATUALIZACAO_SISTEMA
  DICA_DIA
  FEEDBACK_DISPONIVEL
}

enum PrioridadeNotificacao {
  BAIXA
  MEDIA
  ALTA
  URGENTE
}
```

### 9.2 Entidade: ConfiguracaoNotificacao

```prisma
model ConfiguracaoNotificacao {
  id              String   @id @default(uuid())
  usuarioId       String   @unique
  
  // Preferências gerais
  notificaçõesAtivas Boolean @default(true)
  
  // Por tipo
  checkInDiario   Boolean  @default(true)
  avaliacaoAula   Boolean  @default(true)
  conquistas      Boolean  @default(true)
  alertas         Boolean  @default(true)
  dicas           Boolean  @default(false)
  
  // Horários permitidos
  horarioInicio   String?  // "08:00"
  horarioFim      String?  // "22:00"
  
  // Canais
  push            Boolean  @default(true)
  email           Boolean  @default(true)
  sms             Boolean  @default(false)
  
  // Frequência
  frequenciaLembretes FrequenciaLembrete @default(DIARIO)
  
  // Metadados
  atualizadoEm    DateTime @updatedAt
  
  // Relacionamentos
  usuario         Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
}

enum FrequenciaLembrete {
  NUNCA
  DIARIO
  DIAS_ALTERNADOS
  SEMANAL
  APENAS_FALTA
}
```

---

## 10. Logs e Auditoria

### 10.1 Entidade: LogAtividade

```prisma
model LogAtividade {
  id              String   @id @default(uuid())
  usuarioId       String?
  
  // Ação
  acao            TipoAcao
  entidade        String   // "Usuario", "Aula", "Avaliacao"
  entidadeId      String?
  
  // Detalhes
  descricao       String
  detalhes        Json?    // Dados adicionais
  
  // Resultado
  sucesso         Boolean  @default(true)
  mensagemErro    String?
  
  // Contexto técnico
  ipAddress       String?
  userAgent       String?
  dispositivo     String?
  navegador       String?
  
  // Metadados
  criadoEm        DateTime @default(now())
  
  // Relacionamentos
  usuario         Usuario? @relation(fields: [usuarioId], references: [id], onDelete: SetNull)
  
  @@index([usuarioId, criadoEm])
  @@index([acao, criadoEm])
}

enum TipoAcao {
  LOGIN
  LOGOUT
  CADASTRO
  ATUALIZACAO_PERFIL
  ALTERACAO_SENHA
  CHECK_IN_REALIZADO
  AVALIACAO_REALIZADA
  AVALIACAO_EDITADA
  CONQUISTA_DESBLOQUEADA
  AULA_VISUALIZADA
  RELATORIO_GERADO
  NOTIFICACAO_ENVIADA
  NOTIFICACAO_LIDA
  ERRO_SISTEMA
  TENTATIVA_ACESSO_NEGADO
}
```

### 10.2 Entidade: AuditoriaAlteracao

```prisma
model AuditoriaAlteracao {
  id              String   @id @default(uuid())
  
  // Quem alterou
  usuarioId       String?
  usuarioRole     Role?
  
  // O que foi alterado
  tabela          String
  registroId      String
  campo           String?
  
  // Valores
  valorAnterior   Json?
  valorNovo       Json?
  
  // Tipo de operação
  operacao        TipoOperacao
  
  // Justificativa (para alterações importantes)
  justificativa   String?
  
  // Metadados
  criadoEm        DateTime @default(now())
  
  @@index([tabela, registroId])
  @@index([usuarioId, criadoEm])
}

enum TipoOperacao {
  INSERT
  UPDATE
  DELETE
  SOFT_DELETE
  RESTORE
}
```

---

## 📊 Índices e Performance

### Índices Importantes

```prisma
// Já incluídos nos models acima, mas destacados aqui:

// 1. Buscas frequentes de usuário
@@index([usuarioId, criadoEm])
@@index([usuarioId, atualizadoEm])

// 2. Filtros de período
@@index([criadoEm])
@@index([periodoInicio, periodoFim])

// 3. Relacionamentos principais
@@index([professorId, dataHora])
@@index([aulaId, criadoEm])
@@index([questionarioId, respondidoEm])

// 4. Status e flags
@@index([ativo])
@@index([role])
@@index([tipo, ativo])
```

---

## 🔐 Segurança e Privacidade

### Dados Sensíveis

```typescript
// Campos que exigem criptografia adicional:
- Usuario.senha (bcrypt - já implementado)
- Usuario.cpf (criptografia reversível)
- Usuario.telefone (criptografia reversível)
- Sessao.token (hash)
- Sessao.refreshToken (hash)

// Campos que devem ser anonimizados em relatórios:
- Dados pessoais em avaliações anônimas
- CPF e dados de identificação em exports

// LGPD - Direito ao esquecimento:
- Implementar função de anonimização
- Manter logs de auditoria mesmo após exclusão
- Substituir dados pessoais por "USUARIO_DELETADO_[ID]"
```

---

## 📈 Relatórios e Visualizações Necessários

### 1. Dashboard do Aluno
- Check-ins dos últimos 30 dias
- Evolução emocional (gráfico de linha)
- Avaliações pendentes
- Conquistas recentes
- Streak atual
- XP e progresso de nível

### 2. Relatório Socioemocional Individual
- Mapa circumplex de emoções
- Tendências temporais (dia/semana/mês)
- Comparação com períodos anteriores
- Fatores influenciadores mais frequentes
- Recomendações personalizadas

### 3. Relatório de Turma (Professor/Coordenador)
- Distribuição de humores
- Alertas por nível
- Alunos que precisam atenção
- Comparação entre disciplinas
- Evolução ao longo do semestre

### 4. Analytics Institucional
- Métricas consolidadas
- Comparações entre turmas/períodos
- Identificação de padrões
- Taxa de engajamento
- Efetividade de intervenções

---

## 🚀 Próximos Passos

1. **Validação com Stakeholders**
   - Apresentar modelo para equipe
   - Validar com psicólogos/pedagogos
   - Ajustar baseado em feedback

2. **Implementação Gradual**
   - Fase 1: Core (Usuários, Check-ins, Avaliações básicas)
   - Fase 2: Gamificação e Conquistas
   - Fase 3: Sistema Adaptativo
   - Fase 4: Analytics Avançado

3. **Testes e Validação**
   - Testes de carga
   - Validação de índices
   - Performance de queries
   - Segurança e privacidade

4. **Migração de Dados**
   - Script de migração do modelo atual
   - Validação de integridade
   - Backup completo

---

## 📚 Referências Técnicas

- **Escalas Validadas**: WHO-5, PHQ-9, GAD-7, PANAS
- **Modelo Circumplex**: Russell's Circumplex Model of Affect
- **Gamificação**: Octalysis Framework (Yu-kai Chou)
- **LGPD**: Lei Geral de Proteção de Dados Pessoais
- **Prisma**: Documentação oficial v5.x

---

**Documento mantido por:** Equipe ClassCheck  
**Última atualização:** 16 de outubro de 2025  
**Versão:** 1.0
