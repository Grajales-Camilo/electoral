import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SpinnerIcon } from './icons';
import { MobileHeader } from './MobileHeader';
import { ResponsiveTabs } from './ResponsiveTabs';
import { ResponsiveTable } from './ResponsiveTable';
import { ResponsiveModal, MobileModal, useIsMobile } from './ResponsiveModal';
import { BackgroundWrapper } from './BackgroundWrapper';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  LineElement,
  PointElement
);

// --- INTERFACES ---
interface GestionVotantesProps {
  onBack: () => void;
  onNavigateToResultados?: () => void;
  onNavigateToVoluntarios?: () => void;
}

interface PuestoVotacion {
  nombre: string;
  lat: number;
  lon: number;
  estrato: number;
  centroIzquierda: number; // Antes "quintero"
  derecha: number; // Antes "ramos"
  otros: number;
  total: number;
}

interface DatoClase {
  clase: string;
  votantesPotenciales: number;
  votosCentroIzquierda: number;
  votosDerecha: number;
  votosTotal: number;
  idvClase: number;
  porcCentroIzquierda: number;
  porcDerecha: number;
  votoEsperadoCentroIzquierda: number;
  votoEsperadoDerecha: number;
  diferenciaCentroIzquierda: number;
  diferenciaDerecha: number;
}

interface AnalisisCorrelacion {
  candidato: string;
  correlacion: number;
  interpretacion: string;
}

// --- TIPO PARA PESTAÑAS ---
type Tab = 'dashboard' | 'puestos' | 'estratos';

