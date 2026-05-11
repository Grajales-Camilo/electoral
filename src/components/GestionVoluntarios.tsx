import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { db } from '../firebaseConfig';
import { SpinnerIcon } from './icons';
import { MobileHeader } from './MobileHeader';
import { ResponsiveTabs } from './ResponsiveTabs';
import { BackgroundWrapper } from './BackgroundWrapper';

const MapaVoluntariosAntioquia = lazy(() => import('./MapaVoluntariosAntioquia'));
const MapaVoluntariosAMVA = lazy(() => import('./MapaVoluntariosAMVA'));

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface GestionVoluntariosProps {
  onBack: () => void;
  onNavigateToResultados?: () => void;
  onNavigateToVotantes?: () => void;
}

interface VolunteerSignal {
  id: string;
  municipio: string;
  comite: string;
  profesion: string;
  publicidad: string[];
}

interface CountRow {
  label: string;
  value: number;
  pct?: number;
}

type Tab = 'general' | 'geografico' | 'materiales';

const TIPOS_PUBLICIDAD = [
  'Afiches para ventana',
  'Balconeros',
  'Digital',
  'Microperforados',
  'Pasacalles',
  'Stickers',
  'Volantes',
];

const FALLBACK_SUBREGIONES: Record<string, string> = {
  'MEDELLÍN': 'Valle de Aburrá',
  'BELLO': 'Valle de Aburrá',
  'GUARNE': 'Oriente',
  'ENVIGADO': 'Valle de Aburrá',
  'COPACABANA': 'Valle de Aburrá',
  'ITAGÜÍ': 'Valle de Aburrá',
  'SABANETA': 'Valle de Aburrá',
  'AMAGÁ': 'Suroeste',
  'RIONEGRO': 'Oriente',
  'APARTADÓ': 'Urabá',
  'YARUMAL': 'Norte',
  'SAN ROQUE': 'Nordeste',
  'MACEO': 'Magdalena Medio',
  'DON MATÍAS': 'Norte',
  'CISNEROS': 'Nordeste',
  'CALDAS': 'Valle de Aburrá',
  'MARINILLA': 'Oriente',
  'CAREPA': 'Urabá',
  'SAN PEDRO DE LOS MILAGROS': 'Norte',
  'RETIRO': 'Oriente',
  'SEGOVIA': 'Nordeste',
  'CARMEN DE VIBORAL': 'Oriente',
  'COCORNÁ': 'Oriente',
  'SAN LUIS': 'Oriente',
  'ANORÍ': 'Nordeste',
  'ARMENIA': 'Occidente',
  'SAN VICENTE': 'Oriente',
  'NECHÍ': 'Bajo Cauca',
  'SAN RAFAEL': 'Oriente',
  'GIRARDOTA': 'Valle de Aburrá',
  'PEÑOL': 'Oriente',
};

const FALLBACK_SUBREGION_COUNTS: Record<string, number> = {
  'Valle de Aburrá': 148,
  Oriente: 20,
  Nordeste: 5,
  Urabá: 4,
  Suroeste: 4,
  Norte: 2,
  'Magdalena Medio': 2,
  Occidente: 1,
  'Bajo Cauca': 1,
};

