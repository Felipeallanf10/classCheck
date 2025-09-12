import React from 'react';
import ExportadorRelatorios from '@/components/exportacao/ExportadorRelatorios';

const ExportacaoPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
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
  );
};

export default ExportacaoPage;
