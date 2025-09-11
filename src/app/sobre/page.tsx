'use client'

import { Target, Eye, Heart, Github, Linkedin, Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageContainer } from '@/components/shared/PageContainer'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { InstitutionalNav } from '@/components/shared/InstitutionalNav'

export default function SobrePage() {
  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Sobre' }]} className="mb-6" />
      
      <PageHeader
        title="Sobre o ClassCheck"
        description="Conheça nossa missão, visão e a equipe por trás da plataforma que está transformando a educação através de feedback inteligente."
      />

      {/* Seção principal sobre o projeto */}
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">O que é o ClassCheck?</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              O ClassCheck é uma plataforma inovadora de feedback educacional que permite aos estudantes 
              avaliarem suas aulas e registrarem seu humor diário, criando um ambiente de aprendizado 
              mais conectado e responsivo.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Avaliações Realizadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Professores Cadastrados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">15</div>
                <div className="text-sm text-muted-foreground">Instituições Parceiras</div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Nossa plataforma vai além da simples avaliação de aulas. Integramos dados de humor, 
              feedback qualitativo e métricas de engajamento para fornecer insights valiosos que 
              ajudam professores e gestores educacionais a criar experiências de aprendizado mais 
              eficazes e empáticas.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Missão, Visão e Valores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Missão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Democratizar o feedback educacional através de tecnologia acessível, 
              promovendo um ambiente de aprendizado mais colaborativo e centrado no estudante.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Visão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Ser a principal plataforma de feedback educacional do Brasil, 
              conectando estudantes, professores e gestores em um ecossistema de melhoria contínua.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Valores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>• <strong>Transparência:</strong> Feedback honesto e construtivo</li>
              <li>• <strong>Inclusão:</strong> Plataforma acessível para todos</li>
              <li>• <strong>Inovação:</strong> Uso inteligente da tecnologia</li>
              <li>• <strong>Privacidade:</strong> Proteção rigorosa dos dados</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Funcionalidades principais */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Principais Funcionalidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Dashboard Analítico</CardTitle>
              <CardDescription>
                Visualize métricas de humor, avaliações e engajamento em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gráficos interativos de humor</li>
                <li>• Relatórios de performance</li>
                <li>• Métricas de participação</li>
                <li>• Exportação em PDF/Excel</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⭐ Sistema de Avaliações</CardTitle>
              <CardDescription>
                Avalie aulas e professores de forma anônima e construtiva
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Avaliação por estrelas (1-5)</li>
                <li>• Comentários opcionais</li>
                <li>• Registro de humor diário</li>
                <li>• Histórico completo</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>😊 Monitoramento de Humor</CardTitle>
              <CardDescription>
                Acompanhe o bem-estar emocional durante as aulas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 5 estados emocionais</li>
                <li>• Tendências semanais/mensais</li>
                <li>• Heatmap de humor</li>
                <li>• Insights automáticos</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📅 Calendário Integrado</CardTitle>
              <CardDescription>
                Organize aulas, eventos e mantenha-se atualizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Visualização mensal/semanal</li>
                <li>• Lembretes automáticos</li>
                <li>• Sincronização de horários</li>
                <li>• Eventos personalizados</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Seção da equipe */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Nossa Equipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Felipe */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  F
                </div>
                <h3 className="text-xl font-semibold mb-2">Felipe Allan Nascimento Cruz</h3>
                <p className="text-muted-foreground mb-4">Full Stack Developer & Tech Lead</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">PostgreSQL</Badge>
                  <Badge variant="secondary">Docker</Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Responsável pela arquitetura do sistema, desenvolvimento backend, 
                  APIs REST, integração de banco de dados e infraestrutura Docker. 
                  Especialista em desenvolvimento full-stack com foco em performance e escalabilidade.
                </p>

                <div className="flex gap-3">
                  <a 
                    href="https://github.com/Felipeallanf10" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                  <a 
                    href="mailto:felipe@classcheck.com"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nickollas */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  N
                </div>
                <h3 className="text-xl font-semibold mb-2">Nickollas Teixeira Medeiros</h3>
                <p className="text-muted-foreground mb-4">Frontend Developer & UI/UX Designer</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary">Figma</Badge>
                  <Badge variant="secondary">shadcn/ui</Badge>
                  <Badge variant="secondary">Responsive Design</Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Especialista em design de interfaces e experiência do usuário. 
                  Responsável pelo Design System, componentes reutilizáveis, 
                  responsividade mobile e garantia de acessibilidade WCAG 2.1.
                </p>

                <div className="flex gap-3">
                  <a 
                    href="https://linkedin.com/in/nickollas-medeiros" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                  <a 
                    href="mailto:nickollas@classcheck.com"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stack tecnológico */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Tecnologias Utilizadas</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Frontend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Next.js 15</Badge>
                    <span className="text-sm text-muted-foreground">Framework React</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">TypeScript</Badge>
                    <span className="text-sm text-muted-foreground">Tipagem estática</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Tailwind CSS</Badge>
                    <span className="text-sm text-muted-foreground">Styling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">shadcn/ui</Badge>
                    <span className="text-sm text-muted-foreground">Componentes</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Backend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Node.js</Badge>
                    <span className="text-sm text-muted-foreground">Runtime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Prisma ORM</Badge>
                    <span className="text-sm text-muted-foreground">Banco de dados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">PostgreSQL</Badge>
                    <span className="text-sm text-muted-foreground">Database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Zod</Badge>
                    <span className="text-sm text-muted-foreground">Validação</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">DevOps</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Docker</Badge>
                    <span className="text-sm text-muted-foreground">Containerização</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Git</Badge>
                    <span className="text-sm text-muted-foreground">Versionamento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">ESLint</Badge>
                    <span className="text-sm text-muted-foreground">Code quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Vercel</Badge>
                    <span className="text-sm text-muted-foreground">Deploy</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to action */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-2">Interessado em nosso projeto?</h3>
          <p className="text-muted-foreground mb-4">
            Entre em contato conosco para saber mais sobre o ClassCheck ou para implementar em sua instituição.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="/contato"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Entre em Contato
            </a>
            <a 
              href="https://github.com/Felipeallanf10/classCheck" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <Github className="mr-2 h-4 w-4" />
              Ver no GitHub
            </a>
          </div>
        </CardContent>
      </Card>

      <InstitutionalNav />
    </PageContainer>
  )
}
