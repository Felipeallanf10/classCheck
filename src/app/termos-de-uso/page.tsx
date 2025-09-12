'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, Scale, Shield, AlertTriangle, FileText, Users, Gavel } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageContainer } from '@/components/shared/PageContainer'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { cn } from '@/lib/utils'

// Seções dos termos de uso
const sections = [
  { id: 'aceitacao', title: 'Aceitação dos Termos', icon: FileText },
  { id: 'definicoes', title: 'Definições', icon: Scale },
  { id: 'servicos', title: 'Descrição dos Serviços', icon: Users },
  { id: 'conta', title: 'Criação e Uso da Conta', icon: Shield },
  { id: 'conducta', title: 'Conduta do Usuário', icon: Gavel },
  { id: 'propriedade', title: 'Propriedade Intelectual', icon: FileText },
  { id: 'responsabilidades', title: 'Responsabilidades', icon: AlertTriangle },
  { id: 'limitacoes', title: 'Limitações de Responsabilidade', icon: Scale },
  { id: 'suspensao', title: 'Suspensão e Encerramento', icon: AlertTriangle },
  { id: 'lei-aplicavel', title: 'Lei Aplicável', icon: Gavel },
  { id: 'alteracoes', title: 'Alterações dos Termos', icon: FileText },
  { id: 'contato', title: 'Contato', icon: Users }
]

