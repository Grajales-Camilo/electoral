import React, { useState, useEffect } from 'react';
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
  publicidad?: string;
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

// 1. NUEVA INTERFAZ PARA ANÁLISIS DE SUBREGIÓN
interface SubregionAnalysis {
  subregion: string;
  cantidad: number;
  porcentaje: number;
}

const GestionVoluntarios: React.FC<GestionVoluntariosProps> = ({ onBack }) => {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [comiteAnalysis, setComiteAnalysis] = useState<ComiteAnalysis[]>([]);
  const [municipioAnalysis, setMunicipioAnalysis] = useState<MunicipioAnalysis[]>([]);
  // 2. NUEVO ESTADO PARA DATOS DE SUBREGIÓN
  const [subregionAnalysis, setSubregionAnalysis] = useState<SubregionAnalysis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoluntario, setSelectedVoluntario] = useState<Voluntario | null>(null);

  useEffect(() => {
    const fetchAndAnalyzeAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 3. CARGA DE DATOS EN PARALELO (VOLUNTARIOS Y GEOJSON)
        const [voluntariosSnapshot, geoJsonResponse] = await Promise.all([
          getDocs(collection(db, "voluntarios")),
          fetch('https://storage.googleapis.com/ivc-26.firebasestorage.app/geojson/antioquia_subregiones_clean.geojson')
        ]);

        // Procesamiento de Voluntarios
        const voluntariosData = voluntariosSnapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id,
            nombre: data.nombre || '(Sin nombre)',
            telefono: data.telefono || '-',
            correo: data.correo || '-',
            municipio: data.municipio || 'Desconocido',
            comite: data.comite || 'Desconocido',
            ...data
          } as Voluntario;
        });
        setVoluntarios(voluntariosData);

        // Procesamiento de GeoJSON
        const geoJson = await geoJsonResponse.json();
        
        // 4. MAPEO DE MUNICIPIO A SUBREGIÓN
        const municipioToSubregionMap = new Map<string, string>();
        geoJson.features.forEach((feature: any) => {
          const municipio = (feature.properties.MUNICIPIO || '').toUpperCase().trim();
          const subregion = feature.properties.SUBREGION;
          if (municipio && subregion) {
            municipioToSubregionMap.set(municipio, subregion);
          }
        });

        if (voluntariosData.length > 0) {
          const totalVoluntarios = voluntariosData.length;

          // Análisis por Comité
          const comiteCounts: { [key: string]: number } = {};
          voluntariosData.forEach(vol => { comiteCounts[vol.comite] = (comiteCounts[vol.comite] || 0) + 1; });
          const comiteAnalysisResult = Object.keys(comiteCounts).map(comite => ({
              comite,
              cantidad: comiteCounts[comite],
              porcentaje: (comiteCounts[comite] / totalVoluntarios) * 100
          })).sort((a, b) => b.cantidad - a.cantidad);
          setComiteAnalysis(comiteAnalysisResult);

          // Análisis por Municipio
          const municipioCounts: { [key: string]: number } = {};
          voluntariosData.forEach(vol => { municipioCounts[vol.municipio] = (municipioCounts[vol.municipio] || 0) + 1; });
          const municipioAnalysisResult = Object.keys(municipioCounts).map(municipio => ({
              municipio,
              cantidad: municipioCounts[municipio]
          })).sort((a, b) => b.cantidad - a.cantidad);
          setMunicipioAnalysis(municipioAnalysisResult);

          // 5. NUEVO ANÁLISIS POR SUBREGIÓN
          const subregionCounts: { [key: string]: number } = {};
          voluntariosData.forEach(vol => {
            const municipioUpper = (vol.municipio || '').toUpperCase().trim();
            const subregion = municipioToSubregionMap.get(municipioUpper) || 'Desconocida';
            subregionCounts[subregion] = (subregionCounts[subregion] || 0) + 1;
          });
          const subregionAnalysisResult = Object.keys(subregionCounts).map(subregion => ({
            subregion,
            cantidad: subregionCounts[subregion],
            porcentaje: (subregionCounts[subregion] / totalVoluntarios) * 100
          })).sort((a, b) => b.cantidad - a.cantidad);
          setSubregionAnalysis(subregionAnalysisResult);
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

  const formatPhoneNumber = (phone: string) => phone.replace(/[^0-9]/g, '');

  const barChartOptions = { indexAxis: 'y' as const, responsive: true, plugins: { legend: { display: false } } };
  const barChartData = { labels: comiteAnalysis.map(d => d.comite).reverse(), datasets: [{ label: '# de Voluntarios', data: comiteAnalysis.map(d => d.cantidad).reverse(), backgroundColor: 'rgba(59, 130, 246, 0.5)', borderColor: 'rgba(59, 130, 246, 1)' }] };
  const pieChartData = { labels: comiteAnalysis.map(d => d.comite), datasets: [{ data: comiteAnalysis.map(d => d.porcentaje), backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(239, 68, 68, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(236, 72, 153, 0.7)'], borderColor: '#ffffff', borderWidth: 2 }] };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="flex-shrink-0 mb-6 flex items-center gap-4"><button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">← Volver al Menú</button><h2 className="text-2xl font-bold text-slate-800">Gestión y Análisis de Voluntarios</h2></div>
      {loading ? <div className="flex justify-center items-center h-full"><SpinnerIcon /><p className="text-slate-600 text-lg ml-3">Cargando y analizando datos...</p></div> : error ? <p className="text-red-500 text-center text-lg p-4 bg-red-50 rounded-md">{error}</p> : (
        <>
          {/* --- FILA 1 DE ANÁLISIS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-md"><h4 className="text-lg font-semibold text-slate-600 mb-2 text-center">Voluntarios por Comité</h4><Bar options={barChartOptions} data={barChartData} /></div>
              <div className="p-6 bg-white rounded-lg shadow-md flex flex-col justify-center items-center"><h4 className="text-lg font-semibold text-slate-600 mb-2 text-center">Distribución de Comités</h4><div className="max-w-xs mx-auto"><Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' as const } } }} /></div></div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md"><h4 className="text-lg font-semibold text-slate-600 mb-4">Distribución por Municipio</h4><div className="overflow-y-auto h-80"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50 sticky top-0"><tr><th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Municipio</th><th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">N.º Vol.</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{municipioAnalysis.map(item => <tr key={item.municipio}><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">{item.municipio}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 text-right font-semibold">{item.cantidad}</td></tr>)}</tbody></table></div></div>
          </div>

          {/* 6. NUEVA FILA CON WIDGET DE SUBREGIONES */}
          <div className="p-6 bg-white rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-bold text-slate-700 mb-4">Análisis por Subregión</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 border">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Subregión</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">N.º de Voluntarios</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">%</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {subregionAnalysis.map(item => (
                    <tr key={item.subregion}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">{item.subregion}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 text-center">{item.cantidad}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 text-center">{item.porcentaje.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- TABLA DE VOLUNTARIOS --- */}
          <div className="flex-grow w-full bg-white p-6 rounded-lg shadow-md overflow-x-auto"><h3 className="text-xl font-bold text-slate-700 mb-4">Listado de Voluntarios ({voluntarios.length})</h3><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Teléfono</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Municipio</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Comité</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{voluntarios.map((voluntario) => <tr key={voluntario.id} onClick={() => setSelectedVoluntario(voluntario)} className="hover:bg-slate-50 cursor-pointer"><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{voluntario.nombre}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{voluntario.telefono}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{voluntario.municipio}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{voluntario.comite}</td></tr>)}</tbody></table></div>
        </>
      )}

      {selectedVoluntario && <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setSelectedVoluntario(null)}><div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 relative" onClick={e => e.stopPropagation()}><button onClick={() => setSelectedVoluntario(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><CloseIcon /></button><h3 className="text-2xl font-bold text-slate-800 mb-6">{selectedVoluntario.nombre}</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm"><div className="flex flex-col"><span className="font-semibold text-slate-500">Teléfono:</span><a href={`https://wa.me/${formatPhoneNumber(selectedVoluntario.telefono)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedVoluntario.telefono}</a></div><div className="flex flex-col"><span className="font-semibold text-slate-500">Correo:</span><a href={`mailto:${selectedVoluntario.correo}`} className="text-blue-600 hover:underline">{selectedVoluntario.correo}</a></div><p><span className="font-semibold text-slate-500">Municipio:</span> {selectedVoluntario.municipio}</p>{selectedVoluntario.comuna && <p><span className="font-semibold text-slate-500">Comuna/Vereda:</span> {selectedVoluntario.comuna}</p>}{selectedVoluntario.profesion && <p><span className="font-semibold text-slate-500">Profesión:</span> {selectedVoluntario.profesion}</p>}<p><span className="font-semibold text-slate-500">Comité:</span> {selectedVoluntario.comite}</p>{selectedVoluntario.publicidad && <p><span className="font-semibold text-slate-500">Tipo de Publicidad:</span> {selectedVoluntario.publicidad}</p>}</div>{selectedVoluntario.observaciones && <div className="mt-6"><p className="font-semibold text-slate-500">Observaciones:</p><p className="text-slate-600 bg-slate-50 p-3 rounded-md mt-1">{selectedVoluntario.observaciones}</p></div>}</div></div>}
    </div>
  );
};

export default GestionVoluntarios;
