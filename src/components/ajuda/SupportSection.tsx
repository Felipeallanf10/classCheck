'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function SupportSection() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    tipo: '',
    mensagem: ''
  });
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Aqui você enviaria o formulário para a API
      // await fetch('/api/suporte', {
      //   method: 'POST',
      //   body: JSON.stringify(formData)
      // });
      
      console.log('Formulário de suporte enviado:', formData);
      setEnviado(true);
      setErro(false);
      
      // Limpar formulário
      setFormData({
        nome: '',
        email: '',
        assunto: '',
        tipo: '',
        mensagem: ''
      });
      
      // Resetar estado após 5 segundos
      setTimeout(() => setEnviado(false), 5000);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setErro(true);
      setTimeout(() => setErro(false), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações de contato */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-600 dark:bg-blue-500">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-950 dark:text-blue-50">Email</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">suporte@classcheck.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-600 dark:bg-green-500">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-950 dark:text-green-50">Telefone</p>
                <p className="text-sm text-green-700 dark:text-green-300">(11) 1234-5678</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-600 dark:bg-purple-500">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-950 dark:text-purple-50">Horário</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">Seg-Sex 8h-18h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de status */}
      {enviado && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-900 dark:text-green-100">
            Mensagem enviada com sucesso! Nossa equipe responderá em breve.
          </AlertDescription>
        </Alert>
      )}

      {erro && (
        <Alert className="bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-900 dark:text-red-100">
            Erro ao enviar mensagem. Por favor, tente novamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Formulário de contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Enviar Mensagem
          </CardTitle>
          <CardDescription>
            Preencha o formulário abaixo e nossa equipe entrará em contato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Solicitação *</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value) => setFormData({...formData, tipo: value})}
                  required
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duvida">Dúvida Geral</SelectItem>
                    <SelectItem value="problema-tecnico">Problema Técnico</SelectItem>
                    <SelectItem value="sugestao">Sugestão</SelectItem>
                    <SelectItem value="bug">Reportar Bug</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto *</Label>
                <Input
                  id="assunto"
                  placeholder="Resumo do problema"
                  value={formData.assunto}
                  onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem *</Label>
              <Textarea
                id="mensagem"
                placeholder="Descreva sua dúvida ou problema em detalhes..."
                value={formData.mensagem}
                onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                rows={6}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Enviar Mensagem
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tempo médio de resposta */}
      <Card className="bg-gray-50 dark:bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-sm">Tempo Médio de Resposta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg bg-white dark:bg-gray-800">
              <div className="text-2xl font-bold text-green-600 mb-1">&lt; 2h</div>
              <div className="text-sm text-muted-foreground">Problemas Críticos</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-white dark:bg-gray-800">
              <div className="text-2xl font-bold text-blue-600 mb-1">&lt; 12h</div>
              <div className="text-sm text-muted-foreground">Problemas Técnicos</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-white dark:bg-gray-800">
              <div className="text-2xl font-bold text-purple-600 mb-1">&lt; 24h</div>
              <div className="text-sm text-muted-foreground">Dúvidas Gerais</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status do sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Todos os Serviços Operacionais</span>
            </div>
            <Badge variant="secondary">99.9% Uptime</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Última atualização: hoje às 14:30
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
