import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post('http://localhost:4000/analyze', {
        text: inputText
      });
      setResult(res.data.analysis);
    } catch (error) {
      setResult({ explanation: 'Hubo un error al analizar el texto. Intenta más tarde.' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatExplanation = (text) => {
    return text
      .replace(/(urgencia.*?"\.)/gi, '\n\n$1')
      .replace(/(premio.*?"\.)/gi, '\n\n$1')
      .replace(/(enlace.*?"\.)/gi, '\n\n$1')
      .replace(/(datos.*?"\.)/gi, '\n\n$1');
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

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Resultado del análisis:</h2>

          {result.riskBreakdown && (
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
                      <td className={`p-2 border font-semibold ${
                        value === 'Alto' ? 'text-red-600' :
                        value === 'Medio' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-gray-800 whitespace-pre-wrap">
            {formatExplanation(result.explanation)}
          </p>
        </div>
      )}
    </div>
  );
}
