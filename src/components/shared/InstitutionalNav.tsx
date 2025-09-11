import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Info, Shield, FileText, HelpCircle, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const institutionalPages = [
  { name: 'Sobre', href: '/sobre', icon: Info },
  { name: 'Central de Ajuda', href: '/ajuda', icon: HelpCircle },
  { name: 'Contato', href: '/contato', icon: Mail },
  { name: 'Política de Privacidade', href: '/politica-de-privacidade', icon: Shield },
  { name: 'Termos de Uso', href: '/termos-de-uso', icon: FileText }
]

export function InstitutionalNav() {
  const pathname = usePathname()

  return (
    <Card className="mt-8">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
          Páginas Relacionadas
        </h3>
        <div className="flex flex-wrap gap-2">
          {institutionalPages.map((page) => {
            const Icon = page.icon
            const isActive = pathname === page.href
            
            return (
              <Button
                key={page.href}
                variant={isActive ? "default" : "outline"}
                size="sm"
                asChild
                className={cn(
                  "text-xs",
                  isActive && "pointer-events-none"
                )}
              >
                <Link href={page.href}>
                  <Icon className="mr-1.5 h-3 w-3" />
                  {page.name}
                </Link>
              </Button>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Navegue facilmente entre nossas páginas institucionais
        </p>
      </CardContent>
    </Card>
  )
}