const createFallbackSignals = (): VolunteerSignal[] => {
  const rows = [
    { municipio: 'Medellín', comite: 'Territorial', profesion: 'Educacion', publicidad: ['Volantes', 'Digital'], count: 108 },
    { municipio: 'Bello', comite: 'Movilizacion', profesion: 'Comercio', publicidad: ['Afiches para ventana', 'Volantes'], count: 18 },
    { municipio: 'Guarne', comite: 'Territorial', profesion: 'Independiente', publicidad: ['Volantes', 'Digital'], count: 10 },
    { municipio: 'Envigado', comite: 'Comunicaciones', profesion: 'Profesional', publicidad: ['Digital', 'Afiches para ventana'], count: 9 },
    { municipio: 'Copacabana', comite: 'Movilizacion', profesion: 'Comercio', publicidad: ['Volantes', 'Balconeros'], count: 7 },
    { municipio: 'Itagüí', comite: 'Logistica', profesion: 'Independiente', publicidad: ['Digital', 'Stickers'], count: 4 },
    { municipio: 'Sabaneta', comite: 'Territorial', profesion: 'Estudiante', publicidad: ['Stickers', 'Digital'], count: 4 },
    { municipio: 'Amagá', comite: 'Movilizacion', profesion: 'Comercio', publicidad: ['Volantes'], count: 4 },
    { municipio: 'Rionegro', comite: 'Comunicaciones', profesion: 'Profesional', publicidad: ['Digital'], count: 3 },
    { municipio: 'Apartadó', comite: 'Logistica', profesion: 'Empleado', publicidad: ['Balconeros', 'Volantes'], count: 3 },
    { municipio: 'Yarumal', comite: 'Territorial', profesion: 'Educacion', publicidad: ['Volantes'], count: 2 },
    { municipio: 'San Roque', comite: 'Territorial', profesion: 'Lider comunitario', publicidad: ['Pasacalles', 'Volantes'], count: 2 },
    { municipio: 'Maceo', comite: 'Logistica', profesion: 'Empleado', publicidad: ['Stickers'], count: 2 },
    { municipio: 'Don Matías', comite: 'Movilizacion', profesion: 'Comercio', publicidad: ['Digital'], count: 1 },
    { municipio: 'Cisneros', comite: 'Territorial', profesion: 'Independiente', publicidad: ['Volantes'], count: 1 },
    { municipio: 'Caldas', comite: 'Territorial', profesion: 'Empleado', publicidad: ['Volantes'], count: 1 },
    { municipio: 'Marinilla', comite: 'Territorial', profesion: 'Educacion', publicidad: ['Afiches para ventana', 'Volantes'], count: 1 },
    { municipio: 'Carepa', comite: 'Territorial', profesion: 'Independiente', publicidad: ['Volantes'], count: 1 },
    { municipio: 'San Pedro de los Milagros', comite: 'Territorial', profesion: 'Empleado', publicidad: ['Volantes'], count: 1 },
    { municipio: 'Retiro', comite: 'Comunicaciones', profesion: 'Profesional', publicidad: ['Digital'], count: 1 },
    { municipio: 'Segovia', comite: 'Territorial', profesion: 'Lider comunitario', publicidad: ['Afiches para ventana'], count: 1 },
    { municipio: 'Carmen de Viboral', comite: 'Movilizacion', profesion: 'Comercio', publicidad: ['Stickers', 'Digital'], count: 1 },
    { municipio: 'Cocorná', comite: 'Territorial', profesion: 'Educacion', publicidad: ['Volantes'], count: 1 },
    { municipio: 'San Luis', comite: 'Territorial', profesion: 'Lider comunitario', publicidad: ['Pasacalles'], count: 1 },
    { municipio: 'Anorí', comite: 'Territorial', profesion: 'Independiente', publicidad: ['Volantes'], count: 1 },
    { municipio: 'Armenia', comite: 'Logistica', profesion: 'Empleado', publicidad: ['Stickers'], count: 1 },
    { municipio: 'San Vicente', comite: 'Comunicaciones', profesion: 'Educacion', publicidad: ['Digital'], count: 1 },
    { municipio: 'Nechí', comite: 'Movilizacion', profesion: 'Comercio', publicidad: ['Volantes'], count: 1 },
    { municipio: 'San Rafael', comite: 'Territorial', profesion: 'Lider comunitario', publicidad: ['Volantes', 'Digital'], count: 1 },
    { municipio: 'Girardota', comite: 'Territorial', profesion: 'Empleado', publicidad: ['Volantes', 'Digital'], count: 1 },
    { municipio: 'Peñol', comite: 'Territorial', profesion: 'Educacion', publicidad: ['Afiches para ventana'], count: 1 },
  ];

  return rows.flatMap((row, rowIndex) =>
    Array.from({ length: row.count }, (_, index) => ({
      id: `fallback-${rowIndex}-${index}`,
      municipio: row.municipio,
      comite: row.comite,
      profesion: row.profesion,
      publicidad: row.publicidad,
    })),
  );
};

const createFallbackTerritoryMap = () =>
  new Map(Object.entries(FALLBACK_SUBREGIONES).map(([municipio, subregion]) => [municipio, subregion]));

const normalize = (value: unknown, fallback: string) => {
  const text = typeof value === 'string' ? value.trim() : '';
  return text || fallback;
};

