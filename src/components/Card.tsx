import React, { useState, useCallback, memo } from 'react';

interface CardProps {
  title: string;
  subtitle: string;
  description: string;
  onClick: () => void;
  imageUrl: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = memo(({ 
  title, 
  subtitle, 
  description, 
  onClick, 
  imageUrl, 
  icon,
  badge,
  disabled = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [disabled, onClick]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        group relative bg-gradient-to-br from-slate-50/85 to-slate-100/75 dark:bg-gradient-to-br dark:from-slate-600/55 dark:to-slate-500/45 backdrop-blur-md border border-slate-200/50 dark:border-slate-600/40 rounded-2xl 
        shadow-lg shadow-slate-900/10 hover:shadow-xl
        hover:-translate-y-1 hover:from-slate-50/90 hover:to-slate-100/80 dark:hover:from-slate-600/60 dark:hover:to-slate-500/50 active:scale-98
        transition-all duration-300 ease-out
        p-4 sm:p-5 md:p-6 flex flex-col text-left
        focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={`Acceder a ${title}`}
    >
      {/* Imagen con loading state */}
      <div className="relative mb-4 sm:mb-6 overflow-hidden rounded-xl bg-gradient-to-b from-slate-200/25 to-transparent backdrop-blur-sm">
        {!imageLoaded && !imageError && (
          <div className="w-full h-32 sm:h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-indigo-500 border-t-transparent"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-32 sm:h-48 flex items-center justify-center bg-slate-200/30 dark:bg-slate-600/30 text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">🖼️</div>
              <div className="text-xs sm:text-sm">Imagen no disponible</div>
            </div>
          </div>
        ) : (
          <img 
            src={imageUrl} 
            alt={subtitle}
            className={`w-full h-32 sm:h-48 object-contain object-top transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Badge flotante delante de la imagen */}
        {badge && (
          <div className="absolute top-2 right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-300 via-amber-500 to-slate-900 rounded-full flex items-center justify-center text-white text-base sm:text-xl shadow-lg group-hover:scale-110 transition-transform z-10">
            {badge}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-grow space-y-2 sm:space-y-4">
        {/* Título */}
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors line-clamp-2">
            {title}
          </h2>
        </div>

        {/* Descripción (ahora usando el subtítulo) */}
        <p className="text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 text-xs sm:text-base leading-relaxed sm:leading-loose line-clamp-2 sm:line-clamp-3 transition-colors">
          {subtitle}
        </p>

      </div>

      {/* Efectos de hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 via-yellow-500/0 to-slate-900/0 group-hover:from-amber-500/15 group-hover:via-yellow-500/15 group-hover:to-slate-900/10 transition-all duration-300 pointer-events-none" />
    </button>
  );
});
