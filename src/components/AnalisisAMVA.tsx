import React from 'react';

const AnalisisAMVA: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-h-[calc(100vh-200px)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Presidenciales 2022 – Área Metropolitana del Valle de Aburrá (AMVA)</h2>
      <p className="text-slate-600 mb-4">
        Los resultados electorales en el AMVA, permite comparar la votación de la primera vuelta presidencial entre candidatos en los diez municipios del área metropolitana. En el AMVA Gustavo Petro tuvo porcentajes competitivos en municipios obreros (Bello, Copacabana, Caldas), mientras que en municipios de clase media alta (Envigado, Sabaneta) su desempeño fue más bajo. La figura 1 muestra la proporción de votos de Gustavo Petro.
      </p>

      <div className="my-4 text-center">
        <img src="images/petro_share_amva.png" alt="Proporción de votos para Gustavo Petro en AMVA" className="mx-auto rounded-lg shadow-sm" />
        <p className="text-sm text-slate-500 mt-2">Figura 1 – Proporción de votos para Gustavo Petro en la primera vuelta presidencial 2022 en cada municipio del Área Metropolitana del Valle de Aburrá.</p>
      </div>

      <p className="text-slate-600 mb-4">
        Petro obtuvo sus mejores porcentajes en Copacabana (28 %), Bello (27 %) y Caldas (25,8 %). En Medellín logró ≈24 %, mientras que en municipios de renta alta como Envigado y Sabaneta su porcentaje fue inferior al 20 %.
      </p>

      <hr className="my-6" />

      <h3 className="text-xl font-bold text-slate-800 mb-3">Segunda vuelta presidencial</h3>
      <p className="text-slate-600 mb-4">
        El mapa sugiere dos pistas prácticas. La primera es priorizar volumen con margen: en Medellín, Bello e Itagüí, cada punto adicional se traduce en centenares o miles de votos; asegurar cobertura de puestos grandes, testigos y logística puede traducirse en números de votos altos. La segunda es cuidar los nichos elásticos: en Girardota, Caldas y Copacabana, la expansión porcentual de la segunda vuelta deja un rastro de audiencia persuasible que responde a mensajes concretos y vocerías cercanas. Si esas dos líneas corren en paralelo, la curva de crecimiento vista en los resultados de segunda vuelta no fue un accidente, sino la señal de una estrategia muy escalable para el resto de los municipios del AMVA.
      </p>

      <div className="my-4 text-center">
        <img src="images/petro_share2_amva.png" alt="Crecimiento en puntos porcentuales de Gustavo Petro" className="mx-auto rounded-lg shadow-sm" />
        <p className="text-sm text-slate-500 mt-2">Figura 2 – Crecimiento en puntos porcentuales de Gustavo Petro en los municipios del Área Metropolitana del Valle de Aburrá.</p>
      </div>
       <div className="my-4 text-center">
        <img src="images/petro_share3_amva.png" alt="Crecimiento en votos absolutos de Gustavo Petro" className="mx-auto rounded-lg shadow-sm" />
        <p className="text-sm text-slate-500 mt-2">Figura 3 – Crecimiento en votos absolutos de Gustavo Petro en los municipios del Área Metropolitana del Valle de Aburrá.</p>
      </div>

      <hr className="my-6" />

      <h3 className="text-xl font-bold text-slate-800 mb-3">Crecimiento General de Votos para Petro</h3>
      <p className="text-slate-600 mb-4">
        Analizando los datos de la primera y segunda vuelta para Gustavo Petro en el Área Metropolitana del Valle de Aburrá (AMVA), se observa un crecimiento significativo en todos los municipios. Este incremento representa un fenómeno electoral importante considerando que en primera vuelta Petro obtuvo porcentajes de votación muy bajos (entre 5% y 9%).
      </p>

        <h4 className="text-lg font-semibold text-slate-700 mt-4">Patrones por Municipio</h4>
        <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border border-slate-200 mt-2">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="py-2 px-4 border-b text-left text-sm font-semibold text-slate-600">Municipio</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-semibold text-slate-600">1ra Vuelta</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-semibold text-slate-600">2da Vuelta</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-semibold text-slate-600">Crecimiento Absoluto</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-semibold text-slate-600">Crecimiento %</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-slate-50"><td className="py-2 px-4 border-b text-slate-700">Medellín</td><td className="py-2 px-4 border-b text-slate-700">77,067</td><td className="py-2 px-4 border-b text-slate-700">207,642</td><td className="py-2 px-4 border-b text-slate-700">+130,575</td><td className="py-2 px-4 border-b text-slate-700">+169%</td></tr>
                    <tr className="hover:bg-slate-50"><td className="py-2 px-4 border-b text-slate-700">Bello</td><td className="py-2 px-4 border-b text-slate-700">15,899</td><td className="py-2 px-4 border-b text-slate-700">41,733</td><td className="py-2 px-4 border-b text-slate-700">+25,834</td><td className="py-2 px-4 border-b text-slate-700">+162%</td></tr>
                    <tr className="hover:bg-slate-50"><td className="py-2 px-4 border-b text-slate-700">Itagüí</td><td className="py-2 px-4 border-b text-slate-700">9,593</td><td className="py-2 px-4 border-b text-slate-700">29,397</td><td className="py-2 px-4 border-b text-slate-700">+19,804</td><td className="py-2 px-4 border-b text-slate-700">+206%</td></tr>
                    <tr className="hover:bg-slate-50"><td className="py-2 px-4 border-b text-slate-700">Envigado</td><td className="py-2 px-4 border-b text-slate-700">7,841</td><td className="py-2 px-4 border-b text-slate-700">25,879</td><td className="py-2 px-4 border-b text-slate-700">+18,038</td><td className="py-2 px-4 border-b text-slate-700">+230%</td></tr>
                    <tr className="hover:bg-slate-50"><td className="py-2 px-4 border-b text-slate-700">Copacabana</td><td className="py-2 px-4 border-b text-slate-700">3,319</td><td className="py-2 px-4 border-b text-slate-700">9,435</td><td className="py-2 px-4 border-b text-slate-700">+6,116</td><td className="py-2 px-4 border-b text-slate-700">+184%</td></tr>
                    <tr className="hover:bg-slate-50"><td className="py-2 px-4 border-b text-slate-700">Sabaneta</td><td className="py-2 px-4 border-b text-slate-700">2,819</td><td className="py-2 px-4 border-b text-slate-700">9,057</td><td className="py-2 px-4 border-b text-slate-700">+6,238</td><td className="py-2 px-4 border-b text-slate-700">+221%</td></tr>
                    <tr className="hover:bg-slate-50"><td className="py-2 px-4 border-b text-slate-700">Caldas</td><td className="py-2 px-4 border-b text-slate-700">2,366</td><td className="py-2 px-4 border-b text-slate-700">8,582</td><td className="py-2 px-4 border-b text-slate-700">+6,216</td><td className="py-2 px-4 border-b text-slate-700">+263%</td></tr>
                    <tr className="hover:bg-slate-50"><td className="py-2 px-4 border-b text-slate-700">Girardota</td><td className="py-2 px-4 border-b text-slate-700">1,995</td><td className="py-2 px-4 border-b text-slate-700">6,628</td><td className="py-2 px-4 border-b text-slate-700">+4,633</td><td className="py-2 px-4 border-b text-slate-700">+232%</td></tr>
                    <tr className="hover:bg-slate-50"><td className="py-2 px-4 border-b text-slate-700">La Estrella</td><td className="py-2 px-4 border-b text-slate-700">2,214</td><td className="py-2 px-4 border-b text-slate-700">7,086</td><td className="py-2 px-4 border-b text-slate-700">+4,872</td><td className="py-2 px-4 border-b text-slate-700">+220%</td></tr>
                    <tr className="hover:bg-slate-50"><td className="py-2 px-4 border-b text-slate-700">Barbosa</td><td className="py-2 px-4 border-b text-slate-700">1,582</td><td className="py-2 px-4 border-b text-slate-700">4,371</td><td className="py-2 px-4 border-b text-slate-700">+2,789</td><td className="py-2 px-4 border-b text-slate-700">+176%</td></tr>
                </tbody>
            </table>
        </div>

        <h4 className="text-lg font-semibold text-slate-700 mt-4">Transferencia de Votos del Centro</h4>
        <p className="text-slate-600 mb-2">Se observa una fuerte correlación entre la cantidad de votos recibidos por Sergio Fajardo en primera vuelta y el incremento de votos para Petro en segunda vuelta. En municipios donde Fajardo tuvo un porcentaje alto en primera vuelta (como Girardota y Caldas con 42%), Petro experimentó un incremento superior al 230%.</p>
        
        <h4 className="text-lg font-semibold text-slate-700 mt-4">Diferencias Territoriales:</h4>
        <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
            <li><strong>Municipios con Mayor Crecimiento Porcentual:</strong> Caldas (263%), Girardota (232%) y Envigado (230%) muestran los mayores incrementos porcentuales para Petro.</li>
            <li><strong>Municipios con Menor Crecimiento Porcentual:</strong> Bello (162%) y Medellín (169%) presentan incrementos significativos pero menores al resto de municipios.</li>
            <li><strong>Caso Especial - Envigado:</strong> A pesar de ser el municipio donde Petro tuvo su peor resultado en primera vuelta (5%), mostró uno de los crecimientos más altos (230%), lo que indica una fuerte migración de votos desde otros candidatos.</li>
        </ul>

        <h4 className="text-lg font-semibold text-slate-700 mt-4">Interpretación del Crecimiento:</h4>
        <p className="text-slate-600 mb-2">El extraordinario crecimiento de la votación de Petro (promedio de 206% en la región) sugiere:</p>
        <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
            <li>📌<strong>Transferencia del Voto de Centro:</strong> Gran parte de los votantes del centro político parecen haber migrado hacia Petro en segunda vuelta.</li>
            <li>📌<strong>Polarización Regional:</strong> A pesar del gran crecimiento, los votos de los partidos progresistas se mantuvieron con porcentajes entre 18-27% en segunda vuelta, mientras que los demás se consolidaron entre 66-76% de los votos.</li>
            <li>📌<strong>Efecto Urbano vs. Periférico:</strong> En municipios más alejados del centro metropolitano (como Caldas y Girardota), Petro logró mayores incrementos porcentuales que en el núcleo (Medellín).</li>
        </ul>

        <div className="my-4 text-center">
            <img src="images/petro_share4_amva.png" alt="Variación porcentual de crecimiento de Gustavo Petro" className="mx-auto rounded-lg shadow-sm" />
            <p className="text-sm text-slate-500 mt-2">Figura 4 – Variación porcentual de crecimiento de Gustavo Petro en los municipios del Área Metropolitana del Valle de Aburrá</p>
      </div>

      <p className="text-slate-600 mb-4">
       El análisis revela diferencias territoriales importantes en la dinámica electoral, con comportamientos distintos entre el núcleo urbano y los municipios periféricos.
      </p>

    </div>
  );
};

export default AnalisisAMVA;
