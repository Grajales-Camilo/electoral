import React from 'react';

interface CardProps {
  title: React.ReactNode;
  subtitle: string;
  description: string;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      // Clases simplificadas para fondo claro
      className="bg-white ring-1 ring-slate-900/5 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out p-6 md:p-8 flex flex-col text-left"
    >
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
        {title}
      </h2>
      <div className="mt-4 border-t border-slate-200 pt-4">
        <h3 className="text-lg font-semibold text-brand-blue-600">{subtitle}</h3>
        <p className="mt-2 text-slate-600 text-base leading-relaxed">{description}</p>
      </div>
    </button>
  );
};