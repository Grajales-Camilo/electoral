import React, { useEffect } from 'react';
import { CloseIcon } from './icons';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true
}) => {
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl', 
    xl: 'max-w-6xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay con blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Container del modal */}
      <div className="relative h-full flex items-center justify-center p-4">
        <div 
          className={`
            relative w-full ${sizeClasses[size]} 
            bg-white rounded-xl shadow-2xl 
            flex flex-col
            max-h-[90vh] md:max-h-[85vh]
            transform transition-all duration-300 ease-out
            animate-in slide-in-from-bottom-4 fade-in-0
          `}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 pr-8">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Cerrar modal"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-grow overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de modal simplificado para móvil (slide-up)
export const MobileModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative h-full flex flex-col justify-end">
        <div 
          className="
            bg-white rounded-t-2xl shadow-2xl 
            max-h-[85vh] flex flex-col
            transform transition-all duration-300 ease-out
            animate-in slide-in-from-bottom-full
          "
          onClick={e => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
            <div className="w-8 h-1 bg-slate-300 rounded-full" />
          </div>
          
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-grow overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook para detectar si estamos en móvil
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};