require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔧 Limpia Markdown del texto
function cleanMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^- /gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// 🧠 Endpoint de análisis de mensaje real
app.post('/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'El texto no puede estar vacío.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Eres un experto en ciberseguridad. 
Analiza el siguiente mensaje y devuelve un puntaje de riesgo por categoría en formato JSON con estas claves: urgencia, premio, enlace, datos. 
Cada clave debe tener un valor: "Bajo", "Medio" o "Alto". 
Después del JSON, escribe una explicación breve de cada punto en lenguaje natural.`
        },
        { role: 'user', content: text }
      ],
      max_tokens: 300,
      temperature: 0.2
    });

    const content = completion.choices?.[0]?.message?.content || '';
    let analysis = {};
    try {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        const riskBreakdown = JSON.parse(match[0]);
        const explanation = cleanMarkdown(content.replace(match[0], '').trim());
        analysis = { riskBreakdown, explanation };
      } else {
        analysis = { explanation: cleanMarkdown(content.trim()) };
      }
    } catch (err) {
      analysis = { explanation: cleanMarkdown(content.trim()) };
    }

    res.json({ analysis });

  } catch (error) {
    console.error('Error al usar OpenAI:', error);
    res.status(500).json({ error: 'Error al analizar el mensaje con inteligencia artificial.' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`scam-alert API corriendo en http://localhost:${PORT}`);
});
