'use client'

import { Suspense } from 'react'
import { PageContainer } from '@/components/shared/PageContainer'
import { DashboardUnificado } from '@/components/dashboard/DashboardUnificado'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="min-h-screen bg-background">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardUnificado />
        </Suspense>
      </div>
    </PageContainer>
  )
}
