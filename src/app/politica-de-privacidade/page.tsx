'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, Shield, Database, User, FileText, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageContainer } from '@/components/shared/PageContainer'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { cn } from '@/lib/utils'

// Seções da política de privacidade
const sections = [
  { id: 'introducao', title: 'Introdução', icon: FileText },
  { id: 'dados-coletados', title: 'Dados Coletados', icon: Database },
  { id: 'uso-dados', title: 'Como Usamos os Dados', icon: User },
  { id: 'compartilhamento', title: 'Compartilhamento de Dados', icon: ExternalLink },
  { id: 'seguranca', title: 'Segurança dos Dados', icon: Shield },
  { id: 'direitos', title: 'Seus Direitos', icon: User },
  { id: 'cookies', title: 'Cookies e Tecnologias', icon: Database },
  { id: 'alteracoes', title: 'Alterações na Política', icon: FileText },
  { id: 'contato', title: 'Contato', icon: ExternalLink }
]

export default function PoliticaPrivacidadePage() {
  const [activeSection, setActiveSection] = useState('introducao')

  // Auto-scroll para seção ativa
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    )

    sections.forEach(section => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <PageContainer maxWidth="full" className="px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb items={[{ label: 'Política de Privacidade' }]} className="mb-4 md:mb-6" />
        
        <PageHeader
          title="Política de Privacidade"
          description="Saiba como coletamos, usamos e protegemos seus dados pessoais no ClassCheck. Última atualização: 11 de setembro de 2025."
        />

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
          {/* Índice lateral compacto - Hidden on mobile, show as dropdown on small screens */}
          <div className="order-2 lg:order-1 lg:w-72 lg:flex-shrink-0">
            <Card className="lg:sticky lg:top-6">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-sm md:text-base">Índice</CardTitle>
                <CardDescription className="text-xs hidden sm:block">Navegue pelas seções</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[250px] sm:h-[300px] lg:h-[350px]">
                  <nav className="space-y-0.5 sm:space-y-1 p-2 sm:p-3">
                    {sections.map((section) => {
                      const Icon = section.icon
                      return (
                        <Button
                          key={section.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-left h-auto py-1 sm:py-1.5 px-1.5 sm:px-2 text-xs sm:text-sm lg:text-xs",
                            activeSection === section.id 
                              ? "bg-primary/10 text-primary border-r-2 border-primary" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => scrollToSection(section.id)}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2 w-full min-w-0">
                            <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                            <span className="flex-1 break-words leading-tight">{section.title}</span>
                            <ChevronRight className="h-2 w-2 sm:h-2.5 sm:w-2.5 opacity-50 flex-shrink-0" />
                          </div>
                        </Button>
                      )
                    })}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

        {/* Conteúdo principal */}
        <div className="order-1 lg:order-2 flex-1 space-y-4 md:space-y-6 lg:space-y-8">
            
            {/* Introdução */}
            <section id="introducao" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    1. Introdução
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    Esta Política de Privacidade descreve como o <strong>ClassCheck</strong> coleta, 
                    usa, armazena e protege suas informações pessoais quando você utiliza nossos serviços.
                  </p>
                  <p>
                    Ao utilizar o ClassCheck, você concorda com os termos desta política. 
                    Recomendamos que leia este documento cuidadosamente para entender nossas práticas 
                    em relação aos seus dados pessoais.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                    <h4 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                      📋 Informações Importantes
                    </h4>
                    <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                      <li>• Esta política está em conformidade com a LGPD (Lei 13.709/2018)</li>
                      <li>• Seus dados são utilizados apenas para melhorar sua experiência educacional</li>
                      <li>• Você tem total controle sobre seus dados pessoais</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Dados Coletados */}
            <section id="dados-coletados" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    2. Dados Coletados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">2.1 Dados Fornecidos por Você</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• <strong>Informações de conta:</strong> nome, email, senha (criptografada)</li>
                        <li>• <strong>Perfil acadêmico:</strong> curso, período, instituição de ensino</li>
                        <li>• <strong>Avaliações:</strong> notas atribuídas às aulas, comentários opcionais</li>
                        <li>• <strong>Registro de humor:</strong> estado emocional durante as aulas</li>
                        <li>• <strong>Comunicação:</strong> mensagens enviadas através do formulário de contato</li>
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">2.2 Dados Coletados Automaticamente</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• <strong>Logs de uso:</strong> páginas visitadas, tempo de sessão, cliques</li>
                        <li>• <strong>Informações técnicas:</strong> endereço IP, navegador, sistema operacional</li>
                        <li>• <strong>Cookies:</strong> preferências de tema, sessão ativa, configurações</li>
                        <li>• <strong>Analytics:</strong> estatísticas agregadas de uso da plataforma</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <h4 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                        ⚠️ Dados que NÃO Coletamos
                      </h4>
                      <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
                        <li>• Documentos pessoais (CPF, RG, passaporte)</li>
                        <li>• Informações financeiras (cartão de crédito, conta bancária)</li>
                        <li>• Dados de localização em tempo real</li>
                        <li>• Conversas privadas ou mensagens diretas</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Como Usamos os Dados */}
            <section id="uso-dados" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    3. Como Usamos os Dados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Funcionalidades do Sistema</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Autenticar e manter sua sessão</li>
                        <li>• Exibir relatórios personalizados</li>
                        <li>• Gerar gráficos de humor e avaliações</li>
                        <li>• Enviar notificações relevantes</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Melhorias e Analytics</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Identificar funcionalidades mais usadas</li>
                        <li>• Otimizar performance da plataforma</li>
                        <li>• Detectar e corrigir bugs</li>
                        <li>• Desenvolver novas funcionalidades</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Comunicação</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Responder suas dúvidas de suporte</li>
                        <li>• Enviar atualizações importantes</li>
                        <li>• Notificar sobre manutenções</li>
                        <li>• Informar sobre novas funcionalidades</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Compliance</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Cumprir obrigações legais</li>
                        <li>• Prevenir fraudes e abusos</li>
                        <li>• Manter logs de auditoria</li>
                        <li>• Atender solicitações das autoridades</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Compartilhamento de Dados */}
            <section id="compartilhamento" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    4. Compartilhamento de Dados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h4 className="text-green-800 dark:text-green-200 font-semibold mb-2">
                        ✅ Princípio Fundamental
                      </h4>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Nós <strong>NÃO vendemos, alugamos ou compartilhamos</strong> seus dados pessoais 
                        com terceiros para fins comerciais ou publicitários.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">4.1 Compartilhamento Permitido</h4>
                      <p className="text-muted-foreground mb-3 text-sm">
                        Seus dados podem ser compartilhados apenas nas seguintes situações:
                      </p>
                      <ul className="space-y-2 text-muted-foreground text-sm">
                        <li>• <strong>Professores:</strong> estatísticas agregadas e anônimas de suas aulas</li>
                        <li>• <strong>Gestores educacionais:</strong> relatórios institucionais sem identificação individual</li>
                        <li>• <strong>Prestadores de serviço:</strong> provedores de hosting e analytics (sob contrato de confidencialidade)</li>
                        <li>• <strong>Autoridades:</strong> quando exigido por lei ou ordem judicial</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">4.2 Anonimização de Dados</h4>
                      <p className="text-muted-foreground text-sm">
                        Quando compartilhamos dados para fins educacionais, eles são sempre agregados 
                        e anonimizados, garantindo que sua identidade não seja revelada.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Segurança */}
            <section id="seguranca" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    5. Segurança dos Dados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Medidas Técnicas</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• <strong>Criptografia:</strong> HTTPS/TLS 1.3 em todas as comunicações</li>
                        <li>• <strong>Senhas:</strong> hash seguro com bcrypt</li>
                        <li>• <strong>Banco de dados:</strong> criptografia em repouso</li>
                        <li>• <strong>Backups:</strong> automatizados e criptografados</li>
                        <li>• <strong>Logs:</strong> monitoramento 24/7 de acessos</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Medidas Organizacionais</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• <strong>Acesso restrito:</strong> apenas desenvolvedores autorizados</li>
                        <li>• <strong>Treinamento:</strong> equipe treinada em segurança</li>
                        <li>• <strong>Auditorias:</strong> revisões periódicas de segurança</li>
                        <li>• <strong>Incidentes:</strong> plano de resposta estruturado</li>
                        <li>• <strong>Atualizações:</strong> patches de segurança regulares</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                      🔒 Suas Responsabilidades
                    </h4>
                    <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                      <li>• Use uma senha forte e única para sua conta</li>
                      <li>• Não compartilhe suas credenciais de acesso</li>
                      <li>• Faça logout em computadores públicos</li>
                      <li>• Mantenha seu email de recuperação atualizado</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Seus Direitos */}
            <section id="direitos" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    6. Seus Direitos (LGPD)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Conforme a Lei Geral de Proteção de Dados (LGPD), você possui os seguintes direitos:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2">📋 Acesso aos Dados</h5>
                        <p className="text-xs text-muted-foreground">
                          Solicitar uma cópia de todos os dados que temos sobre você
                        </p>
                      </div>

                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2">✏️ Correção</h5>
                        <p className="text-xs text-muted-foreground">
                          Corrigir dados incorretos ou desatualizados
                        </p>
                      </div>

                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2">🗑️ Exclusão</h5>
                        <p className="text-xs text-muted-foreground">
                          Solicitar a remoção completa de seus dados
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2">📦 Portabilidade</h5>
                        <p className="text-xs text-muted-foreground">
                          Receber seus dados em formato estruturado
                        </p>
                      </div>

                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2">⏸️ Limitação</h5>
                        <p className="text-xs text-muted-foreground">
                          Restringir o processamento de seus dados
                        </p>
                      </div>

                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2">❌ Oposição</h5>
                        <p className="text-xs text-muted-foreground">
                          Se opor ao tratamento de dados em certas situações
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Como Exercer seus Direitos</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Para exercer qualquer um desses direitos, entre em contato conosco através de:
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Email:</strong> privacidade@classcheck.com</li>
                      <li>• <strong>Formulário:</strong> <a href="/contato" className="text-primary hover:underline">Página de Contato</a></li>
                      <li>• <strong>Prazo de resposta:</strong> até 15 dias úteis</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Cookies */}
            <section id="cookies" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    7. Cookies e Tecnologias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Utilizamos cookies e tecnologias similares para melhorar sua experiência. 
                      Aqui está o que você precisa saber:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2 text-green-600">🔧 Essenciais</h5>
                        <p className="text-xs text-muted-foreground mb-2">
                          Necessários para o funcionamento básico
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Autenticação</li>
                          <li>• Sessão ativa</li>
                          <li>• Preferências de tema</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2 text-blue-600">📊 Analytics</h5>
                        <p className="text-xs text-muted-foreground mb-2">
                          Nos ajudam a entender o uso
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Páginas visitadas</li>
                          <li>• Tempo de sessão</li>
                          <li>• Funcionalidades usadas</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2 text-purple-600">⚙️ Funcionais</h5>
                        <p className="text-xs text-muted-foreground mb-2">
                          Melhoram sua experiência
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Configurações salvas</li>
                          <li>• Filtros aplicados</li>
                          <li>• Layout preferido</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <h4 className="text-amber-800 dark:text-amber-200 font-semibold mb-2">
                        🍪 Controle de Cookies
                      </h4>
                      <p className="text-amber-700 dark:text-amber-300 text-sm">
                        Você pode gerenciar cookies através das configurações do seu navegador. 
                        Note que desabilitar cookies essenciais pode afetar o funcionamento da plataforma.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Alterações */}
            <section id="alteracoes" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    8. Alterações na Política
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Esta Política de Privacidade pode ser atualizada periodicamente para refletir 
                      mudanças em nossas práticas ou por requisitos legais.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Como você será notificado:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Email para todos os usuários ativos</li>
                          <li>• Banner no sistema por 30 dias</li>
                          <li>• Notificação no próximo login</li>
                          <li>• Atualização da data no topo desta página</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Tipos de alterações:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• <strong>Menores:</strong> correções e esclarecimentos</li>
                          <li>• <strong>Significativas:</strong> mudanças de uso dos dados</li>
                          <li>• <strong>Legais:</strong> adequação a novas regulamentações</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                        📅 Histórico de Versões
                      </h4>
                      <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                        <li>• <strong>v2.0</strong> - 11/09/2025: Adequação completa à LGPD</li>
                        <li>• <strong>v1.5</strong> - 01/08/2025: Adição de seção sobre cookies</li>
                        <li>• <strong>v1.0</strong> - 15/07/2025: Versão inicial</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Contato */}
            <section id="contato" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    9. Contato
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer 
                      seus direitos de proteção de dados, entre em contato conosco:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Dados para Contato</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Controlador de Dados:</strong><br />
                            ClassCheck - Sistema Educacional
                          </div>
                          <div>
                            <strong>Email de Privacidade:</strong><br />
                            <a href="mailto:privacidade@classcheck.com" className="text-primary hover:underline">
                              privacidade@classcheck.com
                            </a>
                          </div>
                          <div>
                            <strong>Suporte Geral:</strong><br />
                            <a href="mailto:suporte@classcheck.com" className="text-primary hover:underline">
                              suporte@classcheck.com
                            </a>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Canais de Atendimento</h4>
                        <div className="space-y-3">
                          <Button asChild className="w-full justify-start">
                            <a href="/contato">
                              <FileText className="mr-2 h-4 w-4" />
                              Formulário de Contato
                            </a>
                          </Button>
                          
                          <Button variant="outline" asChild className="w-full justify-start">
                            <a href="/ajuda">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Central de Ajuda
                            </a>
                          </Button>
                        </div>

                        <div className="mt-4 text-xs text-muted-foreground">
                          <strong>Tempo de resposta:</strong><br />
                          Solicitações de privacidade: até 15 dias úteis<br />
                          Dúvidas gerais: até 48 horas
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

          </div>
        </div>
      </div>
    </PageContainer>
  )
}