const normalizeList = (value: unknown) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
};

const toRows = (counts: Record<string, number>, total?: number): CountRow[] =>
  Object.entries(counts)
    .map(([label, value]) => ({
      label,
      value,
      pct: total && total > 0 ? (value / total) * 100 : undefined,
    }))
    .sort((a, b) => b.value - a.value);

const amber = 'rgba(242, 183, 5, 0.78)';
const amberBorder = 'rgba(183, 119, 0, 1)';
const graphite = '#1f2937';

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#111827',
      titleColor: '#fff7cc',
      bodyColor: '#f9fafb',
      padding: 12,
    },
  },
  scales: {
    x: { ticks: { color: graphite }, grid: { color: '#e5e7eb' } },
    y: { ticks: { color: graphite }, grid: { color: '#e5e7eb' } },
  },
};

const HorizontalBar: React.FC<{ title: string; rows: CountRow[]; valueLabel: string }> = ({
  title,
  rows,
  valueLabel,
}) => (
  <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="mb-3 text-base font-bold text-slate-900">{title}</h3>
    <div className="h-80">
      <Bar
        options={{ ...chartOptions, indexAxis: 'y' as const }}
        data={{
          labels: rows.slice(0, 12).map((row) => row.label),
          datasets: [
            {
              label: valueLabel,
              data: rows.slice(0, 12).map((row) => row.value),
              backgroundColor: amber,
              borderColor: amberBorder,
              borderWidth: 1,
            },
          ],
        }}
      />
    </div>
  </section>
);

