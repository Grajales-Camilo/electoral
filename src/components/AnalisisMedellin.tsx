import React from 'react';

const AnalisisMedellin: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-h-[calc(100vh-200px)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Resultados en Medellín</h2>

      <h3 className="text-xl font-bold text-slate-800 mb-3">Elección de Cámara y Senado</h3>
      <p className="text-slate-600 mb-4">
        La base para Medellín agrupa los votos por comuna y zona. Al sumar la votación de los votos válidos y los votos del Pacto se obtiene la participación del Pacto por comuna.
      </p>
      <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
        <li>La comuna Belén tuvo el mayor número absoluto de votos para el Pacto (≈12 k), seguida de Robledo (10 k), Buenos Aires (8,9 k) y Castilla (8,6 k).</li>
        <li>Las comunas con mayor proporción de votos al Pacto fueron Presidios (29,8 %) –un censo pequeño en centros carcelarios–, Robledo (20,5 %), Estadio (19,7 %), Castilla (19,5 %), Santa Cruz (19,4 %), Manrique (19,0 %) y Buenos Aires (18,8 %).</li>
      </ul>
      
      <div className="my-4 text-center">
        <img src="images/top_comunas_pacto_medellin.png" alt="Comunas con mayor proporción de votos al Pacto en Medellín" className="mx-auto rounded-lg shadow-sm" />
        <p className="text-sm text-slate-500 mt-2">Figura 1 – Comunas de Medellín con mayor proporción de votos al Pacto Histórico (Cámara 2022).</p>
      </div>
      <div className="my-4 text-center">
        <img src="images/top_comunas_pacto_medellin2.png" alt="Comunas con mayor número de votos al Pacto en Medellín" className="mx-auto rounded-lg shadow-sm" />
        <p className="text-sm text-slate-500 mt-2">Figura 2 – Comunas de Medellín con mayor número de votos al Pacto Histórico (Cámara 2022).</p>
      </div>

      <hr className="my-6" />

      <h3 className="text-xl font-bold text-slate-800 mb-3">Segunda vuelta presidencial en Medellín</h3>
        <p className="text-slate-600 mb-4">
            Los datos de la segunda vuelta (archivo Votación Medellín 2da Vuelta) muestran la proporción de Petro frente a Rodolfo Hernández por zona. La figura 3 recoge las 10 zonas con mayores porcentajes para Petro.
        </p>
      <div className="my-4 text-center">
        <img src="images/top_zonas_petro_segunda.png" alt="Zonas con mayor proporción de votos para Petro en segunda vuelta" className="mx-auto rounded-lg shadow-sm" />
        <p className="text-sm text-slate-500 mt-2">Figura 3 – Zonas de Medellín con mayor proporción de votos para Gustavo Petro (segunda vuelta presidencial 2022).</p>
      </div>
       <p className="text-slate-600 mb-4">
        En general, la segunda vuelta mostró un mayor apoyo a Rodolfo Hernández en la mayoría de las zonas: Petro superó el 45 % sólo en zonas 1–4 y 14. El promedio para Medellín fue de ≈42 % contra 58 % para Hernández, lo que confirma la necesidad de fortalecer la campaña en la ciudad.
      </p>

      <hr className="my-6" />

      <h3 className="text-xl font-bold text-slate-800 mb-3">Algunas Estrategias para Medellín:</h3>
      <ol className="list-decimal list-inside text-slate-600 space-y-3">
        <li><strong>Fidelización del voto en comunas con alto apoyo.</strong> Comunas como Robledo, Castilla, Santa Cruz, Manrique, Buenos Aires y Belén concentran una proporción y un número elevado de votos. Crear redes de líderes comunitarios, promover espacios culturales y sociales y mantener contacto permanente puede evitar la desmovilización.</li>
        <li><strong>Conquista de comunas intermedias.</strong> Comunas con una proporción de 12–15 % pero alto censo como La Candelaria, La América, Laureles–Estadio y Doce de Octubre son cruciales para crecer. Mensajes asociados a seguridad, movilidad y oportunidades económicas pueden resonar en estos sectores.</li>
        <li><strong>Juventud y movilización digital.</strong> La consulta y el paro nacional mostraron la fuerza de los jóvenes. Incentivar procesos artísticos, deportivos y de economía digital en zonas como Estadio y Robledo, y reforzar la comunicación, puede consolidar este segmento.</li>
        <li><strong>Segunda vuelta: convencer a indecisos.</strong> La segunda vuelta evidenció que un 58 % de los votos en Medellín se orientó hacia el otro candidato. Para futuras elecciones se debe abordar preocupaciones sobre seguridad y gestión urbana, mostrando resultados concretos en gobierno nacional y propuestas confiables para la ciudad.</li>
        <li><strong>Alianzas metropolitanas.</strong> En el AMVA Petro alcanzó porcentajes competitivos en Bello, Copacabana y Caldas. La construcción de un proyecto metropolitano (movilidad, servicios públicos) junto a estos municipios puede ampliar la base de apoyo.</li>
      </ol>

    </div>
  );
};

export default AnalisisMedellin;
