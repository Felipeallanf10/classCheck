import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AlunoNav } from '@/components/navigation/AlunoNav'

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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 flex-shrink-0">
        <AlunoNav />
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
