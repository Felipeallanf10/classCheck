'use client'

import { Suspense } from 'react'
import { useSession } from '@/hooks/useSession'
import { PageContainer } from '@/components/shared/PageContainer'
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { LayoutDashboard } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <DashboardSkeleton />
  }

  // Se não tem sessão após loading, redirecionar para login
  if (status === 'unauthenticated' || !session) {
    if (typeof window !== 'undefined') {
      window.location.replace('/login')
    }
    return <DashboardSkeleton />
  }

  const userName = session?.user?.name || 'Usuário'
  const userRole = session?.user?.role || 'ALUNO'

  return (
    <PageContainer>
      <div className="min-h-screen bg-background px-2 sm:px-4 py-2 sm:py-4 rounded-none sm:rounded-2xl">
        <Breadcrumbs items={[
          { label: "Dashboard" }
        ]} />
        <Suspense fallback={<DashboardSkeleton />}>
          <UnifiedDashboard userName={userName} userRole={userRole} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
