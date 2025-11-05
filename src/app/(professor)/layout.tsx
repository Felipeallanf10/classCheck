import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function ProfessorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Verificar se está autenticado e se é professor ou admin
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'PROFESSOR' && session.user.role !== 'ADMIN') {
    // Redirecionar para dashboard correto
    if (session.user.role === 'ALUNO') {
      redirect('/aluno')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col">
        {/* Header do professor */}
        <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ClassCheck - Professor
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user.name} {session.user.materia && `• ${session.user.materia}`}
                </p>
              </div>
              <nav className="flex items-center gap-4">
                <a href="/professor" className="text-sm font-medium hover:text-primary-600">
                  Dashboard
                </a>
                <a href="/professor/turmas" className="text-sm font-medium hover:text-primary-600">
                  Minhas Turmas
                </a>
                <a href="/professor/relatorios" className="text-sm font-medium hover:text-primary-600">
                  Relatórios
                </a>
                <a href="/professor/aulas" className="text-sm font-medium hover:text-primary-600">
                  Aulas
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
