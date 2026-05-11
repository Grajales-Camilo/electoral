
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import 'leaflet/dist/leaflet.css';
import '../marker-cluster.css';

import coordenadasJson from '../coordenadas_municipios.json';

// --- INTERFACES y TIPOS ---
interface Voluntario {
  id: string;
  municipio: string;
}

interface MapaVoluntariosAntioquiaProps {
  voluntarios: Voluntario[];
}

interface CoordenadasMap {
  [key: string]: [number, number];
}

// CORRECCIÓN DEFINITIVA: Se utiliza una doble aserción para satisfacer las reglas estrictas de TypeScript.
const coordenadas = coordenadasJson as unknown as CoordenadasMap;

// --- COMPONENTES AUXILIARES ---
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

// --- CONFIGURACIÓN DE ÍCONO ---
const defaultIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- COMPONENTE PRINCIPAL ---
const MapaVoluntariosAntioquia: React.FC<MapaVoluntariosAntioquiaProps> = ({ voluntarios }) => {
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const geoJsonUrl = 'https://storage.googleapis.com/ivc-26.firebasestorage.app/geojson/antioquia_subregiones_clean.geojson';

    useEffect(() => {
        const fetchGeoJson = async () => {
            setLoading(true);
            try {
                const response = await fetch(geoJsonUrl);
                if (!response.ok) {
                    throw new Error(`Error al cargar el GeoJSON: ${response.statusText}`);
                }
                const data = await response.json();
                setGeoJsonData(data);
            } catch (err: any) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGeoJson();
    }, []);

    const renderMarkers = () => {
        const counts = voluntarios.reduce<Record<string, number>>((acc, voluntario) => {
            const municipioKey = (voluntario.municipio || '').toUpperCase().trim();
            if (municipioKey) acc[municipioKey] = (acc[municipioKey] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts)
            .map(([municipioKey, total]) => {
                const coords = coordenadas[municipioKey];

                if (coords) {
                    return (
                        <Marker key={municipioKey} position={coords} icon={defaultIcon}>
                            <Tooltip>
                                <strong>{municipioKey}</strong><br />
                                Registros agregados: {total}
                            </Tooltip>
                        </Marker>
                    );
                }
                return null;
            })
            .filter((marker): marker is React.ReactElement => marker !== null);
    };

    if (loading) return <p className="text-center text-slate-600">Cargando mapa de Antioquia...</p>;
    if (error) return <p className="text-center text-red-500">Error al cargar el mapa: {error}</p>;

    return (
        <div className="h-[600px] w-full bg-white rounded-lg shadow-md p-4 relative">
            <MapContainer center={[6.5, -75.5]} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <MapResizer />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {geoJsonData && (
                    <GeoJSON 
                        data={geoJsonData} 
                        style={{ weight: 1, color: '#4A5568', fillOpacity: 0.1 }}
                    />
                )}
                <MarkerClusterGroup>
                    {renderMarkers()}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

export default MapaVoluntariosAntioquia;
