'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FAQItem } from '@/components/faq/FAQItem';
import { Search, HelpCircle, Users, FileText, Shield, Book } from 'lucide-react';

// Dados das perguntas frequentes
const faqData = [
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
      }
    ]
  },
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
      }
    ]
  },
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
      }
    ]
  }
];

export function FAQSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtrar perguntas baseado na busca e categoria
  const filteredFAQ = useMemo(() => {
    return faqData.map(categoria => ({
      ...categoria,
      perguntas: categoria.perguntas.filter(item => {
        const matchesSearch = searchTerm === '' || 
          item.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.resposta.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === null || categoria.categoria === selectedCategory;
        
        return matchesSearch && matchesCategory;
      })
    })).filter(categoria => categoria.perguntas.length > 0);
  }, [searchTerm, selectedCategory]);

  const allCategories = faqData.map(cat => cat.categoria);

  return (
    <div className="space-y-6">
      {/* Barra de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Pesquisar nas perguntas frequentes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros por categoria */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          <HelpCircle className="w-3 h-3 mr-1" />
          Todas
        </Badge>
        {allCategories.map((category) => {
          const categoryData = faqData.find(cat => cat.categoria === category);
          const Icon = categoryData?.icon || HelpCircle;
          
          return (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              <Icon className="w-3 h-3 mr-1" />
              {category}
            </Badge>
          );
        })}
      </div>

      {/* Resultados */}
      {filteredFAQ.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma pergunta encontrada</h3>
            <p className="text-muted-foreground">
              Tente pesquisar com outros termos ou{' '}
              <button 
                className="text-primary underline hover:no-underline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
              >
                limpar os filtros
              </button>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {filteredFAQ.map((categoria) => {
            const Icon = categoria.icon;
            
            return (
              <div key={categoria.categoria}>
                <Card className="mb-4">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      {categoria.categoria}
                    </CardTitle>
                    <CardDescription>
                      {categoria.perguntas.length} pergunta{categoria.perguntas.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="space-y-4">
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
            );
          })}
        </div>
      )}
    </div>
  );
}
