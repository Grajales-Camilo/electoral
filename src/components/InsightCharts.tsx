import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar, Scatter } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Tooltip, Legend, Title);

const amber = '#f2b705';
const amberDark = '#b77900';
const graphite = '#1f2937';
const blue = '#38a3d1';
const grid = '#e5e7eb';

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: graphite,
        boxWidth: 14,
      },
    },
    tooltip: {
      backgroundColor: '#111827',
      padding: 12,
      titleColor: '#fff7cc',
      bodyColor: '#f9fafb',
    },
  },
  scales: {
    x: {
      grid: { color: grid },
      ticks: { color: graphite },
    },
    y: {
      grid: { color: grid },
      ticks: { color: graphite },
    },
  },
};

const percentTick = (value: string | number) => `${value}%`;

const ChartShell: React.FC<{ title: string; insight: string; children: React.ReactNode }> = ({
  title,
  insight,
  children,
}) => (
  <section className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
    <div className="mb-3">
      <h4 className="text-base font-bold text-slate-900">{title}</h4>
      <p className="mt-1 text-sm leading-6 text-slate-600">{insight}</p>
    </div>
    <div className="h-80">{children}</div>
  </section>
);

export const AntioquiaOpportunityCharts: React.FC = () => {
  const top = [
    ['Maceo', 48],
    ['La Pintada', 48],
    ['Puerto Nare', 47],
    ['Montebello', 44],
    ['La Estrella', 38],
    ['Segovia', 20],
    ['Apartado', 18],
    ['Copacabana', 18],
    ['Turbo', 17],
  ];

  const bottom = [
    ['Vigia del Fuerte', 0.3],
    ['Campamento', 0.6],
    ['Betania', 1.2],
    ['Abriaqui', 1.3],
    ['Belmira', 2.0],
    ['Briceño', 2.2],
    ['Cañasgordas', 2.3],
    ['Concepcion', 2.4],
    ['Peque', 2.5],
    ['Tarso', 2.6],
  ];

  const scatter = [
    { x: 1200, y: 9.9, label: 'Maceo' },
    { x: 4300, y: 12.0, label: 'La Pintada' },
    { x: 6400, y: 14.3, label: 'Puerto Nare' },
    { x: 17000, y: 12.1, label: 'Montebello' },
    { x: 50000, y: 8.1, label: 'Apartado' },
    { x: 63000, y: 7.0, label: 'Bello' },
    { x: 108000, y: 8.5, label: 'Itagui' },
    { x: 117000, y: 10.4, label: 'Medellin' },
    { x: 147000, y: 11.3, label: 'Valle de Aburra' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <ChartShell
        title="Top municipal por proporcion de voto"
        insight="Los porcentajes mas altos aparecen en municipios pequeños; son laboratorios utiles, pero no siempre mueven el resultado departamental."
      >
        <Bar
          options={{
            ...baseOptions,
            indexAxis: 'y' as const,
            scales: {
              ...baseOptions.scales,
              x: { ...baseOptions.scales.x, ticks: { color: graphite, callback: percentTick } },
            },
          }}
          data={{
            labels: top.map(([name]) => name),
            datasets: [
              {
                label: '% Partido Amarillo',
                data: top.map(([, value]) => value),
                backgroundColor: amber,
                borderColor: amberDark,
                borderWidth: 1,
              },
            ],
          }}
        />
      </ChartShell>

      <ChartShell
        title="Municipios con menor penetracion"
        insight="La baja participacion muestra territorios donde la marca requiere presencia basica antes de invertir en persuasion masiva."
      >
        <Bar
          options={{
            ...baseOptions,
            indexAxis: 'y' as const,
            scales: {
              ...baseOptions.scales,
              x: { ...baseOptions.scales.x, ticks: { color: graphite, callback: percentTick } },
            },
          }}
          data={{
            labels: bottom.map(([name]) => name),
            datasets: [
              {
                label: '% Partido Amarillo',
                data: bottom.map(([, value]) => value),
                backgroundColor: '#fde68a',
                borderColor: amberDark,
                borderWidth: 1,
              },
            ],
          }}
        />
      </ChartShell>

      <div className="xl:col-span-2">
        <ChartShell
          title="Tamaño electoral vs participacion"
          insight="La decision ejecutiva no es perseguir solo porcentajes altos: subir pocos puntos en municipios grandes produce mas votos netos."
        >
          <Scatter
            options={{
              ...baseOptions,
              parsing: false,
              scales: {
                x: {
                  type: 'linear' as const,
                  grid: { color: grid },
                  ticks: { color: graphite },
                  title: { display: true, text: 'Votos totales al Senado', color: graphite },
                },
                y: {
                  grid: { color: grid },
                  ticks: { color: graphite, callback: percentTick },
                  title: { display: true, text: '% Partido Amarillo', color: graphite },
                },
              },
              plugins: {
                ...baseOptions.plugins,
                tooltip: {
                  ...baseOptions.plugins.tooltip,
                  callbacks: {
                    label: (context: any) => {
                      const item = scatter[context.dataIndex];
                      return `${item.label}: ${item.y}% con ${item.x.toLocaleString('es-CO')} votos`;
                    },
                  },
                },
              },
            }}
            data={{
              datasets: [
                {
                  label: 'Municipios',
                  data: scatter,
                  backgroundColor: amber,
                  borderColor: amberDark,
                  pointRadius: 6,
                },
              ],
            }}
          />
        </ChartShell>
      </div>
    </div>
  );
};

export const AmvaGrowthCharts: React.FC = () => {
  const rows = [
    ['Medellin', 7.6, 20.1, 130575, 169],
    ['Bello', 8.8, 26.4, 25834, 162],
    ['Itagui', 6.8, 21.5, 19804, 206],
    ['Envigado', 5.2, 17.9, 18038, 230],
    ['Copacabana', 8.9, 26.4, 6116, 184],
    ['Sabaneta', 6.0, 20.1, 6238, 221],
    ['Caldas', 6.2, 26.7, 6216, 263],
    ['Girardota', 7.7, 26.5, 4633, 232],
    ['La Estrella', 6.7, 22.7, 4872, 220],
    ['Barbosa', 7.7, 21.6, 2789, 176],
  ];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <ChartShell
        title="Primera vs segunda vuelta"
        insight="El salto metropolitano confirma una audiencia persuasible que puede activarse con mensajes y vocerias locales."
      >
        <Bar
          options={{
            ...baseOptions,
            scales: {
              ...baseOptions.scales,
              y: { ...baseOptions.scales.y, ticks: { color: graphite, callback: percentTick } },
            },
          }}
          data={{
            labels: rows.map(([name]) => name),
            datasets: [
              {
                label: '% 1a vuelta',
                data: rows.map(([, first]) => first),
                backgroundColor: amber,
              },
              {
                label: '% 2a vuelta',
                data: rows.map(([, , second]) => second),
                backgroundColor: blue,
              },
            ],
          }}
        />
      </ChartShell>

      <ChartShell
        title="Crecimiento absoluto en votos"
        insight="Medellin concentra el volumen; Bello, Itagui y Envigado son los siguientes puntos de impacto operativo."
      >
        <Bar
          options={baseOptions}
          data={{
            labels: rows.map(([name]) => name),
            datasets: [
              {
                label: 'Votos adicionales',
                data: rows.map(([, , , votes]) => votes),
                backgroundColor: amber,
                borderColor: amberDark,
                borderWidth: 1,
              },
            ],
          }}
        />
      </ChartShell>
    </div>
  );
};

