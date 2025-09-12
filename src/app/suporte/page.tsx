'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HelpCircle, MessageCircle, FileText, AlertCircle, Search, Lightbulb, Bug, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageContainer } from '@/components/shared/PageContainer'
import { Breadcrumb } from '@/components/shared/Breadcrumb'

// Tipos de suporte disponíveis
const supportTypes = [
  {
    id: 'faq',
    title: 'Perguntas Frequentes',
    description: 'Encontre respostas rápidas para dúvidas comuns',
    icon: HelpCircle,
    href: '/ajuda',
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    keywords: ['dúvidas', 'perguntas', 'como fazer', 'tutorial', 'ajuda']
  },
  {
    id: 'contact',
    title: 'Fale Conosco',
    description: 'Entre em contato direto com nossa equipe',
    icon: MessageCircle,
    href: '/contato',
    color: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400',
    keywords: ['contato', 'falar', 'equipe', 'suporte', 'atendimento']
  },
  {
    id: 'bug',
    title: 'Reportar Problema',
    description: 'Encontrou um bug ou erro? Nos ajude a corrigi-lo',
    icon: Bug,
    href: '/contato?tipo=problema-tecnico',
    color: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400',
    keywords: ['bug', 'erro', 'problema', 'não funciona', 'quebrado']
  },
  {
    id: 'suggestion',
    title: 'Sugestões e Melhorias',
    description: 'Compartilhe suas ideias para melhorar o ClassCheck',
    icon: Lightbulb,
    href: '/contato?tipo=sugestao',
    color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    keywords: ['sugestão', 'ideia', 'melhoria', 'nova funcionalidade', 'feedback']
  }
]

// Ações rápidas baseadas em problemas comuns
const quickActions = [
  {
    title: 'Esqueci minha senha',
    description: 'Recuperar acesso à conta',
    action: 'Redefinir Senha',
    href: '/reset-password',
    icon: Settings
  },
  {
    title: 'Como avaliar uma aula?',
    description: 'Tutorial passo a passo',
    action: 'Ver Tutorial',
    href: '/ajuda#avaliacoes',
    icon: FileText
  },
  {
    title: 'Problema técnico urgente',
    description: 'Suporte prioritário',
    action: 'Reportar Agora',
    href: '/contato?urgente=true',
    icon: AlertCircle
  }
]

// Sugestões baseadas em busca
const searchSuggestions = [
  'como avaliar aula',
  'esqueci senha',
  'dados seguros',
  'exportar relatórios',
  'problema técnico',
  'conta bloqueada',
  'notificações',
  'alterar perfil'
]

export default function SuportePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTypes, setFilteredTypes] = useState(supportTypes)
  const router = useRouter()

  // Filtrar tipos de suporte baseado na busca
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    
    if (!term.trim()) {
      setFilteredTypes(supportTypes)
      return
    }

    const filtered = supportTypes.filter(type => 
      type.title.toLowerCase().includes(term.toLowerCase()) ||
      type.description.toLowerCase().includes(term.toLowerCase()) ||
      type.keywords.some(keyword => keyword.toLowerCase().includes(term.toLowerCase()))
    )
    
    setFilteredTypes(filtered)
  }

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Central de Suporte' }]} className="mb-6" />
      
      <PageHeader
        title="Central de Suporte"
        description="Como podemos ajudar você hoje? Escolha a opção que melhor atende sua necessidade."
      />

      {/* Barra de busca inteligente */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Descreva o que você precisa: 'esqueci senha', 'como avaliar', 'problema técnico'..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sugestões de busca */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Sugestões:</span>
              {searchSuggestions.slice(0, 4).map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => handleSearch(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da busca ou todas as opções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {filteredTypes.map((type) => {
          const Icon = type.icon
          
          return (
            <Card 
              key={type.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${type.color}`}
              onClick={() => router.push(type.href)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${type.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {type.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {type.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Acessar
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Nenhum resultado encontrado */}
      {searchTerm && filteredTypes.length === 0 && (
        <Card className="text-center py-8 mb-8">
          <CardContent>
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Não encontramos o que você procura</h3>
            <p className="text-muted-foreground mb-4">
              Tente usar outras palavras ou entre em contato diretamente conosco.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => handleSearch('')} variant="outline">
                Ver Todas as Opções
              </Button>
              <Button asChild>
                <a href="/contato">Falar com Suporte</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações rápidas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{action.description}</p>
                      <Button size="sm" variant="outline" asChild className="w-full">
                        <a href={action.href}>{action.action}</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Estatísticas de suporte */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tempo Médio de Resposta</CardTitle>
          <CardDescription>Nossos tempos de atendimento atuais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">&lt; 2h</div>
              <div className="text-sm text-muted-foreground">Problemas Críticos</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">&lt; 12h</div>
              <div className="text-sm text-muted-foreground">Problemas Técnicos</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">&lt; 24h</div>
              <div className="text-sm text-muted-foreground">Dúvidas Gerais</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status do sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
          <CardDescription>Todos os serviços operando normalmente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Sistemas Operacionais</span>
            <Badge variant="secondary" className="ml-auto">99.9% Uptime</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Última atualização: hoje às 14:30 | 
            <a href="/status" className="text-primary hover:underline ml-1">
              Ver detalhes
            </a>
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
