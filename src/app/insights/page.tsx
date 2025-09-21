import React from 'react';
import InsightsPreditivos from '@/components/insights/InsightsPreditivos';

const InsightsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <InsightsPreditivos 
        tipoAnalise="turma" 
        horizonteTemporal="2_semanas" 
      />
    </div>
  );
};

export default InsightsPage;
