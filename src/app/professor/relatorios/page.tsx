import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardProfessor } from '@/components/professor/DashboardProfessor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Relatórios da Turma - Professor | ClassCheck',
  description: 'Visualize métricas e análise de risco dos alunos',
};

// Forçar renderização dinâmica (usa headers para autenticação)
export const dynamic = 'force-dynamic';

export default async function ProfessorRelatoriosPage() {
  const usuario = await requireAuth();
  
  if (usuario.role !== 'PROFESSOR' && usuario.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <Link 
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Dashboard
      </Link>
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Relatórios da Turma</h1>
        <p className="text-muted-foreground mt-2">
          Visualize métricas agregadas e identifique alunos que precisam de atenção
        </p>
      </div>
      
      {/* Dashboard */}
      <DashboardProfessor professorId={usuario.id} userRole={usuario.role as 'PROFESSOR' | 'ADMIN'} />
    </div>
  );
}