const GestionVotantes: React.FC<GestionVotantesProps> = ({ onBack, onNavigateToResultados, onNavigateToVoluntarios }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [filtroEstrato, setFiltroEstrato] = useState<string>('');
  const [busquedaNombre, setBusquedaNombre] = useState<string>('');
  const [selectedPuesto, setSelectedPuesto] = useState<PuestoVotacion | null>(null);

  // Referencia para el contenedor principal
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook para detectar móvil
  const isMobile = useIsMobile();

  // Datos estáticos del análisis electoral
  const datosPuestos: PuestoVotacion[] = [
    {nombre: "Colegio Manrique", lat: 6.28168, lon: -75.57096, estrato: 2, centroIzquierda: 1350, derecha: 640, otros: 150, total: 2140},
    {nombre: "Inst. Educ. Pablo VI", lat: 6.24744, lon: -75.56034, estrato: 1, centroIzquierda: 1734, derecha: 790, otros: 230, total: 2754},
    {nombre: "Colegio La Salle", lat: 6.24912, lon: -75.57962, estrato: 4, centroIzquierda: 1550, derecha: 2050, otros: 200, total: 3800},
    {nombre: "Liceo Salazar y Herrera", lat: 6.25851, lon: -75.59042, estrato: 3, centroIzquierda: 1665, derecha: 1995, otros: 240, total: 3900},
    {nombre: "Colegio Montessori", lat: 6.18245, lon: -75.59939, estrato: 6, centroIzquierda: 610, derecha: 2100, otros: 70, total: 2780},
    {nombre: "Escuela La Consuelo", lat: 6.30213, lon: -75.53872, estrato: 2, centroIzquierda: 1600, derecha: 825, otros: 180, total: 2605},
    {nombre: "Colegio San Ignacio", lat: 6.26792, lon: -75.55980, estrato: 5, centroIzquierda: 980, derecha: 1890, otros: 140, total: 3010},
    {nombre: "Escuela Andrés Bello", lat: 6.25991, lon: -75.57339, estrato: 3, centroIzquierda: 1302, derecha: 1772, otros: 221, total: 3295},
    {nombre: "Colegio María Auxiliadora", lat: 6.25697, lon: -75.57105, estrato: 3, centroIzquierda: 1289, derecha: 1821, otros: 210, total: 3320},
    {nombre: "Colegio San José", lat: 6.21178, lon: -75.57822, estrato: 4, centroIzquierda: 1120, derecha: 1632, otros: 120, total: 2872}
  ];

  const datosClase: DatoClase[] = [
    {
      clase: "baja", 
      votantesPotenciales: 204814, 
      votosCentroIzquierda: 35431, 
      votosDerecha: 18211, 
      votosTotal: 93996, 
      idvClase: 45.89,
      porcCentroIzquierda: 37.7, 
      porcDerecha: 19.4, 
      votoEsperadoCentroIzquierda: 54722, 
      votoEsperadoDerecha: 52205, 
      diferenciaCentroIzquierda: -35.3, 
      diferenciaDerecha: -65.1
    },
    {
      clase: "media", 
      votantesPotenciales: 258392, 
      votosCentroIzquierda: 108705, 
      votosDerecha: 106106, 
      votosTotal: 139195, 
      idvClase: 53.87,
      porcCentroIzquierda: 78.1, 
      porcDerecha: 76.2, 
      votoEsperadoCentroIzquierda: 81036, 
      votoEsperadoDerecha: 77308, 
      diferenciaCentroIzquierda: 34.1, 
      diferenciaDerecha: 37.3
    },
    {
      clase: "alta", 
      votantesPotenciales: 55904, 
      votosCentroIzquierda: 12195, 
      votosDerecha: 24823, 
      votosTotal: 45890, 
      idvClase: 82.08,
      porcCentroIzquierda: 26.6, 
      porcDerecha: 54.1, 
      votoEsperadoCentroIzquierda: 17556, 
      votoEsperadoDerecha: 16726, 
      diferenciaCentroIzquierda: -30.5, 
      diferenciaDerecha: 48.4
    }
  ];

  const correlaciones: AnalisisCorrelacion[] = [
    {
      candidato: "Centro-Izquierda",
      correlacion: -0.065,
      interpretacion: "Correlación negativa muy débil con el estrato socioeconómico. Los votos por Centro-Izquierda no muestran una tendencia clara según el nivel socioeconómico."
    },
    {
      candidato: "Derecha",
      correlacion: 0.814,
      interpretacion: "Correlación positiva fuerte con el estrato socioeconómico. Los votos por Derecha aumentan significativamente en estratos más altos."
    }
  ];

  // Función para cambiar tab y hacer scroll al inicio
  const handleTabChange = (tab: string) => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setActiveTab(tab as Tab);
  };

  // useEffect que se ejecuta cada vez que cambia activeTab
  useEffect(() => {
    const forceScrollReset = () => {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 10);
      
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    };

    forceScrollReset();
  }, [activeTab]);
  
  // Simulación de carga de datos
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simular carga
        await new Promise(resolve => setTimeout(resolve, 1000));
        setError(null);
      } catch (err: any) {
        console.error("Error al cargar datos:", err);
        setError(`Error en la carga de datos: ${err.message}.`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtrado de puestos de votación
  const puestosFiltrados = useMemo(() => {
    return datosPuestos.filter(puesto => {
      const matchEstrato = !filtroEstrato || puesto.estrato.toString() === filtroEstrato;
      const matchNombre = !busquedaNombre || puesto.nombre.toLowerCase().includes(busquedaNombre.toLowerCase());
      return matchEstrato && matchNombre;
    });
  }, [datosPuestos, filtroEstrato, busquedaNombre]);

  // Cálculos para métricas principales
  const totalVotantes = datosClase.reduce((sum, clase) => sum + clase.votantesPotenciales, 0);
  const totalVotos = datosClase.reduce((sum, clase) => sum + clase.votosTotal, 0);
  const idvTotal = ((totalVotos / totalVotantes) * 100);
  const idvPorClase = datosClase.map((clase) => ({
    clase: clase.clase,
    idv: clase.idvClase,
    votantesPotenciales: clase.votantesPotenciales,
    votosTotal: clase.votosTotal,
  }));
  const correlacionCentroIzquierda = correlaciones.find(c => c.candidato === "Centro-Izquierda")?.correlacion || 0;
  const correlacionDerecha = correlaciones.find(c => c.candidato === "Derecha")?.correlacion || 0;

  // Datos para gráficos
  const chartBarrasData = {
    labels: datosClase.map(d => `Clase ${d.clase.charAt(0).toUpperCase() + d.clase.slice(1)}`),
    datasets: [
      {
        label: 'Centro-Izquierda',
        data: datosClase.map(d => d.votosCentroIzquierda),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      },
      {
        label: 'Derecha',
        data: datosClase.map(d => d.votosDerecha),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      },
      {
        label: 'Otros',
        data: datosClase.map(d => d.votosTotal - d.votosCentroIzquierda - d.votosDerecha),
        backgroundColor: 'rgba(156, 163, 175, 0.8)',
        borderColor: 'rgba(156, 163, 175, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartTortaData = {
    labels: ['Centro-Izquierda', 'Derecha', 'Otros'],
    datasets: [{
      data: [
        datosClase.reduce((sum, d) => sum + d.votosCentroIzquierda, 0),
        datosClase.reduce((sum, d) => sum + d.votosDerecha, 0),
        datosClase.reduce((sum, d) => sum + (d.votosTotal - d.votosCentroIzquierda - d.votosDerecha), 0)
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(156, 163, 175, 1)'
      ],
      borderWidth: 1
    }]
  };

  const chartLineasData = {
    labels: ['Estrato 1', 'Estrato 2', 'Estrato 3', 'Estrato 4', 'Estrato 5', 'Estrato 6'],
    datasets: [
      {
        label: 'Centro-Izquierda %',
        data: [70, 65, 55, 40, 35, 22], // Datos simulados basados en la correlación
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Derecha %',
        data: [25, 30, 40, 55, 70, 75], // Datos simulados basados en la correlación
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartBarrasApiladasData = {
    labels: ['Estrato 1', 'Estrato 2', 'Estrato 3', 'Estrato 4', 'Estrato 5', 'Estrato 6'],
    datasets: [
      {
        label: 'Centro-Izquierda',
        data: [70, 65, 55, 40, 35, 22],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      },
      {
        label: 'Derecha',
        data: [25, 30, 40, 55, 70, 75],
        backgroundColor: 'rgba(239, 68, 68, 0.8)'
      },
      {
        label: 'Otros',
        data: [5, 5, 5, 5, 5, 3],
        backgroundColor: 'rgba(156, 163, 175, 0.8)'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard General', 
      shortLabel: 'Dashboard'
    },
    { 
      id: 'puestos', 
      label: 'Puestos de Votación', 
      shortLabel: 'Puestos'
    },
    { 
      id: 'estratos', 
      label: 'Análisis por Estratos', 
      shortLabel: 'Estratos'
    }
  ];

  const getEstratoColor = (estrato: number) => {
    if (estrato <= 2) return 'bg-red-100 text-red-800';
    if (estrato <= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <BackgroundWrapper overlayType="text">
      <MobileHeader 
        title="Análisis Electoral Medellín"
        showBackButton={true}
        onBack={onBack}
        onNavigateToResultados={onNavigateToResultados}
        onNavigateToVotantes={onNavigateToVoluntarios}
      >
        <ResponsiveTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </MobileHeader>
      
      <div ref={containerRef}>
        {loading ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] p-4">
            <SpinnerIcon />
            <p className="text-white text-lg ml-3 drop-shadow-lg">Cargando análisis electoral...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center text-lg p-4 bg-red-50 rounded-md m-4">{error}</p>
        ) : (
          <div className="p-4 pb-8 space-y-6" style={{ paddingTop: '2rem' }}>
            {activeTab === 'dashboard' && (
              <div className="max-w-7xl mx-auto space-y-8">
                {/* Header con subtítulo */}
                <div className="text-center mb-8">
                  <p className="text-white text-lg font-medium drop-shadow-lg">
                    Análisis de voto de clase en las últimas elecciones parlamentarias y presidenciales en Medellín (ponderadas)
                  </p>
                </div>

                {/* Métricas Clave */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center">
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">IDV Total</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{idvTotal.toFixed(2)}%</div>
                    <p className="text-sm text-slate-500">Índice de Voto de Clase</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center">
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">Correlación Centro-Izquierda</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{correlacionCentroIzquierda}</div>
                    <p className="text-sm text-slate-500">Correlación de Pearson</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center">
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">Correlación Derecha</h3>
                    <div className="text-3xl font-bold text-red-600 mb-2">{correlacionDerecha}</div>
                    <p className="text-sm text-slate-500">Correlación de Pearson</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {idvPorClase.map((item) => (
                    <div key={item.clase} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center">
                      <h3 className="text-lg font-semibold text-slate-600 mb-2 capitalize">IDV Clase {item.clase}</h3>
                      <div className="text-3xl font-bold text-amber-600 mb-2">{item.idv.toFixed(2)}%</div>
                      <p className="text-sm text-slate-500">
                        {item.votosTotal.toLocaleString()} votos / {item.votantesPotenciales.toLocaleString()} votantes potenciales
                      </p>
                    </div>
                  ))}
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-slate-200">
                      <h3 className="text-xl font-bold text-slate-800">Votos por Clase Socioeconómica</h3>
                    </div>
                    <div className="p-6">
                      <div style={{ position: 'relative', height: '400px' }}>
                        <Bar data={chartBarrasData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-slate-200">
                      <h3 className="text-xl font-bold text-slate-800">Distribución Total de Votos</h3>
                    </div>
                    <div className="p-6">
                      <div style={{ position: 'relative', height: '400px' }}>
                        <Pie data={chartTortaData} options={pieChartOptions} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabla Resumen por Clase */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800">Resumen por Clase</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <ResponsiveTable<DatoClase>
                      data={datosClase}
                      columns={[
                        { 
                          key: 'clase', 
                          label: 'Clase', 
                          render: (value) => (
                            <span className="font-semibold text-slate-900 capitalize">{value}</span>
                          )
                        },
                        { 
                          key: 'votantesPotenciales', 
                          label: 'Votantes Potenciales',
                          render: (value) => (
                            <span className="font-medium">{value.toLocaleString()}</span>
                          )
                        },
                        { 
                          key: 'votosCentroIzquierda', 
                          label: 'Votos Centro-Izquierda',
                          render: (value) => (
                            <span className="font-medium text-blue-600">{value.toLocaleString()}</span>
                          )
                        },
                        { 
                          key: 'votosDerecha', 
                          label: 'Votos Derecha',
                          render: (value) => (
                            <span className="font-medium text-red-600">{value.toLocaleString()}</span>
                          )
                        },
                        { 
                          key: 'idvClase', 
                          label: 'IDV',
                          sortable: true,
                          render: (value) => (
                            <span className="font-bold text-amber-700">{value.toFixed(2)}%</span>
                          )
                        },
                        { 
                          key: 'porcCentroIzquierda', 
                          label: '% Centro-Izquierda',
                          render: (value) => (
                            <span className="font-medium text-blue-600">{value}%</span>
                          )
                        },
                        { 
                          key: 'porcDerecha', 
                          label: '% Derecha',
                          render: (value) => (
                            <span className="font-medium text-red-600">{value}%</span>
                          )
                        },
                        { 
                          key: 'diferenciaCentroIzquierda', 
                          label: 'Diferencia Centro-Izq.',
                          hideOnMobile: true,
                          render: (value) => (
                            <span className={`font-medium ${value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {value > 0 ? '+' : ''}{value}%
                            </span>
                          )
                        },
                        { 
                          key: 'diferenciaDerecha', 
                          label: 'Diferencia Der.',
                          hideOnMobile: true,
                          render: (value) => (
                            <span className={`font-medium ${value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {value > 0 ? '+' : ''}{value}%
                            </span>
                          )
                        }
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'puestos' && (
              <div className="max-w-7xl mx-auto space-y-8">
                {/* Filtros */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Filtrar por estrato:
                      </label>
                      <select 
                        value={filtroEstrato}
                        onChange={(e) => setFiltroEstrato(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Todos los estratos</option>
                        <option value="1">Estrato 1</option>
                        <option value="2">Estrato 2</option>
                        <option value="3">Estrato 3</option>
                        <option value="4">Estrato 4</option>
                        <option value="5">Estrato 5</option>
                        <option value="6">Estrato 6</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Buscar por nombre:
                      </label>
                      <input
                        type="text"
                        value={busquedaNombre}
                        onChange={(e) => setBusquedaNombre(e.target.value)}
                        placeholder="Nombre del puesto..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={() => {
                          // Funcionalidad de exportar datos
                          console.log('Exportar datos:', puestosFiltrados);
                        }}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Exportar Datos
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabla de Puestos */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800">
                      Puestos de Votación ({puestosFiltrados.length})
                    </h3>
                  </div>
                  <ResponsiveTable<PuestoVotacion>
                    data={puestosFiltrados}
                    columns={[
                      { 
                        key: 'nombre', 
                        label: 'Nombre', 
                        sortable: true,
                        render: (value) => (
                          <span className="font-semibold text-slate-900">{value}</span>
                        )
                      },
                      { 
                        key: 'estrato', 
                        label: 'Estrato',
                        sortable: true,
                        render: (value) => (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstratoColor(value)}`}>
                            Estrato {value}
                          </span>
                        )
                      },
                      { 
                        key: 'centroIzquierda', 
                        label: 'Centro-Izquierda',
                        sortable: true,
                        render: (value) => (
                          <span className="font-medium text-blue-600">{value.toLocaleString()}</span>
                        )
                      },
                      { 
                        key: 'derecha', 
                        label: 'Derecha',
                        sortable: true,
                        render: (value) => (
                          <span className="font-medium text-red-600">{value.toLocaleString()}</span>
                        )
                      },
                      { 
                        key: 'otros', 
                        label: 'Otros',
                        sortable: true,
                        hideOnMobile: true,
                        render: (value) => (
                          <span className="font-medium text-slate-600">{value.toLocaleString()}</span>
                        )
                      },
                      { 
                        key: 'total', 
                        label: 'Total',
                        sortable: true,
                        render: (value) => (
                          <span className="font-bold text-slate-900">{value.toLocaleString()}</span>
                        )
                      },
                      { 
                        key: 'lat', 
                        label: 'Coordenadas',
                        hideOnMobile: true,
                        render: (value, row) => (
                          <span className="text-xs text-slate-500">
                            {value?.toFixed(4)}, {row.lon?.toFixed(4)}
                          </span>
                        )
                      }
                    ]}
                    onRowClick={setSelectedPuesto}
                    loading={false}
                    emptyMessage="No se encontraron puestos con los filtros seleccionados"
                  />
                </div>
              </div>
            )}

            {activeTab === 'estratos' && (
              <div className="max-w-7xl mx-auto space-y-8">
                {/* Gráficos de Análisis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-slate-200">
                      <h3 className="text-xl font-bold text-slate-800">Tendencias de Voto por Estrato</h3>
                    </div>
                    <div className="p-6">
                      <div style={{ position: 'relative', height: '400px' }}>
                        <Line data={chartLineasData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-slate-200">
                      <h3 className="text-xl font-bold text-slate-800">Porcentajes por Candidato</h3>
                    </div>
                    <div className="p-6">
                      <div style={{ position: 'relative', height: '400px' }}>
                        <Bar 
                          data={chartBarrasApiladasData} 
                          options={{
                            ...chartOptions,
                            scales: {
                              ...chartOptions.scales,
                              x: {
                                stacked: true,
                              },
                              y: {
                                stacked: true,
                                beginAtZero: true,
                                max: 100,
                              },
                            },
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Análisis de Correlaciones */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800">Interpretación de Correlaciones</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {correlaciones.map((corr, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <span className={corr.candidato === "Centro-Izquierda" ? "text-blue-600" : "text-red-600"}>
                              {corr.candidato}
                            </span>
                            <span className="text-slate-600">(r = {corr.correlacion})</span>
                          </h4>
                          <p className="text-slate-700 leading-relaxed">{corr.interpretacion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal detalle puesto de votación */}
        {selectedPuesto && (
          isMobile ? (
            <MobileModal
              isOpen={selectedPuesto !== null}
              onClose={() => setSelectedPuesto(null)}
              title={selectedPuesto.nombre}
            >
              <PuestoDetails puesto={selectedPuesto} />
            </MobileModal>
          ) : (
            <ResponsiveModal
              isOpen={selectedPuesto !== null}
              onClose={() => setSelectedPuesto(null)}
              title={selectedPuesto.nombre}
              size="md"
            >
              <PuestoDetails puesto={selectedPuesto} />
            </ResponsiveModal>
          )
        )}
      </div>
    </BackgroundWrapper>
  );
};

// Componente para mostrar detalles del puesto de votación
const PuestoDetails: React.FC<{
  puesto: PuestoVotacion;
}> = ({ puesto }) => {
  const porcCentroIzquierda = ((puesto.centroIzquierda / puesto.total) * 100).toFixed(1);
  const porcDerecha = ((puesto.derecha / puesto.total) * 100).toFixed(1);
  const porcOtros = ((puesto.otros / puesto.total) * 100).toFixed(1);

  const getEstratoColor = (estrato: number) => {
    if (estrato <= 2) return 'bg-red-100 text-red-800 border-red-200';
    if (estrato <= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Información general */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-700 flex items-center gap-2">
            📍 Información General
          </h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-slate-500">Nombre:</span>
              <span className="ml-2 text-slate-900 font-medium">{puesto.nombre}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-500">Estrato:</span>
              <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getEstratoColor(puesto.estrato)}`}>
                Estrato {puesto.estrato}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-500">Coordenadas:</span>
              <span className="ml-2 text-slate-900 font-mono text-sm">
                {puesto.lat.toFixed(5)}, {puesto.lon.toFixed(5)}
              </span>
            </div>
          </div>
        </div>

        {/* Resultados electorales */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-700 flex items-center gap-2">
            🗳️ Resultados Electorales
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500">Centro-Izquierda:</span>
              <div className="text-right">
                <span className="text-blue-600 font-bold">{puesto.centroIzquierda.toLocaleString()}</span>
                <span className="text-slate-500 text-sm ml-2">({porcCentroIzquierda}%)</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500">Derecha:</span>
              <div className="text-right">
                <span className="text-red-600 font-bold">{puesto.derecha.toLocaleString()}</span>
                <span className="text-slate-500 text-sm ml-2">({porcDerecha}%)</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500">Otros:</span>
              <div className="text-right">
                <span className="text-slate-600 font-bold">{puesto.otros.toLocaleString()}</span>
                <span className="text-slate-500 text-sm ml-2">({porcOtros}%)</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700">Total:</span>
                <span className="text-slate-900 font-bold text-lg">{puesto.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de barras visual */}
      <div className="border-t border-slate-200 pt-6">
        <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
          📊 Distribución Visual de Votos
        </h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-blue-600 font-medium">Centro-Izquierda</span>
              <span className="text-sm text-blue-600">{porcCentroIzquierda}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${porcCentroIzquierda}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-red-600 font-medium">Derecha</span>
              <span className="text-sm text-red-600">{porcDerecha}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${porcDerecha}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-slate-600 font-medium">Otros</span>
              <span className="text-sm text-slate-600">{porcOtros}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-slate-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${porcOtros}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionVotantes;
