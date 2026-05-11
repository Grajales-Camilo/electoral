import React, { useState } from 'react';
import { MenuIcon, CloseIcon } from './icons';

interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  children?: React.ReactNode;
  onNavigateToResultados?: () => void;
  onNavigateToVoluntarios?: () => void;
  onNavigateToVotantes?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  title, 
  onBack, 
  showBackButton = false,
  children,
  onNavigateToResultados,
  onNavigateToVoluntarios,
  onNavigateToVotantes
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Header fijo con mejor UX móvil */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/30" style={{ zIndex: 9999 }}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Lado izquierdo - Navegación */}
            <div className="flex items-center gap-3">
              {showBackButton ? (
                <button
                  onClick={onBack}
                  className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
                  aria-label="Volver"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors md:hidden"
                  aria-label="Abrir menú"
                >
                  <MenuIcon />
                </button>
              )}
              
              <h1 className="text-lg font-bold text-slate-900 truncate">
                {title}
              </h1>
            </div>

            {/* Lado derecho - Acciones */}
            <div className="flex items-center gap-2" />
          </div>
          
          {/* Contenido adicional del header (tabs, filtros) */}
          {children && (
            <div className="mt-3 -mx-1">
              {children}
            </div>
          )}
        </div>
      </header>

      {/* Drawer móvil */}
      <div className={`fixed inset-0 md:hidden ${isMenuOpen ? 'block' : 'hidden'}`} style={{ zIndex: 10000 }}>
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Drawer content */}
        <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Partido Amarillo</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100"
            >
              <CloseIcon />
            </button>
          </div>
          
          <nav className="p-4 space-y-2">
            <NavItem
              icon="📊"
              title="Diagnostico territorial"
              description="Análisis electoral"
              onClick={() => {
                setIsMenuOpen(false);
                onNavigateToResultados?.();
              }}
            />
            <NavItem
              icon="🤳"
              title="Red de voluntariado"
              description="Cobertura agregada"
              onClick={() => {
                setIsMenuOpen(false);
                onNavigateToVoluntarios?.();
              }}
            />
            <NavItem
              icon="📋"
              title="Perfil de votantes"
              description="Análisis y filtros"
              onClick={() => {
                setIsMenuOpen(false);
                onNavigateToVotantes?.();
              }}
            />
          </nav>
        </div>
      </div>
    </>
  );
};

const NavItem: React.FC<{
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full p-3 text-left rounded-lg hover:bg-slate-50 transition-colors group"
  >
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="font-semibold text-slate-900 group-hover:text-amber-700">
          {title}
        </div>
        <div className="text-sm text-slate-500">
          {description}
        </div>
      </div>
    </div>
  </button>
);
