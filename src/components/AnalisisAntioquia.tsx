import React from 'react';

const AnalisisAntioquia: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-h-[calc(100vh-200px)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Resultados electorales en Antioquia</h2>
      <p className="text-slate-600 mb-4">
        Se analizaron los resultados de las elecciones legislativas de 2022 (Cámara y Senado) para Antioquia. Se suma la votación de cada partido por municipio para la Cámara de Representantes y Senado; se usaron la suma de “total votos válidos” como denominador para calcular la participación del Pacto Histórico.
      </p>

      <hr className="my-6" />

      <h3 className="text-xl font-bold text-slate-800 mb-3">Comparación de partidos:</h3>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-slate-600">Partido</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-slate-600">Votos en Cámara 2022 (Antioquia)</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-slate-600">Votos en Senado 2022 (Antioquia)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-slate-50">
              <td className="py-2 px-4 border-b text-slate-700">Partido Liberal</td>
              <td className="py-2 px-4 border-b text-slate-700">222,179</td>
              <td className="py-2 px-4 border-b text-slate-700">247,361</td>
            </tr>
            <tr className="hover:bg-slate-50">
                <td className="py-2 px-4 border-b text-slate-700">Centro Democrático</td>
                <td className="py-2 px-4 border-b text-slate-700">212,663</td>
                <td className="py-2 px-4 border-b text-slate-700">428,287 (1.º en Senado)</td>
            </tr>
            <tr className="hover:bg-slate-50">
                <td className="py-2 px-4 border-b text-slate-700">Partido Conservador</td>
                <td className="py-2 px-4 border-b text-slate-700">202,652</td>
                <td className="py-2 px-4 border-b text-slate-700">365,089</td>
            </tr>
            <tr className="hover:bg-slate-50">
                <td className="py-2 px-4 border-b text-slate-700">Pacto Histórico</td>
                <td className="py-2 px-4 border-b text-slate-700">141,717</td>
                <td className="py-2 px-4 border-b text-slate-700">205,703</td>
            </tr>
            <tr className="hover:bg-slate-50">
                <td className="py-2 px-4 border-b text-slate-700">Alianza Verde</td>
                <td className="py-2 px-4 border-b text-slate-700">118,623</td>
                <td className="py-2 px-4 border-b text-slate-700">249,744</td>
            </tr>
             <tr className="hover:bg-slate-50">
                <td className="py-2 px-4 border-b text-slate-700">Otros (26 partidos y listas)</td>
                <td className="py-2 px-4 border-b text-slate-700">~620,000</td>
                <td className="py-2 px-4 border-b text-slate-700">~873,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-slate-600 mb-4">
        Aunque el Pacto se posicionó en cuarta y quinta posición, su votación creció frente a 2018 y le permitió obtener varias curules.
      </p>

      <hr className="my-6" />

      <h3 className="text-xl font-bold text-slate-800 mb-3">Municipios con mayor y menor apoyo al Pacto (Cámara 2022):</h3>
      <p className="text-slate-600 mb-4">
        Se calculó la proporción de votos al Pacto respecto a los votos válidos en cada municipio. La figura 1 muestra los diez municipios con mayor proporción y la figura 2 los diez con menor proporción.
      </p>
      <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
        <li>La mayor proporción se encuentra en Maceo (48 %), La Pintada (48 %), Puerto Nare (47 %), Montebello (44 %) y La Estrella (38 %). Excepto La Estrella, son municipios de baja población donde la coalición obtuvo pocos votos absolutos pero un alto porcentaje.</li>
        <li>En municipios medianos como Apartadó (18 %), Segovia (20 %) y Copacabana (18 %) la participación superó el 15 %.</li>
        <li>Los municipios con menor participación son Vigía del Fuerte (0,3 %), Campamento (0,6 %), Betania (1,2 %) y Abriaquí (1,3 %). Estos lugares aportan pocos votos en términos absolutos y muestran muy baja penetración del Pacto.</li>
      </ul>
      
      <div className="my-4 text-center">
        <img src="images/top_municipios_pacto_camara.png" alt="Municipios con mayor proporción de votos al Pacto" className="mx-auto rounded-lg shadow-sm" />
        <p className="text-sm text-slate-500 mt-2">Figura 1 – Municipios de Antioquia con mayor proporción de votos al Pacto Histórico en la Cámara 2022.</p>
      </div>
      <div className="my-4 text-center">
        <img src="images/bottom_municipios_pacto_camara.png" alt="Municipios con menor proporción de votos al Pacto" className="mx-auto rounded-lg shadow-sm" />
        <p className="text-sm text-slate-500 mt-2">Figura 2 – Municipios de Antioquia con menor proporción de votos al Pacto Histórico en la Cámara 2022.</p>
      </div>

       <p className="text-slate-600 mb-4">
        En la elección al Senado el Pacto superó el 10 % sólo en algunos municipios. Segovia (12,5 % de los votos), Apartadó (12 %), Yondó (11 %), Copacabana (10,8 %) y Chigorodó (10,8 %) fueron los municipios donde el apoyo fue relativamente alto. Aun así, la mayoría de municipios tuvieron una participación inferior al 10 %, lo que evidencia el desafío de consolidar el proyecto en la región.
      </p>

      <hr className="my-6" />

      <h3 className="text-xl font-bold text-slate-800 mb-3">Tamaño de los municipios con apoyo al Pacto:</h3>
      <div className="my-4 text-center">
        <img src="images/tamano_municipio_pacto.png" alt="Tamaño de los municipios con apoyo al Pacto" className="mx-auto rounded-lg shadow-sm" />
      </div>
       <p className="text-slate-600 mb-4">
        La gráfica sitúa, en el eje horizontal, el tamaño electoral de cada municipio (votos totales al Senado) y, en el eje vertical, el porcentaje obtenido por el Pacto Histórico. Cada marca representa un municipio de Antioquia en 2022.
      </p>
        <h4 className="text-lg font-semibold text-slate-700 mt-4">Dónde se concentra el mapa</h4>
        <p className="text-slate-600 mb-2">La nube de puntos se amontona en municipios pequeños y medianos: la mayor parte está entre 2.000 y 15.000 votos totales, con rendimientos para el Pacto de 2% a 6%. Hay excepciones que superan el 10% aun siendo chicos, pero su peso agregado es limitado: porcentajes altos con pocos votos no mueven la aguja departamental.</p>
        <h4 className="text-lg font-semibold text-slate-700 mt-4">Cuando el volumen crece</h4>
        <p className="text-slate-600 mb-2">En el tramo 15.000–50.000 votos, aparecen varios municipios con 7%–12%. No es un salto dramático, pero se insinúa una mejora leve del porcentaje a medida que crece el tamaño. En los municipios grandes (≥100.000 votos), los porcentajes se ubican típicamente entre 8% y 11%: no son los más altos, pero cada punto porcentual allí equivale a muchos más votos netos.</p>
        <h4 className="text-lg font-semibold text-slate-700 mt-4">La relación tamaño–porcentaje:</h4>
       <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
            <li>Se debe priorizar por volumen con margen: subir 2–4 puntos en municipios medianos y grandes impacta más que subir +5 en municipios diminutos.</li>
            <li>Usar a los “chicos exitosos” como laboratorio: si un municipio pequeño logró &gt;10%, conviene entender qué práctica replicable explica ese resultado (redes territoriales, mensajes, liderazgos). Luego, escalar lo que funcione a territorios con más electores.</li>
        </ul>
         <p className="text-slate-600 mb-4">
       El “Tamaño de los municipios con apoyo al Pacto” muestra que el terreno decisivo está en el volumen. El Pacto puede mejorar su posición departamental si concentra esfuerzo en municipios medianos y grandes con espacio para crecer algunos puntos. Las excepciones de alto porcentaje en municipios pequeños inspiran, pero no definen el resultado global. La estrategia debe combinar aprendizaje de nichos pequeños con escalamiento en plazas de alto impacto.
      </p>

    </div>
  );
};

export default AnalisisAntioquia;
