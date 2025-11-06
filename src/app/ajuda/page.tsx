'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { FAQSection } from '@/components/ajuda/FAQSection';
import { SupportSection } from '@/components/ajuda/SupportSection';
import { TutoriaisSection } from '@/components/ajuda/TutoriaisSection';
import { HelpCircle, MessageCircle, BookOpen } from 'lucide-react';

export default function AjudaPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <PageHeader
          title="Central de Ajuda"
          description="Encontre respostas, entre em contato com o suporte e acesse tutoriais"
        />

        <Tabs defaultValue="faq" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Perguntas Frequentes</span>
              <span className="sm:hidden">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="suporte" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Falar com Suporte</span>
              <span className="sm:hidden">Suporte</span>
            </TabsTrigger>
            <TabsTrigger value="tutoriais" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Tutoriais</span>
              <span className="sm:hidden">Tutoriais</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <FAQSection />
          </TabsContent>

          <TabsContent value="suporte">
            <SupportSection />
          </TabsContent>

          <TabsContent value="tutoriais">
            <TutoriaisSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
