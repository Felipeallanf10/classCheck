import React from 'react';
import RelatorioLongitudinal from '@/components/relatorios/RelatorioLongitudinal';
import GraficoTendenciasTurma from '@/components/relatorios/GraficoTendenciasTurma';
import ComparativoPeriodos from '@/components/relatorios/ComparativoPeriodos';
import MapaCalorEmocional from '@/components/relatorios/MapaCalorEmocional';

const RelatoriosPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
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
