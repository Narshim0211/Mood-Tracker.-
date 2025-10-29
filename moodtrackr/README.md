## MoodTrackr – AI-Powered Mood Assistant

Lean, modular MERN-style web app to help students log moods, detect triggers (mock AI), get instant suggestions, and view weekly/monthly insights.

### Quick Start

Prereqs: Node.js 18+

1) Backend

```bash
cd backend
cp .env.example .env  # optional; set MONGODB_URI to enable Mongo
npm install
npm run dev
# API: http://localhost:4000/api/health
# Swagger: http://localhost:4000/docs
```

2) Frontend

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

The frontend dev server proxies `/api` and `/docs` to the backend.

### Tech
- Backend: Express, Swagger, Joi validation, Memory store (with optional Mongo store)
- Frontend: React + Vite + TypeScript, Tailwind, Zustand, Chart.js
- AI Layer: Heuristic mock service (`src/services/aiTriggerService.js`)

### API (Routes)
- `POST /api/mood`: Log mood; returns inferred triggers + suggestion
- `GET /api/mood?range=week|month|all`: Fetch logs
- `POST /api/triggers/detect`: Get triggers for a log (no write)
- `GET /api/insights/summary?range=week|month`: Average, streak, and time series
- Swagger docs: `/docs`

### Data Model

```json
{
  "id": "String",
  "mood_logs": [
    { "date": "Date", "emoji": "String", "scale": 1, "triggers": ["String"], "tip": "String" }
  ],
  "insights": {}
}
```

Mongo indexes are defined on `date` and `scale` inside the Mongoose schema.

### Notes
- Notifications are web-only and require user permission. In this MVP, reminders trigger while the tab is open.
- AI calls are mocked; swap logic in `src/services/aiTriggerService.js` for a hosted model if desired.
- Code-splitting: dashboard chart is lazy loaded.

### Tests

```bash
cd backend
npm test
```

### Deploy
- Backend: Render/Heroku/AWS, set `PORT` and optional `MONGODB_URI`
- Frontend: Vercel/Netlify (set backend URL and adjust Vite proxy or use env)
