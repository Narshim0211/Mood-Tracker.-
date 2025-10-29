# MoodTrackr – AI-Powered Mood Assistant

A lean, modular full‑stack web app that helps students log moods, detect triggers (AI-powered), get instant suggestions, and view weekly/monthly insights.

## Monorepo layout

- `server/` – Node.js Express API (REST, Swagger docs, Mongo/Mongoose)
- `web/` – React (Vite + Tailwind), Zustand store, lazy‑loaded dashboard

## Quick start (local)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas). Tests do not require a running Mongo; they use an in‑memory server.

### 1) API server
```bash
cd server
cp .env.example .env   # edit values
npm install
npm run dev            # http://localhost:4000
```

Env (.env):
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/moodtrackr
# Optional: to use OpenAI instead of the built‑in mock
# OPENAI_API_KEY=sk-...
```

Swagger docs: `http://localhost:4000/api/docs`

Tests:
```bash
npm test
```

### 2) Web app
```bash
cd web
cp .env.example .env   # edit values
npm install
npm run dev            # http://localhost:5173
```

Env (.env):
```
VITE_API_BASE_URL=http://localhost:4000
```

## Key features
- Mood log page: Emoji grid + 1–10 intensity slider, instant submit
- Trigger detection: AI provider abstraction (OpenAI or mock), JSON responses
- Suggestions: Predefined tips with simple personalization heuristics
- Dashboard: Average mood line chart, weekly/monthly toggle, streak badge, insights
- Web notifications: Optional reminders using the browser Notification API

## Architecture notes
- REST‑only communication between frontend and backend
- AI logic encapsulated in `server/src/services` with provider layer
- Mongo indexes on `mood_logs.date` and `mood_logs.scale`
- Minimal tests for routes and AI service (Jest + Supertest)
- Swagger auto‑docs using `swagger-jsdoc` + `swagger-ui-express`

## Deployment
- Frontend is Vite/SPA and deploys easily to Vercel/Netlify
- Backend is a simple Express service (Render/Railway/Heroku/AWS). Set `MONGODB_URI` and optional `OPENAI_API_KEY`.

## License
MIT
