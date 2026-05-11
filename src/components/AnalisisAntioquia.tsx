import React from 'react';
import { AntioquiaOpportunityCharts } from './InsightCharts';

const AnalisisAntioquia: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Diagnostico territorial</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Antioquia: donde crecer y donde defender</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
          El analisis cruza resultados legislativos de 2022, votos validos por municipio y
          geometria territorial. El objetivo no es solo mostrar donde el Partido Amarillo tiene
          porcentajes altos, sino separar afinidad, volumen y oportunidad operativa.
        </p>
      </section>

      <AntioquiaOpportunityCharts />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-bold text-slate-900">Insight 1</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Los municipios pequeños con alto porcentaje sirven como laboratorio de mensaje y
            organizacion, pero no deben absorber toda la inversion.
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-bold text-slate-900">Insight 2</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            La oportunidad real esta en municipios medianos y grandes: pocos puntos adicionales
            generan mas votos netos que grandes saltos en plazas pequeñas.
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-bold text-slate-900">Accion recomendada</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Combinar aprendizaje de municipios de alta afinidad con despliegue intensivo en
            territorios de mayor censo electoral.
          </p>
        </article>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <h3 className="text-lg font-bold text-slate-900">Metodologia resumida</h3>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          Se limpiaron CSV electorales, se normalizaron nombres territoriales, se calcularon
          proporciones sobre votos validos, se empataron los datos contra GeoJSON y se generaron
          reportes de union para controlar errores de codificacion o nomenclatura.
        </p>
      </section>
    </div>
  );
};

export default AnalisisAntioquia;
