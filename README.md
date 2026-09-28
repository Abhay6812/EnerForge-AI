# EnerForge AI

EnerForge AI is a factory intelligence dashboard for energy monitoring, predictive maintenance, and production optimization. The project contains a Vite + React frontend and a FastAPI backend that loads trained ML models for industrial analytics.

## Project structure

- `src/` — React frontend dashboard and analytics UI
- `backend/` — FastAPI application and model-serving endpoints
- `data/` — training datasets and serialized ML models
- `dist/` — production frontend build output

## Local development

1. Install frontend dependencies:
   npm install
2. Start the frontend:
   npm run dev
3. Start the backend:
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
4. Set the frontend API URL for local development in a `.env` file:
   VITE_API_URL=http://127.0.0.1:8000

## Production deployment

### Frontend on Vercel

- Import the repository into Vercel.
- Set the build command to `npm run build`.
- Set the output directory to `dist`.
- Add the environment variable:
  `VITE_API_URL=https://your-backend-url` 

### Backend on Render / Railway / another Python host

- Deploy the repository or the backend folder as a Python service.
- Install dependencies from `backend/requirements.txt`.
- Start the app with:
  `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Add CORS origins if your frontend is hosted elsewhere:
  `BACKEND_CORS_ORIGINS=https://your-frontend-url`

## Key deployment notes

- The frontend must not hardcode localhost URLs in production. It reads `VITE_API_URL` from environment variables.
- The backend allows CORS via `BACKEND_CORS_ORIGINS` and defaults to local Vite ports for development.
- The build has been validated for the frontend and the Python app syntax is valid.

## Main API endpoints

- `GET /` — health check
- `POST /predict-energy` — energy anomaly detection
- `POST /predict-machine-health` — machine failure risk analysis
- `POST /predict-production-energy` — production energy estimation
- `POST /optimize-production` — energy optimization recommendations
