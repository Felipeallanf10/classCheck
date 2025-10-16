import Link from 'next/link'
import { Github, Mail, Twitter, Heart, HelpCircle, Shield, FileText, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = {
    product: {
      title: 'Produto',
      links: [
        { name: 'Início', href: '/dashboard' },
        { name: 'Minhas Avaliações', href: '/minhas-avaliacoes' },
        { name: 'Relatórios', href: '/relatorios' },
        { name: 'Aulas', href: '/aulas' },
      ]
    },
    support: {
      title: 'Suporte',
      links: [
        { name: 'Central de Ajuda', href: '/ajuda', icon: HelpCircle },
        { name: 'Contato', href: '/contato', icon: Mail },
        { name: 'Sobre Nós', href: '/sobre', icon: Info },
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Política de Privacidade', href: '/politica-de-privacidade', icon: Shield },
        { name: 'Termos de Uso', href: '/termos-de-uso', icon: FileText },
      ]
    }
  }

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/classcheck', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com/classcheck', icon: Twitter },
    { name: 'Email', href: 'mailto:contato@classcheck.com', icon: Mail },
  ]

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Seção principal do footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo e descrição */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Heart className="size-4" />
              </div>
              <span className="font-bold text-lg">ClassCheck</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Plataforma de feedback educacional que conecta estudantes e professores 
              para melhorar a qualidade do ensino através de avaliações construtivas.
            </p>
            
            {/* Redes sociais */}
            <div className="flex space-x-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0"
                  >
                    <a 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={social.name}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Links do produto */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{footerSections.product.title}</h3>
            <ul className="space-y-2">
              {footerSections.product.links.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links de suporte */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{footerSections.support.title}</h3>
            <ul className="space-y-2">
              {footerSections.support.links.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      {Icon && <Icon className="h-3 w-3" />}
                      {link.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Links legais */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{footerSections.legal.title}</h3>
            <ul className="space-y-2">
              {footerSections.legal.links.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      {Icon && <Icon className="h-3 w-3" />}
                      {link.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Rodapé inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} ClassCheck. Todos os direitos reservados.
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Desenvolvido com</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>por Felipe Allan & Nickollas Teixeira</span>
          </div>
        </div>

        {/* Informações técnicas (apenas em dev) */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                🚧 Ambiente de desenvolvimento • Next.js 15 • React 19 • TypeScript
              </p>
            </div>
          </>
        )}
      </div>
    </footer>
  )
}