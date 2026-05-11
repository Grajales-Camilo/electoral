import React, { useState, useRef, useEffect } from 'react';

interface Tab {
  id: string;
  label: string;
  shortLabel?: string; // Para móvil
  icon?: React.ReactNode;
}

interface ResponsiveTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const ResponsiveTabs: React.FC<ResponsiveTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ""
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  // Auto-scroll al tab activo en móvil
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeButton = scrollContainerRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }, [activeTab]);

  return (
    <div className={`relative ${className}`}>
      {/* Desktop: Tabs normales */}
      <div className="hidden md:flex items-center justify-center gap-1 p-1 bg-slate-100 rounded-lg w-full">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>

      {/* Mobile: Scroll horizontal + dropdown como fallback */}
      <div className="md:hidden">
        {/* Scroll horizontal en móvil */}
        <div 
          ref={scrollContainerRef}
          className="flex justify-center gap-2 overflow-x-auto scrollbar-hide pb-1 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-shrink-0 px-5 py-3 text-sm font-semibold rounded-lg transition-all duration-300 border-2 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-lg border-amber-500 transform scale-105'
                  : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-800 border-slate-200 hover:border-amber-300'
              }`}
            >
              <span className="whitespace-nowrap">
                {tab.shortLabel || tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Indicador de scroll */}
        <div className="flex justify-center mt-2">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <div
                key={`dot-${tab.id}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  activeTab === tab.id ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
}> = ({ tab, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 border-2 min-w-[120px] ${
      isActive
        ? 'bg-white text-amber-700 shadow-lg border-amber-500 transform scale-105'
        : 'text-slate-700 hover:text-amber-800 hover:bg-amber-50 border-slate-200 hover:border-amber-300'
    }`}
  >
    <span className="whitespace-nowrap">{tab.label}</span>
  </button>
);

// CSS personalizado para ocultar scrollbar
const style = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
