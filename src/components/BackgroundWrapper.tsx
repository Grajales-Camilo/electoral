import React, { useState, useEffect, useMemo, memo } from 'react';
import { useBackgroundOptimization } from '../hooks/useBackgroundOptimization';

interface BackgroundWrapperProps {
  children: React.ReactNode;
  overlayType?: 'maps' | 'text' | 'default';
  className?: string;
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = memo(({
  children,
  overlayType = 'default',
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const { shouldUseImage, isMobile, isSlowConnection } = useBackgroundOptimization({
    mobileImageSizeLimit: 2,
    timeoutMs: 2000,
    useGradientFallback: true
  });

  // Precargar la imagen apropiada solo si debe usarse
  useEffect(() => {
    // Si no debemos usar imagen (conexión lenta, batería baja, etc.), usar gradiente
    if (!shouldUseImage) {
      setImageLoaded(false);
      return;
    }

    const img = new Image();
    const imageSrc = isMobile ? 'images/fondo.jpg' : 'images/fondodesk.png';
    
    // Timeout más corto para móviles
    const loadTimeout = setTimeout(() => {
      if (!imageLoaded) {
        // En lugar de cambiar estado, simplemente no mostrar la imagen
        console.log('Background image load timeout, using gradient fallback');
      }
    }, isMobile ? 1500 : 3000);
    
    img.onload = () => {
      clearTimeout(loadTimeout);
      setImageLoaded(true);
    };
    
    img.onerror = () => {
      clearTimeout(loadTimeout);
      console.log('Background image failed to load, using gradient fallback');
      setImageLoaded(false);
    };
    
    // Configurar la imagen para carga optimizada
    if (isMobile) {
      img.loading = 'lazy';
      img.decoding = 'async';
    } else {
      img.loading = 'eager';
    }
    
    img.src = imageSrc;

    return () => {
      clearTimeout(loadTimeout);
    };
  }, [shouldUseImage, isMobile, imageLoaded]);

  // Configurar overlay según el tipo de contenido con useMemo
  const overlayClass = useMemo(() => {
    switch (overlayType) {
      case 'maps':
        return 'bg-gradient-to-br from-slate-950/65 via-amber-700/60 to-yellow-500/45';
      case 'text':
        return 'bg-gradient-to-br from-slate-950/65 via-amber-800/55 to-yellow-600/45';
      default:
        return 'bg-gradient-to-br from-slate-950/60 via-amber-700/55 to-yellow-500/40';
    }
  }, [overlayType]);

  const imageSrc = useMemo(() => 
    isMobile ? 'images/fondo.jpg' : 'images/fondodesk.png', 
    [isMobile]
  );

  // Gradiente de fondo optimizado para móviles
  const gradientBackground = useMemo(() => ({
    background: `linear-gradient(135deg, 
      #667eea 0%, 
      #764ba2 25%, 
      #f093fb 50%, 
      #f5576c 75%, 
      #4facfe 100%)`
  }), []);

  return (
    <div 
      className={`relative min-h-screen ${className}`}
      style={{ 
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh'
      }}
    >
      {/* Capa 1: Imagen de fondo COMPLETAMENTE ESTÁTICA */}
      {shouldUseImage && imageLoaded ? (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: `url('${imageSrc}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: isMobile ? 'scroll' : 'fixed',
            zIndex: -2,
            opacity: 1,
            transform: 'translateZ(0)', // GPU pero sin translate3d que puede mover
            willChange: 'auto' // No forzar cambios
          }}
        />
      ) : (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -2,
            ...gradientBackground
          }}
        />
      )}
      
      {/* Indicador de conexión lenta (opcional) */}
      {isSlowConnection && isMobile && (
        <div className="fixed top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
          Modo ahorro
        </div>
      )}
      
      {/* Capa 2: Overlay semitransparente */}
      <div 
        className={`fixed inset-0 ${overlayClass}`} 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1 
        }} 
      />
      
      {/* Capa 3: Contenido */}
      <div 
        className="relative min-h-screen"
        style={{ 
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh'
        }}
      >
        {children}
      </div>
    </div>
  );
});

// Hook personalizado para detectar el tipo de dispositivo
export const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = window.innerWidth <= 768 || 
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile };
};
