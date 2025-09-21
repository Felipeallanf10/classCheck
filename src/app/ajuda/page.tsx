'use client'

import { useState, useMemo } from 'react'
import { Search, HelpCircle, Users, FileText, Shield, Book } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageContainer } from '@/components/shared/PageContainer'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { FAQItem } from '@/components/faq/FAQItem'

// Dados das perguntas frequentes
const faqData = [
  // Categoria: Conta
  {
    categoria: 'Conta',
    icon: Users,
    perguntas: [
      {
        pergunta: 'Como criar uma conta no ClassCheck?',
        resposta: 'Para criar uma conta, clique em "Cadastrar" na página inicial, preencha seus dados (nome, email, senha) e confirme seu email. Após a verificação, você poderá fazer login normalmente.'
      },
      {
        pergunta: 'Esqueci minha senha, como recuperar?',
        resposta: 'Na página de login, clique em "Esqueci minha senha", digite seu email cadastrado e você receberá um link para redefinir sua senha. O link é válido por 24 horas.'
      },
      {
        pergunta: 'Como alterar meus dados pessoais?',
        resposta: 'Acesse "Configurações" no menu lateral, clique em "Perfil" e edite as informações desejadas. Lembre-se de salvar as alterações ao final.'
      }
    ]
  },
  // Categoria: Avaliações
  {
    categoria: 'Avaliações',
    icon: FileText,
    perguntas: [
      {
        pergunta: 'Como avaliar uma aula?',
        resposta: 'Vá até a página "Aulas", encontre a aula desejada e clique no botão "Avaliar". Escolha sua nota (1-5 estrelas), registre seu humor do dia e deixe um comentário opcional.'
      },
      {
        pergunta: 'Posso alterar uma avaliação já enviada?',
        resposta: 'Sim! Você pode editar suas avaliações por até 7 dias após o envio. Acesse "Minhas Avaliações" e clique no ícone de edição ao lado da avaliação desejada.'
      },
      {
        pergunta: 'As avaliações são anônimas?',
        resposta: 'Sim, todas as avaliações são anônimas para os professores. Apenas administradores do sistema podem vincular avaliações aos estudantes, e isso apenas para fins de moderação.'
      },
      {
        pergunta: 'Qual a diferença entre nota da aula e registro de humor?',
        resposta: 'A nota da aula (1-5 estrelas) avalia especificamente o conteúdo e qualidade da aula. O registro de humor avalia como você se sentiu durante a aula, independentemente da qualidade do conteúdo.'
      }
    ]
  },
  // Categoria: Relatórios
  {
    categoria: 'Relatórios',
    icon: Book,
    perguntas: [
      {
        pergunta: 'Como acessar meus relatórios pessoais?',
        resposta: 'No menu lateral, clique em "Relatórios". Você pode visualizar gráficos do seu humor ao longo do tempo, histórico de avaliações e estatísticas de participação.'
      },
      {
        pergunta: 'Posso exportar meus dados?',
        resposta: 'Sim! Nas páginas de relatórios, há um botão "Exportar" que permite baixar seus dados em formato PDF ou Excel, respeitando todas as normas de privacidade.'
      },
      {
        pergunta: 'Com que frequência os relatórios são atualizados?',
        resposta: 'Os relatórios são atualizados em tempo real. Sempre que você faz uma nova avaliação ou registra seu humor, os gráficos e estatísticas são imediatamente atualizados.'
      }
    ]
  },
  // Categoria: Segurança
  {
    categoria: 'Segurança',
    icon: Shield,
    perguntas: [
      {
        pergunta: 'Meus dados estão seguros?',
        resposta: 'Sim! Utilizamos criptografia de ponta a ponta, seus dados são armazenados em servidores seguros e seguimos rigorosamente a LGPD (Lei Geral de Proteção de Dados).'
      },
      {
        pergunta: 'Quem pode ver minhas avaliações?',
        resposta: 'Suas avaliações são visíveis de forma anônima para professores e coordenadores apenas como estatísticas agregadas. Administradores podem acessar dados individuais apenas para moderação.'
      },
      {
        pergunta: 'Como denunciar conteúdo inadequado?',
        resposta: 'Se encontrar qualquer conteúdo inadequado, clique no ícone "..." ao lado do conteúdo e selecione "Denunciar". Nossa equipe analisará a denúncia em até 24 horas.'
      }
    ]
  }
]

