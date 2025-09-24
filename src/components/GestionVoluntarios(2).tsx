
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { CloseIcon, SpinnerIcon } from './icons';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Lazy load los componentes de mapa para mejorar el rendimiento inicial
const MapaVoluntariosAntioquia = lazy(() => import('./MapaVoluntariosAntioquia'));
const MapaVoluntariosAMVA = lazy(() => import('./MapaVoluntariosAMVA'));

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- INTERFACES ---
interface GestionVoluntariosProps {
  onBack: () => void;
}

interface Voluntario {
  id: string;
  nombre: string;
  telefono: string;
  correo: string;
  municipio: string;
  comite: string;
  comuna?: string;
  profesion?: string;
  publicidad?: string[] | string;
  observaciones?: string;
}

interface ComiteAnalysis {
  comite: string;
  cantidad: number;
  porcentaje: number;
}

interface MunicipioAnalysis {
  municipio: string;
  cantidad: number;
}

interface SubregionAnalysis {
  subregion: string;
  cantidad: number;
  porcentaje: number;
}

interface ProfesionAnalysis {
  profesion: string;
  cantidad: number;
}

interface PublicidadGeneral {
  tipo: string;
  cantidad: number;
}

interface PublicidadPorMunicipio {
  [tipo: string]: string[];
}

interface DetalleMunicipioPublicidad {
    municipio: string;
    solicitudes: number;
}

// --- TIPO PARA PESTAÑAS ---
type Tab = 'general' | 'geografico' | 'lista';