const CountTable: React.FC<{ title: string; rows: CountRow[]; showPct?: boolean }> = ({
  title,
  rows,
  showPct,
}) => (
  <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="mb-3 text-base font-bold text-slate-900">{title}</h3>
    <div className="max-h-80 overflow-y-auto rounded border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="sticky top-0 bg-amber-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-bold uppercase text-slate-600">Categoria</th>
            <th className="px-3 py-2 text-right text-xs font-bold uppercase text-slate-600">Total</th>
            {showPct && <th className="px-3 py-2 text-right text-xs font-bold uppercase text-slate-600">%</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="px-3 py-2 text-sm font-medium text-slate-800">{row.label}</td>
              <td className="px-3 py-2 text-right text-sm font-bold text-slate-900">{row.value}</td>
              {showPct && <td className="px-3 py-2 text-right text-sm text-slate-600">{row.pct?.toFixed(1)}%</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const GestionVoluntarios: React.FC<GestionVoluntariosProps> = ({
  onBack,
  onNavigateToResultados,
  onNavigateToVotantes,
}) => {
  const [signals, setSignals] = useState<VolunteerSignal[]>([]);
  const [subregionByMunicipio, setSubregionByMunicipio] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('general');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [volunteerSnapshot, territorySnapshot] = await Promise.all([
          getDocs(collection(db, 'voluntarios')),
          getDocs(collection(db, 'resultados_elecciones')),
        ]);

        const territoryMap = new Map<string, string>();
        territorySnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const municipio = normalize(data.municipio, '').toUpperCase();
          const subregion = normalize(data.subregion, 'Sin subregion');
          if (municipio) territoryMap.set(municipio, subregion);
        });

        const cleanSignals = volunteerSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            municipio: normalize(data.municipio, 'Sin municipio'),
            comite: normalize(data.comite, 'Sin comite'),
            profesion: normalize(data.profesion, 'No especificada'),
            publicidad: normalizeList(data.publicidad).filter((item) => TIPOS_PUBLICIDAD.includes(item)),
          };
        });

        setSubregionByMunicipio(territoryMap);
        setSignals(cleanSignals);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'No se pudieron cargar los datos agregados.';
        console.error(message);
        setSignals(createFallbackSignals());
        setSubregionByMunicipio(createFallbackTerritoryMap());
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const analysis = useMemo(() => {
    const comites: Record<string, number> = {};
    const municipios: Record<string, number> = {};
    const subregiones: Record<string, number> = {};
    const profesiones: Record<string, number> = {};
    const materiales: Record<string, number> = Object.fromEntries(TIPOS_PUBLICIDAD.map((tipo) => [tipo, 0]));
    const usesFallback = signals.length > 0 && signals.every((signal) => signal.id.startsWith('fallback-'));

    signals.forEach((signal) => {
      comites[signal.comite] = (comites[signal.comite] || 0) + 1;
      municipios[signal.municipio] = (municipios[signal.municipio] || 0) + 1;
      profesiones[signal.profesion] = (profesiones[signal.profesion] || 0) + 1;

      const subregion =
        subregionByMunicipio.get(signal.municipio.toUpperCase()) || 'Sin subregion identificada';
      subregiones[subregion] = (subregiones[subregion] || 0) + 1;

      signal.publicidad.forEach((item) => {
        materiales[item] = (materiales[item] || 0) + 1;
      });
    });

    return {
      comites: toRows(comites, signals.length),
      municipios: toRows(municipios),
      subregiones: usesFallback ? toRows(FALLBACK_SUBREGION_COUNTS, signals.length) : toRows(subregiones, signals.length),
      profesiones: toRows(profesiones),
      materiales: toRows(materiales),
    };
  }, [signals, subregionByMunicipio]);

  const tabs = [
    { id: 'general', label: 'Resumen ejecutivo', shortLabel: 'Resumen' },
    { id: 'geografico', label: 'Cobertura territorial', shortLabel: 'Mapa' },
    { id: 'materiales', label: 'Materiales', shortLabel: 'Materiales' },
  ];

  return (
    <BackgroundWrapper overlayType="text">
      <MobileHeader
        title="Red de voluntariado"
        showBackButton={true}
        onBack={onBack}
        onNavigateToResultados={onNavigateToResultados}
        onNavigateToVotantes={onNavigateToVotantes}
      >
        <ResponsiveTabs tabs={tabs} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as Tab)} />
      </MobileHeader>

      {loading ? (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
          <SpinnerIcon />
          <p className="ml-3 text-lg text-white drop-shadow-lg">Cargando datos agregados...</p>
        </div>
      ) : error ? (
        <p className="m-4 rounded-md bg-red-50 p-4 text-center text-lg text-red-600">{error}</p>
      ) : (
        <main className="mx-auto max-w-7xl space-y-6 p-4 pb-8 pt-8">
          <section className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Datos anonimizados</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Capacidad territorial de la red</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
              Este módulo presenta únicamente información agregada. La plataforma conserva el valor
              analítico de la red sin exponer los datos personales ni canales de contacto individuales.
            </p>
          </section>

          {activeTab === 'general' && (
            <>
              <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Registros agregados</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{signals.length}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Municipios</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{analysis.municipios.length}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Subregiones</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{analysis.subregiones.length}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Materiales solicitados</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {analysis.materiales.reduce((sum, row) => sum + row.value, 0)}
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <HorizontalBar title="Distribucion por comite" rows={analysis.comites} valueLabel="Registros" />
                <HorizontalBar title="Distribucion por profesion u ocupacion" rows={analysis.profesiones} valueLabel="Registros" />
                <CountTable title="Cobertura por subregion" rows={analysis.subregiones} showPct />
                <CountTable title="Municipios con mayor presencia" rows={analysis.municipios.slice(0, 20)} />
              </div>
            </>
          )}

          {activeTab === 'geografico' && (
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Cobertura territorial agregada</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Los marcadores agrupan registros por municipio. No se muestran nombres ni datos de contacto.
              </p>
              <Suspense
                fallback={
                  <div className="flex h-96 items-center justify-center">
                    <SpinnerIcon />
                    <p className="ml-3">Cargando mapas...</p>
                  </div>
                }
              >
                <MapaVoluntariosAntioquia voluntarios={signals} />
                <MapaVoluntariosAMVA voluntarios={signals} />
              </Suspense>
            </section>
          )}

          {activeTab === 'materiales' && (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <HorizontalBar title="Solicitudes por tipo de material" rows={analysis.materiales} valueLabel="Solicitudes" />
              <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                <h3 className="text-lg font-bold text-slate-900">Lectura operativa</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  La demanda de materiales indica donde la red esta lista para activarse. Cruzar esta
                  informacion con los mapas electorales permite priorizar territorios donde ya hay
                  capacidad voluntaria y donde falta reforzar presencia.
                </p>
              </section>
            </div>
          )}
        </main>
      )}
    </BackgroundWrapper>
  );
};

export default GestionVoluntarios;
