'use client'

import { Suspense } from 'react'
import { PageContainer } from '@/components/shared/PageContainer'
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { LayoutDashboard } from 'lucide-react'

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="min-h-screen bg-background px-2 sm:px-4 py-2 sm:py-4 rounded-none sm:rounded-2xl">
        <Breadcrumbs items={[
          { label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> }
        ]} />
        <Suspense fallback={<DashboardSkeleton />}>
          <UnifiedDashboard userName="Professor" />
        </Suspense>
      </div>
    </PageContainer>
  )
}
