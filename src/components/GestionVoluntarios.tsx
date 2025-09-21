import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Ajusta la ruta si es necesario
import { collection, getDocs } from 'firebase/firestore';
import { WhatsAppIcon, MailIcon, CloseIcon, SpinnerIcon } from './icons';

interface GestionVoluntariosProps {
  onBack: () => void;
}

interface Voluntario {
  id: string;
  nombre: string;
  telefono: string;
  correo: string;
  municipio: string;
  comuna?: string;
  profesion?: string;
  comite: string;
  publicidad?: string;
  observaciones?: string;
}

const GestionVoluntarios: React.FC<GestionVoluntariosProps> = ({ onBack }) => {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoluntario, setSelectedVoluntario] = useState<Voluntario | null>(null);

  useEffect(() => {
    const fetchVoluntarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "voluntarios"));
        const voluntariosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Voluntario));
        setVoluntarios(voluntariosData);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, revisa la configuración de Firebase.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVoluntarios();
  }, []);

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="flex-shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            ← Volver al Menú
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Voluntarios</h2>
        </div>
      </div>
      
      <div className="flex-grow w-full bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {loading ? (
            <div className="flex justify-center items-center h-full">
                <SpinnerIcon />
                <p className="text-slate-600 text-lg ml-3">Cargando voluntarios...</p>
            </div>
        ) : error ? (
          <p className="text-red-500 text-center text-lg">{error}</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Teléfono</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Municipio</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Comité</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {voluntarios.map((voluntario) => (
                <tr key={voluntario.id} onClick={() => setSelectedVoluntario(voluntario)} className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{voluntario.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{voluntario.telefono}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{voluntario.municipio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{voluntario.comite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedVoluntario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setSelectedVoluntario(null)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedVoluntario(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <CloseIcon />
              </button>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">{selectedVoluntario.nombre}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div className="flex flex-col">
                      <span className="font-semibold text-slate-500">Teléfono:</span>
                      <a href={`https://wa.me/${formatPhoneNumber(selectedVoluntario.telefono)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                          {selectedVoluntario.telefono} <WhatsAppIcon className="w-4 h-4" />
                      </a>
                  </div>
                  <div className="flex flex-col">
                      <span className="font-semibold text-slate-500">Correo:</span>
                      <a href={`mailto:${selectedVoluntario.correo}`} className="text-blue-600 hover:underline flex items-center gap-2">
                          {selectedVoluntario.correo} <MailIcon className="w-4 h-4" />
                      </a>
                  </div>
                  <p><span className="font-semibold text-slate-500">Municipio:</span> {selectedVoluntario.municipio}</p>
                  {selectedVoluntario.comuna && <p><span className="font-semibold text-slate-500">Comuna/Vereda:</span> {selectedVoluntario.comuna}</p>}
                  {selectedVoluntario.profesion && <p><span className="font-semibold text-slate-500">Profesión:</span> {selectedVoluntario.profesion}</p>}
                  <p><span className="font-semibold text-slate-500">Comité:</span> {selectedVoluntario.comite}</p>
                  {selectedVoluntario.publicidad && <p><span className="font-semibold text-slate-500">Tipo de Publicidad:</span> {selectedVoluntario.publicidad}</p>}
              </div>
              {selectedVoluntario.observaciones && (
                  <div className="mt-6">
                    <p className="font-semibold text-slate-500">Observaciones:</p>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-md mt-1">{selectedVoluntario.observaciones}</p>
                  </div>
              )}
          </div>
      </div>
      )}
    </div>
  );
};

export default GestionVoluntarios;
