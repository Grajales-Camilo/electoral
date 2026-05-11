import React, { useRef, useState } from 'react';
import { Card } from './src/components/Card';
import { ReloadIcon, SpinnerIcon } from './src/components/icons';
import { BackgroundWrapper } from './src/components/BackgroundWrapper';
import ResultadosHistoricosView from './src/components/ResultadosHistoricosView';
import GestionVoluntarios from './src/components/GestionVoluntarios';
import GestionVotantes from './src/components/GestionVotantes';

// Identificadores para las vistas
const VISTA_RESULTADOS = 'resultados';
const VISTA_VOLUNTARIOS = 'voluntarios';
const VISTA_VOTANTES = 'votantes';

const App: React.FC = () => {
  const [selectedToolUrl, setSelectedToolUrl] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReload = () => {
    if (iframeRef.current) {
      setIsReloading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const resetSelection = () => {
    setSelectedToolUrl(null);
    setSelectedView(null);
  }

  if (!selectedToolUrl && !selectedView) {
    return (
      <BackgroundWrapper overlayType="default">
        <header className="bg-white/20 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.15)] p-4 sticky top-0 z-20 border-b border-white/30">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold text-white drop-shadow-lg">
                  Partido Amarillo | Elecciones 2026
                </h1>
            </div>
        </header>

        <main className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-xl">
              Dashboard de análisis electoral
            </h1>
            <p className="mt-4 text-base text-white/90 max-w-3xl mx-auto drop-shadow-lg">
              Diagnóstico territorial, perfil de votantes y redes de voluntariado para tomar decisiones con inteligencia.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
            <Card
              onClick={() => {
                setSelectedView(VISTA_RESULTADOS);
              }}
              title="Diagnóstico territorial"
              subtitle="Mapas, oportunidades y concentración electoral"
              description="Explora el comportamiento territorial del Partido Amarillo y detecta plazas de volumen, afinidad y baja penetración."
              imageUrl="images/IVC3.png"
            />
            <Card
              onClick={() => {
                setSelectedView(VISTA_VOTANTES);
              }}
              title="Perfil de votantes"
              subtitle="Segmentos, estratos y puestos de votación"
              description="Consulta patrones de comportamiento y prioriza territorios según potencial, participación y competencia electoral."
              imageUrl="images/IVC4.png"
            />
            <Card
              onClick={() => {
                setSelectedView(VISTA_VOLUNTARIOS);
              }}
              title="Red de voluntariado"
              subtitle="Cobertura agregada y solicitudes de material"
              description="Evalúa la capacidad territorial de la red sin exponer datos personales de los voluntarios."
              imageUrl="images/IVC5.png"
            />
          </div>
        </main>
        <footer className="text-center py-6">
          <p className="text-sm text-white/90 drop-shadow">Trabajo final de la ruta de formación en análisis de datos de Estud-IA</p>
        </footer>
      </BackgroundWrapper>
    );
  }

  // Tarea 2.4: Lógica de renderizado
  if (selectedView === VISTA_RESULTADOS) {
    return <ResultadosHistoricosView onBack={resetSelection} />;
  }

  if (selectedView === VISTA_VOLUNTARIOS) {
    return <GestionVoluntarios onBack={resetSelection} />;
  }

  if (selectedView === VISTA_VOTANTES) {
    return <GestionVotantes onBack={resetSelection} />;
  }
  
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="flex-shrink-0 mb-4 flex items-center gap-4">
        <button
          onClick={resetSelection}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          ← Volver al Menú
        </button>
        <button
          onClick={handleReload}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
          disabled={isReloading}
        >
          {isReloading ? <><SpinnerIcon /> Cargando...</> : <><ReloadIcon /> Recargar</>}
        </button>
      </div>

      <iframe
        ref={iframeRef}
        src={selectedToolUrl!}
        className="flex-grow w-full border-2 border-slate-200 rounded-xl"
        title="Herramienta de gestión"
        onLoad={() => setIsReloading(false)}
      />
    </div>
  );
};

export default App;
