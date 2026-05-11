import React from 'react';
import { MedellinConcentrationCharts } from './InsightCharts';

const AnalisisMedellin: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Perfil urbano</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Medellin: afinidad por comuna y volumen electoral</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
          El analisis de Medellin combina proporcion y votos absolutos para evitar una lectura
          incompleta. Las zonas de alta afinidad ayudan a defender base; las comunas de alto
          volumen definen donde una mejora pequeña cambia el resultado.
        </p>
      </section>

      <MedellinConcentrationCharts />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-bold text-slate-900">Fidelizacion</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Robledo, Castilla, Santa Cruz, Manrique y Buenos Aires son territorios para sostener
            liderazgos comunitarios y evitar desmovilizacion.
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-bold text-slate-900">Persuasion</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Comunas intermedias con alto censo pueden crecer si la campaña conecta seguridad,
            movilidad y oportunidades economicas con propuestas verificables.
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-bold text-slate-900">Operativo</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            La plataforma permite priorizar territorio, mensaje y voluntariado con base en datos,
            no por intuicion ni por presencia historica.
          </p>
        </article>
      </section>
    </div>
  );
};

export default AnalisisMedellin;
