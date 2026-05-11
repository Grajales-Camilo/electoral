import { useState, useEffect } from 'react';

interface BackgroundOptimizationOptions {
  mobileImageSizeLimit?: number; // MB
  timeoutMs?: number;
  useGradientFallback?: boolean;
}

export const useBackgroundOptimization = (options: BackgroundOptimizationOptions = {}) => {
  const {
    mobileImageSizeLimit = 2, // 2MB limit for mobile
    timeoutMs = 3000, // 3 second timeout
    useGradientFallback = true
  } = options;

  const [shouldUseImage, setShouldUseImage] = useState<boolean>(true);
  const [isSlowConnection, setIsSlowConnection] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Detect mobile device
    const checkDevice = () => {
      const isMobileDevice = window.innerWidth <= 768 || 
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      
      // Check connection quality
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          const isSlowConn = connection.effectiveType === 'slow-2g' || 
                           connection.effectiveType === '2g' ||
                           connection.saveData === true;
          setIsSlowConnection(isSlowConn);
          
          // If slow connection on mobile, disable background image
          if (isMobileDevice && isSlowConn && useGradientFallback) {
            setShouldUseImage(false);
          }
        }
      }

      // Battery API check for low battery
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          if (battery.level < 0.2 && !battery.charging && isMobileDevice) {
            setShouldUseImage(false); // Disable background image on low battery
          }
        }).catch(() => {
          // Battery API not supported, continue normally
        });
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, [useGradientFallback]);

  return {
    shouldUseImage,
    isMobile,
    isSlowConnection,
    forceGradient: () => setShouldUseImage(false),
    forceImage: () => setShouldUseImage(true)
  };
};