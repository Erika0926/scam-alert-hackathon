import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

// Extrae y separa las secciones explicativas
const parseExplicacion = (texto) => {
  return texto
    .split('•')
    .map((linea) => linea.trim())
    .filter((linea) => linea.includes(':'))
    .map((linea) => {
      const [titulo, ...detallePartes] = linea.split(':');
      return {
        titulo: titulo.trim(),
        detalle: detallePartes.join(':').trim(),
      };
    });
};

export default function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [error, setError] = useState('');

  const analyzeText = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await axios.post('http://localhost:4000/analyze', {
        text: inputText,
      });

      if (!res.data.analysis || res.data.error) {
        setError('Hubo un error al analizar el texto. Intenta más tarde.');
      } else {
        setResult(res.data.analysis);
      }
    } catch (error) {
      console.error(error);
      setError('Hubo un error al analizar el texto. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🔍 Scam Alert</h1>

      <textarea
        className="w-full p-4 border rounded mb-4 h-40"
        placeholder="Pega aquí el mensaje sospechoso..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <button
        onClick={analyzeText}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Analizando...' : 'Analizar'}
      </button>

      {(result || error) && (
        <div className="mt-6 bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Resultado del análisis:</h2>

          {error && (
            <p className="bg-blue-100 text-blue-800 p-3 rounded">{error}</p>
          )}

          {/* Indicador de riesgo general */}
          {result?.riskBreakdown && !error && (() => {
            const riesgos = Object.values(result.riskBreakdown);
            const riesgosElevados = riesgos.filter(
              (r) => r === 'Medio' || r === 'Alto'
            ).length;

            return (
              <p className={`mt-2 text-lg font-medium ${
                riesgosElevados > 2 ? 'text-red-600' : 'text-green-600'
              }`}>
                {riesgosElevados > 2
                  ? '⚠️ Posible riesgo de fraude'
                  : '✅ El mensaje no parece riesgoso'}
              </p>
            );
          })()}

          {/* Tabla de categorías */}
          {result?.riskBreakdown && !error && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Categorías de riesgo:</h3>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Categoría</th>
                    <th className="p-2 border">Riesgo</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.riskBreakdown).map(([key, value]) => (
                    <tr key={key}>
                      <td className="p-2 border capitalize">{key}</td>
                      <td
                        className={`p-2 border font-semibold ${
                          value === 'Alto'
                            ? 'text-red-600'
                            : value === 'Medio'
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      >
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Explicación general + botones desplegables */}
          {result?.explanation && !error && (() => {
            const secciones = parseExplicacion(result.explanation);
            const explicacion = secciones.find((s) => s.titulo.toLowerCase() === 'explicación');
            const detalles = secciones.filter((s) => s.titulo.toLowerCase() !== 'explicación');

            return (
              <div className="space-y-2">
                {explicacion && (
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-1">Explicación</h3>
                  </div>
                )}
                {detalles
                .filter((item) => item.titulo && item.detalle) // 👈 solo si ambos existen
                .map((item, index) => (
                    <div key={index}>
                    <button
                        onClick={() =>
                        setCategoriaActiva(categoriaActiva === index ? null : index)
                        }
                        className="w-full text-left bg-blue-100 text-blue-800 px-4 py-2 rounded shadow hover:bg-blue-200 transition font-semibold"
                    >
                        {item.titulo}
                    </button>
                    {categoriaActiva === index && (
                        <div className="mt-2 p-3 bg-white border rounded shadow text-gray-800">
                        {item.detalle}
                        </div>
                    )}
                    </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
