import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { ClientProviders } from "@/components/ClientProviders";

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
          <ClientProviders>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}