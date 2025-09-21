import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip, LayersControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Map } from 'leaflet';

// INTERFACES
interface VotoData {
    subregion: string;
    votacion: number;
}
type Eleccion = 'Senado' | 'Camara';
type Tab = 'antioquia' | 'amva' | 'medellin';

interface MapaAntioquiaProps {
  setActiveTab: (tab: Tab) => void;
}

// COMPONENTE INTERNO
const MapLayers = ({ geoJsonData, votosData, eleccion, setActiveTab }: { geoJsonData: any, votosData: Record<string, number>, eleccion: Eleccion, setActiveTab: (tab: Tab) => void }) => {
    const map = useMap();

    const getColor = (votes: number) => {
        if (votes > 100000) return '#800026';
        if (votes > 50000) return '#BD0026';
        if (votes > 20000) return '#E31A1C';
        if (votes > 10000) return '#FC4E2A';
        if (votes > 5000) return '#FD8D3C';
        if (votes > 2000) return '#FEB24C';
        if (votes > 1000) return '#FED976';
        return '#FFEDA0';
    };

    const style = (feature: any) => {
        const subregionName = feature.properties.SUBREGION;
        const votes = votosData[subregionName] || 0;
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
                <h4 className="font-bold mb-1">Votos Pacto Histórico</h4>
                <div className="flex items-center"><i style={{ background: '#800026' }} className="w-4 h-4 mr-2"></i><span>&gt; 100,000</span></div>
                <div className="flex items-center"><i style={{ background: '#BD0026' }} className="w-4 h-4 mr-2"></i><span>50,001 - 100,000</span></div>
                <div className="flex items-center"><i style={{ background: '#E31A1C' }} className="w-4 h-4 mr-2"></i><span>20,001 - 50,000</span></div>
                <div className="flex items-center"><i style={{ background: '#FC4E2A' }} className="w-4 h-4 mr-2"></i><span>10,001 - 20,000</span></div>
                <div className="flex items-center"><i style={{ background: '#FD8D3C' }} className="w-4 h-4 mr-2"></i><span>5,001 - 10,000</span></div>
                <div className="flex items-center"><i style={{ background: '#FEB24C' }} className="w-4 h-4 mr-2"></i><span>2,001 - 5,000</span></div>
                <div className="flex items-center"><i style={{ background: '#FED976' }} className="w-4 h-4 mr-2"></i><span>1,001 - 2,000</span></div>
                <div className="flex items-center"><i style={{ background: '#FFEDA0' }} className="w-4 h-4 mr-2"></i><span>0 - 1,000</span></div>
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
                key={eleccion + JSON.stringify(votosData)}
                data={geoJsonData} 
                style={style}
                onEachFeature={(feature, layer) => {
                    const subregionName = feature.properties.SUBREGION;
                    const votes = votosData[subregionName] || 0;
                    layer.bindTooltip(
                        `<strong>${subregionName}</strong><br/>Votos: ${votes.toLocaleString()}`
                    );

                    if (subregionName === 'VALLE DE ABURRÁ') {
                        layer.on('click', () => {
                            setActiveTab('amva');
                        });
                    }
                }}
            />
            <Legend />
        </>
    );
}

// COMPONENTE PRINCIPAL
const MapaAntioquia: React.FC<MapaAntioquiaProps> = ({ setActiveTab }) => {
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [votosData, setVotosData] = useState<Record<string, number> | null>(null);
    const [eleccion, setEleccion] = useState<Eleccion>('Senado');
    const [loading, setLoading] = useState(true);

    const geoJsonUrl = 'https://storage.googleapis.com/ivc-26.firebasestorage.app/geojson/antioquia_subregiones_clean.geojson';
    
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
                    collection(db, "resultados_elecciones"),
                    where("partido", "==", "PACTO HISTORICO"),
                    where("eleccion", "==", eleccion)
                );
                const querySnapshot = await getDocs(q);
                const votosAgregados: Record<string, number> = {};
                querySnapshot.forEach((doc) => {
                    const data = doc.data() as VotoData;
                    const subregionKey = data.subregion?.toUpperCase();
                    if (subregionKey) {
                        votosAgregados[subregionKey] = (votosAgregados[subregionKey] || 0) + data.votacion;
                    }
                });
                setVotosData(votosAgregados);
            } catch (error) {
                console.error("Error consultando Firestore:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [eleccion, geoJsonData]);

    return (
        <div className="h-[calc(100vh-200px)] w-full bg-white rounded-lg shadow-md p-4 relative">
            <div className="absolute top-6 left-20 z-[1000] bg-white p-2 rounded-md shadow-lg flex gap-2">
                <button 
                    onClick={() => setEleccion('Senado')}
                    className={`px-3 py-1 text-sm font-semibold rounded-md ${eleccion === 'Senado' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'}`}
                >
                    Senado
                </button>
                <button 
                    onClick={() => setEleccion('Camara')}
                    className={`px-3 py-1 text-sm font-semibold rounded-md ${eleccion === 'Camara' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'}`}
                >
                    Cámara
                </button>
            </div>
            <MapContainer center={[6.5, -75.5]} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                {!loading && geoJsonData && votosData && (
                    <MapLayers 
                        geoJsonData={geoJsonData} 
                        votosData={votosData}
                        eleccion={eleccion}
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

export default MapaAntioquia;