const GestionVoluntarios: React.FC<GestionVoluntariosProps> = ({ onBack }) => {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [comiteAnalysis, setComiteAnalysis] = useState<ComiteAnalysis[]>([]);
  const [municipioAnalysis, setMunicipioAnalysis] = useState<MunicipioAnalysis[]>([]);
  const [subregionAnalysis, setSubregionAnalysis] = useState<SubregionAnalysis[]>([]);
  const [profesionAnalysis, setProfesionAnalysis] = useState<ProfesionAnalysis[]>([]);
  const [publicidadGeneral, setPublicidadGeneral] = useState<PublicidadGeneral[]>([]);
  const [publicidadPorMunicipio, setPublicidadPorMunicipio] = useState<PublicidadPorMunicipio>({});
  const [selectedPublicidad, setSelectedPublicidad] = useState<string>('');
  const [detallePublicidad, setDetallePublicidad] = useState<DetalleMunicipioPublicidad[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoluntario, setSelectedVoluntario] = useState<Voluntario | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('general');

  useEffect(() => {
    const fetchAndAnalyzeAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [voluntariosSnapshot, subregionDataSnapshot] = await Promise.all([
          getDocs(collection(db, "voluntarios")),
          getDocs(collection(db, "resultados_elecciones"))
        ]);

        const voluntariosData = voluntariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Voluntario));
        setVoluntarios(voluntariosData);

        const municipioToSubregionMap = new Map<string, string>();
        subregionDataSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const municipio = (data.municipio || '').toUpperCase().trim();
          const subregion = data.subregion;
          if (municipio && subregion) {
            municipioToSubregionMap.set(municipio, subregion);
          }
        });

        if (voluntariosData.length > 0) {
          const totalVoluntarios = voluntariosData.length;
          const comiteCounts: { [key: string]: number } = {};
          const municipioCounts: { [key: string]: number } = {};
          const subregionCounts: { [key: string]: number } = {};
          const profesionCounts: { [key: string]: number } = {};
          const publicidadGeneralCounts: { [key: string]: number } = {};
          const publicidadMunicipioMap: PublicidadPorMunicipio = {};
          const TIPOS_PUBLICIDAD = ['Afiches para ventana', 'Balconeros', 'Digital', 'Microperforados', 'Pasacalles', 'Stickers', 'Volantes'];
          
          TIPOS_PUBLICIDAD.forEach(tipo => {
            publicidadGeneralCounts[tipo] = 0;
            publicidadMunicipioMap[tipo] = [];
          });

          voluntariosData.forEach(vol => {
            comiteCounts[vol.comite || 'Desconocido'] = (comiteCounts[vol.comite || 'Desconocido'] || 0) + 1;
            municipioCounts[vol.municipio || 'Desconocido'] = (municipioCounts[vol.municipio || 'Desconocido'] || 0) + 1;
            const subregion = municipioToSubregionMap.get((vol.municipio || '').toUpperCase().trim()) || 'Desconocida';
            subregionCounts[subregion] = (subregionCounts[subregion] || 0) + 1;
            const profesionKey = (vol.profesion || '').trim() || 'No especificada';
            profesionCounts[profesionKey] = (profesionCounts[profesionKey] || 0) + 1;

            const publicidad = Array.isArray(vol.publicidad) ? vol.publicidad : (typeof vol.publicidad === 'string' ? [vol.publicidad] : []);
            publicidad.forEach(item => {
                if(TIPOS_PUBLICIDAD.includes(item)) {
                    publicidadGeneralCounts[item]++;
                    publicidadMunicipioMap[item].push(vol.municipio || 'Desconocido');
                }
            });
          });

          setComiteAnalysis(Object.entries(comiteCounts).map(([comite, cantidad]) => ({ comite, cantidad, porcentaje: (cantidad / totalVoluntarios) * 100 })).sort((a, b) => b.cantidad - a.cantidad));
          setMunicipioAnalysis(Object.entries(municipioCounts).map(([municipio, cantidad]) => ({ municipio, cantidad })).sort((a, b) => b.cantidad - a.cantidad));
          setSubregionAnalysis(Object.entries(subregionCounts).map(([subregion, cantidad]) => ({ subregion, cantidad, porcentaje: (cantidad / totalVoluntarios) * 100 })).sort((a, b) => b.cantidad - a.cantidad));
          setProfesionAnalysis(Object.entries(profesionCounts).map(([profesion, cantidad]) => ({ profesion, cantidad })).sort((a, b) => b.cantidad - a.cantidad));
          
          const generalResult = Object.entries(publicidadGeneralCounts).map(([tipo, cantidad]) => ({ tipo, cantidad })).sort((a, b) => b.cantidad - a.cantidad);
          setPublicidadGeneral(generalResult);
          setPublicidadPorMunicipio(publicidadMunicipioMap);

          if (generalResult.length > 0) {
            setSelectedPublicidad(generalResult[0].tipo);
          }
        }
      } catch (err: any) {
        console.error("Error detallado al cargar y analizar datos:", err);
        setError(`Error en la carga de datos: ${err.message}.`);
      } finally {
        setLoading(false);
      }
    };
    fetchAndAnalyzeAllData();
  }, []);

  useEffect(() => {
    if (!selectedPublicidad || !publicidadPorMunicipio[selectedPublicidad]) {
        setDetallePublicidad([]);
        return;
    }
    const municipios = publicidadPorMunicipio[selectedPublicidad];
    const counts: { [key: string]: number } = {};
    municipios.forEach(mun => {
        counts[mun] = (counts[mun] || 0) + 1;
    });
    const result = Object.entries(counts)
        .map(([municipio, solicitudes]) => ({ municipio, solicitudes }))
        .sort((a, b) => b.solicitudes - a.solicitudes);
    setDetallePublicidad(result);
  }, [selectedPublicidad, publicidadPorMunicipio]);

  const formatPhoneNumber = (phone: string) => phone.replace(/[^0-9]/g, '');

  const barChartOptions = { indexAxis: 'y' as const, responsive: true, plugins: { legend: { display: false } } };
  const comiteBarData = { labels: comiteAnalysis.map(d => d.comite).reverse(), datasets: [{ label: '# de Voluntarios', data: comiteAnalysis.map(d => d.cantidad).reverse(), backgroundColor: 'rgba(59, 130, 246, 0.5)', borderColor: 'rgba(59, 130, 246, 1)' }] };
  const comitePieData = { labels: comiteAnalysis.map(d => d.comite), datasets: [{ data: comiteAnalysis.map(d => d.porcentaje), backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(239, 68, 68, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(236, 72, 153, 0.7)'], borderColor: '#ffffff', borderWidth: 2 }] };
  const publicidadBarData = { labels: publicidadGeneral.map(d => d.tipo), datasets: [{ label: 'N.º de Solicitudes', data: publicidadGeneral.map(d => d.cantidad), backgroundColor: 'rgba(16, 185, 129, 0.5)', borderColor: 'rgba(16, 185, 129, 1)' }] };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 flex flex-col">
        <div className="flex-shrink-0 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">← Volver</button>
                <h2 className="text-2xl font-bold text-slate-800">Gestión y Análisis de Voluntarios</h2>
            </div>
            <div className="flex items-center border border-slate-300 rounded-lg p-1 bg-slate-100">
                <button onClick={() => setActiveTab('general')} className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === 'general' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>Análisis General</button>
                <button onClick={() => setActiveTab('geografico')} className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === 'geografico' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>Análisis Geográfico</button>
                <button onClick={() => setActiveTab('lista')} className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === 'lista' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>Listado de Voluntarios</button>
            </div>
        </div>
      
      {loading ? <div className="flex justify-center items-center h-full"><SpinnerIcon /><p className="text-slate-600 text-lg ml-3">Cargando y analizando datos...</p></div> : error ? <p className="text-red-500 text-center text-lg p-4 bg-red-50 rounded-md">{error}</p> : (
        <div className="flex-grow w-full">
          {activeTab === 'general' && (
            <div className="space-y-8">
              {/* --- ANÁLISIS POR COMITÉ --- */}
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-slate-700 mb-4">Análisis por Comité</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div><h4 className="text-lg font-semibold text-slate-600 mb-2 text-center">Voluntarios por Comité</h4><Bar options={barChartOptions} data={comiteBarData} /></div>
                    <div className="flex flex-col justify-center items-center"><h4 className="text-lg font-semibold text-slate-600 mb-2 text-center">Distribución Porcentual</h4><div className="max-w-xs mx-auto"><Pie data={comitePieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' as const } } }} /></div></div>
                  </div>
                  <div className="overflow-y-auto h-80"><h4 className="text-lg font-semibold text-slate-600 mb-4">Tabla Resumen</h4><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50 sticky top-0"><tr><th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Comité</th><th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">N.º</th><th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">%</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{comiteAnalysis.map(item => <tr key={item.comite}><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">{item.comite}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 text-right font-semibold">{item.cantidad}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 text-right">{item.porcentaje.toFixed(1)}%</td></tr>)}</tbody></table></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="p-6 bg-white rounded-lg shadow-md"><h4 className="text-lg font-semibold text-slate-600 mb-4">Distribución por Municipio</h4><div className="overflow-y-auto h-96"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50 sticky top-0"><tr><th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Municipio</th><th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">N.º Vol.</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{municipioAnalysis.map(item => <tr key={item.municipio}><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">{item.municipio}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 text-right font-semibold">{item.cantidad}</td></tr>)}</tbody></table></div></div>
                  <div className="p-6 bg-white rounded-lg shadow-md"><h3 className="text-xl font-bold text-slate-700 mb-4">Análisis por Subregión</h3><div className="overflow-x-auto h-96"><table className="min-w-full divide-y divide-slate-200 border"><thead className="bg-slate-50 sticky top-0"><tr><th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Subregión</th><th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">N.º Vol.</th><th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">%</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{subregionAnalysis.map(item => <tr key={item.subregion}><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">{item.subregion}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 text-center">{item.cantidad}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 text-center">{item.porcentaje.toFixed(1)}%</td></tr>)}</tbody></table></div></div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-slate-700 mb-4">Análisis de Solicitudes de Publicidad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div><h4 className="text-lg font-semibold text-slate-600 mb-4">Total Solicitudes</h4><Bar options={{ responsive: true, plugins: { legend: { display: false } } }} data={publicidadBarData} /></div>
                  <div><h4 className="text-lg font-semibold text-slate-600 mb-4">Resumen General</h4><div className="overflow-x-auto h-80"><table className="min-w-full divide-y divide-slate-200 border"><thead className="bg-slate-50 sticky top-0"><tr><th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Tipo</th><th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">Total</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{publicidadGeneral.map(item => (<tr key={item.tipo}><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">{item.tipo}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 text-center font-bold">{item.cantidad}</td></tr>))}</tbody></table></div></div>
                  <div><h4 className="text-lg font-semibold text-slate-600 mb-4">Consulta por Municipio</h4><select value={selectedPublicidad} onChange={(e) => setSelectedPublicidad(e.target.value)} className="w-full p-2 mb-4 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">{publicidadGeneral.map(item => (<option key={item.tipo} value={item.tipo}>{item.tipo}</option>))}</select><div className="overflow-y-auto h-64"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50 sticky top-0"><tr><th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Municipio</th><th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Solicitudes</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{detallePublicidad.length > 0 ? detallePublicidad.map(item => (<tr key={item.municipio}><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">{item.municipio}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 text-right font-semibold">{item.solicitudes}</td></tr>)) : (<tr><td colSpan={2} className="text-center py-4 text-sm text-slate-500">No hay datos.</td></tr>)}</tbody></table></div></div>
                </div>
              </div>
                
              <div className="p-6 bg-white rounded-lg shadow-md"><h3 className="text-xl font-bold text-slate-700 mb-4">Análisis por Profesión</h3><div className="overflow-y-auto h-96"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50 sticky top-0"><tr><th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Profesión / Ocupación</th><th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">N.º Vol.</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{profesionAnalysis.map(item => <tr key={item.profesion}><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">{item.profesion}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 text-right font-semibold">{item.cantidad}</td></tr>)}</tbody></table></div></div>
            </div>
          )}

          {activeTab === 'geografico' && (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-slate-700 mb-4">Análisis Geográfico de Voluntarios</h3>
                <Suspense fallback={<div className="flex justify-center items-center h-96"><SpinnerIcon /><p className="ml-3">Cargando Mapas...</p></div>}>
                    <h4 className="text-lg font-semibold text-slate-600 mb-4">Ubicación de Voluntarios en Antioquia</h4>
                    <MapaVoluntariosAntioquia voluntarios={voluntarios} />
                    <h4 className="text-lg font-semibold text-slate-600 mb-4 mt-8">Ubicación de Voluntarios en el Valle de Aburrá</h4>
                    <MapaVoluntariosAMVA voluntarios={voluntarios} />
                </Suspense>
            </div>
          )}

          {activeTab === 'lista' && (
            <div className="flex-grow w-full bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <h3 className="text-xl font-bold text-slate-700 mb-4">Listado de Voluntarios ({voluntarios.length})</h3>
                <table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Teléfono</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Municipio</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Comité</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{voluntarios.map((voluntario) => <tr key={voluntario.id} onClick={() => setSelectedVoluntario(voluntario)} className="hover:bg-slate-50 cursor-pointer"><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{voluntario.nombre}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{voluntario.telefono}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{voluntario.municipio}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{voluntario.comite}</td></tr>)}</tbody></table>
            </div>
          )}
        </div>
      )}

      {selectedVoluntario && <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setSelectedVoluntario(null)}><div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 relative" onClick={e => e.stopPropagation()}><button onClick={() => setSelectedVoluntario(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><CloseIcon /></button><h3 className="text-2xl font-bold text-slate-800 mb-6">{selectedVoluntario.nombre}</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm"><div className="flex flex-col"><span className="font-semibold text-slate-500">Teléfono:</span><a href={`https://wa.me/${formatPhoneNumber(selectedVoluntario.telefono)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedVoluntario.telefono}</a></div><div className="flex flex-col"><span className="font-semibold text-slate-500">Correo:</span><a href={`mailto:${selectedVoluntario.correo}`} className="text-blue-600 hover:underline">{selectedVoluntario.correo}</a></div><p><span className="font-semibold text-slate-500">Municipio:</span> {selectedVoluntario.municipio}</p>{selectedVoluntario.comuna && <p><span className="font-semibold text-slate-500">Comuna/Vereda:</span> {selectedVoluntario.comuna}</p>}{selectedVoluntario.profesion && <p><span className="font-semibold text-slate-500">Profesión:</span> {selectedVoluntario.profesion}</p>}<p><span className="font-semibold text-slate-500">Comité:</span> {selectedVoluntario.comite}</p>{selectedVoluntario.publicidad && <p><span className="font-semibold text-slate-500">Tipo de Publicidad:</span> {Array.isArray(selectedVoluntario.publicidad) ? selectedVoluntario.publicidad.join(', ') : selectedVoluntario.publicidad}</p>}</div>{selectedVoluntario.observaciones && <div className="mt-6"><p className="font-semibold text-slate-500">Observaciones:</p><p className="text-slate-600 bg-slate-50 p-3 rounded-md mt-1">{selectedVoluntario.observaciones}</p></div>}</div></div>}
    </div>
  );
};

export default GestionVoluntarios;
