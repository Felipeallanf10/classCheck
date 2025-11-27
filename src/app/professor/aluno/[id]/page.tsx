import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function AlunoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const usuario = await requireAuth();
  const { id: idParam } = await params;
  const alunoId = parseInt(idParam);
  
  if (usuario.role !== 'PROFESSOR' && usuario.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  
  // Buscar dados do aluno
  const aluno = await prisma.usuario.findUnique({
    where: { id: alunoId },
    include: {
      sessoesAdaptativas: {
        where: { status: 'FINALIZADA' },
        select: {
          id: true,
          thetaEstimado: true,
          confianca: true,
          iniciadoEm: true,
          finalizadoEm: true,
          questionario: {
            select: {
              titulo: true,
            },
          },
        },
        orderBy: { iniciadoEm: 'desc' },
        take: 10,
      },
      alertasSocioemocionais: {
        where: {
          status: { in: ['PENDENTE', 'EM_ANALISE'] },
        },
        select: {
          id: true,
          tipo: true,
          nivel: true,
          descricao: true,
          criadoEm: true,
        },
        orderBy: { criadoEm: 'desc' },
      },
    },
  });
  
  if (!aluno) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Aluno não encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Calcular métricas
  const sessoesAdaptativas = (aluno as any).sessoesAdaptativas || [];
  const alertasSocioemocionais = (aluno as any).alertasSocioemocionais || [];
  
  const thetaMedio = sessoesAdaptativas.length > 0
    ? sessoesAdaptativas.reduce((sum: number, s: any) => sum + (s.thetaEstimado || 0), 0) / sessoesAdaptativas.length
    : 0;
  
  const alertasCriticos = alertasSocioemocionais.filter((a: any) => a.nivel === 'VERMELHO').length;
  const alertasAltos = alertasSocioemocionais.filter((a: any) => a.nivel === 'LARANJA').length;
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <Link 
        href="/professor/relatorios"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos Relatórios
      </Link>
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Detalhes do Aluno</h1>
        <p className="text-muted-foreground mt-2">
          Visualize o histórico socioemocional e alertas
        </p>
      </div>
      
      {/* Informações Básicas */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações do Aluno</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{aluno.nome}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{aluno.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Cadastrado em</p>
              <p className="font-medium">
                {new Date(aluno.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Métricas Socioemocionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Theta Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              thetaMedio > 0 ? 'text-green-600' : 
              thetaMedio < -1 ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {thetaMedio > 0 ? '+' : ''}{thetaMedio.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado em {sessoesAdaptativas.length} sessões
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertas Abertos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertasSocioemocionais.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {alertasCriticos} crítico{alertasCriticos !== 1 ? 's' : ''}, {alertasAltos} alto{alertasAltos !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessoesAdaptativas.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Questionários completos
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Alertas Ativos */}
      {alertasSocioemocionais.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Alertas Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertasSocioemocionais.map((alerta: any) => (
                <div 
                  key={alerta.id}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                    alerta.nivel === 'VERMELHO' ? 'text-red-600' :
                    alerta.nivel === 'LARANJA' ? 'text-orange-500' :
                    'text-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={
                        alerta.nivel === 'VERMELHO' ? 'bg-red-600' :
                        alerta.nivel === 'LARANJA' ? 'bg-orange-500' :
                        'bg-yellow-500'
                      }>
                        {alerta.nivel}
                      </Badge>
                      <span className="font-medium">{alerta.tipo}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alerta.descricao}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(alerta.criadoEm), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Histórico de Sessões */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Sessões Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {sessoesAdaptativas.length > 0 ? (
            <div className="space-y-3">
              {sessoesAdaptativas.map((sessao: any) => (
                <div 
                  key={sessao.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{sessao.questionario.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(sessao.iniciadoEm), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      (sessao.thetaEstimado || 0) > 0 ? 'text-green-600' : 
                      (sessao.thetaEstimado || 0) < -1 ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {(sessao.thetaEstimado || 0) > 0 ? '+' : ''}{(sessao.thetaEstimado || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Confiança: {((sessao.confianca || 0) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma sessão registrada ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
