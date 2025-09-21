import React, { useState } from 'react';
import MapaAntioquia from './MapaAntioquia';
import MapaAMVA from './MapaAMVA';
import MapaMedellin from './MapaMedellin';
import AnalisisAntioquia from './AnalisisAntioquia'; // Importar el componente de análisis

type Tab = 'antioquia' | 'amva' | 'medellin';

interface ResultadosHistoricosViewProps {
  onBack: () => void;
}

const ResultadosHistoricosView: React.FC<ResultadosHistoricosViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('antioquia');

  const TabButton: React.FC<{tabName: Tab, label: string}> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === tabName
          ? 'bg-blue-600 text-white shadow'
          : 'bg-white text-slate-600 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="flex-shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
            <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
            ← Volver al Menú
            </button>
            <h2 className="text-2xl font-bold text-slate-800">Resultados Históricos</h2>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center gap-2 p-1 bg-white rounded-lg shadow-sm">
          <TabButton tabName="antioquia" label="Antioquia" />
          <TabButton tabName="amva" label="AMVA" />
          <TabButton tabName="medellin" label="Medellín" />
        </div>
      </div>
      
      <div className="flex-grow w-full">
        {activeTab === 'antioquia' && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <MapaAntioquia setActiveTab={setActiveTab} />
            </div>
            <div className="lg:w-1/2">
              <AnalisisAntioquia />
            </div>
          </div>
        )}
        {activeTab === 'amva' && <MapaAMVA setActiveTab={setActiveTab} />}
        {activeTab === 'medellin' && <MapaMedellin />}
      </div>
    </div>
  );
};

export default ResultadosHistoricosView;
