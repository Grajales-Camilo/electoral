import React from 'react';
import { AmvaGrowthCharts } from './InsightCharts';

const AnalisisAMVA: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Expansion metropolitana</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">AMVA: crecimiento, transferencia y escala</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
          La lectura metropolitana compara primera y segunda vuelta presidencial. Conserva los
          nombres historicos de candidatos, pero traduce el hallazgo en una decision de producto:
          donde conviene persuadir, donde conviene movilizar y donde cada punto adicional produce
          mas votos.
        </p>
      </section>

      <AmvaGrowthCharts />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-bold text-slate-900">Volumen</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Medellin, Bello e Itagui concentran el mayor retorno en votos absolutos; requieren
            cobertura operativa, testigos y seguimiento por puestos.
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-bold text-slate-900">Elasticidad</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Caldas, Girardota, Envigado y Sabaneta muestran saltos porcentuales altos; son
            territorios utiles para probar mensajes de persuasion.
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-bold text-slate-900">Decision</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Separar municipios de volumen y municipios elasticos evita una campaña uniforme y
            permite asignar recursos por retorno esperado.
          </p>
        </article>
      </section>
    </div>
  );
};

export default AnalisisAMVA;
