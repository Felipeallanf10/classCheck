import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Verificar se está autenticado e se é admin
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    // Redirecionar para dashboard correto
    if (session.user.role === 'ALUNO') {
      redirect('/aluno')
    } else if (session.user.role === 'PROFESSOR') {
      redirect('/professor')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col">
        {/* Header do admin */}
        <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  ClassCheck - Administração
                </h1>
                <p className="text-sm text-purple-100">
                  {session.user.name} • Administrador
                </p>
              </div>
              <nav className="flex items-center gap-4 text-white">
                <a href="/admin" className="text-sm font-medium hover:text-purple-200">
                  Dashboard
                </a>
                <a href="/admin/usuarios" className="text-sm font-medium hover:text-purple-200">
                  Usuários
                </a>
                <a href="/admin/turmas" className="text-sm font-medium hover:text-purple-200">
                  Turmas
                </a>
                <a href="/admin/relatorios" className="text-sm font-medium hover:text-purple-200">
                  Relatórios Gerais
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
