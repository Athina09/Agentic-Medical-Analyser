# Agentic Medical Analyser

AI-powered medical triage and diagnostic system with patient intake, risk assessment, department routing, and explainability.

## Running the App

### 1. Backend (from Pragyan root)

```bash
cd /Users/apple/Pragyan
python main_combined.py
```

Backend runs on **http://localhost:8010** (or 8011–8015 if 8010 is busy). Requires:
- Python 3.x, FastAPI, uvicorn
- GROQ_API_KEY in `.env` for chat/explain features
- Optional: `models/triage_model.pkl` and `models/encoders.pkl` for ML triage

### 2. Frontend

```bash
cd Agentic-Medical-Analyser
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** (or 8080+).

### 3. API URL

By default the frontend uses `http://localhost:8010`. Override with:

```bash
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:8010
```

## Features

- **Patient Intake** – Multi-step form; calls `/triage` and `/predict` for risk + department
- **Triage Results** – Risk level, department, confidence, recommendations
- **AI Assistant** – Chat uses backend `/chat` (Groq); falls back to local responses if offline
- **AI Explainability** – Calls `/explain` for prediction rationale
- **Nearby Hospitals** – “Use my location” calls `/nearest-hospital` (Overpass API)
