"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Icon,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarGroup,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}


import { Home, Star, Calendar, Heart, HelpCircle, Mail, Info, Shield, FileText, Settings, LifeBuoy } from "lucide-react"
import Link from "next/link"

const navItems = [
  { label: "Início", icon: Home, href: "/" },
  { label: "Favoritas", icon: Star, href: "/favoritas" },
  { label: "Aulas", icon: BookOpen, href: "/aulas" },
  { label: "Avaliações", icon: Heart, href: "/avaliacoes" },
  { label: "Eventos", icon: Calendar, href: "/eventos" },
]

// Seção de páginas institucionais
const institutionalItems = [
  { label: "Central de Suporte", icon: LifeBuoy, href: "/suporte" },
  { label: "Ajuda", icon: HelpCircle, href: "/ajuda" },
  { label: "Contato", icon: Mail, href: "/contato" },
  { label: "Sobre", icon: Info, href: "/sobre" },
]

// Seção de políticas (no footer)
const policyItems = [
  { label: "Privacidade", icon: Shield, href: "/politica-de-privacidade" },
  { label: "Termos", icon: FileText, href: "/termos-de-uso" },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="/">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">ClassCheck</span>
                    <span className="truncate text-xs">Software</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Navegação Principal */}
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map(({ label, icon: Icon, href }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton asChild>
                  <Link href={href}>
                    <Icon className="size-4" />
                    <span className="ml-2">{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Seção Institucional */}
        <SidebarGroup>
          <div className="px-2 py-1">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Suporte
            </h4>
          </div>
          <SidebarMenu>
            {institutionalItems.map(({ label, icon: Icon, href }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton asChild size="sm">
                  <Link href={href}>
                    <Icon className="size-4" />
                    <span className="ml-2">{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Links de Política no Footer */}
        <SidebarGroup>
          <SidebarMenu>
            {policyItems.map(({ label, icon: Icon, href }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton asChild size="sm" variant="outline">
                  <Link href={href} className="text-xs">
                    <Icon className="size-3" />
                    <span className="ml-1">{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}