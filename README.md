# 🚨 Scam Alert

**Scam Alert** es una aplicación web que utiliza inteligencia artificial (OpenAI) para ayudar a las personas a detectar estafas digitales en mensajes sospechosos. El mensaje ademas educa al usuario y lo informa sobre las partes sospechosas del mensaje.

---

## 🧠 Funcionalidades principales

- ✉️ Analiza cualquier mensaje textual (email, SMS, WhatsApp, etc.).
- 🔍 Detecta señales de riesgo: urgencia, enlaces, premios, solicitudes de datos.
- 📊 Muestra un análisis detallado por categorías.
- 🧠 Explicaciones claras y educativas para todos los niveles.

---
 
## 📦 Tecnologías utilizadas

- **Frontend:** React
- **Backend:** Node.js + Express
- **IA:** OpenAI GPT-4o

---

## 📡 API

### POST `/analyze`
Analiza un mensaje e identifica riesgos.

#### Request:
```json
{ "text": "Hola, haz clic aquí para reclamar tu premio." }
```

#### Response:
```json
{
  "analysis": {
    "riskBreakdown": {
      "urgencia": "Medio",
      "premio": "Alto",
      "enlace": "Alto",
      "datos": "Bajo"
    },
    "explanation": "Este mensaje tiene señales de urgencia y promesas sospechosas..."
  }
}
```

## 🛠️ Instalación

### Requisitos:
- Node.js >= 18
- API key de [OpenAI](https://platform.openai.com)

### Clonar el proyecto:
```bash
git clone https://github.com/Erika0926/scam-alert-hackathon
cd scam-alert
```

### Backend
```bash
cd backend
npm install
echo "OPENAI_API_KEY=sk-xxxx" > .env
npm start
```

### Frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🧪 Ideas futuras

- Clasificación por tipo de estafa
- Implementacion por Whatsapp
- Incluir minijuego para reconocer estafas
---

## ✍️ Autor

Desarrollado como proyecto educativo para el Hackathon Universitario Utel 2025.  

---

## 🛡️ Licencia

MIT – uso libre con fines educativos o personales.
