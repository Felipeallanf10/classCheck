"use client";

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, FileText, BarChart3, File, Image, Settings } from "lucide-react";
import { useState } from "react";
import ExportadorRelatorios from "@/components/exportacao/ExportadorRelatorios";
import { handleExport as exportService } from "@/lib/export/handlers";
import type { ExportFormat } from "@/lib/export/handlers";

export function ExportDropdown() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    
    try {
      // Usar o serviço centralizado de exportação
      const result = await exportService({
        format,
        includeCharts: true,
        includeTables: true,
        includeInsights: true,
      });
      
      if (result.success) {
        console.log(`✅ ${result.message}`);
        console.log(`📁 Arquivo: ${result.fileName}`);
        // Aqui poderia mostrar um toast de sucesso
      } else {
        console.error(`❌ Erro: ${result.error}`);
        // Aqui poderia mostrar um toast de erro
      }
      
    } catch (error) {
      console.error('Erro na exportação:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" /> 
            {isExporting ? "Exportando..." : "Exportar"}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Exportação Rápida</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleExport("pdf")} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4 text-red-600" />
            <div>
              <div className="font-medium">Exportar PDF</div>
              <div className="text-xs text-muted-foreground">Relatório completo em PDF</div>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleExport("xlsx")} className="cursor-pointer">
            <BarChart3 className="mr-2 h-4 w-4 text-green-600" />
            <div>
              <div className="font-medium">Exportar Excel</div>
              <div className="text-xs text-muted-foreground">Dados em planilha</div>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleExport("csv")} className="cursor-pointer">
            <File className="mr-2 h-4 w-4 text-blue-600" />
            <div>
              <div className="font-medium">Exportar CSV</div>
              <div className="text-xs text-muted-foreground">Dados brutos tabulares</div>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleExport("pptx")} className="cursor-pointer">
            <Image className="mr-2 h-4 w-4 text-orange-600" />
            <div>
              <div className="font-medium">Exportar PowerPoint</div>
              <div className="text-xs text-muted-foreground">Apresentação de slides</div>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span className="font-medium">Opções Avançadas</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog para exportação avançada */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exportação Avançada de Relatórios</DialogTitle>
            <DialogDescription>
              Configure e personalize a exportação dos seus relatórios com opções avançadas
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <ExportadorRelatorios 
              dadosDisponives={{
                dashboard: true,
                relatorioLongitudinal: true,
                tendencias: true,
                comparativo: true,
                mapaCalor: true,
                insights: true
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}