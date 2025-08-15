import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppSidebar } from "@/components/app-sidebar"; // Importe o Sidebar correto
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarProvider } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistPoppins = Poppins({
  variable: "--font-Poppins",
  weight: ["100","200","300","400", "500", "600", "700"],
  subsets: ["latin"],
});

const geistQuicksand = Quicksand({  
  variable: "--font-Quicksand",
  weight: ["300","400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Class Check",
  description: "Projeto de teste para a disciplina de Desenvolvimento Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistPoppins.variable} ${geistQuicksand.variable} antialiased bg-gray-200 dark:bg-gray-900 text-black dark:text-white`}
      >
        <ThemeProvider>
          <div className="flex min-h-screen">
          <SidebarProvider>
            <AppSidebar /> {/* Sidebar fixo à esquerda */}
            <main className="flex-1">{children}</main>
          </SidebarProvider>
          </div>
          {/* Botão flutuante theme */}
          <div className="fixed bottom-4 right-4">
            <ThemeToggle/>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}