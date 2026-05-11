import React, { useState, useEffect, useRef } from 'react';
import { MobileHeader } from './MobileHeader';
import { ResponsiveTabs } from './ResponsiveTabs';
import { BackgroundWrapper } from './BackgroundWrapper';
import MapaAntioquia from './MapaAntioquia';
import MapaAMVA from './MapaAMVA';
import MapaMedellin from './MapaMedellin';
import AnalisisAntioquia from './AnalisisAntioquia';
import AnalisisAMVA from './AnalisisAMVA';
import AnalisisMedellin from './AnalisisMedellin';

type Tab = 'antioquia' | 'amva' | 'medellin';

interface ResultadosHistoricosViewProps {
  onBack: () => void;
  onNavigateToVoluntarios?: () => void;
  onNavigateToVotantes?: () => void;
}

const ResultadosHistoricosView: React.FC<ResultadosHistoricosViewProps> = ({ onBack, onNavigateToVoluntarios, onNavigateToVotantes }) => {
  const [activeTab, setActiveTab] = useState<Tab>('antioquia');
  const containerRef = useRef<HTMLDivElement>(null);

  // Función para cambiar tab y hacer scroll al inicio
  const handleTabChange = (tab: string) => {
    // Inmediatamente resetear scroll antes de cambiar contenido
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Cambiar la pestaña activa
    setActiveTab(tab as Tab);
  };

  // useEffect que se ejecuta cada vez que cambia activeTab
  useEffect(() => {
    // Múltiple estrategia para asegurar scroll al inicio
    const forceScrollReset = () => {
      // Reset inmediato sin animación
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Si hay algún contenedor con scroll, también resetear
      const scrollContainers = document.querySelectorAll('[data-scroll-container]');
      scrollContainers.forEach(container => {
        (container as HTMLElement).scrollTop = 0;
      });
      
      // Forzar un segundo reset después de que React termine de renderizar
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 10);
      
      // Scroll suave final después del render completo
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    };

    forceScrollReset();
  }, [activeTab]);

  const tabs = [
    { 
      id: 'antioquia', 
      label: 'Antioquia', 
      shortLabel: 'Antioquia'
    },
    { 
      id: 'amva', 
      label: 'AMVA', 
      shortLabel: 'AMVA'
    },
    { 
      id: 'medellin', 
      label: 'Medellín', 
      shortLabel: 'Medellín'
    }
  ];

  return (
    <BackgroundWrapper overlayType="maps">
      <MobileHeader 
        title="Diagnostico territorial"
        showBackButton={true}
        onBack={onBack}
        onNavigateToVoluntarios={onNavigateToVoluntarios}
        onNavigateToVotantes={onNavigateToVotantes}
      >
        <ResponsiveTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </MobileHeader>
      
      <div ref={containerRef}>
      
      <div className="p-4 pb-8 space-y-6" style={{ paddingTop: '2rem' }}>
        {activeTab === 'antioquia' && (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-xl">
                Diagnostico territorial en Antioquia
              </h2>
              <p className="text-white/90 drop-shadow-lg">
                Afinidad, volumen y oportunidad para el Partido Amarillo
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  Mapa electoral Antioquia
                </h3>
              </div>
              <div className="min-h-[50vh] relative z-0 map-container">
                <MapaAntioquia setActiveTab={setActiveTab} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  Analisis estrategico
                </h3>
              </div>
              <div className="p-0">
                <AnalisisAntioquia />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'amva' && (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-xl">
                Diagnostico metropolitano en el AMVA
              </h2>
              <p className="text-white/90 drop-shadow-lg">
                Análisis del área metropolitana del Valle de Aburrá
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  Mapa electoral AMVA
                </h3>
              </div>
              <div className="min-h-[50vh] relative z-0 map-container">
                <MapaAMVA setActiveTab={setActiveTab} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  Analisis metropolitano
                </h3>
              </div>
              <div className="p-0">
                <AnalisisAMVA />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'medellin' && (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-xl">
                Perfil urbano de Medellin
              </h2>
              <p className="text-white/90 drop-shadow-lg">
                Analisis por comunas de la capital antioquena
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  Mapa electoral Medellin
                </h3>
              </div>
              <div className="min-h-[50vh] relative z-0 map-container">
                <MapaMedellin />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  Analisis por comunas
                </h3>
              </div>
              <div className="p-0">
                <AnalisisMedellin />
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default ResultadosHistoricosView;