export default function AjudaPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filtrar perguntas baseado na busca e categoria
  const filteredFAQ = useMemo(() => {
    return faqData.map(categoria => ({
      ...categoria,
      perguntas: categoria.perguntas.filter(item => {
        const matchesSearch = searchTerm === '' || 
          item.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.resposta.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesCategory = selectedCategory === null || categoria.categoria === selectedCategory
        
        return matchesSearch && matchesCategory
      })
    })).filter(categoria => categoria.perguntas.length > 0)
  }, [searchTerm, selectedCategory])

  const allCategories = faqData.map(cat => cat.categoria)

  return (
    <PageContainer maxWidth="3xl" className="px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: 'Central de Ajuda' }]} className="mb-4 md:mb-6" />
      
      <PageHeader
        title="Central de Ajuda"
        description="Encontre respostas para as perguntas mais frequentes sobre o ClassCheck"
      />

      {/* Barra de pesquisa */}
      <div className="mb-6 md:mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar nas perguntas frequentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm md:text-base"
          />
        </div>
      </div>

      {/* Filtros por categoria */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer text-xs md:text-sm px-2 py-1"
            onClick={() => setSelectedCategory(null)}
          >
            <HelpCircle className="w-3 h-3 mr-1" />
            Todas
          </Badge>
          {allCategories.map((category) => {
            const categoryData = faqData.find(cat => cat.categoria === category)
            const Icon = categoryData?.icon || HelpCircle
            
            return (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer text-xs md:text-sm px-2 py-1"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {category}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Resultados */}
      {filteredFAQ.length === 0 ? (
        <Card>
          <CardContent className="py-6 md:py-8 text-center px-4">
            <HelpCircle className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-semibold mb-2 faq-text">Nenhuma pergunta encontrada</h3>
            <p className="text-sm md:text-base text-muted-foreground faq-text">
              Tente pesquisar com outros termos ou{' '}
              <button 
                className="text-primary underline hover:no-underline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory(null)
                }}
              >
                limpar os filtros
              </button>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 md:space-y-8">
          {filteredFAQ.map((categoria) => {
            const Icon = categoria.icon
            
            return (
              <div key={categoria.categoria}>
                <Card className="mb-3 md:mb-4">
                  <CardHeader className="pb-3 md:pb-4">
                    <CardTitle className="flex items-start gap-2 text-base md:text-lg">
                      <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="faq-text min-w-0">{categoria.categoria}</span>
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      {categoria.perguntas.length} pergunta{categoria.perguntas.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="space-y-3 md:space-y-4">
                  {categoria.perguntas.map((item, index) => (
                    <FAQItem
                      key={`${categoria.categoria}-${index}`}
                      pergunta={item.pergunta}
                      resposta={item.resposta}
                      categoria={categoria.categoria}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Seção de contato */}
      <Card className="mt-8 md:mt-12">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl faq-text">Não encontrou sua resposta?</CardTitle>
          <CardDescription className="text-sm md:text-base faq-text">
            Entre em contato conosco e teremos prazer em ajudar!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <a 
              href="/contato"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 md:h-10 px-3 md:px-4 py-2"
            >
              Entre em Contato
            </a>
            <a 
              href="mailto:suporte@classcheck.com"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 md:h-10 px-3 md:px-4 py-2"
            >
              suporte@classcheck.com
            </a>
          </div>
        </CardContent>
      </Card>
      </div> {/* Fechamento da div max-w-4xl */}
    </PageContainer>
  )
}
