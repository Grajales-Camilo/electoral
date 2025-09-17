import React, { useState, useRef } from 'react';
import { Card } from './components/Card';
import { TutorIcon, DashboardIcon, ReloadIcon, SpinnerIcon, AnalysisIcon, WhatsAppIcon } from './components/icons';

// URLs de las herramientas
const TUTOR_URL = 'https://script.google.com/macros/s/AKfycbyMwWKTYtgw-7cO673AygNYSj4fHF3xYz_yOYsswZmVGVpGDakHRDAeHDYxy1urdAY1/exec';
const COORDINATOR_URL = 'https://script.google.com/macros/s/AKfycbyYTcl_UA4r2_9Glh-FiJ-1sF9F3xBhRtEm06v42k83MVjuJVw08J1gqR0WphWmrnGO/exec';
const ANALYSIS_URL = 'https://script.google.com/macros/s/AKfycbxZUVBypMoDDwI3hudaYEk2Dkre8iwKeqv0PBLcekfFAMPRUy0GaDYyuXC9LVNHEkE/exec';

const App: React.FC = () => {
  // --- GESTIÓN DE ESTADO ---
  const [selectedToolUrl, setSelectedToolUrl] = useState<string | null>(null);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);


  const handleReload = () => {
    if (iframeRef.current) {
      setIsReloading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  // --- LÓGICA DE RENDERIZADO ---

  // 1. Pantalla del Menú Principal
  if (!selectedToolUrl) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-sans">
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                 <h1 className="text-xl font-bold text-slate-900">
                  Gestión Campaña IVC 2026
                </h1>
                <div className="flex items-center gap-4">
                  <a
                    href="https://wa.me/573122060787"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    <WhatsAppIcon />
                    Ayuda
                  </a>
                </div>
            </div>
        </header>

        <main className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Menú Principal
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Bienvenido. Selecciona una herramienta para continuar.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card
              onClick={() => {
                setIsReloading(true);
                setSelectedToolUrl(TUTOR_URL);
              }}
              title={<><TutorIcon /> Herramienta para Coordinadores 👨‍🏫</>}
              subtitle="Base de Datos Voluntarios"
              description="Utiliza esta interfaz para gestionar el trabajo con los voluntarios."
            />
            <Card
              onClick={() => {
                setIsReloading(true);
                setSelectedToolUrl(COORDINATOR_URL);
              }}
              title={<><DashboardIcon /> Resultados Históricos 👨‍💻📊</>}
              subtitle="Seguimiento y Analítica"
              description="Visualiza los resultados electorales históricos del PH, el progreso y los reportes cualitativos de opinión."
            />
             <Card
              onClick={() => {
                setIsReloading(true);
                setSelectedToolUrl(ANALYSIS_URL);
              }}
              title={<><AnalysisIcon /> Tablas de Análisis Granular 📋</>}
              subtitle="Filtro de datos y consultas cruzadas"
              description="Construye vistas de tablas detalladas para el análisis granular del perfil de los votantes."
            />
          </div>
        </main>
        <footer className="text-center py-6">
          <p className="text-sm text-slate-500">© Sistematización campaña Iván Cepeta 2026 - Antioquia.</p>
        </footer>
      </div>
    );
  }

  // 2. Vista del Iframe (Herramienta seleccionada)
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="flex-shrink-0 mb-4 flex items-center gap-4">
        <button
          onClick={() => setSelectedToolUrl(null)}
          className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
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
        src={selectedToolUrl}
        className="flex-grow w-full border-2 border-slate-200 rounded-xl"
        title="Herramienta de gestión"
        onLoad={() => setIsReloading(false)}
      />
    </div>
  );
};

export default App;