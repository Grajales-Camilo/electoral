import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

// --- INTERFACES Y TIPOS ---
interface VotoDataAMVA {
    municipio: string;
    votacion: number;
}
type Vuelta = 'Primera' | 'Segunda';
type Tab = 'antioquia' | 'amva' | 'medellin';

interface MapaAMVAProps {
  setActiveTab: (tab: Tab) => void;
}

const FALLBACK_VOTOS_AMVA: Record<Vuelta, Record<string, number>> = {
    Primera: {
        'MEDELLÍN': 77067,
        'BELLO': 15899,
        'ITAGÜÍ': 9593,
        'ENVIGADO': 7841,
        'COPACABANA': 3319,
        'SABANETA': 2819,
        'CALDAS': 2366,
        'GIRARDOTA': 1995,
        'LA ESTRELLA': 2214,
        'BARBOSA': 1582,
    },
    Segunda: {
        'MEDELLÍN': 207642,
        'BELLO': 41733,
        'ITAGÜÍ': 29397,
        'ENVIGADO': 25879,
        'COPACABANA': 9435,
        'SABANETA': 9057,
        'CALDAS': 8582,
        'GIRARDOTA': 6628,
        'LA ESTRELLA': 7086,
        'BARBOSA': 4371,
    },
};

// --- COMPONENTE DE CAPAS ---
const MapLayersAMVA = ({ geoJsonData, votosData, vuelta, setActiveTab }: { geoJsonData: any, votosData: Record<string, number>, vuelta: Vuelta, setActiveTab: (tab: Tab) => void }) => {
    const map = useMap();

    const getColor = (votes: number) => {
        if (votes > 400000) return '#800026';
        if (votes > 200000) return '#BD0026';
        if (votes > 100000) return '#E31A1C';
        if (votes > 50000) return '#FC4E2A';
        if (votes > 20000) return '#FD8D3C';
        if (votes > 10000) return '#FEB24C';
        if (votes > 5000) return '#FED976';
        return '#FFEDA0';
    };

    const style = (feature: any) => {
        const municipioName = feature.properties?.MUNICIPIO?.toUpperCase();
        const votes = votosData[municipioName] || 0;
        return {
            fillColor: getColor(votes),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    const Legend: React.FC = () => (
        <div className="leaflet-bottom leaflet-right">
            <div className="leaflet-control leaflet-bar bg-white p-2 rounded-md shadow">
                <h4 className="font-bold mb-1">Votos Gustavo Petro (2022)</h4>
                <div className="flex items-center"><i style={{ background: '#800026' }} className="w-4 h-4 mr-2"></i><span>&gt; 400,000</span></div>
                <div className="flex items-center"><i style={{ background: '#BD0026' }} className="w-4 h-4 mr-2"></i><span>200,001 - 400,000</span></div>
                <div className="flex items-center"><i style={{ background: '#E31A1C' }} className="w-4 h-4 mr-2"></i><span>100,001 - 200,000</span></div>
                <div className="flex items-center"><i style={{ background: '#FC4E2A' }} className="w-4 h-4 mr-2"></i><span>50,001 - 100,000</span></div>
                <div className="flex items-center"><i style={{ background: '#FD8D3C' }} className="w-4 h-4 mr-2"></i><span>20,001 - 50,000</span></div>
                <div className="flex items-center"><i style={{ background: '#FEB24C' }} className="w-4 h-4 mr-2"></i><span>10,001 - 20,000</span></div>
                <div className="flex items-center"><i style={{ background: '#FED976' }} className="w-4 h-4 mr-2"></i><span>5,001 - 10,000</span></div>
                <div className="flex items-center"><i style={{ background: '#FFEDA0' }} className="w-4 h-4 mr-2"></i><span>0 - 5,000</span></div>
            </div>
        </div>
    );
    
    useEffect(() => {
        map.invalidateSize();
    }, [map]);

    return (
        <>
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Vista Estándar">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Vista Satelital">
                     <TileLayer
                        url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                        maxZoom={20}
                        subdomains={['mt1','mt2','mt3']}
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            <GeoJSON 
                key={vuelta + JSON.stringify(votosData)}
                data={geoJsonData} 
                style={style}
                onEachFeature={(feature, layer) => {
                    // **CORRECCIÓN: Usar encadenamiento opcional para evitar el crash**
                    const municipioName = feature.properties?.MUNICIPIO;
                    
                    // Solo añadir tooltip y evento si el municipio existe
                    if (municipioName) {
                        const votes = votosData[municipioName.toUpperCase()] || 0;
                        layer.bindTooltip(
                            `<strong>${municipioName}</strong><br/>Votos: ${votes.toLocaleString()}`
                        );

                        if (municipioName.toUpperCase() === 'MEDELLÍN') {
                            layer.on('click', () => {
                                setActiveTab('medellin');
                            });
                        }
                    }
                }}
            />
            <Legend />
        </>
    );
}

// --- COMPONENTE PRINCIPAL (Sin cambios) ---
const MapaAMVA: React.FC<MapaAMVAProps> = ({ setActiveTab }) => {
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [votosData, setVotosData] = useState<Record<string, number> | null>(null);
    const [vuelta, setVuelta] = useState<Vuelta>('Primera');
    const [loading, setLoading] = useState(true);

    const geoJsonUrl = 'https://storage.googleapis.com/ivc-26.firebasestorage.app/geojson/amva_municipios.geojson';
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setVotosData(null); 
            
            if (!geoJsonData) {
                try {
                    const response = await fetch(geoJsonUrl);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();
                    setGeoJsonData(data);
                } catch (error) {
                    console.error("Error cargando el GeoJSON:", error);
                    setLoading(false);
                    return;
                }
            }
            
            try {
                const q = query(
                    collection(db, "resultados_presidenciales"),
                    where("candidato", "==", "Gustavo Petro"),
                    where("vuelta", "==", vuelta)
                );
                const querySnapshot = await getDocs(q);
                const votosAgregados: Record<string, number> = {};
                querySnapshot.forEach((doc) => {
                    const data = doc.data() as VotoDataAMVA;
                    const municipioKey = data.municipio?.toUpperCase();
                    if (municipioKey) {
                        votosAgregados[municipioKey] = (votosAgregados[municipioKey] || 0) + data.votacion;
                    }
                });
                setVotosData(votosAgregados);
            } catch (error) {
                console.error("Error consultando Firestore:", error);
                setVotosData(FALLBACK_VOTOS_AMVA[vuelta]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [vuelta, geoJsonData]);

    return (
        <div className="h-[calc(100vh-200px)] w-full bg-white rounded-lg shadow-md p-4 relative">
            <div className="absolute top-6 left-20 z-[1000] bg-white p-2 rounded-md shadow-lg flex gap-2">
                <button 
                    onClick={() => setVuelta('Primera')}
                    className={`px-3 py-1 text-sm font-semibold rounded-md ${vuelta === 'Primera' ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-800'}`}
                >
                    Primera Vuelta
                </button>
                <button 
                    onClick={() => setVuelta('Segunda')}
                    className={`px-3 py-1 text-sm font-semibold rounded-md ${vuelta === 'Segunda' ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-800'}`}
                >
                    Segunda Vuelta
                </button>
            </div>
            <MapContainer center={[6.244, -75.581]} zoom={10} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                {!loading && geoJsonData && votosData && (
                    <MapLayersAMVA 
                        geoJsonData={geoJsonData} 
                        votosData={votosData}
                        vuelta={vuelta}
                        setActiveTab={setActiveTab}
                    />
                )}
            </MapContainer>
            {loading && (
                 <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-[1001]">
                    <p>Cargando datos...</p>
                </div>
            )}
        </div>
    );
};

export default MapaAMVA;
