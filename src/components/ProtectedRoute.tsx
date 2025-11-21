"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Role } from "@prisma/client"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: Role[]
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo = "/login"
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push(redirectTo)
      return
    }

    if (!allowedRoles.includes(session.user.role)) {
      // Redirecionar para página inicial baseado no role
      if (session.user.role === "ADMIN") {
        router.push("/dashboard")
      } else if (session.user.role === "PROFESSOR") {
        router.push("/analytics")
      } else {
        router.push("/dashboard")
      }
    }
  }, [session, status, router, allowedRoles, redirectTo])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session || !allowedRoles.includes(session.user.role)) {
    return null
  }

  return <>{children}</>
}
