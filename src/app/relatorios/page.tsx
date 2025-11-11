import React from 'react';
import RelatorioLongitudinal from '@/components/relatorios/RelatorioLongitudinal';
import GraficoTendenciasTurma from '@/components/relatorios/GraficoTendenciasTurma';
import ComparativoPeriodos from '@/components/relatorios/ComparativoPeriodos';
import MapaCalorEmocional from '@/components/relatorios/MapaCalorEmocional';
import { PageHeader } from '@/components/ui/page-header';
import { ExportDropdown } from '@/components/relatorios/ExportDropdown';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { FileText } from 'lucide-react';

const RelatoriosPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Relatórios", icon: <FileText className="h-4 w-4" /> }
      ]} />

      {/* Cabeçalho com Exportação Integrada */}
      <PageHeader 
        title="Relatórios" 
        description="Visualize, analise e exporte relatórios completos do ClassCheck"
        actions={<ExportDropdown />} 
      />

      {/* Relatório Longitudinal */}
      <section>
        <RelatorioLongitudinal periodo="mes" />
      </section>

      {/* Gráfico de Tendências */}
      <section>
        <GraficoTendenciasTurma periodo="mes" />
      </section>

      {/* Comparativo de Períodos */}
      <section>
        <ComparativoPeriodos tipoComparacao="mensal" />
      </section>

      {/* Mapa de Calor Emocional */}
      <section>
        <MapaCalorEmocional 
          periodo="mes" 
          tipoVisualizacao="valencia" 
        />
      </section>
    </div>
  );
};

export default RelatoriosPage;
