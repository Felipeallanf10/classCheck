'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SidebarProvider } from '@/components/ui/sidebar'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Verifica se está em uma rota de autenticação
  const isAuthRoute = pathname.startsWith('/login') || 
                     pathname.startsWith('/cadastro') || 
                     pathname.startsWith('/reset-password')

  // Se for rota de autenticação, renderiza só o conteúdo
  if (isAuthRoute) {
    return (
      <>
        {children}
        {/* Botão flutuante theme apenas */}
        <div className="fixed bottom-4 right-4">
          <ThemeToggle/>
        </div>
      </>
    )
  }

  // Se não for rota de autenticação, renderiza com sidebar
  return (
    <>
      <div className="flex min-h-screen">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">{children}</main>
        </SidebarProvider>
      </div>
      {/* Botão flutuante theme */}
      <div className="fixed bottom-4 right-4">
        <ThemeToggle/>
      </div>
    </>
  )
}
