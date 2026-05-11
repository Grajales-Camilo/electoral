import { useState, useEffect, useCallback } from 'react';

// Definir breakpoints que coincidan con nuestro design system
const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;

interface ViewportDimensions {
  width: number;
  height: number;
}

interface ResponsiveState {
  // Dimensiones actuales
  width: number;
  height: number;
  
  // Breakpoints booleanos
  isXs: boolean;      // 320px-479px
  isSm: boolean;      // 480px-767px
  isMd: boolean;      // 768px-1023px
  isLg: boolean;      // 1024px-1279px
  isXl: boolean;      // 1280px-1535px
  is2Xl: boolean;     // 1536px+
  
  // Categorías principales
  isMobile: boolean;      // xs + sm (320-767px)
  isTablet: boolean;      // md (768-1023px)
  isDesktop: boolean;     // lg+ (1024px+)
  isLargeDesktop: boolean; // xl+ (1280px+)
  
  // Orientación y características
  orientation: 'portrait' | 'landscape';
  isPortrait: boolean;
  isLandscape: boolean;
  
  // Altura específica
  isSmallHeight: boolean;    // < 600px
  isMediumHeight: boolean;   // 600-900px
  isLargeHeight: boolean;    // > 900px
  
  // Utilidades de comparación
  isAtLeast: (breakpoint: BreakpointKey) => boolean;
  isAtMost: (breakpoint: BreakpointKey) => boolean;
  isBetween: (min: BreakpointKey, max: BreakpointKey) => boolean;
  
  // Device detection (aproximado)
  isProbablyMobile: boolean;
  isProbablyTablet: boolean;
  isProbablyDesktop: boolean;
  
  // Características específicas para UX
  canHover: boolean;          // Dispositivo con hover capability
  hasCoarsePointer: boolean;  // Touch device
  prefersReducedMotion: boolean;
}

// Función para debounce - evita re-renders excesivos
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Hook principal
export function useResponsive(): ResponsiveState {
  const [dimensions, setDimensions] = useState<ViewportDimensions>(() => {
    // Solo en el cliente, no en SSR
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  // Media queries para características del dispositivo
  const [deviceCapabilities, setDeviceCapabilities] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        canHover: false,
        hasCoarsePointer: false,
        prefersReducedMotion: false,
      };
    }

    return {
      canHover: window.matchMedia('(hover: hover)').matches,
      hasCoarsePointer: window.matchMedia('(pointer: coarse)').matches,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });

  // Manejar cambios de tamaño de ventana
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = debounce(() => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 150); // 150ms de debounce para mejor performance

    // Escuchar cambios de media queries
    const mediaQueries = {
      canHover: window.matchMedia('(hover: hover)'),
      hasCoarsePointer: window.matchMedia('(pointer: coarse)'),
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
    };

    const handleMediaChange = () => {
      setDeviceCapabilities({
        canHover: mediaQueries.canHover.matches,
        hasCoarsePointer: mediaQueries.hasCoarsePointer.matches,
        prefersReducedMotion: mediaQueries.prefersReducedMotion.matches,
      });
    };

    // Agregar listeners
    window.addEventListener('resize', handleResize);
    Object.values(mediaQueries).forEach(mq => {
      mq.addEventListener('change', handleMediaChange);
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      Object.values(mediaQueries).forEach(mq => {
        mq.removeEventListener('change', handleMediaChange);
      });
    };
  }, []);

  // Funciones de utilidad
  const isAtLeast = useCallback((breakpoint: BreakpointKey): boolean => {
    return dimensions.width >= BREAKPOINTS[breakpoint];
  }, [dimensions.width]);

  const isAtMost = useCallback((breakpoint: BreakpointKey): boolean => {
    return dimensions.width <= BREAKPOINTS[breakpoint];
  }, [dimensions.width]);

  const isBetween = useCallback((min: BreakpointKey, max: BreakpointKey): boolean => {
    return dimensions.width >= BREAKPOINTS[min] && dimensions.width <= BREAKPOINTS[max];
  }, [dimensions.width]);

  // Calcular estado responsivo
  const responsiveState: ResponsiveState = {
    // Dimensiones
    width: dimensions.width,
    height: dimensions.height,

    // Breakpoints individuales
    isXs: isBetween('xs', 'sm'),
    isSm: isBetween('sm', 'md'),
    isMd: isBetween('md', 'lg'),
    isLg: isBetween('lg', 'xl'),
    isXl: isBetween('xl', '2xl'),
    is2Xl: isAtLeast('2xl'),

    // Categorías principales
    isMobile: dimensions.width < BREAKPOINTS.md,
    isTablet: isBetween('md', 'lg'),
    isDesktop: isAtLeast('lg'),
    isLargeDesktop: isAtLeast('xl'),

    // Orientación
    orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait',
    isPortrait: dimensions.height > dimensions.width,
    isLandscape: dimensions.width > dimensions.height,

    // Altura
    isSmallHeight: dimensions.height < 600,
    isMediumHeight: dimensions.height >= 600 && dimensions.height <= 900,
    isLargeHeight: dimensions.height > 900,

    // Funciones de utilidad
    isAtLeast,
    isAtMost,
    isBetween,

    // Device detection aproximado
    isProbablyMobile: dimensions.width < BREAKPOINTS.md && deviceCapabilities.hasCoarsePointer,
    isProbablyTablet: isBetween('md', 'lg') && deviceCapabilities.hasCoarsePointer,
    isProbablyDesktop: isAtLeast('lg') && !deviceCapabilities.hasCoarsePointer,

    // Características del dispositivo
    ...deviceCapabilities,
  };

  return responsiveState;
}

// Hook simplificado para casos básicos
export function useIsMobile(): boolean {
  const { isMobile } = useResponsive();
  return isMobile;
}

// Hook para detectar si estamos en modo "touch"
export function useIsTouchDevice(): boolean {
  const { hasCoarsePointer } = useResponsive();
  return hasCoarsePointer;
}

// Hook para obtener el container apropiado según el dispositivo
export function useContainerClass(): string {
  const { isMobile, isTablet } = useResponsive();
  
  if (isMobile) return 'container-mobile';
  if (isTablet) return 'container-tablet';
  return 'container-desktop';
}

// Exportar breakpoints para uso directo si es necesario
export { BREAKPOINTS };