import { Mail, MessageCircle, Clock, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageContainer } from '@/components/shared/PageContainer'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { ContatoForm } from '@/components/contato/ContatoForm'

export default function ContatoPage() {
  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Contato' }]} className="mb-6" />
      
      <PageHeader
        title="Entre em Contato"
        description="Estamos aqui para ajudar! Entre em contato conosco através do formulário abaixo ou pelos nossos canais de atendimento."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de contato */}
        <div className="lg:col-span-2">
          <ContatoForm />
        </div>

        {/* Informações de contato */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Fale Conosco
              </CardTitle>
              <CardDescription>
                Outras formas de entrar em contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">suporte@classcheck.com</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Horário de Atendimento</p>
                  <p className="text-sm text-muted-foreground">
                    Segunda a Sexta: 8h às 18h<br />
                    Sábado: 9h às 14h
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Localização</p>
                  <p className="text-sm text-muted-foreground">
                    Brasil - Atendimento Online
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tempo de Resposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Dúvidas Gerais</span>
                  <span className="text-sm text-muted-foreground">24h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Problemas Técnicos</span>
                  <span className="text-sm text-muted-foreground">12h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Bugs Críticos</span>
                  <span className="text-sm text-muted-foreground">4h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Precisa de Ajuda Rápida?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Confira nossa central de ajuda com perguntas frequentes e tutoriais.
              </p>
              <a 
                href="/ajuda"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              >
                Acessar Central de Ajuda
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Seção de FAQ rápido */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Perguntas Frequentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Como reportar um problema técnico?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use o formulário ao lado selecionando "Problema técnico" como assunto. 
                Inclua detalhes como navegador, sistema operacional e passos para reproduzir o problema.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Posso sugerir novas funcionalidades?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Claro! Adoramos feedback dos usuários. Use o assunto "Sugestão de melhoria" 
                e descreva sua ideia detalhadamente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Meus dados estão seguros?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sim! Seguimos rigorosamente a LGPD e utilizamos as melhores práticas de segurança. 
                Confira nossa{' '}
                <a href="/politica-de-privacidade" className="text-primary hover:underline">
                  Política de Privacidade
                </a>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Como alterar minha senha?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Acesse "Configurações" no menu lateral, vá em "Segurança" e clique em "Alterar Senha". 
                Você precisará confirmar sua senha atual.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