export default function TermosUsoPage() {
  const [activeSection, setActiveSection] = useState('aceitacao')

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
    <PageContainer maxWidth="full">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: 'Termos de Uso' }]} className="mb-6" />
        
        <PageHeader
          title="Termos de Uso"
          description="Leia com atenção os termos e condições para uso da plataforma ClassCheck. Última atualização: 11 de setembro de 2025."
        />

        {/* Alerta importante */}
        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Ao utilizar o ClassCheck, você concorda integralmente com estes termos. 
            Se não concordar com algum item, não utilize nossos serviços.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Índice lateral */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-base">Índice</CardTitle>
                <CardDescription>Navegue pelas seções</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <nav className="space-y-1 p-3">
                    {sections.map((section) => {
                      const Icon = section.icon
                      return (
                        <Button
                          key={section.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-left h-auto py-2 px-3",
                            activeSection === section.id 
                              ? "bg-primary/10 text-primary border-r-2 border-primary" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => scrollToSection(section.id)}
                        >
                          <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{section.title}</span>
                          <ChevronRight className="ml-auto h-3 w-3 opacity-50" />
                        </Button>
                      )
                    })}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Aceitação dos Termos */}
            <section id="aceitacao" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    1. Aceitação dos Termos
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    Estes Termos de Uso estabelecem as condições gerais de utilização da plataforma 
                    <strong> ClassCheck</strong>, disponibilizada pelos desenvolvedores Felipe Allan 
                    Nascimento Cruz e Nickollas Teixeira Medeiros.
                  </p>
                  <p>
                    Ao acessar ou utilizar qualquer funcionalidade do ClassCheck, você declara ter 
                    lido, compreendido e concordado com todos os termos aqui estabelecidos.
                  </p>
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
                    <h4 className="text-amber-800 dark:text-amber-200 font-semibold mb-2">
                      ⚠️ Condições de Uso
                    </h4>
                    <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
                      <li>• Você deve ter pelo menos 16 anos para usar a plataforma</li>
                      <li>• Se menor de 18 anos, precisa de autorização dos responsáveis</li>
                      <li>• É necessário estar vinculado a uma instituição de ensino</li>
                      <li>• O uso deve ser exclusivamente para fins educacionais</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Definições */}
            <section id="definicoes" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    2. Definições
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Para os efeitos destes Termos, consideram-se as seguintes definições:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">🏛️ Plataforma</h4>
                        <p className="text-sm text-muted-foreground">
                          Sistema web ClassCheck, incluindo todas suas funcionalidades, 
                          páginas, APIs e serviços relacionados.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">👤 Usuário</h4>
                        <p className="text-sm text-muted-foreground">
                          Pessoa física que utiliza a plataforma, seja estudante, 
                          professor ou gestor educacional.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">🏫 Instituição</h4>
                        <p className="text-sm text-muted-foreground">
                          Estabelecimento de ensino (escola, universidade, curso) 
                          que utiliza os serviços da plataforma.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">📊 Conteúdo</h4>
                        <p className="text-sm text-muted-foreground">
                          Qualquer informação, texto, imagem, dados ou material 
                          disponibilizado na plataforma.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">⭐ Avaliação</h4>
                        <p className="text-sm text-muted-foreground">
                          Feedback fornecido por estudantes sobre aulas, professores 
                          ou aspectos educacionais.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">📱 Serviços</h4>
                        <p className="text-sm text-muted-foreground">
                          Todas as funcionalidades oferecidas pela plataforma, 
                          incluindo dashboards, relatórios e ferramentas.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Descrição dos Serviços */}
            <section id="servicos" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    3. Descrição dos Serviços
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">
                    O ClassCheck oferece uma plataforma de feedback educacional com as seguintes funcionalidades:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Funcionalidades Principais</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• <strong>Sistema de Avaliações:</strong> Avaliação anônima de aulas e professores</li>
                        <li>• <strong>Registro de Humor:</strong> Monitoramento do bem-estar durante aulas</li>
                        <li>• <strong>Dashboard Analítico:</strong> Visualização de métricas e tendências</li>
                        <li>• <strong>Relatórios:</strong> Geração de relatórios personalizados</li>
                        <li>• <strong>Calendário:</strong> Organização de aulas e eventos</li>
                        <li>• <strong>Exportação:</strong> Download de dados em PDF/Excel</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Tipos de Usuário</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• <strong>Estudantes:</strong> Avaliam aulas e registram humor</li>
                        <li>• <strong>Professores:</strong> Acessam relatórios de suas aulas</li>
                        <li>• <strong>Gestores:</strong> Visualizam métricas institucionais</li>
                        <li>• <strong>Administradores:</strong> Gerenciam usuários e configurações</li>
                      </ul>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                      🎯 Objetivo Educacional
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Todos os serviços são oferecidos exclusivamente para fins educacionais, 
                      visando melhorar a qualidade do ensino através de feedback construtivo e analytics educacionais.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Conta do Usuário */}
            <section id="conta" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    4. Criação e Uso da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">4.1 Criação da Conta</h4>
                      <p className="text-muted-foreground text-sm mb-3">
                        Para utilizar os serviços, você deve criar uma conta fornecendo informações verdadeiras e atualizadas.
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Forneça informações pessoais verdadeiras e completas</li>
                        <li>• Use um endereço de email válido e acessível</li>
                        <li>• Crie uma senha segura (mínimo 8 caracteres)</li>
                        <li>• Mantenha seus dados sempre atualizados</li>
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">4.2 Responsabilidades da Conta</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-3">
                          <h5 className="font-semibold text-sm mb-2 text-green-600">✅ Você Deve</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Manter suas credenciais em segurança</li>
                            <li>• Usar apenas sua própria conta</li>
                            <li>• Atualizar dados quando necessário</li>
                            <li>• Reportar atividades suspeitas</li>
                          </ul>
                        </div>

                        <div className="border rounded-lg p-3">
                          <h5 className="font-semibold text-sm mb-2 text-red-600">❌ Você Não Deve</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Compartilhar sua senha</li>
                            <li>• Criar múltiplas contas</li>
                            <li>• Usar dados falsos</li>
                            <li>• Vender ou transferir sua conta</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <h4 className="text-red-800 dark:text-red-200 font-semibold mb-2">
                        🚨 Responsabilidade por Atividades
                      </h4>
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        Você é totalmente responsável por todas as atividades realizadas em sua conta. 
                        Qualquer uso não autorizado deve ser imediatamente reportado ao nosso suporte.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Conduta do Usuário */}
            <section id="conducta" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-primary" />
                    5. Conduta do Usuário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">5.1 Conduta Permitida</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Usar a plataforma para fins educacionais legítimos</li>
                        <li>• Fornecer feedback construtivo e respeitoso</li>
                        <li>• Respeitar a privacidade de outros usuários</li>
                        <li>• Reportar problemas técnicos ou de conduta</li>
                        <li>• Colaborar para um ambiente educacional positivo</li>
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">5.2 Conduta Proibida</h4>
                      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200 font-semibold mb-3">
                          É expressamente proibido:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold text-sm mb-2">Conteúdo Inadequado</h5>
                            <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                              <li>• Comentários ofensivos ou discriminatórios</li>
                              <li>• Conteúdo sexual ou pornográfico</li>
                              <li>• Discurso de ódio ou intolerância</li>
                              <li>• Informações falsas ou difamatórias</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-semibold text-sm mb-2">Atividades Maliciosas</h5>
                            <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                              <li>• Tentativas de hacking ou invasão</li>
                              <li>• Uso de bots ou automação</li>
                              <li>• Spam ou mensagens não solicitadas</li>
                              <li>• Violação de direitos autorais</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">5.3 Consequências</h4>
                      <p className="text-muted-foreground text-sm mb-3">
                        O descumprimento destas regras pode resultar em:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 border rounded">
                          <span className="text-yellow-600 font-semibold">⚠️</span>
                          <span className="text-sm">Advertência formal</span>
                        </div>
                        <div className="flex items-center gap-3 p-2 border rounded">
                          <span className="text-orange-600 font-semibold">🔒</span>
                          <span className="text-sm">Suspensão temporária da conta</span>
                        </div>
                        <div className="flex items-center gap-3 p-2 border rounded">
                          <span className="text-red-600 font-semibold">❌</span>
                          <span className="text-sm">Banimento permanente</span>
                        </div>
                        <div className="flex items-center gap-3 p-2 border rounded">
                          <span className="text-purple-600 font-semibold">⚖️</span>
                          <span className="text-sm">Ações legais, quando aplicável</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Propriedade Intelectual */}
            <section id="propriedade" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    6. Propriedade Intelectual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">6.1 Propriedade da Plataforma</h4>
                      <p className="text-muted-foreground text-sm mb-3">
                        A plataforma ClassCheck, incluindo seu código-fonte, design, funcionalidades 
                        e documentação, é propriedade intelectual dos desenvolvedores.
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Todo o código é protegido por direitos autorais</li>
                        <li>• O design e interface são de propriedade exclusiva</li>
                        <li>• Logos e marcas são protegidas</li>
                        <li>• Documentação e materiais de apoio são protegidos</li>
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">6.2 Conteúdo do Usuário</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-3">
                          <h5 className="font-semibold text-sm mb-2">Sua Propriedade</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Seus comentários e avaliações</li>
                            <li>• Informações pessoais fornecidas</li>
                            <li>• Dados de humor registrados</li>
                          </ul>
                        </div>

                        <div className="border rounded-lg p-3">
                          <h5 className="font-semibold text-sm mb-2">Licença para Uso</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Permissão para exibir na plataforma</li>
                            <li>• Uso para geração de relatórios</li>
                            <li>• Análises agregadas e anônimas</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                        🔓 Código Aberto
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Partes da plataforma podem ser disponibilizadas como código aberto no GitHub, 
                        sujeitas às licenças específicas de cada repositório.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Responsabilidades */}
            <section id="responsabilidades" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    7. Responsabilidades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">7.1 Responsabilidades do ClassCheck</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Manter a plataforma funcionando adequadamente</li>
                        <li>• Proteger dados pessoais conforme LGPD</li>
                        <li>• Fornecer suporte técnico básico</li>
                        <li>• Notificar sobre manutenções programadas</li>
                        <li>• Implementar medidas de segurança adequadas</li>
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">7.2 Responsabilidades do Usuário</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Usar a plataforma de forma responsável</li>
                        <li>• Manter suas informações atualizadas</li>
                        <li>• Proteger suas credenciais de acesso</li>
                        <li>• Respeitar outros usuários e instituições</li>
                        <li>• Reportar problemas ou violações</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/20 border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Disponibilidade do Serviço</h4>
                      <p className="text-sm text-muted-foreground">
                        Embora nos esforcemos para manter a plataforma disponível 24/7, 
                        podem ocorrer interrupções para manutenção, atualizações ou 
                        por fatores técnicos externos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Limitações de Responsabilidade */}
            <section id="limitacoes" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    8. Limitações de Responsabilidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <h4 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                        ⚠️ Isenção de Responsabilidade
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
                        A plataforma é fornecida "como está", sem garantias expressas ou implícitas.
                      </p>
                      <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
                        <li>• Não garantimos funcionamento ininterrupto</li>
                        <li>• Não nos responsabilizamos por danos indiretos</li>
                        <li>• Limitamos nossa responsabilidade ao máximo permitido por lei</li>
                        <li>• Usuários assumem riscos do uso da tecnologia</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Situações Não Cobertas</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-sm mb-2">Problemas Técnicos</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Falhas de internet do usuário</li>
                            <li>• Incompatibilidade de navegador</li>
                            <li>• Perda de dados por falha local</li>
                            <li>• Vírus ou malware</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-sm mb-2">Uso Inadequado</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Decisões baseadas em dados da plataforma</li>
                            <li>• Conflitos entre usuários</li>
                            <li>• Consequências de avaliações</li>
                            <li>• Interpretação de relatórios</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Suspensão e Encerramento */}
            <section id="suspensao" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    9. Suspensão e Encerramento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">9.1 Suspensão de Conta</h4>
                      <p className="text-muted-foreground text-sm mb-3">
                        Podemos suspender temporariamente sua conta nas seguintes situações:
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Violação dos termos de uso</li>
                        <li>• Atividade suspeita ou não autorizada</li>
                        <li>• Solicitação de investigação</li>
                        <li>• Não pagamento (se aplicável)</li>
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">9.2 Encerramento da Conta</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-3">
                          <h5 className="font-semibold text-sm mb-2">Por Você</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• A qualquer momento, sem justificativa</li>
                            <li>• Através das configurações da conta</li>
                            <li>• Ou por solicitação ao suporte</li>
                          </ul>
                        </div>

                        <div className="border rounded-lg p-3">
                          <h5 className="font-semibold text-sm mb-2">Por Nós</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Violações graves ou repetidas</li>
                            <li>• Atividades ilegais</li>
                            <li>• Decisão de descontinuar o serviço</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <h4 className="text-red-800 dark:text-red-200 font-semibold mb-2">
                        🗑️ Exclusão de Dados
                      </h4>
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        Após o encerramento da conta, seus dados serão excluídos conforme nossa 
                        <a href="/politica-de-privacidade" className="underline hover:no-underline"> Política de Privacidade</a>. 
                        Dados agregados podem ser mantidos para fins estatísticos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Lei Aplicável */}
            <section id="lei-aplicavel" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-primary" />
                    10. Lei Aplicável e Jurisdição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, 
                      em especial:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2">📜 Legislação Aplicável</h5>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Código Civil Brasileiro</li>
                          <li>• Código de Defesa do Consumidor</li>
                          <li>• LGPD (Lei 13.709/2018)</li>
                          <li>• Marco Civil da Internet</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2">⚖️ Resolução de Conflitos</h5>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Preferência por acordo amigável</li>
                          <li>• Mediação quando possível</li>
                          <li>• Foro da comarca do usuário (CDC)</li>
                          <li>• Arbitragem quando acordado</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                        🤝 Solução Amigável
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Antes de qualquer ação legal, encorajamos o contato direto conosco para 
                        tentativa de resolução amigável através do nosso suporte.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Alterações dos Termos */}
            <section id="alteracoes" className="scroll-mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    11. Alterações dos Termos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Reservamos o direito de modificar estes Termos de Uso a qualquer momento, 
                      sempre que necessário para:
                    </p>

                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Adequação a novas funcionalidades</li>
                      <li>• Conformidade com mudanças legais</li>
                      <li>• Melhoria da clareza e compreensão</li>
                      <li>• Proteção dos usuários e da plataforma</li>
                    </ul>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2">📢 Como Você Será Notificado</h5>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Email para todos os usuários ativos</li>
                          <li>• Banner na plataforma por 30 dias</li>
                          <li>• Notificação no próximo login</li>
                          <li>• Atualização da data nesta página</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-3">
                        <h5 className="font-semibold text-sm mb-2">⏰ Prazos de Vigência</h5>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Alterações menores: imediatas</li>
                          <li>• Alterações significativas: 30 dias</li>
                          <li>• Mudanças que afetam direitos: 60 dias</li>
                          <li>• Adequações legais: conforme exigido</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <h4 className="text-amber-800 dark:text-amber-200 font-semibold mb-2">
                        ✋ Direito de Recusa
                      </h4>
                      <p className="text-amber-700 dark:text-amber-300 text-sm">
                        Se não concordar com as alterações, você pode encerrar sua conta a qualquer momento. 
                        O uso continuado após as mudanças constitui aceitação dos novos termos.
                      </p>
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
                    <Users className="h-5 w-5 text-primary" />
                    12. Contato
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Para dúvidas sobre estes Termos de Uso ou questões relacionadas ao uso da plataforma, 
                      entre em contato conosco:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Informações de Contato</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Projeto:</strong> ClassCheck<br />
                            <strong>Desenvolvedores:</strong> Felipe Allan & Nickollas Teixeira
                          </div>
                          <div>
                            <strong>Email Jurídico:</strong><br />
                            <a href="mailto:legal@classcheck.com" className="text-primary hover:underline">
                              legal@classcheck.com
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
                              <Users className="mr-2 h-4 w-4" />
                              Central de Ajuda
                            </a>
                          </Button>

                          <Button variant="outline" asChild className="w-full justify-start">
                            <a href="/politica-de-privacidade">
                              <Shield className="mr-2 h-4 w-4" />
                              Política de Privacidade
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        <strong>Versão 2.0</strong> • Última atualização: 11 de setembro de 2025<br />
                        Próxima revisão programada: dezembro de 2025
                      </p>
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
