'use client';

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ExportButtonsProps {
  usuarioId: number;
  dataInicio?: Date;
  dataFim?: Date;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ExportButtons({
  usuarioId,
  dataInicio,
  dataFim,
  variant = 'outline',
  size = 'default',
  className,
}: ExportButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [formatoAtual, setFormatoAtual] = useState<'pdf' | 'excel' | 'csv' | null>(null);
  const { toast } = useToast();

  const exportarRelatorio = async (formato: 'pdf' | 'excel' | 'csv') => {
    try {
      setLoading(true);
      setFormatoAtual(formato);

      // Construir URL com query params
      const params = new URLSearchParams({
        usuarioId: usuarioId.toString(),
        formato,
      });

      if (dataInicio) {
        params.append('inicio', dataInicio.toISOString());
      }

      if (dataFim) {
        params.append('fim', dataFim.toISOString());
      }

      // Fazer requisição
      const response = await fetch(`/api/relatorios/gerar?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao gerar relatório');
      }

      // Obter blob do arquivo
      const blob = await response.blob();

      // Criar URL temporária e fazer download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Definir nome do arquivo conforme formato
      const timestamp = new Date().toISOString().split('T')[0];
      const extensao = formato === 'excel' ? 'xlsx' : formato;
      a.download = `relatorio_${timestamp}.${extensao}`;

      document.body.appendChild(a);
      a.click();

      // Limpar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success({
        title: 'Relatório exportado',
        description: `Arquivo ${formato.toUpperCase()} baixado com sucesso`,
      });
    } catch (erro) {
      console.error('Erro ao exportar:', erro);
      toast.error({
        title: 'Erro na exportação',
        description: erro instanceof Error ? erro.message : 'Falha ao gerar relatório',
      });
    } finally {
      setLoading(false);
      setFormatoAtual(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exportando {formatoAtual?.toUpperCase()}...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Exportar Relatório
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => exportarRelatorio('pdf')}
          disabled={loading}
          className="cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4 text-red-500" />
          <span>Exportar PDF</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportarRelatorio('excel')}
          disabled={loading}
          className="cursor-pointer"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          <span>Exportar Excel</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => exportarRelatorio('csv')}
          disabled={loading}
          className="cursor-pointer"
        >
          <FileDown className="mr-2 h-4 w-4 text-blue-500" />
          <span>Exportar CSV</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Componente alternativo com botões separados (para layouts diferentes)
export function ExportButtonsSeparate({
  usuarioId,
  dataInicio,
  dataFim,
  variant = 'outline',
  size = 'default',
  className,
}: ExportButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [formatoAtual, setFormatoAtual] = useState<'pdf' | 'excel' | 'csv' | null>(null);
  const { toast } = useToast();

  const exportarRelatorio = async (formato: 'pdf' | 'excel' | 'csv') => {
    try {
      setLoading(true);
      setFormatoAtual(formato);

      const params = new URLSearchParams({
        usuarioId: usuarioId.toString(),
        formato,
      });

      if (dataInicio) {
        params.append('inicio', dataInicio.toISOString());
      }

      if (dataFim) {
        params.append('fim', dataFim.toISOString());
      }

      const response = await fetch(`/api/relatorios/gerar?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao gerar relatório');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const timestamp = new Date().toISOString().split('T')[0];
      const extensao = formato === 'excel' ? 'xlsx' : formato;
      a.download = `relatorio_${timestamp}.${extensao}`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success({
        title: 'Sucesso',
        description: `Relatório ${formato.toUpperCase()} exportado`,
      });
    } catch (erro) {
      console.error('Erro ao exportar:', erro);
      toast.error({
        title: 'Erro',
        description: erro instanceof Error ? erro.message : 'Falha na exportação',
      });
    } finally {
      setLoading(false);
      setFormatoAtual(null);
    }
  };

  const isFormatoLoading = (formato: 'pdf' | 'excel' | 'csv') =>
    loading && formatoAtual === formato;

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={() => exportarRelatorio('pdf')}
        disabled={loading}
      >
        {isFormatoLoading('pdf') ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileText className="mr-2 h-4 w-4" />
        )}
        PDF
      </Button>

      <Button
        variant={variant}
        size={size}
        onClick={() => exportarRelatorio('excel')}
        disabled={loading}
      >
        {isFormatoLoading('excel') ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="mr-2 h-4 w-4" />
        )}
        Excel
      </Button>

      <Button
        variant={variant}
        size={size}
        onClick={() => exportarRelatorio('csv')}
        disabled={loading}
      >
        {isFormatoLoading('csv') ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="mr-2 h-4 w-4" />
        )}
        CSV
      </Button>
    </div>
  );
}
