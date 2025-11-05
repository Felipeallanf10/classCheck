import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Verificar se está autenticado e se é aluno
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'ALUNO') {
    // Redirecionar para dashboard correto
    if (session.user.role === 'PROFESSOR') {
      redirect('/professor')
    } else if (session.user.role === 'ADMIN') {
      redirect('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Layout específico do aluno */}
      <div className="flex flex-col">
        {/* Header do aluno */}
        <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ClassCheck
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Olá, {session.user.name}!
                </p>
              </div>
              <nav className="flex items-center gap-4">
                <a href="/aluno" className="text-sm font-medium hover:text-primary-600">
                  Dashboard
                </a>
                <a href="/aluno/avaliacoes" className="text-sm font-medium hover:text-primary-600">
                  Minhas Avaliações
                </a>
                <a href="/aluno/progresso" className="text-sm font-medium hover:text-primary-600">
                  Meu Progresso
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
