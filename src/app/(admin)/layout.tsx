import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminNav } from '@/components/navigation/AdminNav'

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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 flex-shrink-0">
        <AdminNav />
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