export const MedellinConcentrationCharts: React.FC = () => {
  const comunaPct = [
    ['Presidios', 29.8],
    ['Robledo', 20.5],
    ['Estadio', 19.7],
    ['Castilla', 19.5],
    ['Santa Cruz', 19.4],
    ['Manrique', 19.0],
    ['Buenos Aires', 18.8],
    ['Popular', 18.0],
    ['Aranjuez', 17.8],
    ['La Candelaria', 17.6],
  ];

  const comunaVotes = [
    ['Belen', 12100],
    ['Robledo', 10000],
    ['Buenos Aires', 8900],
    ['Castilla', 8600],
    ['La Candelaria', 8600],
    ['Estadio', 8200],
    ['Aranjuez', 7800],
    ['Doce de Octubre', 7600],
    ['La America', 7400],
    ['Laureles-Estadio', 7200],
  ];

  const zonas = [
    ['Zona 98', 66],
    ['Zona 1', 48],
    ['Zona 2', 45],
    ['Zona 14', 44.5],
    ['Zona 8', 44.4],
    ['Zona 3', 43.5],
    ['Zona 5', 43.4],
    ['Zona 4', 42.5],
    ['Zona 15', 42.4],
    ['Zona 11', 42.0],
  ];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <ChartShell
        title="Comunas con mayor proporcion"
        insight="Las comunas con mayor afinidad permiten diseñar fidelizacion, liderazgos barriales y mensajes de pertenencia."
      >
        <Bar
          options={{
            ...baseOptions,
            indexAxis: 'y' as const,
            scales: {
              ...baseOptions.scales,
              x: { ...baseOptions.scales.x, ticks: { color: graphite, callback: percentTick } },
            },
          }}
          data={{
            labels: comunaPct.map(([name]) => name),
            datasets: [{ label: '% Partido Amarillo', data: comunaPct.map(([, value]) => value), backgroundColor: amber }],
          }}
        />
      </ChartShell>

      <ChartShell
        title="Comunas con mayor volumen"
        insight="El volumen cambia la prioridad: Belen, Robledo y Buenos Aires son territorios donde cada punto pesa mas."
      >
        <Bar
          options={{ ...baseOptions, indexAxis: 'y' as const }}
          data={{
            labels: comunaVotes.map(([name]) => name),
            datasets: [{ label: 'Votos Partido Amarillo', data: comunaVotes.map(([, value]) => value), backgroundColor: '#fbbf24' }],
          }}
        />
      </ChartShell>

      <div className="xl:col-span-2">
        <ChartShell
          title="Zonas con mayor apoyo presidencial en segunda vuelta"
          insight="Las zonas por encima del promedio son puntos de retencion y aprendizaje para ampliar la base urbana."
        >
          <Bar
            options={{
              ...baseOptions,
              indexAxis: 'y' as const,
              scales: {
                ...baseOptions.scales,
                x: { ...baseOptions.scales.x, ticks: { color: graphite, callback: percentTick } },
              },
            }}
            data={{
              labels: zonas.map(([name]) => name),
              datasets: [{ label: '% Gustavo Petro (2022)', data: zonas.map(([, value]) => value), backgroundColor: blue }],
            }}
          />
        </ChartShell>
      </div>
    </div>
  );
};
